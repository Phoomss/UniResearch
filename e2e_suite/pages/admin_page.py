"""
Page Object for Admin Console: /admin, /admin/categories, /admin/users.
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class AdminPage(BasePage):
    # Admin General Locators
    ADMIN_HEADING = (By.XPATH, "//h1[contains(text(), 'ภาพรวมระบบ')] | //h1[contains(text(), 'การจัดการระบบ')]")

    # Categories Page Locators
    CAT_NAME_INPUT = (By.CSS_SELECTOR, 'input[name="category_name"]')
    CAT_DESC_TEXTAREA = (By.CSS_SELECTOR, 'textarea[name="description"]')
    CAT_SUBMIT_BTN = (By.XPATH, "//form[contains(@class, 'category-form')]//button[@type='submit']")
    CAT_SUCCESS_MSG = (By.XPATH, "//*[contains(text(), 'สร้างหมวดหมู่')] | //div[contains(@class, 'toast-success')]")

    # Users Page Locators
    OPEN_ADD_USER_BTN = (By.XPATH, "//button[contains(., 'เพิ่มผู้ใช้ใหม่') and not(@type='submit')]")
    USER_EMAIL_INPUT = (By.CSS_SELECTOR, '.modal-overlay input[name="email"]')
    USER_PASSWORD_INPUT = (By.CSS_SELECTOR, '.modal-overlay input[name="password"]')
    USER_FIRSTNAME_INPUT = (By.CSS_SELECTOR, '.modal-overlay input[name="first_name"]')
    USER_LASTNAME_INPUT = (By.CSS_SELECTOR, '.modal-overlay input[name="last_name"]')
    USER_ROLE_SELECT = (By.CSS_SELECTOR, '.modal-overlay select[name="role"]')
    USER_SUBMIT_BTN = (By.CSS_SELECTOR, '.modal-overlay button[type="submit"]')
    USER_ROW = (By.CSS_SELECTOR, '.admin-user-row')

    def navigate_to_dashboard(self):
        self.open("/admin")

    def navigate_to_categories(self):
        self.open("/admin/categories")

    def create_category(self, name, description=None):
        """Creates a new category via admin web form."""
        self.fill(self.CAT_NAME_INPUT, name)
        if description:
            self.fill(self.CAT_DESC_TEXTAREA, description)
        self.click(self.CAT_SUBMIT_BTN)
        self.find(self.CAT_SUCCESS_MSG, timeout=10)

    def navigate_to_users(self):
        self.open("/admin/users")

    def create_user(self, email, password, first_name="Test", last_name="User", role="advisor"):
        """Opens user modal and submits a new user."""
        self.click(self.OPEN_ADD_USER_BTN)
        self.fill(self.USER_EMAIL_INPUT, email)
        self.fill(self.USER_PASSWORD_INPUT, password)
        if first_name:
            self.fill(self.USER_FIRSTNAME_INPUT, first_name)
        if last_name:
            self.fill(self.USER_LASTNAME_INPUT, last_name)
        if role:
            self.select_by_value(self.USER_ROLE_SELECT, role)
        self.click(self.USER_SUBMIT_BTN)
        # Wait for modal to close or toast
        self.wait.until(lambda d: not self.is_visible((By.CSS_SELECTOR, '.modal-overlay'), timeout=1))
