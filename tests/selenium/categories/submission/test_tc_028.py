import pytest
from selenium.webdriver.common.by import By

from tests.selenium.assertions import ids


@pytest.mark.submission
def test_tc_028_my_research_includes_coauthored(e, page):
    e.execute("UPDATE research_works SET submitted_by_id=3 WHERE id=2")
    e.execute("UPDATE research_authors SET user_id=3 WHERE research_id=2")
    page.login()
    page.open("/student/research")
    page.text("W1 งานวิจัย Selenium")
    page.text("W4 งานวิจัย Selenium")
    assert (
        "W3 งานวิจัย Selenium" not in page.driver.find_element(By.TAG_NAME, "body").text
    ), (
        "TC-028: expected 'W3 งานวิจัย Selenium' not in page.driver.find_element(By.TAG_NAME, 'body').text"
    )
    assert ids(e.call("GET", "/research/my", "S1")) == {1, 4}, (
        "TC-028: expected ids(e.call('GET', '/research/my', 'S1')) == {1, 4}"
    )
