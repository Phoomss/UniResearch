"""Independent persistence assertions shared by Narongsak browser cases."""

from .dataset import submission_fields
from .support import PDF, PNG


def ids(rows):
    return {r["id"] for r in rows}


def assert_submission(e, wid):
    work = e.work(wid)
    assert work["status"] == "pending" and work["submitted_by_id"] == 2, (
        "Submission must be pending and owned by S1"
    )
    values = submission_fields(work["title_th"])
    for field in (
        "title_en",
        "category_id",
        "department",
        "work_type",
        "academic_year",
    ):
        assert work[field] == values[field], (
            f"Submission field {field} differs from migration source"
        )
    assert [k.strip() for k in work["keywords"].split(",")] == [
        k.strip() for k in values["keywords"].split(",")
    ]
    assert work["abstract"] == values["abstract"], (
        "Submission abstract differs from the migration source"
    )
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
