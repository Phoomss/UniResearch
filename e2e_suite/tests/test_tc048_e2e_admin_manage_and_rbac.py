"""
Test Case: TC-048 — เว็บ admin จัดการหมวดหมู่/ผู้ใช้
FR: FR-032; Medium / Positive / E2E/RBAC
Tester: Narongsak, Sommai Kitikorn และ Natthaporn

Precondition:
    บัญชีผู้ดูแลระบบ (A1) และนักศึกษา (S1) พร้อมใช้งาน
Steps:
    1. ล็อกอิน A1 ผ่านเว็บ เพิ่มหมวดหมู่ C2 ที่ /admin/categories
    2. เพิ่มผู้ใช้ใหม่ U3 ที่ /admin/users
    3. ตรวจสอบข้อมูลในฐานข้อมูลผ่าน GET API
    4. ล็อกอิน S1 และส่งคำขอเรียกใช้งาน API ผู้ดูแลระบบโดยตรง
Expected Result:
    - หมวดหมู่และผู้ใช้ที่สร้างใหม่ได้รับการบันทึกจริง
    - คำขอ API ของ S1 ในส่วน admin endpoints ถูกปฏิเสธด้วย HTTP 403 Forbidden
"""

import pytest
from pages.login_page import LoginPage
from pages.admin_page import AdminPage
from utils.test_data import DEFAULT_ADMIN, DEFAULT_STUDENT_1, unique_category_name, unique_email


@pytest.mark.ui
@pytest.mark.e2e
@pytest.mark.rbac
@pytest.mark.next_iteration
def test_tc048_e2e_admin_manage_and_rbac(driver, base_url, api_client, admin_token, student_token):
    assert admin_token is not None, "Admin token required"
    assert student_token is not None, "Student token required"

    cat_name = unique_category_name("AdminWebCat")
    user_email = unique_email("tc048_new_user")

    # 1. Login as Admin A1
    login_page = LoginPage(driver, base_url)
    login_page.navigate_to_login()
    login_page.login_and_wait_for_redirect(DEFAULT_ADMIN["email"], DEFAULT_ADMIN["password"])

    # 2. Create Category at /admin/categories
    admin_page = AdminPage(driver, base_url)
    admin_page.navigate_to_categories()
    admin_page.create_category(name=cat_name, description="หมวดหมู่ที่สร้างผ่านการทดสอบเว็บ Admin")

    # Verify category persisted via API
    cats = api_client.get_categories().json()
    assert any(c["category_name"] == cat_name for c in cats), f"Category '{cat_name}' must exist"

    # 3. Create User at /admin/users
    admin_page.navigate_to_users()
    admin_page.create_user(
        email=user_email,
        password="NewUserPass123!",
        first_name="CreatedByAdmin",
        last_name="WebE2E",
        role="advisor"
    )

    # Verify user persisted via API
    users = api_client.list_users(admin_token).json()
    assert any(u["email"] == user_email for u in users), f"User '{user_email}' must exist"

    # 4. Student attempts to invoke admin APIs directly -> 403 Forbidden
    student_cat_attempt = api_client.create_category(
        student_token,
        {"category_name": "IllegalStudentCategory"}
    )
    assert student_cat_attempt.status_code == 403, f"Student must receive 403 for category creation, got: {student_cat_attempt.status_code}"

    student_user_attempt = api_client.create_user(
        student_token,
        {"email": "illegal@example.com", "password": "pass", "role": "admin"}
    )
    assert student_user_attempt.status_code == 403, f"Student must receive 403 for user creation, got: {student_user_attempt.status_code}"
