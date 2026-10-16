# รายงานการรันทดสอบ UI — Narongsak

เวลารัน UTC: 2026-10-16T07:56:20.923421+00:00
โหมด: **headed**; Browser: chrome; commit: `f435e68deb29a5c6531012e877c7b8f7e9be9209` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 18
- UI-automatable: 18
- รัน browser tests: 1
- PASS: 1; FAIL: 0; BLOCKED: 0
- API-only Test Cases: 0
- UI automation coverage ใน session นี้: 5.56%

Coverage หมายถึงจำนวนเคสที่รันขั้นตอน UI จริง ไม่ใช่การยืนยันว่าทุก invariant ตรวจได้ผ่าน UI อย่างเดียว ความสัมพันธ์ในฐานข้อมูล การเก็บ revision สิทธิ์ API และ counters มี assertions เสริมแยกจาก browser evidence ทั้งสี่ AI endpoints มี UI จึงไม่มี API-only case ใน 18 เคสนี้

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-004 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-007 | AUTH | No | NOT RUN | ยังไม่มี browser evidence |
| TC-010 | CATEGORY | No | NOT RUN | ยังไม่มี browser evidence |
| TC-013 | USER | No | NOT RUN | ยังไม่มี browser evidence |
| TC-016 | RECOMMENDATION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-019 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-022 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-025 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-028 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-031 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-034 | SUBMISSION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-037 | REVIEW | No | NOT RUN | ยังไม่มี browser evidence |
| TC-038 | REVIEW | Yes | PASS | [Screenshot 1](../screenshots/review/TC-038/20261016-075548-637387/014-final-result.png) |
| TC-043 | NOTIFICATION | No | NOT RUN | ยังไม่มี browser evidence |
| TC-046 | AI | No | NOT RUN | ยังไม่มี browser evidence |
| TC-047 | E2E | No | NOT RUN | ยังไม่มี browser evidence |
| TC-048 | E2E | No | NOT RUN | ยังไม่มี browser evidence |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](ui-results.json)

### TC-001 — สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: สมัครสำเร็จโดยได้สิทธิ์ student แม้ส่ง role admin
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-004 — รหัสผ่านผิด

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: แสดงข้อผิดพลาดและไม่สร้าง session
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-007 — ล็อกอินแล้วออกจากระบบ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-010 — อ่านสาธารณะและเพิ่มโดย admin

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-013 — student เปลี่ยนตัวเลือก

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-016 — คำแนะนำไม่เผยงาน pending

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: คำแนะนำไม่เผยข้อมูล pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-019 — ID ไม่มีอยู่

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: แสดงไม่พบงานวิจัยและ API ตอบ 404
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-022 — ส่งงานครบข้อมูลและผู้เกี่ยวข้อง

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-025 — ผู้เขียนคนละ prefix ปี

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-028 — ผู้ส่ง/author เห็นงานใน /my

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-031 — ส่งเอกสารใหม่หลัง needs_revision

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-034 — ผู้ใช้ active ดาวน์โหลดงานมีไฟล์

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-037 — ผู้ตรวจเห็นประวัติของตน

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-038 — advisor ที่ได้รับมอบหมายอนุมัติ pending

Browser: chrome 155.0.8059.82; ระยะเวลา 32.102 วินาที
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

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-046 — สี่ endpoint วิเคราะห์ผลงานและสิทธิ์

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-047 — เว็บส่งงานแล้ว advisor ตรวจ

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ
ผลจริง: ไม่ได้รัน (NOT RUN)


### TC-048 — เว็บ admin จัดการหมวดหมู่/ผู้ใช้

Browser: chrome ยังไม่เริ่ม browser; ระยะเวลา 0 วินาที
ผลที่คาดหวัง: admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ
ผลจริง: ไม่ได้รัน (NOT RUN)


ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
