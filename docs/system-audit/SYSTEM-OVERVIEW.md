# ภาพรวมระบบจาก Implementation

## วัตถุประสงค์และสถาปัตยกรรม

UniResearch เป็นเว็บสำหรับเก็บ ค้นหา ส่ง และตรวจผลงานวิจัย พร้อมข้อมูลผู้เกี่ยวข้อง การบันทึกผลงาน การแจ้งเตือน และเครื่องมือ AI หลักฐานคือ [frontend routes](../../frontend/app), [backend routers](../../backend/app/routers) และ [ResearchWork](../../backend/app/models/research.py) ระบบประกอบด้วย Next.js App Router (React/TypeScript) เป็น frontend และ route handler ที่เรียก FastAPI; FastAPI ใช้ SQLAlchemy async กับ PostgreSQL/pgvector และเก็บไฟล์อัปโหลดใน `STATIC_DIR` ([package.json](../../frontend/package.json), [requirements.txt](../../backend/requirements.txt), [main.py](../../backend/app/main.py), [docker-compose.yml](../../docker-compose.yml))

คำขอหลักไหลจากหน้าเว็บ → `/api/*` ของ Next.js → endpoint FastAPI → service → ฐานข้อมูลหรือไฟล์ static ส่วน AI ใช้ service ภายนอกตาม [ai_service.py](../../backend/app/services/ai_service.py) และค้นบริบทด้วย embedding ใน [ai.py](../../backend/app/routers/ai.py) การเริ่ม backend สร้างตารางจาก SQLAlchemy metadata และเติม `departments`/`work_types` หากว่าง; ไม่พบไฟล์ migration ใน Repository ([main.py](../../backend/app/main.py), [alembic.ini](../../backend/alembic.ini))

## โมดูลและหน้าที่พบ

| โมดูล | พฤติกรรมที่มีหลักฐาน |
|---|---|
| บัญชีและสิทธิ์ | สมัครเป็น `student`, ล็อกอินด้วย email/password, JWT, ดูและแก้โปรไฟล์; admin จัดการผู้ใช้ ([auth.py](../../backend/app/routers/auth.py), [users.py](../../backend/app/routers/users.py)) |
| ค้นพบผลงาน | ค้นข้อความ/หมวดหมู่, คำแนะนำค้นหา, ผลงานล่าสุด/ยอดนิยม, สถิติ, รายละเอียด, ผลงานแนะนำ ([research.py](../../backend/app/routers/research.py), [home.py](../../backend/app/routers/home.py), [stats.py](../../backend/app/routers/stats.py)) |
| ส่งและจัดการผลงาน | รายชื่อผู้เกี่ยวข้อง, สร้าง/แก้/ลบ, อัปโหลดภาพ/เอกสาร, ผลงานของฉัน, ดาวน์โหลด ([research_service.py](../../backend/app/services/research_service.py)) |
| ตรวจและมอบหมาย | คิว pending, ประวัติการตรวจ, ผล approved/rejected/needs_revision, มอบหมาย advisor โดย admin ([research.py](../../backend/app/routers/research.py)) |
| หมวดหมู่/ตัวเลือก | อ่านหมวดหมู่และตัวเลือกสาธารณะ; admin เพิ่มหมวดหมู่และแทนที่รายการตัวเลือก ([category.py](../../backend/app/routers/category.py), [options.py](../../backend/app/routers/options.py)) |
| การมีส่วนร่วม | บันทึก/ยกเลิก favorite, นับยอดดูและดาวน์โหลด, แจ้งเตือนของผู้ใช้ ([interactions.py](../../backend/app/routers/interactions.py), [notification.py](../../backend/app/routers/notification.py)) |
| AI | สร้างบทคัดย่อ/ชื่อ/คำสำคัญ, ตรวจการเขียน, insight, chat แบบ RAG และเครื่องมือช่วยตรวจผลงาน ([ai.py](../../backend/app/routers/ai.py), [research.py](../../backend/app/routers/research.py)) |

หน้าใช้งานหลักอยู่ที่ `/`, `/research`, `/research/[id]`, `/login`, `/register`, `/student/*`, `/advisor/*`, `/admin/*`, `/account/saved` ([frontend/app](../../frontend/app)) เส้นทาง `/dashboard/*` บางหน้า redirect ไปหน้าใหม่ตามโค้ดหน้าเว็บ

## Role และการอนุญาต

`users.role` เป็น String ค่าเริ่มต้น `guest`; โค้ดใช้ `guest`, `student`, `advisor`, `admin` และ frontend มีเงื่อนไข `reviewer` เพิ่มเติม แต่ไม่มี enum/ข้อจำกัดระดับ schema ([user.py](../../backend/app/models/user.py), [deps.py](../../backend/app/routers/deps.py), [advisor/layout.tsx](../../frontend/app/advisor/layout.tsx))

| การกระทำ | สิทธิ์ API ตามโค้ด |
|---|---|
| อ่านหมวดหมู่ ตัวเลือก สถิติ หน้า home ค้นหา/คำแนะนำ/คำแนะนำผลงาน รายละเอียด | ไม่บังคับ token; search กรอง `approved` สำหรับผู้ไม่ล็อกอินและ `student` ที่ไม่เกี่ยวข้อง |
| สมัครและล็อกอิน | สาธารณะ; สมัครบังคับ role เป็น `student` |
| โปรไฟล์ favorite notification ดาวน์โหลด | ผู้ใช้ active ที่ล็อกอิน |
| รายชื่อผู้เกี่ยวข้อง สร้าง/แก้/ลบผลงาน | `admin`, `student`, `advisor`; แก้/ลบต้องเป็น admin, ผู้ส่ง หรือ author |
| คิว/ประวัติตรวจ เครื่องมือ AI ของผลงาน | `admin`, `advisor`; คิว advisor กรองเฉพาะงานที่ได้รับมอบหมาย |
| บันทึกผลตรวจ | `admin`, `advisor`; advisor ต้องเป็น advisor ของงานและงานต้อง `pending` |
| ผู้ใช้ หมวดหมู่ใหม่ ตัวเลือกใหม่ มอบหมาย advisor | `admin` |
| AI สร้างเนื้อหา/ตรวจการเขียน | token ถูกต้องผ่าน `get_current_user`; ไม่มีการตรวจ `is_active` หรือ role ใน endpoint เหล่านี้ |
| AI dashboard insight | `admin`, `advisor`; AI chat ไม่บังคับ token |

ที่ frontend `/admin` ตรวจเพียง cookie session; `/advisor` ตรวจ role `advisor` หรือ `reviewer` แต่ backend ไม่ให้ `reviewer` ใช้ endpoint ตรวจงาน ([admin/layout.tsx](../../frontend/app/admin/layout.tsx), [advisor/layout.tsx](../../frontend/app/advisor/layout.tsx)) ในโหมดไม่ใช่ production มี development login สำหรับ alias สอง role ([development-session.ts](../../frontend/src/lib/auth/development-session.ts)); ไม่ควรใช้เป็นหลักฐานการอนุญาตของ backend

## ขั้นตอนงาน

1. สมัคร (`POST /auth/register`) ได้ `student`; ล็อกอิน (`POST /auth/login`) ได้ bearer token และ Next.js เก็บใน HttpOnly cookie ([auth.py](../../backend/app/routers/auth.py), [session.ts](../../frontend/src/lib/api/session.ts)).
2. ผู้มีสิทธิ์เลือก category/author/advisor และส่ง `multipart/form-data` ไป `POST /research/`; service ตรวจ ID, role, ปีรหัสนักศึกษา, ชนิด/ลายเซ็น/ขนาดไฟล์ แล้วบันทึกงานสถานะ `pending`; แจ้ง advisor ที่เลือก ([research_service.py](../../backend/app/services/research_service.py)).
3. Admin เห็น pending ทั้งหมด; advisor เห็น pending ที่ตนเป็น advisor; advisor ที่ได้รับมอบหมายหรือ admin ส่งผลตรวจ `approved`, `rejected`, `needs_revision` และระบบแจ้งผู้ส่ง/ผู้เขียน; `approved` ตั้ง `published_at` ([research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py)).
4. ผู้มีสิทธิ์แก้ผลงานแล้วสถานะกลับ `pending`; หากสถานะก่อนแก้เป็น `needs_revision` และแนบเอกสารใหม่ ระบบบันทึกไฟล์เก่าลง `file_revisions` ([research_service.py](../../backend/app/services/research_service.py)).

## ฐานข้อมูลและ API

ตารางที่นิยามใน models: `users`, `categories`, `departments`, `work_types`, `research_works`, `research_authors`, `research_advisors`, `file_revisions`, `review_comments`, `favorites`, `download_view_logs`, `search_logs`, `notifications` ([models](../../backend/app/models)) `research_works.embedding` เป็น `Vector(768)`; `status` เป็น String ค่าเริ่มต้น `pending` ไม่มี enum ฐานข้อมูล; รายการที่ review รับจริงคือ `approved`, `rejected`, `needs_revision` ([research.py model](../../backend/app/models/research.py), [research.py schema](../../backend/app/schemas/research.py)).

กลุ่ม API FastAPI ที่ต่อใน [main.py](../../backend/app/main.py): `/auth`, `/users`, `/categories`, `/options`, `/research`, `/favorites`, `/notifications`, `/home`, `/stats`, `/ai`; มี `/health`, `/swagger`, `/docs` และ `/static/*` รายละเอียด method/เส้นทางตรวจจากไฟล์ router ข้างต้น Next.js มี proxy ที่ [frontend/app/api](../../frontend/app/api) ซึ่งมี validation และ status บางอย่างต่างจาก backend จึงต้องทดสอบสองชั้นแยกกัน

### ตารางข้อมูลและความสัมพันธ์ที่ตรวจจาก models

| ตาราง | ฟิลด์/ความสัมพันธ์สำคัญ | หลักฐาน |
|---|---|---|
| `users` | `id`, `email` unique, `hashed_password`, `role`, `is_active`, `student_id`, `department` | [user.py](../../backend/app/models/user.py) |
| `categories` | `category_name` unique, `description` | [category.py](../../backend/app/models/category.py) |
| `departments`, `work_types` | `name` unique; ค่าเริ่มต้นเติมเมื่อว่าง | [options.py](../../backend/app/models/options.py), [main.py](../../backend/app/main.py) |
| `research_works` | ชื่อสองภาษา, abstract, category/submitter FK, status, file paths, counts, dates, `embedding Vector(768)` | [research.py](../../backend/app/models/research.py) |
| `research_authors`, `research_advisors` | เชื่อม `research_works` กับ `users`; author มี `role_in_work` | [research.py](../../backend/app/models/research.py) |
| `file_revisions`, `review_comments` | path/version/uploader และ reviewer/comment/status_result/score | [research.py](../../backend/app/models/research.py) |
| `favorites`, `download_view_logs`, `search_logs` | การบันทึกงาน การดู/ดาวน์โหลด และคำค้น | [interactions.py](../../backend/app/models/interactions.py) |
| `notifications` | `user_id`, `title`, `message`, `type`, `is_read`, `created_at` | [notification.py](../../backend/app/models/notification.py) |

ไม่มี enum ฐานข้อมูลสำหรับ `users.role` หรือ `research_works.status` จึงต้องแยกค่าที่ schema/router ตรวจจริงจาก comment ใน model และทดสอบ validation ตามจุดรับคำขอ

### รายการ FastAPI endpoint จาก routers

เครื่องหมาย `*` หมายถึงต้องมี token; การระบุ role ให้ดูคอลัมน์สิทธิ์ ไม่ตีความว่าหน้าเว็บที่เรียก endpoint มีสิทธิ์เท่ากัน

| Method | Endpoint | สิทธิ์ตาม router | หลักฐาน |
|---|---|---|---|
| POST | `/auth/register`, `/auth/login` | สาธารณะ | [auth.py](../../backend/app/routers/auth.py) |
| GET, PUT | `/auth/me` | ผู้ใช้ active* | [auth.py](../../backend/app/routers/auth.py) |
| GET, POST | `/users/` | `admin`* | [users.py](../../backend/app/routers/users.py) |
| GET, PUT, DELETE | `/users/{user_id}` | `admin`* | [users.py](../../backend/app/routers/users.py) |
| GET, POST | `/categories/` | GET สาธารณะ; POST `admin`* | [category.py](../../backend/app/routers/category.py) |
| GET, POST | `/options/` | GET สาธารณะ; POST `admin`* | [options.py](../../backend/app/routers/options.py) |
| GET | `/research/participants` | `admin`, `student`, `advisor`* | [research.py](../../backend/app/routers/research.py) |
| POST | `/research/` | `admin`, `student`, `advisor`* | [research.py](../../backend/app/routers/research.py) |
| GET | `/research/search`, `/research/search/suggestions`, `/research/recommendations/personalized` | สาธารณะ; token เป็นทางเลือกสำหรับบางรายการ | [research.py](../../backend/app/routers/research.py) |
| GET | `/research/my` | ผู้ใช้ active* | [research.py](../../backend/app/routers/research.py) |
| GET | `/research/pending`, `/research/history` | `admin`, `advisor`* | [research.py](../../backend/app/routers/research.py) |
| GET | `/research/{research_id}`, `/research/{research_id}/recommendations` | สาธารณะ | [research.py](../../backend/app/routers/research.py) |
| POST | `/research/{research_id}/download` | ผู้ใช้ active* | [research.py](../../backend/app/routers/research.py) |
| POST | `/research/{research_id}/review` | `admin`, `advisor`* และ service ตรวจเพิ่มเติม | [research.py](../../backend/app/routers/research.py) |
| POST | `/research/{research_id}/ai-pre-review`, `/ai-plagiarism`, `/ai-reviewer-match`, `/ai-review-summary` | `admin`, `advisor`* | [research.py](../../backend/app/routers/research.py) |
| PUT, DELETE | `/research/{research_id}` | `admin`, `student`, `advisor`*; service ตรวจเจ้าของ/author | [research.py](../../backend/app/routers/research.py) |
| POST | `/research/{research_id}/assign-advisors` | `admin`* | [research.py](../../backend/app/routers/research.py) |
| GET | `/favorites/` | ผู้ใช้ active* | [interactions.py](../../backend/app/routers/interactions.py) |
| POST | `/favorites/{research_id}` | ผู้ใช้ active* | [interactions.py](../../backend/app/routers/interactions.py) |
| GET | `/notifications/` | ผู้ใช้ active* | [notification.py](../../backend/app/routers/notification.py) |
| POST | `/notifications/{notification_id}/read`, `/notifications/read-all` | ผู้ใช้ active* | [notification.py](../../backend/app/routers/notification.py) |
| GET | `/home/latest`, `/home/popular`, `/stats/` | สาธารณะ | [home.py](../../backend/app/routers/home.py), [stats.py](../../backend/app/routers/stats.py) |
| POST | `/ai/generate-abstract`, `/ai/suggest-titles`, `/ai/suggest-keywords`, `/ai/check-writing` | token ถูกต้องผ่าน `get_current_user`* | [ai.py](../../backend/app/routers/ai.py) |
| POST | `/ai/dashboard-insights` | `admin`, `advisor`* | [ai.py](../../backend/app/routers/ai.py) |
| POST | `/ai/chat` | สาธารณะ | [ai.py](../../backend/app/routers/ai.py) |

Next.js route handler ที่ตรวจพบใน [frontend/app/api](../../frontend/app/api) ครอบคลุม auth, research, AI, users, categories, options, notifications และ assets; หลาย route เป็น proxy ที่ใช้ cookie ฝั่ง server แทนการส่ง token จาก browser โดยตรง ตัวอย่าง validation เพิ่มเติมคือ `/api/research/[id]` ปฏิเสธ ID ไม่ใช่จำนวนเต็มบวก และ `/api/assets` ต้องมี path ขึ้นต้น `static/` ([research route](../../frontend/app/api/research/[id]/route.ts), [assets route](../../frontend/app/api/assets/route.ts))

## ชุดทดสอบที่มีและข้อจำกัดที่พบ

มี pytest สำหรับ auth, research และการจัดเตรียม admin; Node test สำหรับสัญญา API/หน้า/responsive; Playwright สำหรับหน้า P0/P1 และ responsive ([backend/tests](../../backend/tests), [frontend/tests](../../frontend/tests), [frontend/e2e](../../frontend/e2e)) CI บน `develop` รัน pytest, typecheck, lint, Node test และ build; ไม่ได้รัน Playwright ([develop-ci.yml](../../.github/workflows/develop-ci.yml)).

ข้อจำกัดที่โค้ดชี้ให้ตรวจเพิ่ม: `GET /research/{id}` และ static asset ไม่มีการกรองสถานะหรือสิทธิ์; `POST /research/{id}/download` บังคับ login แต่ URL ไฟล์ที่ตอบกลับอยู่ใต้ static; `reviewer` frontend/backend ต่างกัน; `favorites` การยกเลิกใช้ `HTTPException(200)`; ไม่มีการยืนยันผล AI แบบคงที่เพราะพึ่งพา provider; `assign_advisors` ไม่ตรวจ role ของ ID ใหม่ใน service ([research_service.py](../../backend/app/services/research_service.py), [interactions.py](../../backend/app/routers/interactions.py), [ai.py](../../backend/app/routers/ai.py)).
