# เอกสารตรวจระบบและทดสอบ UniResearch

ฉบับทบทวนเนื้อหา **22 ตุลาคม 2026** อ่าน PDF ต้นแบบทั้งสองและจัด Markdown ให้ใช้ปก/หัวข้อ/ตารางตามต้นแบบ พร้อมทบทวนหลักฐาน Selenium ที่มีอยู่ โดยเพิ่มจุดตรวจ/การคืนสภาพครบ 48 TC และผล focused sessions วันที่ 22 ตุลาคม สคริปต์ใช้ข้อมูล CSV/migration ตามงานวันที่ 16 ตุลาคม งานปรับเอกสารครั้งนี้ไม่ได้ execute ระบบเพิ่มและไม่ได้ปรับ Word/PDF

ข้อมูลบัญชีฉบับปัจจุบันเลือกจาก [student.csv](../../backend/app/scripts/student.csv) และ [advisors.csv](../../backend/app/scripts/advisors.csv) โดยระบุชื่อ–อีเมล–รหัสนักศึกษาและแหล่งข้อมูลใน Test Cases ต้องเตรียมสำเนาฐานทดสอบให้ตรงก่อนรัน ผลย้อนหลังยังเป็นข้อมูลของรอบเดิม ไม่ใช่ผลรันด้วยบัญชี CSV

ชื่องานวิจัยและข้อมูลต้นทางตรวจจากสคริปต์ backend ดู [TEST-RESEARCH-DATA.md](TEST-RESEARCH-DATA.md) ซึ่งแยก 4 เรื่องต้นทางออกจากสำเนาที่เตรียมเพิ่มเพื่อทดสอบ

## เอกสารหลัก

| เอกสาร | เนื้อหา |
|---|---|
| [SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md) | รายการปรับสคริปต์ ผล full suite/retest และข้อผิดพลาดที่พบ |
| [TEST-RESEARCH-DATA.md](TEST-RESEARCH-DATA.md) | ชื่อเต็มภาษาไทย/อังกฤษและข้อมูลต้นทางจาก migration พร้อมขอบเขตสำเนาทดสอบ |
| [TEST-CASES.md](TEST-CASES.md) | 48 TC: ขั้นตอน UI/จุดตรวจเสริม หลักฐานปิดกรณี การคืนสภาพ และลิงก์สคริปต์ราย TC |
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
| UI focused ก่อนปรับสคริปต์ 16 ต.ค. | TC-038 PASS; อีก 17 NOT RUN ใน subset | [U16 UI report](../../tests/selenium/reports/20261016-094537-437659/UI-TEST-EXECUTION.md) |
| UI focused 22 ต.ค. | 4 sessions แยก; TC-038 PASS สองรอบ, TC-043 PASS หนึ่งรอบ, อีกหนึ่งรอบไม่ execute; ล่าสุด 1 PASS/17 NOT RUN ใน subset 18 | [รายงานข้อ 2.9](TEST-REPORT.md#29-หลักฐานรอบวันที่-22-ตุลาคม-2026) |
| CSV/migration 16 ต.ค. | C16 43 PASS/5 FAIL; focused retests แยก; ระบบยังมีข้อผิดพลาด TC-018/027/045 | [ผลปรับสคริปต์](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md) |

ผลต่าง session/commit ไม่รวมเป็นผลรันเดียว U14 ที่ผ่าน 18/18 ไม่ได้รับรอง TC ที่เหลืออีก 30 ข้อ U16 ที่ NOT RUN ไม่ได้ลบ PASS ย้อนหลัง แต่ก็ไม่ใช้ PASS เก่าแทนผล session ใหม่ ผล SQLite และ AI test double ไม่รับรอง PostgreSQL/pgvector หรือ live AI

ผลย้อนหลังเพิ่มเติม: [Brave Docker](BRAVE-TEST-REPORT-2026-10-08.md) และ [Category report 14 ต.ค.](NARONGSAK-SELENIUM-CATEGORY-REPORT-2026-10-14.md) เป็น scope และสคริปต์ ณ รอบนั้น ไม่ใช่ผลล่าสุดครบระบบ

## การรันและความหมายของ coverage

ดู [Selenium README](../../tests/selenium/README.md) ค่าเริ่มต้นปัจจุบันเลือก 18 TC ของ Narongsak ใช้ `--all-cases` เพื่อเลือกครบทั้ง 48 (`--include-legacy` เป็นชื่อทางเลือก) และตรวจ collection ให้ชัด ก่อนรายงานว่าครบ 48 unique TC ทุก session เก็บ screenshots, sanitized API/DB evidence และ JSON แยก directory; artifacts บางส่วนไม่ติดตาม Git ให้แนบเมื่อต้องส่งทบทวน

Coverage 32/32 FR ใน Traceability หมายถึงมี TC ตามแผน ไม่ใช่ทุก FR ผ่าน หรือทุก branch ถูก execute พฤติกรรมที่ต้องยืนยันนโยบาย เช่น pending URL/static สาธารณะ, advisor queue และ admin route guard ระบุในแผนแยกจาก defect ที่เกิด assertion failure

รูปแบบ SPRS ใช้เป็นแนวทางโครงสร้างเอกสารเท่านั้น ไม่ใช้ requirement/role/workflow หรือผลการทดสอบของ SPRS แทน UniResearch


## รูปแบบเอกสารตาม PDF ต้นแบบ

Test Cases ใช้ [uniresearch-test-cases.pdf](uniresearch-test-cases.pdf) เป็นรูปแบบ: บทนำ 1.1–1.4, ตารางรายละเอียด TC-001–048 แบ่งหมวด 2.1–2.9 และสรุป/ลงนามข้อ 3 โดยทุกกรณีใช้ตารางเดียว 4 คอลัมน์ตามภาพตัวอย่าง มี Precondition, Steps, Data, Expected, Actual และแถวสุดท้ายเป็น Status คู่กับ Tester/Date; ช่องผลจริงระบุ session ที่ execute กรณีนั้นจริง ไม่ย้ายผล NOT RUN หรือผลเก่ามารวมเป็นรอบเดียว

แผนและรายงานใช้ [uniresearch-test-pland-and-report.pdf](uniresearch-test-pland-and-report.pdf) เป็นต้นแบบ: ข้อมูลเอกสาร UR-TPR-001, Revision History, References, แผน 1.1–1.10, รายงาน 2.1–2.8 และตาราง execution/defect/sign-off; หัวข้อขยายต่อท้ายเก็บ runbook และหลักฐานล่าสุด การปรับรูปแบบ Markdown ไม่ได้เปลี่ยน PDF หรือถ่ายโอนลายเซ็นต้นฉบับมาอนุมัติฉบับใหม่
