# คู่มือการทดสอบ Selenium UI — Narongsak

คู่มือนี้ใช้สำหรับรัน 18 Test Cases ของ Narongsak ที่มีอยู่ใน UniResearch โดยใช้ Selenium + Pytest ผู้ทดสอบสามารถดูการทำงานผ่านหน้าต่าง Chrome หรือรันแบบ headless ได้

## 1. เริ่มทดสอบบนเครื่องที่เตรียมไว้แล้ว

เปิด Terminal แล้วเข้าโฟลเดอร์หลักของโปรเจกต์:

```bash
cd /Users/mac/Desktop/workspace/UniResearch
```

หากโปรเจกต์อยู่ตำแหน่งอื่น ให้เปลี่ยน path ให้ตรงกับเครื่องของคุณ ทุกคำสั่งในคู่มือนี้ให้รันจากโฟลเดอร์หลัก `UniResearch`

เริ่มด้วยเคส Login ผิดรหัสผ่านเพื่อดูว่าระบบทดสอบพร้อมใช้งาน:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/categories/auth/test_tc_004.py -v --headed
```

เมื่อเคสนี้รันได้ ให้ทดสอบครบ 18 เคส:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -v --headed
```

ชุดทดสอบจะเปิด backend และ frontend บน localhost เตรียมข้อมูลทดสอบ เปิด Chrome แล้วปิด browser และ services ให้อัตโนมัติ **ไม่ต้องเปิด backend/frontend หรือฐานข้อมูลเพิ่มเอง** ปิด Next.js dev server ของ checkout นี้ก่อน เพราะใช้ development lock และ `.next` ร่วมกัน

ระหว่างรัน headed ให้ปล่อย Selenium ควบคุมหน้าต่าง Chrome จนจบ ขั้นตอน Login, กรอกฟอร์ม, อัปโหลด, ดาวน์โหลด และอนุมัติจะทำเองตามเคสที่เลือก

## 2. เตรียมเครื่องครั้งแรก

ต้องมี:

- Python 3.11 ขึ้นไป
- Node.js ที่รองรับ Next.js ของโปรเจกต์ (แพ็กเกจที่ใช้อยู่ระบุ Node.js ตั้งแต่ 20.9.0)
- pnpm
- Google Chrome
- dependencies ของ Python และ frontend

ตรวจสอบเครื่องมือ:

```bash
python3 --version
node --version
pnpm --version
```

### ใช้ Python environment เดิมของโปรเจกต์

ถ้ามี `backend/test_venv/bin/python` อยู่แล้ว ตรวจ dependencies:

```bash
backend/test_venv/bin/python -c "import pytest, selenium, httpx, uvicorn; print('Dependencies ready')"
```

หากพบ `ModuleNotFoundError` ให้ติดตั้ง requirements ของชุด Selenium:

```bash
backend/test_venv/bin/python -m pip install -r tests/selenium/requirements.txt
```

ติดตั้ง frontend dependencies เมื่อยังไม่มี `frontend/node_modules`:

```bash
cd frontend
pnpm install
cd ..
```

### สร้าง environment ใหม่เมื่อไม่มีของเดิม

```bash
python3 -m venv tests/selenium/.venv
source tests/selenium/.venv/bin/activate
python -m pip install -r tests/selenium/requirements.txt
cd frontend
pnpm install
cd ..
pytest tests/selenium/categories/auth/test_tc_004.py -v --headed
```

เมื่อใช้ environment ใหม่นี้ ให้ใช้ `pytest` แทน `backend/test_venv/bin/python -m pytest` ในคำสั่งส่วนถัดไป เปิด Terminal ใหม่ต้อง activate อีกครั้ง หรือเรียก `tests/selenium/.venv/bin/python -m pytest` โดยตรง

## 3. เลือกรูปแบบการรัน

### เปิดหน้าต่าง Chrome: headed

เหมาะสำหรับดูขั้นตอนการทดสอบและตรวจปัญหา:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -v --headed
```

### ไม่เปิดหน้าต่าง Chrome: headless

เหมาะสำหรับรันอัตโนมัติและ CI:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -v --headless
```

บนเครื่อง local ค่าเริ่มต้นเป็น headed ส่วน CI และ container เป็น headless แนะนำระบุ flag ให้ชัดเจนทุกครั้ง และเลือกเพียง `--headed` หรือ `--headless` อย่างใดอย่างหนึ่ง

## 4. ทดสอบแยกตามหมวด

ใช้ `-m` ตามด้วยชื่อ marker ในตาราง:

| หมวด | Marker | Test Case IDs | จำนวน |
|---|---|---|---:|
| AUTH | `auth` | TC-001, TC-004, TC-007 | 3 |
| CATEGORY | `category` | TC-010 | 1 |
| USER | `user` | TC-013 | 1 |
| RECOMMENDATION | `recommendation` | TC-016 | 1 |
| SUBMISSION | `submission` | TC-019, TC-022, TC-025, TC-028, TC-031, TC-034 | 6 |
| REVIEW | `review` | TC-037, TC-038 | 2 |
| NOTIFICATION | `notification` | TC-043 | 1 |
| AI | `ai` | TC-046 | 1 |
| E2E | `e2e` | TC-047, TC-048 | 2 |
| **รวม** | | | **18** |

ตัวอย่างรันหมวด AUTH:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -m auth -v --headed
```

ตัวอย่างหมวดที่ใช้บ่อย:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -m submission -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -m review -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -m ai -v --headed
backend/test_venv/bin/python -m pytest tests/selenium/ -m e2e -v --headed
```

เลือกหลายหมวดในครั้งเดียว:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -m "auth or review" -v --headed
```

คำสั่งนี้เลือก 5 เคส: AUTH 3 เคส และ REVIEW 2 เคส เคสที่ไม่ได้เลือกจะแสดงเป็น `deselected` ใน Terminal และ `NOT RUN` ในรายงาน

## 5. รัน Test Case เดียว

เลือกด้วยเลขเคสโดยไม่ต้องจำหมวดหมู่ เช่น TC-004 (ใช้เลขสามหลัก `004`):

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_004 -v --headed
```

เปลี่ยน `test_tc_004` เป็นเลขเคสที่ต้องการ เช่น `test_tc_001`, `test_tc_013`, `test_tc_046` หรือ `test_tc_048` คง path `tests/selenium/` ไว้เพื่อให้ pytest โหลด configuration และ option `--headed` ของชุด Selenium

หากต้องการรันด้วย path ของไฟล์โดยตรง ใช้คำสั่งในตารางนี้จาก root ของโปรเจกต์ หมวดหมู่ต้องตรงกับไฟล์จริง:

| Test Case | หมวดหมู่ | คำสั่งรันแบบเปิด Chrome |
|---|---|---|
| TC-001 | `auth` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/auth/test_tc_001.py -v --headed` |
| TC-004 | `auth` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/auth/test_tc_004.py -v --headed` |
| TC-007 | `auth` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/auth/test_tc_007.py -v --headed` |
| TC-010 | `category` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/category/test_tc_010.py -v --headed` |
| TC-013 | `user` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/user/test_tc_013.py -v --headed` |
| TC-016 | `recommendation` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/recommendation/test_tc_016.py -v --headed` |
| TC-019 | `submission` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/submission/test_tc_019.py -v --headed` |
| TC-022 | `submission` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/submission/test_tc_022.py -v --headed` |
| TC-025 | `submission` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/submission/test_tc_025.py -v --headed` |
| TC-028 | `submission` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/submission/test_tc_028.py -v --headed` |
| TC-031 | `submission` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/submission/test_tc_031.py -v --headed` |
| TC-034 | `submission` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/submission/test_tc_034.py -v --headed` |
| TC-037 | `review` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/review/test_tc_037.py -v --headed` |
| TC-038 | `review` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/review/test_tc_038.py -v --headed` |
| TC-043 | `notification` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/notification/test_tc_043.py -v --headed` |
| TC-046 | `ai` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/ai/test_tc_046.py -v --headed` |
| TC-047 | `e2e` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/e2e/test_tc_047.py -v --headed` |
| TC-048 | `e2e` | `backend/test_venv/bin/python -m pytest tests/selenium/categories/e2e/test_tc_048.py -v --headed` |

ตรวจรายการเคสก่อนรัน โดยยังไม่เปิด browser:

```bash
backend/test_venv/bin/python -m pytest tests/selenium/ --collect-only -q
```

การ collect อย่างเดียวไม่ได้ยืนยัน PASS และไม่เขียนทับรายงาน UI จากการรันจริง

## 6. อ่านผลใน Terminal

ตัวอย่างรูปแบบผลเมื่อรันผ่านครบทั้งหมด:

```text
18 passed, 30 deselected
```

ข้อความข้างต้นเป็นตัวอย่างวิธีอ่านผล ให้ใช้จำนวนที่ Terminal แสดงจากการรันของคุณจริง `30 deselected` หมายถึงเคสของสมาชิกคนอื่นถูกยกเว้นตามขอบเขต Narongsak ไม่ใช่การทดสอบล้มเหลว

| ข้อความใน Terminal | ความหมาย |
|---|---|
| `PASSED` / `passed` | ขั้นตอนและ assertions ของเคสผ่าน |
| `FAILED` / `failed` | มีขั้นตอนหรือ assertion ล้มเหลว ต้องดูรายละเอียด |
| `ERROR` / `errors` | มักเกิดระหว่าง setup/cleanup ให้ดู exception และ service logs |
| `deselected` | เคสไม่ได้ถูกเลือกให้รัน |
| `collected` | พบเคสตามการเลือก ยังไม่ได้แปลว่ารันผ่าน |

ในรายงานจะใช้ `PASS`, `FAIL`, `BLOCKED` และ `NOT RUN` โดย setup/cleanup error จะแสดงเป็น `BLOCKED` หากสร้าง browser ไม่สำเร็จ จะไม่มี screenshot ของเคสนั้น แต่ยังมีรายละเอียด error ตามที่ระบบเก็บได้

### ทำไม TC-004 แสดง Bad Request แต่ PASSED

TC-004 ตั้งใจกรอกรหัสผ่านผิด จึงคาดหวังให้ระบบปฏิเสธการเข้าสู่ระบบ เทสต์ตรวจข้อความ “อีเมลหรือรหัสผ่านไม่ถูกต้อง”, ยังคงอยู่หน้า `/login`, ไม่มี cookie สำหรับเข้าสู่ระบบ และเรียก API ด้วยรหัสผ่านผิดแล้วได้ HTTP `400 Bad Request` โดยไม่มี `access_token`

`PASSED` หมายถึงผลตรงกับ assertions ของเคส สำหรับ TC-004 คือปฏิเสธการเข้าสู่ระบบตามที่คาดหวัง ไม่ได้หมายถึง Login สำเร็จ หากเข้าระบบได้ด้วยรหัสผ่านผิด เคสนี้ควร `FAILED`

ให้ตรวจทั้งสถานะและหลักฐานของ session เดียวกัน ผล PASS จากรายงานก่อนหน้าไม่ยืนยันผลการรันครั้งใหม่

## 7. เปิดรายงานและ screenshots

หลังจบการรัน เปิด [รายงาน UI](UI-TEST-EXECUTION.md) เพื่อดูตาราง TC ID, Category, UI Tested, Status และลิงก์หลักฐาน รวมถึงขั้นตอน ผลที่คาดหวัง ผลจริง และระยะเวลา

| หลักฐาน | ตำแหน่ง |
|---|---|
| รายงาน UI ที่อัปเดตเมื่อรัน | `docs/testing/narongsak/UI-TEST-EXECUTION.md` |
| JSON ของแต่ละ session | `tests/selenium/reports/{session-id}/ui-results.json` |
| รายงาน UI เก็บตาม session | `tests/selenium/reports/{session-id}/UI-TEST-EXECUTION.md` |
| Screenshots | `tests/selenium/reports/screenshots/{category}/{TC-ID}/{session-id}/` |
| รายงานและ service logs | `tests/selenium/artifacts/{session-id}/` |

ชื่อ session เป็น timestamp UTC และมีความละเอียดถึง microseconds เพื่อแยกการรันแต่ละครั้ง ชื่อภาพมีลำดับและขั้นตอน เช่น `...-final-result.png` หรือ `...-failure-call.png`

เมื่อรันเพียงหมวดหรือเคสเดียว รายงานหลักจะอัปเดตตาม session นั้น และแสดง `NOT RUN` สำหรับเคสที่เหลือ หากต้องการดูผลทั้ง 18 เคสจากรอบก่อน ให้เปิดรายงานใน directory ของ session นั้น

เมื่อเคสล้มเหลว:

1. อ่าน exception ใน Terminal ว่าเกิดในเคสใดและช่วงใด
2. เปิด `failure` screenshot ของเคสและ session เดียวกัน หากมี
3. เปิด `ui-results.json` ดู `steps`, `errors`, `screenshot_paths` และ `duration_seconds`
4. ดู `errors.log`, `backend.log` หรือ `frontend.log` ใน artifacts ตามปัญหา ไฟล์ `errors.log` จะมีเมื่อระบบบันทึกข้อผิดพลาด
5. แก้สาเหตุแล้วรันไฟล์เคสนั้นซ้ำ เก็บผลใหม่แยกจากผลเดิม

## 8. ตั้งค่าที่ใช้บ่อย

ไม่ต้องตั้งค่าเพิ่มเติมสำหรับการรันปกติ ระบบใช้ localhost และสร้าง test accounts พร้อมรหัสผ่านสุ่มใหม่ทุก session

| Environment variable | ค่าเริ่มต้น / การใช้ |
|---|---|
| `BROWSER` | `chrome`; รองรับ `brave` เมื่อระบุ binary |
| `HEADLESS` | `false` บน local; `true` บน CI/container; flags มีลำดับความสำคัญสูงกว่า env |
| `BASE_URL` | ไม่กำหนด = เลือกพอร์ต localhost ว่างอัตโนมัติ |
| `BROWSER_WINDOW_SIZE` | `1440,1000` (width,height) |
| `SELENIUM_TIMEOUT` | `30` วินาที สำหรับรอ UI |
| `SELENIUM_STARTUP_TIMEOUT` | `90` วินาที สำหรับรอ service เริ่มทำงาน |
| `SCREENSHOTS_DIR` | `tests/selenium/reports/screenshots` |
| `SELENIUM_CHROME_BINARY` | path ของ browser; ต้องกำหนดเมื่อใช้ Brave |
| `SELENIUM_CHROMEDRIVER` | path ของ ChromeDriver ที่เข้ากันกับ browser สำหรับการรัน offline |
| `TEST_STUDENT_EMAIL` | `s1@example.org` |
| `TEST_ADMIN_EMAIL` | `a1@example.org` |
| `TEST_ADVISOR_EMAIL` | `d1@example.org` |
| `TEST_PASSWORD` | ไม่กำหนด = สุ่มรหัสผ่าน; หากจำเป็นต้องกำหนด ให้ส่งผ่าน environment หรือ CI secret |

ตัวอย่างกำหนดหน้าต่างและเวลารอ:

```bash
BROWSER_WINDOW_SIZE=1280,900 SELENIUM_TIMEOUT=45 backend/test_venv/bin/python -m pytest tests/selenium/ -m auth -v --headed
```

ตัวอย่างเลือกพอร์ต frontend ทดสอบคงที่:

```bash
BASE_URL=http://127.0.0.1:3157 backend/test_venv/bin/python -m pytest tests/selenium/categories/auth/test_tc_004.py -v --headless
```

`BASE_URL` ใน runner นี้ใช้กำหนด origin ของ frontend ชั่วคราวที่ runner เปิดเอง รับเฉพาะ `http://localhost:port` หรือ `http://127.0.0.1:port` ไม่ใช่ URL ของระบบที่มีข้อมูลอยู่แล้ว หากพอร์ตถูกใช้งานอยู่ runner จะปฏิเสธการเริ่มทดสอบ เลือกพอร์ตอื่นหรือไม่กำหนด `BASE_URL` เพื่อให้เลือกอัตโนมัติ

Selenium Manager จะเลือก ChromeDriver ให้เมื่อไม่ได้กำหนด path โดยอาจต้องใช้อินเทอร์เน็ตในการค้นหาหรือดาวน์โหลดครั้งแรก หากใช้ driver ที่กำหนดเอง อย่านำ path ของ driver รุ่นเก่ามาใช้หลัง browser อัปเดต

## 9. แก้ปัญหาที่พบบ่อย

| อาการ | วิธีตรวจและแก้ |
|---|---|
| `backend/test_venv/bin/python: No such file or directory` | ตรวจว่าอยู่ที่ root ของโปรเจกต์ หากไม่มี environment เดิม ให้สร้างใหม่ตามข้อ 2 |
| `unrecognized arguments: --headed` พร้อม `inifile: None` | ตรวจ path และหมวดหมู่ตามตารางข้อ 5 เช่น TC-001/004 อยู่ `auth`, TC-013 อยู่ `user`, TC-046 อยู่ `ai`, TC-048 อยู่ `e2e`; path ที่ไม่มีอยู่ทำให้ pytest ไม่โหลด Selenium configuration ลองใช้ `backend/test_venv/bin/python -m pytest tests/selenium/ -k test_tc_004 -v --headed` แล้วเปลี่ยนเลขเคสตามต้องการ |
| `pytest: command not found` | ใช้ `backend/test_venv/bin/python -m pytest` หรือ activate environment ใหม่ก่อน |
| `ModuleNotFoundError` | ติดตั้ง `tests/selenium/requirements.txt` ด้วย Python environment ที่ใช้รัน |
| ไม่พบ frontend dependencies | รัน `pnpm install` ใน `frontend` แล้วกลับมาที่ root |
| Next.js development lock ถูกใช้งาน | หยุด Next.js dev server ของ checkout นี้จาก Terminal ที่เปิดไว้ แล้วรันใหม่ |
| `BASE_URL port is already occupied` | ใช้พอร์ตอื่นหรือเลิกกำหนด `BASE_URL`; runner ไม่ใช้แอปที่เปิดอยู่แทนแอปทดสอบ |
| Chrome/ChromeDriver รุ่นไม่เข้ากัน | ตรวจ path ที่กำหนดไว้ ใช้ driver ที่รองรับ browser หรือให้ Selenium Manager เลือกให้ |
| `ElementClickInterceptedException` | ดู screenshot ว่าปุ่มถูกบังหรือ layout กำลังเคลื่อน ตรวจ locator และ wait ใน POM ก่อนรันเคสเดิมซ้ำ |
| `TimeoutException` | ดูว่า UI แสดง error, ข้อมูลไม่โหลด หรือ service ล้มเหลว แก้สาเหตุจาก logs ก่อนเพิ่ม timeout |
| `Service did not become ready` | ดู `backend.log` / `frontend.log`; หาก service เริ่มช้า จึงเพิ่ม `SELENIUM_STARTUP_TIMEOUT` |
| `Operation not permitted` ขณะเปิดพอร์ตหรือ browser | รันใน Terminal local ที่อนุญาต localhost และ Chrome; หากใช้ sandbox ให้จัดสิทธิ์ของ environment ตามข้อผิดพลาด |
| ไม่พบ screenshot | ตรวจว่า browser เริ่มได้หรือไม่ และ directory ใน `SCREENSHOTS_DIR` เขียนได้; ดู `errors` / `screenshot_errors` ใน JSON |

## 10. ข้อมูลและขอบเขตการทดสอบ

แต่ละ session ใช้ฐานข้อมูล SQLite และไฟล์ชั่วคราวของตัวเอง แต่ละเคส seed ข้อมูลใหม่และเปิด browser profile ใหม่ ไม่ต้องสมัครบัญชีหรือเพิ่มงานวิจัยด้วยมือก่อนรัน และไม่ต้องลบข้อมูลที่ระบบสร้างชั่วคราวเอง

รันแบบ serial ทีละ session สำหรับ checkout นี้ ไม่ใช้ pytest-xdist หรือเปิดชุดทดสอบสองรอบพร้อมกัน เพราะแต่ละเคส reset ฐานทดสอบและ Next.js ใช้ development lock ร่วมกัน

TC-046 มี UI สำหรับ AI ทั้งสี่ endpoints โดย provider ใช้ deterministic mock เพื่อให้ผลตรวจทำซ้ำได้ ข้อมูลสิทธิ์ ความสัมพันธ์ การเก็บ revision และ counters บางส่วนตรวจเสริมผ่าน API/database จึงไม่ถือว่าทุก assertion เป็นการตรวจผ่าน UI ผลชุดนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพ AI provider จริง

ก่อนส่งผลทดสอบให้ทีม ให้ระบุคำสั่งที่รัน, session ID, จำนวน PASS/FAIL/BLOCKED/NOT RUN และแนบรายงานกับ screenshots หรือ logs ของ session เดียวกัน เก็บข้อผิดพลาดจริงไว้โดยไม่เปลี่ยนเป็น PASS จากประวัติ

รายละเอียดโครงสร้างและ configuration เพิ่มเติม: [Selenium README](../../../tests/selenium/README.md)
