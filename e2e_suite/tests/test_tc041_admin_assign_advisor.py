"""
Test Case: TC-041 — admin เปลี่ยน advisor; student ถูกห้าม
FR: FR-026; Positive / Web/API/RBAC
Tester: Sommai Kitikorn

Precondition:
    งานวิจัยที่มอบหมายให้อาจารย์ D1 และมีอาจารย์ D2 ในระบบ
Steps:
    1. ผู้ดูแลระบบ A1 ส่ง POST /research/{id}/assign-advisors กำหนดให้เป็น [D2]
    2. ส่ง GET /research/pending ด้วย token D1 และ D2
    3. ส่ง POST /research/{id}/assign-advisors ซ้ำด้วย token นักศึกษา S1
Expected Result:
    - ความสัมพันธ์เปลี่ยนเป็นอาจารย์ D2
    - อาจารย์ D2 มองเห็นงานในคิวตรวจ (/pending) ส่วน D1 ไม่เห็น
    - นักศึกษา S1 ได้รับการตอบกลับ HTTP 403 Forbidden
"""

import json
import pytest
from utils.test_data import unique_research_title


@pytest.mark.api
@pytest.mark.rbac
@pytest.mark.next_iteration
def test_tc041_admin_assign_advisor(api_client, admin_token, student_token, advisor_token, advisor2_token, default_category_id):
    assert admin_token is not None, "Admin token required"
    assert student_token is not None, "Student token required"
    assert advisor_token is not None, "Advisor 1 token required"
    assert advisor2_token is not None, "Advisor 2 token required"

    d1_id = api_client.get_me(advisor_token).json()["id"]
    d2_id = api_client.get_me(advisor2_token).json()["id"]

    # 1. Create work initially assigned to D1
    title_info = unique_research_title("TC041_Assign")
    create_data = {
        "title_th": title_info["title_th"],
        "title_en": title_info["title_en"],
        "category_id": default_category_id,
        "advisor_ids": json.dumps([d1_id])
    }
    create_resp = api_client.create_research(student_token, data=create_data)
    assert create_resp.status_code == 200
    work_id = create_resp.json()["id"]

    # 2. Student attempts to assign advisors -> 403 Forbidden
    student_assign = api_client.assign_advisors(student_token, work_id, [d2_id])
    assert student_assign.status_code == 403, f"Expected 403 Forbidden for student assign, got: {student_assign.status_code}"

    # 3. Admin assigns advisor D2
    admin_assign = api_client.assign_advisors(admin_token, work_id, [d2_id])
    assert admin_assign.status_code == 200, f"Admin assign failed: {admin_assign.text}"

    # 4. Verify D2 sees work in pending queue, D1 does not
    d2_pending = api_client.get_pending_research(advisor2_token).json()
    d2_work_ids = [w["id"] for w in d2_pending]
    assert work_id in d2_work_ids, f"Work {work_id} should be visible in D2's pending queue"

    d1_pending = api_client.get_pending_research(advisor_token).json()
    d1_work_ids = [w["id"] for w in d1_pending]
    assert work_id not in d1_work_ids, f"Work {work_id} should NOT be visible in D1's pending queue anymore"
