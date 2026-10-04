# แผนทดสอบ

| รายการควบคุมเอกสาร | ค่า |
|---|---|
| รหัสเอกสาร | UR-TP-001 |
| รุ่น | 0.2 ฉบับร่าง |
| วันที่จัดทำ | 4 ตุลาคม 2026 |
| อ้างอิงเวอร์ชันระบบ | commit/แท็กสำหรับรอบทดสอบ: `TBD` |
| ผู้จัดทำ/ผู้ทบทวน/ผู้อนุมัติ | `TBD` |
| สถานะ | รอทบทวน; ยังไม่ใช่ผลการทดสอบ |

| รุ่น | วันที่ | รายการแก้ไข |
|---|---|---|
| 0.1 | 4 ตุลาคม 2026 | วิเคราะห์ Source Code และจัดทำแผนเริ่มต้น |
| 0.2 | 4 ตุลาคม 2026 | เพิ่มรายละเอียดตามรูปแบบเอกสารทดสอบรายกรณีและรายงาน โดยไม่ยืมข้อกำหนดของระบบตัวอย่าง |

## 1. วัตถุประสงค์

ตรวจว่าพฤติกรรมตาม [FR-001–FR-032](FUNCTIONAL-REQUIREMENTS.md) ทำงานจริงทั้งระดับ FastAPI, Next.js proxy และหน้าเว็บ โดยเน้นสิทธิ์ ข้อมูลสัมพันธ์ ไฟล์ และสถานะงาน ตาม Source Code ปัจจุบัน

## 2. ขอบเขต

**In Scope:** บัญชี/JWT/session, role, ผู้ใช้, หมวดหมู่, ตัวเลือก, ค้นหา/รายละเอียด/คำแนะนำ, การส่ง/แก้/ลบ/ดาวน์โหลดงาน, คิว/ผลตรวจ, favorite, notification, AI endpoint แบบ mock provider, integration ระหว่างเว็บกับ API และ E2E เส้นทางหลัก

**Out of Scope:** คุณภาพเชิงความหมายของคำตอบ AI จริง, ประสิทธิภาพระดับ production, penetration test เต็มรูปแบบ, การ deploy บน Kubernetes/Terraform, เอกสารหรือ feature ที่ไม่มี implementation ยืนยัน และการทดสอบไฟล์ที่ generated

## 3. กลยุทธ์และประเภท

ใช้ API integration กับฐานข้อมูลทดสอบแยกสำหรับ positive/negative/validation/boundary และ RBAC; ใช้ test double สำหรับ AI เพื่อให้ผลทำซ้ำได้; ใช้ E2E ตรวจเส้นทาง student → advisor และ admin พร้อมตรวจ state ใน backend; ตรวจ frontend proxy และ cookie แยกจาก backend เพราะ validation/status ต่างกัน ประเภทและกรณีอยู่ใน [TEST-CASES.md](TEST-CASES.md)

| ระดับ/ประเภท | เป้าหมาย | วิธีและหลักฐาน | กรณีตัวอย่าง |
|---|---|---|---|
| API positive | ตรวจ response และผลบันทึกจริง | เรียก FastAPI โดยตรง; เก็บ HTTP response, query ก่อน/หลัง | TC-003, TC-022, TC-038 |
| API negative/RBAC | ตรวจการปฏิเสธทั้งไม่มี token และ role ไม่ถูก | ส่งคำขอตรงโดยไม่อาศัยการซ่อนปุ่มใน UI; ตรวจ status และฐานข้อมูลไม่เปลี่ยน | TC-006, TC-009, TC-023, TC-039 |
| Validation/boundary | ตรวจ schema, relation และขอบเขตไฟล์ | ชุด input ถูก/ผิด/ค่าขอบเขต; ตรวจไฟล์ค้างและ row count | TC-024–TC-027 |
| Integration | ตรวจ backend, PostgreSQL, static file, notification | เทียบ response กับตาราง/ไฟล์จริงในฐานทดสอบ | TC-031, TC-040, TC-043 |
| Frontend/proxy | ตรวจ session cookie, route handler, UI state | browser และคำขอ `/api/*`; ตรวจ redirect, HTTP และการแสดงผล | TC-007, TC-047, TC-048 |
| E2E | ตรวจขั้นตอนงานข้าม role | Playwright/manual browser กับข้อมูลทดสอบที่รู้ ID | TC-047, TC-048 |
| AI แบบควบคุม | ตรวจ contract/RBAC/fallback | mock provider; ตรวจโครงสร้างผล ไม่ตัดสินคุณภาพภาษา | TC-044–TC-046 |

**เกณฑ์ผ่านรายกรณี:** ผลที่สังเกตได้ตรงทุกข้อใน Expected Result ทั้ง HTTP/UI และ persistence ที่ระบุ; กรณีปฏิเสธต้องตรวจว่าไม่มี side effect; หากขึ้นกับบริการ AI/ฐานข้อมูล ให้แยกความผิดพลาดของ environment จาก defect ของฟังก์ชัน

## 4. Entry Criteria

โค้ดและ dependency ของเวอร์ชันที่จะทดสอบพร้อม; backend/frontend เริ่มได้; มี PostgreSQL พร้อม pgvector และฐานข้อมูลทดสอบแบบใช้แล้วทิ้ง; มีข้อมูลตัวอย่าง category, student, advisor, admin และงานหลายสถานะ; มีวิธีแทน AI provider; ระบุผู้ทดสอบและเจ้าของผลทดสอบแล้ว

| จุดตรวจเริ่มงาน | วิธีตรวจ | สถานะก่อนเริ่มรอบจริง |
|---|---|---|
| ระบุ commit และ configuration ที่ไม่เปิดเผย secret | บันทึก commit hash, เวอร์ชัน runtime, feature flag | `TBD` |
| ฐานทดสอบแยกจาก production และรองรับ `Vector(768)` | ตรวจชื่อ target แบบปกปิดข้อมูลลับและสร้างตารางบนฐานใช้แล้วทิ้ง | `TBD` |
| ระบบตอบได้ | `/health`, หน้า `/`, API สำคัญ และ log startup | `TBD` |
| fixture พร้อม | บัญชี role หลัก, งาน `pending`/`approved`/`needs_revision`, category, PDF/ภาพถูกต้อง | `TBD` |
| วิธีบันทึกหลักฐานพร้อม | ที่เก็บ response, screenshot, query ผล, defect ID | `TBD` |

## 5. Exit Criteria

กรณี Priority สูงทั้งหมดมีผลและหลักฐาน; ทุก FR มีผลการทดสอบอย่างน้อยหนึ่ง TC; defect ระดับขัดขวาง/วิกฤตได้รับการจัดการหรือรับความเสี่ยงโดยเจ้าของระบบ; บันทึก failed/blocked พร้อมเหตุผล และออกรายงานผลจริง ตัวเลขเกณฑ์ผ่านเชิงร้อยละ: `TBD` เพราะ Repository ไม่กำหนด

**ระงับ/กลับมาทดสอบ:** ระงับเฉพาะกลุ่มกรณีที่ระบบเริ่มไม่ได้, DB/pgvector ใช้ไม่ได้, fixture ปนข้อมูลจริง หรือ provider จำเป็นไม่พร้อม; ระบุ `Blocked` พร้อมช่วงเวลา/สาเหตุ กลับมาทดสอบเมื่อแก้ dependency แล้วและรัน smoke check ซ้ำ ไม่ตีความ `Blocked` เป็น `Passed`

## 6. สภาพแวดล้อม

อ้างอิง `docker-compose.yml`: Next.js ที่พอร์ต 3000, FastAPI 8000, PostgreSQL pgvector 15 ที่พอร์ต host 5433 ตามค่าเริ่มต้นที่กำหนดใน Compose; ฐานทดสอบต้องแยกจากข้อมูลจริง Frontend ใช้ Node 22/pnpm 9 และ backend ใช้ Python 3.11 ตาม CI ([workflow](../../.github/workflows/develop-ci.yml)) ขนาดอัปโหลดค่าเริ่มต้นภาพ 5 MiB/PDF 25 MiB ([config.py](../../backend/app/core/config.py)); ค่า deployment จริงอาจ override ได้

| ส่วนประกอบ | ค่าอ้างอิงจาก Repository | ค่าจริงรอบทดสอบ |
|---|---|---|
| Frontend | Next.js 16.2.12 / React 19.2.4; `pnpm dev` หรือ build ตาม CI | `TBD` |
| Backend | FastAPI / Python 3.11 ใน CI; `/health` | `TBD` |
| Database | PostgreSQL image `pgvector/pgvector:pg15` | `TBD` |
| Browser/OS | Repository ไม่กำหนดรุ่นที่ต้องรับรอง | `TBD` |
| AI | configuration ผ่าน environment; test double สำหรับ functional | `TBD` |
| เวอร์ชัน/commit | ต้องบันทึกก่อนรัน | `TBD` |

**ข้อมูลทดสอบขั้นต่ำ:** ผู้ใช้ `student` 2 คนที่รหัสนักศึกษามี prefix เดียวกันและอีกคนต่าง prefix, `advisor` 2 คน, `admin` 1 คน, ผู้ใช้ inactive 1 คน, category อย่างน้อย 2 รายการ, งาน approved/pending/needs_revision ที่มีเจ้าของต่างกัน, ภาพ JPG/PNG/WEBP และ PDF ที่มีลายเซ็นไฟล์จริง ชื่ออีเมลและรหัสผ่านให้สร้างเฉพาะใน environment ทดสอบและไม่บันทึกค่าในเอกสารนี้

## 7. บทบาทและผู้รับผิดชอบ

ผู้ทดสอบ: `TBD`; ผู้ดูแลข้อมูลทดสอบ/สภาพแวดล้อม: `TBD`; ผู้แก้ defect backend/frontend: `TBD`; ผู้อนุมัติผลและรับความเสี่ยง: `TBD` ไม่มีข้อมูลมอบหมายบุคคลจาก Source Code

| หน้าที่ในรอบทดสอบ | งานที่รับผิดชอบ | ผู้รับผิดชอบ |
|---|---|---|
| ผู้ประสานรอบทดสอบ | กำหนด scope, entry/exit, ติดตามผล | `TBD` |
| ผู้ทดสอบ | เตรียม fixture, execute TC, เก็บหลักฐาน | `TBD` |
| ผู้ดูแลสภาพแวดล้อม | ฐานทดสอบ, runtime, mock provider | `TBD` |
| ผู้พัฒนา | วิเคราะห์/แก้ defect และส่ง commit ให้ retest | `TBD` |
| ผู้อนุมัติ | ตัดสินผลและรับความเสี่ยงคงค้าง | `TBD` |

## 8. กำหนดการ

วันเริ่ม/สิ้นสุด: `TBD` ลำดับเสนอให้ทำ environment และข้อมูล → API/RBAC/validation → integration/proxy → E2E → retest/report ระยะเวลาแต่ละช่วง: `TBD`

| กิจกรรม | เริ่ม | สิ้นสุด | ผู้รับผิดชอบ | เงื่อนไขส่งต่อ |
|---|---|---|---|---|
| เตรียม environment/fixture | `TBD` | `TBD` | `TBD` | ผ่าน entry criteria |
| API, RBAC, validation | `TBD` | `TBD` | `TBD` | บันทึกผลและ defect |
| Integration และ frontend proxy | `TBD` | `TBD` | `TBD` | จุดเชื่อมต่อพร้อม |
| E2E และ regression | `TBD` | `TBD` | `TBD` | ข้อขัดขวางหลักแก้แล้ว |
| สรุปและอนุมัติผล | `TBD` | `TBD` | `TBD` | ประเมิน exit criteria |

## 9. ความเสี่ยงและแผนรองรับ

| ความเสี่ยงจากโค้ด | แผนทดสอบ/รองรับ |
|---|---|
| `GET /research/{id}` และ static file ไม่มีการตรวจสิทธิ์หรือสถานะ | ทดสอบการเข้าถึงงาน pending ผ่าน URL ตรง; บันทึกผลเป็น defect หรือยืนยันนโยบายกับเจ้าของระบบก่อนเปลี่ยนข้อกำหนด ([research.py](../../backend/app/routers/research.py), [main.py](../../backend/app/main.py)) |
| Frontend รับ `reviewer` แต่ backend RBAC ไม่รับ | ทดสอบบัญชี role นี้แบบแยกชั้น; บันทึกความต่าง ([advisor/layout.tsx](../../frontend/app/advisor/layout.tsx), [deps.py](../../backend/app/routers/deps.py)) |
| `/admin` ตรวจเพียง session | ทดสอบการเปิดหน้าโดย non-admin และการปฏิเสธจาก API; แจ้ง defect หาก UI เปิดข้อมูลที่ไม่ควร ([admin/layout.tsx](../../frontend/app/admin/layout.tsx)) |
| การยกเลิก favorite ใช้ HTTPException สถานะ 200 | ตรวจทั้ง status และ body ตาม implementation ก่อนกำหนด acceptance ([interactions.py](../../backend/app/routers/interactions.py)) |
| AI และ pgvector พึ่งพาบริการ/ส่วนขยาย | mock AI ใน functional tests; แยก smoke test สภาพแวดล้อมจริงและบันทึก dependency failure |
| ไม่มี migration ใน Repository และ `create_all` ระหว่าง startup | ใช้ฐานทดสอบใหม่; ตรวจ schema ก่อนรัน; อย่าทดสอบบนฐานข้อมูลจริง ([main.py](../../backend/app/main.py)) |
| `assign_advisors` ไม่ตรวจ ID/role ใน service | ทดสอบ input ไม่ถูกและบันทึกพฤติกรรม/defect ตามผลจริง ([research_service.py](../../backend/app/services/research_service.py)) |

## 10. สิ่งส่งมอบ

เอกสารชุดนี้, test data ที่ไม่ใช่ข้อมูลจริง, log/หลักฐานการรัน, defect list, และรายงานผลที่กรอกหลัง execute ([TEST-REPORT.md](TEST-REPORT.md))

## 11. อนุมัติแผน

| บทบาท | ชื่อ | วันที่ | สถานะ |
|---|---|---|---|
| ผู้จัดทำ | `TBD` | `TBD` | รอ |
| ผู้ทบทวน | `TBD` | `TBD` | รอ |
| ผู้อนุมัติ | `TBD` | `TBD` | รอ |
