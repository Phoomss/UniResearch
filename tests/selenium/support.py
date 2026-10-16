"""Selenium page helpers and independent API/database evidence."""

import sqlite3
from urllib.parse import urlparse

import httpx
from selenium.common.exceptions import (
    ElementClickInterceptedException,
    StaleElementReferenceException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

from .assets import PDF, PNG
from .dataset import (
    EXTRA_EMAILS,
    SOURCE_WORKS,
    SUBMISSION_TITLE,
    identity,
    submission_fields,
)

COOKIE = "uniresearch_access_token"


class Evidence:
    def __init__(self, root, backend, frontend, password):
        self.root, self.backend, self.frontend = root, backend, frontend
        self.password = password
        self.http = httpx.Client(base_url=backend, timeout=30, trust_env=False)
        self.tokens = {}
        self.events = []

    def rows(self, sql, args=()):
        with sqlite3.connect(self.root / "test.db") as db:
            db.row_factory = sqlite3.Row
            rows = [dict(row) for row in db.execute(sql, args)]
        self.events.append(
            {
                "database_query": sql,
                "row_count": len(rows),
                "rows": [
                    {
                        key: value
                        for key, value in row.items()
                        if key not in {"hashed_password", "password", "embedding"}
                    }
                    for row in rows
                ],
            }
        )
        return rows

    def execute(self, sql, args=()):
        with sqlite3.connect(self.root / "test.db") as db:
            db.execute(sql, args)

    def scalar(self, sql, args=()):
        return next(iter(self.rows(sql, args)[0].values()))

    def email(self, role="S1"):
        from .ui_runtime import account_email

        return account_email(role)

    def token(self, role="S1"):
        if role not in self.tokens:
            response = self.http.post(
                "/auth/login",
                data={
                    "username": self.email(role),
                    "password": self.password,
                },
            )
            assert response.status_code == 200, (
                f"Fixture login {role}: HTTP {response.status_code}"
            )
            self.tokens[role] = response.json()["access_token"]
        return self.tokens[role]

    def call(self, method, path, role=None, status=200, **kwargs):
        headers = dict(kwargs.pop("headers", {}))
        if role:
            headers["Authorization"] = f"Bearer {self.token(role)}"
        r = self.http.request(method, path, headers=headers, **kwargs)
        # Never log request bodies, headers, cookies, passwords or tokens.
        self.events.append({"method": method, "path": path, "status": r.status_code})
        assert r.status_code == status, (
            f"{method} {path}: expected {status}, got {r.status_code}"
        )
        return r.json() if r.content else None

    def form(self, **changes):
        fields = submission_fields(changes.get("title_th", SUBMISSION_TITLE))
        return {**{key: str(value) for key, value in fields.items()}, **changes}

    def work(self, wid):
        return self.rows("SELECT * FROM research_works WHERE id=?", (wid,))[0]

    def storage_path(self, path):
        return self.root / path

    def files(self):
        return sorted(
            str(p.relative_to(self.root))
            for p in (self.root / "static").rglob("*")
            if p.is_file()
        )

    def observe(self, message):
        self.events.append({"observation": message})


class Pages:
    def __init__(self, driver, evidence):
        self.driver, self.e = driver, evidence
        self.wait = WebDriverWait(driver, 30)

    def open(self, path):
        self.driver.get(self.e.frontend + path)
        self.wait.until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )

    def element(self, css):
        return self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, css)))

    def fill(self, name, value):
        el = self.element(
            f'input[name="{name}"], textarea[name="{name}"], select[name="{name}"]'
        )
        el.clear()
        el.send_keys(str(value))

    def button(self, text):
        locator = (By.XPATH, f"//button[normalize-space(.)='{text}']")
        self.click(locator)

    def click(self, locator):
        # CSS smooth scrolling and animated layouts can move an element between
        # WebDriver's visibility check and its native click. Wait for hit testing,
        # then retry the native click if another animation intervenes.
        previous_position = None

        def attempt(driver):
            nonlocal previous_position
            try:
                el = driver.find_element(*locator)
                if not el.is_displayed() or not el.is_enabled():
                    return False
                position = driver.execute_script(
                    """
                    const el=arguments[0];
                    el.scrollIntoView({block:'center',behavior:'instant'});
                    const r=el.getBoundingClientRect();
                    const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
                    return hit && el.contains(hit) ? [r.x,r.y,r.width,r.height] : null;
                """,
                    el,
                )
                if not position or position != previous_position:
                    previous_position = position
                    return False
                el.click()
                return True
            except (ElementClickInterceptedException, StaleElementReferenceException):
                return False

        self.wait.until(attempt)

    def text(self, text):
        self.wait.until(lambda d: text in d.find_element(By.TAG_NAME, "body").text)

    def login(self, role="S1", password=None):
        self.open("/login")
        self.element('form[data-hydrated="true"]')
        self.fill("email", self.e.email(role))
        self.fill("password", password or self.e.password)
        self.button_by_css('form button[type="submit"]')
        self.wait.until(lambda d: urlparse(d.current_url).path != "/login")
        assert self.driver.get_cookie(COOKIE), "Login did not create a session"

    def select_element(self, element, value):
        Select(element).select_by_value(value)

    def upload(self, field, path):
        self.driver.find_element(By.NAME, field).send_keys(str(path))

    def participants(self):
        self.open("/student/research/new")
        self.submission_ready()
        self.fill("title_th", SUBMISSION_TITLE)
        self.fill("title_en", SOURCE_WORKS[0]["title_en"])
        Select(self.element('[name="category_id"]')).select_by_value("1")
        self.button("ดำเนินการต่อ")
        self.element(".people-fields")
        return [
            Select(el)
            for el in self.driver.find_elements(
                By.CSS_SELECTOR, ".people-fields select"
            )
        ]

    def submit(self, title=SUBMISSION_TITLE, edit_id=None):
        values = submission_fields(title)
        if edit_id:
            # Navigate through the personal list, using the real edit control.
            self.open("/student/research")
            self.click((By.CSS_SELECTOR, f'a[href="/student/research/edit/{edit_id}"]'))
        else:
            if not self.driver.find_elements(
                By.CSS_SELECTOR, 'a[href="/student/research"]'
            ):
                self.open("/account/saved")
            self.click((By.CSS_SELECTOR, 'a[href="/student/research"]'))
            self.click((By.CSS_SELECTOR, 'a[href="/student/research/new"]'))
        self.submission_ready()
        for field in ("title_th", "title_en", "academic_year"):
            self.fill(field, values[field])
        for field in ("category_id", "department", "work_type"):
            self.select_element(self.element(f'[name="{field}"]'), str(values[field]))
        self.button("ดำเนินการต่อ")
        self.element(".people-fields")
        selects = self.driver.find_elements(By.CSS_SELECTOR, ".people-fields select")
        self.select_element(selects[0], "2")
        self.select_element(selects[-1], "5")
        self.button("ดำเนินการต่อ")
        self.fill("abstract", values["abstract"])
        for keyword in values["keywords"].split(","):
            self.fill("keyword_input_temp", keyword.strip())
            self.element('[name="keyword_input_temp"]').send_keys(Keys.ENTER)
        self.button("ดำเนินการต่อ")
        for field, filename, content in [
            ("cover_image", "cover.png", PNG),
            (
                "document",
                "paper-revised.pdf" if edit_id else "paper.pdf",
                getattr(self.e, "document_content", PDF),
            ),
        ]:
            path = self.e.root / filename
            path.write_bytes(content)
            self.upload(field, path)
        self.button("ดำเนินการต่อ")
        self.wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//button[normalize-space(.)='ยืนยันและส่งผลงาน']")
            )
        )
        self.button("ยืนยันและส่งผลงาน")
        self.text("แก้ไขผลงานเรียบร้อยแล้ว" if edit_id else "ส่งผลงานเรียบร้อยแล้ว")
        matches = self.e.rows(
            "SELECT id FROM research_works WHERE title_th=?", (title,)
        )
        assert len(matches) == 1, f"Expected one persisted submission titled {title!r}"
        return matches[0]["id"]

    def submission_ready(self):
        # Options are populated by a client useEffect, so their arrival is an
        # observable hydration signal before typing into controlled fields.
        self.wait.until(
            lambda d: d.find_elements(
                By.CSS_SELECTOR,
                'select[name="department"] option[value="วิทยาการคอมพิวเตอร์"]',
            )
        )

    def review(self, wid=2):
        self.open(f"/advisor/reviews/{wid}")
        Select(self.element('[name="status_result"]')).select_by_value("approved")
        self.fill("score", 80)
        self.fill("comment_text", "Selenium verified review")
        self.button("ยืนยันผลการประเมิน")
        self.button("ยืนยัน")
        self.text("บันทึกผลการประเมินผลงานสำเร็จ")

    def category(self, name="Selenium C2"):
        self.open("/admin/categories")
        self.fill("category_name", name)
        self.fill("description", "Created through Selenium")
        self.button("เพิ่มหมวดหมู่")
        self.wait.until(
            lambda _: (
                self.e.scalar(
                    "SELECT count(*) FROM categories WHERE category_name=?", (name,)
                )
                == 1
            )
        )
        self.open("/admin/categories")
        self.text(name)

    def notifications(self):
        self.button_by_css('[aria-label="การแจ้งเตือน"]')

    def button_by_css(self, css):
        self.click((By.CSS_SELECTOR, css))

    def create_user(self):
        person = identity(EXTRA_EMAILS["new_user"])
        if not self.driver.find_elements(By.CSS_SELECTOR, 'a[href="/admin/users"]'):
            self.open("/admin")
        self.click((By.CSS_SELECTOR, 'a[href="/admin/users"]'))
        self.button("เพิ่มผู้ใช้ใหม่")
        for name in ("email", "first_name", "last_name", "student_id"):
            self.fill(name, person[name])
        self.fill("password", self.e.password)
        self.select_element(self.element('[name="role"]'), person["role"])
        self.select_element(self.element('[name="department"]'), person["department"])
        self.button_by_css('form button[type="submit"]')
        self.wait.until(
            lambda _: (
                self.e.scalar(
                    "SELECT count(*) FROM users WHERE email=?", (person["email"],)
                )
                == 1
            )
        )
        return self.e.rows("SELECT id FROM users WHERE email=?", (person["email"],))[0][
            "id"
        ]
