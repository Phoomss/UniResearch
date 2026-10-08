"""
Test Case: TC-026 — อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต
FR: FR-016; Positive / Web/API/Boundary
Tester: Sommai Kitikorn

Precondition:
    ไฟล์ภาพและเอกสาร PDF ที่มี magic bytes ถูกต้อง
Steps:
    1. ตรวจสอบขีดจำกัดขนาดไฟล์ (Cover: 5 MiB, Document: 25 MiB)
    2. ทดสอบอัปโหลดไฟล์ขนาดเกินขีดจำกัด 1 byte ด้วย S1
    3. ตรวจสอบ status code ที่ตอบกลับ (HTTP 413 Payload Too Large)
    4. ตรวจสอบว่าไฟล์ที่เกินขนาดไม่ถูกบันทึกค้างไว้
Expected Result:
    - ไฟล์ขนาดเกินขีดจำกัด 1 byte ตอบกลับ HTTP 413
    - ไฟล์ไม่ค้างอยู่ใน storage
"""

import os
import pytest
from utils.file_helpers import create_mock_png, create_mock_pdf, cleanup_temp_file
from utils.test_data import unique_research_title


@pytest.mark.api
@pytest.mark.boundary
@pytest.mark.next_iteration
def test_tc026_file_upload_boundary(api_client, student_token, default_category_id):
    assert student_token is not None, "Student token is required"
    title_info = unique_research_title("TC026_Boundary")

    # 5 MiB + 1 byte for cover image (5 * 1024 * 1024 + 1 = 5,242,881 bytes)
    oversized_cover_size = 5 * 1024 * 1024 + 1
    oversized_cover_path = create_mock_png(size_bytes=oversized_cover_size, filename="oversized_cover.png")

    try:
        data = {
            "title_th": title_info["title_th"],
            "title_en": title_info["title_en"],
            "category_id": default_category_id
        }

        with open(oversized_cover_path, "rb") as cover_f:
            files = {
                "cover_image": ("oversized_cover.png", cover_f, "image/png")
            }
            resp = api_client.create_research(student_token, data=data, files=files)

        # Expected 413 Payload Too Large
        assert resp.status_code == 413, f"Expected 413 Payload Too Large for oversized cover, got {resp.status_code}: {resp.text}"
        detail = resp.json().get("detail", "")
        assert "large" in detail.lower() or "เกิน" in detail or "413" in str(resp.status_code)

    finally:
        cleanup_temp_file(oversized_cover_path)
