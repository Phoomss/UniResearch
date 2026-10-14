import pytest

from tests.selenium.assertions import assert_review


@pytest.mark.review
def test_tc_038_assigned_advisor_approves(e, review_page):
    review_page.login("D1")
    review_page.review_from_queue()
    assert review_page.visible_status(2, "อนุมัติแล้ว") == "อนุมัติแล้ว", (
        "Approved decision must be visible after page reload"
    )
    assert_review(e)
