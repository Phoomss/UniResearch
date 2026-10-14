import pytest

from tests.selenium.support import PDF


@pytest.mark.submission
def test_tc_034_active_user_downloads_available_document(e, document_page):
    document_page.login()
    before = e.work(1)["download_count"]
    destination = document_page.download(1)
    assert destination.read_bytes() == PDF, (
        "Browser download must contain the seeded PDF"
    )
    assert e.work(1)["download_count"] == before + 1, (
        "UI download must increment the counter once"
    )
    assert e.rows(
        "SELECT user_id,action_type FROM download_view_logs WHERE action_type='download'"
    ) == [{"user_id": 2, "action_type": "download"}], (
        "Download must be attributed to the active student"
    )
