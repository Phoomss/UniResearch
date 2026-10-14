import json
import os
import platform
import secrets
import shutil
import signal
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

from .support import PDF, PNG, Evidence
from .ui_runtime import BrowserEvidence, BrowserSettings, account_email

REPO = Path(__file__).resolve().parents[2]
NARONGSAK = {1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 38, 43, 46, 47, 48}
RESULTS = {}


def pytest_addoption(parser):
    parser.addoption(
        "--include-legacy",
        action="store_true",
        help="Also collect untouched teammates cases",
    )
    modes = parser.getgroup("browser modes")
    modes.addoption("--headed", action="store_true", help="Show Chrome (local default)")
    modes.addoption("--headless", action="store_true", help="Hide Chrome for CI")
    parser.addoption("--artifacts", default=str(Path(__file__).parent / "artifacts"))


def pytest_configure(config):
    RESULTS.clear()
    if config.getoption("--headed") and config.getoption("--headless"):
        raise pytest.UsageError("Choose --headed or --headless")
    config.browser_settings = BrowserSettings.from_environment(config, REPO)
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


def pytest_collection_modifyitems(config, items):
    selected, deselected = [], []
    for item in items:
        case = int(item.name.split("_")[2])
        if case in NARONGSAK:
            item.add_marker(pytest.mark.narongsak)
        if any(
            name in item.fixturenames
            for name in ("page", "options_page", "document_page", "ai_review_page")
        ):
            item.add_marker(pytest.mark.ui)
        if case in NARONGSAK or config.getoption("--include-legacy"):
            selected.append(item)
        else:
            deselected.append(item)
    items[:] = selected
    config.hook.pytest_deselected(items=deselected)
    for item in selected:
        case = "TC-" + item.name.split("_")[2]
        RESULTS.setdefault(
            case, {"case": case, "test": item.name, "status": "not_run", "events": []}
        )


CATEGORY_IDS = {
    "auth": [1, 4, 7],
    "category": [10],
    "user": [13],
    "recommendation": [16],
    "submission": [19, 22, 25, 28, 31, 34],
    "review": [37, 38],
    "notification": [43],
    "ai": [46],
    "e2e": [47, 48],
}
CASE_CATEGORY = {
    f"TC-{case:03}": category
    for category, cases in CATEGORY_IDS.items()
    for case in cases
}
EXPECTED = {
    "TC-001": "สมัครสำเร็จโดยได้สิทธิ์ student แม้ส่ง role admin",
    "TC-004": "แสดงข้อผิดพลาดและไม่สร้าง session",
    "TC-007": "ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง",
    "TC-010": "อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ",
    "TC-013": "student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน",
    "TC-016": "คำแนะนำไม่เผยข้อมูล pending",
    "TC-019": "แสดงไม่พบงานวิจัยและ API ตอบ 404",
    "TC-022": "บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending",
    "TC-025": "UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422",
    "TC-028": "เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น",
    "TC-031": "ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending",
    "TC-034": "ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง",
    "TC-037": "ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ",
    "TC-038": "ที่ปรึกษาที่ได้รับมอบหมายอนุมัติและบันทึกผลสำเร็จ",
    "TC-043": "เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน",
    "TC-046": "ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous",
    "TC-047": "ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ",
    "TC-048": "admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ",
}


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
            # First Next.js compilation is slower under amd64 emulation.
            startup_timeout = float(os.environ.get("SELENIUM_STARTUP_TIMEOUT", "90"))
            deadline = time.monotonic() + startup_timeout
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
        frontend = (
            pytestconfig.browser_settings.base_url or f"http://127.0.0.1:{port()}"
        )
        if pytestconfig.browser_settings.base_url:
            with socket.socket() as probe:
                try:
                    probe.bind(("127.0.0.1", int(frontend.rsplit(":", 1)[1])))
                except OSError as exc:
                    raise pytest.UsageError(
                        "BASE_URL port is already occupied; this runner refuses to attach to an existing application"
                    ) from exc
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
        password = os.environ.get("TEST_PASSWORD") or secrets.token_urlsafe(18)
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
    shutil.rmtree(root / "downloads", ignore_errors=True)
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
                    account_email(key),
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
    evidence.artifact_dir = request.config.artifact_dir
    evidence.timeout = request.config.browser_settings.timeout
    request.node.evidence = evidence
    try:
        yield evidence
    finally:
        evidence.http.close()


@pytest.fixture
def page(e, frontend_server, pytestconfig, request):
    options = webdriver.ChromeOptions()
    settings = pytestconfig.browser_settings
    chrome_binary = os.environ.get("SELENIUM_CHROME_BINARY")
    if settings.browser == "brave" and not chrome_binary:
        pytest.fail("BROWSER=brave requires SELENIUM_CHROME_BINARY")
    if chrome_binary:
        options.binary_location = chrome_binary
    if os.environ.get("SELENIUM_CONTAINER") == "1":
        options.add_argument("--no-sandbox")
    if settings.headless:
        options.add_argument("--headless=new")
    options.add_argument(f"--window-size={settings.width},{settings.height}")
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_experimental_option(
        "prefs",
        {
            "download.default_directory": str(e.root / "downloads"),
            "download.prompt_for_download": False,
            "plugins.always_open_pdf_externally": True,
        },
    )
    driver_path = os.environ.get("SELENIUM_CHROMEDRIVER")
    container = os.environ.get("SELENIUM_CONTAINER") == "1"
    service = Service(
        **({"executable_path": driver_path} if driver_path else {}),
        popen_kw={"start_new_session": True} if container else {},
    )
    driver = None
    process_group = None
    try:
        driver = webdriver.Chrome(service=service, options=options)
        if container:
            process_group = service.process.pid
        request.node.browser = driver
        case = "TC-" + request.node.name.split("_")[2]
        e.browser_evidence = BrowserEvidence(
            driver,
            e,
            settings.screenshots
            / CASE_CATEGORY.get(case, "legacy")
            / case
            / pytestconfig.artifact_dir.name,
            REPO,
        )
        record = RESULTS[case]
        record.update(
            browser=driver.capabilities.get("browserVersion"),
            browser_name=settings.browser,
            mode="headless" if settings.headless else "headed",
        )
        from .pages import UIPage

        yield UIPage(driver, e)
    finally:
        request.node.browser = None
        # Under Docker's amd64 emulation Brave can outlive WebDriver's quit.
        # Its own process group confines cleanup to this case's browser.
        if container and process_group is None and getattr(service, "process", None):
            process_group = service.process.pid
        try:
            if driver:
                driver.quit()
            else:
                service.stop()
        finally:
            if process_group is not None:
                try:
                    os.killpg(process_group, signal.SIGKILL)
                except ProcessLookupError:
                    pass


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    report = (yield).get_result()
    case = "TC-" + item.name.split("_")[2]
    record = RESULTS.setdefault(
        case, {"case": case, "test": item.name, "status": "not_run", "events": []}
    )
    record.update(item.config.case_catalog[case])
    record["duration_seconds"] = record.get("duration_seconds", 0) + report.duration
    if report.failed:
        record["status"] = "failed" if report.when == "call" else "blocked"
        # Tracebacks can contain sensitive values; keep them in pytest's terminal only.
        record["reason"] = f"{report.when} failed; see pytest terminal output"
        if call.excinfo:
            record["exception"] = call.excinfo.type.__name__
            message = str(call.excinfo.value)
            evidence_for_redaction = getattr(item, "evidence", None)
            if evidence_for_redaction:
                for secret in [
                    evidence_for_redaction.password,
                    *evidence_for_redaction.tokens.values(),
                ]:
                    message = message.replace(secret, "[REDACTED]")
            record.setdefault("errors", []).append(
                {
                    "phase": report.when,
                    "message": message,
                    "exception": call.excinfo.type.__name__,
                }
            )
            with (item.config.artifact_dir / "errors.log").open("a") as log:
                log.write(
                    f"{case} {report.when}: {call.excinfo.type.__name__}: {message}\n"
                )
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
        recorder = getattr(evidence, "browser_evidence", None)
        if recorder:
            record.update(
                steps=recorder.steps,
                screenshot_paths=recorder.screenshots,
                screenshot_errors=recorder.capture_errors,
            )
    browser = getattr(item, "browser", None)
    if browser and (report.when == "call" or report.failed):
        try:
            if evidence and getattr(evidence, "browser_evidence", None):
                evidence.browser_evidence.capture(
                    "failure-" + report.when if report.failed else "final-result"
                )
            path = item.config.artifact_dir / f"{case}.png"
            browser.save_screenshot(str(path))
            record.update(
                screenshot=path.name,
                url=browser.current_url,
                browser=browser.capabilities.get("browserVersion"),
                browser_name=item.config.browser_settings.browser,
                browser_binary=os.environ.get("SELENIUM_CHROME_BINARY", "auto"),
                driver_version=browser.capabilities.get("chrome", {}).get(
                    "chromedriverVersion"
                ),
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
    binary = os.environ.get("SELENIUM_CHROME_BINARY")
    browser_release = "auto"
    if binary:
        try:
            browser_release = subprocess.check_output(
                [binary, "--version"], text=True, timeout=10
            ).strip()
        except (subprocess.SubprocessError, OSError):
            browser_release = "unavailable"
    commit = os.environ.get("UNIRESEARCH_TEST_COMMIT", "unknown")
    try:
        commit = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=REPO, text=True
        ).strip()
    except (subprocess.SubprocessError, OSError):
        pass
    for case, category in CASE_CATEGORY.items():
        record = RESULTS.setdefault(
            case, {"case": case, "status": "not_run", "events": []}
        )
        record.update(session.config.case_catalog[case])
        record["category"] = category
        record["expected_result"] = EXPECTED[case]
        record["actual_result"] = {
            "passed": "ขั้นตอนและ assertions ผ่านทั้งหมด",
            "failed": "ขั้นตอนหรือ assertion ล้มเหลว",
            "blocked": "setup/cleanup ล้มเหลว",
            "skipped": "ไม่สามารถรันได้",
            "not_run": "ไม่ได้รัน",
        }[record["status"]]
    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "commit": commit,
        "os": platform.platform(),
        "browser_name": os.environ.get("SELENIUM_BROWSER_NAME", "Chrome"),
        "browser_binary": os.environ.get("SELENIUM_CHROME_BINARY", "auto"),
        "browser_release": browser_release,
        "database": "disposable SQLite; PostgreSQL/pgvector not certified",
        "ai": "deterministic test double; text retrieval fallback",
        "exit_code": int(exitstatus),
        "cases": sorted(RESULTS.values(), key=lambda x: x["case"]),
    }
    (directory / "results.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2)
    )
    statuses = {
        "passed": "PASS",
        "failed": "FAIL",
        "blocked": "BLOCKED",
        "skipped": "BLOCKED",
        "not_run": "NOT RUN",
    }
    lines = [
        "# รายงานการทดสอบ Narongsak ด้วย Selenium",
        "",
        f"เวลารัน UTC: {summary['generated_at']}",
        f"Commit: `{commit}` (รวมการแก้ไขใน working tree)",
        f"เบราว์เซอร์: {summary['browser_name']} / {browser_release}",
        "",
        "ใช้ฐานข้อมูล SQLite และไฟล์ชั่วคราว; AI เป็น deterministic mock ไม่ยืนยันคุณภาพผู้ให้บริการจริงหรือ PostgreSQL/pgvector",
        "ผล PASS ในเอกสารเดิมเป็นประวัติเท่านั้น ไม่ใช้แทนผลการรันครั้งนี้",
        "",
        "| Test Case ID | หมวดหมู่ | สถานการณ์ | ผลที่คาดหวัง | ผลจริง | สถานะ | หลักฐาน |",
        "|---|---|---|---|---|---|---|",
    ]
    for case in sorted(CASE_CATEGORY):
        r = RESULTS.get(case, {"case": case, "status": "not_run"})
        catalog = session.config.case_catalog[case]
        status = statuses[r["status"]]
        actual = {
            "PASS": "ขั้นตอนและ assertions ผ่านทั้งหมด",
            "FAIL": "assertion หรือขั้นตอน UI ล้มเหลว",
            "BLOCKED": "ไม่สามารถดำเนินการได้",
            "NOT RUN": "ไม่ได้รันในครั้งนี้",
        }[status]
        if r.get("exception"):
            actual += " (" + r["exception"] + ")"
        evidence = (
            f"[{r['screenshot']}]({r['screenshot']})"
            if r.get("screenshot", "").endswith(".png")
            else "—"
        )
        if status in {"FAIL", "BLOCKED"}:
            evidence += " / [error log](errors.log) / [backend](backend.log) / [frontend](frontend.log)"
        lines.append(
            f"| {case} | {CASE_CATEGORY[case].upper()} | {catalog['title']} | {EXPECTED[case]} | {actual} | {status} | {evidence} |"
        )
    (directory / "report.md").write_text("\n".join(lines) + "\n")
    from .ui_reporting import write_ui_report

    write_ui_report(session.config, summary, REPO, CASE_CATEGORY)


def pytest_terminal_summary(terminalreporter, exitstatus, config):
    terminalreporter.write_line(f"Selenium evidence: {config.artifact_dir}")


@pytest.fixture
def session_page(page):
    from .pages import SessionPage

    return SessionPage(page.driver, page.e)


@pytest.fixture
def options_page(page):
    from .pages import OptionsPage

    return OptionsPage(page.driver, page.e)


@pytest.fixture
def document_page(page):
    from .pages import DocumentPage

    return DocumentPage(page.driver, page.e)


@pytest.fixture
def ai_review_page(page):
    from .pages import AIReviewPage

    return AIReviewPage(page.driver, page.e)


@pytest.fixture
def registration_page(page):
    from .pages import RegistrationPage

    return RegistrationPage(page.driver, page.e)


@pytest.fixture
def submission_page(page):
    from .pages import SubmissionPage

    return SubmissionPage(page.driver, page.e)


@pytest.fixture
def review_page(page):
    from .pages import ReviewPage

    return ReviewPage(page.driver, page.e)
