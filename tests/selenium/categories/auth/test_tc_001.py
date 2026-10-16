import pytest

from tests.selenium.dataset import EXTRA_EMAILS, identity
from tests.selenium.support import COOKIE


@pytest.mark.auth
def test_tc_001_register_forces_student(e, registration_page):
    registration_page.register()
    assert not registration_page.driver.get_cookie(COOKIE)
    registration_page.register_with_admin_role()
    assert not registration_page.driver.get_cookie(COOKIE)
    person = identity(EXTRA_EMAILS["registration_api"])
    e.call(
        "POST",
        "/auth/register",
        json={
            "email": person["email"],
            "password": e.password,
            "role": "admin",
            "first_name": person["first_name"],
            "last_name": person["last_name"],
        },
    )
    emails = tuple(
        EXTRA_EMAILS[k]
        for k in ("registration", "registration_admin", "registration_api")
    )
    rows = e.rows(
        "SELECT email,role,first_name,last_name FROM users WHERE email IN (?,?,?)",
        emails,
    )
    assert len(rows) == 3
    for row in rows:
        person = identity(row["email"])
        assert row["role"] == "student"
        assert row["first_name"] == person["first_name"]
        assert row["last_name"] == person["last_name"]
