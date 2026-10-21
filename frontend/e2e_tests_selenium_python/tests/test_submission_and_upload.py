import os
import pytest
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.submission_page import SubmissionPage
from pages.base_page import BasePage
from utils.config import Config

FIXTURES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "fixtures", "files"))
OVERSIZED_PDF = os.path.join(FIXTURES_DIR, "oversized.pdf")
VALID_PDF = os.path.join(FIXTURES_DIR, "valid.pdf")
INVALID_TXT = os.path.join(FIXTURES_DIR, "invalid.txt")

@pytest.mark.tc_023
def test_tc023_submission_access_blocked_without_login(driver):
    """TC-023: ลองเข้าหน้าส่งงานโดยไม่ล็อกอิน หรือใช้ role guest (ระบบต้องบล็อก)"""
    # Navigate directly without session
    driver.delete_all_cookies()
    base_page = BasePage(driver)
    base_page.go_to("/student/research/new")
    
    # Assert redirected to login page by route guard
    assert base_page.wait_for_url_contains("/login", timeout=10), "Unauthenticated user was not redirected to /login"
    assert "/login" in driver.current_url, f"Expected /login in URL, got {driver.current_url}"

@pytest.mark.tc_026
def test_tc026_upload_valid_type_and_boundary_size(driver):
    """TC-026: อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.fill_step0(title_th="ทดสอบขอบเขตไฟล์", title_en="Test Boundary File")
    
    # Advance to Step 3: Files
    submission_page.advance_step("ผู้จัดทำและอาจารย์")
    submission_page.advance_step("บทคัดย่อ")
    
    # Fill required abstract
    submission_page.set_react_input(
        (By.NAME, "abstract"),
        "บทคัดย่อสำหรับการทดสอบขอบเขตขนาดไฟล์เอกสารอัปโหลดตามข้อกำหนดความปลอดภัย"
    )
    submission_page.advance_step("ไฟล์")
    
    # 1. Boundary Exceeded Test: Upload 26 MB PDF (> 25 MB MAX_DOCUMENT_BYTES limit)
    submission_page.upload_document(OVERSIZED_PDF)
    err_msg = submission_page.get_error_message("เอกสารต้องมีขนาดไม่เกิน 25 MB")
    assert "เอกสารต้องมีขนาดไม่เกิน 25 MB" in err_msg, f"Expected oversized error message, got: {err_msg}"
    
    # 2. Boundary Valid Test: Upload valid <= 25 MB PDF
    submission_page.upload_document(VALID_PDF)
    # Verify valid file is accepted (fileText shows valid.pdf and error is cleared)
    assert submission_page.is_visible((By.XPATH, "//*[contains(text(), 'valid.pdf')]"), timeout=5), "Valid PDF was not accepted"

@pytest.mark.tc_027
def test_tc027_upload_invalid_mime_and_extension(driver):
    """TC-027: ลองอัปโหลดไฟล์ที่นามสกุล/MIME หรือลายเซ็นผิด (ระบบต้องแจ้งเตือน)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    submission_page = SubmissionPage(driver)
    submission_page.load()
    submission_page.fill_step0(title_th="ทดสอบไฟล์นามสกุลผิด", title_en="Test Invalid MIME")
    
    # Advance to Step 3: Files
    submission_page.advance_step("ผู้จัดทำและอาจารย์")
    submission_page.advance_step("บทคัดย่อ")
    submission_page.set_react_input(
        (By.NAME, "abstract"),
        "บทคัดย่อสำหรับการทดสอบการปฏิเสธไฟล์ที่ไม่ใช่เอกสาร PDF หรือไฟล์ปลอมแปลง"
    )
    submission_page.advance_step("ไฟล์")
    
    # 1. Upload invalid document (txt file instead of PDF)
    submission_page.upload_document(INVALID_TXT)
    doc_err = submission_page.get_error_message("เอกสารต้องเป็นไฟล์ PDF")
    assert "เอกสารต้องเป็นไฟล์ PDF" in doc_err, f"Expected invalid doc error, got: {doc_err}"
    
    # 2. Upload invalid cover image (txt file instead of image)
    submission_page.upload_cover(INVALID_TXT)
    cover_err = submission_page.get_error_message("ภาพหน้าปกต้องเป็น JPEG, PNG หรือ WebP")
    assert "ภาพหน้าปกต้องเป็น JPEG, PNG หรือ WebP" in cover_err, f"Expected invalid cover error, got: {cover_err}"
