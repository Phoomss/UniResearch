# 📊 UniResearch — Database Schema & DBML Diagram

เอกสารฉบับนี้ทำการวิเคราะห์โครงสร้างฐานข้อมูลของระบบ **UniResearch** และเขียนอธิบายความสัมพันธ์ออกมาในรูปแบบ **DBML (Database Markup Language)** ซึ่งคุณสามารถนำโค้ดในหัวข้อที่ 2 ไปกรอกในเว็บ [dbdiagram.io](https://dbdiagram.io) เพื่อสร้างเป็นแผนภาพไดอะแกรมฐานข้อมูล (ER-Diagram) แบบอินเตอร์แอคทีฟได้ทันที

---

## 1. การวิเคราะห์โครงสร้างตาราง (Table Analysis)

ฐานข้อมูลของ UniResearch ประกอบด้วย 12 ตารางหลัก แบ่งออกเป็น 4 กลุ่มฟังก์ชัน ดังนี้:

### กลุ่มที่ 1: ระบบผู้ใช้งานและการระบุสิทธิ์ (Identity & Access Control)
- **`users`**: เก็บข้อมูลผู้ใช้งานระบบ เช่น นักศึกษา อาจารย์ และแอดมิน แยกแยะสิทธิ์ด้วยคอลัมน์ `role`
- **`departments`**: ตารางเก็บรายชื่อสาขาวิชา/ภาควิชาในระบบ (ใช้สนับสนุนข้อมูลตัวเลือก)
- **`work_types`**: ตารางเก็บประเภทของผลงาน เช่น ปริญญานิพนธ์, งานวิจัย, บทความวิชาการ

### กลุ่มที่ 2: ระบบข้อมูลผลงานวิจัยและการส่งข้อมูล (Research & Submissions)
- **`research_works`**: ตารางหลักเก็บข้อมูลงานวิจัยทั้งหมด (ชื่อเรื่อง บทคัดย่อ ไฟล์เอกสาร และสถานะอนุมัติ)
- **`categories`**: ตารางเก็บข้อมูลหมวดหมู่ของผลงานวิจัย เช่น AI, Web Application, UX/UI
- **`research_authors`**: ตารางเชื่อมโยงความสัมพันธ์แบบ Many-to-Many ระหว่างผลงานวิจัยกับผู้ใช้ที่เป็นผู้แต่งผลงาน (`users`)
- **`research_advisors`**: ตารางเชื่อมโยงความสัมพันธ์แบบ Many-to-Many ระหว่างผลงานวิจัยกับอาจารย์ที่ปรึกษาที่เป็นผู้ดูแลผลงาน (`users`)

### กลุ่มที่ 3: ระบบการตรวจและประวัติการส่งงาน (Review & Version Control)
- **`file_revisions`**: บันทึกประวัติการส่งแก้ไขไฟล์เอกสารวิจัยย้อนหลังเมื่อส่งตรวจ
- **`review_comments`**: บันทึกความคิดเห็น ประวัติการตรวจประเมิน และผลลัพธ์จากบทบาทผู้ตรวจประเมิน

### กลุ่มที่ 4: การมีปฏิสัมพันธ์และประวัติการใช้งาน (Interactions & Logging)
- **`favorites`**: ตารางเก็บรายการผลงานที่ผู้ใช้บันทึกไว้เป็นรายการโปรด (Bookmark)
- **`download_view_logs`**: บันทึกประวัติเพื่อทำสถิติจำนวนการดาวน์โหลดและการเข้าเปิดชมผลงานวิจัย
- **`search_logs`**: บันทึกคำค้นหา (Keywords) เพื่อนำไปวิเคราะห์แนวโน้มที่กำลังได้รับความสนใจ

---

## 2. โค้ด DBML สำหรับใช้กับ dbdiagram.io

คัดลอกโค้ดด้านล่างนี้ไปวางในเครื่องมือออกแบบของ [dbdiagram.io](https://dbdiagram.io):

```dbml
// === 1. กลุ่มระบบผู้ใช้และการระบุสิทธิ์ (Identity & Access Control) ===

Table users {
  id int [pk, increment]
  email varchar [unique, not null]
  hashed_password varchar [not null]
  role varchar [default: 'guest', note: 'guest, student, advisor, admin']
  student_id varchar [null]
  department varchar [null]
  first_name varchar [null]
  last_name varchar [null]
  is_active boolean [default: true]
}

Table departments {
  id int [pk, increment]
  name varchar [unique, not null]
}

Table work_types {
  id int [pk, increment]
  name varchar [unique, not null]
}


// === 2. กลุ่มระบบข้อมูลผลงานและการจัดเก็บ (Research & Submissions) ===

Table research_works {
  id int [pk, increment]
  title_th varchar [not null]
  title_en varchar [not null]
  abstract text [null]
  category_id int [ref: > categories.id]
  department varchar [null]
  work_type varchar [null]
  academic_year int [null]
  keywords varchar [null]
  cover_image_path varchar [null]
  file_path varchar [null]
  status varchar [default: 'pending', note: 'pending, approved, rejected, needs_revision']
  view_count int [default: 0]
  download_count int [default: 0]
  published_at datetime [null]
  created_at datetime [default: `now()`]
  updated_at datetime [default: `now()`]
  submitted_by_id int [ref: > users.id]
}

Table categories {
  id int [pk, increment]
  category_name varchar [unique, not null]
  description varchar [null]
}

Table research_authors {
  id int [pk, increment]
  research_id int [ref: > research_works.id]
  user_id int [ref: > users.id]
  role_in_work varchar [default: 'primary', note: 'primary, co-author']
}

Table research_advisors {
  id int [pk, increment]
  research_id int [ref: > research_works.id]
  user_id int [ref: > users.id]
}


// === 3. กลุ่มประวัติการแก้ไขและความคิดเห็น (Review & Version Control) ===

Table file_revisions {
  id int [pk, increment]
  research_id int [ref: > research_works.id]
  file_path varchar [not null]
  version_no int [not null]
  uploaded_by int [ref: > users.id]
  uploaded_at datetime [default: `now()`]
}

Table review_comments {
  id int [pk, increment]
  research_id int [ref: > research_works.id]
  reviewer_id int [ref: > users.id]
  comment_text text [not null]
  status_result varchar [not null, note: 'approved, rejected, needs_revision']
  created_at datetime [default: `now()`]
}


// === 4. กลุ่มการปฏิสัมพันธ์และสถิติ (Interactions & Logging) ===

Table favorites {
  id int [pk, increment]
  user_id int [ref: > users.id]
  research_id int [ref: > research_works.id]
  saved_at datetime [default: `now()`]
}

Table download_view_logs {
  id int [pk, increment]
  research_id int [ref: > research_works.id]
  user_id int [ref: > users.id, null]
  action_type varchar [not null, note: 'view, download']
  action_at datetime [default: `now()`]
}

Table search_logs {
  id int [pk, increment]
  keyword varchar [not null]
  searched_at datetime [default: `now()`]
}
```
