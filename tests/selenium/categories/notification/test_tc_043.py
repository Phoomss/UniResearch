import pytest
from selenium.webdriver.common.by import By

from tests.selenium.assertions import ids


@pytest.mark.notification
def test_tc_043_private_notifications_and_read(e, page):
    e.execute(
        "INSERT INTO notifications(id,user_id,title,message,type,is_read,created_at) "
        "VALUES(3,2,'แจ้งเตือนเพิ่มเติมสำหรับอ่านทั้งหมด','รายการที่สองของผู้ใช้คนเดียวกัน','info',0,'2026-10-02')"
    )
    assert ids(e.call("GET", "/notifications/", "S1")) == {1, 3}
    e.call("POST", "/notifications/2/read", "S1", status=404)
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0
    assert e.call("POST", "/notifications/1/read", "S1")["is_read"] is True
    assert e.scalar("SELECT is_read FROM notifications WHERE id=3") == 0
    e.execute("UPDATE notifications SET is_read=0 WHERE user_id=2")
    e.call("POST", "/notifications/read-all", "S1")
    assert (
        e.scalar("SELECT count(*) FROM notifications WHERE user_id=2 AND is_read=1")
        == 2
    )
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0

    e.execute("UPDATE notifications SET is_read=0 WHERE user_id=2")
    page.login()
    page.notifications()
    page.text("N1 Selenium")
    page.text("แจ้งเตือนเพิ่มเติมสำหรับอ่านทั้งหมด")
    assert "N2 Selenium" not in page.driver.find_element(By.TAG_NAME, "body").text
    page.mark_notification_read(title="N1 Selenium")
    page.wait.until(
        lambda _: e.scalar("SELECT is_read FROM notifications WHERE id=1") == 1
    )
    assert e.scalar("SELECT is_read FROM notifications WHERE id=3") == 0
    assert page.driver.find_elements(
        By.CSS_SELECTOR, 'button[title="ทำเครื่องหมายว่าอ่านแล้ว"]'
    )
    page.mark_notification_read(all_notifications=True)
    page.wait.until(
        lambda _: (
            e.scalar("SELECT count(*) FROM notifications WHERE user_id=2 AND is_read=1")
            == 2
        )
    )
    assert e.scalar("SELECT is_read FROM notifications WHERE id=2") == 0
