import pytest
from selenium.webdriver.common.by import By

from tests.selenium.assertions import ids
from tests.selenium.dataset import WORK_TITLES


@pytest.mark.submission
def test_tc_028_my_research_includes_coauthored(e, page):
    e.execute("UPDATE research_works SET submitted_by_id=3 WHERE id=2")
    e.execute("UPDATE research_authors SET user_id=3 WHERE research_id=2")
    page.login()
    page.open("/student/research")
    page.text(WORK_TITLES[1])
    page.text(WORK_TITLES[4])
    assert WORK_TITLES[3] not in page.driver.find_element(By.TAG_NAME, "body").text, (
        "TC-028: expected 'the documented research title' not in page.driver.find_element(By.TAG_NAME, 'body').text"
    )
    assert ids(e.call("GET", "/research/my", "S1")) == {1, 4}, (
        "TC-028: expected ids(e.call('GET', '/research/my', 'S1')) == {1, 4}"
    )
