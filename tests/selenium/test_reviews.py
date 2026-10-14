from selenium.webdriver.common.by import By

from .test_research import assert_submission, ids


def test_tc_036_pending_queue_permissions(e, page):
    assert ids(e.call("GET", "/research/pending", "A1")) == {2, 3}
    assert ids(e.call("GET", "/research/pending", "D1")) == {2}
    e.call("GET", "/research/pending", "S1", status=403)
    page.login("D1")
    page.open("/advisor/reviews")
    page.text("W2 งานวิจัย Selenium")
    visible = "W3 งานวิจัย Selenium" in page.driver.find_element(By.TAG_NAME, "body").text
    e.observe(
        f"Advisor queue UI exposes unassigned W3: {visible}; pending API excludes W3."
    )
    page.driver.delete_all_cookies()
    page.login("A1")
    page.open("/admin/reviews")
    page.text("W2 งานวิจัย Selenium")
    page.text("W3 งานวิจัย Selenium")


def assert_review(e, wid=2):
    work = e.call("GET", f"/research/{wid}")
    assert work["status"] == "approved"
    assert e.rows(
        "SELECT reviewer_id,comment_text,score,status_result FROM review_comments WHERE research_id=?",
        (wid,),
    ) == [
        {
            "reviewer_id": 5,
            "comment_text": "Selenium verified review",
            "score": 80,
            "status_result": "approved",
        }
    ]


def test_tc_039_review_invalid_role_status_and_enum(e):
    body = {"comment_text": "Denied review", "score": 80, "status_result": "approved"}
    before = e.rows("SELECT id,status FROM research_works ORDER BY id")
    e.call("POST", "/research/2/review", "D2", status=403, json=body)
    e.call("POST", "/research/1/review", "D1", status=400, json=body)
    e.call(
        "POST",
        "/research/2/review",
        "D1",
        status=422,
        json={**body, "status_result": "invalid"},
    )
    assert e.scalar("SELECT count(*) FROM review_comments") == 0
    assert e.rows("SELECT id,status FROM research_works ORDER BY id") == before


def test_tc_040_approval_notifies_submitter_and_coauthor(e, page):
    e.execute(
        "INSERT INTO research_authors(research_id,user_id,role_in_work) VALUES(2,3,'co-author')"
    )
    body = {
        "comment_text": "Selenium verified review",
        "score": 80,
        "status_result": "approved",
    }
    e.call("POST", "/research/2/review", "D1", json=body)
    assert_review(e)
    assert e.work(2)["published_at"] is not None
    recipients = {
        r["user_id"] for r in e.rows("SELECT user_id FROM notifications WHERE id>2")
    }
    assert {2, 3} <= recipients
    for role in ["S1", "S2"]:
        page.driver.delete_all_cookies()
        page.login(role)
        page.notifications()
        page.text("W2 งานวิจัย Selenium")


def test_tc_041_admin_reassigns_advisor(e):
    e.call("POST", "/research/2/assign-advisors", "A1", json=[6])
    assert e.rows("SELECT user_id FROM research_advisors WHERE research_id=2") == [
        {"user_id": 6}
    ]
    assert 2 not in ids(e.call("GET", "/research/pending", "D1"))
    assert 2 in ids(e.call("GET", "/research/pending", "D2"))
    e.call("POST", "/research/2/assign-advisors", "S1", status=403, json=[5])
    assert e.rows("SELECT user_id FROM research_advisors WHERE research_id=2") == [
        {"user_id": 6}
    ]


def test_tc_042_favorite_toggle_and_saved_page(e, page):
    page.login()
    page.open("/research/1")
    page.button("Save research")
    page.wait.until(
        lambda _: (
            e.scalar("SELECT count(*) FROM favorites WHERE user_id=2 AND research_id=1")
            == 1
        )
    )
    assert len(e.call("GET", "/favorites/", "S1")) == 1
    page.open("/account/saved")
    page.text("W1 งานวิจัย Selenium")
    result = e.call("POST", "/favorites/1", "S1")
    assert result["detail"] == "Removed from favorites"
    assert e.call("GET", "/favorites/", "S1") == []
    page.driver.refresh()
    page.wait.until(
        lambda d: "W1 งานวิจัย Selenium" not in d.find_element(By.TAG_NAME, "body").text
    )


def test_tc_044_ai_writing_contracts_and_validation(e):
    for endpoint, body, key, expected in [
        (
            "generate-abstract",
            {"title_th": "Test", "title_en": "Test", "language": "th"},
            "abstract",
            "Deterministic test abstract",
        ),
        (
            "suggest-titles",
            {"abstract": "Test"},
            "suggestions",
            ["Deterministic research title"],
        ),
        (
            "suggest-keywords",
            {"title_th": "Test"},
            "keywords",
            ["selenium", "research"],
        ),
        ("check-writing", {"text": "Test writing"}, "score", 90),
    ]:
        assert e.call("POST", f"/ai/{endpoint}", "S1", json=body)[key] == expected
        e.call("POST", f"/ai/{endpoint}", status=401, json=body)
    # Two request schemas allow every field to be omitted; use actual required
    # fields for negative validation rather than assuming {} is always invalid.
    for endpoint in ["generate-abstract", "check-writing"]:
        e.call("POST", f"/ai/{endpoint}", "S1", status=422, json={})
    for endpoint in ["suggest-titles", "suggest-keywords"]:
        e.call(
            "POST",
            f"/ai/{endpoint}",
            "S1",
            status=422,
            json={"abstract": {"invalid": "type"}},
        )


def test_tc_045_ai_dashboard_rbac_and_public_chat(e):
    assert e.call("POST", "/ai/dashboard-insights", "A1", json={}) == {
        "summary": "Deterministic dashboard insight"
    }
    e.call("POST", "/ai/dashboard-insights", "S1", status=403, json={})
    chat = e.call("POST", "/ai/chat", json={"message": "Selenium", "history": []})
    assert chat["response"] == "Deterministic chat response"
    assert isinstance(chat["relevant_works"], list)
    assert all(w["id"] in {1, 4, 5} for w in chat["relevant_works"])
