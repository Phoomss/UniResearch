"""
Page Object for Authentication: /login and /register.
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class LoginPage(BasePage):
    # Locators
    EMAIL_INPUT = (By.CSS_SELECTOR, 'input[name="email"]')
    PASSWORD_INPUT = (By.CSS_SELECTOR, 'input[name="password"]')
    LOGIN_SUBMIT_BTN = (By.CSS_SELECTOR, 'button[type="submit"]')
    REGISTER_LINK = (By.CSS_SELECTOR, 'a[href="/register"]')
    
    # Registration specific locators
    FIRST_NAME_INPUT = (By.CSS_SELECTOR, 'input[name="first_name"]')
    LAST_NAME_INPUT = (By.CSS_SELECTOR, 'input[name="last_name"]')
    CONFIRM_PASSWORD_INPUT = (By.CSS_SELECTOR, 'input[name="confirmPassword"]')
    REGISTER_SUBMIT_BTN = (By.CSS_SELECTOR, 'button[type="submit"]')

    # Feedback / Errors
    ERROR_ALERT = (By.CSS_SELECTOR, '.toast-error, [role="alert"], .error-message')

    def navigate_to_login(self, next_path=None):
        path = f"/login?next={next_path}" if next_path else "/login"
        self.open(path)

    def navigate_to_register(self):
        self.open("/register")

    def login(self, email, password):
        """Performs full login action."""
        self.fill(self.EMAIL_INPUT, email)
        self.fill(self.PASSWORD_INPUT, password)
        self.click(self.LOGIN_SUBMIT_BTN)

    def login_and_wait_for_redirect(self, email, password, expected_path_contains=None):
        """Logs in and explicitly waits for URL to leave /login."""
        self.login(email, password)
        if expected_path_contains:
            self.wait_for_url_contains(expected_path_contains)
        else:
            self.wait.until(lambda d: "/login" not in d.current_url)

    def register(self, first_name, last_name, email, password, confirm_password=None):
        """Performs registration."""
        cp = confirm_password if confirm_password is not None else password
        self.fill(self.FIRST_NAME_INPUT, first_name)
        self.fill(self.LAST_NAME_INPUT, last_name)
        self.fill(self.EMAIL_INPUT, email)
        self.fill(self.PASSWORD_INPUT, password)
        self.fill(self.CONFIRM_PASSWORD_INPUT, cp)
        self.click(self.REGISTER_SUBMIT_BTN)

    def get_error_text(self):
        """Returns error alert text if present."""
        if self.is_visible(self.ERROR_ALERT, timeout=5):
            return self.get_text(self.ERROR_ALERT)
        return ""

    def logout_via_api(self):
        """Triggers frontend logout endpoint to clear session cookies."""
        self.driver.execute_script("fetch('/api/auth/logout', {method: 'POST'});")
