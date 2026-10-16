# รายงานการรันทดสอบ UI — Narongsak

เวลารัน UTC: 2026-10-16T12:39:41.397591+00:00
โหมด: **headless**; Browser: chrome; commit: `16490e54bd66bb12e0affb3ea16ac1a9bc1b3f57` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 18
- UI-automatable: 18
- รัน browser tests: 0
- PASS: 0; FAIL: 0; BLOCKED: 4
- API-only Test Cases: 0
- UI automation coverage ใน session นี้: 0.0%

Coverage หมายถึงจำนวนเคสที่รันขั้นตอน UI จริง ไม่ใช่การยืนยันว่าทุก invariant ตรวจได้ผ่าน UI อย่างเดียว ความสัมพันธ์ในฐานข้อมูล การเก็บ revision สิทธิ์ API และ counters มี assertions เสริมแยกจาก browser evidence ทั้งสี่ AI endpoints มี UI จึงไม่มี API-only case ใน 18 เคสนี้

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | No | BLOCKED |  / [error log](../../artifacts/20261016-123941-208271/errors.log) |
| TC-004 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-007 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-010 | CATEGORY | No | NOT RUN | ยังไม่มี browser evidence |
| TC-013 | USER | No | NOT RUN | ยังไม่มี browser evidence |
| TC-016 | RECOMMENDATION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-019 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-022 | SUBMISSION | No | BLOCKED |  / [error log](../../artifacts/20261016-123941-208271/errors.log) |
| TC-025 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-028 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-031 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-034 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-037 | REVIEW | No | NOT RUN | ยังไม่มี browser evidence |
| TC-038 | REVIEW | No | BLOCKED |  / [error log](../../artifacts/20261016-123941-208271/errors.log) |
| TC-043 | NOTIFICATION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-046 | AI | No | NOT RUN | ยังไม่มี browser evidence |
| TC-047 | E2E | No | BLOCKED |  / [error log](../../artifacts/20261016-123941-208271/errors.log) |
| TC-048 | E2E | No | NOT RUN | ยังไม่มี browser evidence |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](ui-results.json)

### TC-001 — สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.001 วินาที
ผลที่คาดหวัง: สมัครสำเร็จโดยได้สิทธิ์ student แม้ส่ง role admin
ผลจริง: setup/cleanup ล้มเหลว (BLOCKED)


ข้อผิดพลาด: [Errno 1] Operation not permitted

### TC-004 — ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: แสดงข้อผิดพลาดและไม่สร้าง session
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-007 — ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-010 — ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-013 — นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-016 — คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: คำแนะนำไม่เผยข้อมูล pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-019 — แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: แสดงไม่พบงานวิจัยและ API ตอบ 404
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-022 — นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.0 วินาที
ผลที่คาดหวัง: บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending
ผลจริง: setup/cleanup ล้มเหลว (BLOCKED)


ข้อผิดพลาด: [Errno 1] Operation not permitted

### TC-025 — ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-028 — รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-031 — ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-034 — นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-037 — ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-038 — ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.0 วินาที
ผลที่คาดหวัง: ที่ปรึกษาที่ได้รับมอบหมายอนุมัติและบันทึกผลสำเร็จ
ผลจริง: setup/cleanup ล้มเหลว (BLOCKED)


ข้อผิดพลาด: [Errno 1] Operation not permitted

### TC-043 — อ่านแจ้งเตือนและทำเครื่องหมายอ่านทีละรายการหรือทั้งหมดเฉพาะของ 674259009@webmail.npru.ac.th โดยไม่แก้ของ 674259003@webmail.npru.ac.th

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-046 — ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-047 — นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.0 วินาที
ผลที่คาดหวัง: ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ
ผลจริง: setup/cleanup ล้มเหลว (BLOCKED)


ข้อผิดพลาด: [Errno 1] Operation not permitted

### TC-048 — ผู้ดูแลระบบเพิ่ม E2E Selenium Category และบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บพร้อมปฏิเสธ API จัดการของนักศึกษา

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ
ผลจริง: ไม่ได้รัน (NOT RUN)


ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
