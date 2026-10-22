from selenium.webdriver.common.by import By
from .base_page import BasePage

class ProfilePage(BasePage):
    FIRST_NAME_INPUT = (By.CSS_SELECTOR, "input[placeholder='ชื่อจริง']")
    LAST_NAME_INPUT = (By.CSS_SELECTOR, "input[placeholder='นามสกุล']")
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[type='email']")
    STUDENT_ID_INPUT = (By.CSS_SELECTOR, "input[placeholder='รหัสนักศึกษา']")
    DEPARTMENT_SELECT = (By.CSS_SELECTOR, "form select")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[placeholder='รหัสผ่านใหม่']")
    CONFIRM_PASSWORD_INPUT = (By.CSS_SELECTOR, "input[placeholder='ยืนยันรหัสผ่านใหม่']")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")

    def load(self):
        self.go_to("/student/profile")

    def get_first_name(self):
        return self.wait.until(lambda d: d.find_element(*self.FIRST_NAME_INPUT).get_attribute("value"))

    def get_last_name(self):
        return self.wait.until(lambda d: d.find_element(*self.LAST_NAME_INPUT).get_attribute("value"))

    def get_email(self):
        return self.wait.until(lambda d: d.find_element(*self.EMAIL_INPUT).get_attribute("value"))

    def get_student_id(self):
        return self.wait.until(lambda d: d.find_element(*self.STUDENT_ID_INPUT).get_attribute("value"))

    def get_department(self):
        return self.wait.until(lambda d: d.find_element(*self.DEPARTMENT_SELECT).get_attribute("value"))

    def update_profile(self, first_name=None, last_name=None, department=None, new_password=None, confirm_password=None):
        if first_name is not None:
            self.set_react_input(self.FIRST_NAME_INPUT, first_name)
        if last_name is not None:
            self.set_react_input(self.LAST_NAME_INPUT, last_name)
        if department is not None:
            self.set_react_select(self.DEPARTMENT_SELECT, department)
        if new_password is not None:
            self.set_react_input(self.PASSWORD_INPUT, new_password)
        if confirm_password is not None:
            self.set_react_input(self.CONFIRM_PASSWORD_INPUT, confirm_password)
        self.click_js(self.SUBMIT_BUTTON)

    def wait_for_success(self, timeout=10):
        return self.wait_for_toast("อัปเดตข้อมูลส่วนตัวสำเร็จ", timeout=timeout)
