# รายงานการรันทดสอบ UI/API — UniResearch

**เอกสารอ้างอิง:** [TEST-CASES.md](TEST-CASES.md) · [uniresearch-test-cases-Narongsak.md](uniresearch-test-cases-Narongsak.md) · [TEST-PLAN.md](TEST-PLAN.md) · [TEST-REPORT.md](TEST-REPORT.md) · [uniresearch-test-plan-and-report-Narongsak.md](uniresearch-test-plan-and-report-Narongsak.md) · [TESTING-GUIDE.md](TESTING-GUIDE.md)

เวลารัน UTC: 2026-10-16T12:54:23.931201+00:00  
โหมด: **headed**; Browser: chrome 155.0.8059.82; commit: `16490e54bd66bb12e0affb3ea16ac1a9bc1b3f57` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 18
- UI-automatable: 18
- รัน browser tests: 18
- PASS: 18; FAIL: 0; BLOCKED: 0
- API-only Test Cases: 0
- UI automation coverage ใน session นี้: 100.0%

Coverage ของ UI นับเฉพาะกรณีที่สคริปต์มี browser fixture และรัน WebDriver จริง API/DB/file assertions แยกเป็นหลักฐานเสริม; ผลผ่านหมายถึง assertions ที่สคริปต์รัน ไม่ใช่การรับรอง PostgreSQL/live AI หรือการลงนามยอมรับระบบ

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/auth/TC-001/20261016-124752-257620/009-final-result.png) |
| TC-004 | AUTH | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/auth/TC-004/20261016-124752-257620/004-final-result.png) |
| TC-007 | AUTH | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/auth/TC-007/20261016-124752-257620/007-final-result.png) |
| TC-010 | CATEGORY | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/category/TC-010/20261016-124752-257620/013-final-result.png) |
| TC-013 | USER | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/user/TC-013/20261016-124752-257620/009-final-result.png) |
| TC-016 | RECOMMENDATION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/recommendation/TC-016/20261016-124752-257620/002-final-result.png) |
| TC-019 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-019/20261016-124752-257620/003-final-result.png) |
| TC-022 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-022/20261016-124752-257620/034-final-result.png) |
| TC-025 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-025/20261016-124752-257620/008-final-result.png) |
| TC-028 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-028/20261016-124752-257620/007-final-result.png) |
| TC-031 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-031/20261016-124752-257620/025-final-result.png) |
| TC-034 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-034/20261016-124752-257620/007-final-result.png) |
| TC-037 | REVIEW | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/review/TC-037/20261016-124752-257620/006-final-result.png) |
| TC-038 | REVIEW | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/review/TC-038/20261016-124752-257620/014-final-result.png) |
| TC-043 | NOTIFICATION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/notification/TC-043/20261016-124752-257620/012-final-result.png) |
| TC-046 | AI | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/ai/TC-046/20261016-124752-257620/028-final-result.png) |
| TC-047 | E2E | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/e2e/TC-047/20261016-124752-257620/043-final-result.png) |
| TC-048 | E2E | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/e2e/TC-048/20261016-124752-257620/016-final-result.png) |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](../../../tests/selenium/reports/20261016-124752-257620/ui-results.json)

### TC-001 — สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ

Browser: chrome 155.0.8059.82; ระยะเวลา 6.629 วินาที  
ผลที่คาดหวัง: เมื่อสมัครสำเร็จ หน้าแสดง “สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ” และยังต้องเข้าสู่ระบบด้วยตนเอง; การเพิ่ม role ในคำขอต้องไม่ทำให้บัญชีมีสิทธิ์ผู้ดูแลระบบ; ต้องมีผลตรวจส่วนเสริมก่อนตัดสินประเด็นนี้ผ่าน  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /register — PASS
2. กรอกช่อง: first_name — PASS
3. กรอกช่อง: last_name — PASS
4. กรอกช่อง: email — PASS
5. กรอกช่อง: password — PASS
6. กรอกช่อง: confirmPassword — PASS
7. คลิก: //button[normalize-space(.)='สร้างบัญชี'] — PASS
8. รอข้อความที่มองเห็น: สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ — PASS

### TC-004 — ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session

Browser: chrome 155.0.8059.82; ระยะเวลา 3.798 วินาที  
ผลที่คาดหวัง: แสดงข้อความ “อีเมลหรือรหัสผ่านไม่ถูกต้อง”; ยังอยู่หน้าล็อกอินและเข้าพื้นที่ส่วนตัวไม่ได้  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /login — PASS
2. กรอกช่อง: email — PASS
3. กรอกช่อง: password — PASS
4. คลิก: //button[normalize-space(.)='เข้าสู่ระบบ'] — PASS
5. อ่านข้อความปฏิเสธ: toast-error — PASS

### TC-007 — ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 8.861 วินาที  
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

### TC-010 — ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 14.768 วินาที  
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

### TC-013 — นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้

Browser: chrome 155.0.8059.82; ระยะเวลา 8.767 วินาที  
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

### TC-016 — คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret

Browser: chrome 155.0.8059.82; ระยะเวลา 3.056 วินาที  
ผลที่คาดหวัง: คำแนะนำของคำค้นไม่ว่างไม่เผยชื่อหรือ keyword ของงานรอตรวจ; คำค้นว่างอาจแสดงคำที่เคยค้น จึงไม่สรุปว่าเป็นข้อมูลจากงานที่เผยแพร่ทุกคำ  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research — PASS
2. พิมพ์คำค้นหา: publickeyword — PASS
3. รอข้อความที่มองเห็น: publickeyword — PASS
4. ตรวจสอบการซ่อน: pendingsecret และชื่องานรอตรวจไม่ปรากฏ — PASS

### TC-019 — แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม

Browser: chrome 155.0.8059.82; ระยะเวลา 2.386 วินาที  
ผลที่คาดหวัง: แสดง “รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ” โดยไม่แสดงข้อมูลของงานอื่น; ผู้ตรวจตรวจส่วนเสริมว่าไม่เกิด view log ของรหัสที่ไม่มี  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research/999999999 — PASS
2. รอข้อความที่มองเห็น: รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ — PASS

### TC-022 — นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน

Browser: chrome 155.0.8059.82; ระยะเวลา 18.821 วินาที  
ผลที่คาดหวัง: กรอกครบทั้งห้าขั้นแล้วมีข้อความ “ส่งผลงานเรียบร้อยแล้ว”; งานใหม่อยู่รายการของฉันในสถานะรอตรวจสอบ; รายละเอียดตรงค่าที่กรอกและไฟล์ใช้งานได้; การบันทึก relations และ bytes ต้องมีผลส่วนเสริมประกอบ  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) — PASS
7. เปิดหน้า: /student/research/new — PASS
8. กรอกช่อง: academic_year — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
12. เลือกผู้เกี่ยวข้อง: participant (กิติกร เทศธรรม) — PASS
13. เลือกผู้เกี่ยวข้อง: participant (ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์) — PASS
14. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
15. กรอกช่อง: abstract — PASS
16. กรอกช่อง: keyword_input_temp — PASS
17. คลิก: //button[normalize-space(.)='เพิ่ม'] — PASS
18. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
19. อัปโหลดไฟล์: cover_image — PASS
20. อัปโหลดไฟล์: document — PASS
21. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
22. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
23. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
24. เปิดหน้า: /student/research — PASS
25. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) — PASS
26. อ่านสถานะในผลงานของฉัน: รอตรวจสอบ — PASS

### TC-025 — ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน

Browser: chrome 155.0.8059.82; ระยะเวลา 6.260 วินาที  
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
10. ตรวจสอบตัวเลือกผู้เกี่ยวข้อง: เสนอเฉพาะรุ่น 67 — PASS

### TC-028 — รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น

Browser: chrome 155.0.8059.82; ระยะเวลา 6.121 วินาที  
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

### TC-031 — ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป

Browser: chrome 155.0.8059.82; ระยะเวลา 18.788 วินาที  
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
9. เปิดหน้า: /student/research/edit/2 — PASS
10. กรอกช่อง: title_th — PASS
11. กรอกช่อง: title_en — PASS
12. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
13. อัปโหลดไฟล์: cover_image — PASS
14. อัปโหลดไฟล์: document (ฉบับใหม่) — PASS
15. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
16. รอข้อความที่มองเห็น: แก้ไขผลงานเรียบร้อยแล้ว — PASS
17. เปิดหน้า: /student/research — PASS
18. อ่านสถานะในผลงานของฉัน: รอตรวจสอบ — PASS

### TC-034 — นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง

Browser: chrome 155.0.8059.82; ระยะเวลา 7.333 วินาที  
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

### TC-037 — ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ

Browser: chrome 155.0.8059.82; ระยะเวลา 8.139 วินาที  
ผลที่คาดหวัง: อาจารย์เห็นเฉพาะงานที่เคยตรวจ; งานกลับ pending ที่เคยตรวจยังมีประวัติ; การเปิดหน้าประวัติได้ไม่ยืนยัน nestedreview ทุกแถวเป็นของตน ให้ตรวจตาม contract ส่วนเสริม  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/history — PASS
7. รอข้อความที่มองเห็น: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ — PASS

### TC-038 — ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review

Browser: chrome 155.0.8059.82; ระยะเวลา 18.346 วินาที  
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

### TC-043 — อ่านแจ้งเตือนและทำเครื่องหมายอ่านทีละรายการหรือทั้งหมดเฉพาะของ 674259009@webmail.npru.ac.th โดยไม่แก้ของ 674259003@webmail.npru.ac.th

Browser: chrome 155.0.8059.82; ระยะเวลา 11.063 วินาที  
ผลที่คาดหวัง: นรงศ์ศักดิ์ไม่เห็น N2; mark-one เปลี่ยนเฉพาะรายการที่กด; read-all เปลี่ยนเฉพาะบัญชีตนและคงอยู่หลัง reload; N2 ของกิติกรยังไม่อ่าน  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: [aria-label="การแจ้งเตือน"] — PASS
7. รอข้อความที่มองเห็น: N1 Selenium — PASS
8. คลิก: button[title="ทำเครื่องหมายว่าอ่านแล้ว"] — PASS
9. รอข้อความที่มองเห็น: ทำเครื่องหมายว่าอ่านแล้ว — PASS
10. คลิก: //button[normalize-space(.)='อ่านทั้งหมด'] — PASS
11. รอข้อความที่มองเห็น: ทำเครื่องหมายว่าอ่านแล้วทั้งหมด — PASS

### TC-046 — ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ

Browser: chrome 155.0.8059.82; ระยะเวลา 35.215 วินาที  
ผลที่คาดหวัง: ผล mock ทั้งสี่แสดงครบและสลับแท็บได้; นักศึกษาไม่เข้าถึง workspace อาจารย์; ไม่มี token/ID ไม่พบ/admin ต้องตรวจ API เพิ่ม  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/reviews/1 — PASS
7. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
8. คลิก: //button[normalize-space(.)='Pre-Review Analysis'] — PASS
9. รอข้อความที่มองเห็น: Deterministic pre-review — PASS
10. คลิก: //button[normalize-space(.)='Plagiarism Check'] — PASS
11. รอข้อความที่มองเห็น: Deterministic similarity — PASS
12. คลิก: //button[normalize-space(.)='Reviewer Matching'] — PASS
13. รอข้อความที่มองเห็น: Deterministic advisor — PASS
14. คลิก: //button[normalize-space(.)='Review Summary'] — PASS
15. รอข้อความที่มองเห็น: Deterministic review summary — PASS

### TC-047 — นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่

Browser: chrome 155.0.8059.82; ระยะเวลา 42.402 วินาที  
ผลที่คาดหวัง: งานเดียวกันเดินจากส่ง→รอตรวจ→อนุมัติ/เผยแพร่ครบด้วยการกดจริง; ผู้ส่งกลับเข้ามาเห็นผลและแจ้งเตือน; ใช้ ID เดียวตลอดและตรวจ DB เสริมก่อนรับรอง E2E ครบ  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
2. เปิดหน้า: /student/research/new — PASS
3. กรอกข้อมูล ส่งไฟล์ และกดยืนยันส่งผลงาน: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) — PASS
4. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
5. ล็อกอินผ่านฟอร์ม: udsanee@webmail.npru.ac.th — PASS
6. เปิดหน้า: /advisor/reviews — PASS
7. คลิกตรวจสอบผลงาน กรอกคะแนน และกดยืนยันการอนุมัติ — PASS
8. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
9. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
10. เปิดหน้า: /student/research — PASS
11. อ่านสถานะในผลงานของฉัน: เผยแพร่แล้ว — PASS

### TC-048 — ผู้ดูแลระบบเพิ่ม E2E Selenium Category และบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บพร้อมปฏิเสธ API จัดการของนักศึกษา

Browser: chrome 155.0.8059.82; ระยะเวลา 17.504 วินาที  
ผลที่คาดหวัง: admin เพิ่มข้อมูลผ่านเว็บและข้อมูลคงอยู่หลัง reload; นักศึกษาไม่สามารถทำรายการจัดการสำเร็จ; บันทึกการเข้าหน้า/admin แยกจากสิทธิ์ API ไม่คาดว่าต้องซ่อนหน้าเสมอ  
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: admin@uniresearch.ac.th — PASS
2. เปิดหน้า: /admin/categories และเพิ่มหมวดหมู่ E2E Selenium Category — PASS
3. เปิดหน้า: /admin/users และเพิ่มผู้ใช้ ชญานนท์ อารีย์ (674259002@webmail.npru.ac.th) — PASS
4. รอข้อความที่มองเห็น: 674259002@webmail.npru.ac.th — PASS
5. ล็อกอินผ่านฟอร์ม: 674259009@webmail.npru.ac.th — PASS
6. เปิดหน้า: /admin — PASS
7. ตรวจสอบการปฏิเสธ API ของนักศึกษา: Status 403 Forbidden ทั้งหมด — PASS

---

## 5. สรุปผลการประเมินและการรับรอง

ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
