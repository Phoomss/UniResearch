import pytest
from selenium.webdriver.common.by import By

from tests.selenium.assertions import ids


@pytest.mark.notification
def test_tc_043_private_notifications_and_read(e, page):
    assert ids(e.call("GET", "/notifications/", "S1")) == {1}, (
        "TC-043: expected ids(e.call('GET', '/notifications/', 'S1')) == {1}"
    )
    e.call("POST", "/notifications/2/read", "S1", status=404)
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0, (
        "TC-043: expected e.scalar('SELECT is_read FROM notifications WHERE id=2') == 0"
    )
    assert e.call("POST", "/notifications/1/read", "S1")["is_read"] is True, (
        "TC-043: expected e.call('POST', '/notifications/1/read', 'S1')['is_read'] is True"
    )
    e.execute("UPDATE notifications SET is_read=0 WHERE id=1")
    e.call("POST", "/notifications/read-all", "S1")
    assert e.scalar("SELECT is_read FROM notifications WHERE id=1") == 1, (
        "TC-043: expected e.scalar('SELECT is_read FROM notifications WHERE id=1') == 1"
    )
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0, (
        "TC-043: expected e.scalar('SELECT is_read FROM notifications WHERE id=2') == 0"
    )
    page.login()
    page.notifications()
    page.text("N1 Selenium")
    assert "N2 Selenium" not in page.driver.find_element(By.TAG_NAME, "body").text, (
        "TC-043: expected 'N2 Selenium' not in page.driver.find_element(By.TAG_NAME, 'body').text"
    )
    e.execute("UPDATE notifications SET is_read=0 WHERE id=1")
    page.driver.refresh()
    page.notifications()
    page.mark_notification_read()
    assert not page.driver.find_elements(
        By.CSS_SELECTOR, 'button[title="ทำเครื่องหมายว่าอ่านแล้ว"]'
    ), "Read notification must lose its mark-read control"
    page.wait.until(
        lambda _: e.scalar("SELECT is_read FROM notifications WHERE id=1") == 1
    )
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0, (
        "TC-043: expected e.scalar('SELECT is_read FROM notifications WHERE id=2') == 0"
    )
    e.execute("UPDATE notifications SET is_read=0 WHERE id=1")
    page.driver.refresh()
    page.notifications()
    page.mark_notification_read(all_notifications=True)
    assert not page.driver.find_elements(
        By.CSS_SELECTOR, 'button[title="ทำเครื่องหมายว่าอ่านแล้ว"]'
    ), "Read-all must update visible notifications"
    page.wait.until(
        lambda _: e.scalar("SELECT is_read FROM notifications WHERE id=1") == 1
    )
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0, (
        "TC-043: expected e.scalar('SELECT is_read FROM notifications WHERE id=2') == 0"
    )
