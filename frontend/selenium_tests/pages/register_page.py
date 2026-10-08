from selenium.webdriver.common.by import By
from .base_page import BasePage

class RegisterPage(BasePage):
    FIRST_NAME_INPUT = (By.NAME, "first_name")
    LAST_NAME_INPUT = (By.NAME, "last_name")
    EMAIL_INPUT = (By.NAME, "email")
    PASSWORD_INPUT = (By.NAME, "password")
    CONFIRM_PASSWORD_INPUT = (By.NAME, "confirmPassword")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")

    def load(self):
        self.go_to("/register")

    def submit_empty(self):
        self.click(self.SUBMIT_BUTTON)

    def register(self, first_name, last_name, email, password, confirm_password=None):
        if confirm_password is None:
            confirm_password = password
        self.send_keys(self.FIRST_NAME_INPUT, first_name)
        self.send_keys(self.LAST_NAME_INPUT, last_name)
        self.send_keys(self.EMAIL_INPUT, email)
        self.send_keys(self.PASSWORD_INPUT, password)
        self.send_keys(self.CONFIRM_PASSWORD_INPUT, confirm_password)
        self.click(self.SUBMIT_BUTTON)
