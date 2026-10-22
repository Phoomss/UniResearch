# -*- coding: utf-8 -*-
import os
import pytest
import requests
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.submission_page import SubmissionPage
from pages.base_page import BasePage
from utils.config import Config
from fixtures.test_files_manager import (
    NORMAL_PDF_PATH, MAX_25MB_PDF_PATH, OVER_26MB_PDF_PATH,
    NORMAL_PNG_PATH, MAX_5MB_PNG_PATH, OVER_6MB_PNG_PATH,
    INVALID_TXT_PATH, FAKE_PDF_PATH,
    NORMAL_PDF_NAME, MAX_25MB_PDF_NAME, NORMAL_PNG_NAME, MAX_5MB_PNG_NAME
)

@pytest.mark.tc_009
def test_tc_009_unauthenticated_visitor_blocked_submission(driver):
    """TC-009 (Ref: Master TC-023 | FR-014): การป้องกันผู้ใช้งานที่ยังไม่ได้เข้าสู่ระบบ (Unauthenticated Visitor) ไม่ให้เปิดหน้าแบบฟอร์มส่งผลงานวิจัย (/student/research/new)"""
    driver.delete_all_cookies()
    base_page = BasePage(driver)
    base_page.go_to("/student/research/new")
    
    assert base_page.wait_for_url_contains("/login", timeout=10), "Unauthenticated visitor was not redirected to /login"
    assert "/login" in driver.current_url, f"Expected /login in URL, got: {driver.current_url}"

@pytest.mark.tc_010
def test_tc_010_unauthenticated_api_submission_rejected(driver):
    """TC-010 (Ref: Master TC-023 | FR-014): การป้องกันการส่งข้อมูลสร้างผลงานวิจัยผ่าน API โดยไม่มีการยืนยันตัวตน (Unauthenticated API -> HTTP 401)"""
    res = requests.post(f"{Config.BASE_URL}/api/research", data={"title_th": "ทดสอบ API ไม่มี Token"})
    assert res.status_code == 401, f"Expected HTTP 401 for unauthenticated submission, got: {res.status_code}"

@pytest.mark.tc_011
def test_tc_011_guest_role_submission_forbidden(driver):
    """TC-011 (Ref: Master TC-023 | FR-014): การป้องกันผู้ใช้งานสิทธิ์บุคคลทั่วไป (Guest Role) ไม่ให้ส่งผลงานวิจัยเข้าสู่ระบบ (Guest Role -> HTTP 403 / Blocked)"""
    # 1. UI Check: Login as guest and attempt to open /student/research/new
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.GUEST_EMAIL, Config.GUEST_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    # Expect error state panel because /research/participants returns 403 for guest
    error_panel = (By.CSS_SELECTOR, ".state-panel, .state")
    assert submission_page.is_visible(error_panel, timeout=10), "Guest role was not blocked on submission page"
    
    # 2. API Check: POST to backend /research with guest token returns HTTP 403
    session = requests.Session()
    login_res = session.post(f"{Config.BASE_URL}/api/auth/login", json={"email": Config.GUEST_EMAIL, "password": Config.GUEST_PASSWORD})
    assert login_res.status_code == 200, "Guest login failed"
    
    # Direct backend call with guest token
    auth_res = requests.post("http://localhost:8000/auth/login", data={"username": Config.GUEST_EMAIL, "password": Config.GUEST_PASSWORD})
    guest_token = auth_res.json()["access_token"]
    api_res = requests.post(
        "http://localhost:8000/research/",
        headers={"Authorization": f"Bearer {guest_token}"},
        data={"title_th": "ทดสอบ Guest Role", "title_en": "Guest Role Test", "category_id": 1, "author_ids": "[1]", "advisor_ids": "[]"}
    )
    assert api_res.status_code == 403, f"Expected HTTP 403 for guest submission, got {api_res.status_code}"

@pytest.mark.tc_012
def test_tc_012_upload_normal_document_pdf(driver):
    """TC-012 (Ref: Master TC-026 | FR-016): การอัปโหลดไฟล์เอกสารงานวิจัย PDF ขนาดปกติ (เช่น 2.4 MB) ในขั้นตอนการส่งผลงานวิจัย"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload normal PDF (2.4 MB)
    submission_page.upload_document(NORMAL_PDF_PATH)
    assert submission_page.is_file_accepted("งานวิจัย_ธนภัทร_ฉบับสมบูรณ์.pdf"), "Normal PDF was not accepted on UI"

@pytest.mark.tc_013
def test_tc_013_upload_boundary_max_25mb_document(driver):
    """TC-013 (Ref: Master TC-026 | FR-016): การอัปโหลดไฟล์เอกสารงานวิจัย PDF ขนาดพอดีขีดจำกัดสูงสุด 25 MB (Boundary Max Limit = 25 MB)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload max 25 MB PDF
    submission_page.upload_document(MAX_25MB_PDF_PATH)
    assert submission_page.is_file_accepted("งานวิจัย_ธนภัทร_ขนาดสูงสุด25MB.pdf"), "Boundary 25MB PDF was not accepted on UI"

@pytest.mark.tc_014
def test_tc_014_reject_boundary_over_26mb_document(driver):
    """TC-014 (Ref: Master TC-026 | FR-016): การปฏิเสธไฟล์เอกสารงานวิจัย PDF ขนาดเกินขีดจำกัดสูงสุด 25 MB (Boundary Over Limit เช่น 26 MB)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload oversized 26 MB PDF
    submission_page.upload_document(OVER_26MB_PDF_PATH)
    err = submission_page.get_error_message("เอกสารต้องมีขนาดไม่เกิน 25 MB")
    assert "เอกสารต้องมีขนาดไม่เกิน 25 MB" in err, f"Expected 25MB limit error, got: {err}"

@pytest.mark.tc_015
def test_tc_015_upload_normal_cover_image(driver):
    """TC-015 (Ref: Master TC-026 | FR-016): การอัปโหลดไฟล์ภาพหน้าปกงานวิจัย (PNG/JPEG/WebP) ขนาดปกติ (เช่น 1.2 MB)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload normal PNG cover (1.2 MB)
    submission_page.upload_cover(NORMAL_PNG_PATH)
    assert submission_page.is_file_accepted("ปกงานวิจัย_ธนภัทร_ปกติ.png"), "Normal cover PNG was not accepted on UI"

@pytest.mark.tc_016
def test_tc_016_upload_boundary_max_5mb_cover_image(driver):
    """TC-016 (Ref: Master TC-026 | FR-016): การอัปโหลดไฟล์ภาพหน้าปกงานวิจัยขนาดพอดีขีดจำกัดสูงสุด 5 MB (Boundary Max Limit = 5 MB)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload max 5 MB PNG cover
    submission_page.upload_cover(MAX_5MB_PNG_PATH)
    assert submission_page.is_file_accepted("ปกงานวิจัย_ธนภัทร_ขนาดสูงสุด5MB.png"), "Boundary 5MB cover was not accepted on UI"

@pytest.mark.tc_017
def test_tc_017_reject_boundary_over_6mb_cover_image(driver):
    """TC-017 (Ref: Master TC-026 | FR-016): การปฏิเสธไฟล์ภาพหน้าปกงานวิจัยขนาดเกินขีดจำกัดสูงสุด 5 MB (Boundary Over Limit เช่น 6 MB)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload oversized 6 MB PNG cover
    submission_page.upload_cover(OVER_6MB_PNG_PATH)
    err = submission_page.get_error_message("ภาพหน้าปกต้องมีขนาดไม่เกิน 5 MB")
    assert "ภาพหน้าปกต้องมีขนาดไม่เกิน 5 MB" in err, f"Expected 5MB cover limit error, got: {err}"

@pytest.mark.tc_018
def test_tc_018_reject_invalid_document_extension(driver):
    """TC-018 (Ref: Master TC-027 | FR-016): การปฏิเสธไฟล์เอกสารงานวิจัยที่มีนามสกุลผิดประเภท (เช่น อัปโหลดไฟล์ .txt ในช่องเอกสาร PDF)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload .txt into document field
    submission_page.upload_document(INVALID_TXT_PATH)
    err = submission_page.get_error_message("เอกสารต้องเป็นไฟล์ PDF")
    assert "เอกสารต้องเป็นไฟล์ PDF" in err, f"Expected invalid document error, got: {err}"

@pytest.mark.tc_019
def test_tc_019_reject_invalid_cover_extension(driver):
    """TC-019 (Ref: Master TC-027 | FR-016): การปฏิเสธไฟล์ภาพหน้าปกงานวิจัยที่มีนามสกุลผิดประเภท (เช่น อัปโหลดไฟล์ .txt ในช่องภาพหน้าปก)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.navigate_to_files_step()
    
    # Upload .txt into cover field
    submission_page.upload_cover(INVALID_TXT_PATH)
    err = submission_page.get_error_message("ภาพหน้าปกต้องเป็น JPEG, PNG หรือ WebP")
    assert "ภาพหน้าปกต้องเป็น JPEG, PNG หรือ WebP" in err, f"Expected invalid cover error, got: {err}"

@pytest.mark.tc_020
def test_tc_020_reject_fake_pdf_invalid_signature(driver):
    """TC-020 (Ref: Master TC-027 | FR-016): การปฏิเสธไฟล์เอกสารที่ปลอมแปลงนามสกุลเป็น .pdf แต่เนื้อหาภายในไม่ใช่โครงสร้าง PDF จริง (Invalid File Signature)"""
    # Get student token
    auth_res = requests.post("http://localhost:8000/auth/login", data={"username": Config.STUDENT_EMAIL, "password": Config.STUDENT_PASSWORD})
    student_token = auth_res.json()["access_token"]
    
    # Submit with fake PDF (signature has no %PDF-)
    with open(FAKE_PDF_PATH, "rb") as f:
        files = {"document": ("ไฟล์ปลอมแปลงโครงสร้าง.pdf", f, "application/pdf")}
        data = {
            "title_th": "ทดสอบลายเซ็นไฟล์ปลอมแปลง",
            "title_en": "Fake PDF Signature Test",
            "category_id": 1,
            "author_ids": "[39]",
            "advisor_ids": "[]"
        }
        res = requests.post(
            "http://localhost:8000/research/",
            headers={"Authorization": f"Bearer {student_token}"},
            data=data,
            files=files
        )
    assert res.status_code == 415, f"Expected HTTP 415 for invalid file signature, got: {res.status_code}"
    assert "Invalid document file content" in res.text, f"Unexpected response: {res.text}"

@pytest.mark.tc_021
def test_tc_021_verify_no_orphaned_cover_when_doc_invalid(driver):
    """TC-021 (Ref: Master TC-027 | FR-016): การตรวจสอบว่าไม่มีข้อมูลหรือไฟล์ภาพหน้าปกตกค้าง เมื่อแนบภาพปกถูกต้องแต่แนบไฟล์เอกสารผิดประเภท"""
    auth_res = requests.post("http://localhost:8000/auth/login", data={"username": Config.STUDENT_EMAIL, "password": Config.STUDENT_PASSWORD})
    student_token = auth_res.json()["access_token"]
    
    # Check cover uploads folder before request
    covers_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "backend", "static", "uploads", "covers"))
    before_covers = set(os.listdir(covers_dir)) if os.path.exists(covers_dir) else set()
    
    # Submit valid cover image paired with fake PDF
    with open(NORMAL_PNG_PATH, "rb") as f_cover, open(FAKE_PDF_PATH, "rb") as f_doc:
        files = {
            "cover_image": ("ปกงานวิจัย_ธนภัทร_ปกติ.png", f_cover, "image/png"),
            "document": ("ไฟล์ปลอมแปลงโครงสร้าง.pdf", f_doc, "application/pdf")
        }
        data = {
            "title_th": "ทดสอบป้องกันไฟล์ตกค้าง",
            "title_en": "No Orphan File Test",
            "category_id": 1,
            "author_ids": "[39]",
            "advisor_ids": "[]"
        }
        res = requests.post(
            "http://localhost:8000/research/",
            headers={"Authorization": f"Bearer {student_token}"},
            data=data,
            files=files
        )
    
    # Must be rejected with 415
    assert res.status_code == 415, f"Expected HTTP 415, got: {res.status_code}"
    
    # Verify no new orphaned cover files remain
    after_covers = set(os.listdir(covers_dir)) if os.path.exists(covers_dir) else set()
    orphan_files = after_covers - before_covers
    assert len(orphan_files) == 0, f"Found orphaned cover files in static directory: {orphan_files}"
