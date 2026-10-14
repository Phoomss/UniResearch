"""Page objects extending the established Selenium helpers for scoped workflows."""

from selenium.webdriver.common.by import By

from .support import Pages


class SessionPage(Pages):
    def logout(self):
        self.button("ออกจากระบบ")
        self.wait.until(lambda d: d.get_cookie("uniresearch_access_token") is None)


class OptionsPage(Pages):
    def attempt_student_change(self):
        self.open("/admin/options")
        field = self.element('input[placeholder="เพิ่มภาควิชาใหม่ เช่น วิศวกรรมคอมพิวเตอร์"]')
        field.send_keys("Denied Selenium Department")
        self.button_by_css('button[aria-label="เพิ่มภาควิชา"]')
        self.text("Denied Selenium Department")
        self.button("บันทึกการตั้งค่าทั้งหมด")
        self.element(".toast-error .toast-message")


class DocumentPage(Pages):
    def download(self, wid):
        self.open(f"/research/{wid}")
        self.button("Download PDF")
        self.text("The document download has started.")
        destination = self.e.root / "downloads" / f"research-{wid}.pdf"
        self.wait.until(
            lambda _: destination.exists() and destination.stat().st_size > 0
        )
        return destination


class AIReviewPage(Pages):
    def analyze(self, wid, tab, expected):
        self.open(f"/advisor/reviews/{wid}")
        self.text("AI Peer Review Assistant")
        self.button(tab)
        self.text(expected)
        self.e.observe(f"TC-046 Selenium tab {tab}: visible result {expected}")
        screenshot = f"TC-046-{tab.lower().replace(' ', '-')}.png"
        self.driver.save_screenshot(str(self.e.artifact_dir / screenshot))
        self.e.events.append({"ui_tab": tab, "screenshot": screenshot})
        assert expected in self.driver.find_element(By.TAG_NAME, "body").text, (
            f"AI tab {tab}: expected visible result {expected!r}"
        )


class RegistrationPage(Pages):
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


class SubmissionPage(Pages):
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
