# Selenium tests — Narongsak

ชุดทดสอบที่รันโดยค่าเริ่มต้นครอบคลุมเฉพาะ 18 Test Cases ของ Narongsak ใช้ Python + Selenium + Pytest เดิม ไม่แก้ business logic ของแอป

| หมวดหมู่ / marker | Test Case IDs |
|---|---|
| auth | TC-001, TC-004, TC-007 |
| category | TC-010 |
| user | TC-013 |
| recommendation | TC-016 |
| submission | TC-019, TC-022, TC-025, TC-028, TC-031, TC-034 |
| review | TC-037, TC-038 |
| notification | TC-043 |
| ai | TC-046 |
| e2e | TC-047, TC-048 |

ไฟล์อยู่ที่ `categories/{category}/test_tc_{id}.py` หนึ่งเคสต่อไฟล์ ใช้ Page Object เดิมใน `support.py` และ Page Objects เพิ่มเติมใน `pages.py` ใช้ `WebDriverWait` รอ UI, hydration, ดาวน์โหลด และผลบันทึก ไม่ใช้ sleep สำหรับขั้นตอนเบราว์เซอร์ การรอเริ่ม service ใช้ polling แยกต่างหาก

## ติดตั้งและรัน

ต้องมี Python 3.11+, Node.js ที่รองรับ frontend และ Chrome หรือ Brave:

```bash
python3 -m venv tests/selenium/.venv
source tests/selenium/.venv/bin/activate
pip install -r tests/selenium/requirements.txt
cd frontend
pnpm install
cd ..

pytest tests/selenium/ -v
pytest tests/selenium/ -m auth -v
pytest tests/selenium/ -m ai -v
pytest tests/selenium/ -m submission -v
pytest tests/selenium/ -m review -v
pytest tests/selenium/ -m e2e -v
pytest tests/selenium/categories/auth/test_tc_004.py -v
```

marker ที่เหลือ (`category`, `user`, `recommendation`, `notification`) ใช้รูปแบบเดียวกัน เพิ่ม `--headed` หากต้องการเปิดหน้าต่างเบราว์เซอร์

หากใช้ virtualenv เดิมของ repository เรียก `backend/test_venv/bin/python -m pytest` แทน `pytest` ได้

กำหนด `SELENIUM_CHROMEDRIVER` เป็น absolute path ของ driver ที่ตรงกับ browser เพื่อรันแบบ offline; หากไม่กำหนด Selenium Manager จะค้นหา/ดาวน์โหลดให้ กำหนด `SELENIUM_CHROME_BINARY` และ `SELENIUM_BROWSER_NAME=Brave` สำหรับ Brave

Runner เปิด FastAPI และ Next.js เองบนพอร์ต loopback ไม่ต้องเปิดแอปเพิ่ม ต้องไม่มี Next.js dev server ของ checkout นี้ทำงานอยู่ เพราะใช้ `.next` และ dev lock ร่วมกัน

Docker เดิมใช้ได้:

```bash
docker compose -f docker-compose.selenium.yml build
docker compose -f docker-compose.selenium.yml run --rm selenium-tests
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -m submission -v
```

## ข้อมูลทดสอบและการแยกเคส

`conftest.py` สร้างฐานข้อมูล SQLite และไฟล์ใน directory ชั่วคราว `uniresearch-selenium-*` ไม่รับ URL/database ของระบบ production ทุกเคส reset เฉพาะฐานข้อมูลนี้และ seed ผู้ใช้ A1, S1/S2/S3, D1/D2, G1, U2; หมวดหมู่ C1/C2; ผลงาน W1–W5; การแจ้งเตือน N1/N2 รหัสผ่านสร้างใหม่ทุก session และ Chrome profile ใหม่ทุกเคส

แต่ละไฟล์ตั้ง precondition เพิ่มเท่าที่จำเป็นก่อน interaction และตรวจผล UI พร้อมหลักฐาน API/database เพิ่มเติม Browser, HTTP client, service และ directory ชั่วคราวถูก cleanup โดย fixtures ไม่มี dependency ลำดับเคส รันแบบ serial; pytest-xdist ถูกปฏิเสธเพื่อป้องกันการ reset ข้อมูลชนกัน

สคริปต์ของสมาชิกคนอื่นยังอยู่ใน `test_accounts.py`, `test_research.py`, `test_reviews.py` และไม่ถูกรันโดยค่าเริ่มต้น ใช้ `--include-legacy` เพื่อเรียกพฤติกรรม full-suite เดิมเมื่อจำเป็น (อยู่นอกขอบเขตงานนี้)

## TC-046 และ authorization

ทั้งสี่ endpoint มี UI ในหน้า advisor review ได้แก่ Pre-Review Analysis, Plagiarism Check, Reviewer Match และ Review Summary จึงรัน Selenium ทั้งสี่ tabs และตรวจผลที่มองเห็นจริง ไม่ต้องแยก endpoint ที่ไม่มี UI ไป API suite ใน repository รุ่นนี้

`server.py` mock เฉพาะ AI provider ด้วยผลลัพธ์ deterministic; route, authentication, validation และ persistence ใช้แอปจริง ใช้ SQLite/text retrieval fallback ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพ live AI

API calls ที่อยู่ร่วมกับ Selenium ใช้เป็นหลักฐานเสริมด้าน contract/authorization เท่านั้น ไม่ถือว่า HTTP call เป็น Selenium coverage โดย TC-046 ตรวจ 401, 403, 404 จริง และตรวจ student ถูก redirect จาก advisor workspace; TC-013 พยายามบันทึกตัวเลือกผ่าน UI จริงและยืนยันว่าข้อมูลไม่เปลี่ยน; TC-048 ตรวจ backend ปฏิเสธการจัดการผู้ใช้และหมวดหมู่ของ student

## รายงานภาษาไทย

ทุก session สร้าง `artifacts/<UTC timestamp>/report.md` และ `results.json` พร้อม TC ID, หมวดหมู่, สถานการณ์, ผลที่คาดหวัง, ผลจริง และ PASS / FAIL / BLOCKED / NOT RUN รายงาน Markdown แสดงทั้ง 18 เคส แม้รันเพียงหมวดหมู่หรือไฟล์เดียว

- `TC-xxx.png`: screenshot เมื่อจบขั้นตอน browser และเมื่อเกิด failure ที่ยังมี browser
- `errors.log`: exception ที่ตัด password/token ของ fixture ออก
- `backend.log`, `frontend.log`: service logs
- `results.json`: metadata, API/database evidence และ browser/driver version

หาก setup สร้าง browser ไม่ได้ จะรายงาน BLOCKED พร้อม error log และไม่มี screenshot ถ้า assertion ล้มเหลวจะรายงาน FAIL เคสที่ไม่ได้เลือกจะเป็น NOT RUN ผล PASS ในเอกสารประวัติไม่ถูกนำมาใช้แทนผลรันปัจจุบัน เพิ่ม `--junitxml=tests/selenium/artifacts/junit.xml` เพื่อส่งเข้า CI

## UI execution layer

ค่าเริ่มต้นบนเครื่อง local คือ Chrome แบบ **headed**; ใน CI (`CI` ถูกกำหนด) และ Docker (`SELENIUM_CONTAINER=1`) ค่าเริ่มต้นเป็น headless ใช้ `--headed` หรือ `--headless` เพื่อกำหนดชัดเจน ห้ามใช้ทั้งสอง option พร้อมกัน

```bash
pytest tests/selenium/ -v --headed
pytest tests/selenium/ -m auth -v --headed
pytest tests/selenium/ -m ai -v --headed
pytest tests/selenium/ -m submission -v --headed
pytest tests/selenium/categories/auth/test_tc_004.py -v --headed
pytest tests/selenium/ -v --headless
```

`pages.py` ใช้ `UIPage` ต่อจาก POM เดิมเพื่อบันทึกเฉพาะ WebDriver interactions เช่นเปิดหน้า กรอกฟอร์ม คลิก เลือกผู้เกี่ยวข้อง อัปโหลด อ่านข้อความและสถานะ ส่วน API/database assertions ยังคงเป็นหลักฐานเสริมและไม่รวมเป็น browser steps

| Environment variable | ค่าเริ่มต้น / การใช้งาน |
|---|---|
| `BASE_URL` | ไม่กำหนด = สร้าง frontend บนพอร์ต localhost ว่าง; กำหนดเป็น `http://127.0.0.1:3100` เพื่อใช้พอร์ตทดสอบคงที่ |
| `BROWSER` | `chrome`; รองรับ `brave` เมื่อกำหนด binary |
| `HEADLESS` | `false` บน local; `true` บน CI/container; flags มีลำดับความสำคัญสูงกว่า env |
| `BROWSER_WINDOW_SIZE` | `1440,1000` (width,height) |
| `SELENIUM_TIMEOUT` | `30` วินาที สำหรับ explicit UI waits |
| `SCREENSHOTS_DIR` | `tests/selenium/reports/screenshots` |
| `TEST_PASSWORD` | ไม่กำหนด = สุ่มรหัสผ่าน fixture ใหม่ทุก session; หากต้องกำหนดให้ใช้ environment/CI secret |
| `TEST_STUDENT_EMAIL` | `s1@example.org` สำหรับ S1 |
| `TEST_ADMIN_EMAIL` | `a1@example.org` สำหรับ A1 |
| `TEST_ADVISOR_EMAIL` | `d1@example.org` สำหรับ D1 |
| `TEST_{role}_EMAIL` | override email ราย fixture เช่น `TEST_S2_EMAIL`; มีลำดับความสำคัญสูงกว่า alias |
| `SELENIUM_CHROME_BINARY` | optional Chrome binary; required เมื่อ `BROWSER=brave` |
| `SELENIUM_CHROMEDRIVER` | optional absolute driver path สำหรับ offline execution |

`BASE_URL` กำหนด origin ของ frontend ชั่วคราวที่ runner เปิดเอง ไม่ใช่ URL ของแอปที่มีข้อมูลอยู่แล้ว รับเฉพาะ HTTP origin ที่ localhost/127.0.0.1 พร้อม port เพื่อป้องกันการเขียนข้อมูลจากชุดทดสอบนี้ไป production หรือฐานข้อมูล staging ที่ไม่ได้จัดเตรียมแบบ isolated หากพอร์ตถูกใช้งานอยู่ service จะหยุดด้วย setup error ไม่ยึดแอปที่เปิดไว้

Test accounts ที่กำหนดผ่าน env จะ seed ในฐานข้อมูลชั่วคราวเดียวกับ fixtures เดิม ไม่ได้ใช้บัญชี production และไม่บันทึก passwords/tokens ลงขั้นตอนรายงาน

หลักฐาน UI ใหม่อยู่ที่:

```text
tests/selenium/reports/screenshots/{category}/{TC-ID}/{unique-session-id}/
  001-....png
  ...
  ...-final-result.png
  ...-failure-call.png          # เมื่อเคสล้มเหลวและยังมี browser
tests/selenium/reports/{unique-session-id}/ui-results.json
docs/testing/narongsak/UI-TEST-EXECUTION.md
```

Screenshots ครอบคลุม initial pages, important interactions, ผลที่มองเห็น, final result และ failure โดยชื่อมี session timestamp กับลำดับจึงไม่ทับผลครั้งก่อน JSON มี TC ID, category, browser/version/mode, steps, expected/actual result, status, duration, screenshot paths และ errors รายงานภาษาไทยแสดงผลเฉพาะ session ล่าสุด รวม NOT RUN ของเคสที่ไม่ได้เลือก; `--collect-only` จะไม่เขียนทับรายงานผลรันจริง

TC-038 และ TC-047 เปิดคิว review แล้วคลิกลิงก์ผลงานจริงก่อนเลือก Approve และยืนยัน TC-022/031 ตรวจสถานะในผลงานของฉันหลังส่งข้อมูลและไฟล์ TC-043 ตรวจ toast และการเปลี่ยน control ของรายการอ่านแล้ว TC-001 ส่ง role=admin ที่ boundary ของ request จากฟอร์มจริง และตรวจข้อความการสร้างบัญชี student พร้อม role ที่บันทึก; ไม่มีการให้สิทธิ์ admin กับบัญชีที่สมัคร
