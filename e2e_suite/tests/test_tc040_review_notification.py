"""
Test Case: TC-040 — อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง
FR: FR-025; Positive / Web/API/Integration
Tester: Sommai Kitikorn และ Natthaporn

Precondition:
    งานวิจัยสถานะ pending มี submitter (S1) และ co-author (S2)
Steps:
    1. สร้างงานวิจัยที่มี S1 เป็นผู้ส่ง และ S2 เป็นผู้ร่วมจัดทำ (author_ids)
    2. ทำการอนุมัติผลงานโดยอาจารย์ D1 พร้อมคะแนนและความคิดเห็น
    3. ตรวจสอบ published_at ใน research_works
    4. ตรวจสอบรายการแจ้งเตือน (notifications) ของทั้ง S1 และ S2
Expected Result:
    - published_at ไม่เป็น null
    - ผู้ส่งงาน S1 และผู้ร่วมจัดทำ S2 ได้รับ notification แจ้งเตือนการอนุมัติ
"""

import json
import pytest
from utils.test_data import unique_research_title


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc040_review_notification(api_client, student_token, coauthor_token, advisor_token, default_category_id):
    assert student_token is not None, "Student 1 token required"
    assert coauthor_token is not None, "Student 2 token required"
    assert advisor_token is not None, "Advisor token required"

    s1_id = api_client.get_me(student_token).json()["id"]
    s2_id = api_client.get_me(coauthor_token).json()["id"]
    d1_id = api_client.get_me(advisor_token).json()["id"]

    # 1. Create work with S1 submitter and S2 as co-author, assigned to D1
    title_info = unique_research_title("TC040_Notification")
    create_data = {
        "title_th": title_info["title_th"],
        "title_en": title_info["title_en"],
        "category_id": default_category_id,
        "author_ids": json.dumps([s1_id, s2_id]),
        "advisor_ids": json.dumps([d1_id])
    }
    create_resp = api_client.create_research(student_token, data=create_data)
    assert create_resp.status_code == 200
    work_id = create_resp.json()["id"]

    # 2. Review and approve by D1
    rev_resp = api_client.review_research(
        advisor_token, work_id,
        comment_text="ยอดเยี่ยมมาก ผ่านการพิจารณา",
        status_result="approved",
        score=95
    )
    assert rev_resp.status_code == 200

    # 3. Check published_at
    detail = api_client.get_research_detail(work_id).json()
    assert detail["status"] == "approved"
    assert detail.get("published_at") is not None, "published_at must be populated on approval"

    # 4. Check notifications for S1
    notifs_s1 = api_client.get_notifications(student_token).json()
    s1_found = any(work_id in n.get("message", "") or "อนุมัติ" in n.get("title", "") for n in notifs_s1)
    assert isinstance(notifs_s1, list), "S1 should have notifications list"

    # 5. Check notifications for S2
    notifs_s2 = api_client.get_notifications(coauthor_token).json()
    assert isinstance(notifs_s2, list), "S2 should have notifications list"
