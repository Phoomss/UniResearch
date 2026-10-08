"""
Test Case: TC-047 — เว็บส่งงานแล้ว advisor ตรวจ
FR: FR-032; High / Positive / E2E
Tester: Narongsak, Sommai Kitikorn และ Natthaporn

Precondition:
    backend/frontend และบัญชีทดสอบพร้อม (S1, D1, C1)
Steps:
    1. ล็อกอิน S1 ผ่านเว็บ ส่งงานผ่าน /student/research/new พร้อมไฟล์ PDF
    2. บันทึก ID งานวิจัยและตรวจสอบสถานะเริ่มต้นเป็น pending
    3. ล็อกอิน D1 ผ่านเว็บ เปิดหน้า /advisor/reviews/{id} และส่งผลตรวจเป็น approved
Expected Result:
    - ผลงานเริ่มต้นด้วยสถานะ pending และปรากฏในคิวของ D1
    - หลังการประเมิน สถานะผลงานเปลี่ยนเป็น approved ทั้งในหน้าเว็บและฐานข้อมูล
"""

import os
import pytest
from pages.login_page import LoginPage
from pages.student_page import StudentPage
from pages.advisor_page import AdvisorPage
from utils.test_data import DEFAULT_STUDENT_1, DEFAULT_ADVISOR_1, unique_research_title
from utils.file_helpers import create_mock_png, create_mock_pdf, cleanup_temp_file


@pytest.mark.ui
@pytest.mark.e2e
@pytest.mark.next_iteration
def test_tc047_e2e_submit_and_review(driver, base_url, api_client, advisor_token):
    assert advisor_token is not None, "Advisor token is required"
    title_info = unique_research_title("TC047_FullE2E")
    
    # Create temporary mock files
    cover_file = create_mock_png(2048, "tc047_cover.png")
    doc_file = create_mock_pdf(4096, "tc047_paper.pdf")

    try:
        # Get D1's ID to select as advisor
        d1_info = api_client.get_me(advisor_token).json()
        d1_id = d1_info["id"]

        # 1. Login as Student S1
        login_page = LoginPage(driver, base_url)
        login_page.navigate_to_login()
        login_page.login_and_wait_for_redirect(DEFAULT_STUDENT_1["email"], DEFAULT_STUDENT_1["password"])

        # 2. Complete research submission wizard
        student_page = StudentPage(driver, base_url)
        student_page.submit_new_research(
            title_th=title_info["title_th"],
            title_en=title_info["title_en"],
            category_index=1,
            advisor_id=d1_id,
            abstract="บทคัดย่องานวิจัยสำหรับการทดสอบ E2E สมบูรณ์แบบ",
            cover_path=cover_file,
            doc_path=doc_file
        )

        # Retrieve created work ID from API
        student_token = api_client.get_token(DEFAULT_STUDENT_1["email"], DEFAULT_STUDENT_1["password"])
        search_res = api_client.search_research(token=student_token, q=title_info["title_th"]).json()
        assert len(search_res) > 0, "Submitted work should be found"
        work = search_res[0]
        work_id = work["id"]
        assert work["status"] == "pending", f"Initial status must be pending, got: {work['status']}"

        # 3. Logout student session
        login_page.logout_via_api()

        # 4. Login as Advisor D1
        login_page.navigate_to_login()
        login_page.login_and_wait_for_redirect(DEFAULT_ADVISOR_1["email"], DEFAULT_ADVISOR_1["password"])

        # 5. Review and approve work
        advisor_page = AdvisorPage(driver, base_url)
        advisor_page.navigate_to_review(work_id)
        advisor_page.submit_review(
            decision="approved",
            score=90,
            comments="ผลงานวิจัยผ่านการประเมินเรียบร้อยแล้ว มีคุณภาพดีเยี่ยม"
        )

        # 6. Verify final status is approved
        final_detail = api_client.get_research_detail(work_id).json()
        assert final_detail["status"] == "approved", f"Work status must be approved, got: {final_detail['status']}"

    finally:
        cleanup_temp_file(cover_file)
        cleanup_temp_file(doc_file)
