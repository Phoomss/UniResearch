"""
Test Case: TC-002 — สมัคร email ซ้ำ
FR: FR-001; Negative / API
Tester: Sommai Kitikorn

Precondition:
    มีผู้ใช้เดิมในระบบ (U1)
Steps:
    1. ส่ง POST /auth/register สร้างผู้ใช้ U1
    2. ส่ง POST /auth/register ซ้ำด้วย email เดิม
    3. ตรวจสอบ status code และ response body
Expected Result:
    ตอบกลับ HTTP 400 พร้อมข้อความแจ้งเตือนว่า email ถูกใช้แล้ว ข้อมูลผู้ใช้ไม่เพิ่มซ้ำ
"""

import pytest
from utils.test_data import unique_email


@pytest.mark.api
@pytest.mark.verified_pass
def test_tc002_duplicate_register(api_client):
    email = unique_email("tc002_user")
    password = "SecurePassword123!"

    # 1. Register first time
    resp1 = api_client.register(email=email, password=password, first_name="Sommai", last_name="Kitikorn")
    assert resp1.status_code == 200, f"Initial registration failed: {resp1.text}"
    user_data = resp1.json()
    assert user_data["email"] == email

    # 2. Register again with duplicate email
    resp2 = api_client.register(email=email, password=password, first_name="Duplicate", last_name="Attempt")
    assert resp2.status_code == 400, f"Expected 400 Bad Request for duplicate email, got: {resp2.status_code}"
    
    error_detail = resp2.json().get("detail", "")
    assert "already registered" in error_detail.lower() or "ถูกใช้แล้ว" in error_detail or "email" in error_detail.lower(), \
        f"Unexpected detail response: {error_detail}"
