# รายงานผลการทดสอบ

| รายการควบคุมเอกสาร | ค่า |
|---|---|
| รหัสเอกสาร | UR-TR-001 |
| รุ่น/สถานะ | 0.2 ฉบับร่างก่อน Execute |
| วันที่จัดทำ | 4 ตุลาคม 2026 |
| รอบทดสอบ/ช่วงเวลา | TBD |
| commit, environment, ผู้ทดสอบ | TBD |

## 1. หลักการบันทึกผล

เอกสารนี้เป็นรายงานตั้งต้นจากการวิเคราะห์ Source Code ยังไม่ได้ execute TC-001–TC-048 ผลทุกกรณีเป็น Not Tested คำว่า Passed/Failed ใช้ได้ต่อเมื่อมีหลักฐานจากการรันจริง ผลของชุดทดสอบเดิมใน Repository ไม่ใช่ผลของ TC ชุดนี้

## 2. สรุปผลรวม

| ตัวชี้วัด | จำนวน | ร้อยละของ TC ทั้งหมด |
|---|---:|---:|
| กรณีทดสอบตามแผน | 48 | 100% |
| ดำเนินการแล้ว | 0 | 0% |
| Passed | 0 | 0% |
| Failed | 0 | 0% |
| Blocked/Skipped | 0 | 0% |
| Not Tested | 48 | 100% |

Coverage เชิงแผน: 32/32 FR มี TC เชื่อมโยง; execution coverage: 0/48 TC; เกณฑ์สิ้นสุดยังประเมินไม่ได้

### 2.1 จำแนกตามโมดูล

| โมดูล | TC ตามแผน | ดำเนินการ | Passed | Failed | Blocked | Not Tested |
|---|---:|---:|---:|---:|---:|---:|
| AI | 2 | 0 | 0 | 0 | 0 | 2 |
| AI ตรวจงาน | 1 | 0 | 0 | 0 | 0 | 1 |
| E2E | 2 | 0 | 0 | 0 | 0 | 2 |
| Favorite | 1 | 0 | 0 | 0 | 0 | 1 |
| Revision | 1 | 0 | 0 | 0 | 0 | 1 |
| Validation | 2 | 0 | 0 | 0 | 0 | 2 |
| คำแนะนำ | 1 | 0 | 0 | 0 | 0 | 1 |
| คิวตรวจ | 1 | 0 | 0 | 0 | 0 | 1 |
| ค้นหา | 3 | 0 | 0 | 0 | 0 | 3 |
| ดาวน์โหลด | 2 | 0 | 0 | 0 | 0 | 2 |
| ตรวจงาน | 3 | 0 | 0 | 0 | 0 | 3 |
| ตัวเลือก | 2 | 0 | 0 | 0 | 0 | 2 |
| บัญชี | 6 | 0 | 0 | 0 | 0 | 6 |
| ประวัติตรวจ | 1 | 0 | 0 | 0 | 0 | 1 |
| ผลงานของฉัน | 1 | 0 | 0 | 0 | 0 | 1 |
| ผู้เกี่ยวข้อง | 1 | 0 | 0 | 0 | 0 | 1 |
| ผู้ใช้ | 2 | 0 | 0 | 0 | 0 | 2 |
| มอบหมาย | 1 | 0 | 0 | 0 | 0 | 1 |
| รายละเอียด | 2 | 0 | 0 | 0 | 0 | 2 |
| ลบผลงาน | 2 | 0 | 0 | 0 | 0 | 2 |
| ส่งผลงาน | 2 | 0 | 0 | 0 | 0 | 2 |
| หน้าหลัก | 1 | 0 | 0 | 0 | 0 | 1 |
| หมวดหมู่ | 2 | 0 | 0 | 0 | 0 | 2 |
| เว็บบัญชี | 1 | 0 | 0 | 0 | 0 | 1 |
| แก้ผลงาน | 2 | 0 | 0 | 0 | 0 | 2 |
| แจ้งเตือน | 1 | 0 | 0 | 0 | 0 | 1 |
| ไฟล์ | 2 | 0 | 0 | 0 | 0 | 2 |


### 2.2 จำแนกตาม Priority

| Priority | TC ตามแผน | ดำเนินการ | Not Tested |
|---|---:|---:|---:|
| กลาง | 17 | 0 | 17 |
| สูง | 31 | 0 | 31 |

## 3. บันทึกผลรายกรณี

กรอกผลจริง วันเวลา ผู้ทดสอบ หลักฐาน และ defect หลัง Execute เท่านั้น หลักฐานอาจเป็น HTTP request/response ที่ปกปิด token, query ก่อนและหลัง, screenshot หรือ log ที่ตรวจซ้ำได้

| TC | FR | ชื่อกรณี | สถานะ | ผลจริง/หลักฐาน | Defect | ผู้ทดสอบ/วันที่ |
|---|---|---|---|---|---|---|
| TC-001 | FR-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | Not Tested | TBD | TBD | TBD |
| TC-002 | FR-001 | สมัคร email ซ้ำ | Not Tested | TBD | TBD | TBD |
| TC-003 | FR-002 | ล็อกอินข้อมูลถูก | Not Tested | TBD | TBD | TBD |
| TC-004 | FR-002 | รหัสผ่านผิด | Not Tested | TBD | TBD | TBD |
| TC-005 | FR-003 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | Not Tested | TBD | TBD | TBD |
| TC-006 | FR-003 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | Not Tested | TBD | TBD | TBD |
| TC-007 | FR-004 | ล็อกอินแล้วออกจากระบบ | Not Tested | TBD | TBD | TBD |
| TC-008 | FR-005 | admin CRUD ผู้ใช้ | Not Tested | TBD | TBD | TBD |
| TC-009 | FR-005 | student เรียก API จัดการผู้ใช้ | Not Tested | TBD | TBD | TBD |
| TC-010 | FR-006 | อ่านสาธารณะและเพิ่มโดย admin | Not Tested | TBD | TBD | TBD |
| TC-011 | FR-006 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | Not Tested | TBD | TBD | TBD |
| TC-012 | FR-007 | admin แทนรายการตัวเลือก | Not Tested | TBD | TBD | TBD |
| TC-013 | FR-007 | student เปลี่ยนตัวเลือก | Not Tested | TBD | TBD | TBD |
| TC-014 | FR-008 | guest/student/admin ค้นงาน approved และ pending | Not Tested | TBD | TBD | TBD |
| TC-015 | FR-008 | คำค้นมีหลายคำและบันทึก log | Not Tested | TBD | TBD | TBD |
| TC-016 | FR-009 | คำแนะนำไม่เผยงาน pending | Not Tested | TBD | TBD | TBD |
| TC-017 | FR-010 | latest/popular และสถิติ | Not Tested | TBD | TBD | TBD |
| TC-018 | FR-011 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | Not Tested | TBD | TBD | TBD |
| TC-019 | FR-011 | ID ไม่มีอยู่ | Not Tested | TBD | TBD | TBD |
| TC-020 | FR-012 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | Not Tested | TBD | TBD | TBD |
| TC-021 | FR-013 | รายชื่อผู้เขียน/ที่ปรึกษา | Not Tested | TBD | TBD | TBD |
| TC-022 | FR-014 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | Not Tested | TBD | TBD | TBD |
| TC-023 | FR-014 | ไม่ล็อกอินหรือ role guest ส่งงาน | Not Tested | TBD | TBD | TBD |
| TC-024 | FR-015 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | Not Tested | TBD | TBD | TBD |
| TC-025 | FR-015 | ผู้เขียนคนละ prefix ปี | Not Tested | TBD | TBD | TBD |
| TC-026 | FR-016 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | Not Tested | TBD | TBD | TBD |
| TC-027 | FR-016 | นามสกุล/MIME/ลายเซ็นผิด | Not Tested | TBD | TBD | TBD |
| TC-028 | FR-017 | ผู้ส่ง/author เห็นงานใน `/my` | Not Tested | TBD | TBD | TBD |
| TC-029 | FR-018 | ผู้มีสิทธิ์แก้แล้วกลับ pending | Not Tested | TBD | TBD | TBD |
| TC-030 | FR-018 | คนอื่นแก้งาน | Not Tested | TBD | TBD | TBD |
| TC-031 | FR-019 | ส่งเอกสารใหม่หลัง `needs_revision` | Not Tested | TBD | TBD | TBD |
| TC-032 | FR-020 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | Not Tested | TBD | TBD | TBD |
| TC-033 | FR-020 | คนอื่นลบงาน | Not Tested | TBD | TBD | TBD |
| TC-034 | FR-021 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | Not Tested | TBD | TBD | TBD |
| TC-035 | FR-021 | ไม่มี token หรือไม่มีไฟล์ | Not Tested | TBD | TBD | TBD |
| TC-036 | FR-022 | admin/advisor/student ดู pending | Not Tested | TBD | TBD | TBD |
| TC-037 | FR-023 | ผู้ตรวจเห็นประวัติของตน | Not Tested | TBD | TBD | TBD |
| TC-038 | FR-024 | advisor ที่ได้รับมอบหมายอนุมัติ pending | Not Tested | TBD | TBD | TBD |
| TC-039 | FR-024 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | Not Tested | TBD | TBD | TBD |
| TC-040 | FR-025 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | Not Tested | TBD | TBD | TBD |
| TC-041 | FR-026 | admin เปลี่ยน advisor; student ถูกห้าม | Not Tested | TBD | TBD | TBD |
| TC-042 | FR-027 | บันทึกและยกเลิก favorite | Not Tested | TBD | TBD | TBD |
| TC-043 | FR-028 | อ่านเฉพาะของตนและ mark read | Not Tested | TBD | TBD | TBD |
| TC-044 | FR-029 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | Not Tested | TBD | TBD | TBD |
| TC-045 | FR-030 | dashboard insight และ chat | Not Tested | TBD | TBD | TBD |
| TC-046 | FR-031 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | Not Tested | TBD | TBD | TBD |
| TC-047 | FR-032 | เว็บส่งงานแล้ว advisor ตรวจ | Not Tested | TBD | TBD | TBD |
| TC-048 | FR-032 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | Not Tested | TBD | TBD | TBD |

## 4. บันทึกข้อบกพร่อง

ยังไม่มีข้อบกพร่องจากการ execute TC ชุดนี้ ข้อสังเกตจากการอ่านโค้ดอยู่ใน TEST-PLAN.md และยังไม่ถือเป็นผล Failed

| รหัส defect | TC | อาการจริงและวิธีทำซ้ำ | ความรุนแรง | สถานะ | commit ที่แก้/ผล retest | เจ้าของ |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

เกณฑ์จัดความรุนแรงที่เสนอ: Critical = ใช้งานหลักไม่ได้หรือข้อมูลรั่วอย่างมีนัยสำคัญ; High = ขั้นตอนหลัก/สิทธิ์ผิด; Medium = ฟังก์ชันรองผิดแต่มีทางดำเนินงาน; Low = การแสดงผลหรือข้อความคลาดเคลื่อน การจัดระดับจริงให้ผู้รับผิดชอบยืนยัน

## 5. การวิเคราะห์ผลและข้อจำกัด

ผลสังเกตจากการรัน: TBD; สาเหตุกรณีไม่ผ่าน: TBD; แนวโน้ม defect: TBD; ข้อจำกัด environment: TBD

ข้อสังเกตจาก Source Code ที่ต้องตรวจ: backend ไม่ให้ role reviewer ตรวจงานแม้ frontend มีเงื่อนไข role นี้; /admin ตรวจเพียง session; GET รายละเอียดงานและ static file เปิดสาธารณะ; การยกเลิก favorite คืน HTTP 200 ผ่าน HTTPException ดูบริบทใน SYSTEM-OVERVIEW.md และ TEST-PLAN.md

## 6. ประเมินเกณฑ์สิ้นสุด

| เกณฑ์จากแผน | ผลประเมิน | หลักฐาน/เหตุผล |
|---|---|---|
| TC Priority สูงทุกกรณีมีผลและหลักฐาน | ยังประเมินไม่ได้ | ทุกกรณี Not Tested |
| ทุก FR มีผลอย่างน้อยหนึ่ง TC | ยังประเมินไม่ได้ | มีเพียง coverage เชิงแผน |
| Defect สำคัญได้รับการแก้หรือรับความเสี่ยง | ยังประเมินไม่ได้ | ยังไม่มีผล execute และผู้อนุมัติ |
| รายงานผลจริงพร้อม | ยังไม่ผ่านขั้นตอน | ข้อมูลรอบทดสอบเป็น TBD |

## 7. ข้อสรุปและการรับรอง

ผลตัดสินการทดสอบ: ยังไม่ตัดสิน; ข้อเสนอแนะ: Execute TC ตาม TEST-CASES.md บนฐานทดสอบแยก แล้วกรอกข้อมูลส่วน 2–6 ก่อนพิจารณารับระบบ

| บทบาท | ชื่อ | วันที่ | การรับรอง |
|---|---|---|---|
| ผู้ทดสอบ | TBD | TBD | รอ |
| ผู้ประสานการทดสอบ | TBD | TBD | รอ |
| ผู้พัฒนา/ผู้แก้ defect | TBD | TBD | รอ |
| ผู้อนุมัติ | TBD | TBD | รอ |

## 8. ชุดทดสอบอัตโนมัติที่มีอยู่

Repository มี backend/tests, frontend/tests และ frontend/e2e; CI บน develop รัน pytest, frontend typecheck/lint/Node test/build แต่ไม่ได้รัน Playwright ตาม .github/workflows/develop-ci.yml ผลรันล่าสุดของชุดเหล่านี้ ณ วันที่จัดทำ: ไม่สามารถยืนยันได้
