from urllib.parse import urlparse

import pytest
from selenium.webdriver.common.by import By

from tests.selenium.support import COOKIE


@pytest.mark.auth
def test_tc_004_wrong_password(e, page):
    page.open("/login")
    page.element('form[data-hydrated="true"]')
    page.fill("email", e.email())
    page.fill("password", "DeliberatelyIncorrectPassword")
    page.button("เข้าสู่ระบบ")
    page.wait.until(
        lambda d: bool(d.find_elements(By.CSS_SELECTOR, ".toast-error .toast-message"))
    )
    message = page.error_message()
    assert "อีเมลหรือรหัสผ่านไม่ถูกต้อง" in message, (
        f"Incorrect-password UI error mismatch: {message}"
    )
    assert urlparse(page.driver.current_url).path == "/login", (
        "TC-004: expected urlparse(page.driver.current_url).path == '/login'"
    )
    assert not page.driver.get_cookie(COOKIE), (
        "TC-004: expected not page.driver.get_cookie(COOKIE)"
    )
    body = e.call(
        "POST",
        "/auth/login",
        status=400,
        data={"username": e.email(), "password": "wrong"},
    )
    assert "access_token" not in body, "TC-004: expected 'access_token' not in body"
