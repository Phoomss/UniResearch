import pytest
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

@pytest.mark.tc_fe_010
def test_tc_fe_010_rag_chatbot_timeout(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.wait_for_url_contains("/account/saved")
    
    # 1. Open Floating Chatbot widget
    chatbot_btn = (By.CSS_SELECTOR, "button[title='คุยกับผู้ช่วย AI']")
    base_page.click(chatbot_btn)
    
    # 2. Locate input and send query
    chat_input = (By.CSS_SELECTOR, "input[placeholder*='ถามหัวข้องานวิจัยที่สนใจ']")
    base_page.set_react_input(chat_input, "แนะนำงานวิจัยด้าน AI หน่อยครับ")
    
    # 3. Submit question via submit button click
    submit_btn = (By.CSS_SELECTOR, "form button[type='submit']")
    base_page.click(submit_btn)
    
    # 4. Assert graceful fallback error message is shown without UI crash
    fallback_locator = (
        By.XPATH,
        "//div[contains(text(), 'ขออภัยด้วยค่ะ') or contains(text(), 'ระบบขัดข้องชั่วคราว') or contains(text(), 'ทำงานล่าช้า')]"
    )
    assert base_page.is_visible(fallback_locator, timeout=15), "Fallback error message was not displayed when backend AI is unavailable"

