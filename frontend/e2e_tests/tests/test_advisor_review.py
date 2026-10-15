import pytest
from pages.login_page import LoginPage
from pages.base_page import BasePage
from utils.config import Config

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.mark.tc_fe_008
def test_tc_fe_008_advisor_review_workflow(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.ADVISOR_EMAIL, Config.ADVISOR_PASSWORD)
    
    base_page = BasePage(driver)
    base_page.wait_for_url_contains("/advisor")
    
    # Navigate to review queue
    base_page.go_to("/advisor/reviews")
    
    # Find pending research item and click review button
    review_link = base_page.find_element((By.CSS_SELECTOR, "a.adv-action-btn.review, a[href*='/advisor/reviews/']"))
    base_page.click((By.CSS_SELECTOR, "a.adv-action-btn.review, a[href*='/advisor/reviews/']"))
    
    # Verify navigated to review details page
    base_page.wait_for_url_contains("/advisor/reviews/")
    
    # Enter review comment
    comment_area = (By.NAME, "comment_text")
    base_page.send_keys(comment_area, "งานวิจัยมีคุณภาพดีมาก มีประโยชน์ต่อการศึกษา ผ่านการประเมิน")
    
    # Click submit review button to open modal
    submit_btn = (By.CSS_SELECTOR, "form.review-form button[type='submit']")
    base_page.click(submit_btn)
    
    # Confirm modal appears
    modal_confirm_btn = (By.XPATH, "//div[contains(@class, 'modal-buttons')]//button[contains(text(), 'ยืนยัน')]")
    base_page.click(modal_confirm_btn)
    
    # Verify success toast notification
    success_toast = (By.CSS_SELECTOR, ".toast-alert, .toast-success, .toast-message")
    assert base_page.is_visible(success_toast, timeout=10), "Success confirmation notification not displayed after review approval"
