# การตรวจระบบและแผนทดสอบ UniResearch

เอกสารชุดนี้จัดทำจาก Source Code ใน Repository ปัจจุบันและผลรัน Docker วันที่ 4 ตุลาคม 2026 รอบนี้ผ่าน 17 TC ข้าม 31 TC; ดู [หลักฐาน Docker](DOCKER-TEST-EVIDENCE-2026-10-04.md) เอกสารเดิมใน `docs/` ใช้เพียงเป็นรายการตรวจสอบบริบท ไม่ใช้ยืนยันความสามารถแทน Implementation

PDF `SPRS-Test-Cases.docx.pdf` และ `SPRS-Test-Plan-and-Report.docx.pdf` ใช้เป็น **ตัวอย่างระดับรายละเอียดและรูปแบบเอกสารเท่านั้น** ไม่มีการนำ requirement, role, technology, workflow, test data หรือผลการทดสอบจากระบบใน PDF มาใช้กับ UniResearch

## เอกสารทดสอบสองชุด

ชุดอัตโนมัติ Python Selenium สำหรับ TC-001–TC-048 และตัวเลือก `-m narongsak` สำหรับ 18 กรณีที่มอบหมาย อยู่ที่ [tests/selenium](../../tests/selenium/README.md) ผลแต่ละรอบสร้างแยกพร้อม screenshot และหลักฐาน API/DB; ไม่แทนผลย้อนหลังในเอกสาร Word/PDF ชุดนี้ การรันใช้ SQLite ชั่วคราวและ AI test double จึงยังไม่รับรอง PostgreSQL/pgvector หรือ AI provider จริง

ผล Selenium รอบ 8 ตุลาคม 2026: **ผ่าน 44 / ไม่ผ่าน 4**; เฉพาะ Narongsak **ผ่าน 17 / ไม่ผ่าน 1** ดู [รายงานและข้อบกพร่อง](SELENIUM-TEST-REPORT-2026-10-08.md)

| ชุด | เอกสารหลัก | เนื้อหา |
|---|---|---|
| 1. Test Cases | [TEST-CASES.md](TEST-CASES.md) | รายการ 48 TC และรายละเอียดรายกรณี: เงื่อนไขตั้งต้น ข้อมูลทดสอบ ขั้นตอน ผลที่คาดหวัง และช่องบันทึกผลจริง |
| 2. Test Plan and Report | [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md) | ส่วนที่ 1 แผนการทดสอบ; ส่วนที่ 2 รายงานผลและตารางบันทึกผล 48 TC |

เอกสารประกอบ: [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) อธิบายระบบจากโค้ด, [FUNCTIONAL-REQUIREMENTS.md](FUNCTIONAL-REQUIREMENTS.md) ระบุ FR พร้อมหลักฐาน, [TRACEABILITY.md](TRACEABILITY.md) โยง FR–TC ไฟล์ [TEST-PLAN.md](TEST-PLAN.md) และ [TEST-REPORT.md](TEST-REPORT.md) เป็นส่วนแยกของเอกสารชุดที่ 2 เพื่อแก้ไขหรืออ้างอิงเฉพาะส่วนได้

ขอบเขต: `backend/app`, `backend/tests`, `frontend/app`, `frontend/src`, `frontend/tests`, `frontend/e2e`, `docker-compose.yml` และ `.github/workflows/develop-ci.yml` รอบนี้ใช้ Docker กับฐานทดสอบแยก สถานะ “ข้าม” หมายถึงหลักฐานยังไม่ครบตามขั้นตอนของกรณีนั้น ไม่ใช่ผลผ่านหรือไม่ผ่าน

ประเด็นที่ต้องแยกจากข้อเท็จจริง: ชื่อ role `reviewer` ปรากฏใน frontend แต่ backend `require_role` ไม่อนุญาตให้ role นี้ตรวจงาน; หน้า `/admin` ตรวจเพียงว่ามี session แต่ API ผู้ดูแลระบบตรวจ role `admin`; รายละเอียดผลงานและไฟล์ static มีช่องทางสาธารณะตามโค้ดปัจจุบัน ประเด็นเหล่านี้เป็นความเสี่ยงหรือพฤติกรรมที่ต้องยืนยัน ไม่ได้ตั้งเป็นข้อกำหนดสิทธิ์ใหม่
