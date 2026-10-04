# การตรวจระบบและแผนทดสอบ UniResearch

เอกสารชุดนี้จัดทำจาก Source Code ใน Repository ปัจจุบัน ณ วันที่ 4 ตุลาคม 2026 โดยถือโค้ดที่ทำงานจริงเป็นหลัก เอกสารเดิมใน `docs/` ใช้เพียงเป็นรายการตรวจสอบบริบท ไม่ใช้ยืนยันความสามารถแทน Implementation

PDF `SPRS-Test-Cases.docx.pdf` และ `SPRS-Test-Plan-and-Report.docx.pdf` ใช้เป็น **ตัวอย่างระดับรายละเอียดและรูปแบบเอกสารเท่านั้น** ไม่มีการนำ requirement, role, technology, workflow, test data หรือผลการทดสอบจากระบบใน PDF มาใช้กับ UniResearch

## เอกสารทดสอบสองชุด

| ชุด | เอกสารหลัก | เนื้อหา |
|---|---|---|
| 1. Test Cases | [TEST-CASES.md](TEST-CASES.md) | รายการ 48 TC และรายละเอียดรายกรณี: เงื่อนไขตั้งต้น ข้อมูลทดสอบ ขั้นตอน ผลที่คาดหวัง และช่องบันทึกผลจริง |
| 2. Test Plan and Report | [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md) | ส่วนที่ 1 แผนการทดสอบ; ส่วนที่ 2 รายงานผลและตารางบันทึกผล 48 TC |

เอกสารประกอบ: [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) อธิบายระบบจากโค้ด, [FUNCTIONAL-REQUIREMENTS.md](FUNCTIONAL-REQUIREMENTS.md) ระบุ FR พร้อมหลักฐาน, [TRACEABILITY.md](TRACEABILITY.md) โยง FR–TC ไฟล์ [TEST-PLAN.md](TEST-PLAN.md) และ [TEST-REPORT.md](TEST-REPORT.md) เป็นส่วนแยกของเอกสารชุดที่ 2 เพื่อแก้ไขหรืออ้างอิงเฉพาะส่วนได้

ขอบเขต: `backend/app`, `backend/tests`, `frontend/app`, `frontend/src`, `frontend/tests`, `frontend/e2e`, `docker-compose.yml` และ `.github/workflows/develop-ci.yml` ไม่ตรวจไฟล์สร้างอัตโนมัติหรือ dependency ที่ติดตั้งไว้ ข้อความ `Not Tested` หมายถึงยังไม่ได้ดำเนินกรณีทดสอบตามเอกสารนี้ ไม่ใช่ผลผ่านหรือไม่ผ่าน

ประเด็นที่ต้องแยกจากข้อเท็จจริง: ชื่อ role `reviewer` ปรากฏใน frontend แต่ backend `require_role` ไม่อนุญาตให้ role นี้ตรวจงาน; หน้า `/admin` ตรวจเพียงว่ามี session แต่ API ผู้ดูแลระบบตรวจ role `admin`; รายละเอียดผลงานและไฟล์ static มีช่องทางสาธารณะตามโค้ดปัจจุบัน ประเด็นเหล่านี้เป็นความเสี่ยงหรือพฤติกรรมที่ต้องยืนยัน ไม่ได้ตั้งเป็นข้อกำหนดสิทธิ์ใหม่
