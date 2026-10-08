"""
Page Object for Advisor Portal: Review Queue & Review Submission Form.
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class AdvisorPage(BasePage):
    # Queue Locators
    QUEUE_HEADING = (By.XPATH, "//h1[contains(text(), 'คิวตรวจประเมิน')] | //h2[contains(text(), 'คิวตรวจประเมิน')]")
    REVIEW_CARD = (By.CSS_SELECTOR, '.review-card, article')

    # Review Form Locators
    STATUS_RESULT_SELECT = (By.CSS_SELECTOR, 'select[name="status_result"]')
    SCORE_INPUT = (By.CSS_SELECTOR, 'input[name="score"]')
    COMMENT_TEXTAREA = (By.CSS_SELECTOR, 'textarea[name="comment_text"]')
    REQUEST_CONFIRM_BTN = (By.CSS_SELECTOR, 'form.review-form button[type="submit"]')
    
    # Confirmation Modal Locators
    MODAL_OVERLAY = (By.CSS_SELECTOR, '.modal-overlay')
    MODAL_CONFIRM_BTN = (By.XPATH, "//div[contains(@class, 'modal-content')]//button[contains(text(), 'ยืนยัน') and not(contains(text(), 'ผลการประเมิน'))]")
    SUCCESS_FEEDBACK = (By.XPATH, "//*[contains(text(), 'บันทึกผลการประเมินผลงานสำเร็จ')] | //div[contains(@class, 'toast-success')]")

    def navigate_to_queue(self):
        self.open("/advisor/reviews")

    def navigate_to_review(self, research_id):
        self.open(f"/advisor/reviews/{research_id}")

    def submit_review(self, decision="approved", score=80, comments="งานวิจัยผ่านการประเมินตามเกณฑ์มาตรฐาน"):
        """Submits evaluation decision and confirms modal."""
        if self.is_visible(self.STATUS_RESULT_SELECT):
            self.select_by_value(self.STATUS_RESULT_SELECT, decision)
        
        if score is not None and self.is_visible(self.SCORE_INPUT):
            self.fill(self.SCORE_INPUT, str(score))
            
        self.fill(self.COMMENT_TEXTAREA, comments)
        self.click(self.REQUEST_CONFIRM_BTN)

        # Confirm in modal dialog
        self.find(self.MODAL_OVERLAY)
        self.click(self.MODAL_CONFIRM_BTN)

        # Wait for success notification
        self.find(self.SUCCESS_FEEDBACK, timeout=10)
