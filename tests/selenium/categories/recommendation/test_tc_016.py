import json

import pytest
from selenium.webdriver.common.by import By


@pytest.mark.recommendation
def test_tc_016_suggestions_hide_pending(e, page):
    # A pending work matches the same query as public works; exclusion is non-vacuous.
    e.execute(
        "UPDATE research_works SET keywords='publickeyword,pendingsecret' WHERE id=2"
    )
    page.open("/research")
    search = page.element('input[type="search"], input[placeholder*="ค้นหา"]')
    search.send_keys("publickeyword")
    page.wait.until(
        lambda d: "publickeyword" in d.find_element(By.TAG_NAME, "body").text
    )
    assert "pendingsecret" not in page.driver.find_element(By.TAG_NAME, "body").text, (
        "TC-016: expected 'pendingsecret' not in page.driver.find_element(By.TAG_NAME, 'body').text"
    )
    assert (
        "W2 งานวิจัย Selenium" not in page.driver.find_element(By.TAG_NAME, "body").text
    ), "Matching pending submission must not appear in visible suggestions"
    public = e.call(
        "GET", "/research/search/suggestions", params={"q": "publickeyword"}
    )
    assert "publickeyword" in json.dumps(public), (
        "TC-016: expected 'publickeyword' in json.dumps(public)"
    )
    private = e.call(
        "GET", "/research/search/suggestions", params={"q": "pendingsecret"}
    )
    assert "pendingsecret" not in json.dumps(private) and "W2" not in json.dumps(
        private
    ), (
        "TC-016: expected 'pendingsecret' not in json.dumps(private) and 'W2' not in json.dumps(private)"
    )
