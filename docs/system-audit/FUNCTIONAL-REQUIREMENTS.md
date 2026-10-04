# ความต้องการเชิงหน้าที่จาก Source Code

แต่ละแถวอธิบายพฤติกรรมที่ implementation รองรับ ไม่ได้เพิ่มนโยบายที่ยังไม่มีในโค้ด หลักฐานเป็น path ใน Repository ปัจจุบัน; การเข้าถึงจริงขึ้นกับเงื่อนไขใน router/service ตาม [ภาพรวมระบบ](SYSTEM-OVERVIEW.md)

| FR | Module | Requirement | Role | Evidence |
|---|---|---|---|---|
| FR-001 | บัญชี | `POST /auth/register` สร้างผู้ใช้ใหม่โดยกำหนด role เป็น `student` และปฏิเสธ email ซ้ำ | สาธารณะ | [auth.py](../../backend/app/routers/auth.py), [auth_service.py](../../backend/app/services/auth_service.py) |
| FR-002 | บัญชี | `POST /auth/login` ตรวจ email/password และคืน bearer token | สาธารณะ | [auth.py](../../backend/app/routers/auth.py), [auth_service.py](../../backend/app/services/auth_service.py) |
| FR-003 | บัญชี | `GET /auth/me` คืนข้อมูลผู้ใช้ active; `PUT /auth/me` แก้โปรไฟล์/รหัสผ่านและปฏิเสธ email ซ้ำ | ผู้ใช้ active | [auth.py](../../backend/app/routers/auth.py), [deps.py](../../backend/app/routers/deps.py) |
| FR-004 | บัญชี | Next.js login เก็บ token ใน HttpOnly cookie และ logout ลบ session | ผู้ใช้เว็บ | [session.ts](../../frontend/src/lib/api/session.ts), [login route](../../frontend/app/api/auth/login/route.ts), [logout route](../../frontend/app/api/auth/logout/route.ts) |
| FR-005 | ผู้ใช้ | `/users/` และ `/users/{user_id}` รองรับอ่าน สร้าง แก้ ลบผู้ใช้โดย admin | `admin` | [users.py](../../backend/app/routers/users.py) |
| FR-006 | หมวดหมู่ | `GET /categories/` อ่านได้สาธารณะ และ `POST /categories/` เพิ่มโดย admin | สาธารณะ/`admin` | [category.py](../../backend/app/routers/category.py) |
| FR-007 | ตัวเลือก | `GET /options/` อ่าน departments/work_types; `POST /options/` แทนรายการทั้งสองโดย admin | สาธารณะ/`admin` | [options.py](../../backend/app/routers/options.py) |
| FR-008 | ค้นหา | `/research/search` กรองข้อความ/หมวดหมู่และการเห็นงานตาม role; เก็บ `search_logs` เมื่อค้นข้อความ | สาธารณะ/ผู้ใช้ | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-009 | ค้นหา | `/research/search/suggestions` คืนชื่อ/คำสำคัญจากงาน `approved` | สาธารณะ | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-010 | ค้นหา | `/home/latest` และ `/home/popular` คืนงาน `approved` ตามวันเผยแพร่/ยอดดู; `/stats/` คืนยอดรวม | สาธารณะ | [home.py](../../backend/app/routers/home.py), [stats.py](../../backend/app/routers/stats.py) |
| FR-011 | ค้นหา | `/research/{research_id}` คืนรายละเอียดและเพิ่ม view_count; `/{research_id}/recommendations` คืนงานที่เกี่ยวข้อง | สาธารณะ | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-012 | ค้นหา | `/research/recommendations/personalized` จัดอันดับงาน approved จากประวัติผู้ใช้หรือความนิยม | สาธารณะ/ผู้ใช้ | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-013 | ส่งผลงาน | `/research/participants` คืน student/advisor ที่ active เพื่อเลือกผู้เกี่ยวข้อง | `admin`, `student`, `advisor` | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-014 | ส่งผลงาน | `POST /research/` สร้างงาน `pending` พร้อมผู้เขียน/ที่ปรึกษาและข้อมูลผลงาน | `admin`, `student`, `advisor` | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-015 | ส่งผลงาน | ตรวจ category, รูปแบบ `author_ids`/`advisor_ids`, role ของผู้เกี่ยวข้อง และ prefix ปีของ student_id ผู้เขียน | `admin`, `student`, `advisor` | [research_service.py](../../backend/app/services/research_service.py) |
| FR-016 | ไฟล์ | ตรวจชนิด นามสกุล ลายเซ็น และขนาดของภาพปก/เอกสารก่อนเก็บ; ล้างไฟล์ที่เพิ่งเก็บเมื่อการสร้าง/แก้ล้มเหลว | ผู้ส่ง/ผู้แก้ | [research_service.py](../../backend/app/services/research_service.py), [config.py](../../backend/app/core/config.py) |
| FR-017 | ผลงานของฉัน | `/research/my` คืนงานที่ผู้ใช้ส่งหรือเป็น author | ผู้ใช้ active | [research.py](../../backend/app/routers/research.py) |
| FR-018 | แก้ผลงาน | `PUT /research/{research_id}` อนุญาต admin/ผู้ส่ง/author และเปลี่ยนสถานะกลับ `pending` | `admin`, ผู้ส่ง, author | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-019 | แก้ผลงาน | เมื่อแก้งาน `needs_revision` พร้อมไฟล์ใหม่ เก็บไฟล์เดิมใน `file_revisions` | ผู้มีสิทธิ์แก้ | [research_service.py](../../backend/app/services/research_service.py) |
| FR-020 | ลบผลงาน | `DELETE /research/{research_id}` อนุญาต admin/ผู้ส่ง/author และลบข้อมูลสัมพันธ์/ไฟล์ที่เกี่ยวข้อง | `admin`, ผู้ส่ง, author | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-021 | ดาวน์โหลด | `POST /research/{research_id}/download` คืน URL เอกสารและเพิ่ม download_count/log เมื่อมีไฟล์ | ผู้ใช้ active | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-022 | ตรวจงาน | `/research/pending` คืนงาน pending ทั้งหมดให้ admin และเฉพาะงานที่มอบหมายให้ advisor | `admin`, `advisor` | [research.py](../../backend/app/routers/research.py) |
| FR-023 | ตรวจงาน | `/research/history` คืนงานที่ผู้ใช้ตรวจตามเงื่อนไขใน query | `admin`, `advisor` | [research.py](../../backend/app/routers/research.py) |
| FR-024 | ตรวจงาน | `POST /research/{research_id}/review` รับ `approved`, `rejected`, `needs_revision` เฉพาะงาน pending; advisor ต้องได้รับมอบหมาย | `admin`, advisor ที่ได้รับมอบหมาย | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py), [schema](../../backend/app/schemas/research.py) |
| FR-025 | ตรวจงาน | ผล `approved` ตั้ง `published_at`; การตรวจบันทึก comment/score และแจ้งผู้ส่งกับ author | ผู้ตรวจที่มีสิทธิ์ | [research_service.py](../../backend/app/services/research_service.py) |
| FR-026 | มอบหมาย | `POST /research/{research_id}/assign-advisors` แทนรายการ advisor ของงาน | `admin` | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-027 | Favorite | `POST /favorites/{research_id}` สลับบันทึก/ยกเลิก; `GET /favorites/` คืนรายการของผู้ใช้ | ผู้ใช้ active | [interactions.py](../../backend/app/routers/interactions.py) |
| FR-028 | แจ้งเตือน | อ่านแจ้งเตือนตนเอง อ่านหนึ่งรายการ หรืออ่านทั้งหมด | ผู้ใช้ active | [notification.py](../../backend/app/routers/notification.py), [notification_service.py](../../backend/app/services/notification_service.py) |
| FR-029 | AI | `/ai/generate-abstract`, `/suggest-titles`, `/suggest-keywords`, `/check-writing` ประมวลผลจาก request schema | ผู้มี token ถูกต้อง | [ai.py](../../backend/app/routers/ai.py), [AI schema](../../backend/app/schemas/ai.py) |
| FR-030 | AI | `/ai/dashboard-insights` ให้ insight จากข้อมูลที่ส่ง; `/ai/chat` ตอบพร้อมผลงานอ้างอิงที่ค้นได้ | insight: `admin`/`advisor`; chat: สาธารณะ | [ai.py](../../backend/app/routers/ai.py) |
| FR-031 | AI ตรวจงาน | endpoint `ai-pre-review`, `ai-plagiarism`, `ai-reviewer-match`, `ai-review-summary` ของงานเรียก service วิเคราะห์ | `admin`, `advisor` | [research.py](../../backend/app/routers/research.py), [research_service.py](../../backend/app/services/research_service.py) |
| FR-032 | หน้าเว็บ | มีหน้าค้นหา/รายละเอียด/ส่ง/แก้/รายการของฉัน/คิวตรวจ/จัดการ และ Next.js API proxy ส่งคำขอไป backend | ผู้ใช้ตาม route และ API | [frontend/app](../../frontend/app), [api client](../../frontend/src/lib/api/client.ts) |

ข้อสังเกต: FR-011 และ FR-021 อธิบายการเข้าถึงตามโค้ดปัจจุบัน ไม่ได้ยืนยันว่าเป็นนโยบายความเป็นส่วนตัวที่ต้องการ; ดูความเสี่ยงใน [TEST-PLAN.md](TEST-PLAN.md)
