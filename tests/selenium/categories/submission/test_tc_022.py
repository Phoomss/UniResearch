import pytest

from tests.selenium.assertions import assert_submission


@pytest.mark.submission
def test_tc_022_complete_submission(e, submission_page):
    submission_page.login()
    assert_submission(e, submission_page.submit())
