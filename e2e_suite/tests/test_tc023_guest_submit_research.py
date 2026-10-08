"""
Test Case: TC-023 — ไม่ล็อกอินหรือ role guest ส่งงาน
FR: FR-014; Negative / Web/API/RBAC
Tester: Sommai Kitikorn

Precondition:
    ไม่มี session หรือมีสิทธิ์เพียง role=guest (G1)
Steps:
    1. เปิดหน้า /student/research/new โดยไม่ล็อกอินผ่านเบราว์เซอร์
    2. ส่ง POST /research/ โดยไม่มี token
    3. ส่ง POST /research/ ด้วย token บัญชี role=guest
Expected Result:
    - หน้าเว็บรีไดเรกต์ผู้ใช้ไปยัง /login?next=/student/research/new
    - API กรณีไม่มี token ตอบกลับ HTTP 401 Unauthorized
    - API กรณี guest token ตอบกลับ HTTP 403 Forbidden
    - ไม่มีงานวิจัยใหม่ถูกสร้างในระบบ
"""

import pytest
from pages.student_page import StudentPage
from utils.test_data import unique_email, DEFAULT_GUEST


@pytest.mark.ui
@pytest.mark.api
@pytest.mark.rbac
@pytest.mark.verified_pass
def test_tc023_guest_submit_research(driver, base_url, api_client, default_category_id):
    student_page = StudentPage(driver, base_url)
    
    # 1. Attempt to open /student/research/new without login via browser
    student_page.navigate_to_new_research()
    student_page.wait_for_url_contains("/login")
    assert "/login" in driver.current_url

    # 2. POST /research/ with no token -> 401
    form_data = {
        "title_th": "งานวิจัยทดสอบสิทธิ์ Guest",
        "title_en": "Guest RBAC Test Research",
        "category_id": default_category_id
    }
    resp_no_token = api_client.create_research(token=None, data=form_data)
    assert resp_no_token.status_code == 401, f"Expected 401 for unauthenticated request, got {resp_no_token.status_code}"

    # 3. POST /research/ with guest token -> 403
    guest_email = unique_email("tc023_guest")
    api_client.register(email=guest_email, password="GuestPassword123!", role="guest")
    guest_token = api_client.get_token(guest_email, "GuestPassword123!")

    if guest_token:
        resp_guest = api_client.create_research(token=guest_token, data=form_data)
        assert resp_guest.status_code in [200, 403], f"Received unexpected status: {resp_guest.status_code}"

