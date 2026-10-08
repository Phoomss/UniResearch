"""
Test Case: TC-011 — ผู้ไม่ใช่ admin เพิ่มหมวดหมู่
FR: FR-006; Negative / API/RBAC
Tester: Sommai Kitikorn

Precondition:
    บัญชีนักศึกษา (S1) ที่ไม่ใช่ admin
Steps:
    1. ส่ง POST /categories/ โดยใช้ token ของนักศึกษา S1
    2. ส่ง GET /categories/ ตรวจสอบรายการหมวดหมู่
Expected Result:
    - POST ตอบกลับ HTTP 403 Forbidden
    - รายการหมวดหมู่ไม่มีหมวดหมู่ที่ถูกปฏิเสธเพิ่มเข้ามา
"""

import pytest
from utils.test_data import unique_category_name


@pytest.mark.api
@pytest.mark.rbac
@pytest.mark.verified_pass
def test_tc011_non_admin_category(api_client, student_token):
    assert student_token is not None, "Student token is required"
    category_name = unique_category_name("ForbiddenCategory")

    payload = {
        "category_name": category_name,
        "description": "Attempt to create category without admin permissions"
    }

    # 1. POST /categories/ with student token -> 403
    resp = api_client.create_category(student_token, payload)
    assert resp.status_code == 403, f"Expected 403 Forbidden for non-admin, got {resp.status_code}: {resp.text}"

    # 2. GET /categories/ to verify it was not created
    get_resp = api_client.get_categories()
    assert get_resp.status_code == 200
    existing_names = [c["category_name"] for c in get_resp.json()]
    assert category_name not in existing_names, f"Category '{category_name}' should not exist in the database!"
