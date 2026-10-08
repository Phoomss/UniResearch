import json

from selenium.webdriver.common.by import By

from .support import PDF, PNG


def ids(rows):
    return {r["id"] for r in rows}


def test_tc_014_search_visibility(e, page):
    page.open("/research?q=Selenium&category_id=1")
    page.text("W1 งานวิจัย Selenium")
    assert (
        "W2 งานวิจัย Selenium" not in page.driver.find_element(By.TAG_NAME, "body").text
    )
    assert ids(e.call("GET", "/research/search")) == {1, 4, 5}
    assert ids(e.call("GET", "/research/search", "G1")) == {1, 4, 5}
    assert ids(e.call("GET", "/research/search", "S1")) == {1, 2, 4, 5}
    assert ids(e.call("GET", "/research/search", "A1")) == {1, 2, 3, 4, 5}
    assert ids(e.call("GET", "/research/search", params={"category_id": 2})) == {4}


def test_tc_015_search_or_ranking_and_log(e):
    e.execute(
        "UPDATE research_works SET title_th='ranktitle',title_en='unrelated',abstract='unrelated',keywords='' WHERE id=1"
    )
    e.execute(
        "UPDATE research_works SET title_th='unrelated',title_en='unrelated',abstract='rankabstract',keywords='' WHERE id=4"
    )
    before = e.scalar("SELECT count(*) FROM search_logs")
    result = e.call("GET", "/research/search", params={"q": "ranktitle rankabstract"})
    assert ids(result) == {1, 4}
    assert result[0]["id"] == 1
    assert e.scalar("SELECT count(*) FROM search_logs") == before + 1
    assert (
        e.scalar("SELECT keyword FROM search_logs ORDER BY id DESC LIMIT 1")
        == "ranktitle rankabstract"
    )


def test_tc_016_suggestions_hide_pending(e, page):
    page.open("/research")
    # The same endpoint feeds the browser's debounced suggestion widget.
    search = page.element('input[type="search"], input[placeholder*="ค้นหา"]')
    search.send_keys("publickeyword")
    page.wait.until(
        lambda d: "publickeyword" in d.find_element(By.TAG_NAME, "body").text
    )
    assert "pendingsecret" not in page.driver.find_element(By.TAG_NAME, "body").text
    public = e.call(
        "GET", "/research/search/suggestions", params={"q": "publickeyword"}
    )
    assert "publickeyword" in json.dumps(public)
    private = e.call(
        "GET", "/research/search/suggestions", params={"q": "pendingsecret"}
    )
    assert "pendingsecret" not in json.dumps(private) and "W2" not in json.dumps(
        private
    )


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
    page.text("W1 งานวิจัย Selenium")
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
        "Guest direct detail API exposes pending W2, as documented; visibility policy needs review."
    )


def test_tc_019_unknown_detail(e, page):
    e.call("GET", "/research/999999999", status=404)
    page.open("/research/999999999")
    page.text("รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ")
    assert (
        e.scalar("SELECT count(*) FROM download_view_logs WHERE research_id=999999999")
        == 0
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


def assert_submission(e, wid):
    work = e.work(wid)
    assert work["status"] == "pending" and work["submitted_by_id"] == 2
    assert e.rows(
        "SELECT user_id FROM research_authors WHERE research_id=?", (wid,)
    ) == [{"user_id": 2}]
    assert e.rows(
        "SELECT user_id FROM research_advisors WHERE research_id=?", (wid,)
    ) == [{"user_id": 5}]
    assert e.storage_path(work["file_path"]).read_bytes() == PDF
    assert e.storage_path(work["cover_image_path"]).read_bytes() == PNG
    assert e.scalar("SELECT count(*) FROM research_works WHERE status='draft'") == 0


def test_tc_022_complete_submission(e, page):
    page.login()
    assert_submission(e, page.submit())


def test_tc_023_guest_cannot_submit(e, page):
    before = e.scalar("SELECT count(*) FROM research_works")
    page.open("/student/research/new")
    page.wait.until(lambda d: "/login" in d.current_url)
    e.call("POST", "/research/", status=401, data=e.form())
    e.call("POST", "/research/", "G1", status=403, data=e.form())
    assert e.scalar("SELECT count(*) FROM research_works") == before


def test_tc_024_invalid_participant_ids(e):
    before, files = e.scalar("SELECT count(*) FROM research_works"), e.files()
    for field, value, status in [
        ("author_ids", "not json", 422),
        ("author_ids", "{}", 422),
        ("author_ids", "[0]", 422),
        ("author_ids", "[true]", 422),
        ("author_ids", "[999999]", 404),
        ("author_ids", "[5]", 422),
        ("advisor_ids", "[2]", 422),
    ]:
        e.call("POST", "/research/", "S1", status=status, data=e.form(**{field: value}))
    assert (
        e.scalar("SELECT count(*) FROM research_works") == before and e.files() == files
    )


def test_tc_025_author_year_prefix(e, page):
    page.login()
    selects = page.participants()
    values = {o.get_attribute("value") for o in selects[0].options}
    assert {"2", "3"} <= values and "4" not in values
    before = e.scalar("SELECT count(*) FROM research_works")
    e.call("POST", "/research/", "S1", status=422, data=e.form(author_ids="[2,4]"))
    assert e.scalar("SELECT count(*) FROM research_works") == before


def test_tc_026_upload_exact_limits(e):
    for field, name, signature, mime, limit in [
        ("cover_image", "limit.png", PNG, "image/png", 5 * 1024 * 1024),
        ("document", "limit.pdf", PDF, "application/pdf", 25 * 1024 * 1024),
    ]:
        content = signature + b" " * (limit - len(signature))
        work = e.call(
            "POST",
            "/research/",
            "S1",
            data=e.form(),
            files={field: (name, content, mime)},
        )
        key = "cover_image_path" if field == "cover_image" else "file_path"
        assert e.storage_path(work[key]).stat().st_size == limit
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


def test_tc_028_my_research_includes_coauthored(e, page):
    # This TC's fixture specifies exactly W1/W4, unlike TC-022's pending W2.
    e.execute("UPDATE research_works SET submitted_by_id=3 WHERE id=2")
    e.execute("UPDATE research_authors SET user_id=3 WHERE research_id=2")
    page.login()
    page.open("/student/research")
    page.text("W1 งานวิจัย Selenium")
    page.text("W4 งานวิจัย Selenium")
    assert (
        "W3 งานวิจัย Selenium" not in page.driver.find_element(By.TAG_NAME, "body").text
    )
    assert ids(e.call("GET", "/research/my", "S1")) == {1, 4}


def test_tc_029_edit_resets_pending(e, page):
    page.login()
    page.submit(title="Changed research", edit_id=1)
    work = e.call("GET", "/research/1")
    assert work["title_th"] == "Changed research" and work["status"] == "pending"


def test_tc_030_other_student_cannot_edit(e):
    before = e.work(3)
    relations = e.rows("SELECT user_id FROM research_authors WHERE research_id=3")
    e.call(
        "PUT", "/research/3", "S1", status=403, data=e.form(title_th="Denied change")
    )
    assert e.work(3) == before
    assert (
        e.rows("SELECT user_id FROM research_authors WHERE research_id=3") == relations
    )


def test_tc_031_revision_archives_previous_file(e, page):
    e.execute("UPDATE research_works SET status='needs_revision' WHERE id=2")
    old = e.work(2)["file_path"]
    e.execute(
        "INSERT INTO file_revisions(research_id,file_path,version_no,uploaded_by,uploaded_at) VALUES(2,?,1,2,'2026-10-01')",
        (old,),
    )
    page.login()
    page.submit(title="Revised research", edit_id=2)
    work = e.work(2)
    assert work["status"] == "pending" and work["file_path"] != old
    latest = e.rows(
        "SELECT file_path,version_no FROM file_revisions WHERE research_id=2 ORDER BY version_no DESC"
    )[0]
    assert latest == {"file_path": old, "version_no": 2}
    assert (
        e.storage_path(old).exists()
        and e.storage_path(work["file_path"]).read_bytes() == PDF
    )


def test_tc_032_owner_deletes_relations_and_files(e, page):
    page.login()
    wid = page.submit(title="Delete this research")
    e.call("POST", f"/favorites/{wid}", "S1")
    work = e.work(wid)
    page.open(f"/research/{wid}")
    page.button("ลบผลงาน (Delete)")
    page.wait.until(lambda d: d.switch_to.alert)
    page.driver.switch_to.alert.accept()
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


def test_tc_033_other_student_cannot_delete(e):
    before = e.work(3)
    e.call("DELETE", "/research/3", "S1", status=403)
    assert e.work(3) == before
    assert e.scalar("SELECT count(*) FROM research_authors WHERE research_id=3") == 1


def test_tc_034_download_counts_and_public_static_file(e, page):
    page.login()
    page.open("/research/1")
    result = e.call("POST", "/research/1/download", "S1")
    url = result["file_url"]
    assert (
        e.http.get(url, headers={"Authorization": "Bearer " + e.token()}).content == PDF
    )
    assert e.work(1)["download_count"] == 1
    assert e.rows(
        "SELECT user_id,action_type FROM download_view_logs WHERE action_type='download'"
    ) == [{"user_id": 2, "action_type": "download"}]
    page.driver.delete_all_cookies()
    page.driver.get(e.backend + url)
    assert e.http.get(url).content == PDF
    assert e.work(1)["download_count"] == 1
    e.observe(
        "Static PDF is accessible without authentication; direct access does not increment download_count."
    )


def test_tc_035_download_without_token_or_file(e):
    e.call("POST", "/research/1/download", status=401)
    e.call("POST", "/research/5/download", "S1", status=404)
    assert e.scalar("SELECT sum(download_count) FROM research_works") == 0
    assert (
        e.scalar("SELECT count(*) FROM download_view_logs WHERE action_type='download'")
        == 0
    )
