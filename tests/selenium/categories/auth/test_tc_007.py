from urllib.parse import urlparse

import pytest

from tests.selenium.support import COOKIE


@pytest.mark.auth
def test_tc_007_logout_removes_httponly_session(e, page, session_page):
    page.login()
    cookie = page.driver.get_cookie(COOKIE)
    assert cookie and cookie["httpOnly"], (
        "TC-007: expected cookie and cookie['httpOnly']"
    )
    page.open("/account/saved")
    session_page.logout()
    assert not page.driver.get_cookie(COOKIE), (
        "TC-007: expected not page.driver.get_cookie(COOKIE)"
    )
    page.open("/account/saved")
    page.wait.until(lambda d: urlparse(d.current_url).path == "/login")
