# รายงานผลการทดสอบ UniResearch

เนื้อหาส่วนที่ 2 ของ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md) สถานะทุก TC ยังเป็น Not Tested

## 2.1 ข้อมูลรอบการทดสอบ

| รายการ | รายละเอียด |
|---|---|
| รอบการทดสอบ (Test Cycle) | ☐ รอบที่ 1  ☐ รอบที่ 2 Regression  ☐ อื่น ๆ: TBD |
| ช่วงเวลาทดสอบ | TBD |
| เวอร์ชัน/Commit ที่ทดสอบ | TBD |
| สภาพแวดล้อม/Browser | TBD |
| ผู้ทดสอบ | TBD |
| สถานะรายงาน | ยังไม่มีการ Execute TC ตามเอกสารนี้ |

## 2.2 สรุปผลการทดสอบโดยรวม (Executive Summary)

ยังไม่มีผลทดสอบจริงของ TC-001–TC-048 รายงานนี้จึงเป็นแบบตั้งต้นสำหรับรอบที่จะทดสอบ ค่า Passed/Failed เป็น 0 เพราะยังไม่ได้ Execute ไม่ได้หมายถึงระบบผ่านการทดสอบ ข้อสังเกตจาก Source Code ในข้อ 1.8 ยังไม่ถือเป็น defect ที่ยืนยันแล้ว

| รายการ | จำนวน | ร้อยละของ TC ทั้งหมด |
|---|---:|---:|
| กรณีทดสอบทั้งหมดตามแผน | 48 | 100% |
| Positive ตามแผน | 32 | 66.7% |
| Negative ตามแผน | 16 | 33.3% |
| ดำเนินการแล้ว (Executed) | 0 | 0% |
| ผ่าน (Passed) | 0 | 0% |
| ไม่ผ่าน (Failed) | 0 | 0% |
| ข้าม/Blocked | 0 | 0% |
| ยังไม่ทดสอบ (Not Tested) | 48 | 100% |

### 2.2.1 ผลการทดสอบจำแนกตามกลุ่มฟังก์ชัน

| กลุ่มฟังก์ชัน | จำนวน TC | ทดสอบแล้ว | ผ่าน | ไม่ผ่าน | ข้าม/Blocked | Not Tested |
|---|---:|---:|---:|---:|---:|---:|
| บัญชีและโปรไฟล์ | 7 | 0 | 0 | 0 | 0 | 7 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | 6 | 0 | 0 | 0 | 0 | 6 |
| ค้นหา รายละเอียด และคำแนะนำ | 7 | 0 | 0 | 0 | 0 | 7 |
| ส่งผลงานและตรวจข้อมูล | 7 | 0 | 0 | 0 | 0 | 7 |
| ผลงานของฉัน การแก้ไข และไฟล์ | 8 | 0 | 0 | 0 | 0 | 8 |
| คิวและผลการตรวจ | 6 | 0 | 0 | 0 | 0 | 6 |
| Favorite และการแจ้งเตือน | 2 | 0 | 0 | 0 | 0 | 2 |
| AI | 3 | 0 | 0 | 0 | 0 | 3 |
| กระบวนการข้ามบทบาท E2E | 2 | 0 | 0 | 0 | 0 | 2 |
| รวม | 48 | 0 | 0 | 0 | 0 | 48 |

## 2.3 บันทึกผลการทดสอบรายกรณี (Test Execution Log)

บันทึกสถานะจากการรันจริงเท่านั้น: P=Passed, F=Failed, B=Blocked, S=Skipped, NT=Not Tested รหัส defect ระบุเมื่อมีหลักฐาน ไม่ใส่ข้อมูลลับลงช่องผลจริง

| รหัส | ชื่อกรณีทดสอบ | FR | สถานะ | ผลจริง/หลักฐาน | รหัสข้อบกพร่อง | ผู้ทดสอบ | วันที่ |
|---|---|---|---|---|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | FR-001 | NT | TBD | TBD | TBD | TBD |
| TC-002 | สมัคร email ซ้ำ | FR-001 | NT | TBD | TBD | TBD | TBD |
| TC-003 | ล็อกอินข้อมูลถูก | FR-002 | NT | TBD | TBD | TBD | TBD |
| TC-004 | รหัสผ่านผิด | FR-002 | NT | TBD | TBD | TBD | TBD |
| TC-005 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | FR-003 | NT | TBD | TBD | TBD | TBD |
| TC-006 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | FR-003 | NT | TBD | TBD | TBD | TBD |
| TC-007 | ล็อกอินแล้วออกจากระบบ | FR-004 | NT | TBD | TBD | TBD | TBD |
| TC-008 | admin CRUD ผู้ใช้ | FR-005 | NT | TBD | TBD | TBD | TBD |
| TC-009 | student เรียก API จัดการผู้ใช้ | FR-005 | NT | TBD | TBD | TBD | TBD |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | FR-006 | NT | TBD | TBD | TBD | TBD |
| TC-011 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | FR-006 | NT | TBD | TBD | TBD | TBD |
| TC-012 | admin แทนรายการตัวเลือก | FR-007 | NT | TBD | TBD | TBD | TBD |
| TC-013 | student เปลี่ยนตัวเลือก | FR-007 | NT | TBD | TBD | TBD | TBD |
| TC-014 | guest/student/admin ค้นงาน approved และ pending | FR-008 | NT | TBD | TBD | TBD | TBD |
| TC-015 | คำค้นมีหลายคำและบันทึก log | FR-008 | NT | TBD | TBD | TBD | TBD |
| TC-016 | คำแนะนำไม่เผยงาน pending | FR-009 | NT | TBD | TBD | TBD | TBD |
| TC-017 | latest/popular และสถิติ | FR-010 | NT | TBD | TBD | TBD | TBD |
| TC-018 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | FR-011 | NT | TBD | TBD | TBD | TBD |
| TC-019 | ID ไม่มีอยู่ | FR-011 | NT | TBD | TBD | TBD | TBD |
| TC-020 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | FR-012 | NT | TBD | TBD | TBD | TBD |
| TC-021 | รายชื่อผู้เขียน/ที่ปรึกษา | FR-013 | NT | TBD | TBD | TBD | TBD |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | FR-014 | NT | TBD | TBD | TBD | TBD |
| TC-023 | ไม่ล็อกอินหรือ role guest ส่งงาน | FR-014 | NT | TBD | TBD | TBD | TBD |
| TC-024 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | FR-015 | NT | TBD | TBD | TBD | TBD |
| TC-025 | ผู้เขียนคนละ prefix ปี | FR-015 | NT | TBD | TBD | TBD | TBD |
| TC-026 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | FR-016 | NT | TBD | TBD | TBD | TBD |
| TC-027 | นามสกุล/MIME/ลายเซ็นผิด | FR-016 | NT | TBD | TBD | TBD | TBD |
| TC-028 | ผู้ส่ง/author เห็นงานใน `/my` | FR-017 | NT | TBD | TBD | TBD | TBD |
| TC-029 | ผู้มีสิทธิ์แก้แล้วกลับ pending | FR-018 | NT | TBD | TBD | TBD | TBD |
| TC-030 | คนอื่นแก้งาน | FR-018 | NT | TBD | TBD | TBD | TBD |
| TC-031 | ส่งเอกสารใหม่หลัง `needs_revision` | FR-019 | NT | TBD | TBD | TBD | TBD |
| TC-032 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | FR-020 | NT | TBD | TBD | TBD | TBD |
| TC-033 | คนอื่นลบงาน | FR-020 | NT | TBD | TBD | TBD | TBD |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | FR-021 | NT | TBD | TBD | TBD | TBD |
| TC-035 | ไม่มี token หรือไม่มีไฟล์ | FR-021 | NT | TBD | TBD | TBD | TBD |
| TC-036 | admin/advisor/student ดู pending | FR-022 | NT | TBD | TBD | TBD | TBD |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | FR-023 | NT | TBD | TBD | TBD | TBD |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | FR-024 | NT | TBD | TBD | TBD | TBD |
| TC-039 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | FR-024 | NT | TBD | TBD | TBD | TBD |
| TC-040 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | FR-025 | NT | TBD | TBD | TBD | TBD |
| TC-041 | admin เปลี่ยน advisor; student ถูกห้าม | FR-026 | NT | TBD | TBD | TBD | TBD |
| TC-042 | บันทึกและยกเลิก favorite | FR-027 | NT | TBD | TBD | TBD | TBD |
| TC-043 | อ่านเฉพาะของตนและ mark read | FR-028 | NT | TBD | TBD | TBD | TBD |
| TC-044 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | FR-029 | NT | TBD | TBD | TBD | TBD |
| TC-045 | dashboard insight และ chat | FR-030 | NT | TBD | TBD | TBD | TBD |
| TC-046 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | FR-031 | NT | TBD | TBD | TBD | TBD |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | FR-032 | NT | TBD | TBD | TBD | TBD |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | FR-032 | NT | TBD | TBD | TBD | TBD |

## 2.4 บันทึกข้อบกพร่อง (Defect Log)

ยังไม่มีข้อบกพร่องจากการ Execute TC ชุดนี้ ข้อสังเกตในข้อ 1.8 เป็นความเสี่ยงจากการอ่านโค้ด ไม่ใช่ผลทดสอบ Failed

| รหัส | อ้างอิง TC | รายละเอียด/วิธีทำซ้ำ | ความรุนแรง | สถานะ | ผู้รับผิดชอบ | Commit/ผล Retest |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

ระดับความรุนแรงที่เสนอ: Critical = ระบบหลักใช้ไม่ได้หรือข้อมูลรั่วอย่างมีนัยสำคัญ; High = workflow หลัก/สิทธิ์ผิด; Medium = ฟังก์ชันรองผิดและมีทางเลี่ยง; Low = ข้อความหรือการแสดงผลคลาดเคลื่อน ผู้รับผิดชอบต้องยืนยันระดับของ defect ที่พบจริง

| สรุปข้อบกพร่อง | Critical | High | Medium | Low | รวม |
|---|---|---|---|---|---|
| จำนวนที่พบจาก TC รอบนี้ | TBD | TBD | TBD | TBD | TBD |
| แก้ไขแล้ว/ปิด | TBD | TBD | TBD | TBD | TBD |
| คงค้าง | TBD | TBD | TBD | TBD | TBD |

## 2.5 การวิเคราะห์ผลและข้อสังเกต

ผลจริง จุดที่ไม่ผ่าน สาเหตุ แนวโน้ม defect และข้อจำกัดของ environment: TBD หลัง Execute

## 2.6 การประเมินตามเกณฑ์สิ้นสุดการทดสอบ

| เกณฑ์จากข้อ 1.4.2 | ผลการประเมิน | หมายเหตุ |
|---|---|---|
| TC ทั้ง 48 มีผลหรือเหตุผลที่ข้าม | ยังประเมินไม่ได้ | 48 รายการเป็น NT |
| Priority สูง 31 ข้อมีผลครบ | ยังประเมินไม่ได้ | ยังไม่ Execute |
| ทุก FR มีผลอย่างน้อยหนึ่ง TC | ยังประเมินไม่ได้ | มีเพียง coverage เชิงแผน 32/32 |
| เป้าหมายอัตราผ่าน/defect สำคัญ | ยังประเมินไม่ได้ | เกณฑ์อนุมัติและผลจริงยังเป็น TBD |
| รายงานผลจริงพร้อมทบทวน | ยังประเมินไม่ได้ | ผู้ทดสอบ/commit/หลักฐานยังเป็น TBD |

## 2.7 ข้อสรุปและคำแนะนำ (Conclusion & Recommendation)

ผลการตัดสิน: ☐ ยอมรับระบบ  ☐ ยอมรับแบบมีเงื่อนไข  ☐ ไม่ยอมรับ  ☑ ยังไม่ตัดสิน เพราะยังไม่ได้ Execute

ข้อเสนอแนะ: ดำเนิน TC-001–TC-048 บนฐานทดสอบแยก บันทึกหลักฐานและ defect ตามข้อ 2.3–2.4 แล้วจึงประเมินข้อ 2.6 โดยผู้อนุมัติ

## 2.8 การลงนามรับรองผลการทดสอบ

| บทบาท | ชื่อ-นามสกุล | ลายเซ็น/วิธีรับรอง | วันที่ |
|---|---|---|---|
| ผู้ทดสอบ (Tester) | TBD | TBD | TBD |
| หัวหน้าทีมทดสอบ (Test Manager) | TBD | TBD | TBD |
| ผู้พัฒนา (Developer) | TBD | TBD | TBD |
| ผู้อนุมัติ (Approver) | TBD | TBD | TBD |
