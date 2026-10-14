# รายงานการรันทดสอบ UI — Narongsak

เวลารัน UTC: 2026-10-14T10:31:38.712029+00:00
โหมด: **headed**; Browser: chrome; commit: `7ff6c6750f0982ca4a34834daf5dee5ff223e976` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 18
- UI-automatable: 18
- รัน browser tests: 18
- PASS: 18; FAIL: 0; BLOCKED: 0
- API-only Test Cases: 0
- UI automation coverage ใน session นี้: 100.0%

Coverage หมายถึงจำนวนเคสที่รันขั้นตอน UI จริง ไม่ใช่การยืนยันว่าทุก invariant ตรวจได้ผ่าน UI อย่างเดียว ความสัมพันธ์ในฐานข้อมูล การเก็บ revision สิทธิ์ API และ counters มี assertions เสริมแยกจาก browser evidence ทั้งสี่ AI endpoints มี UI จึงไม่มี API-only case ใน 18 เคสนี้

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-001/20261014-102745-778362/004-final-result.png) |
| TC-004 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-004/20261014-102745-778362/004-final-result.png) |
| TC-007 | AUTH | Yes | PASS | [Screenshot 1](../screenshots/auth/TC-007/20261014-102745-778362/007-final-result.png) |
| TC-010 | CATEGORY | Yes | PASS | [Screenshot 1](../screenshots/category/TC-010/20261014-102745-778362/013-final-result.png) |
| TC-013 | USER | Yes | PASS | [Screenshot 1](../screenshots/user/TC-013/20261014-102745-778362/009-final-result.png) |
| TC-016 | RECOMMENDATION | Yes | PASS | [Screenshot 1](../screenshots/recommendation/TC-016/20261014-102745-778362/002-final-result.png) |
| TC-019 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-019/20261014-102745-778362/003-final-result.png) |
| TC-022 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-022/20261014-102745-778362/030-final-result.png) |
| TC-025 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-025/20261014-102745-778362/008-final-result.png) |
| TC-028 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-028/20261014-102745-778362/007-final-result.png) |
| TC-031 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-031/20261014-102745-778362/021-final-result.png) |
| TC-034 | SUBMISSION | Yes | PASS | [Screenshot 1](../screenshots/submission/TC-034/20261014-102745-778362/007-final-result.png) |
| TC-037 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-037/20261014-102745-778362/006-final-result.png) |
| TC-038 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-038/20261014-102745-778362/014-final-result.png) |
| TC-043 | NOTIFICATION | Yes | PASS | [Screenshot 1](../screenshots/notification/TC-043/20261014-102745-778362/012-final-result.png) |
| TC-046 | AI | Yes | PASS | [Screenshot 1](../screenshots/ai/TC-046/20261014-102745-778362/028-final-result.png) |
| TC-047 | E2E | Yes | PASS | [Screenshot 1](../screenshots/e2e/TC-047/20261014-102745-778362/043-final-result.png) |
| TC-048 | E2E | Yes | PASS | [Screenshot 1](../screenshots/e2e/TC-048/20261014-102745-778362/016-final-result.png) |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](ui-results.json)

### TC-001 — สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin

Browser: chrome 155.0.8059.41; ระยะเวลา 6.629 วินาที
ผลที่คาดหวัง: สมัครสำเร็จโดยได้สิทธิ์ student แม้ส่ง role admin
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /register — PASS
2. กรอกช่อง: first_name — PASS
3. กรอกช่อง: last_name — PASS
4. กรอกช่อง: email — PASS
5. กรอกช่อง: password — PASS
6. กรอกช่อง: confirmPassword — PASS
7. คลิก: //button[normalize-space(.)='สร้างบัญชี'] — PASS
8. รอข้อความที่มองเห็น: สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ — PASS

### TC-004 — รหัสผ่านผิด

Browser: chrome 155.0.8059.41; ระยะเวลา 3.798 วินาที
ผลที่คาดหวัง: แสดงข้อผิดพลาดและไม่สร้าง session
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /login — PASS
2. กรอกช่อง: email — PASS
3. กรอกช่อง: password — PASS
4. คลิก: //button[normalize-space(.)='เข้าสู่ระบบ'] — PASS
5. อ่านข้อความปฏิเสธ: toast-error — PASS

### TC-007 — ล็อกอินแล้วออกจากระบบ

Browser: chrome 155.0.8059.41; ระยะเวลา 8.861 วินาที
ผลที่คาดหวัง: ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /account/saved — PASS
7. คลิก: //button[normalize-space(.)='ออกจากระบบ'] — PASS
8. เปิดหน้า: /account/saved — PASS

### TC-010 — อ่านสาธารณะและเพิ่มโดย admin

Browser: chrome 155.0.8059.41; ระยะเวลา 14.768 วินาที
ผลที่คาดหวัง: อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research — PASS
2. รอข้อความที่มองเห็น: C1 Selenium — PASS
3. รอข้อความที่มองเห็น: C2 Selenium — PASS
4. ล็อกอินผ่านฟอร์ม: A1 — PASS
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

### TC-013 — student เปลี่ยนตัวเลือก

Browser: chrome 155.0.8059.41; ระยะเวลา 8.767 วินาที
ผลที่คาดหวัง: student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /admin/options — PASS
7. คลิก: button[aria-label="เพิ่มภาควิชา"] — PASS
8. รอข้อความที่มองเห็น: Denied Selenium Department — PASS
9. คลิก: //button[normalize-space(.)='บันทึกการตั้งค่าทั้งหมด'] — PASS
10. อ่านข้อความปฏิเสธ: toast-error — PASS

### TC-016 — คำแนะนำไม่เผยงาน pending

Browser: chrome 155.0.8059.41; ระยะเวลา 3.056 วินาที
ผลที่คาดหวัง: คำแนะนำไม่เผยข้อมูล pending
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research — PASS

### TC-019 — ID ไม่มีอยู่

Browser: chrome 155.0.8059.41; ระยะเวลา 2.386 วินาที
ผลที่คาดหวัง: แสดงไม่พบงานวิจัยและ API ตอบ 404
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research/999999999 — PASS
2. รอข้อความที่มองเห็น: รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ — PASS

### TC-022 — ส่งงานครบข้อมูลและผู้เกี่ยวข้อง

Browser: chrome 155.0.8059.41; ระยะเวลา 18.821 วินาที
ผลที่คาดหวัง: บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: งานวิจัยทดสอบ Selenium — PASS
7. เปิดหน้า: /student/research/new — PASS
8. กรอกช่อง: academic_year — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
12. เลือกผู้เกี่ยวข้อง: participant — PASS
13. เลือกผู้เกี่ยวข้อง: participant — PASS
14. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
15. กรอกช่อง: abstract — PASS
16. กรอกช่อง: keyword_input_temp — PASS
17. คลิก: //button[normalize-space(.)='เพิ่ม'] — PASS
18. กรอกช่อง: keyword_input_temp — PASS
19. คลิก: //button[normalize-space(.)='เพิ่ม'] — PASS
20. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
21. อัปโหลดไฟล์: cover_image — PASS
22. อัปโหลดไฟล์: document — PASS
23. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
24. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
25. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
26. เปิดหน้า: /student/research — PASS
27. รอข้อความที่มองเห็น: งานวิจัยทดสอบ Selenium — PASS
28. อ่านสถานะในผลงานของฉัน: งานวิจัยทดสอบ Selenium — PASS
29. เปิดหน้า: /research/6 — PASS
30. ตรวจสถานะบนหน้าจอ: รอตรวจสอบ — PASS
31. รอข้อความที่มองเห็น: S1 Selenium — PASS
32. รอข้อความที่มองเห็น: D1 Selenium — PASS
33. รอข้อความที่มองเห็น: วิทยาการคอมพิวเตอร์ — PASS
34. รอข้อความที่มองเห็น: วิทยานิพนธ์ — PASS
35. รอข้อความที่มองเห็น: 2569 — PASS
36. รอข้อความที่มองเห็น: selenium — PASS
37. รอข้อความที่มองเห็น: research — PASS

### TC-025 — ผู้เขียนคนละ prefix ปี

Browser: chrome 155.0.8059.41; ระยะเวลา 6.26 วินาที
ผลที่คาดหวัง: UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /student/research/new — PASS
7. กรอกช่อง: title_th — PASS
8. กรอกช่อง: title_en — PASS
9. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
10. เลือกผู้เกี่ยวข้อง: participant — PASS

### TC-028 — ผู้ส่ง/author เห็นงานใน /my

Browser: chrome 155.0.8059.41; ระยะเวลา 6.121 วินาที
ผลที่คาดหวัง: เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /student/research — PASS
7. รอข้อความที่มองเห็น: W1 งานวิจัย Selenium — PASS
8. รอข้อความที่มองเห็น: W4 งานวิจัย Selenium — PASS

### TC-031 — ส่งเอกสารใหม่หลัง needs_revision

Browser: chrome 155.0.8059.41; ระยะเวลา 18.788 วินาที
ผลที่คาดหวัง: ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /research/2 — PASS
7. ตรวจสถานะบนหน้าจอ: ส่งกลับแก้ไข — PASS
8. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: Revised research — PASS
9. เปิดหน้า: /student/research/edit/2 — PASS
10. กรอกช่อง: title_th — PASS
11. กรอกช่อง: title_en — PASS
12. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
13. เลือกผู้เกี่ยวข้อง: participant — PASS
14. เลือกผู้เกี่ยวข้อง: participant — PASS
15. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
16. กรอกช่อง: abstract — PASS
17. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
18. อัปโหลดไฟล์: cover_image — PASS
19. อัปโหลดไฟล์: document — PASS
20. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
21. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
22. รอข้อความที่มองเห็น: แก้ไขผลงานเรียบร้อยแล้ว — PASS
23. เปิดหน้า: /student/research — PASS
24. รอข้อความที่มองเห็น: Revised research — PASS
25. อ่านสถานะในผลงานของฉัน: Revised research — PASS

### TC-034 — ผู้ใช้ active ดาวน์โหลดงานมีไฟล์

Browser: chrome 155.0.8059.41; ระยะเวลา 7.333 วินาที
ผลที่คาดหวัง: ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /research/1 — PASS
7. คลิก: //button[normalize-space(.)='Download PDF'] — PASS
8. รอข้อความที่มองเห็น: The document download has started. — PASS

### TC-037 — ผู้ตรวจเห็นประวัติของตน

Browser: chrome 155.0.8059.41; ระยะเวลา 8.139 วินาที
ผลที่คาดหวัง: ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: D1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/history — PASS
7. รอข้อความที่มองเห็น: W1 งานวิจัย Selenium — PASS

### TC-038 — advisor ที่ได้รับมอบหมายอนุมัติ pending

Browser: chrome 155.0.8059.41; ระยะเวลา 10.265 วินาที
ผลที่คาดหวัง: ที่ปรึกษาที่ได้รับมอบหมายอนุมัติและบันทึกผลสำเร็จ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: D1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/reviews — PASS
7. คลิก: a[href="/advisor/reviews/2"] — PASS
8. รอข้อความที่มองเห็น: W2 งานวิจัย Selenium — PASS
9. เลือกตัวเลือก: [name="status_result"]=approved — PASS
10. กรอกช่อง: score — PASS
11. กรอกช่อง: comment_text — PASS
12. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
13. รอข้อความที่มองเห็น: ยืนยันการอนุมัติผลงาน — PASS
14. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
15. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
16. เปิดหน้า: /research/2 — PASS
17. ตรวจสถานะบนหน้าจอ: อนุมัติแล้ว — PASS

### TC-043 — อ่านเฉพาะของตนและ mark read

Browser: chrome 155.0.8059.41; ระยะเวลา 11.063 วินาที
ผลที่คาดหวัง: เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. คลิก: [aria-label="การแจ้งเตือน"] — PASS
7. รอข้อความที่มองเห็น: N1 Selenium — PASS
8. คลิก: [aria-label="การแจ้งเตือน"] — PASS
9. คลิก: button[title="ทำเครื่องหมายว่าอ่านแล้ว"] — PASS
10. รอข้อความที่มองเห็น: ทำเครื่องหมายว่าอ่านแล้ว — PASS
11. คลิก: [aria-label="การแจ้งเตือน"] — PASS
12. คลิก: //button[normalize-space(.)='อ่านทั้งหมด'] — PASS
13. รอข้อความที่มองเห็น: ทำเครื่องหมายว่าอ่านแล้วทั้งหมด — PASS

### TC-046 — สี่ endpoint วิเคราะห์ผลงานและสิทธิ์

Browser: chrome 155.0.8059.41; ระยะเวลา 35.215 วินาที
ผลที่คาดหวัง: ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: D1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. เปิดหน้า: /advisor/reviews/1 — PASS
7. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
8. คลิก: //button[normalize-space(.)='Pre-Review Analysis'] — PASS
9. รอข้อความที่มองเห็น: Deterministic pre-review — PASS
10. เปิดหน้า: /advisor/reviews/1 — PASS
11. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
12. คลิก: //button[normalize-space(.)='Plagiarism Check'] — PASS
13. รอข้อความที่มองเห็น: Deterministic similarity — PASS
14. เปิดหน้า: /advisor/reviews/1 — PASS
15. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
16. คลิก: //button[normalize-space(.)='Reviewer Matching'] — PASS
17. รอข้อความที่มองเห็น: Deterministic advisor — PASS
18. เปิดหน้า: /advisor/reviews/1 — PASS
19. รอข้อความที่มองเห็น: AI Peer Review Assistant — PASS
20. คลิก: //button[normalize-space(.)='Review Summary'] — PASS
21. รอข้อความที่มองเห็น: Deterministic review summary — PASS
22. ล็อกอินผ่านฟอร์ม: S1 — PASS
23. เปิดหน้า: /login — PASS
24. กรอกช่อง: email — PASS
25. กรอกช่อง: password — PASS
26. คลิก: form button[type="submit"] — PASS
27. เปิดหน้า: /advisor/reviews/1 — PASS

### TC-047 — เว็บส่งงานแล้ว advisor ตรวจ

Browser: chrome 155.0.8059.41; ระยะเวลา 42.402 วินาที
ผลที่คาดหวัง: ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: S1 — PASS
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS
5. คลิก: form button[type="submit"] — PASS
6. ส่งฟอร์มพร้อมผู้เขียน ที่ปรึกษาและไฟล์: Cross-role Selenium Research — PASS
7. เปิดหน้า: /student/research/new — PASS
8. กรอกช่อง: academic_year — PASS
9. กรอกช่อง: title_th — PASS
10. กรอกช่อง: title_en — PASS
11. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
12. เลือกผู้เกี่ยวข้อง: participant — PASS
13. เลือกผู้เกี่ยวข้อง: participant — PASS
14. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
15. กรอกช่อง: abstract — PASS
16. กรอกช่อง: keyword_input_temp — PASS
17. คลิก: //button[normalize-space(.)='เพิ่ม'] — PASS
18. กรอกช่อง: keyword_input_temp — PASS
19. คลิก: //button[normalize-space(.)='เพิ่ม'] — PASS
20. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
21. อัปโหลดไฟล์: cover_image — PASS
22. อัปโหลดไฟล์: document — PASS
23. คลิก: //button[normalize-space(.)='ดำเนินการต่อ'] — PASS
24. คลิก: //button[normalize-space(.)='ยืนยันและส่งผลงาน'] — PASS
25. รอข้อความที่มองเห็น: ส่งผลงานเรียบร้อยแล้ว — PASS
26. เปิดหน้า: /student/research — PASS
27. รอข้อความที่มองเห็น: Cross-role Selenium Research — PASS
28. ล็อกอินผ่านฟอร์ม: D1 — PASS
29. เปิดหน้า: /login — PASS
30. กรอกช่อง: email — PASS
31. กรอกช่อง: password — PASS
32. คลิก: form button[type="submit"] — PASS
33. เปิดหน้า: /advisor/reviews — PASS
34. รอข้อความที่มองเห็น: Cross-role Selenium Research — PASS
35. เปิดหน้า: /advisor/reviews — PASS
36. คลิก: a[href="/advisor/reviews/6"] — PASS
37. รอข้อความที่มองเห็น: Cross-role Selenium Research — PASS
38. เลือกตัวเลือก: [name="status_result"]=approved — PASS
39. กรอกช่อง: score — PASS
40. กรอกช่อง: comment_text — PASS
41. คลิก: //button[normalize-space(.)='ยืนยันผลการประเมิน'] — PASS
42. รอข้อความที่มองเห็น: ยืนยันการอนุมัติผลงาน — PASS
43. คลิก: //button[normalize-space(.)='ยืนยัน'] — PASS
44. รอข้อความที่มองเห็น: บันทึกผลการประเมินผลงานสำเร็จ — PASS
45. เปิดหน้า: /research/6 — PASS
46. ตรวจสถานะบนหน้าจอ: อนุมัติแล้ว — PASS
47. ล็อกอินผ่านฟอร์ม: S1 — PASS
48. เปิดหน้า: /login — PASS
49. กรอกช่อง: email — PASS
50. กรอกช่อง: password — PASS
51. คลิก: form button[type="submit"] — PASS
52. เปิดหน้า: /student/research — PASS
53. รอข้อความที่มองเห็น: Cross-role Selenium Research — PASS
54. เปิดหน้า: /student/research — PASS
55. รอข้อความที่มองเห็น: Cross-role Selenium Research — PASS
56. อ่านสถานะในผลงานของฉัน: Cross-role Selenium Research — PASS

### TC-048 — เว็บ admin จัดการหมวดหมู่/ผู้ใช้

Browser: chrome 155.0.8059.41; ระยะเวลา 17.504 วินาที
ผลที่คาดหวัง: admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. ล็อกอินผ่านฟอร์ม: A1 — PASS
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
12. เปิดหน้า: /admin/users — PASS
13. คลิก: //button[normalize-space(.)='เพิ่มผู้ใช้ใหม่'] — PASS
14. กรอกช่อง: email — PASS
15. กรอกช่อง: password — PASS
16. กรอกช่อง: first_name — PASS
17. กรอกช่อง: last_name — PASS
18. คลิก: form button[type="submit"] — PASS
19. รอข้อความที่มองเห็น: u3@example.org — PASS
20. ล็อกอินผ่านฟอร์ม: S1 — PASS
21. เปิดหน้า: /login — PASS
22. กรอกช่อง: email — PASS
23. กรอกช่อง: password — PASS
24. คลิก: form button[type="submit"] — PASS
25. เปิดหน้า: /admin — PASS

ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
