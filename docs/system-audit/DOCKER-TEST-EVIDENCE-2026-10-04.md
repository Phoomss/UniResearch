# หลักฐานรอบทดสอบ Docker — 4 ตุลาคม 2026

Commit ที่ใช้: `67dfab6` (มีการแก้เอกสารและตัวตรวจ E2E ใน working tree ระหว่างรอบ)  
ผู้ดำเนินการรันคำสั่ง: Codex; ชื่อ Narongsak, Sommai Kitikorn และ Natthaporn ใน TEST-CASES.md เป็นผู้ทดสอบที่กำหนดตามแผน ยังไม่ใช่การรับรองว่าแต่ละคนรันกรณีนั้นจริง

## สภาพแวดล้อม

- Docker Engine 29.1.5 บน macOS; สร้าง network `uniresearch_tc_20261004` และ container ชั่วคราวแยกจาก Compose volume ปกติ
- Backend Python 3.11/FastAPI จาก `uniresearch-backend:latest`; frontend Next.js 16.2.12 จาก Docker development image สำหรับ unit test และ production image สำหรับ browser test
- Backend สำหรับ API/E2E ใช้ SQLite ชั่วคราวใน container; ไม่มีการ mount ฐานข้อมูลหรือไฟล์อัปโหลดจากเครื่องโฮสต์
- Browser test ใช้ Chromium ใน `mcr.microsoft.com/playwright:v1.62.1-noble` กับบัญชี/ผลงานทดสอบที่สร้างเฉพาะรอบนี้
- ตรวจ PostgreSQL แยกด้วย `pgvector/pgvector:pg15` บน tmpfs: backend `/health` ตอบ 200, extension `vector` และตาราง 13 รายการถูกสร้าง, สมัคร/ล็อกอิน/`/auth/me`/`/options/` ตอบ 200

## ผลชุดอัตโนมัติ

| ชุดตรวจ | ผล | ขอบเขต |
|---|---|---|
| Backend `pytest backend/tests` ใน Docker | 40 ผ่าน, 0 ไม่ผ่าน | SQLite in-memory ต่อกรณี |
| Frontend `pnpm test` ใน Docker | 32 ผ่าน, 0 ไม่ผ่าน | unit/contract และการตรวจ source |
| Playwright `p0-pages.spec.mjs` + `p1-pages.spec.mjs` ใน Docker | 10 ผ่าน, 0 ไม่ผ่าน | frontend production + backend/SQLite ชั่วคราว |
| `pnpm typecheck` | ผ่าน | TypeScript |
| Docker production build ของ frontend | ผ่าน | Next.js build |
| `pnpm lint` | ไม่ผ่าน: 16 errors, 8 warnings | ส่วนใหญ่เป็น `no-explicit-any` และตัวแปรไม่ได้ใช้; ดู output ESLint รอบนี้ |

ผลการรันชุดอัตโนมัติไม่เท่ากับผ่าน TC ทั้ง 48 กรณี เพราะแต่ละ TC มีขั้นตอนและ fixture มากกว่าชุดอัตโนมัติบางรายการ สถานะราย TC จึงพิจารณาแยกตามหลักฐานด้านล่าง

## หลักฐานรายพฤติกรรมที่ตรวจเพิ่ม

- TC-001: สมัครจากเว็บแล้วไป `/login?registered=1` โดยไม่มี session; ล็อกอินบัญชีใหม่นี้แล้ว `/auth/me` คืน role=`student`; API ที่ขอ role=`admin` ก็คืน `student`
- TC-002: สมัคร email ซ้ำตอบ 400; จำนวน users ก่อน/หลังเท่ากัน
- TC-006: token ปลอมตอบ 401, บัญชี inactive ตอบ 400, เปลี่ยนเป็น email ซ้ำตอบ 400 และ email เดิมคงอยู่
- TC-009: student เรียก GET/POST `/users/` และ GET/PUT/DELETE `/users/{id}` ตอบ 403 ทั้ง 5 คำขอ; ข้อมูลเป้าหมายไม่เปลี่ยน
- TC-011/013: student ส่ง POST `/categories/` และ `/options/` ตอบ 403; snapshot หลังคำขอตรงกับก่อนส่ง
- TC-012: admin แทน options สำเร็จ; GET และตารางฐานข้อมูลเหลือ departments `Test CS`, `Test IS` และ work type `Thesis`; whitespace ถูก trim และรายการว่างไม่ถูกเก็บ
- TC-019: API ของ ID ที่ไม่มีตอบ 404; หน้าเว็บแสดงข้อความไม่พบงาน; view log ของ ID นั้นมี 0 แถว
- TC-022: Playwright ส่งงานผ่านห้าขั้น; แถวล่าสุดเป็น `pending`, `submitted_by_id=2`, author=2, advisor=3; ไฟล์ PNG/PDF มีอยู่และมีลายเซ็นไฟล์ถูกต้อง
- TC-023: หน้าส่งงานโดยไม่มี session พาเบราว์เซอร์ไป `/login?next=...`; POST multipart ที่มีฟิลด์งานครบโดยไม่มี token ตอบ 401, guest ตอบ 403, จำนวนงานคงที่ 7 แถว
- TC-030/033: student คนอื่น PUT/DELETE งานของ S2 ตอบ 403; ชื่อและแถวยังคงอยู่
- TC-035: download ไม่มี token ตอบ 401, งานไม่มีไฟล์ตอบ 404 และ counter ไม่เพิ่ม
- TC-038: advisor ส่ง approved ผ่านหน้าเว็บ; ฐานข้อมูลบันทึก reviewer=3, status=`approved`, score=80 และ comment ตามที่กรอก

ภาพจาก Chromium รอบนี้: [หน้าไม่พบงานวิจัย](evidence/research-not-found.png) และ [หน้าจัดการหมวดหมู่ของ admin](evidence/admin-categories.png)

## ข้อจำกัดและการแปลผล

- กรณีอื่นที่ไม่ได้เดินครบทุกขั้นตอน/fixture ถูกระบุเป็น “ข้าม” แม้บาง endpoint จะถูกแตะโดย pytest หรือ Playwright; ไม่ใช้ผลชุดย่อยแทนผลผ่านทั้ง TC
- รอบ E2E/API หลักใช้ SQLite; PostgreSQL/pgvector ได้รับ smoke test แต่ยังไม่ได้รัน TC ทั้ง 48 กับ PostgreSQL
- ชุด E2E เดิมมี selector และข้อความจากหน้าเก่า จึงปรับ `p0-pages.spec.mjs` และ `p1-pages.spec.mjs` ให้ตรวจ UI ปัจจุบันก่อนรอบยืนยัน 10/10
- ผล lint เป็น quality gate ที่ไม่ผ่าน แยกจากสถานะ TC เพราะไม่ได้เป็นขั้นตอนผลที่คาดหวังของ TC ใดโดยตรง
- หลังเก็บผลได้หยุดและลบ container/network ชั่วคราวทั้งหมดแล้ว; ภาพหลักฐานและเอกสารยังอยู่ใน repository
