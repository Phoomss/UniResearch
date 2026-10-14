import pytest

from tests.selenium.support import COOKIE


@pytest.mark.auth
def test_tc_001_register_forces_student(e, registration_page):
    registration_page.register_with_admin_role()
    registration_page.text("สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ")
    assert "สร้างบัญชีนักศึกษาแล้ว" in registration_page.body_text(), (
        "UI must confirm a student account after the admin-role attempt"
    )
    assert not registration_page.driver.get_cookie(COOKIE), (
        "Registration must not create a login session"
    )
    e.call(
        "POST",
        "/auth/register",
        json={"email": "newapi@example.org", "password": e.password, "role": "admin"},
    )
    rows = e.rows(
        "SELECT role FROM users WHERE email IN ('newui@example.org','newapi@example.org')"
    )
    assert len(rows) == 2 and all(r["role"] == "student" for r in rows), (
        "Forged admin role must be ignored by both browser proxy and backend"
    )
