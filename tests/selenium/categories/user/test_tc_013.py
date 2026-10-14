import pytest


@pytest.mark.user
def test_tc_013_student_cannot_replace_options(e, options_page):
    before = e.call("GET", "/options/")
    options_page.login()
    options_page.attempt_student_change()
    assert e.call("GET", "/options/") == before, (
        "Student UI save must not change global options"
    )
    e.call(
        "POST",
        "/options/",
        "S1",
        status=403,
        json={"departments": ["Denied"], "work_types": ["Denied"]},
    )
    assert e.call("GET", "/options/") == before, (
        "TC-013: expected e.call('GET', '/options/') == before"
    )
