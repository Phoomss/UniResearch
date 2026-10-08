import json
import os
import platform
import secrets
import shutil
import socket
import sqlite3
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx
import pytest
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.service import Service

from .support import PDF, PNG, Evidence, Pages

REPO = Path(__file__).resolve().parents[2]
NARONGSAK = {1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 38, 43, 46, 47, 48}
RESULTS = {}


def pytest_addoption(parser):
    parser.addoption("--headed", action="store_true", help="Show the Chrome browser")
    parser.addoption("--artifacts", default=str(Path(__file__).parent / "artifacts"))


def pytest_configure(config):
    RESULTS.clear()
    if hasattr(config, "workerinput"):
        raise pytest.UsageError(
            "Run serially: these tests reset their private database per case."
        )
    config.artifact_dir = Path(
        config.getoption("--artifacts")
    ).resolve() / datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
    config.artifact_dir.mkdir(parents=True, exist_ok=True)
    config.case_catalog = {
        row["case"]: row
        for row in json.loads((Path(__file__).parent / "cases.json").read_text())
    }


def pytest_collection_modifyitems(items):
    for item in items:
        case = int(item.name.split("_")[2])
        if "page" in item.fixturenames:
            item.add_marker(pytest.mark.ui)
        if case in NARONGSAK:
            item.add_marker(pytest.mark.narongsak)


def port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def start(command, cwd, env, url, logfile):
    log = logfile.open("w")
    proc = subprocess.Popen(
        command, cwd=cwd, env=env, stdout=log, stderr=subprocess.STDOUT
    )
    try:
        with httpx.Client(trust_env=False, timeout=2) as client:
            deadline = time.monotonic() + 90
            while time.monotonic() < deadline:
                if proc.poll() is not None:
                    raise RuntimeError(f"Service exited; see {logfile}")
                try:
                    if client.get(url).status_code == 200:
                        return proc, log
                except httpx.HTTPError:
                    pass
                time.sleep(0.25)
        raise RuntimeError(f"Service did not become ready; see {logfile}")
    except BaseException:
        stop(proc, log)
        raise


def stop(proc, log):
    if proc.poll() is None:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait()
    log.close()


@pytest.fixture(scope="session")
def app_environment(pytestconfig):
    # No external URL/database override: reset is confined to this directory.
    with tempfile.TemporaryDirectory(prefix="uniresearch-selenium-") as directory:
        root = Path(directory)
        backend = f"http://127.0.0.1:{port()}"
        frontend = f"http://127.0.0.1:{port()}"
        env = {
            **os.environ,
            "UNIRESEARCH_TEST_ROOT": str(root),
            "PYTHONPATH": os.pathsep.join(
                [str(REPO / "backend"), str(REPO / "tests" / "selenium")]
            ),
            "BACKEND_API_URL": backend,
            "BACKEND_URL": backend,
            "NEXT_TELEMETRY_DISABLED": "1",
        }
        proc, log = start(
            [
                sys.executable,
                "-m",
                "uvicorn",
                "server:app",
                "--host",
                "127.0.0.1",
                "--port",
                backend.rsplit(":", 1)[1],
            ],
            root,
            env,
            backend + "/health",
            pytestconfig.artifact_dir / "backend.log",
        )
        password = secrets.token_urlsafe(18)
        # Hash without importing application config into pytest or reading .env.
        from passlib.context import CryptContext

        hashed = CryptContext(schemes=["bcrypt"]).hash(password)
        try:
            yield root, backend, frontend, env, password, hashed
        finally:
            stop(proc, log)


@pytest.fixture(scope="session")
def frontend_server(app_environment, pytestconfig):
    _, _, frontend, env, _, _ = app_environment
    binary = REPO / "frontend" / "node_modules" / ".bin" / "next"
    if not binary.exists():
        pytest.fail(
            "Install frontend dependencies before running UI tests: cd frontend && pnpm install"
        )
    proc, log = start(
        [
            str(binary),
            "dev",
            "--webpack",
            "--hostname",
            "127.0.0.1",
            "--port",
            frontend.rsplit(":", 1)[1],
        ],
        REPO / "frontend",
        env,
        frontend + "/login",
        pytestconfig.artifact_dir / "frontend.log",
    )
    try:
        yield frontend
    finally:
        stop(proc, log)


@pytest.fixture
def e(app_environment, request):
    root, backend, frontend, _, password, hashed = app_environment
    static = root / "static"
    shutil.rmtree(static, ignore_errors=True)
    static.mkdir()
    (static / "fixture.pdf").write_bytes(PDF)
    (static / "fixture.png").write_bytes(PNG)
    with sqlite3.connect(root / "test.db") as db:
        # The schema is created by the actual backend's lifespan.
        for table in [
            "download_view_logs",
            "search_logs",
            "favorites",
            "notifications",
            "file_revisions",
            "review_comments",
            "research_authors",
            "research_advisors",
            "research_works",
            "departments",
            "work_types",
            "categories",
            "users",
        ]:
            db.execute(f"DELETE FROM {table}")
        for uid, key, role, sid, active in [
            (1, "A1", "admin", None, 1),
            (2, "S1", "student", "64001", 1),
            (3, "S2", "student", "64002", 1),
            (4, "S3", "student", "65003", 1),
            (5, "D1", "advisor", None, 1),
            (6, "D2", "advisor", None, 1),
            (7, "G1", "guest", None, 1),
            (8, "U2", "student", "64004", 0),
        ]:
            db.execute(
                "INSERT INTO users(id,email,hashed_password,role,student_id,first_name,last_name,department,is_active) VALUES(?,?,?,?,?,?,?,?,?)",
                (
                    uid,
                    f"{key.lower()}@example.org",
                    hashed,
                    role,
                    sid,
                    key,
                    "Selenium",
                    "วิทยาการคอมพิวเตอร์",
                    active,
                ),
            )
        db.executemany(
            "INSERT INTO categories(id,category_name,description) VALUES(?,?,?)",
            [(1, "C1 Selenium", "test"), (2, "C2 Selenium", "test")],
        )
        db.execute("INSERT INTO departments(name) VALUES('วิทยาการคอมพิวเตอร์')")
        db.execute("INSERT INTO work_types(name) VALUES('วิทยานิพนธ์')")
        for wid, status, owner, category, views, published, keywords in [
            (1, "approved", 2, 1, 20, "2026-10-01 00:00:00", "publickeyword,research"),
            (2, "pending", 2, 1, 0, None, "pendingsecret"),
            (3, "pending", 3, 2, 0, None, "otherpending"),
            (4, "approved", 3, 2, 40, "2026-10-02 00:00:00", "publickeyword,selenium"),
            (5, "approved", 3, 1, 10, "2026-09-30 00:00:00", "research"),
        ]:
            db.execute(
                """INSERT INTO research_works(id,title_th,title_en,abstract,category_id,department,work_type,
                academic_year,keywords,cover_image_path,file_path,status,view_count,download_count,published_at,
                created_at,updated_at,submitted_by_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    wid,
                    f"W{wid} งานวิจัย Selenium",
                    f"W{wid} Research",
                    "research selenium abstract",
                    category,
                    "วิทยาการคอมพิวเตอร์",
                    "วิทยานิพนธ์",
                    2569,
                    keywords,
                    "static/fixture.png",
                    "static/fixture.pdf" if wid != 5 else None,
                    status,
                    views,
                    0,
                    published,
                    "2026-10-01 00:00:00",
                    "2026-10-01 00:00:00",
                    owner,
                ),
            )
            db.execute(
                "INSERT INTO research_authors(research_id,user_id,role_in_work) VALUES(?,?,?)",
                (wid, owner, "primary"),
            )
            db.execute(
                "INSERT INTO research_advisors(research_id,user_id) VALUES(?,?)",
                (wid, 6 if wid == 3 else 5),
            )
        db.execute(
            "INSERT INTO research_authors(research_id,user_id,role_in_work) VALUES(4,2,'co-author')"
        )
        for nid, uid in [(1, 2), (2, 3)]:
            db.execute(
                "INSERT INTO notifications(id,user_id,title,message,type,is_read,created_at) VALUES(?,?,?,?,?,?,?)",
                (
                    nid,
                    uid,
                    f"N{nid} Selenium",
                    f"N{nid} private notification",
                    "info",
                    0,
                    "2026-10-01 00:00:00",
                ),
            )
    evidence = Evidence(root, backend, frontend, password)
    request.node.evidence = evidence
    try:
        yield evidence
    finally:
        evidence.http.close()


@pytest.fixture
def page(e, frontend_server, pytestconfig, request):
    options = webdriver.ChromeOptions()
    chrome_binary = os.environ.get("SELENIUM_CHROME_BINARY")
    if chrome_binary:
        options.binary_location = chrome_binary
    if os.environ.get("SELENIUM_CONTAINER") == "1":
        options.add_argument("--no-sandbox")
    if not pytestconfig.getoption("--headed"):
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1000")
    options.add_experimental_option(
        "prefs",
        {
            "download.default_directory": str(e.root / "downloads"),
            "download.prompt_for_download": False,
            "plugins.always_open_pdf_externally": True,
        },
    )
    driver_path = os.environ.get("SELENIUM_CHROMEDRIVER")
    service = Service(executable_path=driver_path) if driver_path else Service()
    driver = webdriver.Chrome(service=service, options=options)
    request.node.browser = driver
    try:
        yield Pages(driver, e)
    finally:
        request.node.browser = None
        driver.quit()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    report = (yield).get_result()
    case = "TC-" + item.name.split("_")[2]
    record = RESULTS.setdefault(
        case, {"case": case, "test": item.name, "status": "not_run", "events": []}
    )
    record.update(item.config.case_catalog[case])
    if report.failed:
        record["status"] = "failed" if report.when == "call" else "blocked"
        # Tracebacks can contain sensitive values; keep them in pytest's terminal only.
        record["reason"] = f"{report.when} failed; see pytest terminal output"
        if call.excinfo:
            record["exception"] = call.excinfo.type.__name__
    elif report.skipped:
        record.update(
            status="skipped",
            reason=str(report.longrepr[-1])
            if isinstance(report.longrepr, tuple)
            else "skipped",
        )
    elif report.when == "call":
        record["status"] = "passed"
    evidence = getattr(item, "evidence", None)
    if evidence:
        record["events"] = evidence.events
    browser = getattr(item, "browser", None)
    if browser and report.when == "call":
        try:
            path = item.config.artifact_dir / f"{case}.png"
            browser.save_screenshot(str(path))
            record.update(
                screenshot=path.name,
                url=browser.current_url,
                browser=browser.capabilities.get("browserVersion"),
            )
            if report.failed:
                record["visible_buttons"] = [
                    el.text
                    for el in browser.find_elements("css selector", "button")
                    if el.is_displayed()
                ]
        except (WebDriverException, OSError):
            record["screenshot"] = "capture unavailable"


def pytest_sessionfinish(session, exitstatus):
    directory = session.config.artifact_dir
    commit = os.environ.get("UNIRESEARCH_TEST_COMMIT", "unknown")
    try:
        commit = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=REPO, text=True
        ).strip()
    except (subprocess.SubprocessError, OSError):
        pass
    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "commit": commit,
        "os": platform.platform(),
        "database": "disposable SQLite; PostgreSQL/pgvector not certified",
        "ai": "deterministic test double; text retrieval fallback",
        "exit_code": int(exitstatus),
        "cases": sorted(RESULTS.values(), key=lambda x: x["case"]),
    }
    (directory / "results.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2)
    )
    lines = [
        "# Selenium execution report",
        "",
        f"Commit: `{commit}` (working tree included)",
        "",
        "Database: disposable SQLite. This run does not certify PostgreSQL/pgvector or a live AI provider.",
        "",
        "| Case | Requirement | Result | Evidence |",
        "|---|---|---|---|",
    ]
    for r in summary["cases"]:
        evidence = (
            f"[{r['screenshot']}]({r['screenshot']})"
            if r.get("screenshot", "").endswith(".png")
            else r.get("reason", "API/database assertions")
        )
        lines.append(
            f"| {r['case']} | {r['requirement']} | {r['status']} | {evidence} |"
        )
    (directory / "report.md").write_text("\n".join(lines) + "\n")


def pytest_terminal_summary(terminalreporter, exitstatus, config):
    terminalreporter.write_line(f"Selenium evidence: {config.artifact_dir}")
