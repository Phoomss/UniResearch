# 🧪 UniResearch Frontend E2E Test Suite (`e2e_tests`)

คู่มือและคำอธิบายโครงสร้างโฟลเดอร์ หน้าที่ของไฟล์ และขั้นตอนการรันชุดทดสอบอัตโนมัติระดับ **End-to-End (E2E)** ของระบบ UniResearch ด้วย **Selenium WebDriver + Pytest**

---

## 📌 1. ภาพรวมชุดทดสอบ (Overview)

โฟลเดอร์ `frontend/e2e_tests` มีหน้าที่ทดสอบการทำงานของเว็บแอปพลิเคชันเสมือนผู้ใช้งานจริง (User Journey Simulation) ครอบคลุมวงจรชีวิตการทำงานของระบบตั้งแต่ต้นจนจบ:
* การสมัครสมาชิกและระบบตรวจสอบ Validation ฝั่งไคลเอนต์
* การเข้าสู่ระบบและการควบคุมสิทธิ์การเข้าถึงตามบทบาท (RBAC Guard)
* กระบวนการส่งงานวิจัยแบบหลายขั้นตอน (5-Step Form Stepper)
* การตรวจสอบขอบเขตขนาดไฟล์อัปโหลด (จำกัด 25MB)
* คิวและกระบวนการตรวจประเมินงานวิจัยของอาจารย์ที่ปรึกษา
* ผู้ช่วย AI ช่วยเขียนบทคัดย่อ และระบบแชตบอต RAG (Graceful Timeout Fallback)
* การรองรับมาตรฐานการเข้าถึงของผู้พิการ (W3C Accessibility / a11y)

---

## 📁 2. โครงสร้าง Path และหน้าที่ของแต่ละไฟล์ (Directory & File Architecture)

```text
D:\UniResearch\frontend\e2e_tests\
│
├── 📂 pages/                      # Page Object Model (POM) รวบรวมคลาสตัวแทนของหน้าจอ UI
│   ├── base_page.py              # คลาสแม่: จัดการ Explicit Wait, เลื่อนจอ, และแก้ React 19 State
│   ├── login_page.py             # จัดการฟอร์มเข้าสู่ระบบ (/login)
│   └── register_page.py          # จัดการฟอร์มสมัครสมาชิก (/register)
│
├── 📂 tests/                      # สคริปต์กรณีทดสอบทั้งหมด (Test Suites)
│   ├── test_registration.py      # TC-FE-001, TC-FE-002: การสมัครสมาชิก & Client-side Validation
│   ├── test_authentication.py    # TC-FE-003, TC-FE-004: การล็อกอิน & ป้องกันสิทธิ์ Admin (RBAC)
│   ├── test_research_submission.py# TC-FE-005, TC-FE-006: เวิร์กโฟลว์ส่งงานวิจัย & ดักไฟล์เกิน 25MB
│   ├── test_accessibility.py     # TC-FE-007: ตรวจสอบ W3C a11y Form Labels & Screen Reader
│   ├── test_advisor_review.py    # TC-FE-008: คิวตรวจงานและบันทึกผลการประเมินของอาจารย์
│   ├── test_ai_assistant.py      # TC-FE-009: ผู้ช่วย AI เขียนบทคัดย่อในแถบเครื่องมือ
│   └── test_chatbot.py           # TC-FE-010: RAG Chatbot การตอบสนองและการรับมือกรณี Timeout
│
├── 📂 fixtures/                   # ข้อมูลจำลองและไฟล์สำหรับใช้ในการทดสอบ
│   └── files/
│       └── oversized.pdf         # ไฟล์ PDF จำลองขนาด 26MB สำหรับทดสอบ Boundary Limit
│
├── 📂 utils/                      # เครื่องมือเสริมและค่ายูทิลิตี้
│   └── config.py                 # โหลด Environment Variables จากไฟล์ .env
│
├── ⚙️ .env                       # กำหนดค่า URL, โหมด Headless, และรหัสผ่านบัญชีทดสอบ
├── ⚙️ conftest.py                # Pytest Fixture: เริ่มต้น WebDriver, แคปภาพเมื่อเทสต์พัง
├── ⚙️ pytest.ini                 # ตั้งค่า Pytest Flags, Markers, และเปิดใช้ HTML Report
├── 📦 requirements.txt           # รายการแพ็กเกจ Python (selenium, pytest, python-docx ฯลฯ)
│
├── 📝 create_docx_report.py      # สคริปต์สร้างรายงานผลการทดสอบ Microsoft Word (.docx)
├── 📄 E2E_TEST_REPORT.md         # เอกสารรายงานผลการทดสอบฉบับสมบูรณ์ (ภาษาอังกฤษ)
├── 📄 E2E_TEST_REPORT_TH.md      # เอกสารรายงานผลการทดสอบฉบับสมบูรณ์ (ภาษาไทย)
└── 📘 E2E_Test_Report_UniResearch.docx # ไฟล์รายงานทางการ Microsoft Word จัดรูปแบบพร้อมส่งงาน
```

---

## 📑 3. สรุปหน้าที่ตามตาราง (Path & Responsibility Reference)

| Path / ไฟล์ | ประเภท | หน้าที่หลัก (Responsibilities) |
| :--- | :--- | :--- |
| `pages/base_page.py` | Core Architecture | จัดการ WebDriver Explicit Wait, การคลิก Element ที่ปลอดภัย, การเลื่อนหน้าจอ, และฟังก์ชัน `set_react_input` / `set_react_select` สำหรับ Dispatch Event ให้ React 19 รับรู้การเปลี่ยนแปลง |
| `pages/login_page.py` | Page Object | รวบรวม Locators และ Method ในการกรอกอีเมล/รหัสผ่าน และสั่ง Submit หน้า Login |
| `pages/register_page.py` | Page Object | รวบรวม Locators และ Method ในการกรอกฟอร์มสมัครสมาชิก พร้อมเช็ค Error Text |
| `tests/` | Test Suites | โฟลเดอร์รวมกรณีทดสอบทั้งหมด 10 Test Cases รองรับการรันแยกไฟล์หรือรันรวม |
| `fixtures/files/` | Test Data | จัดเก็บไฟล์ตัวอย่างที่ต้องใช้ในการทดสอบ เช่น ไฟล์ขนาด 26MB สำหรับเช็ค Validation |
| `conftest.py` | Test Configuration | จัดการ Chrome WebDriver Lifecycle แบบ Function Scope และจับภาพหน้าจออัตโนมัติเมื่อเกิดข้อผิดพลาด |
| `pytest.ini` | Test Configuration | ตั้งค่า Runner, Marker Tags (`@pytest.mark.tc_fe_xxx`), และสร้าง HTML Report |
| `create_docx_report.py` | Utility Script | สคริปต์คอมไพล์ข้อมูลทั้งหมดออกเป็นเล่มรายงาน Word (.docx) สวยงามตามมาตรฐานราชการ/สากล |
| `.env` | Config File | เก็บ URL ของ Frontend และบัญชีผู้ใช้ทดสอบ 3 กลุ่ม (Student, Advisor, Admin) |

---

## 🚀 4. วิธีการรันแบบรวดเร็ว (Quick Start)

### ขั้นตอนที่ 1: เตรียม Backend & Database (ผ่าน Docker)
```powershell
cd D:\UniResearch
docker compose up -d
# ตรวจสอบความพร้อมของ API Backend
curl http://localhost:8000/health
```

### ขั้นตอนที่ 2: รัน Frontend Dev Server
```powershell
cd D:\UniResearch\frontend
pnpm dev --port 3000
# ตรวจสอบว่าหน้าเว็บเปิดได้ที่ http://localhost:3000
```

### ขั้นตอนที่ 3: สั่งรันชุดทดสอบ (Run Tests)

เข้าไปที่โฟลเดอร์ `e2e_tests` และรันคำสั่ง:

```powershell
cd D:\UniResearch\frontend\e2e_tests

# 1. รันการทดสอบทั้งหมด 10 กรณีทดสอบ
python -m pytest tests/ -v

# 2. รันเฉพาะเคสที่ต้องการ (ตัวอย่าง: รันเฉพาะระบบ Chatbot)
python -m pytest tests/test_chatbot.py -v

# 3. รันผ่าน pnpm script จาก root frontend
cd D:\UniResearch\frontend
pnpm test:e2e:py
```

### ขั้นตอนที่ 4: เปิดดูรายงานผลลัพธ์
```powershell
# เปิดดู Interactive HTML Test Report ในเบราว์เซอร์
Start-Process "D:\UniResearch\frontend\test-results\report.html"

# เปิดดูรายงาน Microsoft Word (.docx) ฉบับทางการ
Start-Process "D:\UniResearch\frontend\e2e_tests\E2E_Test_Report_UniResearch.docx"
```

---

## 🎯 5. ตารางกรณีทดสอบที่ครอบคลุม (Test Cases Coverage)

| Test ID | ไฟล์ทดสอบ | Scenario ที่ทดสอบ | สิ่งที่ตรวจสอบ |
| :---: | :--- | :--- | :--- |
| **TC-FE-001** | `test_registration.py` | Happy Path Registration | สมัครสมาชิกสำเร็จ นำทางไปหน้าเข้าสู่ระบบอัตโนมัติ |
| **TC-FE-002** | `test_registration.py` | Form Client Validation | แจ้งเตือนข้อผิดพลาดทันทีเมื่อข้อมูลไม่ครบตาม Zod Schema |
| **TC-FE-003** | `test_authentication.py` | Student Login & Session | นำทางไปหน้า Dashboard (`/account/saved`) สำเร็จ |
| **TC-FE-004** | `test_authentication.py` | RBAC Route Protection | นักศึกษาเข้าหน้า `/admin` โดน Server Guard ดีดกลับไปหน้าแรกทันที |
| **TC-FE-005** | `test_research_submission.py` | Multi-step Research Submission | กรอกฟอร์ม 5 ขั้นตอน บันทึกข้อมูลและแนบอาจารย์ที่ปรึกษาสำเร็จ |
| **TC-FE-006** | `test_research_submission.py` | Boundary File Upload | บล็อกการอัปโหลดไฟล์ขนาดเกิน 25MB ที่ฝั่งไคลเอนต์ทันที |
| **TC-FE-007** | `test_accessibility.py` | W3C Accessibility (a11y) | ตรวจสอบ Label ผูกกับ Input ID ถูกต้อง พร้อมรองรับ Screen Reader |
| **TC-FE-008** | `test_advisor_review.py` | Advisor Review Queue | อาจารย์ตรวจสอบงานในคิว อนุมัติผลงาน และส่งสถานะไป Backend สำเร็จ |
| **TC-FE-009** | `test_ai_assistant.py` | AI Writing Assistant | เปิดแถบ AI Co-Pilot แนะนำบทคัดย่อและนำข้อความใส่ฟอร์มอัตโนมัติ |
| **TC-FE-010** | `test_chatbot.py` | RAG Chatbot Fallback | แชตบอตตอบสนองสุภาพ ปลอดภัย ไม่แครชเมื่อ AI Server ไม่พร้อมใช้งาน |

---

## ⚙️ 6. การปรับแต่ง `.env`

ไฟล์ `D:\UniResearch\frontend\e2e_tests\.env` บรรจุค่าเริ่มต้นดังนี้:
```env
BASE_URL=http://localhost:3000
HEADLESS=true                       # เปลี่ยนเป็น false หากต้องการเปิดหน้าต่างเบราว์เซอร์ให้เห็นการทำงาน
STUDENT_EMAIL=s1@webmail.ac.th
STUDENT_PASSWORD=password123
ADVISOR_EMAIL=a1@university.ac.th
ADVISOR_PASSWORD=password123
ADMIN_EMAIL=admin@university.ac.th
ADMIN_PASSWORD=password123
```
