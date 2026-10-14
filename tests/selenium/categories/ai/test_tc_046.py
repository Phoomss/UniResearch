from urllib.parse import urlparse

import pytest
from selenium.webdriver.common.by import By


@pytest.mark.ai
def test_tc_046_ai_review_contracts_and_permissions(e, ai_review_page):
    e.execute(
        "INSERT INTO review_comments(research_id,reviewer_id,comment_text,status_result,score,created_at) VALUES(1,5,'AI fixture','approved',80,'2026-10-01')"
    )
    ai_review_page.login("D1")
    for tab, expected_text in [
        ("Pre-Review Analysis", "Deterministic pre-review"),
        ("Plagiarism Check", "Deterministic similarity"),
        ("Reviewer Matching", "Deterministic advisor"),
        ("Review Summary", "Deterministic review summary"),
    ]:
        ai_review_page.analyze(1, tab, expected_text)
    expected = {
        "ai-pre-review": {"overall_score": 80, "summary": "Deterministic pre-review"},
        "ai-plagiarism": {"similarity_score": 0, "summary": "Deterministic similarity"},
        "ai-reviewer-match": {
            "matches": [
                {
                    "advisor_id": 5,
                    "name": "Deterministic advisor",
                    "score": 90,
                    "reason": "Controlled match",
                }
            ],
            "summary": "Deterministic reviewer match",
        },
        "ai-review-summary": {
            "executive_summary": "Deterministic review summary",
            "key_issues_raised": [],
            "improvement_sentiment": "Positive",
        },
    }
    for endpoint, result in expected.items():
        response = e.call("POST", f"/research/1/{endpoint}", "D1")
        assert all((response[key] == value for key, value in result.items())), (
            f"{endpoint}: contract mismatch"
        )
        e.call("POST", f"/research/1/{endpoint}", status=401)
        e.call("POST", f"/research/1/{endpoint}", "S1", status=403)
        e.call("POST", f"/research/999999999/{endpoint}", "D1", status=404)
    ai_review_page.driver.delete_all_cookies()
    ai_review_page.login()
    ai_review_page.open("/advisor/reviews/1")
    ai_review_page.wait.until(
        lambda d: urlparse(d.current_url).path == "/account/saved"
    )
    assert (
        "AI Peer Review Assistant"
        not in ai_review_page.driver.find_element(By.TAG_NAME, "body").text
    ), "Student must be redirected from advisor workspace"
