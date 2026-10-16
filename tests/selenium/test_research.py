from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from tests.selenium.dataset import DELETE_TITLE, EDITED_TITLE, WORK_TITLES

from .support import PDF, PNG


def ids(rows):
    return {r["id"] for r in rows}


def test_tc_014_search_visibility(e, page):
    page.open("/research?q=การ&category_id=1")
    page.text(WORK_TITLES[1])
    assert WORK_TITLES[2] not in page.driver.find_element(By.TAG_NAME, "body").text
    assert ids(e.call("GET", "/research/search")) == {1, 4, 5}
    assert ids(e.call("GET", "/research/search", "G1")) == {1, 4, 5}
    assert ids(e.call("GET", "/research/search", "S1")) == {1, 2, 4, 5}
    assert ids(e.call("GET", "/research/search", "A1")) == {1, 2, 3, 4, 5}
    assert ids(e.call("GET", "/research/search", params={"category_id": 4})) == {4}


def test_tc_015_search_or_ranking_and_log(e, page):
    # The no-document copy shares the real title: exclude it from this ranking control.
    e.execute("UPDATE research_works SET status='pending',published_at=NULL WHERE id=5")
    title_term = "ระบบแนะนำหัวข้อโครงงานวิจัย"
    abstract_term = "แลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัย"
    query = title_term + " " + abstract_term
    page.open("/research")
    search = page.element('input[type="search"], input[placeholder*="ค้นหา"]')
    for term, expected, absent in ((title_term, 1, 4), (abstract_term, 4, 1)):
        search.clear()
        search.send_keys(term)
        page.wait.until(
            lambda d: d.find_elements(
                By.CSS_SELECTOR, f'a[href="/research/{expected}"]'
            )
        )
        page.wait.until(
            lambda d: (
                not d.find_elements(By.CSS_SELECTOR, f'a[href="/research/{absent}"]')
            )
        )
    search.clear()
    search.send_keys(query)
    page.wait.until(
        lambda d: (
            not d.find_elements(
                By.CSS_SELECTOR, 'a[href="/research/1"], a[href="/research/4"]'
            )
        )
    )
    e.observe(
        "Search UI filters the entire phrase locally; OR ranking and search logs are checked independently through the API."
    )
    before = e.scalar("SELECT count(*) FROM search_logs")
    result = e.call("GET", "/research/search", params={"q": query})
    assert ids(result) == {1, 4}
    assert result[0]["id"] == 1
    assert e.scalar("SELECT count(*) FROM search_logs") == before + 1
    assert e.scalar("SELECT keyword FROM search_logs ORDER BY id DESC LIMIT 1") == query
    for blank in ("", "   "):
        e.call("GET", "/research/search", params={"q": blank})
        assert e.scalar("SELECT count(*) FROM search_logs") == before + 1


def test_tc_017_home_and_stats(e):
    assert [r["id"] for r in e.call("GET", "/home/latest", params={"limit": 1})] == [4]
    assert [r["id"] for r in e.call("GET", "/home/popular", params={"limit": 1})] == [4]
    stats = e.call("GET", "/stats/")
    assert stats == {
        "total_users": e.scalar("SELECT count(*) FROM users"),
        "total_research_works": e.scalar("SELECT count(*) FROM research_works"),
        "total_views": e.scalar("SELECT sum(view_count) FROM research_works"),
        "total_downloads": e.scalar("SELECT sum(download_count) FROM research_works"),
    }


def test_tc_018_detail_view_logs_and_recommendations(e, page):
    before = e.work(1)["view_count"]
    page.open("/research/1")
    page.text(WORK_TITLES[1])
    assert e.work(1)["view_count"] == before + 1
    assert (
        e.scalar(
            "SELECT count(*) FROM download_view_logs WHERE research_id=1 AND action_type='view'"
        )
        == 1
    )
    recommendations = e.call("GET", "/research/1/recommendations")
    assert not ({1, 2, 3} & ids(recommendations))
    assert all(r["status"] == "approved" for r in recommendations)
    assert e.call("GET", "/research/2")["status"] == "pending"
    e.observe(
        "Guest direct detail API exposes the pending documented paper; visibility policy needs review."
    )


def test_tc_020_personalized_recommendations(e):
    guest = e.call("GET", "/research/recommendations/personalized")
    assert len(guest) <= 5 and guest[0]["id"] == 4
    assert all(r["status"] == "approved" for r in guest)
    e.call("POST", "/favorites/1", "S1")
    personalized = e.call("GET", "/research/recommendations/personalized", "S1")
    assert len(personalized) <= 5 and all(
        r["status"] == "approved" for r in personalized
    )
    assert personalized[0]["id"] == 1
    assert personalized[0]["category_id"] == 1


def test_tc_021_participant_roles_and_current_user(e, page):
    page.login()
    selects = page.participants()
    assert "2" in [o.get_attribute("value") for o in selects[0].options]
    assert {"5", "6"} <= {o.get_attribute("value") for o in selects[-1].options}
    participants = e.call("GET", "/research/participants", "S1")
    assert all(p["role"] == "student" and p["id"] != 8 for p in participants["authors"])
    assert all(p["role"] == "advisor" for p in participants["advisors"])
    assert [p["id"] for p in participants["authors"] if p["is_current"]] == [2]
    e.call("GET", "/research/participants", status=401)


def test_tc_023_guest_cannot_submit(e, page):
    before = e.scalar("SELECT count(*) FROM research_works")
    page.open("/student/research/new")
    page.wait.until(lambda d: "/login" in d.current_url)
    e.call("POST", "/research/", status=401, data=e.form())
    e.call("POST", "/research/", "G1", status=403, data=e.form())
    assert e.scalar("SELECT count(*) FROM research_works") == before


def test_tc_024_invalid_participant_ids(e):
    before, files = e.scalar("SELECT count(*) FROM research_works"), e.files()
    invalid_arrays = ["not json", "{}", "[0]", "[-1]", "[true]", '["2"]']
    cases = [
        (field, value, 422)
        for field in ("author_ids", "advisor_ids")
        for value in invalid_arrays
    ]
    cases += [
        ("author_ids", "[999999]", 404),
        ("advisor_ids", "[999999]", 404),
        ("author_ids", "[8]", 404),
        ("author_ids", "[5]", 422),
        ("advisor_ids", "[2]", 422),
        ("category_id", "999999", 404),
    ]
    for field, value, status in cases:
        e.call("POST", "/research/", "S1", status=status, data=e.form(**{field: value}))
        assert e.scalar("SELECT count(*) FROM research_works") == before
        assert e.files() == files
    work = e.call("POST", "/research/", "S1", data=e.form(author_ids="[2,2]"))
    assert e.rows(
        "SELECT user_id FROM research_authors WHERE research_id=?", (work["id"],)
    ) == [{"user_id": 2}]


def test_tc_026_upload_exact_limits(e):
    for field, name, signature, mime, limit in [
        ("cover_image", "limit.png", PNG, "image/png", 5 * 1024 * 1024),
        ("document", "limit.pdf", PDF, "application/pdf", 25 * 1024 * 1024),
    ]:
        content = signature + b" " * (limit - len(signature))
        key = "cover_image_path" if field == "cover_image" else "file_path"
        for size in (limit - 1, limit):
            work = e.call(
                "POST",
                "/research/",
                "S1",
                data=e.form(),
                files={field: (name, content[:size], mime)},
            )
            assert e.storage_path(work[key]).stat().st_size == size
        before, files = e.scalar("SELECT count(*) FROM research_works"), e.files()
        e.call(
            "POST",
            "/research/",
            "S1",
            status=413,
            data=e.form(),
            files={field: (name, content + b"x", mime)},
        )
        assert (
            e.scalar("SELECT count(*) FROM research_works") == before
            and e.files() == files
        )


def test_tc_027_upload_type_signature_and_rollback(e):
    before, files = e.scalar("SELECT count(*) FROM research_works"), e.files()
    for name, content, mime in [
        ("paper.txt", PDF, "application/pdf"),
        ("paper.pdf", PDF, "text/plain"),
        ("paper.pdf", b"invalid signature", "application/pdf"),
        ("paper.pdf", b"", "application/pdf"),
    ]:
        e.call(
            "POST",
            "/research/",
            "S1",
            status=415,
            data=e.form(),
            files={
                "cover_image": ("cover.png", PNG, "image/png"),
                "document": (name, content, mime),
            },
        )
        assert (
            e.scalar("SELECT count(*) FROM research_works") == before
            and e.files() == files
        )

    work = e.call(
        "POST",
        "/research/",
        "S1",
        data=e.form(),
        files={
            "cover_image": ("cover.png", PNG, "image/png"),
            "document": ("paper.pdf", PDF, "application/pdf"),
        },
    )
    old_cover = e.storage_path(work["cover_image_path"])
    old_document = e.storage_path(work["file_path"])
    e.call(
        "PUT",
        f"/research/{work['id']}",
        "S1",
        status=415,
        data=e.form(),
        files={
            "cover_image": ("new-cover.png", PNG, "image/png"),
            "document": ("invalid.pdf", b"invalid signature", "application/pdf"),
        },
    )
    saved = e.work(work["id"])
    assert saved["cover_image_path"] == work["cover_image_path"]
    assert saved["file_path"] == work["file_path"]
    assert old_cover.exists(), (
        "TC-027: failed update removed the previous cover despite database rollback"
    )
    assert old_cover.read_bytes() == PNG and old_document.read_bytes() == PDF


def test_tc_029_edit_resets_pending(e, page):
    page.login()
    page.submit(title=EDITED_TITLE, edit_id=1)
    work = e.call("GET", "/research/1")
    assert work["title_th"] == EDITED_TITLE and work["status"] == "pending"


def test_tc_030_other_student_cannot_edit(e):
    before = e.work(3)
    relations = e.rows("SELECT user_id FROM research_authors WHERE research_id=3")
    e.call(
        "PUT", "/research/3", "S1", status=403, data=e.form(title_th="Denied change")
    )
    e.call(
        "PUT",
        "/research/3",
        "D2",
        status=403,
        data=e.form(title_th="Denied advisor change"),
    )
    assert e.work(3) == before
    assert (
        e.rows("SELECT user_id FROM research_authors WHERE research_id=3") == relations
    )
    assert e.storage_path(before["file_path"]).read_bytes() == PDF


def test_tc_032_owner_deletes_relations_and_files(e, page):
    page.login()
    wid = page.submit(title=DELETE_TITLE)
    e.call("POST", f"/favorites/{wid}", "S1")
    e.call(
        "POST",
        f"/research/{wid}/review",
        "D1",
        json={
            "comment_text": "Delete fixture review",
            "status_result": "approved",
            "score": 80,
        },
    )
    revision_path = e.root / "static" / "delete-fixture-revision.pdf"
    revision_path.write_bytes(PDF)
    e.execute(
        "INSERT INTO file_revisions(research_id,file_path,version_no,uploaded_by,uploaded_at) VALUES(?,?,1,2,'2026-10-01')",
        (wid, "static/" + revision_path.name),
    )
    work = e.work(wid)
    page.open(f"/research/{wid}")
    # Accept the native alert before screenshot/WebDriver evidence can dismiss it.
    with page.recorder.step("ลบผลงานและยืนยัน", work["title_th"], screenshot=True):
        page.driver.find_element(
            By.XPATH, "//button[normalize-space(.)='ลบผลงาน (Delete)']"
        ).click()
        alert = page.wait.until(EC.alert_is_present())
        assert "ลบผลงานวิจัย" in alert.text
        alert.accept()
    page.wait.until(
        lambda _: (
            e.scalar("SELECT count(*) FROM research_works WHERE id=?", (wid,)) == 0
        )
    )
    e.call("GET", f"/research/{wid}", status=404)
    for table in [
        "research_authors",
        "research_advisors",
        "review_comments",
        "file_revisions",
        "favorites",
        "download_view_logs",
    ]:
        assert (
            e.scalar(f"SELECT count(*) FROM {table} WHERE research_id=?", (wid,)) == 0
        )
    assert not e.storage_path(work["file_path"]).exists()
    assert not e.storage_path(work["cover_image_path"]).exists()
    e.observe(
        f"Revision file retained after deleting its database row: {revision_path.exists()}; retention policy requires review"
    )


def test_tc_033_other_student_cannot_delete(e):
    before = e.work(3)
    e.call("DELETE", "/research/3", "S1", status=403)
    assert e.work(3) == before
    assert e.scalar("SELECT count(*) FROM research_authors WHERE research_id=3") == 1


def test_tc_035_download_without_token_or_file(e):
    e.call("POST", "/research/1/download", status=401)
    e.call("POST", "/research/5/download", "S1", status=404)
    e.call("POST", "/research/999999999/download", "S1", status=404)
    assert e.scalar("SELECT sum(download_count) FROM research_works") == 0
    assert (
        e.scalar("SELECT count(*) FROM download_view_logs WHERE action_type='download'")
        == 0
    )
