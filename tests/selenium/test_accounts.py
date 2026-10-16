from urllib.parse import urlparse

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from tests.selenium.dataset import EXTRA_EMAILS, identity

from .support import COOKIE


def test_tc_002_duplicate_registration(e, page):
    before = e.scalar("SELECT count(*) FROM users")
    person = identity(e.email())
    page.open("/login")
    page.click((By.CSS_SELECTOR, 'a[href="/register"]'))
    page.element('form[data-hydrated="true"]')
    for field, value in {
        "first_name": person["first_name"],
        "last_name": person["last_name"],
        "email": person["email"],
        "password": e.password,
        "confirmPassword": e.password,
    }.items():
        page.fill(field, value)
    page.button("สร้างบัญชี")
    assert "อีเมลนี้ลงทะเบียนแล้ว" in page.error_message()
    assert urlparse(page.driver.current_url).path == "/register"
    assert not page.driver.get_cookie(COOKIE)
    body = e.call(
        "POST",
        "/auth/register",
        status=400,
        json={"email": e.email("S1"), "password": e.password},
    )
    assert "already" in body["detail"].lower()
    assert e.scalar("SELECT count(*) FROM users") == before


def test_tc_003_login_and_me(e, page):
    page.login()
    assert urlparse(page.driver.current_url).path == "/account/saved"
    login = e.call(
        "POST",
        "/auth/login",
        data={"username": e.email("S1"), "password": e.password},
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
    page.click((By.CSS_SELECTOR, 'a[href="/student/profile"]'))
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
    e.call(
        "POST",
        "/auth/login",
        status=400,
        data={"username": e.email(), "password": e.password},
    )
    page.login(password="NewTestPassword123")


def test_tc_006_invalid_inactive_and_duplicate_email(e):
    e.call(
        "GET", "/auth/me", status=401, headers={"Authorization": "Bearer fake-token"}
    )
    e.call("GET", "/auth/me", "U2", status=400)
    e.call("PUT", "/auth/me", "S2", status=400, json={"email": e.email("S1")})
    assert e.scalar("SELECT email FROM users WHERE id=3") == e.email("S2")


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
            "email": EXTRA_EMAILS["new_advisor"],
            "password": e.password,
            "role": "advisor",
        },
    )


def test_tc_009_student_cannot_manage_users(e):
    before = e.rows("SELECT id,email,role,first_name FROM users ORDER BY id")
    for method, path, body in [
        ("GET", "/users/", None),
        (
            "POST",
            "/users/",
            {"email": EXTRA_EMAILS["denied_user"], "password": e.password},
        ),
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


def test_tc_012_admin_replaces_options(e, page):
    # This case specifies a minimal starting list, independently of the shared dataset.
    e.execute("DELETE FROM departments")
    e.execute("DELETE FROM work_types")
    e.execute("INSERT INTO departments(name) VALUES('วิศวกรรมซอฟต์แวร์')")
    e.execute("INSERT INTO work_types(name) VALUES('วิทยานิพนธ์')")
    page.login("A1")
    page.click((By.CSS_SELECTOR, 'a[href="/admin/options"]'))
    page.button_by_css('button[aria-label="ลบ วิศวกรรมซอฟต์แวร์"]')
    page.button_by_css('button[aria-label="ลบ วิทยานิพนธ์"]')
    for placeholder, label, value in [
        ("เพิ่มภาควิชาใหม่ เช่น วิศวกรรมคอมพิวเตอร์", "เพิ่มภาควิชา", " New Department "),
        ("เพิ่มประเภทผลงาน เช่น วิทยานิพนธ์", "เพิ่มประเภทผลงาน", " New Type "),
    ]:
        field = page.element(f'input[placeholder="{placeholder}"]')
        field.send_keys(value)
        page.button_by_css(f'button[aria-label="{label}"]')
        field.send_keys("   ")
        page.button_by_css(f'button[aria-label="{label}"]')
    page.button("บันทึกการตั้งค่าทั้งหมด")
    page.text("บันทึกการตั้งค่าเรียบร้อยแล้ว")
    page.driver.refresh()
    page.text("New Department")
    page.text("New Type")
    assert e.call("GET", "/options/") == {
        "departments": ["New Department"],
        "work_types": ["New Type"],
    }
    # The UI trims input itself; send whitespace to the API to check server trimming separately.
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
