import pytest

from tests.selenium.support import PDF


@pytest.mark.submission
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
        and e.storage_path(work["file_path"]).read_bytes() == PDF
    ), (
        "TC-031: expected e.storage_path(old).exists() and e.storage_path(work['file_path']).read_bytes() == PDF"
    )
