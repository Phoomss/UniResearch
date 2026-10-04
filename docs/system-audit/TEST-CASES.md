# เอกสารกรณีทดสอบ (Test Case Specification)

## การทดสอบแบบ E2E และ API/Integration

ระบบ UniResearch — คลังและกระบวนการจัดการผลงานวิจัย

ใช้คู่กับ [FUNCTIONAL-REQUIREMENTS.md](FUNCTIONAL-REQUIREMENTS.md), [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) และ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md)

วันที่จัดทำ: 4 ตุลาคม 2026 · สถานะเอกสาร: ฉบับร่าง · ผลทดสอบทุกกรณี: Not Tested

## 1. บทนำ

เอกสารนี้ระบุ 48 กรณีสำหรับ UniResearch จาก Implementation ใน Repository ปัจจุบัน แต่ละกรณีโยง FR และระบุเงื่อนไขตั้งต้น ขั้นตอน ข้อมูลทดสอบ ผลที่คาดหวัง และช่องบันทึกผลจริง กรณีที่ไม่มีหน้าจอรองรับใช้ API/Integration โดยตรง จึงไม่เรียกทุกกรณีว่า E2E

ตัวอย่าง SPRS ใช้เป็นแนวทางรูปแบบเท่านั้น UniResearch ไม่มี workflow draft → submitted, role committee, การประเมินสี่ด้าน, ตาราง activity_logs, แท็กหรือรูปโปรไฟล์ตามตัวอย่าง ส่วนที่โค้ดรองรับจริงคือการสร้างผลงาน pending และการตรวจด้วย approved/rejected/needs_revision

### 1.1 สภาพแวดล้อมการทดสอบ

| รายการ | รายละเอียดจาก Repository |
|---|---|
| แอปพลิเคชัน | Next.js 16.2.12 / React 19.2.4 และ FastAPI; ดู package.json และ requirements.txt |
| ฐานข้อมูล | PostgreSQL image pgvector/pgvector:pg15; ต้องใช้ฐานทดสอบแยก |
| การเตรียมระบบ | docker compose up --build ตาม docker-compose.yml; backend ใช้ Base.metadata.create_all เมื่อเริ่ม |
| URL ค่าเริ่มต้น | Frontend localhost:3000, backend localhost:8000, DB host port 5433; ตรวจค่าจริงก่อนรัน |
| บัญชีทดสอบ | A1 admin, S1/S2/S3 student, D1/D2 advisor, G1 guest, U2 inactive; สร้างเฉพาะในฐานทดสอบและเก็บรหัสผ่านแยก |
| Browser | เวอร์ชัน/ชนิดที่ใช้จริง: TBD; Playwright config ใช้ baseURL 127.0.0.1:3000 หากไม่ override |
| AI | ใช้ test double สำหรับ functional; ผล provider จริงไม่กำหนดเป็นข้อความตายตัว |

### 1.2 เกณฑ์การผ่าน

กรณีผ่านเมื่อผลจริงตรงทุกข้อที่คาดหวัง และมีหลักฐานตรวจซ้ำได้ กรณีเชิงลบต้องส่งคำขอตรงถึง API และตรวจว่าไม่มีการเปลี่ยนข้อมูลที่ไม่ควรเปลี่ยน สำหรับหน้าที่มี UI ให้ตรวจ UI/redirect เพิ่มด้วย หาก UI กับ API ให้สิทธิ์ต่างกัน ให้บันทึกตามผลจริงและเปิด defect/ข้อสงสัย ไม่สรุปว่า Passed จากการอ่านโค้ด

### 1.3 ข้อมูลทดสอบร่วม

| รหัส | เงื่อนไข |
|---|---|
| A1/S1/S2/S3/D1/D2/G1/U2 | ผู้ใช้ตาม role; U2 inactive; S1/S2 มี prefix student_id เดียวกัน, S3 ต่าง prefix |
| C1/C2 | หมวดหมู่สองรายการชื่อไม่ซ้ำ |
| W1/W4 | ผลงาน approved ต่าง category/keywords/view_count; W1 มี PDF valid |
| W2 | งานของ S1 มอบ D1 เป็น advisor; เริ่ม pending ยกเว้นกรณี revision ที่กำหนด needs_revision |
| W3/W5 | W3 เป็นงานของ S2 ที่ S1 ไม่เกี่ยว; W5 ไม่มี file_path |
| N1/N2 | แจ้งเตือนของ S1/S2 ตามลำดับ |

Fixture แต่ละกรณีต้อง reset ก่อนใช้ โดยเฉพาะกรณีเปลี่ยนสถานะ/ลบงาน เก็บ email, ID, รหัสผ่าน และ token จริงในระบบทดสอบแยกจากเอกสารนี้ ห้ามคัดลอกค่าลับลงผลทดสอบ

### 1.4 สรุปรายการกรณีทดสอบ

| รหัส | ชื่อกรณีทดสอบ | กลุ่มฟังก์ชัน | FR | ความสำคัญ | ประเภท |
|---|---|---|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | บัญชี | FR-001 | สูง | Positive / Web/API |
| TC-002 | สมัคร email ซ้ำ | บัญชี | FR-001 | สูง | Negative / API |
| TC-003 | ล็อกอินข้อมูลถูก | บัญชี | FR-002 | สูง | Positive / Web/API |
| TC-004 | รหัสผ่านผิด | บัญชี | FR-002 | สูง | Negative / Web/API |
| TC-005 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | บัญชี | FR-003 | สูง | Positive / Web/API |
| TC-006 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | บัญชี | FR-003 | สูง | Negative / API |
| TC-007 | ล็อกอินแล้วออกจากระบบ | เว็บบัญชี | FR-004 | สูง | Positive / Web/API |
| TC-008 | admin CRUD ผู้ใช้ | ผู้ใช้ | FR-005 | สูง | Positive / Web/API |
| TC-009 | student เรียก API จัดการผู้ใช้ | ผู้ใช้ | FR-005 | สูง | Negative / API/RBAC |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | หมวดหมู่ | FR-006 | กลาง | Positive / Web/API |
| TC-011 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | หมวดหมู่ | FR-006 | สูง | Negative / API/RBAC |
| TC-012 | admin แทนรายการตัวเลือก | ตัวเลือก | FR-007 | กลาง | Positive / Web/API |
| TC-013 | student เปลี่ยนตัวเลือก | ตัวเลือก | FR-007 | สูง | Negative / API/RBAC |
| TC-014 | guest/student/admin ค้นงาน approved และ pending | ค้นหา | FR-008 | สูง | Positive / Web/API/RBAC |
| TC-015 | คำค้นมีหลายคำและบันทึก log | ค้นหา | FR-008 | กลาง | Positive / API/Integration |
| TC-016 | คำแนะนำไม่เผยงาน pending | ค้นหา | FR-009 | สูง | Negative / Web/API |
| TC-017 | latest/popular และสถิติ | หน้าหลัก | FR-010 | กลาง | Positive / Web/API |
| TC-018 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | รายละเอียด | FR-011 | กลาง | Positive / Web/API |
| TC-019 | ID ไม่มีอยู่ | รายละเอียด | FR-011 | กลาง | Negative / Web/API |
| TC-020 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | คำแนะนำ | FR-012 | กลาง | Positive / API |
| TC-021 | รายชื่อผู้เขียน/ที่ปรึกษา | ผู้เกี่ยวข้อง | FR-013 | กลาง | Positive / Web/API |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | ส่งผลงาน | FR-014 | สูง | Positive / Web/API |
| TC-023 | ไม่ล็อกอินหรือ role guest ส่งงาน | ส่งผลงาน | FR-014 | สูง | Negative / Web/API/RBAC |
| TC-024 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | Validation | FR-015 | สูง | Negative / API/Validation |
| TC-025 | ผู้เขียนคนละ prefix ปี | Validation | FR-015 | กลาง | Negative / Web/API/Validation |
| TC-026 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | ไฟล์ | FR-016 | สูง | Positive / Web/API/Boundary |
| TC-027 | นามสกุล/MIME/ลายเซ็นผิด | ไฟล์ | FR-016 | สูง | Negative / API/Validation |
| TC-028 | ผู้ส่ง/author เห็นงานใน `/my` | ผลงานของฉัน | FR-017 | สูง | Positive / Web/API |
| TC-029 | ผู้มีสิทธิ์แก้แล้วกลับ pending | แก้ผลงาน | FR-018 | สูง | Positive / Web/API |
| TC-030 | คนอื่นแก้งาน | แก้ผลงาน | FR-018 | สูง | Negative / API/RBAC |
| TC-031 | ส่งเอกสารใหม่หลัง `needs_revision` | Revision | FR-019 | สูง | Positive / Web/API/Integration |
| TC-032 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | ลบผลงาน | FR-020 | สูง | Positive / Web/API |
| TC-033 | คนอื่นลบงาน | ลบผลงาน | FR-020 | สูง | Negative / API/RBAC |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | ดาวน์โหลด | FR-021 | กลาง | Positive / Web/API |
| TC-035 | ไม่มี token หรือไม่มีไฟล์ | ดาวน์โหลด | FR-021 | กลาง | Negative / API |
| TC-036 | admin/advisor/student ดู pending | คิวตรวจ | FR-022 | สูง | Positive / Web/API/RBAC |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | ประวัติตรวจ | FR-023 | กลาง | Positive / Web/API/RBAC |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | ตรวจงาน | FR-024 | สูง | Positive / Web/API |
| TC-039 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | ตรวจงาน | FR-024 | สูง | Negative / API/RBAC/Validation |
| TC-040 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | ตรวจงาน | FR-025 | สูง | Positive / Web/API/Integration |
| TC-041 | admin เปลี่ยน advisor; student ถูกห้าม | มอบหมาย | FR-026 | สูง | Positive / Web/API/RBAC |
| TC-042 | บันทึกและยกเลิก favorite | Favorite | FR-027 | กลาง | Positive / Web/API |
| TC-043 | อ่านเฉพาะของตนและ mark read | แจ้งเตือน | FR-028 | สูง | Positive / Web/API/RBAC |
| TC-044 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | AI | FR-029 | กลาง | Positive / API/AI |
| TC-045 | dashboard insight และ chat | AI | FR-030 | กลาง | Positive / API/AI/RBAC |
| TC-046 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | AI ตรวจงาน | FR-031 | กลาง | Positive / Web/API/AI |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | E2E | FR-032 | สูง | Positive / E2E |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | E2E | FR-032 | กลาง | Positive / E2E/RBAC |

รวม 48 กรณี: Positive 32, Negative 16; ประเภทการดำเนินการระบุเพิ่มในแต่ละกรณี ทุกกรณีเริ่มที่ Not Tested

## 2. รายละเอียดกรณีทดสอบ

### 2.1 บัญชีและโปรไฟล์

#### TC-001 — สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-001 |
| อ้างอิง | FR-001; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | email ยังไม่มี |
| ข้อมูลทดสอบ | U1 ใช้ email ใหม่ในฐานทดสอบ; ชื่อ ทดสอบ ระบบ; role=admin เฉพาะคำขอ API |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /register แล้วกรอกชื่อ นามสกุล email และรหัสที่กำหนดใน environment
2. กด สร้างบัญชี และตรวจ URL หลังส่ง
3. ใช้ email ใหม่อีกชุดส่ง POST /auth/register พร้อม role=admin แล้วอ่าน users

**ผลที่คาดหวัง**

- หน้าเว็บพาไป /login?registered=1 ไม่ล็อกอินอัตโนมัติ
- ทั้งสองบัญชีมี role=student แม้ API รับค่า role=admin

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-002 — สมัคร email ซ้ำ

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-002 |
| อ้างอิง | FR-001; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API |
| เงื่อนไขตั้งต้น | มีผู้ใช้เดิม |
| ข้อมูลทดสอบ | email ของ U1 ที่มีอยู่แล้ว |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. บันทึกจำนวน users ของ email U1
2. ส่ง POST /auth/register ด้วย email เดิม
3. อ่าน status และจำนวนแถวหลังส่ง

**ผลที่คาดหวัง**

- HTTP 400 และ detail ว่า email ถูกใช้แล้ว
- จำนวนแถวไม่เพิ่ม

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-003 — ล็อกอินข้อมูลถูก

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-003 |
| อ้างอิง | FR-002; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | มีผู้ใช้ |
| ข้อมูลทดสอบ | S1 active; email/password อยู่ในชุดข้อมูลทดสอบแยก |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /login แล้วกรอกข้อมูล S1
2. กด เข้าสู่ระบบ และตรวจเส้นทาง
3. เรียก /auth/me ด้วย token ที่ออกโดย backend

**ผลที่คาดหวัง**

- เว็บไป /account/saved ตาม route login
- backend คืน token_type=bearer และ /auth/me คืน S1

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-004 — รหัสผ่านผิด

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-004 |
| อ้างอิง | FR-002; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / Web/API |
| เงื่อนไขตั้งต้น | มีผู้ใช้ |
| ข้อมูลทดสอบ | email ของ S1 และรหัสผิดที่ไม่ใช่รหัสจริง |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /login กรอก email ถูกแต่รหัสผิดแล้วส่ง
2. ตรวจข้อความและ URL
3. ส่ง POST /auth/login ด้วยข้อมูลเดียวกันโดยตรง

**ผลที่คาดหวัง**

- เว็บยังอยู่หน้า login และไม่เกิด session
- backend ตอบ 400 ไม่มี access_token

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-005 — ดู/แก้โปรไฟล์และเปลี่ยนรหัส

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-005 |
| อ้างอิง | FR-003; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | token ผู้ใช้ active |
| ข้อมูลทดสอบ | S1; ชื่อ ภาควิชา และรหัสใหม่เฉพาะฐานทดสอบ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 เปิด /student/profile
2. เปลี่ยนชื่อ ภาควิชา และรหัสผ่านแล้วบันทึก
3. โหลดหน้าใหม่และล็อกอินด้วยรหัสใหม่

**ผลที่คาดหวัง**

- GET /auth/me และหน้าโปรไฟล์แสดงค่าใหม่
- รหัสใหม่ใช้ได้และรหัสถูกเก็บเป็น hash

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-006 — token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-006 |
| อ้างอิง | FR-003; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API |
| เงื่อนไขตั้งต้น | มีผู้ใช้สองราย |
| ข้อมูลทดสอบ | token ปลอม; U2 inactive; email ของ S1 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. GET /auth/me ด้วย token ปลอม
2. GET ด้วย token ของ U2
3. PUT /auth/me ของผู้ใช้อื่นให้ email ซ้ำกับ S1

**ผลที่คาดหวัง**

- ได้ 401, 400, 400 ตามลำดับ
- email ใน users ไม่เปลี่ยน

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-007 — ล็อกอินแล้วออกจากระบบ

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-007 |
| อ้างอิง | FR-004; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | backend พร้อม |
| ข้อมูลทดสอบ | S1; browser profile ใหม่ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 ผ่าน /login
2. ตรวจ cookie ของ /api/auth/login ว่า HttpOnly และเปิด /account/saved
3. กดออกจากระบบหรือ POST /api/auth/logout แล้วเปิด /account/saved อีกครั้ง

**ผลที่คาดหวัง**

- มี session cookie ระหว่างล็อกอิน
- หลัง logout cookie ถูกลบและหน้า protected พาไป /login

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.2 ผู้ใช้ หมวดหมู่ และตัวเลือก

#### TC-008 — admin CRUD ผู้ใช้

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-008 |
| อ้างอิง | FR-005; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | token admin |
| ข้อมูลทดสอบ | A1; U3 email ใหม่และ role=advisor |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน A1 เปิด /admin/users และเพิ่ม U3
2. GET /users/{id} แล้วแก้ชื่อ/role จากหน้าเว็บหรือ PUT
3. ลบ U3 แล้ว GET ID เดิม

**ผลที่คาดหวัง**

- POST สร้างได้ 201
- แก้ไขคงอยู่
- ลบได้ 204 และ GET หลังลบ 404

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-009 — student เรียก API จัดการผู้ใช้

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-009 |
| อ้างอิง | FR-005; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/RBAC |
| เงื่อนไขตั้งต้น | token student |
| ข้อมูลทดสอบ | S1; U3 ที่มีอยู่ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ใช้ token S1 ส่ง GET/POST /users/
2. ส่ง GET/PUT/DELETE /users/{id}
3. ใช้ A1 ตรวจ U3 หลังคำขอ

**ผลที่คาดหวัง**

- ทุกคำขอ S1 ตอบ 403
- U3 ไม่ถูกเปลี่ยนหรือลบ

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-010 — อ่านสาธารณะและเพิ่มโดย admin

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-010 |
| อ้างอิง | FR-006; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | token admin |
| ข้อมูลทดสอบ | A1; category ใหม่ C2 ชื่อไม่ซ้ำ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /admin/categories และกรอกชื่อ/คำอธิบาย C2
2. กด เพิ่มหมวดหมู่
3. เปิดหน้าใหม่และ GET /categories/ แบบไม่มี token

**ผลที่คาดหวัง**

- C2 ปรากฏพร้อม id
- GET สาธารณะคืน C2

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-011 — ผู้ไม่ใช่ admin เพิ่มหมวดหมู่

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-011 |
| อ้างอิง | FR-006; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/RBAC |
| เงื่อนไขตั้งต้น | token student |
| ข้อมูลทดสอบ | S1; ชื่อ category ใหม่ไม่ซ้ำ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง POST /categories/ ด้วย token S1
2. GET /categories/ อีกครั้ง

**ผลที่คาดหวัง**

- POST ตอบ 403
- ไม่พบ category ใหม่

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-012 — admin แทนรายการตัวเลือก

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-012 |
| อ้างอิง | FR-007; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | token admin |
| ข้อมูลทดสอบ | A1; departments และ work_types ชุดใหม่ มี whitespace และช่องว่าง |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /admin/options หรือส่ง POST /options/ พร้อมสอง array
2. GET /options/ หลังบันทึก
3. ตรวจตาราง departments/work_types

**ผลที่คาดหวัง**

- ค่าก่อนหน้าถูกแทน
- ชื่อถูก trim และรายการว่างไม่ถูกเก็บ

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-013 — student เปลี่ยนตัวเลือก

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-013 |
| อ้างอิง | FR-007; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/RBAC |
| เงื่อนไขตั้งต้น | token student |
| ข้อมูลทดสอบ | S1; snapshot ของ GET /options/ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง POST /options/ ด้วย token S1
2. GET /options/ เทียบ snapshot

**ผลที่คาดหวัง**

- POST ตอบ 403
- รายการเดิมคงอยู่

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.3 ค้นหา รายละเอียด และคำแนะนำ

#### TC-014 — guest/student/admin ค้นงาน approved และ pending

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-014 |
| อ้างอิง | FR-008; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/RBAC |
| เงื่อนไขตั้งต้น | งานสองสถานะ หลายเจ้าของ |
| ข้อมูลทดสอบ | W1 approved; W2 pending ของ S1; W3 pending ของ S2; C1/C2 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /research เป็น guest และค้นคำ/หมวด
2. เรียก /research/search ด้วย guest, S1 และ A1
3. เทียบ ID ผลแต่ละสิทธิ์

**ผลที่คาดหวัง**

- guest เห็น approved เท่านั้น
- S1 เห็น approved และงานที่เกี่ยวข้อง
- A1 เห็นทั้งหมดตามตัวกรอง

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-015 — คำค้นมีหลายคำและบันทึก log

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-015 |
| อ้างอิง | FR-008; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / API/Integration |
| เงื่อนไขตั้งต้น | งานตัวอย่าง |
| ข้อมูลทดสอบ | W1 มีคำทดสอบใน title_th และ abstract; query สองคำ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง GET /research/search?q=สองคำ
2. ตรวจ ID/อันดับผล
3. อ่าน search_logs ก่อนและหลัง

**ผลที่คาดหวัง**

- งานที่ตรงเงื่อนไข OR ปรากฏ
- มี search_log keyword ตรง q
- ชื่อเรื่องได้รับคะแนนสูงกว่า abstract ตามโค้ด

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-016 — คำแนะนำไม่เผยงาน pending

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-016 |
| อ้างอิง | FR-009; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / Web/API |
| เงื่อนไขตั้งต้น | ชื่อ/คำสำคัญเฉพาะใน pending |
| ข้อมูลทดสอบ | W1 approved และ W2 pending มี keyword ไม่ซ้ำ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /research และพิมพ์ keyword เฉพาะเพื่อดู suggestions
2. เรียก /research/search/suggestions?q=...
3. เทียบ titles/keywords กับ W1/W2

**ผลที่คาดหวัง**

- ไม่มีข้อมูลจาก W2 pending ใน suggestions
- ข้อมูล approved ที่ตรงค้นปรากฏ

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-017 — latest/popular และสถิติ

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-017 |
| อ้างอิง | FR-010; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งาน approved/pending และ count |
| ข้อมูลทดสอบ | W1/W4 approved มีวันเผยแพร่และ view_count ต่างกัน; W2 pending |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. GET /home/latest?limit=1 และ /home/popular?limit=1
2. GET /stats/
3. เทียบตัวเลข/ลำดับกับ research_works และ users

**ผลที่คาดหวัง**

- latest/popular มี approved ไม่เกินหนึ่งรายการและเรียงตามฟิลด์ที่โค้ดใช้
- stats ตรง count/sum ของ DB

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-018 — เปิดงานและแนะนำงานที่เกี่ยวข้อง

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-018 |
| อ้างอิง | FR-011; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งานที่มี category/keywords |
| ข้อมูลทดสอบ | W1 approved; W4 related approved; W2 pending |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. อ่าน view_count ของ W1
2. เปิด /research/{id} ของ W1 และเรียก /research/{id}/recommendations
3. เรียก GET /research/{id} ของ W2 pending โดยไม่มี token เพื่อบันทึกการเข้าถึง URL ตรง
4. ตรวจ view_count และ download_view_logs

**ผลที่คาดหวัง**

- รายละเอียด W1 แสดง
- view_count เพิ่ม 1 พร้อม view log
- คำแนะนำไม่มี W1/W2
- API ปัจจุบันคืนรายละเอียด W2 pending ให้คำขอไม่มี token; ให้บันทึกผลนี้เป็นความเสี่ยงด้านการมองเห็นงาน

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-019 — ID ไม่มีอยู่

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-019 |
| อ้างอิง | FR-011; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Negative / Web/API |
| เงื่อนไขตั้งต้น | ไม่มี ID |
| ข้อมูลทดสอบ | ID จำนวนเต็มบวกที่ไม่มีใน research_works |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /research/{id} ของ ID ไม่มี
2. เรียก GET /research/{id} โดยตรง
3. ตรวจ view log

**ผลที่คาดหวัง**

- API ตอบ 404
- หน้าเว็บแสดงสถานะไม่พบ
- ไม่มี view log ใหม่

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-020 — ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-020 |
| อ้างอิง | FR-012; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / API |
| เงื่อนไขตั้งต้น | approved หลายหมวด |
| ข้อมูลทดสอบ | W1/W4 approved; S1 มี favorite W1 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. GET /research/recommendations/personalized ไม่มี token
2. GET ด้วย token S1
3. ตรวจ status/จำนวน/ลำดับผล

**ผลที่คาดหวัง**

- ผลมีเฉพาะ approved ไม่เกิน 5
- ไม่มี interaction ใช้ความนิยม และมี interaction ใช้ profile category/keyword

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.4 ส่งผลงานและตรวจข้อมูล

#### TC-021 — รายชื่อผู้เขียน/ที่ปรึกษา

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-021 |
| อ้างอิง | FR-013; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | student/advisor active/inactive |
| ข้อมูลทดสอบ | S1/S2 active student; D1/D2 active advisor; U2 inactive |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 เปิด /student/research/new และดูตัวเลือกผู้เกี่ยวข้อง
2. GET /research/participants
3. เรียกโดยไม่มี token

**ผลที่คาดหวัง**

- authors/advisors แยก role และไม่รวม U2
- S1 มี is_current=true
- ไม่มี token 401

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-022 — ส่งงานครบข้อมูลและผู้เกี่ยวข้อง

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-022 |
| อ้างอิง | FR-014; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | token student; category/IDs ถูก |
| ข้อมูลทดสอบ | S1, C1, D1; ชื่อไทย งานวิจัยทดสอบ; ชื่ออังกฤษ Research Test; PDF/ภาพ valid |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 เปิด /student/research/new
2. กรอกห้าขั้น เลือก author/advisor แนบไฟล์ แล้วยืนยัน
3. อ่านหน้าสำเร็จและ query research_works/research_authors/research_advisors

**ผลที่คาดหวัง**

- สร้างงาน status=pending และ submitted_by_id=S1
- ผู้เกี่ยวข้องและ path ไฟล์ตรง input
- ไม่มี draft

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-023 — ไม่ล็อกอินหรือ role guest ส่งงาน

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-023 |
| อ้างอิง | FR-014; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / Web/API/RBAC |
| เงื่อนไขตั้งต้น | guest token หรือไม่มี token |
| ข้อมูลทดสอบ | ไม่มี session และ G1 role guest; multipart body แบบ TC-022 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /student/research/new โดยไม่ล็อกอิน
2. ส่ง POST /research/ ไม่มี token
3. ส่งอีกครั้งด้วย G1

**ผลที่คาดหวัง**

- หน้าเว็บพาไป /login
- API ตอบ 401 และ 403
- ไม่มีงานใหม่

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-024 — IDs ไม่ใช่ JSON array/มี 0/role ผิด

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-024 |
| อ้างอิง | FR-015; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/Validation |
| เงื่อนไขตั้งต้น | category ถูก |
| ข้อมูลทดสอบ | C1; author_ids เป็นข้อความผิดรูปแบบ, [0], advisor_ids เป็น student, category_id ไม่มี |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง POST /research/ ทีละชุดด้วย S1
2. บันทึก status/detail
3. เทียบจำนวน research_works

**ผลที่คาดหวัง**

- รูปแบบ/role ผิดตอบ 422
- ID ที่ไม่มีตอบ 404
- ไม่มีงานถูกสร้าง

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-025 — ผู้เขียนคนละ prefix ปี

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-025 |
| อ้างอิง | FR-015; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Negative / Web/API/Validation |
| เงื่อนไขตั้งต้น | student สองคนมี student_id ต่าง prefix |
| ข้อมูลทดสอบ | S1/S3 มี student_id สองตัวแรกต่างกัน |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ตรวจตัวเลือก author ในฟอร์ม S1
2. ส่ง POST /research/ โดยตรงพร้อม author_ids สองคน
3. เทียบ DB

**ผลที่คาดหวัง**

- frontend กรองผู้เขียนต่าง prefix
- backend ตอบ 422 และไม่สร้างงาน

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-026 — อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-026 |
| อ้างอิง | FR-016; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/Boundary |
| เงื่อนไขตั้งต้น | ไฟล์ภาพ/PDF ถูกต้อง |
| ข้อมูลทดสอบ | ภาพที่ลายเซ็นถูก ขนาดเท่าขีดจำกัดและเกิน 1 byte; PDF เช่นเดียวกัน |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ตรวจค่า MAX_COVER_IMAGE_BYTES/MAX_DOCUMENT_BYTES ของรอบทดสอบ
2. ส่ง POST multipart แยกสี่ไฟล์ด้วย S1
3. ตรวจ status และไฟล์ใน STATIC_DIR

**ผลที่คาดหวัง**

- ไฟล์เท่าขีดจำกัดรับ
- เกิน 1 byte ตอบ 413
- ไฟล์เกินขนาดไม่ค้าง

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-027 — นามสกุล/MIME/ลายเซ็นผิด

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-027 |
| อ้างอิง | FR-016; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/Validation |
| เงื่อนไขตั้งต้น | เตรียมไฟล์ปลอม |
| ข้อมูลทดสอบ | MIME/นามสกุลไม่เข้าคู่; PDF ปลอม; cover valid กับ document invalid |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง POST multipart แต่ละแบบ
2. ตรวจ status
3. เทียบ research_works และโฟลเดอร์ upload ก่อน/หลัง

**ผลที่คาดหวัง**

- ตอบ 415
- ไม่มีงานหรือ partial cover ใหม่ค้าง

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.5 ผลงานของฉัน การแก้ไข และไฟล์

#### TC-028 — ผู้ส่ง/author เห็นงานใน `/my`

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-028 |
| อ้างอิง | FR-017; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งานที่เกี่ยวข้องและไม่เกี่ยวข้อง |
| ข้อมูลทดสอบ | W1 ส่งโดย S1; W4 มี S1 เป็น author; W3 ไม่เกี่ยว |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 เปิด /student/research
2. GET /research/my
3. เทียบ ID ใน UI/API

**ผลที่คาดหวัง**

- เห็น W1 และ W4 เท่านั้น
- ไม่เห็น W3

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-029 — ผู้มีสิทธิ์แก้แล้วกลับ pending

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-029 |
| อ้างอิง | FR-018; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งาน approved ของตน |
| ข้อมูลทดสอบ | W1 approved ของ S1; ชื่อและบทคัดย่อใหม่; C1 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /student/research/edit/{id} แล้วแก้ฟิลด์
2. บันทึกและ GET /research/{id}
3. ตรวจ status ใน DB

**ผลที่คาดหวัง**

- ข้อมูลใหม่คงอยู่
- status กลับ pending

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-030 — คนอื่นแก้งาน

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-030 |
| อ้างอิง | FR-018; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/RBAC |
| เงื่อนไขตั้งต้น | งานของผู้อื่น |
| ข้อมูลทดสอบ | W3 เป็นของ S2 และ S1 ไม่ใช่ author |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง PUT /research/{id} ของ W3 ด้วย S1
2. GET W3 โดย A1
3. เทียบ fields/relations

**ผลที่คาดหวัง**

- PUT ตอบ 403
- W3 ไม่เปลี่ยน

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-031 — ส่งเอกสารใหม่หลัง `needs_revision`

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-031 |
| อ้างอิง | FR-019; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/Integration |
| เงื่อนไขตั้งต้น | งาน needs_revision มีเอกสารเดิม |
| ข้อมูลทดสอบ | W2 status=needs_revision มี PDF เดิม; PDF ใหม่ valid |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิดหน้าแก้งานที่มีสิทธิ์และแนบ PDF ใหม่
2. ส่ง PUT /research/{id}
3. ตรวจ file_revisions และ research_works

**ผลที่คาดหวัง**

- file_revisions เก็บ path เดิมกับ version_no เพิ่ม
- งานชี้ไฟล์ใหม่และ status=pending

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-032 — เจ้าของลบงานพร้อมข้อมูลสัมพันธ์

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-032 |
| อ้างอิง | FR-020; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งานที่มี authors/advisors/favorites |
| ข้อมูลทดสอบ | W1 ของ S1 มี authors/advisors/reviews/favorite/log และไฟล์ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิดรายการงานของ S1 แล้วสั่งลบ
2. GET ID เดิม
3. ตรวจตารางสัมพันธ์และไฟล์หลัก

**ผลที่คาดหวัง**

- DELETE สำเร็จและ GET 404
- รายการสัมพันธ์ที่ service ลบหาย
- ไฟล์หลักถูกลบ

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-033 — คนอื่นลบงาน

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-033 |
| อ้างอิง | FR-020; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/RBAC |
| เงื่อนไขตั้งต้น | งานของผู้อื่น |
| ข้อมูลทดสอบ | W3 ของ S2 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ส่ง DELETE /research/{id} ของ W3 ด้วย S1
2. GET W3 และ relations ด้วย A1

**ผลที่คาดหวัง**

- DELETE ตอบ 403
- W3 คงอยู่

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-034 — ผู้ใช้ active ดาวน์โหลดงานมีไฟล์

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-034 |
| อ้างอิง | FR-021; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งานมี PDF |
| ข้อมูลทดสอบ | W1 มี PDF; S1 active |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 เปิดรายละเอียดและกดดาวน์โหลดหรือ POST endpoint
2. ตรวจ file_url และเปิด URL ด้วย session ของ S1
3. เปิด file_url เดิมใน browser ที่ไม่มี session เพื่อบันทึกพฤติกรรม static file ตามโค้ดปัจจุบัน
4. ตรวจ counter/log

**ผลที่คาดหวัง**

- ได้ file_url
- download_count เพิ่ม 1 และ log ระบุ S1/action_type=download
- URL ใต้ /static เปิดตรงได้โดยไม่เรียก endpoint download; การเปิดตรงไม่เพิ่ม download_count ให้บันทึกเป็นความเสี่ยงที่ต้องยืนยันนโยบาย

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-035 — ไม่มี token หรือไม่มีไฟล์

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-035 |
| อ้างอิง | FR-021; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Negative / API |
| เงื่อนไขตั้งต้น | งานไม่มีไฟล์ |
| ข้อมูลทดสอบ | W1 มีไฟล์; W5 ไม่มีไฟล์ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST /research/{id}/download โดยไม่มี token
2. POST W5 ด้วย S1
3. ตรวจ counters ก่อน/หลัง

**ผลที่คาดหวัง**

- ตอบ 401 และ 404 ตามลำดับ
- counter ไม่เพิ่ม

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.6 คิวและผลการตรวจ

#### TC-036 — admin/advisor/student ดู pending

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-036 |
| อ้างอิง | FR-022; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/RBAC |
| เงื่อนไขตั้งต้น | งานมอบหมายหลาย advisor |
| ข้อมูลทดสอบ | W2 pending assigned D1; W3 pending assigned D2; A1/S1 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิดคิว /advisor/reviews ด้วย D1 และ /admin/reviews ด้วย A1
2. GET /research/pending ด้วย A1/D1/S1 แล้วเทียบกับรายการบนหน้าเว็บ

**ผลที่คาดหวัง**

- API admin เห็นทั้งสอง, D1 เห็น W2, S1 ตอบ 403
- หน้า /advisor/reviews โหลดผ่าน searchResearch ซึ่ง backend อนุญาตให้ advisor เห็นงานทั้งหมด; หาก UI แสดง W3 ให้บันทึกความต่างจาก /research/pending และเปิดข้อสงสัยด้านการมองเห็นคิว

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-037 — ผู้ตรวจเห็นประวัติของตน

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-037 |
| อ้างอิง | FR-023; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API/RBAC |
| เงื่อนไขตั้งต้น | มี ReviewComment หลาย reviewer |
| ข้อมูลทดสอบ | D1/A1 มี review ของคนละงาน; S1 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิด /advisor/history ด้วย D1
2. GET /research/history ด้วย D1/A1/S1
3. เทียบ reviewer_id ใน review_comments

**ผลที่คาดหวัง**

- D1/A1 เห็นเฉพาะงานที่ตนตรวจ
- S1 ตอบ 403

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-038 — advisor ที่ได้รับมอบหมายอนุมัติ pending

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-038 |
| อ้างอิง | FR-024; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API |
| เงื่อนไขตั้งต้น | งาน pending มอบหมาย advisor |
| ข้อมูลทดสอบ | W2 pending assigned D1; comment และ score 80 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน D1 เปิด /advisor/reviews/{id}
2. เลือก approved กรอกคะแนน/ความคิดเห็นและยืนยัน modal
3. GET งานและ review_comments

**ผลที่คาดหวัง**

- status=approved
- review ใหม่มี reviewer_id=D1, comment และ score ตรง

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-039 — advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-039 |
| อ้างอิง | FR-024; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Negative / API/RBAC/Validation |
| เงื่อนไขตั้งต้น | มีงานตามเงื่อนไข |
| ข้อมูลทดสอบ | W2 pending ไม่ assigned D2; W1 approved; status_result=unknown |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST review W2 ด้วย D2
2. POST review W1 ด้วย D1
3. POST enum ผิดกับ W2

**ผลที่คาดหวัง**

- ตอบ 403, 400, 422 ตามกรณี
- ไม่มี review เพิ่ม

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-040 — อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-040 |
| อ้างอิง | FR-025; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/Integration |
| เงื่อนไขตั้งต้น | งาน pending มี submitter/author |
| ข้อมูลทดสอบ | W2 pending มี submitter S1 และ co-author S2 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST review approved โดย D1 พร้อม comment/score
2. อ่าน research_works, review_comments, notifications
3. เปิดรายการแจ้งเตือนของ S1/S2

**ผลที่คาดหวัง**

- published_at ไม่ null
- comment/score บันทึก
- ผู้ส่งและ co-author มี notification

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-041 — admin เปลี่ยน advisor; student ถูกห้าม

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-041 |
| อ้างอิง | FR-026; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/RBAC |
| เงื่อนไขตั้งต้น | งานและ advisor สองคน |
| ข้อมูลทดสอบ | W2 assigned D1; D2 active; A1/S1 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST /research/{id}/assign-advisors ด้วย A1 ให้ [D2]
2. GET pending ด้วย D1/D2
3. POST เดิมด้วย S1

**ผลที่คาดหวัง**

- relation เปลี่ยนเป็น D2
- D2 เห็นงานในคิว, D1 ไม่เห็น
- S1 ตอบ 403

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.7 Favorite และการแจ้งเตือน

#### TC-042 — บันทึกและยกเลิก favorite

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-042 |
| อ้างอิง | FR-027; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API |
| เงื่อนไขตั้งต้น | token active; งานมีอยู่ |
| ข้อมูลทดสอบ | S1; W1; เริ่มไม่มี favorite |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. เปิดรายละเอียด W1 กดบันทึก
2. GET /favorites/ และเปิด /account/saved
3. กดยกเลิกหรือ POST ซ้ำ แล้ว GET อีกครั้ง

**ผลที่คาดหวัง**

- ครั้งแรกมี favorite ของ S1
- ครั้งที่สองหาย
- response ยกเลิกเป็น HTTP 200 กับ detail ตาม implementation

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-043 — อ่านเฉพาะของตนและ mark read

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-043 |
| อ้างอิง | FR-028; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / Web/API/RBAC |
| เงื่อนไขตั้งต้น | แจ้งเตือนสองผู้ใช้ |
| ข้อมูลทดสอบ | N1 ของ S1 และ N2 ของ S2 |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 เปิดรายการแจ้งเตือน
2. GET /notifications/
3. POST read N1/N2 และ read-all

**ผลที่คาดหวัง**

- S1 เห็นเฉพาะ N1
- N2 ตอบ 404
- N1 เป็น is_read=true

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.8 AI

#### TC-044 — เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-044 |
| อ้างอิง | FR-029; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / API/AI |
| เงื่อนไขตั้งต้น | ตั้ง AI test double |
| ข้อมูลทดสอบ | S1; AI test double; body ถูกและขาด required field |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST generate-abstract, suggest-titles, suggest-keywords, check-writing ด้วย S1
2. ตรวจ response schema
3. ส่ง body ขาด field และไม่มี token

**ผลที่คาดหวัง**

- body ถูกคืนฟิลด์ตาม schema
- body ผิดตอบ 422
- ไม่มี token ตอบ 401

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-045 — dashboard insight และ chat

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-045 |
| อ้างอิง | FR-030; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / API/AI/RBAC |
| เงื่อนไขตั้งต้น | AI test double; งาน approved |
| ข้อมูลทดสอบ | A1/S1; AI test double; W1 approved |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST /ai/dashboard-insights ด้วย A1 และ S1
2. POST /ai/chat แบบไม่มี token
3. ตรวจ response/relevant_works

**ผลที่คาดหวัง**

- A1 ได้ insight, S1 403
- chat คืน response และ relevant_works array

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-046 — สี่ endpoint วิเคราะห์ผลงานและสิทธิ์

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-046 |
| อ้างอิง | FR-031; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / Web/API/AI |
| เงื่อนไขตั้งต้น | งานมีอยู่; AI test double |
| ข้อมูลทดสอบ | W1; D1/S1; AI test double |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. POST ai-pre-review, ai-plagiarism, ai-reviewer-match, ai-review-summary ของ W1 ด้วย D1
2. ทำซ้ำด้วย S1 และ ID ไม่มี

**ผลที่คาดหวัง**

- D1 ได้ผลตาม service
- S1 403
- ID ไม่มี 404

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


### 2.9 กระบวนการข้ามบทบาทแบบ E2E

#### TC-047 — เว็บส่งงานแล้ว advisor ตรวจ

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-047 |
| อ้างอิง | FR-032; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | สูง / Positive / E2E |
| เงื่อนไขตั้งต้น | backend/frontend และบัญชีทดสอบพร้อม |
| ข้อมูลทดสอบ | S1, D1, C1; browser แยก session; PDF valid |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน S1 ส่งงานผ่าน /student/research/new
2. บันทึก ID และตรวจ /student/research
3. ล็อกอิน D1 เปิด /advisor/reviews/{id} และส่งผลตรวจ

**ผลที่คาดหวัง**

- งานเริ่ม pending และอยู่ในคิว D1
- หลังตรวจ review/status ตรง UI และ DB

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD


#### TC-048 — เว็บ admin จัดการหมวดหมู่/ผู้ใช้

| รายการ | รายละเอียด |
|---|---|
| รหัส Test Case | TC-048 |
| อ้างอิง | FR-032; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md |
| ความสำคัญ / ประเภท | กลาง / Positive / E2E/RBAC |
| เงื่อนไขตั้งต้น | admin พร้อม |
| ข้อมูลทดสอบ | A1, S1, C2 และ U3 ใหม่ |
| สถานะเริ่มต้น | Not Tested |

**ขั้นตอนการทดสอบ**

1. ล็อกอิน A1 เพิ่ม C2 ที่ /admin/categories และ U3 ที่ /admin/users
2. ตรวจ GET API/DB
3. ล็อกอิน S1 เปิด /admin และส่งคำขอ admin โดยตรง

**ผลที่คาดหวัง**

- C2/U3 บันทึกจริง
- คำขอ API ของ S1 ตอบ 403
- การเปิด /admin ของ S1 ให้บันทึกพฤติกรรมจริงเพราะ layout ตรวจเพียง session

**ผลการทดสอบจริง:** TBD

**สถานะ:** ☐ ผ่าน  ☐ ไม่ผ่าน  ☐ ข้าม/Blocked  ☑ Not Tested

**ผู้ทดสอบ / วันที่:** TBD  ·  **หลักฐาน:** TBD  ·  **Defect:** TBD

## 3. สรุปผลและการลงนาม

| รายการ | จำนวน |
|---|---:|
| กรณีทดสอบทั้งหมด | 48 |
| Not Tested | 48 |
| ผ่าน | 0 |
| ไม่ผ่าน | 0 |
| ข้าม/Blocked | 0 |

ตัวเลขข้างต้นเป็นสถานะตั้งต้น ยังไม่มีการ execute จริง รายงานผลรายกรณีและการประเมิน exit criteria อยู่ใน TEST-PLAN-AND-REPORT.md

| บทบาท | ชื่อ-นามสกุล | วันที่ | สถานะรับรอง |
|---|---|---|---|
| ผู้ทดสอบ | TBD | TBD | รอ |
| ผู้พัฒนา | TBD | TBD | รอ |
| ผู้อนุมัติ | TBD | TBD | รอ |
