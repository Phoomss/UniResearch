"""
Test Case: TC-038 — advisor ที่ได้รับมอบหมายอนุมัติ pending
FR: FR-024; Positive / Web & API
Tester: Sommai Kitikorn

Precondition:
    งานวิจัยสถานะ pending ที่มอบหมายให้อาจารย์ที่ปรึกษา D1
Steps:
    1. ล็อกอินเข้าสู่ระบบด้วยบัญชีอาจารย์ D1
    2. เปิดหน้าตรวจผลงาน /advisor/reviews/{id}
    3. เลือกผลการประเมิน "approved", ระบุคะแนน 80, และกรอกความคิดเห็น
    4. กดยืนยันในหน้าต่าง Modal Confirmation
Expected Result:
    - สถานะผลงานวิจัยเปลี่ยนเป็น approved
    - ตาราง review_comments บันทึก reviewer_id ตรงกับ D1, พร้อมคะแนนและความคิดเห็น
"""

import json
import pytest
from pages.login_page import LoginPage
from pages.advisor_page import AdvisorPage
from utils.test_data import DEFAULT_ADVISOR_1, unique_research_title


@pytest.mark.ui
@pytest.mark.api
@pytest.mark.verified_pass
def test_tc038_advisor_approve_review(driver, base_url, api_client, student_token, advisor_token, default_category_id):
    assert student_token is not None, "Student token is required"
    assert advisor_token is not None, "Advisor token is required"

    # Get D1's user ID
    d1_info = api_client.get_me(advisor_token).json()
    d1_id = d1_info["id"]

    # 1. Create pending work assigned to D1
    title_info = unique_research_title("TC038_ReviewApprove")
    create_data = {
        "title_th": title_info["title_th"],
        "title_en": title_info["title_en"],
        "category_id": default_category_id,
        "advisor_ids": json.dumps([d1_id])
    }
    create_resp = api_client.create_research(student_token, data=create_data)
    assert create_resp.status_code == 200
    work_id = create_resp.json()["id"]

    # 2. Login as D1 in browser
    login_page = LoginPage(driver, base_url)
    login_page.navigate_to_login()
    login_page.login_and_wait_for_redirect(DEFAULT_ADVISOR_1["email"], DEFAULT_ADVISOR_1["password"])

    # 3. Open review page and submit approval
    advisor_page = AdvisorPage(driver, base_url)
    advisor_page.navigate_to_review(work_id)
    advisor_page.submit_review(
        decision="approved",
        score=85,
        comments="ผลงานมีความสมบูรณ์ถูกต้องตามระเบียบวิธีวิจัย ผ่านการอนุมัติ"
    )

    # 4. Verify in backend
    detail = api_client.get_research_detail(work_id).json()
    assert detail["status"] == "approved", f"Status should be approved, got: {detail['status']}"
    assert len(detail.get("reviews", [])) > 0
    latest_rev = detail["reviews"][-1]
    assert latest_rev["reviewer_id"] == d1_id
    assert latest_rev["status_result"] == "approved"
    assert latest_rev["score"] == 85
