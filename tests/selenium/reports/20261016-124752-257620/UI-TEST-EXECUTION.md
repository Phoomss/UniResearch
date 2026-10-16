# รายงานการรันทดสอบ UI/API — UniResearch

เวลารัน UTC: 2026-10-16T12:54:23.931201+00:00
โหมด: **headless**; Browser: chrome; commit: `16490e54bd66bb12e0affb3ea16ac1a9bc1b3f57` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 48
- UI-automatable: 31
- รัน browser tests: 31
- PASS: 29; FAIL: 2; BLOCKED: 0
- API-only Test Cases: 17
- UI automation coverage ใน session นี้: 100.0%

Coverage ของ UI นับเฉพาะกรณีที่สคริปต์มี browser fixture และรัน WebDriver จริง API/DB/file assertions แยกเป็นหลักฐานเสริม; ผลผ่านหมายถึง assertions ที่สคริปต์รัน ไม่ใช่การรับรอง PostgreSQL/live AI หรือการลงนามยอมรับระบบ

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-001/20261016-124752-257620/009-final-result.png) |
| TC-002 | AUTH | No | PASS | ยังไม่มี browser evidence |
| TC-003 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-003/20261016-124752-257620/004-final-result.png) |
| TC-004 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-004/20261016-124752-257620/004-final-result.png) |
| TC-005 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-005/20261016-124752-257620/009-final-result.png) |
| TC-006 | AUTH | No | PASS | ยังไม่มี browser evidence |
| TC-007 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-007/20261016-124752-257620/007-final-result.png) |
| TC-008 | USER | Yes | PASS | [Screenshot 1](../screenshots/user/TC-008/20261016-124752-257620/010-final-result.png) |
| TC-009 | USER | No | PASS | ยังไม่มี browser evidence |
| TC-010 | CATEGORY | Yes | PASS | [Screenshot 1](../screenshots/category/TC-010/20261016-124752-257620/013-final-result.png) |
| TC-011 | CATEGORY | No | PASS | ยังไม่มี browser evidence |
| TC-012 | USER | No | PASS | ยังไม่มี browser evidence |
| TC-013 | USER | Yes | PASS | [Screenshot 1](../screenshots/user/TC-013/20261016-124752-257620/009-final-result.png) |
| TC-014 | RECOMMENDATION | Yes | PASS | [Screenshot 1](../screenshots/recommendation/TC-014/20261016-124752-257620/003-final-result.png) |
| TC-015 | RECOMMENDATION | No | FAIL |  / [error log](../../artifacts/20261016-124752-257620/errors.log) |
| TC-016 | RECOMMENDATION | Yes | PASS | [Screenshot 1](../screenshots/recommendation/TC-016/20261016-124752-257620/002-final-result.png) |
| TC-017 | RECOMMENDATION | No | PASS | ยังไม่มี browser evidence |
| TC-018 | RECOMMENDATION | Yes | FAIL | [Screenshot 1](../screenshots/recommendation/TC-018/20261016-124752-257620/003-failure-call.png) / [error log](../../artifacts/20261016-124752-257620/errors.log) |
| TC-019 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-019/20261016-124752-257620/003-final-result.png) |
| TC-020 | RECOMMENDATION | No | PASS | ยังไม่มี browser evidence |
| TC-021 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-021/20261016-124752-257620/006-final-result.png) |
| TC-022 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-022/20261016-124752-257620/034-final-result.png) |
| TC-023 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-023/20261016-124752-257620/002-final-result.png) |
| TC-024 | SUBMISSION | No | PASS | ยังไม่มี browser evidence |
| TC-025 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-025/20261016-124752-257620/008-final-result.png) |
| TC-026 | SUBMISSION | No | PASS | ยังไม่มี browser evidence |
| TC-027 | SUBMISSION | No | FAIL |  / [error log](../../artifacts/20261016-124752-257620/errors.log) |
| TC-028 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-028/20261016-124752-257620/007-final-result.png) |
| TC-029 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-029/20261016-124752-257620/020-final-result.png) |
| TC-030 | SUBMISSION | No | PASS | ยังไม่มี browser evidence |
| TC-031 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-031/20261016-124752-257620/025-final-result.png) |
| TC-032 | SUBMISSION | Yes | FAIL | [Screenshot 1](../screenshots/submission/TC-032/20261016-124752-257620/022-failure-call.png) / [error log](../../artifacts/20261016-124752-257620/errors.log) |
| TC-033 | SUBMISSION | No | PASS | ยังไม่มี browser evidence |
| TC-034 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-034/20261016-124752-257620/007-final-result.png) |
| TC-035 | SUBMISSION | No | PASS | ยังไม่มี browser evidence |
| TC-036 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-036/20261016-124752-257620/012-final-result.png) |
| TC-037 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-037/20261016-124752-257620/007-final-result.png) |
| TC-038 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-038/20261016-124752-257620/014-final-result.png) |
| TC-039 | REVIEW | No | PASS | ยังไม่มี browser evidence |
| TC-040 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-040/20261016-124752-257620/064-final-result.png) |
| TC-041 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-041/20261016-124752-257620/012-final-result.png) |
| TC-042 | FAVORITE | Yes | PASS | [Screenshot 1](../screenshots/favorite/TC-042/20261016-124752-257620/008-final-result.png) |
| TC-043 | NOTIFICATION | Yes | PASS | [Screenshot 1](../screenshots/notification/TC-043/20261016-124752-257620/011-final-result.png) |
| TC-044 | AI | No | PASS | ยังไม่มี browser evidence |
| TC-045 | AI | No | FAIL |  / [error log](../../artifacts/20261016-124752-257620/errors.log) |
| TC-046 | AI | Yes | PASS | [Screenshot 1](../screenshots/ai/TC-046/20261016-124752-257620/027-final-result.png) |
| TC-047 | E2E | Yes | PASS | [Screenshot 1](../screenshots/e2e/TC-047/20261016-124752-257620/045-final-result.png) |
| TC-048 | E2E | Yes | PASS | [Screenshot 1](../screenshots/e2e/TC-048/20261016-124752-257620/018-final-result.png) |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](ui-results.json)

### TC-001 — สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ

Browser: chrome 155.0.8059.82; ระยะเวลา 9.12 วินาที
ผลที่คาดหวัง: เมื่อสมัครสำเร็จ หน้าแสดง “สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ” และยังต้องเข้าสู่ระบบด้วยตนเอง; การเพิ่ม role ในคำขอต้องไม่ทำให้บัญชีมีสิทธิ์ผู้ดูแลระบบ; ต้องมีผลตรวจส่วนเสริมก่อนตัดสินประเด็นนี้ผ่าน
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /login — PASS
2. คลิก: a[href="/register"] — PASS
3. กรอกช่อง: first_name — PASS
4. กรอกช่อง: last_name — PASS
5. กรอกช่อง: email — PASS
6. กรอกช่อง: password — PASS
7. กรอกช่อง: confirmPassword — PASS
8. คลิก: //button[normalize-space(.)='สร้างบัญชี'] — PASS
9. รอข้อความที่มองเห็น: สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ — PASS
10. เปิดหน้า: /login — PASS
11. คลิก: a[href="/register"] — PASS
12. กรอกช่อง: first_name — PASS
13. กรอกช่อง: last_name — PASS
14. กรอกช่อง: email — PASS
15. กรอกช่อง: password — PASS
16. กรอกช่อง: confirmPassword — PASS
17. คลิก: //button[normalize-space(.)='สร้างบัญชี'] — PASS
18. รอข้อความที่มองเห็น: สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ — PASS

### TC-002 — ปฏิเสธการสมัครสมาชิกด้วยอีเมล 674259009@webmail.npru.ac.th ที่มีอยู่แล้วโดยไม่สร้างผู้ใช้ซ้ำ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.014 วินาที
ผลที่คาดหวัง: มีข้อความแจ้งว่าอีเมลถูกใช้แล้วหรือ Email already registered; ไม่เข้าสู่ระบบอัตโนมัติ; หน้า “ผู้ใช้งาน” มีบัญชีอีเมลเดิมเพียงรายการเดียว
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-003 — เข้าสู่ระบบด้วยบัญชีนักศึกษา 674259009@webmail.npru.ac.th และตรวจข้อมูลผู้ใช้กับ session หลังเข้าสู่ระบบ

Browser: chrome 155.0.8059.82; ระยะเวลา 3.428 วินาที
ผลที่คาดหวัง: เข้าสู่ระบบได้และแสดงชื่อ นรงศ์ศักดิ์ ภูมิประเสริฐ; หน้าโปรไฟล์แสดงอีเมล 674259009@webmail.npru.ac.th และรหัสนักศึกษา 674259009 ตรง CSV; หลังรีเฟรชยังใช้งานได้โดยไม่ต้องล็อกอินซ้ำ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS

### TC-004 — ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session

Browser: chrome 155.0.8059.82; ระยะเวลา 3.314 วินาที
ผลที่คาดหวัง: แสดงข้อความ “อีเมลหรือรหัสผ่านไม่ถูกต้อง”; ยังอยู่หน้าล็อกอินและเข้าพื้นที่ส่วนตัวไม่ได้
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /login — PASS
2. กรอกช่อง: email — PASS
3. กรอกช่อง: password — PASS
4. คลิก: //button[normalize-space(.)='เข้าสู่ระบบ'] — PASS
5. อ่านข้อความปฏิเสธ: toast-error — PASS

### TC-005 — แก้ชื่อและภาควิชาของ 674259009@webmail.npru.ac.th พร้อมเปลี่ยนรหัสผ่านและตรวจการเข้าสู่ระบบด้วยรหัสใหม่

Browser: chrome 155.0.8059.82; ระยะเวลา 11.553 วินาที
ผลที่คาดหวัง: ชื่อ Changed และภาควิชา Test Department ยังอยู่หลังรีเฟรช; รหัสเดิมเข้าสู่ระบบไม่ได้ แต่รหัสใหม่เข้าสู่ระบบได้; ตรวจ hash ในส่วนเสริม ไม่ดูจากหน้าจอ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /student/profile — PASS
7. คลิก: form button[type="submit"] — PASS
8. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
9. เปิดหน้า: /login — PASS
10. กรอกช่อง: email — PASS
11. กรอกช่อง: password — PASS
12. คลิก: form button[type="submit"] — PASS

### TC-006 — ปฏิเสธ token ปลอม บัญชี 674259013@webmail.npru.ac.th ที่ปิดใช้งาน และการแก้อีเมลให้ซ้ำ 674259009@webmail.npru.ac.th

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.498 วินาที
ผลที่คาดหวัง: การแก้อีเมลซ้ำถูกปฏิเสธและหลังรีเฟรชกิติกรยังใช้อีเมลเดิม; บัญชีปิดใช้งานไม่สามารถเปิดข้อมูลส่วนตัวได้; บันทึกหน้าหรือข้อความผิดพลาดจริง; ส่วน token ปลอมต้องมีหลักฐานจากส่วนเสริมจึงถือว่าตรวจครบ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-007 — ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 16.847 วินาที
ผลที่คาดหวัง: หลังออกจากระบบไม่สามารถใช้งานพื้นที่ส่วนตัวต่อได้; เมื่อเปิดหน้าที่ต้องล็อกอิน ระบบพาไปหน้าเข้าสู่ระบบ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /account/saved — PASS
7. คลิก: //button[normalize-space(.)='ออกจากระบบ'] — PASS
8. เปิดหน้า: /account/saved — PASS

### TC-008 — ผู้ดูแลระบบ admin@uniresearch.ac.th สร้าง อ่าน แก้ไข และลบบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บและ API

Browser: chrome 155.0.8059.82; ระยะเวลา 10.585 วินาที
ผลที่คาดหวัง: เพิ่มผู้ใช้สำเร็จและค้นพบข้อมูลที่กรอก; แก้ชื่อแล้วคงอยู่หลังรีเฟรช; ยืนยันลบแล้วไม่พบผู้ใช้เดิมในรายการ; ไม่เลือก Reviewer แทน advisor เพราะเป็นคนละบทบาท
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: admin@uniresearch.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: a[href="/admin/users"] — PASS
7. คลิก: //button[normalize-space(.)='เพิ่มผู้ใช้ใหม่'] — PASS
8. กรอกช่อง: email — PASS
9. กรอกช่อง: first_name — PASS
10. กรอกช่อง: last_name — PASS
11. กรอกช่อง: student_id — PASS
12. กรอกช่อง: password — PASS
13. เลือกผู้เกี่ยวข้อง: role — PASS
14. เลือกผู้เกี่ยวข้อง: department — PASS
15. คลิก: form button[type="submit"] — PASS
16. รอข้อความที่มองเห็น: 674259002@webmail.npru.ac.th — PASS

### TC-009 — ปฏิเสธการอ่าน สร้าง แก้ไข และลบผู้ใช้ผ่าน API เมื่อใช้สิทธิ์นักศึกษา 674259009@webmail.npru.ac.th

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.262 วินาที
ผลที่คาดหวัง: นักศึกษาไม่สามารถอ่านหรือเปลี่ยนข้อมูลผู้ใช้ผ่านคำขอที่ไม่มีสิทธิ์; หน้าที่เปิดได้แต่โหลดข้อมูลไม่ได้ต้องบันทึกตามจริง; ไม่สร้างเงื่อนไขว่าต้องซ่อนหน้าเสมอ; ต้องตรวจคำขอทั้งห้าชนิดในส่วนเสริมจึงครบกรณีนี้
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-010 — ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 12.497 วินาที
ผลที่คาดหวัง: มีข้อความสร้างหมวดหมู่สำเร็จและชื่อ/คำอธิบายคงอยู่หลังรีเฟรช; ผู้ที่ยังไม่เข้าสู่ระบบเห็น Selenium C2 ในตัวกรองหมวดหมู่
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research — PASS
2. รอข้อความที่มองเห็น: วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ — PASS
3. รอข้อความที่มองเห็น: วิศวกรรมศาสตร์และนาโนเทคโนโลยี — PASS
4. ล็อกอินผ่านฟอร์ม: admin@uniresearch.ac.th — PASS
5. เปิดหน้า: /login — PASS
6. กรอกช่อง: email — PASS
7. กรอกช่อง: password — PASS
8. คลิก: form button[type="submit"] — PASS
9. เปิดหน้า: /admin/categories — PASS
10. กรอกช่อง: category_name — PASS
11. กรอกช่อง: description — PASS
12. คลิก: //button[normalize-space(.)='เพิ่มหมวดหมู่'] — PASS
13. เปิดหน้า: /admin/categories — PASS
14. รอข้อความที่มองเห็น: Selenium C2 — PASS
15. เปิดหน้า: /research — PASS
16. รอข้อความที่มองเห็น: Selenium C2 — PASS

### TC-011 — ปฏิเสธการสร้างหมวดหมู่ Denied C3 เมื่อผู้ส่งคำขอเป็นนักศึกษา 674259009@webmail.npru.ac.th

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.249 วินาที
ผลที่คาดหวัง: การเพิ่มถูกปฏิเสธ เช่น “บัญชีนี้ไม่มีสิทธิ์สร้างหมวดหมู่ [forbidden]”; ไม่มี Denied C3 ในรายการ; ถ้า UI กดต่อไม่ได้ยังต้องมีการตรวจ API ตามส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-012 — ผู้ดูแลระบบแทนรายการภาควิชาและประเภทงานด้วย New Department กับ New Type พร้อมตัดช่องว่าง

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.251 วินาที
ผลที่คาดหวัง: แสดง “บันทึกการตั้งค่าเรียบร้อยแล้ว”; เหลือ New Department และ New Type โดยไม่มีช่องว่างหัวท้ายหรือแถวว่าง; ค่าเดิมถูกแทน; UI trim ก่อนส่งจึงต้องตรวจการ trim ฝั่ง backend เพิ่มในส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-013 — นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 7.628 วินาที
ผลที่คาดหวัง: ไม่แสดงข้อความบันทึกสำเร็จเมื่อใช้บัญชีนักศึกษา; หลังโหลดใหม่ไม่มี Denied Selenium Department และตัวเลือกเดิมยังอยู่
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /admin/options — PASS
7. คลิก: button[aria-label="เพิ่มภาควิชา"] — PASS
8. รอข้อความที่มองเห็น: Denied Selenium Department — PASS
9. คลิก: //button[normalize-space(.)='บันทึกการตั้งค่าทั้งหมด'] — PASS
10. อ่านข้อความปฏิเสธ: toast-error — PASS

### TC-014 — ตรวจสิทธิ์การค้นหางานที่เผยแพร่และรอตรวจแยกตามผู้เยี่ยมชม นักศึกษา ที่ปรึกษา และผู้ดูแลระบบ

Browser: chrome 155.0.8059.82; ระยะเวลา 5.491 วินาที
ผลที่คาดหวัง: ผู้ไม่ล็อกอิน/guest เห็นเฉพาะงานเผยแพร่; นักศึกษาเห็นงานเผยแพร่และงานที่ตนเกี่ยวข้อง; advisor/admin อาจเห็นทุกสถานะตามสิทธิ์ค้นหาปัจจุบัน; รายการที่ถูกกรองต้องตรงหมวดหมู่; เทียบรายชื่อกับผลส่วนเสริมเพื่อยืนยันสิทธิ์ ไม่ใช้แค่จำนวนการ์ด
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research?q=การ&category_id=1 — PASS
2. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS

### TC-015 — ค้นคำว่า ranktitle rankabstract แบบจับคู่คำใดคำหนึ่งและตรวจลำดับกับการบันทึกประวัติค้นหา

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.063 วินาที
ผลที่คาดหวัง: ผลมีงานที่ตรงคำแรกหรือคำที่สองและงานที่ตรงชื่ออยู่ก่อนงานที่ตรงบทคัดย่อในข้อมูลที่เตรียม; การมี search log พิสูจน์จากส่วนเสริม; ไม่อ้างว่าตรวจ log ได้จากหน้าค้นหา
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)


ข้อผิดพลาด: assert {1, 4, 5} == {1, 4}      Extra items in the left set:   5      Full diff:     {         1,...      ...Full output truncated (3 lines hidden), use '-vv' to show

### TC-016 — คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret

Browser: chrome 155.0.8059.82; ระยะเวลา 1.774 วินาที
ผลที่คาดหวัง: คำแนะนำของคำค้นไม่ว่างไม่เผยชื่อหรือ keyword ของงานรอตรวจ; คำค้นว่างอาจแสดงคำที่เคยค้น จึงไม่สรุปว่าเป็นข้อมูลจากงานที่เผยแพร่ทุกคำ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research — PASS

### TC-017 — หน้าแรกจัดงานล่าสุดและยอดนิยมถูกลำดับพร้อมสถิติรวมตรงกับข้อมูลผู้ใช้และผลงานทั้งหมด

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.031 วินาที
ผลที่คาดหวัง: ส่วนผลงานแนะนำและงานล่าสุดแสดงงานเผยแพร่ตามข้อมูลเรียงลำดับที่เตรียม; สถิติที่มีบนหน้าตรงฐานทดสอบ; ไม่คาด total_users=8 หากนำเข้า CSV ทั้งหมดแทนชุดย่อย
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-018 — เปิดรายละเอียดงานเลข 1 แล้วเพิ่มยอดดูและแนะนำงานที่เกี่ยวข้องโดยไม่รวมงานรอตรวจ

Browser: chrome 155.0.8059.82; ระยะเวลา 3.002 วินาที
ผลที่คาดหวัง: รายละเอียดงานถูกต้องและรายการเกี่ยวข้องไม่ซ้ำงานที่เปิด ไม่ใช่งานรอตรวจ; ถ้ารายการแนะนำโหลดไม่ได้ให้บันทึกเป็นข้อผิดพลาด ไม่ถือว่าแสดงหน้ารายละเอียดได้แล้วผ่านทั้งหมด; URL งานรอตรวจที่เปิดได้เป็นประเด็นนโยบาย; ตัวนับและ log ต้องตรวจเพิ่มเติม
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. เปิดหน้า: /research/1 — PASS
2. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS

ข้อผิดพลาด: GET /research/1/recommendations: expected 200, got 500

### TC-019 — แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม

Browser: chrome 155.0.8059.82; ระยะเวลา 2.068 วินาที
ผลที่คาดหวัง: แสดง “รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ” โดยไม่แสดงข้อมูลของงานอื่น; ผู้ตรวจตรวจส่วนเสริมว่าไม่เกิด view log ของรหัสที่ไม่มี
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research/999999999 — PASS
2. รอข้อความที่มองเห็น: รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ — PASS

### TC-020 — จัดอันดับคำแนะนำส่วนบุคคลจากความนิยมและรายการบันทึกของ 674259009@webmail.npru.ac.th โดยคืนเฉพาะงานที่เผยแพร่

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.289 วินาที
ผลที่คาดหวัง: คำแนะนำมีเฉพาะงานเผยแพร่และจำนวนไม่เกินขอบเขตระบบ; รายการหลังมีความสนใจสอดคล้องงานที่บันทึก; ลำดับเฉพาะ favorite-only ต้องใช้ส่วนเสริมควบคุมประวัติ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-021 — แสดงรายชื่อนักศึกษาและที่ปรึกษาที่เปิดใช้งานสำหรับเลือกผู้เกี่ยวข้องในการส่งงาน

Browser: chrome 155.0.8059.82; ระยะเวลา 6.351 วินาที
ผลที่คาดหวัง: เลือกผู้จัดทำที่เปิดใช้งานรุ่นเดียวกันและที่ปรึกษาตาม role ได้; รายชื่อ UI อาจกรองรุ่นมากกว่า API; สิทธิ์เรียก API โดยไม่มี token/guest ตรวจในส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /student/research/new — PASS
7. กรอกช่อง: title_th — PASS
8. กรอกช่อง: title_en — PASS
9. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS

### TC-022 — นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน

Browser: chrome 155.0.8059.82; ระยะเวลา 15.581 วินาที
ผลที่คาดหวัง: กรอกครบทั้งห้าขั้นแล้วมีข้อความ “ส่งผลงานเรียบร้อยแล้ว”; งานใหม่อยู่รายการของฉันในสถานะรอตรวจสอบ; รายละเอียดตรงค่าที่กรอกและไฟล์ใช้งานได้; การบันทึก relations และ bytes ต้องมีผลส่วนเสริมประกอบ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) — PASS
7. คลิก: a[href="/student/research"] — PASS
8. คลิก: a[href="/student/research/new"] — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. กรอกช่อง: academic_year — PASS
12. เลือกผู้เกี่ยวข้อง: category_id — PASS
13. เลือกผู้เกี่ยวข้อง: department — PASS
14. เลือกผู้เกี่ยวข้อง: work_type — PASS
15. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
16. เลือกผู้เกี่ยวข้อง: participant — PASS
17. เลือกผู้เกี่ยวข้อง: participant — PASS
18. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
19. กรอกช่อง: abstract — PASS
20. กรอกช่อง: keyword_input_temp — PASS
21. กรอกช่อง: keyword_input_temp — PASS
22. กรอกช่อง: keyword_input_temp — PASS
23. กรอกช่อง: keyword_input_temp — PASS
24. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
25. อัปโหลดไฟล์: cover_image — PASS
26. อัปโหลดไฟล์: document — PASS
27. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
28. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
29. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
30. เปิดหน้า: /student/research — PASS
31. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) — PASS
32. อ่านสถานะในผลงานของฉัน: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) — PASS
33. เปิดหน้า: /research/6 — PASS
34. ตรวจสถานะบนหน้าจอ: รอตรวจสอบ — PASS
35. รอข้อความที่มองเห็น: วิทยาการคอมพิวเตอร์ — PASS
36. รอข้อความที่มองเห็น: วิทยานิพนธ์ — PASS
37. รอข้อความที่มองเห็น: 2568 — PASS
38. รอข้อความที่มองเห็น: นรงศ์ศักดิ์ ภูมิประเสริฐ — PASS
39. รอข้อความที่มองเห็น: ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — PASS
40. รอข้อความที่มองเห็น: ปัญญาประดิษฐ์ — PASS
41. รอข้อความที่มองเห็น: ระบบแนะนำ — PASS
42. รอข้อความที่มองเห็น: การประมวลผลภาษาธรรมชาติ — PASS
43. รอข้อความที่มองเห็น: โครงงานวิจัย — PASS

### TC-023 — ปฏิเสธการส่งผลงานจากผู้ไม่เข้าสู่ระบบและบัญชีผู้เยี่ยมชม g1@example.org

Browser: chrome 155.0.8059.82; ระยะเวลา 13.625 วินาที
ผลที่คาดหวัง: ผู้ไม่ล็อกอินถูกพาไปเข้าสู่ระบบ; guest ไม่สามารถสร้างงานสำเร็จ; หากเห็นฟอร์มแต่ส่งไม่ได้ให้บันทึกพฤติกรรมทั้งสองส่วน; ไม่มีงานใหม่จากคำขอที่ถูกปฏิเสธ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /student/research/new — PASS

### TC-024 — ปฏิเสธรายการผู้เขียนและที่ปรึกษาที่รูปแบบผิด รหัสไม่มีจริง บทบาทผิด หรือหมวดหมู่ไม่พบ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.331 วินาที
ผลที่คาดหวัง: หน้าเว็บไม่แสดงบัญชี role ผิดในตัวเลือกผู้เกี่ยวข้อง; การเห็นตัวเลือกถูกต้องยังไม่ยืนยัน server validation; TC นี้ครบเมื่อผล API ทุก subcase ในส่วนเสริมมีหลักฐาน
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-025 — ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน

Browser: chrome 155.0.8059.82; ระยะเวลา 5.439 วินาที
ผลที่คาดหวัง: รายชื่อร่วมรุ่น 67 เลือกได้และรุ่น 64 ไม่ถูกเสนอในฟอร์มนี้; ต้องมีผลปฏิเสธฝั่ง backend เพิ่มจึงยืนยันการตรวจรุ่นครบ ไม่อ้างว่าเลือกคนต่างรุ่นแล้วกดส่งได้จาก UI ปกติ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /student/research/new — PASS
7. กรอกช่อง: title_th — PASS
8. กรอกช่อง: title_en — PASS
9. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
10. เลือกผู้เกี่ยวข้อง: participant — PASS

### TC-026 — อัปโหลดภาพปกและเอกสาร PDF ที่ขนาดต่ำกว่า เท่ากับ และเกินขีดจำกัดหนึ่งไบต์

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.56 วินาที
ผลที่คาดหวัง: ไฟล์ต่ำกว่า/เท่าขีดจำกัดผ่านการตรวจของระบบและส่งสำเร็จเมื่อข้อมูลอื่นครบ; ไฟล์เกินถูกปฏิเสธพร้อมแจ้งข้อผิดพลาดและไม่แสดงส่งสำเร็จ; การไม่รับบนหน้าเว็บยังไม่พิสูจน์การเก็บ/cleanup ฝั่ง server ต้องตรวจส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-027 — ปฏิเสธไฟล์เอกสารชนิดหรือเนื้อหาผิดและตรวจไม่ให้ไฟล์ใหม่ค้างหรือไฟล์เดิมสูญหายเมื่อแก้ไขล้มเหลว

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.287 วินาที
ผลที่คาดหวัง: ปฏิเสธไฟล์ผิด ไม่แสดงส่งสำเร็จ และข้อมูลเดิมควรยังเปิดใช้ได้; หากไฟล์เดิมหายหลังการแก้ไขล้มเหลวให้บันทึก defect; ต้องตรวจ disk/rollback ในส่วนเสริม
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)


ข้อผิดพลาด: TC-027: failed update removed the previous cover despite database rollback assert False  +  where False = exists()  +    where exists = PosixPath('/var/folders/ss/vccctpfj2mv5w57zd463j8yw0000gn/T/uniresearch-selenium-yv3huy8o/static/uploads/covers/3fee63f8e7b34a60bc09274f7546b582.png').exists

### TC-028 — รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น

Browser: chrome 155.0.8059.82; ระยะเวลา 4.244 วินาที
ผลที่คาดหวัง: รายการรวมงานที่ส่งเองและร่วมเขียน แม้ไม่ใช่ผู้ส่งทุกงาน; ไม่แสดงงานที่ไม่เกี่ยวข้องหลังล้างตัวกรอง; ความถูกต้องของ ID/ลำดับตรวจเพิ่มในส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /student/research — PASS
7. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS
8. รอข้อความที่มองเห็น: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา — PASS

### TC-029 — เจ้าของแก้ผลงานที่เผยแพร่เป็น การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ) แล้วสถานะกลับไปรอตรวจสอบ

Browser: chrome 155.0.8059.82; ระยะเวลา 14.874 วินาที
ผลที่คาดหวัง: ชื่อใหม่คงอยู่หลังโหลดใหม่และสถานะกลับรอตรวจสอบ; สิทธิ์ co-author/admin และข้อมูลสัมพันธ์ตรวจแยกตามส่วนเสริม ไม่อนุมานจากเจ้าของผ่านครั้งเดียว
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ) — PASS
7. เปิดหน้า: /student/research — PASS
8. คลิก: a[href="/student/research/edit/1"] — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. กรอกช่อง: academic_year — PASS
12. เลือกผู้เกี่ยวข้อง: category_id — PASS
13. เลือกผู้เกี่ยวข้อง: department — PASS
14. เลือกผู้เกี่ยวข้อง: work_type — PASS
15. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
16. เลือกผู้เกี่ยวข้อง: participant — PASS
17. เลือกผู้เกี่ยวข้อง: participant — PASS
18. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
19. กรอกช่อง: abstract — PASS
20. กรอกช่อง: keyword_input_temp — PASS
21. กรอกช่อง: keyword_input_temp — PASS
22. กรอกช่อง: keyword_input_temp — PASS
23. กรอกช่อง: keyword_input_temp — PASS
24. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
25. อัปโหลดไฟล์: cover_image — PASS
26. อัปโหลดไฟล์: document — PASS
27. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
28. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
29. รอข้อความที่มองเห็น: แก้ไขผลงานเรียบร้อยแล้ว — PASS

### TC-030 — ปฏิเสธการแก้ผลงานเลข 3 ของ 674259003@webmail.npru.ac.th โดยนักศึกษาอื่นและที่ปรึกษาที่ไม่ได้เป็นเจ้าของหรือผู้เขียน

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.535 วินาที
ผลที่คาดหวัง: ผู้ไม่มีสิทธิ์ไม่สามารถแก้ชื่อหรือไฟล์ของงานสำเร็จ; อาจเปิดหน้าได้แต่บันทึกไม่ได้ตาม guard ปัจจุบัน ต้องบันทึกผลจริงและมี API403 ประกอบ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-031 — ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป

Browser: chrome 155.0.8059.82; ระยะเวลา 18.625 วินาที
ผลที่คาดหวัง: งานใช้ข้อมูลและ PDF ใหม่และกลับรอตรวจสอบ; การเปิด PDF ใหม่ได้อย่างเดียวไม่ยืนยันว่าเก็บไฟล์เก่าแล้ว ต้องมีส่วนเสริมยืนยัน revision
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /research/2 — PASS
7. ตรวจสถานะบนหน้าจอ: ส่งกลับแก้ไข — PASS
8. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) — PASS
9. เปิดหน้า: /student/research — PASS
10. คลิก: a[href="/student/research/edit/2"] — PASS
11. กรอกช่อง: title_th — PASS
12. กรอกช่อง: title_en — PASS
13. กรอกช่อง: academic_year — PASS
14. เลือกผู้เกี่ยวข้อง: category_id — PASS
15. เลือกผู้เกี่ยวข้อง: department — PASS
16. เลือกผู้เกี่ยวข้อง: work_type — PASS
17. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
18. เลือกผู้เกี่ยวข้อง: participant — PASS
19. เลือกผู้เกี่ยวข้อง: participant — PASS
20. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
21. กรอกช่อง: abstract — PASS
22. กรอกช่อง: keyword_input_temp — PASS
23. กรอกช่อง: keyword_input_temp — PASS
24. กรอกช่อง: keyword_input_temp — PASS
25. กรอกช่อง: keyword_input_temp — PASS
26. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
27. อัปโหลดไฟล์: cover_image — PASS
28. อัปโหลดไฟล์: document — PASS
29. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
30. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
31. รอข้อความที่มองเห็น: แก้ไขผลงานเรียบร้อยแล้ว — PASS
32. เปิดหน้า: /student/research — PASS
33. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) — PASS
34. อ่านสถานะในผลงานของฉัน: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) — PASS

### TC-032 — เจ้าของลบ การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) แล้วลบข้อมูลสัมพันธ์และไฟล์หลักของงานพร้อมตรวจไฟล์เวอร์ชันเก่าตกค้าง

Browser: chrome 155.0.8059.82; ระยะเวลา 18.232 วินาที
ผลที่คาดหวัง: หลังยืนยันไม่พบงานในรายการและ URL เดิมเปิดข้อมูลไม่ได้; ไฟล์ปัจจุบัน/relations ควรถูกลบ; ไฟล์ revision เก่าที่ตกค้างต้องรายงานแยก ไม่ตัดสินจาก UI อย่างเดียว
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) — PASS
7. คลิก: a[href="/student/research"] — PASS
8. คลิก: a[href="/student/research/new"] — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. กรอกช่อง: academic_year — PASS
12. เลือกผู้เกี่ยวข้อง: category_id — PASS
13. เลือกผู้เกี่ยวข้อง: department — PASS
14. เลือกผู้เกี่ยวข้อง: work_type — PASS
15. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
16. เลือกผู้เกี่ยวข้อง: participant — PASS
17. เลือกผู้เกี่ยวข้อง: participant — PASS
18. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
19. กรอกช่อง: abstract — PASS
20. กรอกช่อง: keyword_input_temp — PASS
21. กรอกช่อง: keyword_input_temp — PASS
22. กรอกช่อง: keyword_input_temp — PASS
23. กรอกช่อง: keyword_input_temp — PASS
24. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
25. อัปโหลดไฟล์: cover_image — PASS
26. อัปโหลดไฟล์: document — PASS
27. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
28. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
29. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
30. เปิดหน้า: /research/6 — PASS
31. คลิก: //button[normalize-space(.)='ลบผลงาน (Delete)'] — PASS

ข้อผิดพลาด: Message: no such alert   (Session info: chrome=155.0.8059.82) Stacktrace: 0   chromedriver                        0x0000000102554884 chromedriver + 3541124 1   chromedriver                        0x0000000102238ee8 chromedriver + 282344 2   chromedriver                        0x000000010225c33c chromedriver + 426812 3   chromedriver                        0x000000010225c1c8 chromedriver + 426440 4   chromedriver                        0x000000010227776c chromedriver + 538476 5   chromedriver                        0x00000001025232e8 chromedriver + 3338984 6   chromedriver                        0x00000001025265dc chromedriver + 3352028 7   chromedriver                        0x000000010250c838 chromedriver + 3246136 8   chromedriver                        0x0000000102526e6c chromedriver + 3354220 9   chromedriver                        0x000000010250011c chromedriver + 3195164 10  chromedriver                        0x0000000102542f1c chromedriver + 3469084 11  chromedriver                        0x000000010254307c chromedriver + 3469436 12  chromedriver                        0x0000000102554554 chromedriver + 3540308 13  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 14  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-033 — ปฏิเสธการลบงานเลข 3 ของ 674259003@webmail.npru.ac.th เมื่อผู้ร้องขอเป็น 674259009@webmail.npru.ac.th ที่ไม่มีส่วนเกี่ยวข้อง

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.262 วินาที
ผลที่คาดหวัง: นักศึกษาอื่นไม่สามารถลบงาน; งานยังเปิดได้โดยบัญชีเจ้าของ; การไม่เห็นปุ่มอย่างเดียวต้องเสริมผล backend ก่อนรับรอง RBAC
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-034 — นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง

Browser: chrome 155.0.8059.82; ระยะเวลา 5.93 วินาที
ผลที่คาดหวัง: ดาวน์โหลดได้จริงและชื่อไฟล์ตรงรหัสงาน; ตัวนับ/ผู้ดาวน์โหลดเพิ่มต่อคำขอถูกต้องตามส่วนเสริม ไม่ใช้ toast อย่างเดียวตัดสิน
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /research/1 — PASS
7. คลิก: //button[normalize-space(.)='Download PDF'] — PASS
8. รอข้อความที่มองเห็น: The document download has started. — PASS

### TC-035 — ปฏิเสธการขอดาวน์โหลดเมื่อไม่มี token งานไม่มีไฟล์ หรือใช้รหัสงานที่ไม่มีในระบบ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.25 วินาที
ผลที่คาดหวัง: anonymous ถูกขอให้ล็อกอิน; งานไม่มีไฟล์ไม่เริ่มดาวน์โหลด; API401/404 และ counter ไม่เปลี่ยนต้องตรวจเพิ่มเติม เพราะปุ่ม disabled ไม่ส่งคำขอ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-036 — คิวรอตรวจแสดงงานตามการมอบหมายของที่ปรึกษาและปฏิเสธนักศึกษาพร้อมตรวจความต่างระหว่าง UI กับ API

Browser: chrome 155.0.8059.82; ระยะเวลา 15.24 วินาที
ผลที่คาดหวัง: งานในความดูแลแสดงตามที่ปรึกษา; admin เห็นงานรอตรวจทั้งสอง; คิวอาจารย์ปัจจุบันอาจแสดงกว้างกว่า pendingAPI ต้องบันทึก ไม่กำหนดว่าคิวต้องซ่อน “การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล” ถ้า UI ยังทำต่าง
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/reviews — PASS
7. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
8. ล็อกอินผ่านฟอร์ม: admin@uniresearch.ac.th — PASS
9. เปิดหน้า: /login — PASS
10. กรอกช่อง: email — PASS
11. กรอกช่อง: password — PASS
12. คลิก: form button[type="submit"] — PASS
13. เปิดหน้า: /admin/reviews — PASS
14. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
15. รอข้อความที่มองเห็น: การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล — PASS

### TC-037 — ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ

Browser: chrome 155.0.8059.82; ระยะเวลา 6.535 วินาที
ผลที่คาดหวัง: อาจารย์เห็นเฉพาะงานที่เคยตรวจ; งานกลับ pending ที่เคยตรวจยังมีประวัติ; การเปิดหน้าประวัติได้ไม่ยืนยัน nestedreview ทุกแถวเป็นของตน ให้ตรวจตาม contract ส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/history — PASS
7. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS
8. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS

### TC-038 — ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review

Browser: chrome 155.0.8059.82; ระยะเวลา 9.715 วินาที
ผลที่คาดหวัง: หน้าแจ้งบันทึกผลสำเร็จหลังยืนยัน; รายละเอียดและประวัติเป็นอนุมัติ; นักศึกษาเห็นสถานะเผยแพร่แล้วในรายการของตน; ตรวจ reviewer/คะแนนที่บันทึกในส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: a[href="/advisor/research"] — PASS
7. คลิก: a[href="/advisor/reviews/2"] — PASS
8. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
9. เลือกตัวเลือก: [name="status_result"]=approved — PASS
10. กรอกช่อง: score — PASS
11. กรอกช่อง: comment_text — PASS
12. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
13. รอข้อความที่มองเห็น: ยืนยันการอนุมัติผลงาน — PASS
14. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
15. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
16. เปิดหน้า: /research/2 — PASS
17. ตรวจสถานะบนหน้าจอ: อนุมัติแล้ว — PASS

### TC-039 — ปฏิเสธการตรวจงานเมื่อที่ปรึกษาไม่ได้รับมอบหมาย งานไม่รอตรวจ หรือส่งผลตรวจนอกค่าที่รองรับ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.817 วินาที
ผลที่คาดหวัง: ที่ปรึกษาที่ไม่ assigned ไม่สามารถบันทึกผล “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย”; งานอนุมัติแล้วไม่รับการตรวจซ้ำ; ไม่มีผลตรวจใหม่/เปลี่ยน status จากคำขอปฏิเสธ; ค่า enum ผิดพิสูจน์จากส่วนเสริม ไม่เพิ่มตัวเลือกสมมติบน UI
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-040 — อนุมัติ ปฏิเสธ และส่งงานกลับแก้ไขพร้อมบันทึกคะแนน ความคิดเห็น และแจ้งผู้ส่งกับผู้เขียนร่วม

Browser: chrome 155.0.8059.82; ระยะเวลา 52.188 วินาที
ผลที่คาดหวัง: แต่ละสถานะมีข้อความสำเร็จและผู้ส่ง/ผู้จัดทำร่วมได้รับแจ้งเตือนตรงผล; ไม่แจ้งซ้ำเพียงเพราะผู้ส่งเป็นผู้จัดทำด้วย; ประเภท/ผู้รับ/published_at ตรวจในส่วนเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: a[href="/advisor/reviews"] — PASS
7. คลิก: a[href="/advisor/reviews/2"] — PASS
8. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
9. เลือกตัวเลือก: [name="status_result"]=approved — PASS
10. กรอกช่อง: score — PASS
11. กรอกช่อง: comment_text — PASS
12. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
13. รอข้อความที่มองเห็น: ยืนยันการอนุมัติผลงาน — PASS
14. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
15. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
16. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
17. เปิดหน้า: /login — PASS
18. กรอกช่อง: email — PASS
19. กรอกช่อง: password — PASS
20. คลิก: form button[type="submit"] — PASS
21. คลิก: [aria-label="การแจ้งเตือน"] — PASS
22. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
23. ล็อกอินผ่านฟอร์ม: 674259003@webmail.npru.ac.th — PASS
24. เปิดหน้า: /login — PASS
25. กรอกช่อง: email — PASS
26. กรอกช่อง: password — PASS
27. คลิก: form button[type="submit"] — PASS
28. คลิก: [aria-label="การแจ้งเตือน"] — PASS
29. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
30. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
31. เปิดหน้า: /login — PASS
32. กรอกช่อง: email — PASS
33. กรอกช่อง: password — PASS
34. คลิก: form button[type="submit"] — PASS
35. คลิก: a[href="/advisor/reviews"] — PASS
36. คลิก: a[href="/advisor/reviews/6"] — PASS
37. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) (rejected) — PASS
38. เลือกตัวเลือก: [name="status_result"]=rejected — PASS
39. กรอกช่อง: score — PASS
40. กรอกช่อง: comment_text — PASS
41. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
42. รอข้อความที่มองเห็น: ยืนยันการปฏิเสธผลงาน — PASS
43. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
44. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
45. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
46. เปิดหน้า: /login — PASS
47. กรอกช่อง: email — PASS
48. กรอกช่อง: password — PASS
49. คลิก: form button[type="submit"] — PASS
50. คลิก: [aria-label="การแจ้งเตือน"] — PASS
51. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) (rejected) — PASS
52. ล็อกอินผ่านฟอร์ม: 674259003@webmail.npru.ac.th — PASS
53. เปิดหน้า: /login — PASS
54. กรอกช่อง: email — PASS
55. กรอกช่อง: password — PASS
56. คลิก: form button[type="submit"] — PASS
57. คลิก: [aria-label="การแจ้งเตือน"] — PASS
58. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) (rejected) — PASS
59. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
60. เปิดหน้า: /login — PASS
61. กรอกช่อง: email — PASS
62. กรอกช่อง: password — PASS
63. คลิก: form button[type="submit"] — PASS
64. คลิก: a[href="/advisor/reviews"] — PASS
65. คลิก: a[href="/advisor/reviews/7"] — PASS
66. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) (needs_revision) — PASS
67. เลือกตัวเลือก: [name="status_result"]=needs_revision — PASS
68. กรอกช่อง: score — PASS
69. กรอกช่อง: comment_text — PASS
70. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
71. รอข้อความที่มองเห็น: ยืนยันการส่งกลับแก้ไข — PASS
72. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
73. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
74. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
75. เปิดหน้า: /login — PASS
76. กรอกช่อง: email — PASS
77. กรอกช่อง: password — PASS
78. คลิก: form button[type="submit"] — PASS
79. คลิก: [aria-label="การแจ้งเตือน"] — PASS
80. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) (needs_revision) — PASS
81. ล็อกอินผ่านฟอร์ม: 674259003@webmail.npru.ac.th — PASS
82. เปิดหน้า: /login — PASS
83. กรอกช่อง: email — PASS
84. กรอกช่อง: password — PASS
85. คลิก: form button[type="submit"] — PASS
86. คลิก: [aria-label="การแจ้งเตือน"] — PASS
87. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) (needs_revision) — PASS

### TC-041 — ผู้ดูแลระบบเปลี่ยนที่ปรึกษาของงานเลข 2 จาก udsanee@webmail.npru.ac.th เป็น wuttha@webmail.npru.ac.th และนักศึกษาเปลี่ยนไม่ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 12.14 วินาที
ผลที่คาดหวัง: หลังเปลี่ยนสำเร็จ “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย” ย้ายจากงานในความดูแลของอุษณีย์ไปวรเชษฐ์; TC นี้เป็น API/integration ที่ UI ใช้ยืนยันผล ไม่สามารถรับรองครบจากการกดหน้าเว็บอย่างเดียว
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: a[href="/advisor/advisees"] — PASS
7. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS
8. รอข้อความที่มองเห็น: งานในความดูแล — PASS
9. ล็อกอินผ่านฟอร์ม: wuttha@webmail.npru.ac.th — PASS
10. เปิดหน้า: /login — PASS
11. กรอกช่อง: email — PASS
12. กรอกช่อง: password — PASS
13. คลิก: form button[type="submit"] — PASS
14. คลิก: a[href="/advisor/advisees"] — PASS
15. รอข้อความที่มองเห็น: การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย — PASS

### TC-042 — บันทึกและยกเลิกงานเลข 1 ในรายการโปรดของ 674259009@webmail.npru.ac.th พร้อมตรวจหน้ารายการบันทึก

Browser: chrome 155.0.8059.82; ระยะเวลา 9.052 วินาที
ผลที่คาดหวัง: บันทึกครั้งแรกเห็นใน Favorites; ยกเลิกครั้งที่สองแล้วไม่อยู่; บัญชีอื่นไม่เปลี่ยนตาม; persistence/ownership ตรวจเสริม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /research/1 — PASS
7. คลิก: //button[normalize-space(.)='Save research'] — PASS
8. เปิดหน้า: /account/saved — PASS
9. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS

### TC-043 — อ่านแจ้งเตือนและทำเครื่องหมายอ่านทีละรายการหรือทั้งหมดเฉพาะของ 674259009@webmail.npru.ac.th โดยไม่แก้ของ 674259003@webmail.npru.ac.th

Browser: chrome 155.0.8059.82; ระยะเวลา 6.439 วินาที
ผลที่คาดหวัง: นรงศ์ศักดิ์ไม่เห็น N2; mark-one เปลี่ยนเฉพาะรายการที่กด; read-all เปลี่ยนเฉพาะบัญชีตนและคงอยู่หลัง reload; N2 ของกิติกรยังไม่อ่าน
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: [aria-label="การแจ้งเตือน"] — PASS
7. รอข้อความที่มองเห็น: N1 Selenium — PASS
8. รอข้อความที่มองเห็น: แจ้งเตือนเพิ่มเติมสำหรับอ่านทั้งหมด — PASS
9. คลิก: //div[h4[normalize-space(.)='N1 Selenium']]//button[@title='ทำเครื่องหมายว่าอ่านแล้ว'] — PASS
10. รอข้อความที่มองเห็น: ทำเครื่องหมายว่าอ่านแล้ว — PASS
11. คลิก: //button[normalize-space(.)='อ่านทั้งหมด'] — PASS
12. รอข้อความที่มองเห็น: ทำเครื่องหมายว่าอ่านแล้วทั้งหมด — PASS

### TC-044 — เรียก AI ช่วยเขียนทั้งสี่บริการด้วยข้อมูลจริงในชุดทดสอบและปฏิเสธคำขอไม่มี token หรือชนิดข้อมูลผิด

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0.277 วินาที
ผลที่คาดหวัง: ทั้งสี่บริการแสดงผล mock ผ่านหน้าจอและนำผลไปใช้ได้ตามปุ่ม; ไม่ถือว่าผ่าน schema/RBAC ทุก subcase จนมีหลักฐานเพิ่มเติม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)


### TC-045 — ตรวจสิทธิ์ AI สรุปแดชบอร์ดและการแชตสาธารณะค้นงานด้วยคำว่า “การ” เมื่อระบบใช้ text-search fallback

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 1.178 วินาที
ผลที่คาดหวัง: chat สาธารณะตอบและอ้างเฉพาะงานเผยแพร่; fallback ไม่ทำให้หน้าต่างตอบ error แทนผล; dashboard-insights/RBAC เป็นส่วนเสริมที่ต้องมีผลของตนเอง ไม่อนุมานจาก chat ผ่าน
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)


ข้อผิดพลาด: POST /ai/chat: expected 200, got 500

### TC-046 — ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ

Browser: chrome 155.0.8059.82; ระยะเวลา 26.023 วินาที
ผลที่คาดหวัง: ผล mock ทั้งสี่แสดงครบและสลับแท็บได้; นักศึกษาไม่เข้าถึง workspace อาจารย์; ไม่มี token/ID ไม่พบ/admin ต้องตรวจ API เพิ่ม
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: a[href="/advisor/research"] — PASS
7. คลิก: a[href="/advisor/reviews/1"] — PASS
8. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS
9. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
10. คลิก: //button[normalize-space(.)='Pre-Review Analysis'] — PASS
11. รอข้อความที่มองเห็น: Deterministic pre-review — PASS
12. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
13. คลิก: //button[normalize-space(.)='Plagiarism Check'] — PASS
14. รอข้อความที่มองเห็น: Deterministic similarity — PASS
15. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
16. คลิก: //button[normalize-space(.)='Reviewer Matching'] — PASS
17. รอข้อความที่มองเห็น: Deterministic advisor — PASS
18. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
19. คลิก: //button[normalize-space(.)='Review Summary'] — PASS
20. รอข้อความที่มองเห็น: Deterministic review summary — PASS
21. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
22. เปิดหน้า: /login — PASS
23. กรอกช่อง: email — PASS
24. กรอกช่อง: password — PASS
25. คลิก: form button[type="submit"] — PASS
26. เปิดหน้า: /advisor/reviews/1 — PASS

### TC-047 — นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่

Browser: chrome 155.0.8059.82; ระยะเวลา 37.343 วินาที
ผลที่คาดหวัง: งานเดียวกันเดินจากส่ง→รอตรวจ→อนุมัติ/เผยแพร่ครบด้วยการกดจริง; ผู้ส่งกลับเข้ามาเห็นผลและแจ้งเตือน; ใช้ ID เดียวตลอดและตรวจ DB เสริมก่อนรับรอง E2E ครบ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
7. คลิก: a[href="/student/research"] — PASS
8. คลิก: a[href="/student/research/new"] — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. กรอกช่อง: academic_year — PASS
12. เลือกผู้เกี่ยวข้อง: category_id — PASS
13. เลือกผู้เกี่ยวข้อง: department — PASS
14. เลือกผู้เกี่ยวข้อง: work_type — PASS
15. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
16. เลือกผู้เกี่ยวข้อง: participant — PASS
17. เลือกผู้เกี่ยวข้อง: participant — PASS
18. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
19. กรอกช่อง: abstract — PASS
20. กรอกช่อง: keyword_input_temp — PASS
21. กรอกช่อง: keyword_input_temp — PASS
22. กรอกช่อง: keyword_input_temp — PASS
23. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
24. อัปโหลดไฟล์: cover_image — PASS
25. อัปโหลดไฟล์: document — PASS
26. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
27. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
28. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
29. เปิดหน้า: /student/research — PASS
30. รอข้อความที่มองเห็น: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
31. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
32. เปิดหน้า: /login — PASS
33. กรอกช่อง: email — PASS
34. กรอกช่อง: password — PASS
35. คลิก: form button[type="submit"] — PASS
36. เปิดหน้า: /advisor/reviews — PASS
37. รอข้อความที่มองเห็น: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
38. คลิก: a[href="/advisor/reviews"] — PASS
39. คลิก: a[href="/advisor/reviews/6"] — PASS
40. รอข้อความที่มองเห็น: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
41. เลือกตัวเลือก: [name="status_result"]=approved — PASS
42. กรอกช่อง: score — PASS
43. กรอกช่อง: comment_text — PASS
44. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
45. รอข้อความที่มองเห็น: ยืนยันการอนุมัติผลงาน — PASS
46. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
47. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
48. เปิดหน้า: /research/6 — PASS
49. ตรวจสถานะบนหน้าจอ: อนุมัติแล้ว — PASS
50. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
51. เปิดหน้า: /login — PASS
52. กรอกช่อง: email — PASS
53. กรอกช่อง: password — PASS
54. คลิก: form button[type="submit"] — PASS
55. เปิดหน้า: /student/research — PASS
56. รอข้อความที่มองเห็น: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
57. เปิดหน้า: /student/research — PASS
58. รอข้อความที่มองเห็น: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
59. อ่านสถานะในผลงานของฉัน: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS

### TC-048 — ผู้ดูแลระบบเพิ่ม E2E Selenium Category และบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บพร้อมปฏิเสธ API จัดการของนักศึกษา

Browser: chrome 155.0.8059.82; ระยะเวลา 16.344 วินาที
ผลที่คาดหวัง: admin เพิ่มข้อมูลผ่านเว็บและข้อมูลคงอยู่หลัง reload; นักศึกษาไม่สามารถทำรายการจัดการสำเร็จ; บันทึกการเข้าหน้า/admin แยกจากสิทธิ์ API ไม่คาดว่าต้องซ่อนหน้าเสมอ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: admin@uniresearch.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /admin/categories — PASS
7. กรอกช่อง: category_name — PASS
8. กรอกช่อง: description — PASS
9. คลิก: //button[normalize-space(.)='เพิ่มหมวดหมู่'] — PASS
10. เปิดหน้า: /admin/categories — PASS
11. รอข้อความที่มองเห็น: E2E Selenium Category — PASS
12. คลิก: a[href="/admin/users"] — PASS
13. คลิก: //button[normalize-space(.)='เพิ่มผู้ใช้ใหม่'] — PASS
14. กรอกช่อง: email — PASS
15. กรอกช่อง: first_name — PASS
16. กรอกช่อง: last_name — PASS
17. กรอกช่อง: student_id — PASS
18. กรอกช่อง: password — PASS
19. เลือกผู้เกี่ยวข้อง: role — PASS
20. เลือกผู้เกี่ยวข้อง: department — PASS
21. คลิก: form button[type="submit"] — PASS
22. รอข้อความที่มองเห็น: 674259002@webmail.npru.ac.th — PASS
23. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
24. เปิดหน้า: /login — PASS
25. กรอกช่อง: email — PASS
26. กรอกช่อง: password — PASS
27. คลิก: form button[type="submit"] — PASS
28. เปิดหน้า: /admin — PASS

ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
