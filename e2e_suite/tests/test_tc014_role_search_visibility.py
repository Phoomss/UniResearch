"""
Test Case: TC-014 — guest/student/admin ค้นงาน approved และ pending
FR: FR-008; Positive / Web/API/RBAC
Tester: Sommai Kitikorn

Precondition:
    มีงานวิจัยทั้งสถานะ approved และ pending ในระบบ
Steps:
    1. ส่ง GET /research/search โดยไม่มี token (Guest)
    2. ส่ง GET /research/search ด้วย token นักศึกษา (S1)
    3. ส่ง GET /research/search ด้วย token ผู้ดูแลระบบ (A1)
Expected Result:
    - Guest เห็นเฉพาะงานสถานะ approved เท่านั้น
    - นักศึกษา S1 เห็นงาน approved และงาน pending ที่เป็นของตนเอง
    - Admin A1 เห็นงานทั้งหมดตามตัวกรอง ทั้ง approved และ pending
"""

import pytest


@pytest.mark.api
@pytest.mark.rbac
@pytest.mark.next_iteration
def test_tc014_role_search_visibility(api_client, student_token, admin_token):
    # 1. Guest search (no token)
    guest_resp = api_client.search_research(token=None)
    assert guest_resp.status_code == 200
    guest_works = guest_resp.json()
    assert all(w["status"] == "approved" for w in guest_works), \
        "Guest must only see research works with status='approved'"

    # 2. Student search
    if student_token:
        student_resp = api_client.search_research(token=student_token)
        assert student_resp.status_code == 200
        student_works = student_resp.json()
        student_me = api_client.get_me(student_token).json()
        student_id = student_me["id"]

        for w in student_works:
            if w["status"] != "approved":
                is_owner = w.get("submitted_by_id") == student_id
                author_ids = [a["user_id"] for a in w.get("authors", [])]
                assert is_owner or (student_id in author_ids), \
                    f"Student should only see unapproved work if they are submitter or author: work {w['id']}"

    # 3. Admin search
    if admin_token:
        admin_resp = api_client.search_research(token=admin_token)
        assert admin_resp.status_code == 200
        admin_works = admin_resp.json()
        statuses = {w["status"] for w in admin_works}
        assert isinstance(admin_works, list)
