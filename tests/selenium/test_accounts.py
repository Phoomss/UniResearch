from urllib.parse import urlparse

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from .support import COOKIE


def test_tc_002_duplicate_registration(e):
    before = e.scalar("SELECT count(*) FROM users")
    body = e.call(
        "POST",
        "/auth/register",
        status=400,
        json={"email": "s1@example.org", "password": e.password},
    )
    assert "already" in body["detail"].lower()
    assert e.scalar("SELECT count(*) FROM users") == before


def test_tc_003_login_and_me(e, page):
    page.login()
    assert urlparse(page.driver.current_url).path == "/account/saved"
    login = e.call(
        "POST",
        "/auth/login",
        data={"username": "s1@example.org", "password": e.password},
    )
    assert login["token_type"] == "bearer"
    me = e.call(
        "GET", "/auth/me", headers={"Authorization": "Bearer " + login["access_token"]}
    )
    assert me["id"] == 2 and me["role"] == "student"


def test_tc_005_profile_and_password(e, page):
    e.token("S1")
    e.execute("INSERT INTO departments(name) VALUES('Test Department')")
    page.login()
    page.open("/student/profile")
    for placeholder, value in [
        ("ชื่อจริง", "Changed"),
        ("รหัสผ่านใหม่", "NewTestPassword123"),
        ("ยืนยันรหัสผ่านใหม่", "NewTestPassword123"),
    ]:
        element = page.element(f'input[placeholder="{placeholder}"]')
        element.clear()
        element.send_keys(value)
    Select(page.element("form select")).select_by_visible_text("Test Department")
    page.button_by_css('form button[type="submit"]')
    page.wait.until(
        lambda _: e.scalar("SELECT first_name FROM users WHERE id=2") == "Changed"
    )
    page.driver.refresh()
    assert (
        page.element('input[placeholder="ชื่อจริง"]').get_attribute("value") == "Changed"
    )
    me = e.call("GET", "/auth/me", "S1")
    assert me["first_name"] == "Changed" and me["department"] == "Test Department"
    assert (
        e.scalar("SELECT hashed_password FROM users WHERE id=2") != "NewTestPassword123"
    )
    page.driver.delete_all_cookies()
    page.login(password="NewTestPassword123")


def test_tc_006_invalid_inactive_and_duplicate_email(e):
    e.call(
        "GET", "/auth/me", status=401, headers={"Authorization": "Bearer fake-token"}
    )
    e.call("GET", "/auth/me", "U2", status=400)
    e.call("PUT", "/auth/me", "S2", status=400, json={"email": "s1@example.org"})
    assert e.scalar("SELECT email FROM users WHERE id=3") == "s2@example.org"


def test_tc_008_admin_user_crud(e, page):
    page.login("A1")
    uid = page.create_user()
    e.call("GET", f"/users/{uid}", "A1")
    # The current UI offers reviewer instead of advisor; use the documented API
    # alternative for the advisor role and verify persistence independently.
    body = e.call(
        "PUT", f"/users/{uid}", "A1", json={"first_name": "Updated", "role": "advisor"}
    )
    assert body["first_name"] == "Updated" and body["role"] == "advisor"
    assert e.scalar("SELECT role FROM users WHERE id=?", (uid,)) == "advisor"
    e.call("DELETE", f"/users/{uid}", "A1", status=204)
    e.call("GET", f"/users/{uid}", "A1", status=404)
    # Explicit POST status check (the UI proxy transforms upstream status).
    e.call(
        "POST",
        "/users/",
        "A1",
        status=201,
        json={
            "email": "created@example.org",
            "password": e.password,
            "role": "advisor",
        },
    )


def test_tc_009_student_cannot_manage_users(e):
    before = e.rows("SELECT id,email,role,first_name FROM users ORDER BY id")
    for method, path, body in [
        ("GET", "/users/", None),
        ("POST", "/users/", {"email": "denied@example.org", "password": e.password}),
        ("GET", "/users/3", None),
        ("PUT", "/users/3", {"first_name": "Denied"}),
        ("DELETE", "/users/3", None),
    ]:
        e.call(method, path, "S1", status=403, **({"json": body} if body else {}))
    assert e.rows("SELECT id,email,role,first_name FROM users ORDER BY id") == before


def test_tc_011_student_cannot_create_category(e):
    before = e.call("GET", "/categories/")
    e.call(
        "POST", "/categories/", "S1", status=403, json={"category_name": "Denied C3"}
    )
    assert e.call("GET", "/categories/") == before


def test_tc_012_admin_replaces_options(e):
    e.call(
        "POST",
        "/options/",
        "A1",
        json={
            "departments": [" New Department ", " "],
            "work_types": [" New Type ", ""],
        },
    )
    assert e.call("GET", "/options/") == {
        "departments": ["New Department"],
        "work_types": ["New Type"],
    }
    assert e.rows("SELECT name FROM departments") == [{"name": "New Department"}]
    assert e.rows("SELECT name FROM work_types") == [{"name": "New Type"}]
