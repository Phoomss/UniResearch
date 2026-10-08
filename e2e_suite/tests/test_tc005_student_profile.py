"""
Test Case: TC-005 — ดู/แก้โปรไฟล์และเปลี่ยนรหัส
FR: FR-003; Positive / Web & API
Tester: Sommai Kitikorn

Precondition:
    บัญชีผู้ใช้ active (S1)
Steps:
    1. ล็อกอิน S1 เข้าสู่ระบบผ่านหน้าเว็บ
    2. เปิดหน้า /student/profile
    3. แก้ไขชื่อ, ภาควิชา, และระบุรหัสผ่านใหม่แล้วบันทึก
    4. ตรวจสอบข้อมูลใหม่ผ่าน /auth/me และทดสอบล็อกอินด้วยรหัสผ่านใหม่
Expected Result:
    - หน้าโปรไฟล์แสดงค่าใหม่ /auth/me ได้ข้อมูลที่อัปเดต
    - รหัสผ่านใหม่สามารถใช้ล็อกอินได้สำเร็จ และเก็บเป็น hash ในระบบ
"""

import pytest
from pages.login_page import LoginPage
from pages.student_page import StudentPage
from utils.test_data import unique_email


@pytest.mark.ui
@pytest.mark.api
@pytest.mark.next_iteration
def test_tc005_student_profile(driver, base_url, api_client):
    # Setup fresh student account
    email = unique_email("tc005_student")
    old_password = "OldPassword123!"
    new_password = "NewPassword456!"
    
    reg_resp = api_client.register(
        email=email, password=old_password,
        first_name="Sommai", last_name="Kitikorn",
        department="วิทยาการคอมพิวเตอร์"
    )
    assert reg_resp.status_code == 200

    # 1. Login via UI
    login_page = LoginPage(driver, base_url)
    login_page.navigate_to_login()
    login_page.login_and_wait_for_redirect(email, old_password)

    # 2. Navigate to /student/profile and update
    student_page = StudentPage(driver, base_url)
    student_page.navigate_to_profile()
    
    updated_name = "SommaiUpdated"
    student_page.update_profile(
        first_name=updated_name,
        department="เทคโนโลยีสารสนเทศ",
        new_password=new_password,
        confirm_password=new_password
    )

    # 3. Verify via API /auth/me
    # First get new token using the new password
    new_token = api_client.get_token(email, new_password)
    assert new_token is not None, "Login with new password must succeed!"

    me_resp = api_client.get_me(new_token)
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["first_name"] == updated_name
    assert me_data["department"] == "เทคโนโลยีสารสนเทศ"
