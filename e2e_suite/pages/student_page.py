"""
Page Object for Student Portal: Profile, Research Submission Wizard, and Research Edit.
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class StudentPage(BasePage):
    # Profile Locators
    PROFILE_FIRST_NAME = (By.CSS_SELECTOR, 'input[placeholder="ชื่อจริง"]')
    PROFILE_LAST_NAME = (By.CSS_SELECTOR, 'input[placeholder="นามสกุล"]')
    PROFILE_DEPT_SELECT = (By.CSS_SELECTOR, 'select')
    PROFILE_PASSWORD_INPUT = (By.CSS_SELECTOR, 'input[placeholder="รหัสผ่านใหม่"]')
    PROFILE_CONFIRM_PASSWORD_INPUT = (By.CSS_SELECTOR, 'input[placeholder="ยืนยันรหัสผ่านใหม่"]')
    PROFILE_SAVE_BTN = (By.CSS_SELECTOR, 'form.advisor-profile-form button[type="submit"]')
    TOAST_SUCCESS = (By.CSS_SELECTOR, '.toast-success, [data-toast="success"]')

    # Research Submission Wizard Locators
    STEP_NEXT_BTN = (By.XPATH, "//button[contains(text(), 'ดำเนินการต่อ')]")
    TITLE_TH_INPUT = (By.XPATH, "//label[contains(text(), 'ชื่อผลงานภาษาไทย')]/following::input[1] | //input[@name='title_th']")
    TITLE_EN_INPUT = (By.XPATH, "//label[contains(text(), 'ชื่อผลงานภาษาอังกฤษ')]/following::input[1] | //input[@name='title_en']")
    CATEGORY_SELECT = (By.XPATH, "//label[contains(text(), 'หมวดหมู่')]/following::select[1] | //select[@name='category_id']")
    ADVISOR_SELECT = (By.XPATH, "//label[contains(text(), 'อาจารย์ที่ปรึกษา')]/following::select[1]")
    ABSTRACT_TEXTAREA = (By.XPATH, "//label[contains(text(), 'บทคัดย่อ')]/following::textarea[1] | //textarea[@name='abstract']")
    COVER_FILE_INPUT = (By.CSS_SELECTOR, 'input[name="cover_image"]')
    DOC_FILE_INPUT = (By.CSS_SELECTOR, 'input[name="document"]')
    FINAL_SUBMIT_BTN = (By.XPATH, "//button[contains(text(), 'ยืนยันและส่งผลงาน')]")
    SUCCESS_STATUS = (By.XPATH, "//*[contains(text(), 'ส่งผลงานเรียบร้อยแล้ว')] | //*[@role='status']")

    # Research List / My Research Locators
    RESEARCH_CARD = (By.CSS_SELECTOR, '.research-card, article')
    STATUS_BADGE = (By.CSS_SELECTOR, '.badge, .status')

    def navigate_to_profile(self):
        self.open("/student/profile")

    def update_profile(self, first_name=None, last_name=None, department=None, new_password=None, confirm_password=None):
        """Fills and submits student profile update form."""
        if first_name is not None:
            self.fill(self.PROFILE_FIRST_NAME, first_name)
        if last_name is not None:
            self.fill(self.PROFILE_LAST_NAME, last_name)
        if department is not None:
            self.select_by_visible_text(self.PROFILE_DEPT_SELECT, department)
        if new_password is not None:
            self.fill(self.PROFILE_PASSWORD_INPUT, new_password)
            cp = confirm_password if confirm_password is not None else new_password
            self.fill(self.PROFILE_CONFIRM_PASSWORD_INPUT, cp)
        self.click(self.PROFILE_SAVE_BTN)

    def navigate_to_new_research(self):
        self.open("/student/research/new")

    def submit_new_research(self, title_th, title_en, category_index=1, advisor_id=None, abstract=None, cover_path=None, doc_path=None):
        """Walks through the multi-step research submission wizard."""
        self.navigate_to_new_research()
        
        # Step 1: Research Info
        self.fill(self.TITLE_TH_INPUT, title_th)
        self.fill(self.TITLE_EN_INPUT, title_en)
        self.select_by_index(self.CATEGORY_SELECT, category_index)
        self.click(self.STEP_NEXT_BTN)

        # Step 2: Authors & Advisors
        if advisor_id is not None and self.is_visible(self.ADVISOR_SELECT, timeout=3):
            self.select_by_value(self.ADVISOR_SELECT, str(advisor_id))
        self.click(self.STEP_NEXT_BTN)

        # Step 3: Abstract
        abstract_text = abstract or "บทคัดย่อสำหรับการทดสอบระบบอัตโนมัติ End-to-End Suite"
        self.fill(self.ABSTRACT_TEXTAREA, abstract_text)
        self.click(self.STEP_NEXT_BTN)

        # Step 4: Files upload
        if cover_path:
            self.find_present(self.COVER_FILE_INPUT).send_keys(cover_path)
        if doc_path:
            self.find_present(self.DOC_FILE_INPUT).send_keys(doc_path)
        self.click(self.STEP_NEXT_BTN)

        # Step 5: Final Review & Confirmation
        self.js_click(self.FINAL_SUBMIT_BTN)
        self.find(self.SUCCESS_STATUS, timeout=10)

    def navigate_to_my_research(self):
        self.open("/student/research")

    def navigate_to_edit_research(self, research_id):
        self.open(f"/student/research/edit/{research_id}")
