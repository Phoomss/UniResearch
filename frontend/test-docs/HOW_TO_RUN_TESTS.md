# คู่มือวิธีการรันชุดทดสอบ E2E Automation (Selenium + Pytest)

เอกสารนี้อธิบายขั้นตอนการติดตั้งสภาพแวดล้อม การเตรียมความพร้อม และคำสั่งสำหรับการรันชุดทดสอบ **Frontend E2E Automation** ของระบบ **UniResearch** ด้วย **Python, Selenium WebDriver และ Pytest**

---

## 1. สิ่งที่ต้องเตรียมก่อนเริ่ม (Prerequisites)

1. **Node.js** (เวอร์ชัน 20 หรือ 22 ขึ้นไป) และ **npm / pnpm**
2. **Python 3.9+**
3. **Google Chrome Browser** ติดตั้งอยู่ในเครื่อง (Selenium จะเรียกใช้ Chrome Driver โดยอัตโนมัติ)

---

## 2. ขั้นตอนการเตรียมระบบและการรัน (Quick Start)

### ขั้นตอนที่ 1: รัน Frontend (Next.js)

ชุดทดสอบจำเป็นต้องเข้าถึงหน้าเว็บจริง ดังนั้นต้องเริ่มการทำงานของ Next.js ก่อน:

```bash
# 1. เข้าไปที่โฟลเดอร์ frontend
cd /Users/technology06/674259024/UniResearch/frontend

# 2. ติดตั้ง Dependencies (หากยังไม่ได้ติดตั้ง)
npm install
# หรือ pnpm install

# 3. รันเซิร์ฟเวอร์ในโหมด Development
npm run dev -- --port 3000
```
> ตรวจสอบให้แน่ใจว่าสามารถเข้าใช้งานเว็บที่ `http://localhost:3000` หรือ `http://127.0.0.1:3000` ได้สำเร็จ

---

### ขั้นตอนที่ 2: เตรียม Environment สำหรับ Python & Selenium

เปิด Terminal หน้าต่างใหม่ แล้วเข้าไปยังโฟลเดอร์ทดสอบ:

```bash
cd /Users/technology06/674259024/UniResearch/frontend/selenium_tests
```

#### 2.1 สร้างและเปิดใช้งาน Virtual Environment
```bash
# สร้าง virtual environment (ทำครั้งแรกครั้งเดียว)
python3 -m venv .venv

# เปิดใช้งาน (Activate) บน macOS / Linux
source .venv/bin/activate
```

#### 2.2 ติดตั้ง Dependencies ที่จำเป็น
```bash
pip install -r requirements.txt
```

#### 2.3 ตรวจสอบค่าคอนฟิก (.env)
ไฟล์ `.env` อยู่ใน `frontend/selenium_tests/.env` สามารถปรับแต่งค่าได้ตามต้องการ เช่น:
```env
BASE_URL=http://127.0.0.1:3000
STUDENT_EMAIL=s1@webmail.ac.th
STUDENT_PASSWORD=password
ADVISOR_EMAIL=advisor
ADVISOR_PASSWORD=password
ADMIN_EMAIL=admin
ADMIN_PASSWORD=password
HEADLESS=true
```
*(หากต้องการดูเบราว์เซอร์เปิดขึ้นมาจริงขณะทดสอบ ให้ปรับ `HEADLESS=false`)*

---

## 3. คำสั่งในการรันชุดทดสอบ (Running Tests)

โปรดตรวจสอบว่าเปิดใช้งาน virtual environment แล้ว (`source .venv/bin/activate`)

### 3.1 รันการทดสอบทั้งหมด (Full Suite)
```bash
pytest
```
*ระบบจะรันทุกเทสต์ และสร้างรายงาน HTML ไว้ที่ `frontend/test-results/report.html` อัตโนมัติ*

### 3.2 รันการทดสอบแบบแสดงรายละเอียด (Verbose Mode)
```bash
pytest -v
```

### 3.3 รันเฉพาะไฟล์ที่ต้องการ
```bash
# ทดสอบเฉพาะระบบการสมัครสมาชิก (Registration)
pytest tests/test_registration.py

# ทดสอบเฉพาะระบบยืนยันตัวตนและการตรวจสอบสิทธิ์ (Auth & RBAC)
pytest tests/test_authentication.py

# ทดสอบเฉพาะการส่งผลงานวิจัย (Research Submission)
pytest tests/test_research_submission.py
```

### 3.4 รันเฉพาะ Test Case ID (Markers)
สามารถเลือกรันเฉพาะ Test Case ที่ระบุด้วยแท็ก `@pytest.mark.<tc_id>` ได้:

```bash
# รันเฉพาะ TC-FE-001 (Registration Happy Path)
pytest -m tc_fe_001

# รันเฉพาะ TC-FE-002 (Client-side Validation)
pytest -m tc_fe_002

# รันเฉพาะ TC-FE-004 (Student Access /admin)
pytest -m tc_fe_004
```

---

## 4. ผลลัพธ์และรายงานการทดสอบ (Test Results & Artifacts)

เมื่อรันเสร็จสิ้น ไฟล์รายงานและหลักฐานต่างๆ จะถูกเก็บไว้ที่โฟลเดอร์ `frontend/test-results/`:

* **รายงานผลแบบ HTML (Interactive Report):**
  `frontend/test-results/report.html` (สามารถเปิดด้วยเบราว์เซอร์เพื่อดูรายละเอียดการผ่าน/ตกได้)
* **ภาพหน้าจอหลักฐานเมื่อเกิดข้อผิดพลาด (Screenshots on Failure):**
  `frontend/test-results/screenshots/`
* **รายงานสรุปและบันทึกข้อบกพร่อง (Markdown):**
  - `frontend/test-results/TEST_EXECUTION_REPORT.md` (ภาษาอังกฤษ)
  - `frontend/test-results/TEST_EXECUTION_REPORT_TH.md` (ภาษาไทย)
  - `frontend/test-results/TRACEABILITY_MATRIX.md` (ตารางสอบกลับความต้องการ)
  - `frontend/test-results/test-plan-discrepancies.md` (บันทึกข้อขัดแย้งในสเปก)

---

## 5. การตรวจสอบคุณภาพโค้ดหน้าบ้าน (ESLint Check)

สามารถตรวจสอบหนี้ทางเทคนิคและข้อผิดพลาดของโค้ด Next.js ตามเกณฑ์ Exit Criteria ได้ด้วยคำสั่ง:

```bash
cd /Users/technology06/674259024/UniResearch/frontend
npm run lint
```
