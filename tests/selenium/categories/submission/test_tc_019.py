import pytest


@pytest.mark.submission
def test_tc_019_unknown_detail(e, page):
    e.call("GET", "/research/999999999", status=404)
    page.open("/research/999999999")
    page.text("รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ")
    assert (
        e.scalar("SELECT count(*) FROM download_view_logs WHERE research_id=999999999")
        == 0
    ), (
        "TC-019: expected e.scalar('SELECT count(*) FROM download_view_logs WHERE research_id=999999999') == 0"
    )
