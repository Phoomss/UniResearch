# รายงานการรันทดสอบ UI — Narongsak

เวลารัน UTC: 2026-10-16T12:41:10.498766+00:00
โหมด: **headless**; Browser: chrome; commit: `16490e54bd66bb12e0affb3ea16ac1a9bc1b3f57` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 18
- UI-automatable: 18
- รัน browser tests: 4
- PASS: 4; FAIL: 0; BLOCKED: 0
- API-only Test Cases: 0
- UI automation coverage ใน session นี้: 22.22%

Coverage หมายถึงจำนวนเคสที่รันขั้นตอน UI จริง ไม่ใช่การยืนยันว่าทุก invariant ตรวจได้ผ่าน UI อย่างเดียว ความสัมพันธ์ในฐานข้อมูล การเก็บ revision สิทธิ์ API และ counters มี assertions เสริมแยกจาก browser evidence ทั้งสี่ AI endpoints มี UI จึงไม่มี API-only case ใน 18 เคสนี้

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-001/20261016-123952-122263/009-final-result.png) |
| TC-004 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-007 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-010 | CATEGORY | No | NOT RUN | ยังไม่มี browser evidence |
| TC-013 | USER | No | NOT RUN | ยังไม่มี browser evidence |
| TC-016 | RECOMMENDATION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-019 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-022 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-022/20261016-123952-122263/034-final-result.png) |
| TC-025 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-028 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-031 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-034 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-037 | REVIEW | No | NOT RUN | ยังไม่มี browser evidence |
| TC-038 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-038/20261016-123952-122263/014-final-result.png) |
| TC-043 | NOTIFICATION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-046 | AI | No | NOT RUN | ยังไม่มี browser evidence |
| TC-047 | E2E | Yes | PASS | [Screenshot 1](../screenshots/e2e/TC-047/20261016-123952-122263/045-final-result.png) |
| TC-048 | E2E | No | NOT RUN | ยังไม่มี browser evidence |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](ui-results.json)

### TC-001 — สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ

Browser: chrome 155.0.8059.82; ระยะเวลา 15.263 วินาที
ผลที่คาดหวัง: สมัครสำเร็จโดยได้สิทธิ์ student แม้ส่ง role admin
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

### TC-004 — ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: แสดงข้อผิดพลาดและไม่สร้าง session
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-007 — ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-010 — ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-013 — นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-016 — คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: คำแนะนำไม่เผยข้อมูล pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-019 — แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: แสดงไม่พบงานวิจัยและ API ตอบ 404
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-022 — นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน

Browser: chrome 155.0.8059.82; ระยะเวลา 16.91 วินาที
ผลที่คาดหวัง: บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending
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

### TC-025 — ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-028 — รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-031 — ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-034 — นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-037 — ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-038 — ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review

Browser: chrome 155.0.8059.82; ระยะเวลา 9.64 วินาที
ผลที่คาดหวัง: ที่ปรึกษาที่ได้รับมอบหมายอนุมัติและบันทึกผลสำเร็จ
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

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-046 — ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-047 — นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่

Browser: chrome 155.0.8059.82; ระยะเวลา 35.911 วินาที
ผลที่คาดหวัง: ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ
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

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ
ผลจริง: ไม่ได้รัน (NOT RUN)


ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
