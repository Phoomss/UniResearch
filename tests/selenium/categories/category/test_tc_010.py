import pytest


@pytest.mark.category
def test_tc_010_admin_category_public_read(e, page):
    page.open("/research")
    page.text("C1 Selenium")
    page.text("C2 Selenium")
    page.login("A1")
    page.category()
    categories = e.call("GET", "/categories/")
    created = [c for c in categories if c["category_name"] == "Selenium C2"]
    assert len(created) == 1 and created[0]["id"] > 0, (
        "TC-010: expected len(created) == 1 and created[0]['id'] > 0"
    )
    page.driver.delete_all_cookies()
    page.open("/research")
    page.text("Selenium C2")
