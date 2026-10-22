import time
from selenium.webdriver.common.by import By
from .base_page import BasePage

class ResearchDetailPage(BasePage):
    SAVE_BUTTON = (By.XPATH, "//button[contains(., 'Save research') or contains(., 'Saving…')]")
    DOWNLOAD_BUTTON = (By.XPATH, "//button[contains(., 'Download PDF') or contains(., 'Preparing…')]")
    AUTH_PANEL = (By.CSS_SELECTOR, ".auth-action-panel")
    TITLE = (By.CSS_SELECTOR, "header.detail-heading h1.title")

    def load(self, research_id=1):
        self.go_to(f"/research/{research_id}")
        self.wait_for_form_ready()

    def click_save_favorite(self):
        time.sleep(1)  # Ensure React event handlers are hydrated
        self.click_js(self.SAVE_BUTTON)

    def click_download(self):
        time.sleep(1)
        self.click_js(self.DOWNLOAD_BUTTON)

    def is_auth_prompt_visible(self):
        return self.is_visible(self.AUTH_PANEL)

    def is_download_button_present(self):
        return len(self.driver.find_elements(*self.DOWNLOAD_BUTTON)) > 0
