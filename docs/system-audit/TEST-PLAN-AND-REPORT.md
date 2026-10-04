# เทมเพลตเอกสารการทดสอบระบบ
## แผนการทดสอบ (Test Plan) และรายงานผลการทดสอบ (Test Report)
### UniResearch — คลังและกระบวนการจัดการผลงานวิจัย

แผนใช้ข้อกำหนดจาก Source Code ของ Repository ปัจจุบัน ส่วนผลรายงานใช้การรัน Docker วันที่ 4 ตุลาคม 2026 และ [หลักฐานรอบทดสอบ](DOCKER-TEST-EVIDENCE-2026-10-04.md) เอกสารตัวอย่าง SPRS ใช้เป็นแนวทางรูปแบบเท่านั้น

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
| แอปพลิเคชัน | Next.js 16.2.12, React 19.2.4, FastAPI | frontend production image และ backend development image จาก Docker build |
| Runtime | Node 22 / pnpm 9 / Python 3.11 ตาม CI | Node 22, pnpm 12.9.1 ใน image, Python 3.11 |
| ฐานข้อมูล | pgvector/pgvector:pg15 ตาม docker-compose.yml | SQLite ชั่วคราวสำหรับ API/E2E; PostgreSQL/pgvector:pg15 บน tmpfs สำหรับ smoke test |
| การเริ่มระบบ | docker compose up --build; backend เรียก Base.metadata.create_all ระหว่าง startup | `docker build` และ `docker run` แยก network ชั่วคราว; ไม่มีการใช้ Compose volume ปกติ |
| URL/Port ค่าเริ่มต้น | Frontend 3000, Backend 8000, DB host 5433 | localhost:13000 frontend, localhost:18080 backend/SQLite, localhost:18081 backend/PostgreSQL |
| เวอร์ชัน/Commit | ต้องบันทึกก่อนรัน | `67dfab6` พร้อมการปรับ E2E specs ใน working tree |
| Browser/OS | Repository ไม่ระบุรุ่นที่ต้องรับรอง | Chromium จาก Playwright 1.62.1 บน Docker; โฮสต์ macOS |
| บัญชีทดสอบ | สร้างบนฐานทดสอบตาม role; ไม่ใช้ข้อมูลจริง | admin, student 2 ราย, advisor, guest และ inactive ใน SQLite ชั่วคราว; fixture TC อื่นยังไม่ครบ |
| AI | test double สำหรับ Functional; smoke จริงแยก | ยังไม่มี AI test double ในรอบนี้; TC ที่ต้องใช้ข้าม |
| ขนาดไฟล์ค่าเริ่มต้น | cover 5 MiB, document 25 MiB; environment override ได้ | ใช้ไฟล์ PNG/PDF ขนาดเล็ก; ยังไม่ได้ทดสอบขอบเขตขนาด |

## 1.6 บทบาทหน้าที่และผู้รับผิดชอบ

| บทบาท | หน้าที่ | ผู้รับผิดชอบ |
|---|---|---|
| Test Manager | กำหนดรอบ ติดตาม entry/exit และสรุปผล | TBD |
| Tester | เตรียม fixture, execute TC, เก็บหลักฐานและเปิด defect | Narongsak, Sommai Kitikorn, Natthaporn (กำหนดตามแผน); Codex รัน Docker รอบ 4 ตุลาคม 2026 |
| ผู้ดูแลสภาพแวดล้อม | ดูแลฐานทดสอบและ AI test double | TBD |
| Developer | วิเคราะห์/แก้ defect และส่ง commit สำหรับ retest | TBD |
| Approver | รับรองผลหรือรับความเสี่ยงคงค้าง | TBD |

## 1.7 กำหนดการทดสอบ (Test Schedule)

| กิจกรรม | วันที่เริ่ม | วันที่สิ้นสุด | ผู้รับผิดชอบ |
|---|---|---|---|
| เตรียมสภาพแวดล้อมและข้อมูลทดสอบ | 4 ตุลาคม 2026 | 4 ตุลาคม 2026 | Codex (Docker; fixture บางส่วน) |
| ทดสอบรอบที่ 1: API/RBAC/Validation | 4 ตุลาคม 2026 | 4 ตุลาคม 2026 | Codex (17 TC ที่มีหลักฐานครบรวม Web/API) |
| ทดสอบรอบที่ 1: UI/Integration/E2E | 4 ตุลาคม 2026 | 4 ตุลาคม 2026 | Codex (Playwright 10 รายการ; TC อื่นยังข้าม) |
| แก้ไขข้อบกพร่อง | TBD | TBD | TBD |
| ทดสอบซ้ำและ Regression | TBD | TBD | TBD |
| จัดทำรายงานและสรุปผล | 4 ตุลาคม 2026 | 4 ตุลาคม 2026 | Codex; รอผู้รับผิดชอบทบทวน |

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
- Test Execution Log พร้อม [หลักฐาน Docker รอบ 4 ตุลาคม 2026](DOCKER-TEST-EVIDENCE-2026-10-04.md) ที่ไม่รวม credential
- Defect Log, หลักฐาน retest และรายงานสรุปผลตามส่วนที่ 2

## 1.10 การอนุมัติแผนการทดสอบ

| บทบาท | ชื่อ-นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้จัดทำแผน | TBD | TBD | TBD |
| ผู้ทบทวน | TBD | TBD | TBD |
| ผู้อนุมัติ | TBD | TBD | TBD |

# 1.10 การอนุมัติแผนการทดสอบ

| บทบาท | ชื่อ-นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้จัดทำแผน | TBD | TBD | TBD |
| ผู้ทบทวน | TBD | TBD | TBD |
| ผู้อนุมัติ | TBD | TBD | TBD |

# ส่วนที่ 2: รายงานผลการทดสอบ (Test Summary Report)

## 2.1 ข้อมูลรอบการทดสอบ

| รายการ | รายละเอียด |
|---|---|
| รอบการทดสอบ (Test Cycle) | ☑ รอบที่ 1  ☐ รอบที่ 2 Regression |
| ช่วงเวลาทดสอบ | 4 ตุลาคม 2026; วันที่ 1–4 ตุลาคมใน TEST-CASES.md เป็นกำหนดการของผู้ทดสอบ |
| เวอร์ชัน/Commit ที่ทดสอบ | `67dfab6` พร้อมการปรับ E2E specs ใน working tree |
| สภาพแวดล้อม/Browser | Docker Engine 29.1.5; backend Python 3.11; frontend Next.js 16.2.12 production; Playwright Chromium 1.62.1; SQLite ชั่วคราว และ PostgreSQL/pgvector smoke test |
| ผู้ดำเนินการรัน | Codex ผ่าน Docker; Narongsak, Sommai Kitikorn และ Natthaporn เป็นผู้ทดสอบที่กำหนดตามแผน ยังไม่มีหลักฐานว่ารันเอง |
| สถานะรายงาน | ผ่าน 17, ไม่ผ่าน 0, ข้าม 31 จาก 48 TC; ESLint quality gate ไม่ผ่าน |

## 2.2 สรุปผลการทดสอบโดยรวม (Executive Summary)

หลังเปิดใช้ Docker และรันบนข้อมูลทดสอบแยก ได้ผลผ่าน 17 TC และข้าม 31 TC เพราะยังไม่ได้เดินครบทุกขั้นตอนหรือ fixture ตามกรณีนั้น Backend pytest ผ่าน 40/40, frontend unit/contract ผ่าน 32/32, Playwright ผ่าน 10/10, TypeScript และ production build ผ่าน ส่วน ESLint ไม่ผ่านด้วย 16 errors และ 8 warnings ผลชุดอัตโนมัติไม่ใช้แทนผลผ่านราย TC โดยอัตโนมัติ รายละเอียดอยู่ใน [หลักฐาน Docker](DOCKER-TEST-EVIDENCE-2026-10-04.md)

| รายการ | จำนวน | ร้อยละของ TC ทั้งหมด |
|---|---:|---:|
| กรณีทดสอบทั้งหมดตามแผน | 48 | 100% |
| Positive ตามแผน | 32 | 66.7% |
| Negative ตามแผน | 16 | 33.3% |
| ดำเนินการแล้ว (Executed) | 17 | 35.4% |
| ผ่าน (Passed) | 17 | 35.4% |
| ไม่ผ่าน (Failed) | 0 | 0% |
| ข้าม/Blocked | 31 | 64.6% |
| ยังไม่ทดสอบ (Not Tested) | 0 | 0% |

### 2.2.1 ผลการทดสอบจำแนกตามกลุ่มฟังก์ชัน

| กลุ่มฟังก์ชัน | จำนวน TC | ทดสอบแล้ว | ผ่าน | ไม่ผ่าน | ข้าม/Blocked | Not Tested |
|---|---:|---:|---:|---:|---:|---:|
| บัญชีและโปรไฟล์ | 7 | 6 | 6 | 0 | 1 | 0 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | 6 | 4 | 4 | 0 | 2 | 0 |
| ค้นหา รายละเอียด และคำแนะนำ | 7 | 1 | 1 | 0 | 6 | 0 |
| ส่งผลงานและตรวจข้อมูล | 7 | 2 | 2 | 0 | 5 | 0 |
| ผลงานของฉัน การแก้ไข และไฟล์ | 8 | 3 | 3 | 0 | 5 | 0 |
| คิวและผลการตรวจ | 6 | 1 | 1 | 0 | 5 | 0 |
| Favorite และการแจ้งเตือน | 2 | 0 | 0 | 0 | 2 | 0 |
| AI | 3 | 0 | 0 | 0 | 3 | 0 |
| กระบวนการข้ามบทบาท E2E | 2 | 0 | 0 | 0 | 2 | 0 |
| รวม | 48 | 17 | 17 | 0 | 31 | 0 |

## 2.3 บันทึกผลการทดสอบรายกรณี (Test Execution Log)

P=ผ่านครบขั้นตอนที่ตรวจ, S=ข้ามเพราะหลักฐานของ TC ยังไม่ครบ, F=ไม่ผ่าน, NT=ยังไม่ได้จัดสถานะ ชื่อผู้ทดสอบใน TEST-CASES.md เป็นการจัดสรรตามแผน ไม่ใช่ชื่อผู้รัน Docker รอบนี้ ผลจริงด้านล่างตรวจซ้ำได้จาก [หลักฐาน Docker](DOCKER-TEST-EVIDENCE-2026-10-04.md)

| รหัส | ชื่อกรณีทดสอบ | FR | สถานะ | ผลจริง/หลักฐาน | รหัสข้อบกพร่อง | ผู้ทดสอบ | วันที่ |
|---|---|---|---|---|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | FR-001 | P | เว็บสมัครสำเร็จและไป /login?registered=1 โดยไม่มี session; ตรวจ /auth/me ของบัญชีเว็บและ API ที่ขอ role=admin แล้วทั้งสองบัญชีเป็น student (Playwright) | - | Codex (Docker) | 2026-10-04 |
| TC-002 | สมัคร email ซ้ำ | FR-001 | P | POST /auth/register ด้วย email ซ้ำตอบ 400; จำนวนแถว users ก่อนและหลังเท่ากัน | - | Codex (Docker) | 2026-10-04 |
| TC-003 | ล็อกอินข้อมูลถูก | FR-002 | P | เว็บล็อกอิน S1 ไป /account/saved; backend คืน bearer token และ /auth/me คืนบัญชี S1 | - | Codex (Docker) | 2026-10-04 |
| TC-004 | รหัสผ่านผิด | FR-002 | P | เว็บแสดงข้อความอีเมลหรือรหัสผ่านไม่ถูกต้อง คงอยู่หน้า /login และไม่มี session; backend ตอบ 400 | - | Codex (Docker) | 2026-10-04 |
| TC-005 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | FR-003 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-006 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | FR-003 | P | token ปลอมตอบ 401, ผู้ใช้ inactive ตอบ 400, เปลี่ยนเป็น email ซ้ำตอบ 400; email เดิมไม่เปลี่ยน | - | Codex (Docker) | 2026-10-04 |
| TC-007 | ล็อกอินแล้วออกจากระบบ | FR-004 | P | หลังล็อกอินมี HttpOnly session; POST /api/auth/logout ตอบ 200 และลบ cookie; เปิด /account/saved แล้วไป /login | - | Codex (Docker) | 2026-10-04 |
| TC-008 | admin CRUD ผู้ใช้ | FR-005 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-009 | student เรียก API จัดการผู้ใช้ | FR-005 | P | student เรียก GET/POST /users/ และ GET/PUT/DELETE /users/{id} ได้ 403 ทั้ง 5 คำขอ; ข้อมูลเป้าหมายไม่เปลี่ยน | - | Codex (Docker) | 2026-10-04 |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | FR-006 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-011 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | FR-006 | P | student เพิ่มหมวดหมู่ตอบ 403; รายการหมวดหมู่ก่อนและหลังเท่ากัน | - | Codex (Docker) | 2026-10-04 |
| TC-012 | admin แทนรายการตัวเลือก | FR-007 | P | admin แทน options ตอบ 200; GET และตารางฐานข้อมูลมีชื่อที่ trim แล้ว ไม่มีรายการว่างหรือค่าเก่า | - | Codex (Docker) | 2026-10-04 |
| TC-013 | student เปลี่ยนตัวเลือก | FR-007 | P | student แทน options ตอบ 403; รายการก่อนและหลังเท่ากัน | - | Codex (Docker) | 2026-10-04 |
| TC-014 | guest/student/admin ค้นงาน approved และ pending | FR-008 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-015 | คำค้นมีหลายคำและบันทึก log | FR-008 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-016 | คำแนะนำไม่เผยงาน pending | FR-009 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-017 | latest/popular และสถิติ | FR-010 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-018 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | FR-011 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-019 | ID ไม่มีอยู่ | FR-011 | P | API ของ ID ที่ไม่มีตอบ 404; หน้าเว็บแสดงข้อความไม่พบงาน; view log ของ ID นั้นมี 0 แถว | - | Codex (Docker) | 2026-10-04 |
| TC-020 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | FR-012 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-021 | รายชื่อผู้เขียน/ที่ปรึกษา | FR-013 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | FR-014 | P | เว็บส่งงานห้าขั้นสำเร็จ; DB มีงาน pending ของ S1 พร้อม author/advisor ตามที่เลือก; ไฟล์ PNG/PDF มีอยู่และลายเซ็นถูกต้อง ไม่มี draft | - | Codex (Docker) | 2026-10-04 |
| TC-023 | ไม่ล็อกอินหรือ role guest ส่งงาน | FR-014 | P | ไม่มี session เปิดหน้าส่งงานแล้วไป /login; POST ไม่มี token ตอบ 401 และ guest ตอบ 403; จำนวนงานไม่เพิ่ม | - | Codex (Docker) | 2026-10-04 |
| TC-024 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | FR-015 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-025 | ผู้เขียนคนละ prefix ปี | FR-015 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-026 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | FR-016 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-027 | นามสกุล/MIME/ลายเซ็นผิด | FR-016 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-028 | ผู้ส่ง/author เห็นงานใน `/my` | FR-017 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-029 | ผู้มีสิทธิ์แก้แล้วกลับ pending | FR-018 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-030 | คนอื่นแก้งาน | FR-018 | P | student คนอื่น PUT งานของ S2 ตอบ 403; ชื่อผลงานเดิมคงอยู่ | - | Codex (Docker) | 2026-10-04 |
| TC-031 | ส่งเอกสารใหม่หลัง `needs_revision` | FR-019 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-032 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | FR-020 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-033 | คนอื่นลบงาน | FR-020 | P | student คนอื่น DELETE งานของ S2 ตอบ 403; แถวยังคงอยู่ | - | Codex (Docker) | 2026-10-04 |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | FR-021 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-035 | ไม่มี token หรือไม่มีไฟล์ | FR-021 | P | download ไม่มี token ตอบ 401; งานไม่มีไฟล์ตอบ 404; download_count ไม่เพิ่ม | - | Codex (Docker) | 2026-10-04 |
| TC-036 | admin/advisor/student ดู pending | FR-022 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | FR-023 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | FR-024 | P | advisor ส่ง approved ผ่านหน้าเว็บพร้อม modal; DB บันทึก status=approved, reviewer_id=D1, score=80 และ comment ตรงที่กรอก | - | Codex (Docker) | 2026-10-04 |
| TC-039 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | FR-024 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-040 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | FR-025 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-041 | admin เปลี่ยน advisor; student ถูกห้าม | FR-026 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-042 | บันทึกและยกเลิก favorite | FR-027 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-043 | อ่านเฉพาะของตนและ mark read | FR-028 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-044 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | FR-029 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-045 | dashboard insight และ chat | FR-030 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-046 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | FR-031 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | FR-032 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | FR-032 | S | ข้ามในรอบ Docker: ยังไม่ได้ทำครบทุกขั้นตอนหรือเตรียม fixture ตาม TC นี้; ผลชุดย่อยยังไม่พอให้ตัดสินผ่าน/ไม่ผ่าน | - | - (planned in TEST-CASES.md) | 2026-10-04 |

## 2.4 บันทึกข้อบกพร่อง (Defect Log)

ไม่มี TC ที่ยืนยันว่าไม่ผ่านในรอบนี้ ข้อสังเกตในข้อ 1.8 ยังเป็นความเสี่ยงที่ต้องทดสอบเพิ่ม ส่วน ESLint ไม่ผ่านเป็น quality gate แยกจากผล TC

| รหัส | อ้างอิง TC | รายละเอียด/วิธีทำซ้ำ | ความรุนแรง | สถานะ | ผู้รับผิดชอบ | Commit/ผล Retest |
|---|---|---|---|---|---|---|
| ไม่มี defect ที่ยืนยันจาก TC รอบนี้ | - | - | - | - | - | - |

ระดับความรุนแรงที่เสนอ: Critical = ระบบหลักใช้ไม่ได้หรือข้อมูลรั่วอย่างมีนัยสำคัญ; High = workflow หลัก/สิทธิ์ผิด; Medium = ฟังก์ชันรองผิดและมีทางเลี่ยง; Low = ข้อความหรือการแสดงผลคลาดเคลื่อน ผู้รับผิดชอบต้องยืนยันระดับของ defect ที่พบจริง

| สรุปข้อบกพร่อง | Critical | High | Medium | Low | รวม |
|---|---|---|---|---|---|
| จำนวนที่พบจาก TC รอบนี้ | 0 | 0 | 0 | 0 | 0 |
| แก้ไขแล้ว/ปิด | 0 | 0 | 0 | 0 | 0 |
| คงค้าง | 0 | 0 | 0 | 0 | 0 |

## 2.5 การวิเคราะห์ผลและข้อสังเกต

กรณีที่ผ่านกระจุกอยู่ในบัญชี/RBAC และ workflow ส่งงาน/ตรวจงานพื้นฐาน ส่วน AI, favorite, notification และ E2E ข้ามบทบาทตาม TC-047–048 ยังไม่มีหลักฐานครบ รอบ API/E2E หลักใช้ SQLite ภายใน Docker; PostgreSQL/pgvector ตรวจการเริ่มระบบและ API พื้นฐานแล้วแต่ยังไม่ได้รัน TC ทั้ง 48 กับฐานชนิดนั้น ผล ESLint ไม่ผ่าน 16 errors/8 warnings ต้องแก้ก่อนใช้ quality gate นี้เป็นเกณฑ์รับระบบ

## 2.6 การประเมินตามเกณฑ์สิ้นสุดการทดสอบ

| เกณฑ์จากข้อ 1.4.2 | ผลการประเมิน | หมายเหตุ |
|---|---|---|
| TC ทั้ง 48 มีผลหรือเหตุผลที่ข้าม | ครบ | 17 ผ่าน และ 31 ข้ามพร้อมเหตุผล |
| Priority สูง 31 ข้อมีผลครบ | ไม่ครบ | ยังมี TC สำคัญที่ข้าม |
| ทุก FR มีผลอย่างน้อยหนึ่ง TC | ไม่ครบ | ครอบคลุมเชิงแผน 32/32 แต่ผลที่ผ่านยังไม่ครบทุก FR |
| เป้าหมายอัตราผ่าน/defect สำคัญ | ยังตัดสินไม่ได้ | เกณฑ์อนุมัติยังไม่กำหนด และ ESLint ไม่ผ่าน |
| รายงานผลจริงพร้อมทบทวน | พร้อมทบทวนบางส่วน | มี commit/สภาพแวดล้อม/ผล Docker แต่ 31 TC ยังข้าม และยังไม่มีผู้อนุมัติลงนาม |

## 2.7 ข้อสรุปและคำแนะนำ (Conclusion & Recommendation)

ผลการตัดสิน: ☐ ยอมรับระบบ  ☐ ยอมรับแบบมีเงื่อนไข  ☐ ไม่ยอมรับ  ☑ ยังไม่ตัดสิน เพราะ 31 TC ยังข้ามและ quality gate ของ ESLint ไม่ผ่าน

ข้อเสนอแนะ: รัน 31 TC ที่ข้ามด้วย fixture ครบ โดยเฉพาะงานค้นหา/AI/notification/E2E ข้ามบทบาทบน PostgreSQL/pgvector แยก แก้ ESLint 16 errors และรัน quality gate ซ้ำ จากนั้นให้ผู้รับผิดชอบประเมินเกณฑ์สิ้นสุดและลงนาม

## 2.8 การลงนามรับรองผลการทดสอบ

| บทบาท | ชื่อ-นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้ทดสอบ (Tester) | TBD | TBD | TBD |
| หัวหน้าทีมทดสอบ (Test Manager) | TBD | TBD | TBD |
| ผู้พัฒนา (Developer) | TBD | TBD | TBD |
| ผู้อนุมัติ (Approver) | TBD | TBD | TBD |
