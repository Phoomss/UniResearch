"""Independent persistence assertions shared by Narongsak browser cases."""

from .support import PDF, PNG


def ids(rows):
    return {r["id"] for r in rows}


def assert_submission(e, wid):
    work = e.work(wid)
    assert work["status"] == "pending" and work["submitted_by_id"] == 2, (
        "Submission must be pending and owned by S1"
    )
    expected = {
        "title_en": "Selenium Research",
        "category_id": 1,
        "department": "วิทยาการคอมพิวเตอร์",
        "work_type": "วิทยานิพนธ์",
        "academic_year": 2569,
    }
    for field, value in expected.items():
        assert work[field] == value, (
            f"Submission field {field}: expected {value!r}, got {work[field]!r}"
        )
    assert [keyword.strip() for keyword in work["keywords"].split(",")] == [
        "selenium",
        "research",
    ], "Submission must persist both keywords in order"
    assert work["abstract"], "Complete submission must retain the abstract"
    assert e.rows(
        "SELECT user_id FROM research_authors WHERE research_id=?", (wid,)
    ) == [{"user_id": 2}], "Submission must retain S1 as author"
    assert e.rows(
        "SELECT user_id FROM research_advisors WHERE research_id=?", (wid,)
    ) == [{"user_id": 5}], "Submission must assign D1 as advisor"
    assert e.storage_path(work["file_path"]).read_bytes() == PDF, (
        "Stored document differs from uploaded PDF"
    )
    assert e.storage_path(work["cover_image_path"]).read_bytes() == PNG, (
        "Stored cover differs from uploaded PNG"
    )
    assert e.scalar("SELECT count(*) FROM research_works WHERE status='draft'") == 0, (
        "No incomplete draft may be persisted"
    )


def assert_review(e, wid=2):
    work = e.call("GET", f"/research/{wid}")
    assert work["status"] == "approved", "Advisor review must approve the submission"
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
    ], "Review must retain D1, score 80, approval and comment"
