"""Configuration and browser-only execution evidence for the existing suite."""

import os
import re
import time
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import pytest
from selenium.common.exceptions import WebDriverException


@dataclass(frozen=True)
class BrowserSettings:
    browser: str
    headless: bool
    width: int
    height: int
    timeout: float
    base_url: str | None
    screenshots: Path

    @classmethod
    def from_environment(cls, config, repo):
        browser = os.getenv("BROWSER", "chrome").lower()
        if browser not in {"chrome", "brave"}:
            raise pytest.UsageError(
                "BROWSER must be chrome or brave (Chromium WebDriver)"
            )
        value = os.getenv(
            "HEADLESS",
            "true"
            if os.getenv("CI") or os.getenv("SELENIUM_CONTAINER") == "1"
            else "false",
        ).lower()
        if value not in {"true", "false", "1", "0"}:
            raise pytest.UsageError("HEADLESS must be true/false or 1/0")
        headless = value in {"true", "1"}
        if config.getoption("--headed"):
            headless = False
        elif config.getoption("--headless"):
            headless = True
        try:
            width, height = map(
                int, os.getenv("BROWSER_WINDOW_SIZE", "1440,1000").split(",")
            )
            timeout = float(os.getenv("SELENIUM_TIMEOUT", "30"))
            if width <= 0 or height <= 0 or timeout <= 0:
                raise ValueError
        except ValueError as exc:
            raise pytest.UsageError(
                "Use positive BROWSER_WINDOW_SIZE=width,height and SELENIUM_TIMEOUT=seconds"
            ) from exc
        base_url = os.getenv("BASE_URL") or None
        if base_url:
            parsed = urlparse(base_url)
            try:
                configured_port = parsed.port
            except ValueError as exc:
                raise pytest.UsageError("BASE_URL has an invalid port") from exc
            # This suite seeds a private backend. A configurable URL reserves the
            # local frontend origin; it never connects write tests to external data.
            if (
                parsed.scheme != "http"
                or parsed.hostname not in {"127.0.0.1", "localhost"}
                or not configured_port
                or parsed.path not in {"", "/"}
                or parsed.query
                or parsed.fragment
                or parsed.username
                or parsed.password
            ):
                raise pytest.UsageError(
                    "BASE_URL must be a local test origin, e.g. http://127.0.0.1:3100; external environments are not seeded by this runner"
                )
            base_url = base_url.rstrip("/")
        return cls(
            browser,
            headless,
            width,
            height,
            timeout,
            base_url,
            Path(
                os.getenv(
                    "SCREENSHOTS_DIR", str(repo / "tests/selenium/reports/screenshots")
                )
            ).resolve(),
        )


def account_email(role="S1"):
    alias = {"S1": "STUDENT", "A1": "ADMIN", "D1": "ADVISOR"}.get(role, role)
    return (
        os.getenv(f"TEST_{role}_EMAIL")
        or os.getenv(f"TEST_{alias}_EMAIL")
        or f"{role.lower()}@example.org"
    )


class BrowserEvidence:
    def __init__(self, driver, evidence, directory, repo):
        self.driver, self.e = driver, evidence
        self.directory, self.repo = directory, repo
        self.steps, self.screenshots, self.capture_errors = [], [], []
        self.sequence = 0

    def capture(self, label):
        self.sequence += 1
        slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", label).strip("-")[:70] or "ui"
        path = self.directory / f"{self.sequence:03}-{slug}.png"
        try:
            self.directory.mkdir(parents=True, exist_ok=True)
            if not self.driver.save_screenshot(str(path)):
                raise OSError("WebDriver did not save screenshot")
            self.screenshots.append(str(path))
            return str(path)
        except (WebDriverException, OSError) as exc:
            self.capture_errors.append({"label": label, "error": type(exc).__name__})
            return None

    @contextmanager
    def step(self, action, target, screenshot=False):
        started = time.perf_counter()
        record = {
            "action": action,
            "target": target,
            "started_at": datetime.now(timezone.utc).isoformat(),
        }
        self.steps.append(record)
        try:
            yield
            record["status"] = "PASS"
        except Exception as exc:
            record.update(status="FAIL", error=type(exc).__name__)
            raise
        finally:
            record["duration_seconds"] = round(time.perf_counter() - started, 4)
            if screenshot:
                record["screenshot"] = self.capture(action + "-" + target)
