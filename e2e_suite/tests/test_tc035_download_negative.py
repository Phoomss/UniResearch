"""
Test Case: TC-035 — ไม่มี token หรือไม่มีไฟล์
FR: FR-021; Negative / API
Tester: Sommai Kitikorn

Precondition:
    มีงานวิจัยที่ไม่มีการแนบไฟล์เอกสาร (W5)
Steps:
    1. ส่ง POST /research/{id}/download โดยไม่มี token
    2. ส่ง POST /research/{id}/download สำหรับงานวิจัยที่ไม่มีไฟล์เอกสารแนบ ด้วย token S1
    3. ตรวจสอบ counters การดาวน์โหลด
Expected Result:
    - กรณีไม่มี token ตอบกลับ HTTP 401 Unauthorized
    - กรณีงานวิจัยไม่มีไฟล์ ตอบกลับ HTTP 404 Not Found ("File not found")
    - counter การดาวน์โหลดไม่เพิ่มขึ้น
"""

import pytest
from utils.test_data import unique_research_title


@pytest.mark.api
@pytest.mark.verified_pass
def test_tc035_download_negative(api_client, student_token, default_category_id):
    assert student_token is not None, "Student token is required"
    title_info = unique_research_title("TC035_NoFile")

    # 1. Create research WITHOUT document file
    create_data = {
        "title_th": title_info["title_th"],
        "title_en": title_info["title_en"],
        "category_id": default_category_id
    }
    create_resp = api_client.create_research(student_token, data=create_data)
    assert create_resp.status_code == 200
    work_id = create_resp.json()["id"]

    # 2. Attempt download without token -> 401
    resp_no_token = api_client.download_research(token=None, research_id=work_id)
    assert resp_no_token.status_code == 401, f"Expected 401 for unauthenticated download, got {resp_no_token.status_code}"

    # 3. Attempt download with token for work without file -> 404
    resp_no_file = api_client.download_research(token=student_token, research_id=work_id)
    assert resp_no_file.status_code == 404, f"Expected 404 for work without file, got {resp_no_file.status_code}"
    assert "not found" in resp_no_file.json().get("detail", "").lower()

    # 4. Check download counter remains 0
    detail = api_client.get_research_detail(work_id).json()
    assert detail.get("download_count", 0) == 0, "Download count must not increment on failed downloads"
