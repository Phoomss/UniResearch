import pytest

from tests.selenium.dataset import EXTRA_EMAILS


@pytest.mark.e2e
def test_tc_048_admin_category_user_workflow_and_rbac(e, page):
    page.login("A1")
    page.category("E2E Selenium Category")
    uid = page.create_user()
    assert e.call("GET", f"/users/{uid}", "A1")["email"] == EXTRA_EMAILS["new_user"], (
        "Created user email must match the selected CSV identity"
    )
    assert any(
        c["category_name"] == "E2E Selenium Category"
        for c in e.call("GET", "/categories/")
    ), (
        "TC-048: expected any((c['category_name'] == 'E2E Selenium Category' for c in e.call('GET', '/categories/')))"
    )
    users_before = e.scalar("SELECT count(*) FROM users")
    categories_before = e.scalar("SELECT count(*) FROM categories")
    page.driver.delete_all_cookies()
    page.login()
    page.open("/admin")
    e.observe("Student /admin UI final URL: " + page.driver.current_url)
    e.call("GET", "/users/", "S1", status=403)
    e.call(
        "POST",
        "/users/",
        "S1",
        status=403,
        json={"email": EXTRA_EMAILS["denied_user"], "password": e.password},
    )
    e.call(
        "POST", "/categories/", "S1", status=403, json={"category_name": "Denied E2E"}
    )
    assert e.scalar("SELECT count(*) FROM users") == users_before, (
        "TC-048: expected e.scalar('SELECT count(*) FROM users') == users_before"
    )
    assert e.scalar("SELECT count(*) FROM categories") == categories_before, (
        "TC-048: expected e.scalar('SELECT count(*) FROM categories') == categories_before"
    )
