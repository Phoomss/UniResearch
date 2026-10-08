"""
Test Case: TC-017 — latest/popular และสถิติ
FR: FR-010; Positive / Web & API
Tester: Sommai Kitikorn

Precondition:
    มีงานวิจัยสถานะ approved และ pending ในระบบ
Steps:
    1. ส่ง GET /home/latest?limit=1
    2. ส่ง GET /home/popular?limit=1
    3. ส่ง GET /stats/
Expected Result:
    - latest และ popular คืนรายการสถานะ approved เท่านั้น และเรียงลำดับถูกต้อง
    - stats คืนตัวเลข total_users, total_research_works, total_views, total_downloads สอดคล้องกับฐานข้อมูล
"""

import pytest


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc017_home_latest_popular_stats(api_client):
    # 1. Latest
    latest_resp = api_client.get_latest_home(limit=1)
    assert latest_resp.status_code == 200
    latest_works = latest_resp.json()
    assert len(latest_works) <= 1
    if latest_works:
        assert latest_works[0]["status"] == "approved"
        assert latest_works[0]["published_at"] is not None

    # 2. Popular
    popular_resp = api_client.get_popular_home(limit=1)
    assert popular_resp.status_code == 200
    popular_works = popular_resp.json()
    assert len(popular_works) <= 1
    if popular_works:
        assert popular_works[0]["status"] == "approved"
        assert "view_count" in popular_works[0]

    # 3. Stats
    stats_resp = api_client.get_stats()
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert "total_users" in stats
    assert "total_research_works" in stats
    assert "total_views" in stats
    assert "total_downloads" in stats
    assert stats["total_users"] >= 0
    assert stats["total_research_works"] >= 0
