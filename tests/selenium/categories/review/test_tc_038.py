import pytest

from tests.selenium.assertions import assert_review


@pytest.mark.review
def test_tc_038_assigned_advisor_approves(e, page):
    page.login("D1")
    page.review()
    assert_review(e)
