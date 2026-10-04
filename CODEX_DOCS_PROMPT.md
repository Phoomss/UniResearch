# TASK: วิเคราะห์ระบบและจัดทำเอกสารการทดสอบ

ให้เริ่มวิเคราะห์ Repository ปัจจุบันตั้งแต่ต้น โดยถือว่าไม่มีข้อมูลหรือเอกสารจากโปรเจกต์ก่อนหน้า

## ข้อกำหนดสำคัญ

- ใช้ข้อมูลจาก Repository ปัจจุบันเท่านั้น
- ห้ามอ้างอิงหรือ reuse ข้อมูลจากโปรเจกต์อื่น
- ห้ามเดา Feature, Role, API, Database หรือ Workflow
- ตรวจสอบ Implementation จริงก่อนจัดทำเอกสาร
- หากยืนยันข้อมูลไม่ได้ ให้ระบุ `TBD` หรือ `ไม่สามารถยืนยันได้`
- ห้ามแก้ไข Source Code ของระบบ
- ห้ามนำ Secret / Password / API Key มาใส่เอกสาร
- เอกสารทั้งหมดต้องเป็นภาษาไทย
- Technical Terms สามารถใช้ภาษาอังกฤษในวงเล็บได้
- ชื่อ API, Endpoint, Table, Field, Enum, Role, Function, Class และ Path ให้คงชื่อตาม Source Code

## ขั้นตอน

### 1. วิเคราะห์ระบบ

ตรวจสอบเฉพาะไฟล์ที่จำเป็น เช่น

- README
- package.json
- docker-compose.yml
- Dockerfile
- Frontend routes/pages
- Backend routes/controllers/services
- Authentication / Authorization / RBAC
- Database schema / migrations
- Models / Entities / Enums
- API
- Tests
- CI/CD
- เอกสารเดิมของโปรเจกต์

ไม่ต้องอ่าน:

- node_modules
- .next
- dist
- build
- coverage
- .git
- generated files

### 2. สรุประบบ

ระบุจาก Implementation จริง:

- วัตถุประสงค์ของระบบ
- Technology Stack
- Architecture
- Modules / Features
- User Roles
- Permissions
- Business Workflows
- Database
- API
- Authentication / Authorization
- Existing Tests

### 3. สร้าง Functional Requirements

ใช้รหัส:

FR-001
FR-002
FR-003
...

รูปแบบ:

| FR | Module | Requirement | Role | Evidence |
|---|---|---|---|---|

ทุก Requirement ต้องมีหลักฐานจาก Source Code

### 4. สร้าง Test Cases

ใช้รหัส:

TC-001
TC-002
TC-003
...

ครอบคลุมตามระบบจริง:

- Positive
- Negative
- Validation
- Authentication
- Authorization / RBAC
- Workflow
- API
- Integration
- E2E
- Boundary

ทุก Test Case ต้องเชื่อมกับ FR

### 5. สร้างเอกสาร

สร้างไว้ที่:

docs/system-audit/
├── README.md
├── SYSTEM-OVERVIEW.md
├── FUNCTIONAL-REQUIREMENTS.md
├── TEST-PLAN.md
├── TEST-CASES.md
├── TEST-REPORT.md
└── TRACEABILITY.md

เอกสารทั้งหมดเป็นภาษาไทย

## Test Plan

ให้ประกอบด้วย:

1. วัตถุประสงค์ของการทดสอบ
2. ขอบเขตการทดสอบ
   - In Scope
   - Out of Scope
3. กลยุทธ์และประเภทการทดสอบ
4. เกณฑ์การเริ่มทดสอบ (Entry Criteria)
5. เกณฑ์การสิ้นสุดการทดสอบ (Exit Criteria)
6. สภาพแวดล้อมการทดสอบ (Test Environment)
7. บทบาทและผู้รับผิดชอบ
8. กำหนดการทดสอบ
9. ความเสี่ยงและแผนรองรับ
10. สิ่งส่งมอบของการทดสอบ

## Test Cases

รูปแบบ:

| TC | FR | Module | กรณีทดสอบ | Priority | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|---|---|

Status เริ่มต้น = `Not Tested`

ห้ามระบุ Passed หากยังไม่ได้ Execute จริง

## Traceability

| FR | Requirement | Test Cases | Coverage |
|---|---|---|---|

ทุก FR ต้องมี Test Case รองรับ

ถ้าไม่มีให้ระบุ `Coverage Gap`

## Final Check

ก่อนจบงาน:

1. ตรวจ Repository ซ้ำ
2. ตรวจว่า Feature ตรงกับ Implementation
3. ตรวจ Role และ Permission
4. ตรวจ FR → TC
5. ตรวจ TC → FR
6. ตรวจ API และ Database ว่าไม่ได้เดา
7. ตรวจว่าไม่มีข้อมูลจากโปรเจกต์อื่นปะปน
8. ตรวจว่าไม่มี Secret
9. ตรวจว่าไม่มีผล Test ที่สร้างขึ้นเอง

หลังทำเสร็จแสดงเพียง:

- Modules ที่พบ
- Roles ที่พบ
- จำนวน FR
- จำนวน TC
- Coverage Gaps
- ไฟล์ที่สร้าง

ไม่ต้องพิมพ์เนื้อหาเอกสารทั้งหมดใน Terminal