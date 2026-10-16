import pytest

from tests.selenium.assertions import assert_submission
from tests.selenium.dataset import SUBMISSION_TITLE, identity, submission_fields


@pytest.mark.submission
def test_tc_022_complete_submission(e, submission_page):
    submission_page.login()
    wid = submission_page.submit()
    assert_submission(e, wid)
    assert submission_page.my_submission_status(SUBMISSION_TITLE) == "รอตรวจสอบ"
    assert submission_page.visible_status(wid, "รอตรวจสอบ") == "รอตรวจสอบ"
    values = submission_fields()
    expected = [values["department"], values["work_type"], str(values["academic_year"])]
    for role in ("S1", "D1"):
        person = identity(e.email(role))
        expected.append(person["first_name"] + " " + person["last_name"])
    expected.extend(k.strip() for k in values["keywords"].split(","))
    for text in expected:
        submission_page.text(text)
