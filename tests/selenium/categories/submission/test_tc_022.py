import pytest

from tests.selenium.assertions import assert_submission


@pytest.mark.submission
def test_tc_022_complete_submission(e, submission_page):
    submission_page.login()
    wid = submission_page.submit()
    assert_submission(e, wid)
    assert (
        submission_page.my_submission_status("งานวิจัยทดสอบ Selenium") == "รอตรวจสอบ"
    ), "Submitted research must be visibly pending"
    assert submission_page.visible_status(wid, "รอตรวจสอบ") == "รอตรวจสอบ"
    for expected in [
        "S1 Selenium",
        "D1 Selenium",
        "วิทยาการคอมพิวเตอร์",
        "วิทยานิพนธ์",
        "2569",
        "selenium",
        "research",
    ]:
        submission_page.text(expected)
        assert expected in submission_page.body_text(), (
            f"Submission detail must show {expected}"
        )
