# เอกสารตรวจระบบและทดสอบ UniResearch

ฉบับทบทวนเนื้อหา **16 ตุลาคม 2026** แก้เฉพาะ Markdown โดยตรวจจาก source code และหลักฐานการรันที่มีอยู่ ไม่ได้รันทดสอบระบบใหม่ และไม่ได้ปรับ Word/PDF

ข้อมูลบัญชีฉบับปัจจุบันเลือกจาก [student.csv](../../backend/app/scripts/student.csv) และ [advisors.csv](../../backend/app/scripts/advisors.csv) โดยระบุชื่อ–อีเมล–รหัสนักศึกษาและแหล่งข้อมูลใน Test Cases ต้องเตรียมสำเนาฐานทดสอบให้ตรงก่อนรัน ผลย้อนหลังยังเป็นข้อมูลของรอบเดิม ไม่ใช่ผลรันด้วยบัญชี CSV

ชื่องานวิจัยและข้อมูลต้นทางตรวจจากสคริปต์ backend ดู [TEST-RESEARCH-DATA.md](TEST-RESEARCH-DATA.md) ซึ่งแยก 4 เรื่องต้นทางออกจากสำเนาที่เตรียมเพิ่มเพื่อทดสอบ

## เอกสารหลัก

| เอกสาร | เนื้อหา |
|---|---|
| [TEST-RESEARCH-DATA.md](TEST-RESEARCH-DATA.md) | ชื่อเต็มภาษาไทย/อังกฤษและข้อมูลต้นทางจาก migration พร้อมขอบเขตสำเนาทดสอบ |
| [TEST-CASES.md](TEST-CASES.md) | 48 TC แบบเดินหน้าเว็บ: บัญชี/รหัสผ่านสำเนา เมนูที่กด ค่าที่กรอก การยืนยัน และผลบนหน้าจอ |
| [TEST-CASES-TECHNICAL-CHECKS.md](TEST-CASES-TECHNICAL-CHECKS.md) | จุดตรวจ API/RBAC/DB/ไฟล์ที่ต้องทำประกอบ ไม่แทนด้วยผล UI |
| [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md) | ฉบับรวมแผนและรายงานผล ใช้เตรียมเอกสารส่งต่อ |
| [TEST-PLAN.md](TEST-PLAN.md) | Scope, strategy, fixture, entry/exit, metrics, risks และเกณฑ์รับรอง |
| [TEST-REPORT.md](TEST-REPORT.md) | ผลแยก session/commit, execution log 48 TC, defect/observation และข้อจำกัด |
| [TRACEABILITY.md](TRACEABILITY.md) | FR-001–032 → TC-001–048; แยก plan coverage ออกจากผล execution |
| [FUNCTIONAL-REQUIREMENTS.md](FUNCTIONAL-REQUIREMENTS.md) | พฤติกรรมจาก implementation พร้อม path อ้างอิง |
| [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) | ภาพรวมระบบประกอบการอ่าน; เป็นบริบทตามฉบับเดิม |
| [TEST-CASES-NARONGSAK.md](TEST-CASES-NARONGSAK.md) | Subset 18 TC ที่มอบหมายให้ Narongsak |

แก้ `TEST-PLAN.md` และ `TEST-REPORT.md` เป็นแหล่งหลัก แล้วประกอบเนื้อหาเดียวกันเข้า `TEST-PLAN-AND-REPORT.md` เสมอ เพื่อป้องกันแผน/รายงานคนละฉบับ

## ผลทดสอบที่ใช้เป็นหลักฐาน

| รอบ | ผลที่ยืนยันได้ | หลักฐาน |
|---|---|---|
| Docker 4 ต.ค. | 17 PASS / 31 ข้าม จาก 48; lint ไม่ผ่าน | [Docker evidence](DOCKER-TEST-EVIDENCE-2026-10-04.md) |
| Selenium baseline 8 ต.ค. | 44 PASS / 4 FAIL จาก 48 | [รายงาน Selenium](SELENIUM-TEST-REPORT-2026-10-08.md) |
| Notification retest 8 ต.ค. | TC-040/043 PASS ทั้งสองหลังแก้ proxy | [รายงาน focused](../../tests/selenium/artifacts/20261008-041822-000844/report.md) |
| UI subset 14 ต.ค. | 18 PASS ใน session เดียว | [U14 UI report](../../tests/selenium/reports/20261014-102745-778362/UI-TEST-EXECUTION.md) |
| UI focused ล่าสุดที่ตรวจพบ 16 ต.ค. | TC-038 PASS; อีก 17 NOT RUN ใน subset | [U16 UI report](../../tests/selenium/reports/20261016-094537-437659/UI-TEST-EXECUTION.md) |
| Specification ฉบับทบทวนนี้ | ยังไม่ได้ execute assertions ที่เพิ่มครบทั้ง 48 TC | [ข้อจำกัดและงานติดตาม](TEST-REPORT.md) |

ผลต่าง session/commit ไม่รวมเป็นผลรันเดียว U14 ที่ผ่าน 18/18 ไม่ได้รับรอง TC ที่เหลืออีก 30 ข้อ U16 ที่ NOT RUN ไม่ได้ลบ PASS ย้อนหลัง แต่ก็ไม่ใช้ PASS เก่าแทนผล session ใหม่ ผล SQLite และ AI test double ไม่รับรอง PostgreSQL/pgvector หรือ live AI

ผลย้อนหลังเพิ่มเติม: [Brave Docker](BRAVE-TEST-REPORT-2026-10-08.md) และ [Category report 14 ต.ค.](NARONGSAK-SELENIUM-CATEGORY-REPORT-2026-10-14.md) เป็น scope และสคริปต์ ณ รอบนั้น ไม่ใช่ผลล่าสุดครบระบบ

## การรันและความหมายของ coverage

ดู [Selenium README](../../tests/selenium/README.md) ค่าเริ่มต้นปัจจุบันเลือก 18 TC ของ Narongsak ส่วนอีก 30 TC อยู่ใน legacy suite ต้องเลือกและตรวจ collection ให้ชัด ก่อนรายงานว่าครบ 48 unique TC ทุก session เก็บ screenshots, sanitized API/DB evidence และ JSON แยก directory; artifacts บางส่วนไม่ติดตาม Git ให้แนบเมื่อต้องส่งทบทวน

Coverage 32/32 FR ใน Traceability หมายถึงมี TC ตามแผน ไม่ใช่ทุก FR ผ่าน หรือทุก branch ถูก execute พฤติกรรมที่ต้องยืนยันนโยบาย เช่น pending URL/static สาธารณะ, advisor queue และ admin route guard ระบุในแผนแยกจาก defect ที่เกิด assertion failure

รูปแบบ SPRS ใช้เป็นแนวทางโครงสร้างเอกสารเท่านั้น ไม่ใช้ requirement/role/workflow หรือผลการทดสอบของ SPRS แทน UniResearch
