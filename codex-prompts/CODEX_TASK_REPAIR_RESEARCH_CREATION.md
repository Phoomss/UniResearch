# Codex Task: Fully Diagnose and Repair Research Creation

## Role

ทำหน้าที่เป็น Senior Full-Stack Engineer และ Debugging Engineer รับผิดชอบตรวจสอบ แก้ไข เชื่อมต่อ ทดสอบ และสรุปผลฟังก์ชัน “เพิ่มงานวิจัย” ของระบบ UniResearch

ทำงานใน Repository:

```text
D:\Project-69\UniResearch
```

ขณะนี้มีการสร้างหน้าและพยายามเชื่อมระบบแล้ว แต่ผู้ใช้ยังไม่สามารถเพิ่มงานวิจัยได้จริง

ให้ถือว่า Implementation ปัจจุบันอาจมีปัญหาได้ทุกส่วน ได้แก่:

* ปุ่มเริ่มเพิ่มงานวิจัย
* Frontend Route
* Form Workflow
* Form State
* Validation
* Authentication
* Authorization
* API Client
* Environment Variables
* Backend Route
* Backend Schema
* Database Model
* Database Migration
* File Upload
* Storage
* CORS
* Error Handling
* Response Mapping
* Research Detail หรือ Research List หลังสร้างสำเร็จ

ห้ามสรุปว่าสาเหตุอยู่ที่ปุ่มหรือ Frontend เพียงอย่างเดียวจนกว่าจะตรวจสอบจากโค้ดและผลการรันจริง

ห้ามหยุดหลังจากวิเคราะห์หรือสร้างแผน ต้องดำเนินการต่อจนถึงการแก้ไข ทดสอบ และจัดทำรายงาน

---

# เป้าหมาย

ทำให้ผู้ใช้ที่มีสิทธิ์สามารถทำ Workflow ต่อไปนี้ได้จริง:

1. เข้าสู่ระบบ
2. มองเห็นปุ่มหรือเมนูเพิ่มงานวิจัย
3. กดเข้าสู่หน้าส่งงานวิจัย
4. กรอกข้อมูลที่ Backend รองรับ
5. เพิ่มผู้จัดทำ
6. ระบุอาจารย์ที่ปรึกษา
7. กรอกบทคัดย่อและคำสำคัญ
8. เลือกหมวดหมู่หรือข้อมูลที่เกี่ยวข้อง
9. อัปโหลดภาพหน้าปก
10. อัปโหลดเอกสาร PDF
11. ตรวจสอบข้อมูลก่อนส่ง
12. ส่งข้อมูลไปยัง Backend จริง
13. บันทึกข้อมูลลงฐานข้อมูลจริง
14. บันทึกไฟล์ตามระบบ Storage จริง
15. ได้รับ Success Response จริง
16. เปิดดูงานวิจัยที่เพิ่มสำเร็จได้
17. เห็นรายการใหม่ในหน้ารายการงานวิจัย หากระบบรองรับ

ห้ามใช้ Mock API, Mock Data หรือ Fake Success State ใน Production Code

---

# กฎสำคัญ

## Source of Truth

ให้ใช้ลำดับความสำคัญดังนี้:

1. Business rules และ Backend contract ที่มีอยู่จริง
2. Database model และ schema ที่มีอยู่จริง
3. Frontend architecture และ convention ปัจจุบัน
4. `frontend/DESIGN.md`
5. Visual reference ภายใน:

```text
frontend/design/stitch/submit_research_uniresearch
```

6. Existing reusable components
7. Safe implementation decision

หาก Frontend และ Backend ไม่ตรงกัน ให้ตรวจสอบเจตนาของระบบจาก:

* Backend schema
* Backend test
* Database model
* Existing API usage
* Existing documentation
* Related frontend pages

จากนั้นปรับให้ทั้งสองฝั่งทำงานร่วมกันอย่างถูกต้อง

---

# Repository Safety

ก่อนแก้ไข ให้รัน:

```bash
git status
git diff
```

ตรวจสอบงานที่ถูกแก้อยู่แล้ว

ห้าม:

* Reset Repository
* Checkout ทับ unrelated work
* ลบ unrelated changes
* ใช้ `git clean`
* Revert งานของผู้ใช้
* Reformat ทั้งโปรเจกต์
* ลบ Test เพื่อทำให้ผ่าน
* ปิด TypeScript หรือ ESLint แบบกว้าง
* Hardcode token, password หรือ secret
* Hardcode production URL
* สร้าง endpoint ปลอม
* สร้าง success response ปลอม

รักษา unrelated uncommitted changes ทั้งหมด

---

# Phase 1: ทำความเข้าใจ Architecture

ตรวจสอบโครงสร้างทั้งหมดก่อนแก้ไข

## Frontend

ตรวจสอบอย่างน้อย:

```text
frontend/package.json
frontend/src
frontend/DESIGN.md
frontend/design/stitch/submit_research_uniresearch
frontend/.env*
```

ค้นหา:

* Next.js Router ที่ใช้
* Research submission routes
* Dashboard route
* Research list route
* Research detail route
* Auth provider
* Middleware
* Role guard
* API client
* Environment configuration
* Form library
* Validation library
* State-management approach
* File-upload implementation
* Shared UI components
* Notification components
* Existing tests
* E2E setup

## Backend

ตรวจสอบอย่างน้อย:

```text
backend
backend/.env*
```

ค้นหา:

* Application entry point
* Router registration
* API prefix
* Research routes
* Research creation endpoint
* Request schema
* Response schema
* Service layer
* Repository layer
* Database model
* Database migration
* Authentication
* Authorization
* User roles
* File-upload handler
* Storage configuration
* Static file serving
* Exception handler
* CORS
* Existing tests
* Seed data

ระบุ Technology Stack จริงก่อนเลือกคำสั่งทดสอบ

---

# Phase 2: Reproduce ปัญหา

ก่อนแก้ไข ให้พยายามทำให้เกิดปัญหาปัจจุบันซ้ำ

รัน Frontend และ Backend ตามวิธีของโปรเจกต์

ตรวจสอบ:

* Backend startup errors
* Frontend startup errors
* Browser console errors
* Network requests
* HTTP status
* Request payload
* Response body
* Backend logs
* Database errors
* Storage errors

ทดลอง Workflow จริง:

1. Login
2. เปิด Dashboard หรือ Research List
3. กดเพิ่มงานวิจัย
4. กรอกข้อมูล
5. แนบไฟล์
6. กดส่ง
7. ตรวจสอบ request และ response
8. ตรวจสอบข้อมูลในฐานข้อมูล
9. ตรวจสอบไฟล์ที่ถูกบันทึก
10. ตรวจสอบหน้ารายละเอียดหรือหน้ารายการ

บันทึก Root Cause จากหลักฐานจริง

ห้ามแก้แบบเดาโดยไม่พยายาม Reproduce ก่อน เว้นแต่ Environment ไม่สามารถรันได้จริง

---

# Phase 3: วิเคราะห์ Frontend

ตรวจสอบฟังก์ชันเพิ่มงานวิจัยตั้งแต่ Entry Point ถึง Success State

## Entry Point

ตรวจสอบ:

* มีปุ่ม “เพิ่มงานวิจัย” หรือไม่
* อยู่ในตำแหน่งที่ผู้ใช้หาเจอหรือไม่
* Render ตาม Role ถูกต้องหรือไม่
* มี `href` หรือ `onClick` หรือไม่
* URL ถูกต้องหรือไม่
* ปุ่มถูก disabled หรือไม่
* มี Element บังการคลิกหรือไม่
* ใช้งานบน Mobile ได้หรือไม่
* Menu และ Sidebar เชื่อม Route หรือไม่

หากจำเป็น ให้เพิ่มหรือแก้ปุ่มโดยใช้ Component และ Design เดิม

## Routing

ตรวจสอบ:

* Submission Route มีอยู่จริง
* Route path ตรงกับ Link
* Layout ทำงาน
* Middleware ไม่ Redirect ผิด
* Auth guard ไม่ทำ Loop
* Role guard ตรงกับ Backend
* Direct URL ใช้งานได้
* Browser Back ไม่ทำให้ State เสีย
* Success route และ Detail route ถูกต้อง

## Form Workflow

ตรวจสอบทุก Step:

* Basic information
* Authors
* Advisor
* Abstract
* Keywords
* Category
* Cover upload
* PDF upload
* Review
* Submit
* Result

ตรวจสอบ:

* Continue handler
* Back handler
* Final submit handler
* Button type
* Form provider
* Validation schema
* Field names
* Default values
* Dynamic author fields
* File state
* State persistence
* Disabled conditions
* Loading state
* Duplicate submission protection
* Unsaved-change warning

ตรวจสอบเป็นพิเศษว่าปุ่ม Final Submit เรียก API จริง ไม่ใช่เพียงเปลี่ยน Step หรือแสดง Success State

## API Client

ตรวจสอบ:

* Base URL
* API prefix
* Environment variable
* Cookie หรือ Bearer token
* Credentials option
* Token refresh
* Content type
* Error parsing
* Timeout
* Interceptor
* Server-side กับ Client-side request

ห้ามสร้าง API client ซ้ำหากโปรเจกต์มีของเดิม

---

# Phase 4: วิเคราะห์ Backend

ตรวจสอบ Backend contract ของการสร้างงานวิจัยจากโค้ดจริง

## Endpoint

ระบุให้ชัดเจน:

* Endpoint path
* HTTP method
* API prefix
* Content type
* Authentication requirement
* Permission requirement
* Allowed role
* Success status
* Success response
* Error responses

ตรวจสอบว่า Router ถูก Include ใน Main Application จริง

ตรวจสอบ:

* Route registration
* Import
* Prefix
* Tags
* Dependencies
* Middleware
* Authentication dependency
* Database dependency

## Request Schema

ระบุ:

* Required fields
* Optional fields
* Field names
* Data types
* Enum values
* Academic year format
* Category format
* Authors structure
* Advisor structure
* Keyword structure
* Cover field
* PDF field

ห้ามสร้าง Frontend payload จากการเดา

## Database

ตรวจสอบ:

* Research model
* Author relationship
* Advisor relationship
* Category relationship
* Keyword storage
* File-path fields
* Required database columns
* Foreign keys
* Unique constraints
* Migration status
* Table existence
* Transaction handling
* Rollback behavior

ตรวจสอบว่า Database Schema ปัจจุบันตรงกับ Model หรือไม่

หาก Migration ที่จำเป็นมีอยู่แต่ยังไม่ได้ Apply ให้ระบุและดำเนินการตามวิธีที่ปลอดภัยของโปรเจกต์

ห้ามลบข้อมูลหรือ Reset Database โดยไม่ได้รับคำสั่ง

## Authentication และ Authorization

ตรวจสอบ:

* Access token ถูกตรวจสอบอย่างไร
* User model
* User role
* Permission สำหรับสร้างงานวิจัย
* Frontend role mapping
* Backend role mapping
* Token payload
* Current-user endpoint
* 401 และ 403 behavior

ตรวจสอบว่า Frontend ใช้ชื่อ Role หรือ Permission ตรงกับ Backend

## File Upload และ Storage

ตรวจสอบ:

* Multipart field names
* Cover-image field
* PDF field
* MIME types
* Extensions
* Maximum sizes
* Storage directory
* Directory creation
* File permissions
* File-name collision
* Filename sanitization
* Cleanup เมื่อ Transaction ล้มเหลว
* Static file serving
* URL ที่ Backend ส่งกลับ
* Windows path compatibility
* Environment configuration

ตรวจสอบว่า Backend สามารถรับทั้งข้อมูล Form และไฟล์ใน Request เดียวกันหรือไม่

หาก Backend ใช้ JSON string ภายใน Multipart ให้ Frontend Serialize ตามรูปแบบจริง

---

# Phase 5: ระบุ Root Cause

หลังวิเคราะห์ ให้สร้างรายการ Root Cause ที่ยืนยันจากหลักฐาน

ตัวอย่าง Root Cause ที่ต้องตรวจสอบ แต่ห้ามสรุปจนกว่าจะยืนยัน:

* ปุ่มไม่มี Link
* Frontend route ไม่ตรง
* Middleware Redirect
* Role ไม่ตรงกัน
* API base URL ผิด
* API prefix ขาด
* Token ไม่ถูกแนบ
* CORS ไม่อนุญาต
* Submit handler ไม่ถูกเรียก
* Validation บล็อกโดยไม่มีข้อความ
* Frontend field names ไม่ตรง
* Multipart field names ไม่ตรง
* Nested data serialize ผิด
* Backend route ไม่ได้ register
* Backend schema ไม่รองรับ payload
* Database migration ยังไม่ถูก apply
* Foreign key ไม่ถูกต้อง
* Upload directory ไม่มี
* File-size limit ไม่ตรง
* Backend error ถูก Frontend ซ่อน
* Success response mapping ผิด
* Research สร้างแล้วแต่หน้า List ไม่ Refresh
* Detail route ใช้ ID ผิด

บันทึก Root Cause แต่ละข้อพร้อม:

* หลักฐาน
* ไฟล์ที่เกี่ยวข้อง
* ผลกระทบ
* วิธีแก้

---

# Phase 6: แก้ไขและเชื่อม Frontend–Backend

ดำเนินการแก้ไขทั้ง Frontend และ Backend ตาม Root Cause จริง

งานนี้อนุญาตให้แก้ Backend เมื่อจำเป็นเพื่อให้ฟังก์ชันที่ควรมีอยู่ทำงานได้จริง

## หลักการแก้ Backend

สามารถแก้ Backend เมื่อพบ:

* Router ไม่ถูก register
* Schema กับ Implementation ขัดแย้งกัน
* Endpoint มี bug
* Transaction มี bug
* File upload มี bug
* Permission implementation ผิด
* Response schema ผิด
* Database relation ผิด
* Migration ที่จำเป็นขาดหาย
* Error handling ทำให้ใช้งานไม่ได้

Backend changes ต้อง:

* มีขอบเขตเฉพาะฟังก์ชันเพิ่มงานวิจัย
* ไม่ทำลาย API เดิม
* ไม่เปลี่ยน Business Rules โดยไม่มีหลักฐาน
* มี Test รองรับ
* ระบุในรายงาน

## Frontend Request Mapping

สร้าง Mapping ที่ชัดเจนจาก Frontend Form State ไปยัง Backend Contract

ตัวอย่างหัวข้อที่ต้องตรวจสอบ:

| Frontend value | Backend field | Type | Required | Transformation |
| -------------- | ------------- | ---- | -------- | -------------- |

ส่งเฉพาะข้อมูลที่ Backend รองรับ

ห้ามส่ง UI-only fields

## Multipart

หาก Backend ใช้ Multipart:

* ใช้ `FormData`
* ใช้ชื่อ Field ตาม Backend
* ไม่กำหนด `Content-Type` boundary เอง
* Serialize Arrays และ Objects ตาม Backend
* ตรวจสอบว่า `File` ยังมีอยู่ก่อนส่ง
* ส่ง PDF และ Cover ด้วย Field ที่ถูกต้อง
* ตรวจสอบขนาดและประเภทก่อนส่ง
* ให้ Backend Validation เป็น Authority ขั้นสุดท้าย

## Submission Behavior

Final Submit ต้อง:

1. Validate ทุก Step
2. Focus ไปยัง Error แรก
3. ป้องกัน Duplicate Click
4. แสดง Loading
5. Disable ปุ่มระหว่างส่ง
6. สร้าง Payload
7. ส่ง Request จริง
8. Parse Response
9. Map Validation Errors
10. คงข้อมูลเมื่อเกิด Error
11. Retry ได้
12. แสดง Success เมื่อ Backend ยืนยันแล้วเท่านั้น
13. ใช้ Research ID จริงสำหรับหน้า Detail
14. Refresh หรือ Invalidate Research List ตาม Pattern ของโปรเจกต์

---

# Phase 7: Design Compliance

อ่านและปฏิบัติตาม:

```text
frontend/DESIGN.md
```

ใช้ Stitch เป็น Visual Reference:

```text
frontend/design/stitch/submit_research_uniresearch
```

ต้องคง Design Language:

* Mulberry Library
* The Living Research Index
* Warm Paper Background
* Deep Mulberry
* Periwinkle
* Soft Apricot
* Kanit
* Plus Jakarta Sans
* Editorial Layout
* Research Archive Visual Language

## Design Rules

* ห้ามสร้าง Design System ใหม่
* Reuse Component เดิมก่อน
* รักษา Color Token
* รักษา Typography
* รักษา Spacing
* รักษา Border และ Radius
* รักษา Layout เดิม
* แก้ UI เท่าที่จำเป็นต่อการใช้งาน
* Loading, Error และ Success ต้องใช้รูปแบบเดิม
* Responsive ต้องไม่เสีย
* ห้ามเปลี่ยนหน้าที่ไม่เกี่ยวข้อง

Reuse components เช่น:

* Button
* Field
* Input
* Select
* Textarea
* File Upload
* Panel
* Card
* Step Indicator
* Form Error
* Alert
* Dialog
* Status Badge
* Success State
* Dashboard Layout

---

# Phase 8: Error Handling

รองรับอย่างน้อย:

* Client Validation Error
* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Related Resource Not Found
* 409 Conflict
* 413 File Too Large
* 415 Unsupported Media Type
* 422 Validation Error
* 500 Internal Server Error
* Network Error
* Timeout
* Database Error
* File Storage Error

สำหรับ `422` ให้ Map Error กลับไปยัง Field ที่เกี่ยวข้อง

ข้อความผู้ใช้ต้อง:

* เป็นภาษาไทย
* เข้าใจง่าย
* บอกแนวทางแก้
* ไม่แสดง Stack Trace
* ไม่เปิดเผยข้อมูลภายใน

Backend logs ควรยังมีรายละเอียดเพียงพอสำหรับ Debug ตาม Convention ของโปรเจกต์

---

# Phase 9: Automated Testing

ใช้ Testing Framework ที่มีอยู่จริง

## Frontend Tests

ทดสอบ:

* Entry button
* Route navigation
* Auth guard
* Permission rendering
* Step navigation
* Form validation
* Multiple authors
* Advisor
* Abstract
* Keywords
* File validation
* File removal
* Review page
* Submit request
* Request mapping
* Loading state
* Duplicate submission
* Success response
* 401
* 403
* 413
* 415
* 422
* 500
* Network error

## Backend Tests

ทดสอบ:

* Endpoint registration
* Authentication
* Permission
* Successful creation
* Required fields
* Invalid enum
* Invalid related IDs
* Multiple authors
* Advisor
* Keywords
* Cover upload
* PDF upload
* Invalid MIME type
* Oversized file
* Database rollback
* Storage failure
* 401
* 403
* 422
* 500 handling

## Integration Test

เพิ่ม Test ที่ตรวจสอบ Frontend Request Contract และ Backend Request Contract ให้ตรงกัน หาก Testing Stack รองรับ

---

# Phase 10: Runtime Verification

นอกจาก Unit Test ต้องทดสอบ Workflow จริง

## Backend Verification

ตรวจสอบ:

* Health endpoint
* OpenAPI หรือ route list หากมี
* Research endpoint
* Database connection
* Storage directory
* Authentication
* Actual create request

สามารถใช้ Tool ที่มีใน Repository เช่น:

* Test client
* curl
* PowerShell `Invoke-RestMethod`
* API integration test

ห้ามใช้ token หรือ credentials ที่ไม่ได้กำหนดไว้ใน Development Environment

## Browser หรือ E2E Verification

ทดสอบ:

1. Login
2. เปิดหน้า Dashboard
3. กดเพิ่มงานวิจัย
4. กรอก Required Fields
5. เพิ่มผู้จัดทำ
6. ระบุอาจารย์ที่ปรึกษา
7. กรอกบทคัดย่อ
8. เพิ่มคำสำคัญ
9. เลือก Cover
10. เลือก PDF
11. Review
12. Submit
13. ตรวจ Network Request
14. ตรวจ Backend Response
15. ตรวจ Database
16. ตรวจไฟล์
17. เปิด Detail
18. ตรวจรายการใหม่ใน Research List

ทดสอบ Error Flow อย่างน้อย:

* Missing required data
* Invalid file
* 401
* 403
* 422
* Backend unavailable

---

# Phase 11: Responsive และ Accessibility

ตรวจสอบ:

* Desktop
* Tablet
* Mobile

Requirements:

* ไม่มี Horizontal Overflow
* Step Indicator ใช้งานได้
* Author Fields ใช้งานบน Mobile ได้
* Upload Area ใช้งานได้
* Action Buttons ไม่บังเนื้อหา
* Long Text Wrap ถูกต้อง

Accessibility:

* ทุก Field มี Label
* Error เชื่อมด้วย `aria-describedby`
* Invalid state ใช้ `aria-invalid`
* Keyboard ใช้งานได้
* Drop zone ใช้ Keyboard ได้
* Focus ไป Error แรก
* Focus indicator ยังแสดง
* Dynamic controls มี Accessible Name
* Loading state ถูกประกาศ
* สีไม่ใช่สิ่งเดียวที่บอกสถานะ

---

# Required Commands

ตรวจสอบ Script จริงก่อนรัน

## Frontend

รันคำสั่งที่มีอยู่จริง เช่น:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Backend

ตรวจสอบ Backend tooling แล้วรันคำสั่งที่เหมาะสม เช่น:

```bash
pytest
```

หรือคำสั่งที่กำหนดใน Repository

หากมี Migration ให้ตรวจสอบ Migration Status โดยใช้คำสั่งของโปรเจกต์

กฎ:

* ห้ามรายงาน PASS หากไม่ได้รัน
* Script ไม่มีให้รายงาน `NOT AVAILABLE`
* Environment ไม่พร้อมให้รายงานข้อจำกัด
* แยก Existing Failure ออกจาก Failure ที่เกิดจากงานนี้
* แก้ Failure ที่เกิดจาก Implementation นี้
* รัน Test ซ้ำหลังแก้
* ห้ามปิด Test เพื่อให้ผ่าน

---

# Required Report

สร้างไฟล์:

```text
frontend/docs/research-creation-full-integration-report.md
```

รายงานต้องประกอบด้วย:

## 1. Executive Summary

สรุปปัญหาเดิม สาเหตุ และผลหลังแก้

## 2. Reproduction

* ขั้นตอนที่ใช้ Reproduce
* Error ที่พบ
* HTTP status
* Backend log
* Frontend error

## 3. Root Cause Analysis

สำหรับแต่ละ Root Cause ระบุ:

* สาเหตุ
* หลักฐาน
* ไฟล์
* ผลกระทบ
* การแก้ไข

## 4. Frontend Analysis

* Entry Point
* Route
* Auth
* Permission
* Form Workflow
* Validation
* API Client
* File Handling
* Success และ Error State

## 5. Backend Analysis

* Endpoint
* Request Schema
* Response Schema
* Database
* Authentication
* Permission
* File Upload
* Storage
* CORS
* Errors

## 6. Backend Contract

ระบุ:

* Path
* Method
* Content Type
* Required Fields
* Optional Fields
* Enum Values
* Multipart Fields
* Authentication
* Permission
* Success Response
* Error Responses

## 7. Frontend–Backend Mapping

สร้างตาราง Mapping ของทุก Field

## 8. Changes Implemented

แยก:

* Frontend Changes
* Backend Changes
* Database หรือ Migration Changes
* Tests
* Configuration Changes

## 9. Design Compliance

สรุปว่าการแก้ไขยังยึด `frontend/DESIGN.md` อย่างไร

## 10. Testing

ระบุ:

* Commands ที่รัน
* Tests ที่ผ่าน
* Tests ที่ไม่ผ่าน
* Tests ที่ไม่ได้รัน
* Manual Verification
* E2E Verification
* API Verification
* Database Verification
* File Verification

## 11. Files Changed

แสดงไฟล์ทั้งหมดที่สร้างหรือแก้

## 12. Remaining Issues

แยกเป็น:

* Completed
* Partially Completed
* Blocked
* Not Tested
* Environment Limitation
* Recommended Follow-up

ห้ามระบุว่าสำเร็จ หากยังส่ง Request หรือบันทึก Database ไม่ได้จริง

---

# Working Order

ทำตามลำดับ:

1. `git status`
2. `git diff`
3. ตรวจ Architecture
4. อ่าน `frontend/DESIGN.md`
5. ตรวจ Stitch
6. รันระบบ
7. Reproduce ปัญหา
8. ตรวจ Browser Console
9. ตรวจ Network
10. ตรวจ Backend Logs
11. วิเคราะห์ Frontend
12. วิเคราะห์ Backend
13. วิเคราะห์ Database
14. วิเคราะห์ Auth และ Permission
15. วิเคราะห์ Upload และ Storage
16. ระบุ Root Cause
17. แก้ Frontend
18. แก้ Backend หากจำเป็น
19. แก้ Database หรือ Migration หากจำเป็นและปลอดภัย
20. เพิ่ม Tests
21. รัน Frontend Tests
22. รัน Backend Tests
23. รัน Build
24. ทดสอบ API จริง
25. ทดสอบ Workflow จริง
26. ตรวจ Database Record
27. ตรวจ Uploaded Files
28. ตรวจ Responsive
29. ตรวจ Accessibility
30. สร้าง Report
31. ตรวจ `git diff`
32. สรุปผล

ห้ามหยุดหลังการวิเคราะห์

---

# Definition of Done

งานถือว่าเสร็จเมื่อยืนยันได้ว่า:

* ปุ่มเพิ่มงานวิจัยใช้งานได้
* Route ใช้งานได้
* Form ทุก Step ใช้งานได้
* Validation แสดงผลถูกต้อง
* Frontend ส่ง Request จริง
* Request ตรง Backend Contract
* Token ถูกส่ง
* Permission ถูกต้อง
* Backend รับ Request ได้
* Database บันทึกข้อมูลได้
* ไฟล์ถูกบันทึกได้
* Success Response เป็นของจริง
* Detail หรือ List แสดงข้อมูลใหม่ได้
* Error States ทำงาน
* ไม่มี Production Mock
* Design ยังคงตาม `DESIGN.md`
* Tests ที่เกี่ยวข้องผ่าน หรือมีข้อจำกัดระบุชัด
* มีรายงานผลครบ

---

# Final Response Format

หลังดำเนินการเสร็จ ให้สรุปดังนี้:

## Root Cause

* ระบุสาเหตุจริงที่พบ
* ระบุหลักฐานสำคัญ

## Frontend Changes

* Entry Point
* Routing
* Form
* API
* Validation
* Upload
* Error และ Success

## Backend Changes

* Endpoint
* Schema
* Auth
* Permission
* Database
* Storage

ถ้าไม่ได้แก้ Backend ให้ระบุว่าไม่ได้แก้และเหตุผล

## Backend Contract

```text
endpoint:
method:
content type:
authentication:
permission:
success status:
```

## Verification

```text
frontend typecheck: PASS / FAIL / NOT AVAILABLE
frontend lint: PASS / FAIL / NOT AVAILABLE
frontend test: PASS / FAIL / NOT AVAILABLE
frontend build: PASS / FAIL / NOT AVAILABLE
frontend test:e2e: PASS / FAIL / NOT AVAILABLE
backend tests: PASS / FAIL / NOT AVAILABLE
API create research: PASS / FAIL / NOT RUN
database record created: PASS / FAIL / NOT VERIFIED
file upload: PASS / FAIL / NOT VERIFIED
manual workflow: PASS / FAIL / PARTIAL / NOT RUN
responsive: PASS / FAIL / PARTIAL / NOT RUN
accessibility: PASS / FAIL / PARTIAL / NOT RUN
```

## Files Changed

* ระบุไฟล์หลักที่แก้
* ระบุ Migration หากมี

## Remaining Issues

* ระบุสิ่งที่ยังไม่สำเร็จ
* ระบุ Environment limitations
* ระบุสิ่งที่ต้องทำต่อ

## Report

ยืนยันว่าได้สร้าง:

```text
frontend/docs/research-creation-full-integration-report.md
```

ห้ามรายงานว่าสำเร็จหากยังไม่ได้ยืนยัน Request, Backend Response และ Database Record จริง
