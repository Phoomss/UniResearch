import pytest
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

@pytest.mark.tc_fe_009
def test_tc_fe_009_ai_writing_assistant(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.wait_for_url_contains("/account/saved")
    base_page.go_to("/student/research/new")
    base_page.wait_for_form_ready()
    
    # Step 0: Fill Titles & Category
    title_th = "การประยุกต์ใช้ AI ในเกษตรกรรม"
    title_en = "Application of AI in Agriculture"
    base_page.set_react_input((By.NAME, "title_th"), title_th)
    base_page.set_react_input((By.NAME, "title_en"), title_en)
    
    cat_select_elem = base_page.find_element((By.NAME, "category_id"))
    select = Select(cat_select_elem)
    # Select first valid category option (value != "")
    for opt in select.options:
        val = opt.get_attribute("value")
        if val:
            base_page.set_react_select((By.NAME, "category_id"), val)
            break
            
    # Proceed to Step 1 (Authors/Advisors)
    base_page.advance_step("ผู้จัดทำและอาจารย์")
    
    # Proceed to Step 2 (Abstract & AI Assistant)
    base_page.advance_step("บทคัดย่อ")
    
    # Open AI Assistant Accordion
    ai_toggle_btn = (By.CSS_SELECTOR, "button.ai-assistant-toggle")
    base_page.click(ai_toggle_btn)
    
    # Click "สร้างบทคัดย่อ (TH)" button
    gen_btn = (By.XPATH, "//button[contains(text(), 'สร้างบทคัดย่อ (TH)')]")
    base_page.click(gen_btn)
    
    # Wait for generated result and click "นำไปใช้" (Apply)
    apply_btn = (By.XPATH, "//button[contains(text(), 'นำไปใช้')]")
    base_page.click(apply_btn)
    
    # Verify the abstract textarea is populated
    abstract_elem = base_page.find_element((By.NAME, "abstract"))
    abstract_content = abstract_elem.get_attribute("value")
    assert abstract_content and len(abstract_content.strip()) > 0, "Abstract field was not populated by AI assistant"
