import pytest
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config

@pytest.mark.tc_fe_009
def test_tc_fe_009_ai_writing_assistant(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.go_to("/student/research/new")
    
    # In a working environment, fill title, click AI generate abstract, verify it populates.
