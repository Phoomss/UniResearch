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
    submission_page.review_from_queue(wid)
    assert submission_page.visible_status(wid, "อนุมัติแล้ว") == "อนุมัติแล้ว"
    assert_review(e, wid)
    submission_page.driver.delete_all_cookies()
    submission_page.login()
    submission_page.open("/student/research")
    submission_page.text("Cross-role Selenium Research")
    assert (
        submission_page.my_submission_status("Cross-role Selenium Research")
        == "เผยแพร่แล้ว"
    ), "Student must see publication after the advisor decision"
    assert e.work(wid)["status"] == "approved", (
        "TC-047: expected e.work(wid)['status'] == 'approved'"
    )
