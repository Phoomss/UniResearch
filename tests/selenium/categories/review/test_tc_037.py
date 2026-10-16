import pytest
from selenium.webdriver.common.by import By

from tests.selenium.assertions import ids
from tests.selenium.dataset import WORK_TITLES


@pytest.mark.review
def test_tc_037_reviewer_history_is_personal(e, page):
    for work, reviewer in [(1, 5), (4, 1)]:
        e.execute(
            "INSERT INTO review_comments(research_id,reviewer_id,comment_text,status_result,score,created_at) VALUES(?,?,'History fixture','approved',80,'2026-10-01')",
            (work, reviewer),
        )
    page.login("D1")
    page.open("/advisor/history")
    page.text(WORK_TITLES[1])
    assert WORK_TITLES[4] not in page.driver.find_element(By.TAG_NAME, "body").text, (
        "TC-037: expected 'the documented research title' not in page.driver.find_element(By.TAG_NAME, 'body').text"
    )
    assert ids(e.call("GET", "/research/history", "D1")) == {1}, (
        "TC-037: expected ids(e.call('GET', '/research/history', 'D1')) == {1}"
    )
    assert ids(e.call("GET", "/research/history", "A1")) == {4}, (
        "TC-037: expected ids(e.call('GET', '/research/history', 'A1')) == {4}"
    )
    e.call("GET", "/research/history", "S1", status=403)

    e.execute(
        "INSERT INTO review_comments(research_id,reviewer_id,comment_text,status_result,score,created_at) VALUES(2,5,'History fixture','needs_revision',80,'2026-10-01')"
    )
    assert e.work(2)["status"] == "pending"
    assert ids(e.call("GET", "/research/history", "D1")) == {1, 2}
    page.driver.refresh()
    page.text(WORK_TITLES[2])
