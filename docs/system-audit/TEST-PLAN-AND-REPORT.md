# เทมเพลตเอกสารการทดสอบระบบ
## แผนการทดสอบ (Test Plan) และรายงานผลการทดสอบ (Test Report)
### UniResearch — คลังและกระบวนการจัดการผลงานวิจัย

เอกสารนี้ใช้ข้อมูลจาก Source Code ของ Repository ปัจจุบันเท่านั้น เอกสารตัวอย่าง SPRS ใช้เป็นแนวทางการจัดหัวข้อและตาราง โดยไม่ใช้ข้อกำหนด เทคโนโลยี หรือผลทดสอบของระบบนั้น

| รายการ | รายละเอียด |
|---|---|
| รหัสเอกสาร | UR-TPR-001 |
| เวอร์ชันเอกสาร | 0.3 |
| วันที่จัดทำ | 4 ตุลาคม 2026 |
| ผู้จัดทำ | TBD |
| สถานะเอกสาร | ☑ ฉบับร่าง  ☐ รออนุมัติ  ☐ อนุมัติแล้ว |
| เวอร์ชัน/Commit ระบบที่จะทดสอบ | TBD |

### ประวัติการแก้ไขเอกสาร (Revision History)

| เวอร์ชัน | วันที่ | ผู้แก้ไข | รายละเอียดการแก้ไข |
|---|---|---|---|
| 0.1 | 4 ตุลาคม 2026 | TBD | จัดทำแผนตั้งต้นจาก Source Code |
| 0.2 | 4 ตุลาคม 2026 | TBD | เพิ่มรายละเอียดแผนและแบบบันทึกผล |
| 0.3 | 4 ตุลาคม 2026 | TBD | จัดรูปแบบตามเทมเพลตแผนและรายงาน โดยใช้ข้อมูล UniResearch |

### เอกสารอ้างอิง (References)

| ลำดับ | เอกสาร/Source Code | รายละเอียด |
|---|---|---|
| 1 | [FUNCTIONAL-REQUIREMENTS.md](FUNCTIONAL-REQUIREMENTS.md) | FR-001–FR-032 พร้อมหลักฐานจากโค้ด |
| 2 | [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) | สถาปัตยกรรม role, API, ตาราง และ workflow |
| 3 | [TEST-CASES.md](TEST-CASES.md) | TC-001–TC-048 พร้อมขั้นตอนและผลที่คาดหวัง |
| 4 | [TRACEABILITY.md](TRACEABILITY.md) | ความสัมพันธ์ FR → TC |
| 5 | [backend/app/routers](../../backend/app/routers), [backend/app/models](../../backend/app/models), [frontend/app](../../frontend/app) | Implementation ที่ใช้ยืนยันพฤติกรรม |
| 6 | [backend/tests](../../backend/tests), [frontend/tests](../../frontend/tests), [frontend/e2e](../../frontend/e2e) | ชุดทดสอบที่มีอยู่; ไม่ใช่ผล Execute ของ TC ชุดนี้ |

# ส่วนที่ 1: แผนการทดสอบ (Test Plan)

## 1.1 วัตถุประสงค์ของการทดสอบ

- ตรวจพฤติกรรมของ FR-001–FR-032 ด้วย TC-001–TC-048 ทั้งเส้นทางหน้าเว็บ API และการบันทึกข้อมูล
- ตรวจการยืนยันตัวตนด้วย JWT/HttpOnly cookie และสิทธิ์ของ guest, student, advisor, admin ที่ระดับ UI และ HTTP
- ตรวจ workflow ที่โค้ดใช้จริง: สร้างงานเป็น pending → ตรวจเป็น approved/rejected/needs_revision → แก้ไขแล้วกลับ pending รวมถึงการแจ้งเตือนและ revision ของไฟล์
- ตรวจการค้นหา การมองเห็นรายละเอียด การดาวน์โหลด การจัดการผู้ใช้/หมวดหมู่/ตัวเลือก และการเชื่อมต่อ AI แบบควบคุมผล
- บันทึกความต่างระหว่าง frontend กับ backend ตามผลทดสอบจริง โดยเฉพาะหน้า /admin, คิว advisor และ URL ไฟล์

## 1.2 ขอบเขตการทดสอบ

### 1.2.1 สิ่งที่อยู่ในขอบเขต (In Scope)

- กรณีทดสอบ TC-001–TC-048: Positive 32 และ Negative 16; ครอบคลุม 32 FR ในเอกสาร Functional Requirements
- บัญชี/โปรไฟล์/session, RBAC, ผู้ใช้, หมวดหมู่และตัวเลือก, ค้นหาและคำแนะนำ, ผลงานวิจัย, ไฟล์, คิวตรวจ/ผลตรวจ, favorite, notification, AI endpoint และ E2E ข้ามบทบาท
- ตรวจ HTTP status, response body, UI/redirect, ฐานข้อมูล, file storage และ log ที่เกี่ยวข้องตามแต่ละ TC
- ทดสอบกรณีข้อมูลผิด ขาด token, role ไม่ถูก, relation ไม่ถูก, ขนาดไฟล์ขอบเขต และ ID ไม่พบ

### 1.2.2 สิ่งที่อยู่นอกขอบเขต (Out of Scope)

- คุณภาพเชิงเนื้อหาของ AI provider จริง; ใช้ test double เพื่อทดสอบ contract และสิทธิ์
- Load/Stress, penetration test เต็มรูปแบบ, deployment Kubernetes/Terraform และ browser/อุปกรณ์ที่ยังไม่กำหนดในรอบทดสอบ
- ความสามารถจากตัวอย่าง SPRS ที่ไม่มีใน UniResearch เช่น draft/submitted/completed, committee, คะแนนประเมินสี่ด้าน, activity_logs, tags และรูปโปรไฟล์

## 1.3 กลยุทธ์และประเภทการทดสอบ

คอลัมน์ “ใช้ตามแผน” ระบุวิธีที่ตั้งใจใช้ ไม่ได้หมายถึงทดสอบแล้ว

| ประเภทการทดสอบ | วิธีการ | เครื่องมือ/หลักฐาน | ใช้ตามแผน |
|---|---|---|---|
| Functional / E2E | เดิน workflow ผ่าน /register, /login, /student/research/new, /advisor/reviews, /admin/* | Browser/Playwright; screenshot, URL, DB | ☑ |
| API/Integration | เรียก FastAPI และ Next.js proxy โดยตรง แล้วเทียบฐานข้อมูลและไฟล์ | HTTP client, PostgreSQL query, file check | ☑ |
| Negative / RBAC | ตรวจหน้าเว็บและส่ง HTTP ตรงด้วยไม่มี token หรือ role ไม่ถูก | Browser, HTTP client, before/after snapshot | ☑ |
| Validation / Boundary | ส่ง JSON ID ผิด, category/role ผิด, ไฟล์ชนิด/ขนาดขอบเขต | HTTP client, ชุดไฟล์ทดสอบ | ☑ |
| Automated Backend | รันชุด pytest ที่มีอยู่ใน backend/tests | pytest; log และ commit ที่รัน | ☑ |
| Automated Frontend | typecheck, lint, Node tests และ build ตาม package.json | pnpm; log และ commit ที่รัน | ☑ |
| Automated E2E | รัน Playwright เฉพาะเมื่อ fixture และ server พร้อม; ตรวจ skip ด้วย | Playwright trace/screenshot | ☑ |
| AI แบบควบคุม | mock provider และตรวจ schema/RBAC/fallback | Test double, HTTP response | ☑ |
| Regression | รัน TC ที่ได้รับผลกระทบซ้ำหลังแก้ defect | Test Execution Log และหลักฐานก่อน/หลัง | ☑ |

เกณฑ์ผ่านราย TC: ผลจริงตรงทุก Expected Result ที่ระบุ; กรณี Negative ต้องไม่มีการเปลี่ยนข้อมูลที่ถูกปฏิเสธ; ต้องมีหลักฐานตรวจซ้ำได้ ข้อสังเกตจากการอ่านโค้ดยังไม่ใช่ผล Passed หรือ Failed

## 1.4 เกณฑ์การเริ่มและสิ้นสุดการทดสอบ

### 1.4.1 เกณฑ์การเริ่มทดสอบ (Entry Criteria)

- ระบุ commit, configuration และ browser/OS ที่ใช้จริง โดยไม่บันทึก secret
- เริ่ม frontend/backend และ PostgreSQL pgvector บนฐานทดสอบแยกได้; /health ตอบ และตารางที่ backend ใช้พร้อม
- เตรียม fixture A1/S1/S2/S3/D1/D2/G1/U2, C1/C2, W1–W5, N1/N2 และไฟล์ valid/invalid ตาม [TEST-CASES.md](TEST-CASES.md)
- มีวิธีควบคุม AI provider และสถานที่เก็บหลักฐานที่ปกปิด token/ข้อมูลลับ
- ผู้รับผิดชอบอนุมัติ scope และกรณีทดสอบของรอบนั้น: TBD

### 1.4.2 เกณฑ์การสิ้นสุดการทดสอบ (Exit Criteria)

- มีผลและหลักฐานสำหรับ TC ทั้ง 48 หรือบันทึกเหตุผลของกรณีที่ข้าม/Blocked
- กรณี Priority สูง 31 ข้อมีผลครบ; เป้าหมายอัตราผ่านและการจัดการ defect ให้ผู้อนุมัติรอบทดสอบกำหนด: TBD
- ทุก FR มีผลอย่างน้อยหนึ่ง TC; defect สำคัญได้รับการแก้หรือมีการรับความเสี่ยงอย่างชัดเจน
- รายงานข้อ 2.1–2.8 กรอกผลจริงและผ่านการทบทวน

### 1.4.3 เกณฑ์การระงับและกลับมาทดสอบ (Suspension / Resumption)

ระงับกรณีที่ขึ้นกับ service เมื่อล็อกอินไม่ได้ ฐานข้อมูล/pgvector ไม่พร้อม fixture ปนข้อมูลจริง หรือ AI test double ใช้ไม่ได้ บันทึกเป็น Blocked พร้อมสาเหตุและเวลา กลับมาทดสอบเมื่อแก้ dependency แล้วผ่าน smoke check ที่เกี่ยวข้อง

## 1.5 สภาพแวดล้อมการทดสอบ

| รายการ | ค่าอ้างอิงจาก Repository | ค่าจริงในรอบทดสอบ |
|---|---|---|
| แอปพลิเคชัน | Next.js 16.2.12, React 19.2.4, FastAPI | TBD |
| Runtime | Node 22 / pnpm 9 / Python 3.11 ตาม CI | TBD |
| ฐานข้อมูล | pgvector/pgvector:pg15 ตาม docker-compose.yml | TBD |
| การเริ่มระบบ | docker compose up --build; backend เรียก Base.metadata.create_all ระหว่าง startup | TBD |
| URL/Port ค่าเริ่มต้น | Frontend 3000, Backend 8000, DB host 5433 | TBD |
| เวอร์ชัน/Commit | ต้องบันทึกก่อนรัน | TBD |
| Browser/OS | Repository ไม่ระบุรุ่นที่ต้องรับรอง | TBD |
| บัญชีทดสอบ | สร้างบนฐานทดสอบตาม role; ไม่ใช้ข้อมูลจริง | TBD |
| AI | test double สำหรับ Functional; smoke จริงแยก | TBD |
| ขนาดไฟล์ค่าเริ่มต้น | cover 5 MiB, document 25 MiB; environment override ได้ | TBD |

## 1.6 บทบาทหน้าที่และผู้รับผิดชอบ

| บทบาท | หน้าที่ | ผู้รับผิดชอบ |
|---|---|---|
| Test Manager | กำหนดรอบ ติดตาม entry/exit และสรุปผล | TBD |
| Tester | เตรียม fixture, execute TC, เก็บหลักฐานและเปิด defect | TBD |
| ผู้ดูแลสภาพแวดล้อม | ดูแลฐานทดสอบและ AI test double | TBD |
| Developer | วิเคราะห์/แก้ defect และส่ง commit สำหรับ retest | TBD |
| Approver | รับรองผลหรือรับความเสี่ยงคงค้าง | TBD |

## 1.7 กำหนดการทดสอบ (Test Schedule)

| กิจกรรม | วันที่เริ่ม | วันที่สิ้นสุด | ผู้รับผิดชอบ |
|---|---|---|---|
| เตรียมสภาพแวดล้อมและข้อมูลทดสอบ | TBD | TBD | TBD |
| ทดสอบรอบที่ 1: API/RBAC/Validation | TBD | TBD | TBD |
| ทดสอบรอบที่ 1: UI/Integration/E2E | TBD | TBD | TBD |
| แก้ไขข้อบกพร่อง | TBD | TBD | TBD |
| ทดสอบซ้ำและ Regression | TBD | TBD | TBD |
| จัดทำรายงานและสรุปผล | TBD | TBD | TBD |

## 1.8 ความเสี่ยงและแผนรองรับ (Risks & Mitigation)

ระดับผลกระทบ/โอกาสเป็นการประเมินสำหรับแผนทดสอบ ยังไม่ใช่ผล defect

| ความเสี่ยงจาก Implementation | ผลกระทบ | โอกาสเกิด | แผนรองรับ |
|---|---|---|---|
| GET /research/{id} และ /static/* ไม่มีการตรวจสถานะหรือสิทธิ์ของงาน | สูง | สูง | TC-018/034 ตรวจ URL ตรง; ให้เจ้าของระบบยืนยันนโยบายก่อนสรุป defect |
| หน้า /admin ตรวจเพียง session แต่ API admin ตรวจ role | กลาง | สูง | TC-048 ตรวจทั้งหน้าและ HTTP; แยก UI access จาก data access |
| หน้า /advisor/reviews ใช้ searchResearch ที่ให้ advisor เห็นงานทั้งหมด ต่างจาก /research/pending | กลาง | สูง | TC-036 เทียบ UI กับ API และบันทึกการมองเห็นจริง |
| role reviewer ปรากฏใน frontend แต่ backend require_role ไม่ให้ตรวจงาน | กลาง | สูง | ตรวจบัญชี role นี้แบบแยกชั้นก่อนใช้เป็น fixture หลัก |
| AI provider/pgvector ไม่พร้อม | กลาง | กลาง | mock provider, smoke check, บันทึก Blocked เมื่อ dependency ไม่พร้อม |
| ไม่มี migration file ใน Repository และ startup ใช้ create_all | กลาง | กลาง | ใช้ฐานใหม่แยก ตรวจ schema ก่อนรัน ห้าม reset ฐานจริง |
| ข้อมูล fixture/ไฟล์ค้างทำให้ผลรอบถัดไปเปลี่ยน | กลาง | กลาง | reset fixture ก่อนแต่ละ TC; เทียบ row/file ก่อนและหลัง |
| เวลาทดสอบจำกัด | สูง | กลาง | เรียง Priority สูงก่อน แต่บันทึก TC ที่ไม่ได้รันตามจริง |

## 1.9 สิ่งส่งมอบของการทดสอบ (Test Deliverables)

- แผนการทดสอบที่อนุมัติแล้วและ [TEST-CASES.md](TEST-CASES.md)
- ข้อมูล fixture บนฐานทดสอบพร้อมวิธี reset โดยไม่รวม credential ในเอกสาร
- Test Execution Log พร้อมหลักฐานที่ปกปิดข้อมูลลับ
- Defect Log, หลักฐาน retest และรายงานสรุปผลตามส่วนที่ 2

## 1.10 การอนุมัติแผนการทดสอบ

| บทบาท | ชื่อ-นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้จัดทำแผน | TBD | TBD | TBD |
| ผู้ทบทวน | TBD | TBD | TBD |
| ผู้อนุมัติ | TBD | TBD | TBD |

# ส่วนที่ 2: รายงานผลการทดสอบ (Test Summary Report)

## 2.1 ข้อมูลรอบการทดสอบ

| รายการ | รายละเอียด |
|---|---|
| รอบการทดสอบ (Test Cycle) | ☐ รอบที่ 1  ☐ รอบที่ 2 Regression  ☐ อื่น ๆ: TBD |
| ช่วงเวลาทดสอบ | TBD |
| เวอร์ชัน/Commit ที่ทดสอบ | TBD |
| สภาพแวดล้อม/Browser | TBD |
| ผู้ทดสอบ | TBD |
| สถานะรายงาน | ยังไม่มีการ Execute TC ตามเอกสารนี้ |

## 2.2 สรุปผลการทดสอบโดยรวม (Executive Summary)

ยังไม่มีผลทดสอบจริงของ TC-001–TC-048 รายงานนี้จึงเป็นแบบตั้งต้นสำหรับรอบที่จะทดสอบ ค่า Passed/Failed เป็น 0 เพราะยังไม่ได้ Execute ไม่ได้หมายถึงระบบผ่านการทดสอบ ข้อสังเกตจาก Source Code ในข้อ 1.8 ยังไม่ถือเป็น defect ที่ยืนยันแล้ว

| รายการ | จำนวน | ร้อยละของ TC ทั้งหมด |
|---|---:|---:|
| กรณีทดสอบทั้งหมดตามแผน | 48 | 100% |
| Positive ตามแผน | 32 | 66.7% |
| Negative ตามแผน | 16 | 33.3% |
| ดำเนินการแล้ว (Executed) | 0 | 0% |
| ผ่าน (Passed) | 0 | 0% |
| ไม่ผ่าน (Failed) | 0 | 0% |
| ข้าม/Blocked | 0 | 0% |
| ยังไม่ทดสอบ (Not Tested) | 48 | 100% |

### 2.2.1 ผลการทดสอบจำแนกตามกลุ่มฟังก์ชัน

| กลุ่มฟังก์ชัน | จำนวน TC | ทดสอบแล้ว | ผ่าน | ไม่ผ่าน | ข้าม/Blocked | Not Tested |
|---|---:|---:|---:|---:|---:|---:|
| บัญชีและโปรไฟล์ | 7 | 0 | 0 | 0 | 0 | 7 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | 6 | 0 | 0 | 0 | 0 | 6 |
| ค้นหา รายละเอียด และคำแนะนำ | 7 | 0 | 0 | 0 | 0 | 7 |
| ส่งผลงานและตรวจข้อมูล | 7 | 0 | 0 | 0 | 0 | 7 |
| ผลงานของฉัน การแก้ไข และไฟล์ | 8 | 0 | 0 | 0 | 0 | 8 |
| คิวและผลการตรวจ | 6 | 0 | 0 | 0 | 0 | 6 |
| Favorite และการแจ้งเตือน | 2 | 0 | 0 | 0 | 0 | 2 |
| AI | 3 | 0 | 0 | 0 | 0 | 3 |
| กระบวนการข้ามบทบาท E2E | 2 | 0 | 0 | 0 | 0 | 2 |
| รวม | 48 | 0 | 0 | 0 | 0 | 48 |

## 2.3 บันทึกผลการทดสอบรายกรณี (Test Execution Log)

บันทึกสถานะจากการรันจริงเท่านั้น: P=Passed, F=Failed, B=Blocked, S=Skipped, NT=Not Tested รหัส defect ระบุเมื่อมีหลักฐาน ไม่ใส่ข้อมูลลับลงช่องผลจริง

| รหัส | ชื่อกรณีทดสอบ | FR | สถานะ | ผลจริง/หลักฐาน | รหัสข้อบกพร่อง | ผู้ทดสอบ | วันที่ |
|---|---|---|---|---|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | FR-001 | NT | TBD | TBD | TBD | TBD |
| TC-002 | สมัคร email ซ้ำ | FR-001 | NT | TBD | TBD | TBD | TBD |
| TC-003 | ล็อกอินข้อมูลถูก | FR-002 | NT | TBD | TBD | TBD | TBD |
| TC-004 | รหัสผ่านผิด | FR-002 | NT | TBD | TBD | TBD | TBD |
| TC-005 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | FR-003 | NT | TBD | TBD | TBD | TBD |
| TC-006 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | FR-003 | NT | TBD | TBD | TBD | TBD |
| TC-007 | ล็อกอินแล้วออกจากระบบ | FR-004 | NT | TBD | TBD | TBD | TBD |
| TC-008 | admin CRUD ผู้ใช้ | FR-005 | NT | TBD | TBD | TBD | TBD |
| TC-009 | student เรียก API จัดการผู้ใช้ | FR-005 | NT | TBD | TBD | TBD | TBD |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | FR-006 | NT | TBD | TBD | TBD | TBD |
| TC-011 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | FR-006 | NT | TBD | TBD | TBD | TBD |
| TC-012 | admin แทนรายการตัวเลือก | FR-007 | NT | TBD | TBD | TBD | TBD |
| TC-013 | student เปลี่ยนตัวเลือก | FR-007 | NT | TBD | TBD | TBD | TBD |
| TC-014 | guest/student/admin ค้นงาน approved และ pending | FR-008 | NT | TBD | TBD | TBD | TBD |
| TC-015 | คำค้นมีหลายคำและบันทึก log | FR-008 | NT | TBD | TBD | TBD | TBD |
| TC-016 | คำแนะนำไม่เผยงาน pending | FR-009 | NT | TBD | TBD | TBD | TBD |
| TC-017 | latest/popular และสถิติ | FR-010 | NT | TBD | TBD | TBD | TBD |
| TC-018 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | FR-011 | NT | TBD | TBD | TBD | TBD |
| TC-019 | ID ไม่มีอยู่ | FR-011 | NT | TBD | TBD | TBD | TBD |
| TC-020 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | FR-012 | NT | TBD | TBD | TBD | TBD |
| TC-021 | รายชื่อผู้เขียน/ที่ปรึกษา | FR-013 | NT | TBD | TBD | TBD | TBD |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | FR-014 | NT | TBD | TBD | TBD | TBD |
| TC-023 | ไม่ล็อกอินหรือ role guest ส่งงาน | FR-014 | NT | TBD | TBD | TBD | TBD |
| TC-024 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | FR-015 | NT | TBD | TBD | TBD | TBD |
| TC-025 | ผู้เขียนคนละ prefix ปี | FR-015 | NT | TBD | TBD | TBD | TBD |
| TC-026 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | FR-016 | NT | TBD | TBD | TBD | TBD |
| TC-027 | นามสกุล/MIME/ลายเซ็นผิด | FR-016 | NT | TBD | TBD | TBD | TBD |
| TC-028 | ผู้ส่ง/author เห็นงานใน `/my` | FR-017 | NT | TBD | TBD | TBD | TBD |
| TC-029 | ผู้มีสิทธิ์แก้แล้วกลับ pending | FR-018 | NT | TBD | TBD | TBD | TBD |
| TC-030 | คนอื่นแก้งาน | FR-018 | NT | TBD | TBD | TBD | TBD |
| TC-031 | ส่งเอกสารใหม่หลัง `needs_revision` | FR-019 | NT | TBD | TBD | TBD | TBD |
| TC-032 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | FR-020 | NT | TBD | TBD | TBD | TBD |
| TC-033 | คนอื่นลบงาน | FR-020 | NT | TBD | TBD | TBD | TBD |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | FR-021 | NT | TBD | TBD | TBD | TBD |
| TC-035 | ไม่มี token หรือไม่มีไฟล์ | FR-021 | NT | TBD | TBD | TBD | TBD |
| TC-036 | admin/advisor/student ดู pending | FR-022 | NT | TBD | TBD | TBD | TBD |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | FR-023 | NT | TBD | TBD | TBD | TBD |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | FR-024 | NT | TBD | TBD | TBD | TBD |
| TC-039 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | FR-024 | NT | TBD | TBD | TBD | TBD |
| TC-040 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | FR-025 | NT | TBD | TBD | TBD | TBD |
| TC-041 | admin เปลี่ยน advisor; student ถูกห้าม | FR-026 | NT | TBD | TBD | TBD | TBD |
| TC-042 | บันทึกและยกเลิก favorite | FR-027 | NT | TBD | TBD | TBD | TBD |
| TC-043 | อ่านเฉพาะของตนและ mark read | FR-028 | NT | TBD | TBD | TBD | TBD |
| TC-044 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | FR-029 | NT | TBD | TBD | TBD | TBD |
| TC-045 | dashboard insight และ chat | FR-030 | NT | TBD | TBD | TBD | TBD |
| TC-046 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | FR-031 | NT | TBD | TBD | TBD | TBD |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | FR-032 | NT | TBD | TBD | TBD | TBD |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | FR-032 | NT | TBD | TBD | TBD | TBD |

## 2.4 บันทึกข้อบกพร่อง (Defect Log)

ยังไม่มีข้อบกพร่องจากการ Execute TC ชุดนี้ ข้อสังเกตในข้อ 1.8 เป็นความเสี่ยงจากการอ่านโค้ด ไม่ใช่ผลทดสอบ Failed

| รหัส | อ้างอิง TC | รายละเอียด/วิธีทำซ้ำ | ความรุนแรง | สถานะ | ผู้รับผิดชอบ | Commit/ผล Retest |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

ระดับความรุนแรงที่เสนอ: Critical = ระบบหลักใช้ไม่ได้หรือข้อมูลรั่วอย่างมีนัยสำคัญ; High = workflow หลัก/สิทธิ์ผิด; Medium = ฟังก์ชันรองผิดและมีทางเลี่ยง; Low = ข้อความหรือการแสดงผลคลาดเคลื่อน ผู้รับผิดชอบต้องยืนยันระดับของ defect ที่พบจริง

| สรุปข้อบกพร่อง | Critical | High | Medium | Low | รวม |
|---|---|---|---|---|---|
| จำนวนที่พบจาก TC รอบนี้ | TBD | TBD | TBD | TBD | TBD |
| แก้ไขแล้ว/ปิด | TBD | TBD | TBD | TBD | TBD |
| คงค้าง | TBD | TBD | TBD | TBD | TBD |

## 2.5 การวิเคราะห์ผลและข้อสังเกต

ผลจริง จุดที่ไม่ผ่าน สาเหตุ แนวโน้ม defect และข้อจำกัดของ environment: TBD หลัง Execute

## 2.6 การประเมินตามเกณฑ์สิ้นสุดการทดสอบ

| เกณฑ์จากข้อ 1.4.2 | ผลการประเมิน | หมายเหตุ |
|---|---|---|
| TC ทั้ง 48 มีผลหรือเหตุผลที่ข้าม | ยังประเมินไม่ได้ | 48 รายการเป็น NT |
| Priority สูง 31 ข้อมีผลครบ | ยังประเมินไม่ได้ | ยังไม่ Execute |
| ทุก FR มีผลอย่างน้อยหนึ่ง TC | ยังประเมินไม่ได้ | มีเพียง coverage เชิงแผน 32/32 |
| เป้าหมายอัตราผ่าน/defect สำคัญ | ยังประเมินไม่ได้ | เกณฑ์อนุมัติและผลจริงยังเป็น TBD |
| รายงานผลจริงพร้อมทบทวน | ยังประเมินไม่ได้ | ผู้ทดสอบ/commit/หลักฐานยังเป็น TBD |

## 2.7 ข้อสรุปและคำแนะนำ (Conclusion & Recommendation)

ผลการตัดสิน: ☐ ยอมรับระบบ  ☐ ยอมรับแบบมีเงื่อนไข  ☐ ไม่ยอมรับ  ☑ ยังไม่ตัดสิน เพราะยังไม่ได้ Execute

ข้อเสนอแนะ: ดำเนิน TC-001–TC-048 บนฐานทดสอบแยก บันทึกหลักฐานและ defect ตามข้อ 2.3–2.4 แล้วจึงประเมินข้อ 2.6 โดยผู้อนุมัติ

## 2.8 การลงนามรับรองผลการทดสอบ

| บทบาท | ชื่อ-นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้ทดสอบ (Tester) | TBD | TBD | TBD |
| หัวหน้าทีมทดสอบ (Test Manager) | TBD | TBD | TBD |
| ผู้พัฒนา (Developer) | TBD | TBD | TBD |
| ผู้อนุมัติ (Approver) | TBD | TBD | TBD |
