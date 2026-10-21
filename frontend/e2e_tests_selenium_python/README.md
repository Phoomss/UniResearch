# UniResearch — E2E Automation Testing Framework (Selenium + Python)

ระบบทดสอบอัตโนมัติระดับ End-to-End (E2E) สำหรับเว็บแอปพลิเคชัน **UniResearch** (Next.js 16 + FastAPI + PostgreSQL) พัฒนาด้วย **Selenium WebDriver 4.x**, **pytest 8.x**, และสถาปัตยกรรม **Page Object Model (POM)** โดยมุ่งเน้นการตรวจสอบ 8 กรณีทดสอบหลักตามข้อกำหนดฟังก์ชันงาน (8 Target Core Test Cases)

---

## 📌 สรุปขอบเขตกรณีทดสอบเป้าหมาย (The 8 Target Test Cases)

ชุดทดสอบในคลังนี้ได้รับการปรับปรุงและจัดระเบียบใหม่ (Overhaul & Scope Pruning) เพื่อโฟกัสเฉพาะ 8 กรณีทดสอบหลักที่ครอบคลุมฟังก์ชันสำคัญยิ่งยวดของระบบ:

| รหัสเคส (TC ID) | ชื่อกรณีทดสอบ (Test Case Title) | โมดูล / ข้อกำหนด | ประเภทการทดสอบ |
| :--- | :--- | :--- | :--- |
| **TC-003** | ล็อกอินข้อมูลถูกต้อง ด้วยบัญชี Student | Authentication & RBAC (FR-002) | Positive / Web UI & API |
| **TC-005** | ดู/แก้โปรไฟล์และเปลี่ยนรหัสผ่าน | Profile Management (FR-003) | Positive / Web UI & API |
| **TC-017** | ทดสอบการแสดงผล latest/popular และสถิติบนหน้าหลัก | Home & Analytics (FR-010) | Positive / Web UI |
| **TC-023** | ลองเข้าหน้าส่งงานโดยไม่ล็อกอิน หรือใช้ role guest (ระบบต้องบล็อก) | Security & Route Guard (FR-014) | Negative / RBAC Guard |
| **TC-026** | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | Upload & Boundary (FR-016) | Positive & Boundary (25 MB) |
| **TC-027** | ลองอัปโหลดไฟล์ที่นามสกุล/MIME หรือลายเซ็นผิด (ระบบต้องแจ้งเตือน) | File Type Validation (FR-016) | Negative / MIME Validation |
| **TC-035** | ลองดาวน์โหลดผลงานที่ไม่มีไฟล์ หรือตอนไม่มี token | Download Security (FR-021) | Negative / API & Web |
| **TC-042** | ทดสอบการกดปุ่มบันทึกและยกเลิก favorite | Bookmark & Favorites (FR-027) | Positive / Web UI & API |

---

## 🏗️ โครงสร้างโปรเจกต์ (Repository Architecture)

ชุดทดสอบถูกออกแบบตามมาตรฐาน **Page Object Model (POM)** แยกหน้าที่ระหว่างตัวแทนหน้าเว็บ (Pages), สคริปต์ทดสอบ (Tests), ค่ากำหนด (Utils/Config), และข้อมูลทดสอบ (Fixtures):

```text
e2e_tests_selenium_python/
├── docs/                                # เอกสารส่งมอบมาตรฐาน Enterprise
│   ├── testplan.docx                    # แผนการทดสอบอัตโนมัติฉบับทางการ (TH Sarabun New)
│   ├── testcase.docx                    # ข้อกำหนดและผลการรันจริง 8 TCs (TH Sarabun New)
│   └── TEST-CASES.md                    # เอกสารอ้างอิง Master Requirements
├── fixtures/                            # ไฟล์ข้อมูลจำลองสำหรับการทดสอบ
│   └── files/                           # ตัวอย่างไฟล์ PDF, ไฟล์ขอบเขต 26 MB, และไฟล์ผิดประเภท
├── pages/                               # Page Object Model (POM)
│   ├── base_page.py                     # คลาสแม่: Explicit Waits, Event Dispatch, React Helpers
│   ├── login_page.py                    # อ็อบเจกต์หน้า /login
│   ├── profile_page.py                  # อ็อบเจกต์หน้า /student/profile
│   ├── home_page.py                     # อ็อบเจกต์หน้าหลัก / (สถิติ และ Latest/Popular)
│   ├── submission_page.py               # อ็อบเจกต์หน้าส่งผลงาน /student/research/new
│   └── research_detail_page.py          # อ็อบเจกต์หน้ารายละเอียด /research/[id]
├── tests/                               # สคริปต์รันการทดสอบอัตโนมัติ (Automated Tests)
│   ├── test_authentication_profile.py   # TC-003, TC-005
│   ├── test_home_and_stats.py           # TC-017
│   ├── test_submission_and_upload.py    # TC-023, TC-026, TC-027
│   └── test_research_interactions.py    # TC-035, TC-042
├── utils/
│   └── config.py                        # ค่าคอนฟิก URL, พอร์ต, บัญชีผู้ใช้, และโหมด Headless
├── conftest.py                          # Pytest Fixtures: WebDriver Setup & Failure Screenshots
├── generate_documents.py                # ตัวสร้างและซิงค์ผลการทดสอบลงเอกสาร .docx
├── pytest.ini                           # การตั้งค่า Pytest และ Markers
├── report.html                          # รายงานผลการทดสอบ HTML Interactive Test Report
└── requirements.txt                     # รายการแพ็กเกจ Python ที่จำเป็น
```

---

## 🚀 สภาพแวดล้อมและสิ่งที่ต้องเตรียม (Prerequisites)

1. **ระบบหลัก UniResearch กำลังทำงาน**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - Database: PostgreSQL (Port 5433)
   - สตาร์ตผ่าน Docker Compose ที่ Root โปรเจกต์:
     ```powershell
     docker compose up -d
     ```

2. **Python Environment**:
   - Python 3.10+ (ทดสอบบน Python 3.13)
   - ติดตั้ง Dependencies ที่จำเป็น:
     ```powershell
     pip install -r requirements.txt
     ```

---

## 🧪 คำสั่งการรันการทดสอบ (Execution Commands)

### 1. รันการทดสอบทั้งหมด 8 Target Cases พร้อมสร้างรายงาน HTML
```powershell
pytest
```
*(คำสั่งจะรันในโหมด Headless และบันทึกรายงานผลไว้ที่ `report.html`)*

### 2. รันแยกเฉพาะกรณีทดสอบเดี่ยวด้วย Marker
```powershell
# รันเฉพาะ TC-003 (Login)
pytest -m tc_003

# รันเฉพาะ TC-026 (Upload Boundary)
pytest -m tc_026

# รันเฉพาะ TC-005 (Profile & Password Change)
pytest -m tc_005

# รันเฉพาะ TC-017 (Home & Stats)
pytest -m tc_017

# รันเฉพาะ TC-023 (Security Route Guard)
pytest -m tc_023

# รันเฉพาะ TC-027 (Invalid MIME/Extension)
pytest -m tc_027

# รันเฉพาะ TC-035 (Download Restriction)
pytest -m tc_035

# รันเฉพาะ TC-042 (Favorite / Bookmark Toggle)
pytest -m tc_042
```

### 3. รันแบบเปิดเบราว์เซอร์จริง (Non-Headless)
แก้ไขในไฟล์ `.env` หรือกำหนด Environment Variable:
```powershell
$env:HEADLESS="false"
pytest
```

---

## 📊 การสร้างและอัปเดตเอกสารรายงานผล (.docx)

หลังจากรันชุดทดสอบแล้ว สามารถประมวลผลผลลัพธ์และอัปเดตลงเอกสารทางการ `docs/testcase.docx` ได้โดยอัตโนมัติ:

```powershell
python generate_documents.py
```

เอกสารที่ได้รับจะใช้ฟอนต์ **TH Sarabun New / Sarabun** ตามมาตรฐานงานสารบรรณภาครัฐและองค์กร พร้อมตารางและเครื่องหมายสถานะผลการทดสอบครบถ้วน
