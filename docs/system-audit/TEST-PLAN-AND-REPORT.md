# แผนการทดสอบและรายงานผลการทดสอบ UniResearch

| รายการ | ค่า |
|---|---|
| รหัสเอกสาร | UR-TPR-001 |
| รุ่น/สถานะ | 0.2 ฉบับร่าง; ยังไม่ดำเนินการทดสอบ |
| วันที่จัดทำ | 4 ตุลาคม 2026 |
| Source of Truth | Source Code ใน Repository ปัจจุบัน |

เอกสารนี้เป็นชุดแผนและรายงานผลสำหรับเปิดอ่านแยกจาก [เอกสารกรณีทดสอบ](TEST-CASES.md) โดยรวมเนื้อหาของ [TEST-PLAN.md](TEST-PLAN.md) และ [TEST-REPORT.md](TEST-REPORT.md) ไว้ในฉบับเดียว ข้อมูลผลทดสอบยังเป็น Not Tested ทุกกรณี

## สารบัญ

- [ส่วนที่ 1: แผนการทดสอบ](#ส่วนที่-1-แผนการทดสอบ)
- [ส่วนที่ 2: รายงานผลการทดสอบ](#ส่วนที่-2-รายงานผลการทดสอบ)
- [กรณีทดสอบรายข้อ](TEST-CASES.md)

---

## ส่วนที่ 1 แผนการทดสอบ
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

### 1. วัตถุประสงค์

ตรวจว่าพฤติกรรมตาม [FR-001–FR-032](FUNCTIONAL-REQUIREMENTS.md) ทำงานจริงทั้งระดับ FastAPI, Next.js proxy และหน้าเว็บ โดยเน้นสิทธิ์ ข้อมูลสัมพันธ์ ไฟล์ และสถานะงาน ตาม Source Code ปัจจุบัน

### 2. ขอบเขต

**In Scope:** บัญชี/JWT/session, role, ผู้ใช้, หมวดหมู่, ตัวเลือก, ค้นหา/รายละเอียด/คำแนะนำ, การส่ง/แก้/ลบ/ดาวน์โหลดงาน, คิว/ผลตรวจ, favorite, notification, AI endpoint แบบ mock provider, integration ระหว่างเว็บกับ API และ E2E เส้นทางหลัก

**Out of Scope:** คุณภาพเชิงความหมายของคำตอบ AI จริง, ประสิทธิภาพระดับ production, penetration test เต็มรูปแบบ, การ deploy บน Kubernetes/Terraform, เอกสารหรือ feature ที่ไม่มี implementation ยืนยัน และการทดสอบไฟล์ที่ generated

### 3. กลยุทธ์และประเภท

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

### 4. Entry Criteria

โค้ดและ dependency ของเวอร์ชันที่จะทดสอบพร้อม; backend/frontend เริ่มได้; มี PostgreSQL พร้อม pgvector และฐานข้อมูลทดสอบแบบใช้แล้วทิ้ง; มีข้อมูลตัวอย่าง category, student, advisor, admin และงานหลายสถานะ; มีวิธีแทน AI provider; ระบุผู้ทดสอบและเจ้าของผลทดสอบแล้ว

| จุดตรวจเริ่มงาน | วิธีตรวจ | สถานะก่อนเริ่มรอบจริง |
|---|---|---|
| ระบุ commit และ configuration ที่ไม่เปิดเผย secret | บันทึก commit hash, เวอร์ชัน runtime, feature flag | `TBD` |
| ฐานทดสอบแยกจาก production และรองรับ `Vector(768)` | ตรวจชื่อ target แบบปกปิดข้อมูลลับและสร้างตารางบนฐานใช้แล้วทิ้ง | `TBD` |
| ระบบตอบได้ | `/health`, หน้า `/`, API สำคัญ และ log startup | `TBD` |
| fixture พร้อม | บัญชี role หลัก, งาน `pending`/`approved`/`needs_revision`, category, PDF/ภาพถูกต้อง | `TBD` |
| วิธีบันทึกหลักฐานพร้อม | ที่เก็บ response, screenshot, query ผล, defect ID | `TBD` |

### 5. Exit Criteria

กรณี Priority สูงทั้งหมดมีผลและหลักฐาน; ทุก FR มีผลการทดสอบอย่างน้อยหนึ่ง TC; defect ระดับขัดขวาง/วิกฤตได้รับการจัดการหรือรับความเสี่ยงโดยเจ้าของระบบ; บันทึก failed/blocked พร้อมเหตุผล และออกรายงานผลจริง ตัวเลขเกณฑ์ผ่านเชิงร้อยละ: `TBD` เพราะ Repository ไม่กำหนด

**ระงับ/กลับมาทดสอบ:** ระงับเฉพาะกลุ่มกรณีที่ระบบเริ่มไม่ได้, DB/pgvector ใช้ไม่ได้, fixture ปนข้อมูลจริง หรือ provider จำเป็นไม่พร้อม; ระบุ `Blocked` พร้อมช่วงเวลา/สาเหตุ กลับมาทดสอบเมื่อแก้ dependency แล้วและรัน smoke check ซ้ำ ไม่ตีความ `Blocked` เป็น `Passed`

### 6. สภาพแวดล้อม

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

### 7. บทบาทและผู้รับผิดชอบ

ผู้ทดสอบ: `TBD`; ผู้ดูแลข้อมูลทดสอบ/สภาพแวดล้อม: `TBD`; ผู้แก้ defect backend/frontend: `TBD`; ผู้อนุมัติผลและรับความเสี่ยง: `TBD` ไม่มีข้อมูลมอบหมายบุคคลจาก Source Code

| หน้าที่ในรอบทดสอบ | งานที่รับผิดชอบ | ผู้รับผิดชอบ |
|---|---|---|
| ผู้ประสานรอบทดสอบ | กำหนด scope, entry/exit, ติดตามผล | `TBD` |
| ผู้ทดสอบ | เตรียม fixture, execute TC, เก็บหลักฐาน | `TBD` |
| ผู้ดูแลสภาพแวดล้อม | ฐานทดสอบ, runtime, mock provider | `TBD` |
| ผู้พัฒนา | วิเคราะห์/แก้ defect และส่ง commit ให้ retest | `TBD` |
| ผู้อนุมัติ | ตัดสินผลและรับความเสี่ยงคงค้าง | `TBD` |

### 8. กำหนดการ

วันเริ่ม/สิ้นสุด: `TBD` ลำดับเสนอให้ทำ environment และข้อมูล → API/RBAC/validation → integration/proxy → E2E → retest/report ระยะเวลาแต่ละช่วง: `TBD`

| กิจกรรม | เริ่ม | สิ้นสุด | ผู้รับผิดชอบ | เงื่อนไขส่งต่อ |
|---|---|---|---|---|
| เตรียม environment/fixture | `TBD` | `TBD` | `TBD` | ผ่าน entry criteria |
| API, RBAC, validation | `TBD` | `TBD` | `TBD` | บันทึกผลและ defect |
| Integration และ frontend proxy | `TBD` | `TBD` | `TBD` | จุดเชื่อมต่อพร้อม |
| E2E และ regression | `TBD` | `TBD` | `TBD` | ข้อขัดขวางหลักแก้แล้ว |
| สรุปและอนุมัติผล | `TBD` | `TBD` | `TBD` | ประเมิน exit criteria |

### 9. ความเสี่ยงและแผนรองรับ

| ความเสี่ยงจากโค้ด | แผนทดสอบ/รองรับ |
|---|---|
| `GET /research/{id}` และ static file ไม่มีการตรวจสิทธิ์หรือสถานะ | ทดสอบการเข้าถึงงาน pending ผ่าน URL ตรง; บันทึกผลเป็น defect หรือยืนยันนโยบายกับเจ้าของระบบก่อนเปลี่ยนข้อกำหนด ([research.py](../../backend/app/routers/research.py), [main.py](../../backend/app/main.py)) |
| Frontend รับ `reviewer` แต่ backend RBAC ไม่รับ | ทดสอบบัญชี role นี้แบบแยกชั้น; บันทึกความต่าง ([advisor/layout.tsx](../../frontend/app/advisor/layout.tsx), [deps.py](../../backend/app/routers/deps.py)) |
| `/admin` ตรวจเพียง session | ทดสอบการเปิดหน้าโดย non-admin และการปฏิเสธจาก API; แจ้ง defect หาก UI เปิดข้อมูลที่ไม่ควร ([admin/layout.tsx](../../frontend/app/admin/layout.tsx)) |
| การยกเลิก favorite ใช้ HTTPException สถานะ 200 | ตรวจทั้ง status และ body ตาม implementation ก่อนกำหนด acceptance ([interactions.py](../../backend/app/routers/interactions.py)) |
| AI และ pgvector พึ่งพาบริการ/ส่วนขยาย | mock AI ใน functional tests; แยก smoke test สภาพแวดล้อมจริงและบันทึก dependency failure |
| ไม่มี migration ใน Repository และ `create_all` ระหว่าง startup | ใช้ฐานทดสอบใหม่; ตรวจ schema ก่อนรัน; อย่าทดสอบบนฐานข้อมูลจริง ([main.py](../../backend/app/main.py)) |
| `assign_advisors` ไม่ตรวจ ID/role ใน service | ทดสอบ input ไม่ถูกและบันทึกพฤติกรรม/defect ตามผลจริง ([research_service.py](../../backend/app/services/research_service.py)) |

### 10. สิ่งส่งมอบ

เอกสารชุดนี้, test data ที่ไม่ใช่ข้อมูลจริง, log/หลักฐานการรัน, defect list, และรายงานผลที่กรอกหลัง execute ([TEST-REPORT.md](TEST-REPORT.md))

### 11. อนุมัติแผน

| บทบาท | ชื่อ | วันที่ | สถานะ |
|---|---|---|---|
| ผู้จัดทำ | `TBD` | `TBD` | รอ |
| ผู้ทบทวน | `TBD` | `TBD` | รอ |
| ผู้อนุมัติ | `TBD` | `TBD` | รอ |

---

## ส่วนที่ 2 รายงานผลการทดสอบ
| รายการควบคุมเอกสาร | ค่า |
|---|---|
| รหัสเอกสาร | UR-TR-001 |
| รุ่น/สถานะ | 0.2 ฉบับร่างก่อน Execute |
| วันที่จัดทำ | 4 ตุลาคม 2026 |
| รอบทดสอบ/ช่วงเวลา | TBD |
| commit, environment, ผู้ทดสอบ | TBD |

### 1. หลักการบันทึกผล

เอกสารนี้เป็นรายงานตั้งต้นจากการวิเคราะห์ Source Code ยังไม่ได้ execute TC-001–TC-048 ผลทุกกรณีเป็น Not Tested คำว่า Passed/Failed ใช้ได้ต่อเมื่อมีหลักฐานจากการรันจริง ผลของชุดทดสอบเดิมใน Repository ไม่ใช่ผลของ TC ชุดนี้

### 2. สรุปผลรวม

| ตัวชี้วัด | จำนวน | ร้อยละของ TC ทั้งหมด |
|---|---:|---:|
| กรณีทดสอบตามแผน | 48 | 100% |
| ดำเนินการแล้ว | 0 | 0% |
| Passed | 0 | 0% |
| Failed | 0 | 0% |
| Blocked/Skipped | 0 | 0% |
| Not Tested | 48 | 100% |

Coverage เชิงแผน: 32/32 FR มี TC เชื่อมโยง; execution coverage: 0/48 TC; เกณฑ์สิ้นสุดยังประเมินไม่ได้

#### 2.1 จำแนกตามโมดูล

| โมดูล | TC ตามแผน | ดำเนินการ | Passed | Failed | Blocked | Not Tested |
|---|---:|---:|---:|---:|---:|---:|
| AI | 2 | 0 | 0 | 0 | 0 | 2 |
| AI ตรวจงาน | 1 | 0 | 0 | 0 | 0 | 1 |
| E2E | 2 | 0 | 0 | 0 | 0 | 2 |
| Favorite | 1 | 0 | 0 | 0 | 0 | 1 |
| Revision | 1 | 0 | 0 | 0 | 0 | 1 |
| Validation | 2 | 0 | 0 | 0 | 0 | 2 |
| คำแนะนำ | 1 | 0 | 0 | 0 | 0 | 1 |
| คิวตรวจ | 1 | 0 | 0 | 0 | 0 | 1 |
| ค้นหา | 3 | 0 | 0 | 0 | 0 | 3 |
| ดาวน์โหลด | 2 | 0 | 0 | 0 | 0 | 2 |
| ตรวจงาน | 3 | 0 | 0 | 0 | 0 | 3 |
| ตัวเลือก | 2 | 0 | 0 | 0 | 0 | 2 |
| บัญชี | 6 | 0 | 0 | 0 | 0 | 6 |
| ประวัติตรวจ | 1 | 0 | 0 | 0 | 0 | 1 |
| ผลงานของฉัน | 1 | 0 | 0 | 0 | 0 | 1 |
| ผู้เกี่ยวข้อง | 1 | 0 | 0 | 0 | 0 | 1 |
| ผู้ใช้ | 2 | 0 | 0 | 0 | 0 | 2 |
| มอบหมาย | 1 | 0 | 0 | 0 | 0 | 1 |
| รายละเอียด | 2 | 0 | 0 | 0 | 0 | 2 |
| ลบผลงาน | 2 | 0 | 0 | 0 | 0 | 2 |
| ส่งผลงาน | 2 | 0 | 0 | 0 | 0 | 2 |
| หน้าหลัก | 1 | 0 | 0 | 0 | 0 | 1 |
| หมวดหมู่ | 2 | 0 | 0 | 0 | 0 | 2 |
| เว็บบัญชี | 1 | 0 | 0 | 0 | 0 | 1 |
| แก้ผลงาน | 2 | 0 | 0 | 0 | 0 | 2 |
| แจ้งเตือน | 1 | 0 | 0 | 0 | 0 | 1 |
| ไฟล์ | 2 | 0 | 0 | 0 | 0 | 2 |


#### 2.2 จำแนกตาม Priority

| Priority | TC ตามแผน | ดำเนินการ | Not Tested |
|---|---:|---:|---:|
| กลาง | 17 | 0 | 17 |
| สูง | 31 | 0 | 31 |

### 3. บันทึกผลรายกรณี

กรอกผลจริง วันเวลา ผู้ทดสอบ หลักฐาน และ defect หลัง Execute เท่านั้น หลักฐานอาจเป็น HTTP request/response ที่ปกปิด token, query ก่อนและหลัง, screenshot หรือ log ที่ตรวจซ้ำได้

| TC | FR | ชื่อกรณี | สถานะ | ผลจริง/หลักฐาน | Defect | ผู้ทดสอบ/วันที่ |
|---|---|---|---|---|---|---|
| TC-001 | FR-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | Not Tested | TBD | TBD | TBD |
| TC-002 | FR-001 | สมัคร email ซ้ำ | Not Tested | TBD | TBD | TBD |
| TC-003 | FR-002 | ล็อกอินข้อมูลถูก | Not Tested | TBD | TBD | TBD |
| TC-004 | FR-002 | รหัสผ่านผิด | Not Tested | TBD | TBD | TBD |
| TC-005 | FR-003 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | Not Tested | TBD | TBD | TBD |
| TC-006 | FR-003 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | Not Tested | TBD | TBD | TBD |
| TC-007 | FR-004 | ล็อกอินแล้วออกจากระบบ | Not Tested | TBD | TBD | TBD |
| TC-008 | FR-005 | admin CRUD ผู้ใช้ | Not Tested | TBD | TBD | TBD |
| TC-009 | FR-005 | student เรียก API จัดการผู้ใช้ | Not Tested | TBD | TBD | TBD |
| TC-010 | FR-006 | อ่านสาธารณะและเพิ่มโดย admin | Not Tested | TBD | TBD | TBD |
| TC-011 | FR-006 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | Not Tested | TBD | TBD | TBD |
| TC-012 | FR-007 | admin แทนรายการตัวเลือก | Not Tested | TBD | TBD | TBD |
| TC-013 | FR-007 | student เปลี่ยนตัวเลือก | Not Tested | TBD | TBD | TBD |
| TC-014 | FR-008 | guest/student/admin ค้นงาน approved และ pending | Not Tested | TBD | TBD | TBD |
| TC-015 | FR-008 | คำค้นมีหลายคำและบันทึก log | Not Tested | TBD | TBD | TBD |
| TC-016 | FR-009 | คำแนะนำไม่เผยงาน pending | Not Tested | TBD | TBD | TBD |
| TC-017 | FR-010 | latest/popular และสถิติ | Not Tested | TBD | TBD | TBD |
| TC-018 | FR-011 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | Not Tested | TBD | TBD | TBD |
| TC-019 | FR-011 | ID ไม่มีอยู่ | Not Tested | TBD | TBD | TBD |
| TC-020 | FR-012 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | Not Tested | TBD | TBD | TBD |
| TC-021 | FR-013 | รายชื่อผู้เขียน/ที่ปรึกษา | Not Tested | TBD | TBD | TBD |
| TC-022 | FR-014 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | Not Tested | TBD | TBD | TBD |
| TC-023 | FR-014 | ไม่ล็อกอินหรือ role guest ส่งงาน | Not Tested | TBD | TBD | TBD |
| TC-024 | FR-015 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | Not Tested | TBD | TBD | TBD |
| TC-025 | FR-015 | ผู้เขียนคนละ prefix ปี | Not Tested | TBD | TBD | TBD |
| TC-026 | FR-016 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | Not Tested | TBD | TBD | TBD |
| TC-027 | FR-016 | นามสกุล/MIME/ลายเซ็นผิด | Not Tested | TBD | TBD | TBD |
| TC-028 | FR-017 | ผู้ส่ง/author เห็นงานใน `/my` | Not Tested | TBD | TBD | TBD |
| TC-029 | FR-018 | ผู้มีสิทธิ์แก้แล้วกลับ pending | Not Tested | TBD | TBD | TBD |
| TC-030 | FR-018 | คนอื่นแก้งาน | Not Tested | TBD | TBD | TBD |
| TC-031 | FR-019 | ส่งเอกสารใหม่หลัง `needs_revision` | Not Tested | TBD | TBD | TBD |
| TC-032 | FR-020 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | Not Tested | TBD | TBD | TBD |
| TC-033 | FR-020 | คนอื่นลบงาน | Not Tested | TBD | TBD | TBD |
| TC-034 | FR-021 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | Not Tested | TBD | TBD | TBD |
| TC-035 | FR-021 | ไม่มี token หรือไม่มีไฟล์ | Not Tested | TBD | TBD | TBD |
| TC-036 | FR-022 | admin/advisor/student ดู pending | Not Tested | TBD | TBD | TBD |
| TC-037 | FR-023 | ผู้ตรวจเห็นประวัติของตน | Not Tested | TBD | TBD | TBD |
| TC-038 | FR-024 | advisor ที่ได้รับมอบหมายอนุมัติ pending | Not Tested | TBD | TBD | TBD |
| TC-039 | FR-024 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | Not Tested | TBD | TBD | TBD |
| TC-040 | FR-025 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | Not Tested | TBD | TBD | TBD |
| TC-041 | FR-026 | admin เปลี่ยน advisor; student ถูกห้าม | Not Tested | TBD | TBD | TBD |
| TC-042 | FR-027 | บันทึกและยกเลิก favorite | Not Tested | TBD | TBD | TBD |
| TC-043 | FR-028 | อ่านเฉพาะของตนและ mark read | Not Tested | TBD | TBD | TBD |
| TC-044 | FR-029 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | Not Tested | TBD | TBD | TBD |
| TC-045 | FR-030 | dashboard insight และ chat | Not Tested | TBD | TBD | TBD |
| TC-046 | FR-031 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | Not Tested | TBD | TBD | TBD |
| TC-047 | FR-032 | เว็บส่งงานแล้ว advisor ตรวจ | Not Tested | TBD | TBD | TBD |
| TC-048 | FR-032 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | Not Tested | TBD | TBD | TBD |

### 4. บันทึกข้อบกพร่อง

ยังไม่มีข้อบกพร่องจากการ execute TC ชุดนี้ ข้อสังเกตจากการอ่านโค้ดอยู่ใน TEST-PLAN.md และยังไม่ถือเป็นผล Failed

| รหัส defect | TC | อาการจริงและวิธีทำซ้ำ | ความรุนแรง | สถานะ | commit ที่แก้/ผล retest | เจ้าของ |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

เกณฑ์จัดความรุนแรงที่เสนอ: Critical = ใช้งานหลักไม่ได้หรือข้อมูลรั่วอย่างมีนัยสำคัญ; High = ขั้นตอนหลัก/สิทธิ์ผิด; Medium = ฟังก์ชันรองผิดแต่มีทางดำเนินงาน; Low = การแสดงผลหรือข้อความคลาดเคลื่อน การจัดระดับจริงให้ผู้รับผิดชอบยืนยัน

### 5. การวิเคราะห์ผลและข้อจำกัด

ผลสังเกตจากการรัน: TBD; สาเหตุกรณีไม่ผ่าน: TBD; แนวโน้ม defect: TBD; ข้อจำกัด environment: TBD

ข้อสังเกตจาก Source Code ที่ต้องตรวจ: backend ไม่ให้ role reviewer ตรวจงานแม้ frontend มีเงื่อนไข role นี้; /admin ตรวจเพียง session; GET รายละเอียดงานและ static file เปิดสาธารณะ; การยกเลิก favorite คืน HTTP 200 ผ่าน HTTPException ดูบริบทใน SYSTEM-OVERVIEW.md และ TEST-PLAN.md

### 6. ประเมินเกณฑ์สิ้นสุด

| เกณฑ์จากแผน | ผลประเมิน | หลักฐาน/เหตุผล |
|---|---|---|
| TC Priority สูงทุกกรณีมีผลและหลักฐาน | ยังประเมินไม่ได้ | ทุกกรณี Not Tested |
| ทุก FR มีผลอย่างน้อยหนึ่ง TC | ยังประเมินไม่ได้ | มีเพียง coverage เชิงแผน |
| Defect สำคัญได้รับการแก้หรือรับความเสี่ยง | ยังประเมินไม่ได้ | ยังไม่มีผล execute และผู้อนุมัติ |
| รายงานผลจริงพร้อม | ยังไม่ผ่านขั้นตอน | ข้อมูลรอบทดสอบเป็น TBD |

### 7. ข้อสรุปและการรับรอง

ผลตัดสินการทดสอบ: ยังไม่ตัดสิน; ข้อเสนอแนะ: Execute TC ตาม TEST-CASES.md บนฐานทดสอบแยก แล้วกรอกข้อมูลส่วน 2–6 ก่อนพิจารณารับระบบ

| บทบาท | ชื่อ | วันที่ | การรับรอง |
|---|---|---|---|
| ผู้ทดสอบ | TBD | TBD | รอ |
| ผู้ประสานการทดสอบ | TBD | TBD | รอ |
| ผู้พัฒนา/ผู้แก้ defect | TBD | TBD | รอ |
| ผู้อนุมัติ | TBD | TBD | รอ |

### 8. ชุดทดสอบอัตโนมัติที่มีอยู่

Repository มี backend/tests, frontend/tests และ frontend/e2e; CI บน develop รัน pytest, frontend typecheck/lint/Node test/build แต่ไม่ได้รัน Playwright ตาม .github/workflows/develop-ci.yml ผลรันล่าสุดของชุดเหล่านี้ ณ วันที่จัดทำ: ไม่สามารถยืนยันได้
