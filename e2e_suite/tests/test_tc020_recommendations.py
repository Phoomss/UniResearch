"""
Test Case: TC-020 — ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ
FR: FR-012; Positive / API
Tester: Sommai Kitikorn

Precondition:
    มีงานวิจัยสถานะ approved ในหลายหมวดหมู่
Steps:
    1. ส่ง GET /research/recommendations/personalized โดยไม่มี token
    2. ส่ง GET /research/recommendations/personalized ด้วย token นักศึกษา S1
Expected Result:
    - ผลลัพธ์มีเฉพาะงานสถานะ approved จำนวนไม่เกิน 5 รายการ
    - ผู้ไม่ล็อกอินได้คำแนะนำตามความนิยม (view/download)
    - ผู้ใช้ที่มีประวัติการกด favorite/เข้าชม ได้รับคำแนะนำที่ปรับตามความสนใจ
"""

import pytest


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc020_recommendations(api_client, student_token):
    # 1. Unauthenticated recommendation
    anon_resp = api_client.get_personalized_recommendations(token=None)
    assert anon_resp.status_code == 200
    anon_works = anon_resp.json()
    assert isinstance(anon_works, list)
    assert len(anon_works) <= 5
    assert all(w["status"] == "approved" for w in anon_works)

    # 2. Authenticated recommendation
    if student_token:
        auth_resp = api_client.get_personalized_recommendations(token=student_token)
        assert auth_resp.status_code == 200
        auth_works = auth_resp.json()
        assert isinstance(auth_works, list)
        assert len(auth_works) <= 5
        assert all(w["status"] == "approved" for w in auth_works)
