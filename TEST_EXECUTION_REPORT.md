# 📊 รายงานสรุปผลการทดสอบ UniResearch E2E Test Suite
**ผู้รับผิดชอบการทดสอบ:** สมหมาย กิตติกร (Sommai Kitikorn)  
**ขอบเขตการทดสอบ:** Automated E2E & Integration Testing (TC-002 ถึง TC-048)  
**วันที่รายงาน:** 8 ตุลาคม 2026  

---

## 1. ภาพรวมผลการทดสอบ (Executive Summary)

* **จำนวน Test Cases ทั้งหมดที่ได้รับมอบหมาย:** 18 รายการ (TC-002 ถึง TC-048)
* **ทดสอบผ่าน (Passed):** 5 รายการ
* **ถูกข้าม (Skipped):** 13 รายการ
* **คิดเป็นเปอร์เซ็นต์ผ่าน (Pass Rate):** 27.78%

> **สูตรการคำนวณ Pass Rate:** `(Passed / 18) * 100` = `(5 / 18) * 100` = `27.78%`

---

## 2. รายละเอียดสถานะ Test Cases

### ✅ รายชื่อ Test Cases ที่ผ่าน (PASSED)

| รหัส Test Case | ชื่อกรณีทดสอบ | ประเภท / ขอบเขต | ผลการทดสอบ (Actual Result) |
|:---|:---|:---|:---|
| **TC-002** | สมัคร email ซ้ำ | Negative / API | **ผ่าน (Passed):** ส่งคำขอสมัครสมาชิกซ้ำด้วยอีเมลเดิม ระบบปฏิเสธด้วย HTTP 400 Bad Request พร้อมข้อความแจ้งเตือน และจำนวนผู้ใช้ในระบบไม่เพิ่มขึ้น |
| **TC-011** | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | Negative / API/RBAC | **ผ่าน (Passed):** นักศึกษา (S1) ส่งคำขอสร้างหมวดหมู่ผ่าน POST `/categories/` ระบบปฏิเสธด้วย HTTP 403 Forbidden และไม่มีหมวดหมู่ใหม่ถูกสร้าง |
| **TC-023** | ไม่ล็อกอินหรือ role guest ส่งงาน | Negative / Web/API/RBAC | **ผ่าน (Passed):** การเข้าหน้า `/student/research/new` โดยไม่มีเซสชันถูก Redirect ไปยัง `/login` และการส่ง API โดยไม่มี token ตอบ 401 หรือบทบาท guest ตอบ 403 |
| **TC-035** | ไม่มี token หรือไม่มีไฟล์ | Negative / API | **ผ่าน (Passed):** การขอรับไฟล์โดยไม่มี token ตอบ 401 และการขอดาวน์โหลดงานวิจัยที่ไม่มีไฟล์เอกสารแนบตอบ 404 โดยยอดดาวน์โหลดไม่เพิ่มขึ้น |
| **TC-038** | advisor ที่ได้รับมอบหมายอนุมัติ pending | Positive / Web & API | **ผ่าน (Passed):** อาจารย์ที่ปรึกษา D1 ดำเนินการประเมินผลงานผ่านหน้าเว็บ กรอกคะแนนและความคิดเห็น พร้อมกดยืนยันใน Modal สำเร็จ ข้อมูลเปลี่ยนเป็น approved |

---

### ⏭️ รายชื่อ Test Cases ที่ถูกข้าม (SKIPPED - เก็บไว้ทดสอบรอบถัดไป)

> **หมายเหตุ:** ซอร์สโค้ดไฟล์ทดสอบของทั้ง 13 รายการยังคงถูกเก็บรักษาไว้อย่างครบถ้วน 100% ในไดเรกทอรี `e2e_suite/tests/` เพื่อรองรับการรันในรอบถัดไปเมื่อสภาพแวดล้อมและข้อมูลทดสอบพร้อม

| รหัส Test Case | ชื่อกรณีทดสอบ | ไฟล์ทดสอบที่เก็บรักษาไว้ | สาเหตุที่ข้ามในรอบนี้ |
|:---|:---|:---|:---|
| **TC-005** | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | `tests/test_tc005_student_profile.py` | รอการทดสอบ session lifecycle และการตรวจสอบ hash รหัสผ่านบนฐานข้อมูลถาวร |
| **TC-008** | admin CRUD ผู้ใช้ | `tests/test_tc008_admin_crud_users.py` | รอการเตรียมสิทธิ์ Admin A1 แบบสมบูรณ์และการยืนยัน cascade บนระบบผู้ใช้งาน |
| **TC-014** | guest/student/admin ค้นงาน approved และ pending | `tests/test_tc014_role_search_visibility.py` | ต้องใช้ชุดข้อมูลงานวิจัยจำลองหลายสถานะ (approved & pending) พร้อมเจ้าของผลงานหลายราย |
| **TC-017** | latest/popular และสถิติ | `tests/test_tc017_home_latest_popular_stats.py` | ต้องใช้ชุดข้อมูลงานวิจัยที่มีวันที่เผยแพร่และยอดวิว/ดาวน์โหลดที่หลากหลายในการตรวจสอบสูตรจัดอันดับ |
| **TC-020** | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | `tests/test_tc020_recommendations.py` | ต้องจำลองประวัติ interaction logs และรายการ favorite ของผู้ใช้ในหลายหมวดหมู่ |
| **TC-026** | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | `tests/test_tc026_file_upload_boundary.py` | รอการทดสอบ boundary test บน storage จริงสำหรับไฟล์ขนาด 5 MiB และ 25 MiB |
| **TC-029** | ผู้มีสิทธิ์แก้แล้วกลับ pending | `tests/test_tc029_edit_revert_pending.py` | ต้องเตรียม fixture ผลงาน approved ของตนเองล่วงหน้า เพื่อทดสอบการรีเซ็ตสถานะกลับเป็น pending |
| **TC-032** | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | `tests/test_tc032_delete_research_cascade.py` | ต้องเตรียมงานวิจัยที่มีความสัมพันธ์ครบทุกตาราง (authors, advisors, reviews, favorites, logs) |
| **TC-040** | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | `tests/test_tc040_review_notification.py` | ต้องตรวจสอบกล่องข้อความแจ้งเตือน (Notifications) ข้ามบัญชีระหว่างผู้ส่งงานและผู้ร่วมจัดทำ |
| **TC-041** | admin เปลี่ยน advisor; student ถูกห้าม | `tests/test_tc041_admin_assign_advisor.py` | ต้องเตรียมบัญชีอาจารย์ D1 และ D2 เพื่อทดสอบการสลับงานในคิวตรวจและการตรวจสิทธิ์ RBAC |
| **TC-044** | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | `tests/test_tc044_ai_endpoints_validation.py` | รอการติดตั้ง AI Test Double / Mock Service เพื่อทดสอบ schema contract โดยไม่ต้องต่อ AI Provider จริง |
| **TC-047** | เว็บส่งงานแล้ว advisor ตรวจ | `tests/test_tc047_e2e_submit_and_review.py` | เป็น Full E2E Workflow ข้าม 2 บทบาทที่ต้องใช้การรัน Browser แบบสมบูรณ์ต่อเนื่อง |
| **TC-048** | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | `tests/test_tc048_e2e_admin_manage_and_rbac.py` | รอการทดสอบการคุ้มครอง Admin UI Layout ร่วมกับ API RBAC ของนักศึกษา |

---

## 3. คำแนะนำสำหรับการทดสอบรอบถัดไป (Next Steps)

1. **การจัดเตรียม Test Double และ Mock Service**:
   - พัฒนาหรือเปิดใช้งาน Mock Service สำหรับ AI Assistant Endpoints (TC-044) เพื่อให้สามารถทดสอบ Schema Validation และ Error Handling ได้โดยไม่ต้องพึ่งพา API Token จริงจากภายนอก
   - เตรียม Environment ที่รองรับ PostgreSQL ร่วมกับ pgvector เพื่อทดสอบฟีเจอร์การสืบค้นและคำนวณความคล้ายคลึงของเวกเตอร์

2. **การทำ Automated Data Seeding & Isolation**:
   - สร้างสคริปต์ Seeding ข้อมูลล่วงหน้าก่อนรัน (A1, S1–S3, D1–D2, W1–W5) เพื่อรองรับ Preconditions ของเคสที่ถูกข้าม (เช่น TC-014, TC-020, TC-032, TC-040, TC-041)
   - กำหนดกระบวนการ Data Teardown ใน `conftest.py` เพื่อล้างข้อมูลจำลองหลังการทดสอบ ป้องกันไม่ให้ส่งผลกระทบต่อรอบถัดไป

3. **การทดสอบ Multi-Role E2E Browser Testing**:
   - สำหรับ TC-047 และ TC-048 แนะนำให้รันด้วย Selenium Headless บนสภาพแวดล้อมที่เปิด Frontend (`localhost:3000`) และ Backend (`localhost:8000`) พร้อมกัน โดยจัดการ Browser Context หรือเคลียร์ Session Storage ระหว่างการสลับบทบาทผู้ใช้
