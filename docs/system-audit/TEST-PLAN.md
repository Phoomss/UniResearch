# แผนการทดสอบ UniResearch

เนื้อหาส่วนที่ 1 ของ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md) ค่าจริงของรอบ Docker วันที่ 4 ตุลาคม 2026 อ้างอิง [หลักฐาน Docker](DOCKER-TEST-EVIDENCE-2026-10-04.md)

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
