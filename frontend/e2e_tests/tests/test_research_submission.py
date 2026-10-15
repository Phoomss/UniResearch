import pytest
import os
import uuid
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config

@pytest.mark.tc_fe_005
def test_tc_fe_005_research_submission_e2e(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.wait_for_url_contains("/account/saved")
    base_page.go_to("/student/research/new")
    base_page.wait_for_form_ready()
    
    unique_suffix = uuid.uuid4().hex[:6]
    title_th = f"งานวิจัยทดสอบอัตโนมัติ {unique_suffix}"
    title_en = f"Automated E2E Test Research {unique_suffix}"
    
    # Step 0: Research Information
    base_page.set_react_input((By.NAME, "title_th"), title_th)
    base_page.set_react_input((By.NAME, "title_en"), title_en)
    
    cat_select_elem = base_page.find_element((By.NAME, "category_id"))
    select = Select(cat_select_elem)
    for opt in select.options:
        val = opt.get_attribute("value")
        if val:
            base_page.set_react_select((By.NAME, "category_id"), val)
            break
            
    # Step 0 -> Step 1 (Authors and Advisors)
    base_page.advance_step("ผู้จัดทำและอาจารย์")
    
    # Step 1 -> Step 2 (Abstract)
    base_page.advance_step("บทคัดย่อ")
    
    # Step 2: Fill Abstract
    base_page.set_react_input(
        (By.NAME, "abstract"),
        "บทคัดย่องานวิจัยสำหรับการทดสอบระบบ E2E อัตโนมัติ เพื่อยืนยันความถูกต้องของกระบวนการส่งผลงาน"
    )
    
    # Step 2 -> Step 3 (Files)
    base_page.advance_step("ไฟล์")
    
    # Step 3 -> Step 4 (Review and Submit)
    base_page.advance_step("ตรวจสอบ")
    
    # Step 4: Verification and Submission
    submit_btn = (By.XPATH, "//button[contains(text(), 'ยืนยันและส่งผลงาน')]")
    base_page.click(submit_btn)
    
    # Verify Submission Success and Status
    assert base_page.is_visible(
        (By.XPATH, "//*[contains(text(), 'ส่งผลงานเรียบร้อยแล้ว')]"),
        timeout=15
    ), "Submission success message not found"
    
    assert base_page.is_visible(
        (By.XPATH, "//*[contains(text(), 'pending')]"),
        timeout=10
    ), "Submission status was not pending"


@pytest.mark.tc_fe_006
def test_tc_fe_006_oversized_file_validation(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.wait_for_url_contains("/account/saved")
    base_page.go_to("/student/research/new")
    base_page.wait_for_form_ready()
    
    # Step 0: Fill Titles & Category
    base_page.set_react_input((By.NAME, "title_th"), "ทดสอบไฟล์ขนาดเกิน")
    base_page.set_react_input((By.NAME, "title_en"), "Test Oversized File")
    
    cat_select_elem = base_page.find_element((By.NAME, "category_id"))
    select = Select(cat_select_elem)
    for opt in select.options:
        val = opt.get_attribute("value")
        if val:
            base_page.set_react_select((By.NAME, "category_id"), val)
            break
            
    # Step 0 -> Step 1
    base_page.advance_step("ผู้จัดทำและอาจารย์")
    
    # Step 1 -> Step 2
    base_page.advance_step("บทคัดย่อ")
    
    # Step 2 -> Step 3
    base_page.advance_step("ไฟล์")
    
    # Step 3: Upload Oversized PDF
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "fixtures", "files", "oversized.pdf"))
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.seek((26 * 1024 * 1024) - 1)
            f.write(b"\0")
            
    doc_input = driver.find_element(By.CSS_SELECTOR, "input[name='document']")
    doc_input.send_keys(file_path)
    
    # Verify error message without submitting to backend
    error_msg_locator = (By.XPATH, "//*[contains(text(), 'เอกสารต้องมีขนาดไม่เกิน 25 MB')]")
    assert base_page.is_visible(error_msg_locator, timeout=10), "Oversized file error message not displayed"


