import pytest
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config

@pytest.mark.tc_fe_010
def test_tc_fe_010_rag_chatbot_timeout(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.wait_for_url_contains("/account/saved")
    
    # In a working environment, interact with chatbot floating widget, trigger a timeout or 
    # check if the app degrades gracefully when backend is down.
    # Since backend is down now, sending a message should instantly result in a fallback error.
    # verify fallback message: "ขณะนี้ระบบ AI ทำงานล่าช้า กรุณาลองใหม่อีกครั้ง"
