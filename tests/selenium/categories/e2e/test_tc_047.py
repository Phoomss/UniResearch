import pytest

from tests.selenium.assertions import assert_review, assert_submission, ids


@pytest.mark.e2e
def test_tc_047_student_submission_to_advisor_review(e, submission_page):
    submission_page.login()
    wid = submission_page.submit(title="Cross-role Selenium Research")
    assert_submission(e, wid)
    submission_page.open("/student/research")
    submission_page.text("Cross-role Selenium Research")
    submission_page.driver.delete_all_cookies()
    submission_page.login("D1")
    assert wid in ids(e.call("GET", "/research/pending", "D1")), (
        "TC-047: expected wid in ids(e.call('GET', '/research/pending', 'D1'))"
    )
    submission_page.open("/advisor/reviews")
    submission_page.text("Cross-role Selenium Research")
    submission_page.review(wid)
    assert_review(e, wid)
    submission_page.driver.delete_all_cookies()
    submission_page.login()
    submission_page.open("/student/research")
    submission_page.text("Cross-role Selenium Research")
    assert e.work(wid)["status"] == "approved", (
        "TC-047: expected e.work(wid)['status'] == 'approved'"
    )
