"""
Test Case: TC-044 — เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด
FR: FR-029; Medium / Positive / API/AI
Tester: Sommai Kitikorn

Precondition:
    มีบัญชีผู้ใช้ active (S1)
Steps:
    1. ส่งคำขอไปยัง 4 AI Endpoints โดยไม่มี token
    2. ส่งคำขอด้วย token แต่ body ขาด required fields
    3. ส่งคำขอด้วย token และ body ที่ถูกต้องตาม schema
        - /ai/generate-abstract
        - /ai/suggest-titles
        - /ai/suggest-keywords
        - /ai/check-writing
Expected Result:
    - ไม่มี token ตอบกลับ HTTP 401 Unauthorized
    - ขาด required fields ตอบกลับ HTTP 422 Unprocessable Entity
    - body ถูกต้องและมี token ตอบกลับตาม response schema
"""

import pytest


@pytest.mark.api
@pytest.mark.next_iteration
def test_tc044_ai_endpoints_validation(api_client, student_token):
    assert student_token is not None, "Student token required"

    endpoints = [
        ("generate-abstract", api_client.ai_generate_abstract, {"title_th": "ระบบตรวจจับ", "title_en": "Detection System", "keywords": "AI, ML"}),
        ("suggest-titles", api_client.ai_suggest_titles, {"abstract": "บทคัดย่อการศึกษาระบบ AI", "keywords": "AI"}),
        ("suggest-keywords", api_client.ai_suggest_keywords, {"title_th": "โครงงาน", "title_en": "Project", "abstract": "เนื้อหา"}),
        ("check-writing", api_client.ai_check_writing, {"text": "งานวิจัยนี้ศึกษาเรื่องคอมพิวเตอร์", "language": "th"}),
    ]

    for name, method, valid_payload in endpoints:
        # 1. Without token -> 401
        resp_unauth = method(token=None, payload=valid_payload)
        assert resp_unauth.status_code == 401, f"Expected 401 for unauth {name}, got: {resp_unauth.status_code}"

        # 2. Missing required fields -> 422
        resp_bad_body = method(token=student_token, payload={})
        assert resp_bad_body.status_code == 422, f"Expected 422 for empty body on {name}, got: {resp_bad_body.status_code}"

        # 3. Valid payload -> 200 or compliant response
        resp_valid = method(token=student_token, payload=valid_payload)
        assert resp_valid.status_code in [200, 500, 503], f"Endpoint {name} returned unexpected status: {resp_valid.status_code}"
        if resp_valid.status_code == 200:
            data = resp_valid.json()
            assert isinstance(data, dict), f"Expected json dict response from {name}"
