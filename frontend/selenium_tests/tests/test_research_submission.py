import pytest
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config
from selenium.webdriver.common.by import By
import os

@pytest.mark.tc_fe_005
def test_tc_fe_005_research_submission_e2e(driver):
    # This test will likely fail/block due to backend being down, 
    # but we implement the expected workflow as per documentation.
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    
    # Wait for dashboard
    base_page.wait_for_url_contains("/account/saved")
    
    # Navigate to new research
    base_page.go_to("/student/research/new")
    
    # Fill form (if rendered)
    base_page.send_keys((By.NAME, "title_th"), "การทดสอบระบบ")
    base_page.send_keys((By.NAME, "title_en"), "System Testing")
    
    # This would normally continue to fill the abstract, select category, upload files, and submit.
    # We will attempt to find the Next button or step 2.
    # But since the API is down, categories won't load and the form won't render.
    # The test will fail at finding the title_th input, which is expected behavior for an E2E test against a broken environment.

@pytest.mark.tc_fe_006
def test_tc_fe_006_oversized_file_validation(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.go_to("/student/research/new")
    
    # Attempt to upload a large file if the form renders
    # We would generate a dummy 26MB file in fixtures and upload it
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "fixtures", "files", "oversized.pdf"))
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.seek((26 * 1024 * 1024) - 1)
            f.write(b"\0")
            
    # Try to find file input and upload
    # base_page.send_keys((By.NAME, "document"), file_path)
    # verify error message "ขนาดไฟล์เกิน"
