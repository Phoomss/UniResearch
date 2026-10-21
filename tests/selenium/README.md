# Selenium tests — UniResearch

เอกสารการทดสอบของ Narongsak (18 Cases): [ข้อกำหนด Test Cases](../../docs/testing/narongsak/TEST-CASES.md) ([uniresearch-test-cases-Narongsak.md](../../docs/testing/narongsak/uniresearch-test-cases-Narongsak.md)) · [แผนการทดสอบ Test Plan](../../docs/testing/narongsak/TEST-PLAN.md) · [รายงานสรุปผล Test Report](../../docs/testing/narongsak/TEST-REPORT.md) ([uniresearch-test-plan-and-report-Narongsak.md](../../docs/testing/narongsak/uniresearch-test-plan-and-report-Narongsak.md)) · [รายงานผล UI Execution](../../docs/testing/narongsak/UI-TEST-EXECUTION.md) · [คู่มือการทดสอบภาษาไทย](../../docs/testing/narongsak/TESTING-GUIDE.md)

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

### รหัสข้อมูลทดสอบร่วม (Fixture Codes)
ชุดทดสอบอ่านข้อมูลจาก [`tests/selenium/dataset.py`](dataset.py) ซึ่งเชื่อมโยงกับ CSV และชื่องานจริงจาก migration:
- **A1**: Admin (`admin@uniresearch.ac.th`)
- **S1**: Student 1 (`674259009@webmail.npru.ac.th`) — นายนรงศ์ศักดิ์ ภูมิประเสริฐ (ผู้ทดสอบหลัก / ผู้ส่งผลงาน W1, W2)
- **S2**: Student 2 (`674259003@webmail.npru.ac.th`) — นายกิติกร เทศธรรม (ผู้แต่งร่วม W4 และเจ้าของ W3)
- **S3**: Student 3 (`644259003@webmail.npru.ac.th`) — นายกัตพัตร์ ทองดี (รหัสปี 64 ทดสอบ validation ต่างชั้นปี)
- **D1**: Advisor 1 (`udsanee@webmail.npru.ac.th`) — ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ (ที่ปรึกษาตรวจงาน S1)
- **D2**: Advisor 2 (`wuttha@webmail.npru.ac.th`) — ผศ.ดร.วรเชษฐ์ อุทธา (ที่ปรึกษาตรวจงาน S2)
- **G1**: Guest (`g1@example.org`) — ผู้เยี่ยมชมทั่วไป
- **U2**: Inactive (`674259013@webmail.npru.ac.th`) — นายวัชรากร โสมนัส (ผู้ใช้ถูกระงับสิทธิ์)
- **C1 / C2**: หมวดหมู่ C1 (วิทยาการคอมพิวเตอร์และ AI) และ C2 (วิศวกรรมศาสตร์และนาโนเทคโนโลยี)
- **W1 / W4**: ผลงานสถานะ `approved` (W1 งานเดี่ยว S1, W4 งานร่วม S2 + S1)
- **W2**: ผลงานสถานะ `pending` / `needs_revision` (งานของ S1 รอตรวจหรือส่งแก้ไข)
- **W3 / W5**: W3 งานของ S2 / D2, W5 งานไม่มีไฟล์ PDF สำหรับ boundary test
- **N1 / N2**: การแจ้งเตือนส่วนบุคคลของ S1 (N1) และ S2 (N2)

*รหัสผ่านของทุกบัญชีในฐานข้อมูลทดสอบชั่วคราวคือ `UniResearchTest2026!`*

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
pytest tests/selenium/ --all-cases -v --headless
pytest tests/selenium/ -m auth -v
pytest tests/selenium/ -m ai -v
pytest tests/selenium/ -m submission -v
pytest tests/selenium/ -m review -v
pytest tests/selenium/ -m e2e -v
pytest tests/selenium/categories/auth/test_tc_004.py -v
```

marker ที่เหลือ (`category`, `user`, `recommendation`, `notification`) ใช้รูปแบบเดียวกัน เพิ่ม `--headed` หากต้องการเปิดหน้าต่างเบราว์เซอร์

หากใช้ virtualenv เดิมของ repository เรียก `backend/test_venv/bin/python -m pytest` แทน `pytest` ได้

### รันรายเคสด้วยเลข TC

รันจาก root ของโปรเจกต์ ใช้ `-k` เพื่อเลือกเคสโดยไม่ต้องจำ path ของหมวดหมู่:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_001 -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_004 -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_013 -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_046 -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_048 -v --headed
```

ดูคำสั่งแบบระบุไฟล์ครบทั้ง 18 เคสใน [คู่มือข้อ 5](../../docs/testing/narongsak/TESTING-GUIDE.md#5-รัน-test-case-เดียว) TC-001/004 อยู่ `auth`, TC-013 อยู่ `user`, TC-046 อยู่ `ai` และ TC-048 อยู่ `e2e` หากระบุ path ที่ไม่มีอยู่ pytest อาจไม่โหลด `conftest.py` ของ Selenium และแสดง `unrecognized arguments: --headed` พร้อม `inifile: None` ให้ตรวจ path หรือใช้ `-k` ตามตัวอย่าง

TC-004 ทดสอบรหัสผ่านผิด จึงคาดหวัง HTTP `400 Bad Request`, ข้อความผิดพลาด, อยู่หน้า Login และไม่มี session/token ผล `PASSED` หมายถึงระบบปฏิเสธการเข้าสู่ระบบได้ตามที่คาดหวัง

กำหนด `SELENIUM_CHROMEDRIVER` เป็น absolute path ของ driver ที่ตรงกับ browser เพื่อรันแบบ offline; หากไม่กำหนด Selenium Manager จะค้นหา/ดาวน์โหลดให้ กำหนด `SELENIUM_CHROME_BINARY` และ `SELENIUM_BROWSER_NAME=Brave` สำหรับ Brave

Runner เปิด FastAPI และ Next.js เองบนพอร์ต loopback ไม่ต้องเปิดแอปเพิ่ม ต้องไม่มี Next.js dev server ของ checkout นี้ทำงานอยู่ เพราะใช้ `.next` และ dev lock ร่วมกัน

Docker เดิมใช้ได้:

```bash
docker compose -f docker-compose.selenium.yml build
docker compose -f docker-compose.selenium.yml run --rm selenium-tests
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -m submission -v
```

## ข้อมูลทดสอบและการแยกเคส

`conftest.py` สร้าง SQLite และที่เก็บไฟล์ชั่วคราวใหม่ แต่ละกรณี reset เฉพาะฐานนี้และใช้ Chrome profile ใหม่ ข้อมูลกลางอยู่ใน [`dataset.py`](dataset.py): อ่านชื่อ อีเมล รหัสนักศึกษา ภาควิชา และบทบาทจาก `backend/app/scripts/student.csv` / `advisors.csv` โดยไม่ใช้รหัสผ่านจาก CSV อ่าน metadata ผลงานและหมวดหมู่จาก AST ของ `migrate.py` โดยไม่เรียก migration

บัญชีนักศึกษาหลักคือ `674259009@webmail.npru.ac.th`, `674259003@webmail.npru.ac.th`, `644259003@webmail.npru.ac.th`; ที่ปรึกษาคือ `udsanee@webmail.npru.ac.th`, `wuttha@webmail.npru.ac.th` ผู้ดูแล `admin@uniresearch.ac.th` และบัญชี guest เป็นข้อมูลที่สร้างสำหรับฐานทดสอบ บัญชี `674259013@webmail.npru.ac.th` ถูกตั้ง inactive เฉพาะสำเนานี้ รหัสผ่านฐานทดสอบทุกบัญชีคือ `UniResearchTest2026!` หรือกำหนด `TEST_PASSWORD` โดยต้องบันทึกการเปลี่ยนจากเอกสาร

ชื่อผลงานใช้สี่เรื่องจาก migration เช่น “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์” พร้อมสำเนาทดสอบไม่มีไฟล์ ชื่อสำเนาสำหรับส่ง แก้ไข และ E2E ระบุวัตถุประสงค์ต่อท้ายตาม [รายการข้อมูล](../../docs/system-audit/TEST-RESEARCH-DATA.md) ID และ key บัญชีภายในสคริปต์เป็น mapping ของฐานชั่วคราว หลักฐานหน้าเว็บบันทึกอีเมลและชื่อเรื่องเต็ม

ค่าเริ่มต้นยังเป็น 18 กรณีของ Narongsak ใช้ `--all-cases` เพื่อรันครบ 48 กรณี รวม `test_accounts.py`, `test_research.py`, `test_reviews.py` ที่ปรับข้อมูลร่วมแล้ว `--include-legacy` เป็นชื่อทางเลือกของ flag เดียวกัน กรณีนอก subset ต้องใส่ flag นี้เมื่อเลือกด้วย `-k` ด้วย

```bash
backend/test_venv/bin/python -m pytest tests/selenium --all-cases -v --headless
backend/test_venv/bin/python -m pytest tests/selenium --all-cases -k test_tc_027 -v --headless
backend/test_venv/bin/python -m pytest tests/test_selenium_dataset.py -q
```

Browser/HTTP clients/services และข้อมูลชั่วคราว cleanup ผ่าน fixtures รัน serial เพราะแต่ละเคส reset ฐานร่วมกัน AI ใช้ deterministic mock; ผลไม่รับรอง live AI หรือ PostgreSQL/pgvector

รายงานใช้ชื่อและผลคาดหวังจาก `cases.json` ตรงกับ Test Cases รายงานทั้ง 48 อยู่ที่ `docs/testing/selenium/UI-TEST-EXECUTION.md`; subset อยู่ที่ `docs/testing/narongsak/UI-TEST-EXECUTION.md` หลักฐานของแต่ละรอบเก็บใต้ `tests/selenium/artifacts/<run-id>` และ `reports/<run-id>` โดยแยกจำนวนเคสที่ใช้ browser กับ API-only ตามการรันจริง ไม่รวม PASS ข้าม session

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
| `TEST_PASSWORD` | ไม่กำหนด = `UniResearchTest2026!` สำหรับสำเนาฐานทดสอบ; override ได้และต้องบันทึกว่าต่างจากเอกสาร |
| `TEST_STUDENT_EMAIL` | `674259009@webmail.npru.ac.th` |
| `TEST_ADMIN_EMAIL` | `admin@uniresearch.ac.th` |
| `TEST_ADVISOR_EMAIL` | `udsanee@webmail.npru.ac.th` |
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
docs/testing/narongsak/UI-TEST-EXECUTION.md  # ค่าเริ่มต้น 18 กรณี
docs/testing/selenium/UI-TEST-EXECUTION.md  # เมื่อใช้ --all-cases
```

Screenshots ครอบคลุม initial pages, important interactions, ผลที่มองเห็น, final result และ failure โดยชื่อมี session timestamp กับลำดับจึงไม่ทับผลครั้งก่อน JSON มี TC ID, category, browser/version/mode, steps, expected/actual result, status, duration, screenshot paths และ errors รายงานภาษาไทยแสดงผลเฉพาะ session ล่าสุด รวม NOT RUN ของเคสที่ไม่ได้เลือก; `--collect-only` จะไม่เขียนทับรายงานผลรันจริง

TC-038 เปิดเมนูเอกสารทั้งหมดแล้วคลิกตรวจสอบแถวงานจริง ส่วน TC-047 เปิดคิว review ก่อนเลือกอนุมัติและยืนยัน TC-022/031 ตรวจสถานะในผลงานของฉันหลังส่งข้อมูลและไฟล์ TC-043 ตรวจ toast และการเปลี่ยน control ของรายการอ่านแล้ว TC-001 ส่ง role=admin ที่ boundary ของ request จากฟอร์มจริง และตรวจข้อความการสร้างบัญชี student พร้อม role ที่บันทึก; ไม่มีการให้สิทธิ์ admin กับบัญชีที่สมัคร
