from selenium.webdriver.common.by import By

from tests.selenium.dataset import SUBMISSION_TITLE, WORK_TITLES

from .test_research import ids


def test_tc_036_pending_queue_permissions(e, page):
    assert ids(e.call("GET", "/research/pending", "A1")) == {2, 3}
    assert ids(e.call("GET", "/research/pending", "D1")) == {2}
    e.call("GET", "/research/pending", "S1", status=403)
    assert ids(e.call("GET", "/research/pending", "D2")) == {3}
    e.call("GET", "/research/pending", status=401)
    page.login("D1")
    page.open("/advisor/reviews")
    page.text(WORK_TITLES[2])
    visible = WORK_TITLES[3] in page.driver.find_element(By.TAG_NAME, "body").text
    e.observe(
        f"Advisor queue exposes an unassigned documented paper: {visible}; compare with pending API."
    )
    page.driver.delete_all_cookies()
    page.login("A1")
    page.open("/admin/reviews")
    page.text(WORK_TITLES[2])
    page.text(WORK_TITLES[3])


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
    e.call("POST", "/research/2/review", "S1", status=403, json=body)
    e.call("POST", "/research/2/review", status=401, json=body)
    e.call("POST", "/research/999999999/review", "D1", status=404, json=body)
    assert e.scalar("SELECT count(*) FROM review_comments") == 0
    assert e.rows("SELECT id,status FROM research_works ORDER BY id") == before


def test_tc_040_approval_notifies_submitter_and_coauthor(e, review_page):
    e.execute(
        "INSERT INTO research_authors(research_id,user_id,role_in_work) VALUES(2,3,'co-author')"
    )
    for status, expected_type in [
        ("approved", "success"),
        ("rejected", "alert"),
        ("needs_revision", "warning"),
    ]:
        if status == "approved":
            wid = 2
        else:
            work = e.call(
                "POST",
                "/research/",
                "S1",
                data=e.form(
                    title_th=SUBMISSION_TITLE + " (" + status + ")", author_ids="[2,3]"
                ),
            )
            wid = work["id"]
        title = e.work(wid)["title_th"]
        before = e.scalar("SELECT max(id) FROM notifications")
        review_page.driver.delete_all_cookies()
        review_page.login("D1")
        review_page.open_review(wid)
        review_page.submit_decision(status)
        review_page.text("บันทึกผลการประเมินผลงานสำเร็จ")
        work = e.work(wid)
        assert work["status"] == status
        assert (work["published_at"] is not None) == (status == "approved")
        assert e.rows(
            "SELECT reviewer_id,status_result,score,comment_text FROM review_comments WHERE research_id=?",
            (wid,),
        ) == [
            {
                "reviewer_id": 5,
                "status_result": status,
                "score": 80,
                "comment_text": "Selenium verified review",
            }
        ]
        notifications = e.rows(
            "SELECT user_id,type FROM notifications WHERE id>? ORDER BY user_id",
            (before,),
        )
        assert notifications == [
            {"user_id": 2, "type": expected_type},
            {"user_id": 3, "type": expected_type},
        ]
        for role in ("S1", "S2"):
            review_page.driver.delete_all_cookies()
            review_page.login(role)
            review_page.notifications()
            review_page.text(title)


def test_tc_041_admin_reassigns_advisor(e, page):
    page.login("D1")
    page.click((By.CSS_SELECTOR, 'a[href="/advisor/advisees"]'))
    page.text(WORK_TITLES[2])
    e.call("POST", "/research/2/assign-advisors", "A1", json=[6])
    assert e.rows("SELECT user_id FROM research_advisors WHERE research_id=2") == [
        {"user_id": 6}
    ]
    assert 2 not in ids(e.call("GET", "/research/pending", "D1"))
    assert 2 in ids(e.call("GET", "/research/pending", "D2"))
    page.driver.refresh()
    page.text("งานในความดูแล")
    page.wait.until(
        lambda d: not d.find_elements(By.CSS_SELECTOR, 'a[href="/research/2"]')
    )
    page.driver.delete_all_cookies()
    page.login("D2")
    page.click((By.CSS_SELECTOR, 'a[href="/advisor/advisees"]'))
    page.text(WORK_TITLES[2])
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
    page.text(WORK_TITLES[1])
    result = e.call("POST", "/favorites/1", "S1")
    assert result["detail"] == "Removed from favorites"
    assert e.call("GET", "/favorites/", "S1") == []
    page.driver.refresh()
    page.wait.until(
        lambda d: WORK_TITLES[1] not in d.find_element(By.TAG_NAME, "body").text
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
    for endpoint in ("suggest-titles", "suggest-keywords"):
        e.call("POST", f"/ai/{endpoint}", "S1", json={})
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
    e.call("POST", "/ai/dashboard-insights", "D1", json={})
    e.call("POST", "/ai/dashboard-insights", status=401, json={})
    e.call("POST", "/ai/chat", status=422, json={"message": "การ"})
    chat = e.call("POST", "/ai/chat", json={"message": "การ", "history": []})
    assert chat["response"] == "Deterministic chat response"
    assert isinstance(chat["relevant_works"], list)
    assert all(w["id"] in {1, 4, 5} for w in chat["relevant_works"])
