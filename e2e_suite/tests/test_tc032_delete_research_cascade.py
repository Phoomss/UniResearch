"""
Test Case: TC-032 — เจ้าของลบงานพร้อมข้อมูลสัมพันธ์
FR: FR-020; Positive / Web & API
Tester: Sommai Kitikorn

Precondition:
    งานวิจัยที่มีความสัมพันธ์กับ authors, advisors, favorites และไฟล์เอกสาร
Steps:
    1. สร้างงานวิจัยโดยนักศึกษา S1
    2. ส่งคำสั่ง DELETE /research/{id} โดยเจ้าของผลงาน
    3. ส่ง GET /research/{id} เพื่อตรวจสอบ
Expected Result:
    - DELETE สำเร็จ (HTTP 200)
    - GET ดึงข้อมูลผลงานตอบกลับ HTTP 404 Not Found
    - ข้อมูลความสัมพันธ์และไฟล์ถูกลบออกจากระบบอย่างถูกต้อง
"""

import pytest
from utils.test_data import unique_research_title


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc032_delete_research_cascade(api_client, student_token, default_category_id):
    assert student_token is not None, "Student token is required"
    title_info = unique_research_title("TC032_DeleteCascade")

    # 1. Create research
    create_data = {
        "title_th": title_info["title_th"],
        "title_en": title_info["title_en"],
        "category_id": default_category_id
    }
    create_resp = api_client.create_research(student_token, data=create_data)
    assert create_resp.status_code == 200
    work_id = create_resp.json()["id"]

    # Add interaction (favorite)
    api_client.toggle_favorite(student_token, work_id)

    # 2. DELETE /research/{id}
    del_resp = api_client.delete_research(student_token, work_id)
    assert del_resp.status_code == 200, f"Delete failed: {del_resp.text}"

    # 3. GET /research/{id} -> 404
    get_resp = api_client.get_research_detail(work_id)
    assert get_resp.status_code == 404, f"Expected 404 Not Found after deletion, got {get_resp.status_code}"
