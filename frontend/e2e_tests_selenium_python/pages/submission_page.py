from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from .base_page import BasePage

class SubmissionPage(BasePage):
    TITLE_TH = (By.NAME, "title_th")
    TITLE_EN = (By.NAME, "title_en")
    CATEGORY_SELECT = (By.NAME, "category_id")
    ABSTRACT_INPUT = (By.NAME, "abstract")
    DOCUMENT_INPUT = (By.CSS_SELECTOR, "input[name='document']")
    COVER_INPUT = (By.CSS_SELECTOR, "input[name='cover_image']")
    SUBMIT_BUTTON = (By.XPATH, "//button[contains(text(), 'ยืนยันและส่งผลงาน')]")
    CONTINUE_BUTTON = (By.XPATH, "//button[contains(text(), 'ดำเนินการต่อ')]")
    FIELD_ERROR = (By.CSS_SELECTOR, ".field-error")

    def load(self):
        self.go_to("/student/research/new")

    def fill_step0(self, title_th="งานวิจัยทดสอบ", title_en="Test Research"):
        self.wait_for_form_ready()
        self.set_react_input(self.TITLE_TH, title_th)
        self.set_react_input(self.TITLE_EN, title_en)
        cat_elem = self.find_element(self.CATEGORY_SELECT)
        select = Select(cat_elem)
        for opt in select.options:
            val = opt.get_attribute("value")
            if val:
                self.set_react_select(self.CATEGORY_SELECT, val)
                break

    def upload_document(self, file_path):
        doc_input = self.driver.find_element(*self.DOCUMENT_INPUT)
        doc_input.send_keys(file_path)

    def upload_cover(self, file_path):
        cover_input = self.driver.find_element(*self.COVER_INPUT)
        cover_input.send_keys(file_path)

    def get_error_message(self, text_fragment):
        locator = (By.XPATH, f"//*[contains(@class, 'field-error') and contains(text(), '{text_fragment}')]")
        return self.wait_for_element_text(locator)
