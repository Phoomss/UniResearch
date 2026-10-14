"""Page objects extending the established Selenium helpers for scoped workflows."""

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

from .support import Pages


class UIPage(Pages):
    """Observe reusable Selenium operations without instrumenting HTTP assertions."""

    def __init__(self, driver, evidence):
        super().__init__(driver, evidence)
        self.wait = WebDriverWait(driver, evidence.timeout)
        self.recorder = evidence.browser_evidence

    def open(self, path):
        with self.recorder.step("เปิดหน้า", path, screenshot=True):
            super().open(path)

    def fill(self, name, value):
        # Values are deliberately omitted: forms may contain account credentials.
        with self.recorder.step("กรอกช่อง", name):
            super().fill(name, value)

    def click(self, locator):
        with self.recorder.step("คลิก", locator[1], screenshot=True):
            super().click(locator)

    def text(self, text):
        with self.recorder.step("รอข้อความที่มองเห็น", text, screenshot=True):
            super().text(text)

    def login(self, role="S1", password=None):
        with self.recorder.step("ล็อกอินผ่านฟอร์ม", role, screenshot=True):
            super().login(role, password)

    def select(self, css, value):
        with self.recorder.step("เลือกตัวเลือก", css + "=" + value, screenshot=True):
            Select(self.element(css)).select_by_value(value)

    def select_element(self, element, value):
        with self.recorder.step(
            "เลือกผู้เกี่ยวข้อง",
            element.get_attribute("name") or "participant",
            screenshot=True,
        ):
            super().select_element(element, value)

    def upload(self, field, path):
        with self.recorder.step("อัปโหลดไฟล์", field, screenshot=True):
            self.driver.find_element(By.NAME, field).send_keys(str(path))

    def body_text(self):
        return self.driver.find_element(By.TAG_NAME, "body").text

    def visible_status(self, wid, expected):
        self.open(f"/research/{wid}")
        locator = (By.CSS_SELECTOR, ".detail-meta .status")
        # Status renders its localized label in the public detail metadata strip.
        with self.recorder.step("ตรวจสถานะบนหน้าจอ", expected, screenshot=True):
            element = self.wait.until(EC.visibility_of_element_located(locator))
            self.wait.until(lambda _: element.text == expected)
            return element.text

    def my_submission_status(self, title):
        self.open("/student/research")
        self.text(title)
        locator = (
            By.XPATH,
            f"//article[contains(@class,'submission-card')][.//h2[normalize-space(.)='{title}']]//span[contains(@class,'status')]",
        )
        with self.recorder.step("อ่านสถานะในผลงานของฉัน", title, screenshot=True):
            return self.wait.until(EC.visibility_of_element_located(locator)).text

    def submit(self, title="งานวิจัยทดสอบ Selenium", edit_id=None):
        with self.recorder.step("ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์", title, screenshot=True):
            return super().submit(title, edit_id)

    def create_user(self):
        uid = super().create_user()
        self.text("u3@example.org")
        return uid

    def error_message(self):
        with self.recorder.step("อ่านข้อความปฏิเสธ", "toast-error", screenshot=True):
            return self.element(".toast-error .toast-message").text

    def mark_notification_read(self, all_notifications=False):
        if all_notifications:
            self.button("อ่านทั้งหมด")
            self.text("ทำเครื่องหมายว่าอ่านแล้วทั้งหมด")
        else:
            self.button_by_css('button[title="ทำเครื่องหมายว่าอ่านแล้ว"]')
            self.text("ทำเครื่องหมายว่าอ่านแล้ว")
        self.wait.until(
            lambda d: (
                not d.find_elements(
                    By.CSS_SELECTOR, 'button[title="ทำเครื่องหมายว่าอ่านแล้ว"]'
                )
            )
        )


class ReviewPage(UIPage):
    def review_from_queue(self, wid=2):
        self.open("/advisor/reviews")
        self.click((By.CSS_SELECTOR, f'a[href="/advisor/reviews/{wid}"]'))
        self.wait.until(lambda d: d.current_url.endswith(f"/advisor/reviews/{wid}"))
        self.text("W2 งานวิจัย Selenium" if wid == 2 else "Cross-role Selenium Research")
        self.select('[name="status_result"]', "approved")
        self.fill("score", 80)
        self.fill("comment_text", "Selenium verified review")
        self.button("ยืนยันผลการประเมิน")
        self.text("ยืนยันการอนุมัติผลงาน")
        self.button("ยืนยัน")
        self.text("บันทึกผลการประเมินผลงานสำเร็จ")


class SessionPage(UIPage):
    def logout(self):
        self.button("ออกจากระบบ")
        self.wait.until(lambda d: d.get_cookie("uniresearch_access_token") is None)


class OptionsPage(UIPage):
    def attempt_student_change(self):
        self.open("/admin/options")
        field = self.element('input[placeholder="เพิ่มภาควิชาใหม่ เช่น วิศวกรรมคอมพิวเตอร์"]')
        field.send_keys("Denied Selenium Department")
        self.button_by_css('button[aria-label="เพิ่มภาควิชา"]')
        self.text("Denied Selenium Department")
        self.button("บันทึกการตั้งค่าทั้งหมด")
        return self.error_message()


class DocumentPage(UIPage):
    def download(self, wid):
        self.open(f"/research/{wid}")
        self.button("Download PDF")
        self.text("The document download has started.")
        destination = self.e.root / "downloads" / f"research-{wid}.pdf"
        self.wait.until(
            lambda _: destination.exists() and destination.stat().st_size > 0
        )
        return destination


class AIReviewPage(UIPage):
    def analyze(self, wid, tab, expected):
        self.open(f"/advisor/reviews/{wid}")
        self.text("AI Peer Review Assistant")
        self.button(tab)
        self.text(expected)
        self.e.observe(f"TC-046 Selenium tab {tab}: visible result {expected}")
        screenshot = self.recorder.capture("AI-" + tab)
        self.e.events.append({"ui_tab": tab, "screenshot": screenshot})
        assert expected in self.driver.find_element(By.TAG_NAME, "body").text, (
            f"AI tab {tab}: expected visible result {expected!r}"
        )


class RegistrationPage(UIPage):
    def register_with_admin_role(self):
        self.open("/register")
        self.element('form[data-hydrated="true"]')
        for name, value in {
            "first_name": "ทดสอบ",
            "last_name": "ระบบ",
            "email": "newui@example.org",
            "password": self.e.password,
            "confirmPassword": self.e.password,
        }.items():
            self.fill(name, value)
        # Simulate a malicious client at the real form's network boundary.
        # The frontend proxy and backend authorization remain unmodified.
        self.driver.execute_script("""
            const originalFetch = window.fetch.bind(window);
            window.fetch = (url, options) => {
                if (url === '/api/auth/register' && options?.body) {
                    const body = JSON.parse(options.body);
                    body.role = 'admin';
                    sessionStorage.setItem('selenium_registration_role', body.role);
                    options = {...options, body: JSON.stringify(body)};
                }
                return originalFetch(url, options);
            };
        """)
        self.button("สร้างบัญชี")
        self.wait.until(lambda d: "/login?registered=1" in d.current_url)
        assert (
            self.driver.execute_script(
                "return sessionStorage.getItem('selenium_registration_role')"
            )
            == "admin"
        ), "Registration UI request must actually submit the forged admin role"
        self.e.observe(
            "Browser registration form submitted role=admin; persisted role checked separately"
        )


class SubmissionPage(ReviewPage):
    def submission_ready(self):
        from selenium.webdriver.support.ui import Select

        super().submission_ready()
        Select(self.element('[name="department"]')).select_by_visible_text(
            "วิทยาการคอมพิวเตอร์"
        )
        Select(self.element('[name="work_type"]')).select_by_visible_text("วิทยานิพนธ์")
        self.fill("academic_year", "2569")

    def fill(self, name, value):
        super().fill(name, value)
        if name == "abstract":
            for keyword in ["selenium", "research"]:
                super().fill("keyword_input_temp", keyword)
                self.button("เพิ่ม")
