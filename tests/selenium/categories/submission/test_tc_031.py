import pytest

from tests.selenium.dataset import REVISED_TITLE
from tests.selenium.support import PDF


@pytest.mark.submission
def test_tc_031_revision_archives_previous_file(e, page):
    e.execute("UPDATE research_works SET status='needs_revision' WHERE id=2")
    old = e.work(2)["file_path"]
    e.execute(
        "INSERT INTO file_revisions(research_id,file_path,version_no,uploaded_by,uploaded_at) VALUES(2,?,1,2,'2026-10-01')",
        (old,),
    )
    e.document_content = PDF + b"\n% Revised Selenium document\n"
    page.login()
    assert page.visible_status(2, "ส่งกลับแก้ไข") == "ส่งกลับแก้ไข"
    page.submit(title=REVISED_TITLE, edit_id=2)
    assert page.my_submission_status(REVISED_TITLE) == "รอตรวจสอบ", (
        "Revised migration paper must return to pending in the UI"
    )
    work = e.work(2)
    assert work["status"] == "pending" and work["file_path"] != old, (
        "TC-031: expected work['status'] == 'pending' and work['file_path'] != old"
    )
    latest = e.rows(
        "SELECT file_path,version_no FROM file_revisions WHERE research_id=2 ORDER BY version_no DESC"
    )[0]
    assert latest == {"file_path": old, "version_no": 2}, (
        "TC-031: expected latest == {'file_path': old, 'version_no': 2}"
    )
    assert (
        e.storage_path(old).exists()
        and e.storage_path(work["file_path"]).read_bytes() == e.document_content
    ), (
        "TC-031: expected e.storage_path(old).exists() and e.storage_path(work['file_path']).read_bytes() == e.document_content"
    )

    # First archived revision starts at 1; a metadata-only revision adds no archive.
    fresh = e.call(
        "POST",
        "/research/",
        "S1",
        data=e.form(),
        files={"document": ("first.pdf", PDF, "application/pdf")},
    )
    wid = fresh["id"]
    e.execute("UPDATE research_works SET status='needs_revision' WHERE id=?", (wid,))
    e.call(
        "PUT",
        f"/research/{wid}",
        "S1",
        data=e.form(),
        files={"document": ("second.pdf", PDF + b"\n% changed", "application/pdf")},
    )
    assert e.rows(
        "SELECT version_no,file_path FROM file_revisions WHERE research_id=?", (wid,)
    ) == [{"version_no": 1, "file_path": fresh["file_path"]}]
    e.execute("UPDATE research_works SET status='needs_revision' WHERE id=?", (wid,))
    e.call("PUT", f"/research/{wid}", "S1", data=e.form())
    assert (
        e.scalar("SELECT count(*) FROM file_revisions WHERE research_id=?", (wid,)) == 1
    )
