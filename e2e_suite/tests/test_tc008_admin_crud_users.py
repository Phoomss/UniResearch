"""
Test Case: TC-008 — admin CRUD ผู้ใช้
FR: FR-005; Positive / Web & API
Tester: Sommai Kitikorn

Precondition:
    บัญชีผู้ดูแลระบบ (A1)
Steps:
    1. ส่ง POST /users/ ด้วย token admin เพื่อสร้างผู้ใช้ U3 (role=advisor)
    2. ส่ง GET /users/{id} ตรวจสอบข้อมูลผู้ใช้ที่สร้าง
    3. ส่ง PUT /users/{id} เพื่อแก้ไขชื่อและบทบาท
    4. ส่ง DELETE /users/{id} เพื่อลบผู้ใช้
    5. ส่ง GET /users/{id} ซ้ำหลังการลบ
Expected Result:
    - POST สร้างได้สำเร็จ (HTTP 201)
    - GET ดึงข้อมูลได้ถูกต้อง
    - PUT บันทึกข้อมูลที่แก้ไข
    - DELETE ลบได้สำเร็จ (HTTP 204)
    - GET หลังลบตอบกลับ HTTP 404 Not Found
"""

import pytest
from utils.test_data import unique_email


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc008_admin_crud_users(api_client, admin_token):
    assert admin_token is not None, "Admin token is required"
    new_email = unique_email("tc008_crud_user")

    # 1. CREATE (POST /users/)
    user_payload = {
        "email": new_email,
        "password": "Password123!",
        "role": "advisor",
        "first_name": "SommaiAdvisor",
        "last_name": "TestCRUD",
        "department": "วิทยาการคอมพิวเตอร์"
    }
    create_resp = api_client.create_user(admin_token, user_payload)
    assert create_resp.status_code == 201, f"Expected 201 Created, got {create_resp.status_code}: {create_resp.text}"
    created_user = create_resp.json()
    user_id = created_user["id"]
    assert created_user["email"] == new_email
    assert created_user["role"] == "advisor"

    # 2. READ (GET /users/{id})
    get_resp = api_client.get_user_by_id(admin_token, user_id)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == user_id

    # 3. UPDATE (PUT /users/{id})
    update_payload = {
        "first_name": "SommaiUpdatedName",
        "department": "เทคโนโลยีสารสนเทศ"
    }
    update_resp = api_client.update_user(admin_token, user_id, update_payload)
    assert update_resp.status_code == 200
    updated_data = update_resp.json()
    assert updated_data["first_name"] == "SommaiUpdatedName"
    assert updated_data["department"] == "เทคโนโลยีสารสนเทศ"

    # 4. DELETE (DELETE /users/{id})
    del_resp = api_client.delete_user(admin_token, user_id)
    assert del_resp.status_code == 204, f"Expected 204 No Content, got {del_resp.status_code}"

    # 5. READ AFTER DELETE (GET /users/{id}) -> 404
    after_del_resp = api_client.get_user_by_id(admin_token, user_id)
    assert after_del_resp.status_code == 404, f"Expected 404 Not Found after deletion, got {after_del_resp.status_code}"
