# รายงานผลการทดสอบ UniResearch

ชื่องานปัจจุบันใช้ชื่อเต็มจาก [migrate.py/seed_thai_data.py](TEST-RESEARCH-DATA.md) พร้อมระบุสำเนาที่เตรียมเพิ่ม สถานะและการเชื่อมบัญชี CSV เป็นเงื่อนไขบนฐานทดสอบ ไม่ใช่ผล migration หรือผลทดสอบย้อนหลังของบุคคลนั้น

ฉบับข้อมูลทดสอบปัจจุบันใช้ชื่อ/อีเมลจาก [student.csv](../../backend/app/scripts/student.csv) และ [advisors.csv](../../backend/app/scripts/advisors.csv) ตามตารางใน [Test Cases ข้อ 1.3](TEST-CASES.md#13-ข้อมูลทดสอบร่วม) ต้องเตรียมสำเนาฐานทดสอบให้ตรงก่อนรัน เลขผู้ใช้ในเอกสารเป็น mapping ของฐานทดสอบตามแผน ไม่ใช่ id จาก CSV ผลย้อนหลังอ้างข้อมูลของรอบเดิม ส่วนผลรันด้วยบัญชี CSV และ migration ปัจจุบันแยกใน [รายงานปรับสคริปต์ 16 ตุลาคม](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md)

ฉบับทบทวนเนื้อหา: **22 ตุลาคม 2026** · ส่วนที่ 2 ของ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md)

**ผลรอบเต็มล่าสุดที่อ้างในรายงานนี้:** ปรับสคริปต์ให้ใช้บัญชี CSV และชื่องานจาก migration แล้ว รอบเต็ม C16 วันที่ 16 ตุลาคมได้ **43 PASS / 5 FAIL จาก 48** หลังแก้ปัญหาสคริปต์ TC-015/032 และเพิ่มขั้นตอน UI มีรอบ R16 **4 PASS / 1 FAIL** แล้วทวน TC-002 ซึ่งคาดข้อความผิดภาษาใน R16B **1 PASS** ยังมีข้อผิดพลาดระบบ TC-018/027/045 เปิดอยู่ ดู [ผลปรับสคริปต์และผลรายกรณี](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md)

ผล C16/R16/R16B ไม่รวมเป็น session เดียว ส่วน S08/U14/U16 ด้านล่างเป็นประวัติของสคริปต์และข้อมูลรอบเดิม ไม่ใช้รับรองข้อมูล CSV โดยอัตโนมัติ ทุกขั้นตอน manual/ส่วนเสริมที่ไม่ได้ assert ยังต้องทวนก่อนลงนามรับรอง

สี่หัวข้อหลักของ Test Cases เป็นคู่มือกดหน้าเว็บ รายละเอียด API/DB/ไฟล์อยู่ใน [คู่มือจุดตรวจเสริม](TEST-CASES-TECHNICAL-CHECKS.md) สคริปต์ปัจจุบันมี UI 34 กรณีและ API-only 14 กรณี การรันครบ 48 ไม่ใช่หลักฐานว่าเดิน UI ครบทั้ง 48

**ข้อมูลเพิ่ม ณ 22 ตุลาคม:** พบหลักฐาน focused UI ใหม่ 4 sessions ตามข้อ 2.9 รอบล่าสุดรัน TC-038 ผ่าน 1 กรณี อีก 17 NOT RUN ใน subset 18; ไม่ใช่การทดสอบซ้ำครบ 48 และยังไม่มีหลักฐานใหม่ปิด TC-018/027/045 งานทบทวนเอกสารนี้ไม่ได้รันระบบเพิ่ม

## 2.1 ข้อมูลรอบการทดสอบ

| รายการ | รายละเอียด |
|---|---|
| รอบการทดสอบ (Test Cycle) | C16 เป็นรอบเต็ม 48 TC ล่าสุดที่อ้างในรายงานนี้; R16/R16B และ U22 เป็น focused retests แยก session |
| ช่วงเวลาทดสอบ | ประวัติ 4–22 ตุลาคม 2026; เวลาจริงอ้าง generated_at พร้อม timezone ของแต่ละ JSON |
| เวอร์ชัน/Commit ที่ทดสอบ | C16: `16490e54bd66bb12e0affb3ea16ac1a9bc1b3f57`; U22: `d5be60d7f87da841f7e03c37746c278287474a46` รวม working tree; ไม่ใช่ commit ของงานทบทวนเอกสาร |
| สภาพแวดล้อม/Browser | C16/U22 ใช้ Chrome, Next.js/FastAPI จริง, SQLite ชั่วคราว, deterministic AI mock; PostgreSQL/pgvector ไม่ได้รับรองจากผลนี้ |
| หลักฐานและข้อจำกัด | ตาราง session ด้านล่างและข้อ 2.9; บาง artifacts ไม่ติดตาม Git ต้องแนบเมื่อส่งตรวจ |

| รอบ | Scope / สภาพแวดล้อม | Commit ที่หลักฐานระบุ | หลักฐาน |
|---|---|---|---|
| D04 — 4 ต.ค. 2026 | Docker; Playwright/API; SQLite functional และ PostgreSQL smoke แยก | `67dfab6` + working tree | [หลักฐาน Docker](DOCKER-TEST-EVIDENCE-2026-10-04.md) |
| S08 — 8 ต.ค. 2026 | 48 TC; Chrome headless 154.0.8037.98, macOS, Python 3.14.5, Selenium 4.50.0, pytest 9.1.1; SQLite/mock | `009d772fb0a3233cd353e7c56917e764cb682c92` + working tree | [รายงาน](../../tests/selenium/artifacts/20261008-023513-332743/report.md), [JSON](../../tests/selenium/artifacts/20261008-023513-332743/results.json) |
| N08 — notification retest | TC-040/043 หลังแก้ frontend notification proxy | `c6e941ebc0794323ca24a82405efcf1b059aee93` + working tree | [รายงาน](../../tests/selenium/artifacts/20261008-041822-000844/report.md), [JSON](../../tests/selenium/artifacts/20261008-041822-000844/results.json) |
| A08 — assignment subset | 18 TC ของ Narongsak; Chrome/SQLite/mock | `c6e941ebc0794323ca24a82405efcf1b059aee93` + working tree | [รายงาน](../../tests/selenium/artifacts/20261008-042008-398982/report.md), [JSON](../../tests/selenium/artifacts/20261008-042008-398982/results.json) |
| U14 — 14 ต.ค. 2026 | 18 TC; UI จริง Chrome headed 155.0.8059.41; macOS 27.0.1; SQLite/mock | `7ff6c6750f0982ca4a34834daf5dee5ff223e976` + working tree | [UI report](../../tests/selenium/reports/20261014-102745-778362/UI-TEST-EXECUTION.md), [JSON](../../tests/selenium/reports/20261014-102745-778362/ui-results.json) |
| U16 — 16 ต.ค. 2026 | TC-038; Chrome headed 155.0.8059.82; SQLite/mock | `f435e68deb29a5c6531012e877c7b8f7e9be9209` + working tree | [UI report](../../tests/selenium/reports/20261016-094537-437659/UI-TEST-EXECUTION.md), [JSON](../../tests/selenium/reports/20261016-094537-437659/ui-results.json) |
| C16/R16/R16B — 16 ต.ค. 2026 | ข้อมูล CSV/migration; full 48 และ focused retests; Chrome headless/SQLite/mock | `16490e54bd66bb12e0affb3ea16ac1a9bc1b3f57` + working tree แต่ละรอบ | [รายงานปรับสคริปต์](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md) |

ผู้รันอัตโนมัติย้อนหลัง: Codex ตามรายงานเดิม ชื่อ Narongsak/Sommai Kitikorn/Natthaporn ใน Test Cases เป็นการจัดสรรงาน ไม่ใช่หลักฐานว่ารันด้วยตนเอง ผู้รับรองผลยังไม่ระบุ

`generated_at` ใน JSON ของ S08 คือ `2026-10-08T02:39:41.704974+00:00`, U14 คือ `2026-10-14T10:31:38.712029+00:00`, U16 คือ `2026-10-16T09:46:09.178357+00:00` ใช้ UTC ของ metadata เมื่อเทียบลำดับ ไม่เรียงจากชื่อ directory อย่างเดียว: พบ directory `20261008-092316` ที่ JSON ระบุเวลา `02:28:58 UTC` และผล 31 PASS/17 FAIL ซึ่งเป็นคนละ session ไม่ใช่ผลล่าสุดของ S08 และห้ามนำไปรวมกัน ต้องตรวจ logs ก่อนใช้แก้ chronology

ไฟล์ `artifacts/` บางส่วนไม่ได้ติดตาม Git จึงอาจไม่มีใน checkout อื่น ส่วนผล UI ที่มี versioned reports อ้าง path ใต้ `reports/` โดยตรง ควรแนบ JSON/log/screenshot ของรอบที่จะส่งรับรองให้ครบ ไม่มีการแก้ raw evidence ในงานทบทวนนี้

## 2.2 สรุปผลการทดสอบโดยรวม (Executive Summary)

ตารางสรุปแบบ PDF ต่อไปนี้อ้าง **C16 รอบเดียว** (48 TC); ไม่รวม R16/R16B/U22 และไม่ถือว่าแต่ละ PASS รับรองทุก manual subcase ของฉบับปรับปรุง

| รายการ | จำนวน | ร้อยละของ TC ทั้งหมดในรอบ C16 |
|---|---:|---:|
| กรณีทดสอบทั้งหมดตามแผน | 48 | 100.00% |
| Positive ตามแผน | 32 | 66.67% |
| Negative ตามแผน | 16 | 33.33% |
| ดำเนินการแล้ว (Executed) | 48 | 100.00% |
| ผ่าน (Passed) | 43 | 89.58% |
| ไม่ผ่าน (Failed) | 5 | 10.42% |
| BLOCKED | 0 | 0.00% |
| SKIPPED | 0 | 0.00% |
| NOT RUN ใน scope | 0 | 0.00% |

ตารางต่อไปแยกประวัติแต่ละรอบ โดยใช้ denominator และ scope ของรอบนั้น

| รอบ | Planned/ขอบเขต | PASS | FAIL | BLOCKED | SKIPPED/ข้าม | NOT RUN/ไม่อยู่ในรอบ | Executed | Pass rate ของ Executed |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| D04 | 48 | 17 | 0 | ไม่แยกในหลักฐานเดิม | 31 ข้าม | 0 ตามรายงานเดิม | 17 | 100% |
| S08 | 48 | 44 | 4 | 0 | 0 | 0 | 48 | 91.67% |
| N08 | 2 ที่เลือก | 2 | 0 | 0 | 0 | อีก 46 ไม่อยู่ในรอบ | 2 | 100% |
| A08 | 18 ที่เลือก | 18 | 0 | 0 | 0 | อีก 30 ไม่อยู่ในรอบ | 18 | 100% |
| U14 | 18 | 18 | 0 | 0 | 0 | 0 ใน subset; อีก 30 นอก scope | 18 | 100% |
| U16 | 18 | 1 | 0 | 0 | 0 | 17 ใน subset; อีก 30 นอก scope | 1 | 100% |
| C16 — CSV/migration full | 48 | 43 | 5 | 0 | 0 | 0 | 48 | 89.58% |
| R16 — focused หลังปรับสคริปต์ | 5 ที่เลือก | 4 | 1 | 0 | 0 | อีก 43 ไม่อยู่ในรอบ | 5 | 80% |
| R16B — ข้อความสมัครซ้ำ | 1 ที่เลือก | 1 | 0 | 0 | 0 | อีก 47 ไม่อยู่ในรอบ | 1 | 100% |
| ทวนครบทุกขั้นตอน manual/ส่วนเสริม | 48 | ยังไม่รับรอง | ยังไม่รับรอง | — | — | รอผู้ทดสอบทวนสิ่งที่ไม่ได้ assert | — | N/A |

D04 execution coverage = 17/48 = 35.42%; S08 = 48/48 = 100%; U14 UI coverage = 18/18 = 100% ของ subset; U16 UI coverage = 1/18 = 5.56% ของ subset ตัวเลข 100% ของ subset ไม่ใช่ coverage ของทั้ง 48 หรือทุก subcase ที่เพิ่มภายหลัง

### 2.2.1 ผลการทดสอบจำแนกตามกลุ่มฟังก์ชัน

#### 2.2.1.1 รอบ C16

| กลุ่มฟังก์ชัน | ทั้งหมด | ดำเนินการแล้ว | ผ่าน | ไม่ผ่าน | ข้าม |
|---|---:|---:|---:|---:|---:|
| บัญชีและโปรไฟล์ | 7 | 7 | 7 | 0 | 0 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | 6 | 6 | 6 | 0 | 0 |
| ค้นหา รายละเอียด และคำแนะนำ | 7 | 7 | 5 | 2 | 0 |
| ส่งผลงานและตรวจข้อมูล | 7 | 7 | 6 | 1 | 0 |
| ผลงานของฉัน การแก้ไข และไฟล์ | 8 | 8 | 7 | 1 | 0 |
| คิวและผลการตรวจ | 6 | 6 | 6 | 0 | 0 |
| Favorite และการแจ้งเตือน | 2 | 2 | 2 | 0 | 0 |
| AI | 3 | 3 | 2 | 1 | 0 |
| กระบวนการข้ามบทบาท E2E | 2 | 2 | 2 | 0 | 0 |
| รวม | 48 | 48 | 43 | 5 | 0 |

#### 2.2.1.2 ประวัติรอบ S08

ตารางนี้เป็นผลรอบ **S08** เท่านั้น ผลราย TC ของรอบเต็ม C16 แสดงในข้อ 2.3.1 ไม่รวมผลสองรอบเข้าด้วยกัน

| กลุ่ม | TC | Executed | PASS | FAIL |
|---|---:|---:|---:|---:|
| บัญชีและโปรไฟล์ | 7 | 7 | 7 | 0 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | 6 | 6 | 6 | 0 |
| ค้นหา รายละเอียด และคำแนะนำ | 7 | 7 | 6 | 1 |
| ส่งผลงานและตรวจข้อมูล | 7 | 7 | 7 | 0 |
| ผลงานของฉัน การแก้ไข และไฟล์ | 8 | 8 | 8 | 0 |
| คิวและผลการตรวจ | 6 | 6 | 5 | 1 |
| Favorite และการแจ้งเตือน | 2 | 2 | 1 | 1 |
| AI | 3 | 3 | 2 | 1 |
| E2E ข้ามบทบาท | 2 | 2 | 2 | 0 |
| รวม | 48 | 48 | 44 | 4 |

### 2.2.2 Quality gates ที่มีหลักฐาน

ผล Docker D04: backend pytest **40/40**, frontend Node tests **32/32**, Playwright **10/10**, TypeScript และ production build ผ่าน; ESLint **ไม่ผ่าน 16 errors / 8 warnings** ตาม [หลักฐาน D04](DOCKER-TEST-EVIDENCE-2026-10-04.md) จำนวน unit tests เหล่านี้ไม่ใช่จำนวน TC ใน specification และไม่ใช้บวกเพิ่มกับ 48

หลังแก้ notification รายงาน S08 ระบุ lint เฉพาะสองไฟล์ที่เปลี่ยนผ่าน แต่ typecheck ปกติติด generated `.next/types`; source-only check ผ่าน ข้อมูลนี้ไม่เท่ากับ frontend quality gates ทั้งโครงการผ่าน ส่วน quality gates ของ commit `343fb57` และเงื่อนไขฉบับทบทวน **ไม่ได้รันใหม่ในงานนี้**

## 2.3 บันทึกผลการทดสอบรายกรณี (Test Execution Log)

### 2.3.1 รอบเต็ม C16 — 16 ตุลาคม 2026

ใช้คอลัมน์ตาม PDF: รหัส ชื่อ FR สถานะ ผลจริง/หลักฐาน รหัสข้อบกพร่อง ผู้ทดสอบ และวันที่ ทุกแถวในตารางนี้อ้าง session `20261016-124752-257620` เดียวกัน ไม่รวมผล retest R16/R16B หรือ U22 เข้าไป

P=PASS, F=FAIL ของ assertions ที่สคริปต์รัน; actual/steps/API/DB อยู่ใน JSON ไม่ยืนยัน manual subcase ที่ไม่มี assertion ผู้ควบคุมการรันไม่ได้ระบุชื่อใน JSON จึงไม่ใช้ชื่อผู้รับมอบหมายตาม PDF แทน

| รหัส | ชื่อกรณีทดสอบ | FR | สถานะ | ผลจริง/หลักฐาน | รหัสข้อบกพร่อง | ผู้ทดสอบ | วันที่ |
|---|---|---|---|---|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | FR-001 | P | HTTP ที่บันทึก: `POST /auth/register` → 200; มี DB query evidence 1 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-002 | สมัคร email ซ้ำ | FR-001 | P | HTTP ที่บันทึก: `POST /auth/register` → 400; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-003 | ล็อกอินข้อมูลถูก | FR-002 | P | HTTP ที่บันทึก: `POST /auth/login` → 200; `GET /auth/me` → 200; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-004 | รหัสผ่านผิด | FR-002 | P | HTTP ที่บันทึก: `POST /auth/login` → 400; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-005 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | FR-003 | P | HTTP ที่บันทึก: `GET /auth/me` → 200; `POST /auth/login` → 400; มี DB query evidence 5 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-006 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | FR-003 | P | HTTP ที่บันทึก: `GET /auth/me` → 401; `GET /auth/me` → 400; `PUT /auth/me` → 400; มี DB query evidence 1 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-007 | ล็อกอินแล้วออกจากระบบ | FR-004 | P | Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-008 | admin CRUD ผู้ใช้ | FR-005 | P | HTTP ที่บันทึก: `GET /users/9` → 200; `PUT /users/9` → 200; `DELETE /users/9` → 204; `GET /users/9` → 404 (รายการเต็มใน JSON); มี DB query evidence 5 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-009 | student เรียก API จัดการผู้ใช้ | FR-005 | P | HTTP ที่บันทึก: `GET /users/` → 403; `POST /users/` → 403; `GET /users/3` → 403; `PUT /users/3` → 403 (รายการเต็มใน JSON); มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | FR-006 | P | HTTP ที่บันทึก: `GET /categories/` → 200; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-011 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | FR-006 | P | HTTP ที่บันทึก: `GET /categories/` → 200; `POST /categories/` → 403; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-012 | admin แทนรายการตัวเลือก | FR-007 | P | HTTP ที่บันทึก: `POST /options/` → 200; `GET /options/` → 200; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-013 | student เปลี่ยนตัวเลือก | FR-007 | P | HTTP ที่บันทึก: `GET /options/` → 200; `POST /options/` → 403; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-014 | guest/student/admin ค้นงาน approved และ pending | FR-008 | P | HTTP ที่บันทึก: `GET /research/search` → 200; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-015 | คำค้นมีหลายคำและบันทึก log | FR-008 | F | HTTP ที่บันทึก: `GET /research/search` → 200; มี DB query evidence 1 รายการ; ranking ได้ IDs {1,4,5} แต่คาด {1,4}; fixture สำเนามีชื่อซ้ำ; R16 ทวนแล้วแยกรายงาน [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | Script: TC-015 | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-016 | คำแนะนำไม่เผยงาน pending | FR-009 | P | HTTP ที่บันทึก: `GET /research/search/suggestions` → 200; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-017 | latest/popular และสถิติ | FR-010 | P | HTTP ที่บันทึก: `GET /home/latest` → 200; `GET /home/popular` → 200; `GET /stats/` → 200; มี DB query evidence 4 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-018 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | FR-011 | F | HTTP ที่บันทึก: `GET /research/1/recommendations` → 500; มี DB query evidence 3 รายการ; GET recommendations คาด 200 ได้ 500 [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | AUD-01 | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-019 | ID ไม่มีอยู่ | FR-011 | P | HTTP ที่บันทึก: `GET /research/999999999` → 404; มี DB query evidence 1 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-020 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | FR-012 | P | HTTP ที่บันทึก: `GET /research/recommendations/personalized` → 200; `POST /favorites/1` → 200; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-021 | รายชื่อผู้เขียน/ที่ปรึกษา | FR-013 | P | HTTP ที่บันทึก: `GET /research/participants` → 200; `GET /research/participants` → 401; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | FR-014 | P | มี DB query evidence 5 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-023 | ไม่ล็อกอินหรือ role guest ส่งงาน | FR-014 | P | HTTP ที่บันทึก: `POST /research/` → 401; `POST /research/` → 403; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-024 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | FR-015 | P | HTTP ที่บันทึก: `POST /research/` → 422; `POST /research/` → 404; `POST /research/` → 200; มี DB query evidence 20 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-025 | ผู้เขียนคนละ prefix ปี | FR-015 | P | HTTP ที่บันทึก: `POST /research/` → 422; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-026 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | FR-016 | P | HTTP ที่บันทึก: `POST /research/` → 200; `POST /research/` → 413; มี DB query evidence 4 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-027 | นามสกุล/MIME/ลายเซ็นผิด | FR-016 | F | HTTP ที่บันทึก: `POST /research/` → 415; `POST /research/` → 200; `PUT /research/6` → 415; มี DB query evidence 6 รายการ; DB rollback แต่ไฟล์ปกเดิมถูกลบ [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | TC-027 rollback | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-028 | ผู้ส่ง/author เห็นงานใน /my | FR-017 | P | HTTP ที่บันทึก: `GET /research/my` → 200; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-029 | ผู้มีสิทธิ์แก้แล้วกลับ pending | FR-018 | P | HTTP ที่บันทึก: `GET /research/1` → 200; มี DB query evidence 1 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-030 | คนอื่นแก้งาน | FR-018 | P | HTTP ที่บันทึก: `PUT /research/3` → 403; มี DB query evidence 4 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-031 | ส่งเอกสารใหม่หลัง needs_revision | FR-019 | P | HTTP ที่บันทึก: `POST /research/` → 200; `PUT /research/6` → 200; มี DB query evidence 6 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-032 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | FR-020 | F | HTTP ที่บันทึก: `POST /favorites/6` → 200; `POST /research/6/review` → 200; มี DB query evidence 2 รายการ; NoAlertPresentException ในสคริปต์; R16 ทวนแล้วแยกรายงาน [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | Script: TC-032 | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-033 | คนอื่นลบงาน | FR-020 | P | HTTP ที่บันทึก: `DELETE /research/3` → 403; มี DB query evidence 3 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | FR-021 | P | มี DB query evidence 3 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-035 | ไม่มี token หรือไม่มีไฟล์ | FR-021 | P | HTTP ที่บันทึก: `POST /research/1/download` → 401; `POST /research/5/download` → 404; `POST /research/999999999/download` → 404; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-036 | admin/advisor/student ดู pending | FR-022 | P | HTTP ที่บันทึก: `GET /research/pending` → 200; `GET /research/pending` → 403; `GET /research/pending` → 401; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | FR-023 | P | HTTP ที่บันทึก: `GET /research/history` → 200; `GET /research/history` → 403; มี DB query evidence 1 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | FR-024 | P | HTTP ที่บันทึก: `GET /research/2` → 200; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-039 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | FR-024 | P | HTTP ที่บันทึก: `POST /research/2/review` → 403; `POST /research/1/review` → 400; `POST /research/2/review` → 422; `POST /research/2/review` → 401 (รายการเต็มใน JSON); มี DB query evidence 3 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-040 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | FR-025 | P | HTTP ที่บันทึก: `POST /research/` → 200; มี DB query evidence 18 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-041 | admin เปลี่ยน advisor; student ถูกห้าม | FR-026 | P | HTTP ที่บันทึก: `POST /research/2/assign-advisors` → 200; `GET /research/pending` → 200; `POST /research/2/assign-advisors` → 403; มี DB query evidence 2 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-042 | บันทึกและยกเลิก favorite | FR-027 | P | HTTP ที่บันทึก: `GET /favorites/` → 200; `POST /favorites/1` → 200; มี DB query evidence 3 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-043 | อ่านเฉพาะของตนและ mark read | FR-028 | P | HTTP ที่บันทึก: `GET /notifications/` → 200; `POST /notifications/2/read` → 404; `POST /notifications/1/read` → 200; `POST /notifications/read-all` → 200; มี DB query evidence 8 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-044 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | FR-029 | P | HTTP ที่บันทึก: `POST /ai/generate-abstract` → 200; `POST /ai/generate-abstract` → 401; `POST /ai/suggest-titles` → 200; `POST /ai/suggest-titles` → 401 (รายการเต็มใน JSON); Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-045 | dashboard insight และ chat | FR-030 | F | HTTP ที่บันทึก: `POST /ai/dashboard-insights` → 200; `POST /ai/dashboard-insights` → 403; `POST /ai/dashboard-insights` → 401; `POST /ai/chat` → 422 (รายการเต็มใน JSON); POST /ai/chat คาด 200 ได้ 500 [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | AUD-03 | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-046 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | FR-031 | P | HTTP ที่บันทึก: `POST /research/1/ai-pre-review` → 200; `POST /research/1/ai-pre-review` → 401; `POST /research/1/ai-pre-review` → 403; `POST /research/999999999/ai-pre-review` → 404 (รายการเต็มใน JSON); มี DB query evidence 1 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | FR-032 | P | HTTP ที่บันทึก: `GET /research/pending` → 200; `GET /research/6` → 200; มี DB query evidence 8 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | FR-032 | P | HTTP ที่บันทึก: `GET /users/9` → 200; `GET /categories/` → 200; `GET /users/` → 403; `POST /users/` → 403 (รายการเต็มใน JSON); มี DB query evidence 9 รายการ; Assertions ที่ execute ผ่าน; ดู event/DB evidence ใน JSON [C16 JSON](../../tests/selenium/artifacts/20261016-124752-257620/results.json) | — | Selenium runner; ผู้ควบคุมรอระบุ | 2026-10-16 |

### 2.3.2 ประวัติ S08/U14/U16 — แยกจากรอบ C16

ชื่อกรณีในตารางใช้ชื่อฉบับทบทวนเพื่อค้นหาด้วย TC ID; ผลย้อนหลังรับรองเฉพาะ assertions ของสคริปต์รอบเดิม ไม่รับรองข้อมูลเตรียมเพิ่มทุกข้อ

S08 = baseline 48 TC; U14 = session UI subset 18 TC; U16 = focused session ก่อนปรับสคริปต์ เครื่องหมาย “นอก scope” ไม่ใช่ FAIL/NOT RUN ของ subset 18 ข้อ แต่หมายถึงไม่ได้อยู่ในชุดนั้น ผล C16/R16/R16B ของข้อมูลและสคริปต์ปัจจุบันอยู่ในรายงานปรับสคริปต์ที่ลิงก์ด้านบน การตรวจครบทุกขั้นตอนและการลงนามแยกจากสถานะในตารางประวัตินี้

| TC | FR | ชื่อกรณี | S08 | U14 | U16 | หมายเหตุผล S08 |
|---|---|---|---|---|---|---|
| TC-001 | FR-001 | สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-002 | FR-001 | ปฏิเสธการสมัครสมาชิกด้วยอีเมล 674259009@webmail.npru.ac.th ที่มีอยู่แล้วโดยไม่สร้างผู้ใช้ซ้ำ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-003 | FR-002 | เข้าสู่ระบบด้วยบัญชีนักศึกษา 674259009@webmail.npru.ac.th และตรวจข้อมูลผู้ใช้กับ session หลังเข้าสู่ระบบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-004 | FR-002 | ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-005 | FR-003 | แก้ชื่อและภาควิชาของ 674259009@webmail.npru.ac.th พร้อมเปลี่ยนรหัสผ่านและตรวจการเข้าสู่ระบบด้วยรหัสใหม่ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-006 | FR-003 | ปฏิเสธ token ปลอม บัญชี 674259013@webmail.npru.ac.th ที่ปิดใช้งาน และการแก้อีเมลให้ซ้ำ 674259009@webmail.npru.ac.th | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-007 | FR-004 | ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-008 | FR-005 | ผู้ดูแลระบบ admin@uniresearch.ac.th สร้าง อ่าน แก้ไข และลบบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บและ API | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-009 | FR-005 | ปฏิเสธการอ่าน สร้าง แก้ไข และลบผู้ใช้ผ่าน API เมื่อใช้สิทธิ์นักศึกษา 674259009@webmail.npru.ac.th | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-010 | FR-006 | ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-011 | FR-006 | ปฏิเสธการสร้างหมวดหมู่ Denied C3 เมื่อผู้ส่งคำขอเป็นนักศึกษา 674259009@webmail.npru.ac.th | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-012 | FR-007 | ผู้ดูแลระบบแทนรายการภาควิชาและประเภทงานด้วย New Department กับ New Type พร้อมตัดช่องว่าง | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-013 | FR-007 | นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-014 | FR-008 | ตรวจสิทธิ์การค้นหางานที่เผยแพร่และรอตรวจแยกตามผู้เยี่ยมชม นักศึกษา ที่ปรึกษา และผู้ดูแลระบบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-015 | FR-008 | ค้นคำจากชื่อระบบแนะนำหัวข้อโครงงานวิจัยและบทคัดย่อคลังความรู้ดิจิทัลแบบ OR พร้อมตรวจลำดับและประวัติค้นหา | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-016 | FR-009 | คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-017 | FR-010 | หน้าแรกจัดงานล่าสุดและยอดนิยมถูกลำดับพร้อมสถิติรวมตรงกับข้อมูลผู้ใช้และผลงานทั้งหมด | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-018 | FR-011 | เปิดรายละเอียดงานเลข 1 แล้วเพิ่มยอดดูและแนะนำงานที่เกี่ยวข้องโดยไม่รวมงานรอตรวจ | FAIL | นอก scope | นอก scope | 500 recommendations / MissingGreenlet |
| TC-019 | FR-011 | แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-020 | FR-012 | จัดอันดับคำแนะนำส่วนบุคคลจากความนิยมและรายการบันทึกของ 674259009@webmail.npru.ac.th โดยคืนเฉพาะงานที่เผยแพร่ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-021 | FR-013 | แสดงรายชื่อนักศึกษาและที่ปรึกษาที่เปิดใช้งานสำหรับเลือกผู้เกี่ยวข้องในการส่งงาน | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-022 | FR-014 | นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-023 | FR-014 | ปฏิเสธการส่งผลงานจากผู้ไม่เข้าสู่ระบบและบัญชีผู้เยี่ยมชม g1@example.org | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-024 | FR-015 | ปฏิเสธรายการผู้เขียนและที่ปรึกษาที่รูปแบบผิด รหัสไม่มีจริง บทบาทผิด หรือหมวดหมู่ไม่พบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-025 | FR-015 | ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-026 | FR-016 | อัปโหลดภาพปกและเอกสาร PDF ที่ขนาดต่ำกว่า เท่ากับ และเกินขีดจำกัดหนึ่งไบต์ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-027 | FR-016 | ปฏิเสธไฟล์เอกสารชนิดหรือเนื้อหาผิดและตรวจไม่ให้ไฟล์ใหม่ค้างหรือไฟล์เดิมสูญหายเมื่อแก้ไขล้มเหลว | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-028 | FR-017 | รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-029 | FR-018 | เจ้าของแก้ผลงานที่เผยแพร่เป็น การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ) แล้วสถานะกลับไปรอตรวจสอบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-030 | FR-018 | ปฏิเสธการแก้ผลงานเลข 3 ของ 674259003@webmail.npru.ac.th โดยนักศึกษาอื่นและที่ปรึกษาที่ไม่ได้เป็นเจ้าของหรือผู้เขียน | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-031 | FR-019 | ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-032 | FR-020 | เจ้าของลบ การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) แล้วลบข้อมูลสัมพันธ์และไฟล์หลักของงานพร้อมตรวจไฟล์เวอร์ชันเก่าตกค้าง | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-033 | FR-020 | ปฏิเสธการลบงานเลข 3 ของ 674259003@webmail.npru.ac.th เมื่อผู้ร้องขอเป็น 674259009@webmail.npru.ac.th ที่ไม่มีส่วนเกี่ยวข้อง | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-034 | FR-021 | นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-035 | FR-021 | ปฏิเสธการขอดาวน์โหลดเมื่อไม่มี token งานไม่มีไฟล์ หรือใช้รหัสงานที่ไม่มีในระบบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-036 | FR-022 | คิวรอตรวจแสดงงานตามการมอบหมายของที่ปรึกษาและปฏิเสธนักศึกษาพร้อมตรวจความต่างระหว่าง UI กับ API | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-037 | FR-023 | ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-038 | FR-024 | ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review | PASS | PASS | PASS | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-039 | FR-024 | ปฏิเสธการตรวจงานเมื่อที่ปรึกษาไม่ได้รับมอบหมาย งานไม่รอตรวจ หรือส่งผลตรวจนอกค่าที่รองรับ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-040 | FR-025 | อนุมัติ ปฏิเสธ และส่งงานกลับแก้ไขพร้อมบันทึกคะแนน ความคิดเห็น และแจ้งผู้ส่งกับผู้เขียนร่วม | FAIL | นอก scope | นอก scope | DB approval/notification ผ่าน; dropdown UI ไม่แสดง |
| TC-041 | FR-026 | ผู้ดูแลระบบเปลี่ยนที่ปรึกษาของงานเลข 2 จาก udsanee@webmail.npru.ac.th เป็น wuttha@webmail.npru.ac.th และนักศึกษาเปลี่ยนไม่ได้ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-042 | FR-027 | บันทึกและยกเลิกงานเลข 1 ในรายการโปรดของ 674259009@webmail.npru.ac.th พร้อมตรวจหน้ารายการบันทึก | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-043 | FR-028 | อ่านแจ้งเตือนและทำเครื่องหมายอ่านทีละรายการหรือทั้งหมดเฉพาะของ 674259009@webmail.npru.ac.th โดยไม่แก้ของ 674259003@webmail.npru.ac.th | FAIL | PASS | NOT RUN | ownership/read API ผ่าน; dropdown UI ไม่แสดง |
| TC-044 | FR-029 | เรียก AI ช่วยเขียนทั้งสี่บริการด้วยข้อมูลจริงในชุดทดสอบและปฏิเสธคำขอไม่มี token หรือชนิดข้อมูลผิด | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-045 | FR-030 | ตรวจสิทธิ์ AI สรุปแดชบอร์ดและการแชตสาธารณะค้นงานด้วยคำว่า “การ” เมื่อระบบใช้ text-search fallback | FAIL | นอก scope | นอก scope | insight/RBAC ผ่าน; chat fallback 500 |
| TC-046 | FR-031 | ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-047 | FR-032 | นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-048 | FR-032 | ผู้ดูแลระบบเพิ่ม E2E Selenium Category และบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บพร้อมปฏิเสธ API จัดการของนักศึกษา | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |

ผล/ขั้นตอน/ภาพราย TC เปิดจากรายงานและ JSON ของแต่ละรอบในข้อ 2.1 ตัวอย่าง TC-038 ของ U16 มี 17 UI steps และผล PASS ใช้เวลาราย TC 31.49 วินาที; เวลา UI steps/ราย TC ไม่ใช่ระยะเวลารวมเปิดบริการของ session สำหรับ TC-040/043 ผล N08 เป็น PASS ทั้งสองกรณีหลังแก้ notification แต่ไม่เปลี่ยน FAIL ของ S08 ที่บันทึกไว้

### 2.3.3 ประวัติอื่นที่เกี่ยวข้อง

- [รายงาน Selenium 8 ต.ค.](SELENIUM-TEST-REPORT-2026-10-08.md) มีรายละเอียด S08/N08/A08 และข้อบกพร่องเดิม
- [Brave Docker 8 ต.ค.](BRAVE-TEST-REPORT-2026-10-08.md) ผ่าน 16 UI TC จากชุดที่เลือกในขณะนั้น; อีก 2 เคสถูกจัดเป็น API-only ตามสคริปต์รุ่นเก่า ปัจจุบัน TC-013/046 มี UI แล้ว จึงไม่ใช้เลข 16 เป็น scope ปัจจุบัน
- [Category report 14 ต.ค.](NARONGSAK-SELENIUM-CATEGORY-REPORT-2026-10-14.md) เดิมรวมผลล่าสุดราย TC จากหลาย session; U14 ที่แยกในรายงานฉบับนี้เป็นหลักฐาน 18 PASS ใน session เดียวที่เกิดภายหลัง
- ผล focused U16 เป็นผลเฉพาะ TC-038; ไม่ได้รัน TC-018/045 และไม่ได้ยืนยันว่าข้อผิดพลาดเดิมของสองกรณีนั้นหายแล้ว

## 2.4 บันทึกข้อบกพร่อง (Defect Log)

รหัส AUD ด้านล่างเป็นรหัสติดตามภายในเอกสารฉบับนี้ ไม่ใช่ issue ID จากระบบภายนอก ระดับผลกระทบเป็นการประเมินเพื่อจัดลำดับ ไม่ใช่ severity ที่เจ้าของระบบลงนามแล้ว

| รหัส | อ้างอิง TC | รายละเอียด/วิธีทำซ้ำ | ความรุนแรง | สถานะ | ผู้รับผิดชอบ | Commit/ผล Retest |
|---|---|---|---|---|---|---|
| AUD-01 | TC-018 | เปิด W1 แล้ว GET recommendations ได้ 500/MissingGreenlet | รอผู้รับผิดชอบประเมิน | พบ FAIL S08/C16; รอทวน revision ปัจจุบัน | Developer รอระบุ | ยังไม่มี retest ผ่านของกรณีนี้ใน U22 |
| AUD-02 | TC-040/043 | API มี notification แต่ dropdown เดิมไม่แสดง | รอผู้รับผิดชอบประเมิน | มี focused retest ผ่าน; รอ regression revision ที่รับรอง | Developer/Tester รอระบุ | N08 2/2, U14 TC-043, U22 TC-043; ไม่ใช่ผล TC-040 ใน U22 |
| AUD-03 | TC-045 | POST /ai/chat ข้อความ “การ” history ว่างใน text fallback ได้ 500/MissingGreenlet | รอผู้รับผิดชอบประเมิน | พบ FAIL S08/C16; รอ fix/retest | Developer รอระบุ | ไม่มี retest ใหม่ของ TC-045 ใน U22 |
| TC-027 rollback | TC-027 | PUT ปกใหม่พร้อม PDF signature ผิด; DB path เดิมแต่ bytes ปกเดิมหาย | รอผู้รับผิดชอบประเมิน | พบ FAIL C16; รอ fix/retest | Developer รอระบุ | รอ fix revision และ hash/bytes ก่อน–หลัง |
| AUD-04 | Quality gate; แยกจาก TC | ESLint D04 ไม่ผ่าน 16 errors/8 warnings | รอผู้รับผิดชอบประเมิน | ผลย้อนหลัง; gate ปัจจุบันยังไม่รัน | Developer รอระบุ | ต้องรัน lint/typecheck/tests/build ของ revision ที่รับรอง |

TC-015/032 ใน C16 เป็นปัญหาสคริปต์/fixture และมี focused retest ตามรายงาน R16 จึงไม่รวมเป็น defect ผลิตภัณฑ์ใหม่ ผลรวม 5 FAIL ของ C16 ประกอบด้วย 3 กรณีระบบและ 2 กรณีสคริปต์ ไม่ใช่ defect ระบบ 5 รายการ

ระดับความรุนแรงตามแนว PDF: Critical=ระบบหลักใช้ไม่ได้หรือข้อมูลรั่วอย่างมีนัยสำคัญ, High=workflow/สิทธิ์หลักผิด, Medium=ฟังก์ชันรองผิดมีทางเลี่ยง, Low=ข้อความ/การแสดงผลคลาดเคลื่อน ยังไม่กำหนดระดับของแต่ละ defect จนผู้รับผิดชอบประเมิน

| สรุปข้อบกพร่องผลิตภัณฑ์ที่รอ retest จาก C16 | Critical | High | Medium | Low | ยังไม่จัดระดับ | รวม |
|---|---|---|---|---|---:|---:|
| TC-018/027/045 | รอประเมิน | รอประเมิน | รอประเมิน | รอประเมิน | 3 | 3 |

### 2.4.1 ข้อสังเกตจากโค้ด นโยบาย และการยืนยันเพิ่มเติม

| ประเด็น | สิ่งที่โค้ด/หลักฐานบ่งชี้ | วิธีตรวจและผู้ตัดสิน |
|---|---|---|
| Public pending/static | รายละเอียด pending และไฟล์ static เปิดตรงได้; static ไม่เพิ่ม download_count | TC-018/034 และเจ้าของนโยบายการเผยแพร่ |
| Admin/queue visibility | admin layout ตรวจ session; advisor UI queue ใช้ search ที่กว้างกว่า pending API | TC-036/048 ตรวจ UI/API แล้วให้เจ้าของระบบตัดสิน |
| Update rollback กับไฟล์เดิม | service อาจลบ cover เดิมก่อน document ใหม่ตรวจผ่าน; DB rollback ไม่คืน bytes อัตโนมัติ | C16 reproduce แล้ว: DB เก็บ path เดิมแต่ไฟล์ปกเดิมหาย เป็น FAIL ใหม่ตาม [รายงานปรับสคริปต์](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md) |
| Revision cleanup | ลบแถว file_revisions แต่ service ลบเฉพาะไฟล์ cover/document ปัจจุบัน | TC-032 ตรวจ orphan files; ต้องกำหนด retention/cleanup policy |
| Schema/validation | suggest-titles/keywords รับ {} ได้; score review ไม่จำกัด 0–100 ใน schema | แก้ expectation ตาม schema และกำหนด requirement เพิ่มหากต้องการบังคับ |

ปัญหา locator, intermediate redirect และการเปรียบเทียบ comma spacing ใน category report เป็นการแก้ชุดทดสอบตามหลักฐานเดิม ต้องแยกจาก defect ระบบ การรัน BLOCKED เพราะ sandbox เปิด port ไม่ได้เป็น environment limitation ไม่ใช่ข้อบกพร่องแอป

## 2.5 การวิเคราะห์ผลและข้อสังเกต

แผนมี TC เชื่อมครบ **32/32 FR**; S08 execute ครบ 48 TC และแตะทุก FR แต่ FR-011, FR-025, FR-028, FR-030 มี TC FAIL ใน baseline จึงไม่เรียกว่าทุก FR ผ่าน ผล N08 ยืนยันการแก้ notification เฉพาะ working tree นั้น ส่วน U14 ทดสอบ 18 TC ครอบคลุม **17 FR** โดย FR-024 มี TC-038 และ FR-032 มี TC-047/048; subset ไม่ครอบคลุม FR ทั้งหมด

SQLite functional evidence ไม่รับรอง PostgreSQL FK/transaction semantics, pgvector operator หรือ vector retrieval จริง; deterministic mock ไม่รับรองคุณภาพ/latency/cost ของ live AI หนึ่ง browser/version ไม่รับรองทุก browser/mobile และ test coverage เป็น case-level ไม่ใช่ line/branch coverage ของ source

ฉบับทบทวนเพิ่ม boundary L−1, rejected/needs_revision outcomes, การอ่านทั้งหมดที่มีแจ้งเตือนของตนมากกว่าหนึ่งรายการ, file rollback และ checks อื่นใน TC เดิม จึงห้ามใช้ PASS เก่ารับรอง assertions ใหม่โดยไม่มี mapping และผลรันใหม่

## 2.6 การประเมินตามเกณฑ์สิ้นสุดการทดสอบ

| เกณฑ์ฉบับทบทวน | ผลประเมิน | เหตุผล |
|---|---|---|
| Execute 48/48 พร้อม subcase ฉบับนี้ | ยังไม่ผ่าน | C16 รัน assertions 48 TC แล้ว (43 PASS/5 FAIL); focused retests แยกและยังไม่ยืนยันทุกขั้นตอน manual |
| Priority สูง 31 TC ผ่านและจัดการ defect | ยังยืนยันไม่ได้ | baseline มี FAIL และยังไม่มี regression ครบฉบับนี้ |
| ทุก FR มีแผน/หลักฐาน | แผนครบ; หลักฐานรับรองยังไม่ครบ | 32/32 มีแผน แต่ TC-018/045 และเงื่อนไขเพิ่มยังไม่ยืนยันผ่าน |
| Quality gates ของ revision ที่รับรอง | ยังไม่ยืนยัน | มีผลเก่าบาง gate ไม่ผ่าน; ไม่ได้รัน gates ปัจจุบัน |
| PostgreSQL/pgvector integration | ยังไม่ครบ | มีเพียง smoke D04; Selenium เป็น SQLite |
| ผู้ทบทวน/ผู้อนุมัติรับรอง | ยังไม่ดำเนินการ | ไม่มีการลงนามในหลักฐาน |

## 2.7 ข้อสรุปและคำแนะนำ (Conclusion & Recommendation)

**ผลการตัดสิน:** ☐ ยอมรับระบบ ☐ ยอมรับแบบมีเงื่อนไข ☐ ไม่ยอมรับ ☑ ยังไม่ตัดสินรับรองครบระบบ

**ยังไม่รับรองระบบครบ 48 TC ตามเกณฑ์ฉบับปรับปรุง** มีผลรันข้อมูล CSV/migration ใหม่และแก้สคริปต์ที่ไม่ตรง UI แล้ว แต่ยังมีข้อผิดพลาดระบบ TC-018/027/045 และต้องทวนเงื่อนไขที่ไม่ได้ assert รวมถึง integration ตามแผน

1. จัด run manifest และกำหนดผู้ทบทวน/ผู้อนุมัติ scope/นโยบาย pending URL, static files และ queue
2. รันทดสอบ TC-018/045 เพื่อยืนยันสถานะปัจจุบัน พร้อมแก้และ retest เมื่อยังผิด
3. รันเงื่อนไขฉบับปรับปรุง โดยเน้นไฟล์ rollback, revision cleanup, boundary, ผลตรวจทั้งสามสถานะ และ notification isolation
4. รันครบ 48 unique TC, PostgreSQL/pgvector integration และ backend/frontend gates บน revision เดียวกัน
5. แนบ defect disposition/หลักฐาน retest แล้วประเมิน exit criteria และลงนาม

## 2.8 การลงนามรับรองผลการทดสอบ

| บทบาท | ชื่อ–นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้จัดทำฉบับปรับปรุง | Codex | ทบทวน PDF และหลักฐานเดิม; ไม่ได้ execute ใหม่ | 22 ตุลาคม 2026 |
| ผู้ทดสอบ (Tester) | รอระบุ | แนบ run ID/commit/ผลจริงแล้วลงนาม | รอบันทึก |
| หัวหน้าทีมทดสอบ (Test Manager) | รอระบุ | รอทบทวนผลและ exit criteria | รอบันทึก |
| ผู้พัฒนา (Developer) | รอระบุ | รอ fix/retest disposition | รอบันทึก |
| ผู้อนุมัติ (Approver) | รอระบุ | ยังไม่รับรองครบระบบ | รอบันทึก |

ตารางลงนามของ PDF ไม่ใช่การลงนามของรอบ C16/U22 หรือของเอกสารฉบับปรับปรุงนี้

## 2.9 หลักฐานรอบวันที่ 22 ตุลาคม 2026

### 2.9.1 สภาพแวดล้อมและการตีความ

แหล่งหลักคือ `ui-results.json` ของแต่ละ session ซึ่งมี metadata, steps, actual_result และ screenshot paths ประกอบรายงาน Markdown เวลาในตารางเป็นเวลา generated_at UTC (+7 ชั่วโมงเมื่ออ่านเป็นเวลาไทย) ชื่อ directory เป็น run ID ไม่ใช้แทนเวลาเสร็จสิ้นที่ JSON ระบุ

ทั้งสี่ sessions ระบุ commit `d5be60d7f87da841f7e03c37746c278287474a46` รวม working tree, macOS 27.0.1 arm64, Chrome headed, disposable SQLite, deterministic AI mock/text retrieval fallback รอบล่าสุดบันทึก browser ของ TC-038 เป็น Chrome 155.0.8059.82 ฐานโค้ดที่ทบทวนเอกสารครั้งนี้คือ `1c03db6ab4a6c44d7144e5a90e4a901709eefafa` จึงไม่ย้ายผลเก่าไปอ้างเป็นผลของ revision ปัจจุบัน

### 2.9.2 ผลแยกแต่ละ session

ขอบเขตรายงานแต่ละรอบเท่ากับ 18 TC มี BLOCKED=0 และ SKIPPED=0 ตามสถานะใน JSON อีก 30 TC อยู่นอก subset จึงไม่ใช้เป็น denominator ของ UI coverage นี้

| Run ID / JSON | Generated at UTC | TC ที่ execute | PASS | FAIL | NOT RUN | Executed/18 | Pass rate |
|---|---|---|---:|---:|---:|---:|---:|
| [20261022-064141-954577](../../tests/selenium/reports/20261022-064141-954577/ui-results.json) | 2026-10-22T06:42:15.199799+00:00 | TC-038 | 1 | 0 | 17 | 1/18 (5.56%) | 100.00% |
| [20261022-064234-203272](../../tests/selenium/reports/20261022-064234-203272/ui-results.json) | 2026-10-22T06:42:48.463757+00:00 | TC-043 | 1 | 0 | 17 | 1/18 (5.56%) | 100.00% |
| [20261022-072725-036023](../../tests/selenium/reports/20261022-072725-036023/ui-results.json) | 2026-10-22T07:28:46.184447+00:00 | ไม่มี | 0 | 0 | 18 | 0/18 (0.00%) | N/A |
| [20261022-072848-245348](../../tests/selenium/reports/20261022-072848-245348/ui-results.json) | 2026-10-22T07:29:18.830938+00:00 | TC-038 | 1 | 0 | 17 | 1/18 (5.56%) | 100.00% |

รอบ 072725 มี exit_code=0 แต่ไม่มี browser execution, 18 NOT RUN และ coverage=0% หลักฐานนี้ไม่รองรับข้อสรุป “ทดสอบผ่าน” และยังไม่ทราบสาเหตุการไม่ execute จากสรุปเพียงอย่างเดียว รอบ 064141 กับ 072848 ทวน TC-038 ซ้ำ ไม่เพิ่มจำนวน unique TC; ผล TC-043 ในรอบ 064234 เป็นอีก session จึงไม่รวมเป็นชุด 2 PASS ของรอบล่าสุด

### 2.9.3 สิ่งที่หลักฐานยืนยันและยังไม่ยืนยัน

| กรณี | ผลที่ยืนยันได้ | ขอบเขตจำกัด |
|---|---|---|
| TC-038 รอบล่าสุด | 17 UI steps ผ่าน: login D1, เปิดงาน W2, เลือก approved, ใส่คะแนน/ความเห็น, ยืนยัน dialog, เปิดรายละเอียดแล้วเห็นอนุมัติ; `assert_review` ตรวจ reviewer=5/score=80/comment ตรง | ไม่ใช่ผลครบทุก status/role; ไม่รับรอง TC-039/040/047 หรือ PostgreSQL |
| TC-043 รอบ 064234 | สถานะ passed และมี browser execution ตาม JSON; ดู [รายงานขั้นตอน](../../tests/selenium/reports/20261022-064234-203272/UI-TEST-EXECUTION.md) | ไม่ใช่ regression ของ TC-040 และไม่ใช่ PASS ในรอบ 072848 |
| อีก 17 TC ในรอบล่าสุด | NOT RUN ตาม JSON | ผลเก่ายังเป็นประวัติ; ไม่เติมเป็น PASS ของรอบล่าสุด |
| TC-018/027/045 | ไม่มี execution ใหม่ของทั้งสามในสี่ sessions ที่ตรวจ | ยังคงผล FAIL ของ C16 และรอทวน revision ปัจจุบัน |
| Manual/quality gates/live services | ไม่มีผลใหม่จากงานแก้เอกสารนี้ | ไม่อ้างว่าผ่านการรับรองหรือมีผู้ลงนามแล้ว |

รายงาน UI ล่าสุด: [20261022-072848-245348](../../tests/selenium/reports/20261022-072848-245348/UI-TEST-EXECUTION.md) รูปและผล JSON เป็นหลักฐานของ assertions ที่รันจริง การประเมิน Exit Criteria ในข้อ 2.6 จึงยังคง “ไม่รับรองครบระบบ”

## 2.10 แผนติดตามข้อผิดพลาดและเกณฑ์ปิดงาน

| รายการ / ลำดับ | ทำซ้ำและหลักฐานที่ต้องเพิ่ม | เกณฑ์ปิด | ผู้รับผิดชอบ / สถานะ |
|---|---|---|---|
| TC-027 / เร่งด่วน: ไฟล์เดิมสูญหาย | สร้างงานมีปก/PDF ถูกต้อง; เก็บ path/hash; PUT ปกใหม่พร้อม PDF signature ผิด; เทียบ DB และ bytes | ตอบปฏิเสธตาม contract โดยไฟล์เก่าคงอยู่ครบ ไม่มี orphan; รันทวน TC-026/029/031 ประกอบ | Developer รอระบุ; พบ FAIL C16 รอ fix/retest |
| AUD-01 / TC-018 | เปิด W1 แล้ว GET recommendations; เก็บ traceback MissingGreenlet และ IDs ที่คืน | 200, เฉพาะ approved, ไม่รวมงานปัจจุบัน; ยอดดู/log ถูกต้อง; ทวน detail/search | Developer รอระบุ; ไม่ปิดด้วยผล TC-038 |
| AUD-03 / TC-045 | POST /ai/chat ด้วยข้อความ “การ” history ว่างและ text fallback; เก็บ request/response/log | 200 และโครงสร้างคำตอบ/อ้างอิงตรง contract; ทวน dashboard RBAC และ vector branch แยก | Developer รอระบุ; ไม่มี retest ใหม่ใน U22 |
| AUD-02 / Notification | เก็บ fix revision แล้วรัน TC-040/043 ใน revision ที่จะรับรอง | recipient/read flags ถูกต้องทั้งผู้ส่ง/co-author และไม่แก้แจ้งเตือนผู้อื่น | มี TC-043 ผ่าน 22 ต.ค.; ยังต้องทวน TC-040 |
| AUD-04 / Quality gates | รัน lint/typecheck/unit/build ตาม configuration ของ revision ปัจจุบัน | ทุก gate ที่ใช้รับรองมี command/exit/log; หากยกเว้นต้องมีผู้รับผิดชอบและเหตุผล | ยังไม่มีผลใหม่ในงานนี้ |
| Integration และ policy | ทวน PostgreSQL/FK/transaction/pgvector, pending/static visibility, advisor queue และ admin guard | มี expected policy ที่ผู้รับผิดชอบยืนยันและหลักฐาน environment ที่ตรง | รอระบุ owner และรอบทดสอบ |

เกณฑ์ retest ต้องตรงจุดที่เคยล้มเหลว หากปรับสคริปต์เพราะ expectation ผิดให้บันทึกเหตุผลและเก็บผลเดิมไว้ ห้ามลด assertion เพื่อปิด defect การปิดแต่ละรายการต้องแนบ fix revision, run ID, expected/actual และผู้ทบทวน โดยไม่รวมผลคนละ session เป็น full regression หนึ่งรอบ

เมื่อ focused retest ผ่าน ให้รัน full 48 TC ของ revision เดียวกันตามข้อ 1.11 แล้วประเมินเกณฑ์เดิมในข้อ 1.4/2.6 ใหม่ ปัจจุบันยังไม่มีหลักฐานเพียงพอรับรองครบทุก subcase หรืออนุมัติใช้งานจากการปรับเอกสารนี้
