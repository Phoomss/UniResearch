import pytest
import time
import requests
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.research_detail_page import ResearchDetailPage
from utils.config import Config

@pytest.mark.tc_035
def test_tc035_download_without_token_or_file(driver):
    """TC-035: ลองดาวน์โหลดผลงานที่ไม่มีไฟล์ หรือตอนไม่มี token"""
    # 1. UI Check when unauthenticated: Access research detail page
    driver.delete_all_cookies()
    detail_page = ResearchDetailPage(driver)
    detail_page.load(1)
    
    # Assert auth panel prompt is displayed instead of download buttons
    assert detail_page.is_auth_prompt_visible(), "Unauthenticated user was not prompted to sign in for download"
    
    # 2. API direct request without token -> HTTP 401
    res_no_token = requests.get(f"{Config.BASE_URL}/api/research/1/download")
    assert res_no_token.status_code == 401, f"Expected HTTP 401 for download without token, got {res_no_token.status_code}"
    
    # 3. Request with valid S1 token on research work without file -> HTTP 404
    session = requests.Session()
    login_resp = session.post(
        f"{Config.BASE_URL}/api/auth/login",
        json={"email": Config.STUDENT_EMAIL, "password": Config.STUDENT_PASSWORD}
    )
    assert login_resp.status_code == 200, "API Login failed during test setup"
    
    res_no_file = session.get(f"{Config.BASE_URL}/api/research/1/download")
    assert res_no_file.status_code == 404, f"Expected HTTP 404 for research without file, got {res_no_file.status_code}"

@pytest.mark.tc_042
def test_tc042_toggle_favorite_and_unfavorite(driver):
    """TC-042: ทดสอบการกดปุ่มบันทึกและยกเลิก favorite"""
    # Step 1: Login as S1
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    # Step 2: Open research detail page (ID 1)
    detail_page = ResearchDetailPage(driver)
    detail_page.load(1)
    detail_page.wait_for_form_ready()
    
    # Step 3: Toggle favorite
    detail_page.click_save_favorite()
    toast1 = detail_page.wait_for_toast(timeout=10)
    assert toast1 is not None, "Toast message was not displayed after clicking favorite button"
    
    # Step 4: Toggle favorite second time (cancel favorite)
    time.sleep(2)
    detail_page.click_save_favorite()
    toast2 = detail_page.wait_for_toast(timeout=10)
    assert toast2 is not None, "Second toast was not displayed after unfavorite action"
    
    # Step 5: Verify API status returns 200
    session = requests.Session()
    session.post(
        f"{Config.BASE_URL}/api/auth/login",
        json={"email": Config.STUDENT_EMAIL, "password": Config.STUDENT_PASSWORD}
    )
    fav_check = session.post(f"{Config.BASE_URL}/api/research/1/favorite")
    assert fav_check.status_code == 200, f"Favorite API returned {fav_check.status_code}"
