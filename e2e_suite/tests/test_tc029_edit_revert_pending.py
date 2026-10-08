"""
Test Case: TC-029 — ผู้มีสิทธิ์แก้แล้วกลับ pending
FR: FR-018; Positive / Web & API
Tester: Sommai Kitikorn

Precondition:
    งานวิจัยสถานะ approved ที่เป็นของตนเอง (W1 ของ S1)
Steps:
    1. สร้างงานวิจัยและอนุมัติให้เป็นสถานะ approved
    2. แก้ไขข้อมูลผลงาน (ชื่อ, บทคัดย่อ) ผ่าน PUT /research/{id}
    3. ตรวจสอบข้อมูลผ่าน GET /research/{id}
Expected Result:
    - ข้อมูลใหม่ถูกบันทึกสำเร็จ
    - สถานะของงานวิจัยเปลี่ยนกลับเป็น pending เพื่อรอการตรวจประเมินใหม่
"""

import pytest
from utils.test_data import unique_research_title


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc029_edit_revert_pending(api_client, student_token, admin_token, default_category_id):
    assert student_token is not None, "Student token is required"
    title_info = unique_research_title("TC029_Edit")

    # 1. Create research as S1
    create_data = {
        "title_th": title_info["title_th"],
        "title_en": title_info["title_en"],
        "category_id": default_category_id,
        "abstract": "บทคัดย่อเริ่มต้นก่อนการแก้ไข"
    }
    create_resp = api_client.create_research(student_token, data=create_data)
    assert create_resp.status_code == 200, f"Creation failed: {create_resp.text}"
    work_id = create_resp.json()["id"]

    # 2. Approve it using admin review to make it approved
    if admin_token:
        review_resp = api_client.review_research(
            admin_token, work_id,
            comment_text="Initial approval",
            status_result="approved",
            score=90
        )
        assert review_resp.status_code == 200
        # Verify it became approved
        detail_before = api_client.get_research_detail(work_id).json()
        assert detail_before["status"] == "approved"

    # 3. Edit research by S1
    updated_title_th = f"{title_info['title_th']} (ฉบับแก้ไข)"
    updated_abstract = "บทคัดย่อที่ได้รับการปรับปรุงแก้ไขใหม่ล่าสุด"
    update_data = {
        "title_th": updated_title_th,
        "title_en": title_info["title_en"],
        "category_id": default_category_id,
        "abstract": updated_abstract
    }

    update_resp = api_client.update_research(student_token, work_id, data=update_data)
    assert update_resp.status_code == 200, f"Update failed: {update_resp.text}"

    # 4. Verify status reverted to pending and changes persisted
    detail_after = api_client.get_research_detail(work_id).json()
    assert detail_after["title_th"] == updated_title_th
    assert detail_after["abstract"] == updated_abstract
    assert detail_after["status"] == "pending", f"Status should revert to pending, got: {detail_after['status']}"
