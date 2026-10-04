# เอกสารกรณีทดสอบ (Test Case Specification)

## การทดสอบแบบ E2E และ API/Integration

ระบบ UniResearch — คลังและกระบวนการจัดการผลงานวิจัย

ใช้คู่กับ [FUNCTIONAL-REQUIREMENTS.md](FUNCTIONAL-REQUIREMENTS.md), [SYSTEM-OVERVIEW.md](SYSTEM-OVERVIEW.md) และ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md)

วันที่จัดทำ: 4 ตุลาคม 2026 · สถานะเอกสาร: ฉบับร่าง · ผลทดสอบทุกกรณี: Not Tested

## 1. บทนำ

เอกสารนี้ระบุ 48 กรณีสำหรับ UniResearch จาก Implementation ใน Repository ปัจจุบัน แต่ละกรณีโยง FR และระบุเงื่อนไขตั้งต้น ขั้นตอน ข้อมูลทดสอบ ผลที่คาดหวัง และช่องบันทึกผลจริง กรณีที่ไม่มีหน้าจอรองรับใช้ API/Integration โดยตรง จึงไม่เรียกทุกกรณีว่า E2E

ตัวอย่าง SPRS ใช้เป็นแนวทางรูปแบบเท่านั้น UniResearch ไม่มี workflow draft → submitted, role committee, การประเมินสี่ด้าน, ตาราง activity_logs, แท็กหรือรูปโปรไฟล์ตามตัวอย่าง ส่วนที่โค้ดรองรับจริงคือการสร้างผลงาน pending และการตรวจด้วย approved/rejected/needs_revision

### 1.1 สภาพแวดล้อมการทดสอบ

| รายการ | รายละเอียดจาก Repository |
|---|---|
| แอปพลิเคชัน | Next.js 16.2.12 / React 19.2.4 และ FastAPI; ดู package.json และ requirements.txt |
| ฐานข้อมูล | PostgreSQL image pgvector/pgvector:pg15; ต้องใช้ฐานทดสอบแยก |
| การเตรียมระบบ | docker compose up --build ตาม docker-compose.yml; backend ใช้ Base.metadata.create_all เมื่อเริ่ม |
| URL ค่าเริ่มต้น | Frontend localhost:3000, backend localhost:8000, DB host port 5433; ตรวจค่าจริงก่อนรัน |
| บัญชีทดสอบ | A1 admin, S1/S2/S3 student, D1/D2 advisor, G1 guest, U2 inactive; สร้างเฉพาะในฐานทดสอบและเก็บรหัสผ่านแยก |
| Browser | เวอร์ชัน/ชนิดที่ใช้จริง: TBD; Playwright config ใช้ baseURL 127.0.0.1:3000 หากไม่ override |
| AI | ใช้ test double สำหรับ functional; ผล provider จริงไม่กำหนดเป็นข้อความตายตัว |

### 1.2 เกณฑ์การผ่าน

กรณีผ่านเมื่อผลจริงตรงทุกข้อที่คาดหวัง และมีหลักฐานตรวจซ้ำได้ กรณีเชิงลบต้องส่งคำขอตรงถึง API และตรวจว่าไม่มีการเปลี่ยนข้อมูลที่ไม่ควรเปลี่ยน สำหรับหน้าที่มี UI ให้ตรวจ UI/redirect เพิ่มด้วย หาก UI กับ API ให้สิทธิ์ต่างกัน ให้บันทึกตามผลจริงและเปิด defect/ข้อสงสัย ไม่สรุปว่า Passed จากการอ่านโค้ด

### 1.3 ข้อมูลทดสอบร่วม

| รหัส | เงื่อนไข |
|---|---|
| A1/S1/S2/S3/D1/D2/G1/U2 | ผู้ใช้ตาม role; U2 inactive; S1/S2 มี prefix student_id เดียวกัน, S3 ต่าง prefix |
| C1/C2 | หมวดหมู่สองรายการชื่อไม่ซ้ำ |
| W1/W4 | ผลงาน approved ต่าง category/keywords/view_count; W1 มี PDF valid |
| W2 | งานของ S1 มอบ D1 เป็น advisor; เริ่ม pending ยกเว้นกรณี revision ที่กำหนด needs_revision |
| W3/W5 | W3 เป็นงานของ S2 ที่ S1 ไม่เกี่ยว; W5 ไม่มี file_path |
| N1/N2 | แจ้งเตือนของ S1/S2 ตามลำดับ |

Fixture แต่ละกรณีต้อง reset ก่อนใช้ โดยเฉพาะกรณีเปลี่ยนสถานะ/ลบงาน เก็บ email, ID, รหัสผ่าน และ token จริงในระบบทดสอบแยกจากเอกสารนี้ ห้ามคัดลอกค่าลับลงผลทดสอบ

### 1.4 สรุปรายการกรณีทดสอบ

| รหัส | ชื่อกรณีทดสอบ | กลุ่มฟังก์ชัน | FR | ความสำคัญ | ประเภท |
|---|---|---|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | บัญชี | FR-001 | สูง | Positive / Web/API |
| TC-002 | สมัคร email ซ้ำ | บัญชี | FR-001 | สูง | Negative / API |
| TC-003 | ล็อกอินข้อมูลถูก | บัญชี | FR-002 | สูง | Positive / Web/API |
| TC-004 | รหัสผ่านผิด | บัญชี | FR-002 | สูง | Negative / Web/API |
| TC-005 | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | บัญชี | FR-003 | สูง | Positive / Web/API |
| TC-006 | token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ | บัญชี | FR-003 | สูง | Negative / API |
| TC-007 | ล็อกอินแล้วออกจากระบบ | เว็บบัญชี | FR-004 | สูง | Positive / Web/API |
| TC-008 | admin CRUD ผู้ใช้ | ผู้ใช้ | FR-005 | สูง | Positive / Web/API |
| TC-009 | student เรียก API จัดการผู้ใช้ | ผู้ใช้ | FR-005 | สูง | Negative / API/RBAC |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | หมวดหมู่ | FR-006 | กลาง | Positive / Web/API |
| TC-011 | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | หมวดหมู่ | FR-006 | สูง | Negative / API/RBAC |
| TC-012 | admin แทนรายการตัวเลือก | ตัวเลือก | FR-007 | กลาง | Positive / Web/API |
| TC-013 | student เปลี่ยนตัวเลือก | ตัวเลือก | FR-007 | สูง | Negative / API/RBAC |
| TC-014 | guest/student/admin ค้นงาน approved และ pending | ค้นหา | FR-008 | สูง | Positive / Web/API/RBAC |
| TC-015 | คำค้นมีหลายคำและบันทึก log | ค้นหา | FR-008 | กลาง | Positive / API/Integration |
| TC-016 | คำแนะนำไม่เผยงาน pending | ค้นหา | FR-009 | สูง | Negative / Web/API |
| TC-017 | latest/popular และสถิติ | หน้าหลัก | FR-010 | กลาง | Positive / Web/API |
| TC-018 | เปิดงานและแนะนำงานที่เกี่ยวข้อง | รายละเอียด | FR-011 | กลาง | Positive / Web/API |
| TC-019 | ID ไม่มีอยู่ | รายละเอียด | FR-011 | กลาง | Negative / Web/API |
| TC-020 | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | คำแนะนำ | FR-012 | กลาง | Positive / API |
| TC-021 | รายชื่อผู้เขียน/ที่ปรึกษา | ผู้เกี่ยวข้อง | FR-013 | กลาง | Positive / Web/API |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | ส่งผลงาน | FR-014 | สูง | Positive / Web/API |
| TC-023 | ไม่ล็อกอินหรือ role guest ส่งงาน | ส่งผลงาน | FR-014 | สูง | Negative / Web/API/RBAC |
| TC-024 | IDs ไม่ใช่ JSON array/มี 0/role ผิด | Validation | FR-015 | สูง | Negative / API/Validation |
| TC-025 | ผู้เขียนคนละ prefix ปี | Validation | FR-015 | กลาง | Negative / Web/API/Validation |
| TC-026 | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | ไฟล์ | FR-016 | สูง | Positive / Web/API/Boundary |
| TC-027 | นามสกุล/MIME/ลายเซ็นผิด | ไฟล์ | FR-016 | สูง | Negative / API/Validation |
| TC-028 | ผู้ส่ง/author เห็นงานใน `/my` | ผลงานของฉัน | FR-017 | สูง | Positive / Web/API |
| TC-029 | ผู้มีสิทธิ์แก้แล้วกลับ pending | แก้ผลงาน | FR-018 | สูง | Positive / Web/API |
| TC-030 | คนอื่นแก้งาน | แก้ผลงาน | FR-018 | สูง | Negative / API/RBAC |
| TC-031 | ส่งเอกสารใหม่หลัง `needs_revision` | Revision | FR-019 | สูง | Positive / Web/API/Integration |
| TC-032 | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | ลบผลงาน | FR-020 | สูง | Positive / Web/API |
| TC-033 | คนอื่นลบงาน | ลบผลงาน | FR-020 | สูง | Negative / API/RBAC |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | ดาวน์โหลด | FR-021 | กลาง | Positive / Web/API |
| TC-035 | ไม่มี token หรือไม่มีไฟล์ | ดาวน์โหลด | FR-021 | กลาง | Negative / API |
| TC-036 | admin/advisor/student ดู pending | คิวตรวจ | FR-022 | สูง | Positive / Web/API/RBAC |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | ประวัติตรวจ | FR-023 | กลาง | Positive / Web/API/RBAC |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | ตรวจงาน | FR-024 | สูง | Positive / Web/API |
| TC-039 | advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด | ตรวจงาน | FR-024 | สูง | Negative / API/RBAC/Validation |
| TC-040 | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | ตรวจงาน | FR-025 | สูง | Positive / Web/API/Integration |
| TC-041 | admin เปลี่ยน advisor; student ถูกห้าม | มอบหมาย | FR-026 | สูง | Positive / Web/API/RBAC |
| TC-042 | บันทึกและยกเลิก favorite | Favorite | FR-027 | กลาง | Positive / Web/API |
| TC-043 | อ่านเฉพาะของตนและ mark read | แจ้งเตือน | FR-028 | สูง | Positive / Web/API/RBAC |
| TC-044 | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | AI | FR-029 | กลาง | Positive / API/AI |
| TC-045 | dashboard insight และ chat | AI | FR-030 | กลาง | Positive / API/AI/RBAC |
| TC-046 | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | AI ตรวจงาน | FR-031 | กลาง | Positive / Web/API/AI |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | E2E | FR-032 | สูง | Positive / E2E |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | E2E | FR-032 | กลาง | Positive / E2E/RBAC |

รวม 48 กรณี: Positive 32, Negative 16; ประเภทการดำเนินการระบุเพิ่มในแต่ละกรณี ทุกกรณีเริ่มที่ Not Tested

## 2. รายละเอียดกรณีทดสอบ

ชื่อผู้ทดสอบและวันที่ 1–4 ตุลาคม 2026 ในแต่ละกรณีเป็นการจัดสรรงานตามแผน ยังไม่ใช่หลักฐานว่าดำเนินการทดสอบแล้ว สถานะและผลการทดสอบจริงจึงเว้นไว้ให้ผู้ทดสอบกรอกหลังทดสอบ

### 2.1 บัญชีและโปรไฟล์

#### TC-001 — สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-001</td><th>ชื่อ Test Case</th><td>สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-001; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">email ยังไม่มี</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /register แล้วกรอกชื่อ นามสกุล email และรหัสที่กำหนดใน environment</li>
<li>กด สร้างบัญชี และตรวจ URL หลังส่ง</li>
<li>ใช้ email ใหม่อีกชุดส่ง POST /auth/register พร้อม role=admin แล้วอ่าน users</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">U1 ใช้ email ใหม่ในฐานทดสอบ; ชื่อ ทดสอบ ระบบ; role=admin เฉพาะคำขอ API</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>หน้าเว็บพาไป /login?registered=1 ไม่ล็อกอินอัตโนมัติ</li>
<li>ทั้งสองบัญชีมี role=student แม้ API รับค่า role=admin</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-002 — สมัคร email ซ้ำ

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-002</td><th>ชื่อ Test Case</th><td>สมัคร email ซ้ำ</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-001; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">มีผู้ใช้เดิม</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>บันทึกจำนวน users ของ email U1</li>
<li>ส่ง POST /auth/register ด้วย email เดิม</li>
<li>อ่าน status และจำนวนแถวหลังส่ง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">email ของ U1 ที่มีอยู่แล้ว</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>HTTP 400 และ detail ว่า email ถูกใช้แล้ว</li>
<li>จำนวนแถวไม่เพิ่ม</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-003 — ล็อกอินข้อมูลถูก

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-003</td><th>ชื่อ Test Case</th><td>ล็อกอินข้อมูลถูก</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-002; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">มีผู้ใช้</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /login แล้วกรอกข้อมูล S1</li>
<li>กด เข้าสู่ระบบ และตรวจเส้นทาง</li>
<li>เรียก /auth/me ด้วย token ที่ออกโดย backend</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1 active; email/password อยู่ในชุดข้อมูลทดสอบแยก</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>เว็บไป /account/saved ตาม route login</li>
<li>backend คืน token_type=bearer และ /auth/me คืน S1</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-004 — รหัสผ่านผิด

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-004</td><th>ชื่อ Test Case</th><td>รหัสผ่านผิด</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-002; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">มีผู้ใช้</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /login กรอก email ถูกแต่รหัสผิดแล้วส่ง</li>
<li>ตรวจข้อความและ URL</li>
<li>ส่ง POST /auth/login ด้วยข้อมูลเดียวกันโดยตรง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">email ของ S1 และรหัสผิดที่ไม่ใช่รหัสจริง</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>เว็บยังอยู่หน้า login และไม่เกิด session</li>
<li>backend ตอบ 400 ไม่มี access_token</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-005 — ดู/แก้โปรไฟล์และเปลี่ยนรหัส

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-005</td><th>ชื่อ Test Case</th><td>ดู/แก้โปรไฟล์และเปลี่ยนรหัส</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-003; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token ผู้ใช้ active</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 เปิด /student/profile</li>
<li>เปลี่ยนชื่อ ภาควิชา และรหัสผ่านแล้วบันทึก</li>
<li>โหลดหน้าใหม่และล็อกอินด้วยรหัสใหม่</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; ชื่อ ภาควิชา และรหัสใหม่เฉพาะฐานทดสอบ</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>GET /auth/me และหน้าโปรไฟล์แสดงค่าใหม่</li>
<li>รหัสใหม่ใช้ได้และรหัสถูกเก็บเป็น hash</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-006 — token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-006</td><th>ชื่อ Test Case</th><td>token ไม่ถูก/ผู้ใช้ inactive/email ซ้ำ</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-003; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">มีผู้ใช้สองราย</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>GET /auth/me ด้วย token ปลอม</li>
<li>GET ด้วย token ของ U2</li>
<li>PUT /auth/me ของผู้ใช้อื่นให้ email ซ้ำกับ S1</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">token ปลอม; U2 inactive; email ของ S1</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ได้ 401, 400, 400 ตามลำดับ</li>
<li>email ใน users ไม่เปลี่ยน</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-007 — ล็อกอินแล้วออกจากระบบ

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-007</td><th>ชื่อ Test Case</th><td>ล็อกอินแล้วออกจากระบบ</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-004; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">backend พร้อม</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 ผ่าน /login</li>
<li>ตรวจ cookie ของ /api/auth/login ว่า HttpOnly และเปิด /account/saved</li>
<li>กดออกจากระบบหรือ POST /api/auth/logout แล้วเปิด /account/saved อีกครั้ง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; browser profile ใหม่</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>มี session cookie ระหว่างล็อกอิน</li>
<li>หลัง logout cookie ถูกลบและหน้า protected พาไป /login</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.2 ผู้ใช้ หมวดหมู่ และตัวเลือก

#### TC-008 — admin CRUD ผู้ใช้

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-008</td><th>ชื่อ Test Case</th><td>admin CRUD ผู้ใช้</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-005; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token admin</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน A1 เปิด /admin/users และเพิ่ม U3</li>
<li>GET /users/{id} แล้วแก้ชื่อ/role จากหน้าเว็บหรือ PUT</li>
<li>ลบ U3 แล้ว GET ID เดิม</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">A1; U3 email ใหม่และ role=advisor</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>POST สร้างได้ 201</li>
<li>แก้ไขคงอยู่</li>
<li>ลบได้ 204 และ GET หลังลบ 404</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-009 — student เรียก API จัดการผู้ใช้

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-009</td><th>ชื่อ Test Case</th><td>student เรียก API จัดการผู้ใช้</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-005; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token student</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ใช้ token S1 ส่ง GET/POST /users/</li>
<li>ส่ง GET/PUT/DELETE /users/{id}</li>
<li>ใช้ A1 ตรวจ U3 หลังคำขอ</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; U3 ที่มีอยู่</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ทุกคำขอ S1 ตอบ 403</li>
<li>U3 ไม่ถูกเปลี่ยนหรือลบ</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-010 — อ่านสาธารณะและเพิ่มโดย admin

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-010</td><th>ชื่อ Test Case</th><td>อ่านสาธารณะและเพิ่มโดย admin</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-006; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token admin</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /admin/categories และกรอกชื่อ/คำอธิบาย C2</li>
<li>กด เพิ่มหมวดหมู่</li>
<li>เปิดหน้าใหม่และ GET /categories/ แบบไม่มี token</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">A1; category ใหม่ C2 ชื่อไม่ซ้ำ</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>C2 ปรากฏพร้อม id</li>
<li>GET สาธารณะคืน C2</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-011 — ผู้ไม่ใช่ admin เพิ่มหมวดหมู่

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-011</td><th>ชื่อ Test Case</th><td>ผู้ไม่ใช่ admin เพิ่มหมวดหมู่</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-006; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token student</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง POST /categories/ ด้วย token S1</li>
<li>GET /categories/ อีกครั้ง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; ชื่อ category ใหม่ไม่ซ้ำ</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>POST ตอบ 403</li>
<li>ไม่พบ category ใหม่</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-012 — admin แทนรายการตัวเลือก

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-012</td><th>ชื่อ Test Case</th><td>admin แทนรายการตัวเลือก</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-007; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token admin</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /admin/options หรือส่ง POST /options/ พร้อมสอง array</li>
<li>GET /options/ หลังบันทึก</li>
<li>ตรวจตาราง departments/work_types</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">A1; departments และ work_types ชุดใหม่ มี whitespace และช่องว่าง</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ค่าก่อนหน้าถูกแทน</li>
<li>ชื่อถูก trim และรายการว่างไม่ถูกเก็บ</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>1 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-013 — student เปลี่ยนตัวเลือก

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-013</td><th>ชื่อ Test Case</th><td>student เปลี่ยนตัวเลือก</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-007; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token student</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง POST /options/ ด้วย token S1</li>
<li>GET /options/ เทียบ snapshot</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; snapshot ของ GET /options/</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>POST ตอบ 403</li>
<li>รายการเดิมคงอยู่</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.3 ค้นหา รายละเอียด และคำแนะนำ

#### TC-014 — guest/student/admin ค้นงาน approved และ pending

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-014</td><th>ชื่อ Test Case</th><td>guest/student/admin ค้นงาน approved และ pending</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-008; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานสองสถานะ หลายเจ้าของ</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /research เป็น guest และค้นคำ/หมวด</li>
<li>เรียก /research/search ด้วย guest, S1 และ A1</li>
<li>เทียบ ID ผลแต่ละสิทธิ์</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 approved; W2 pending ของ S1; W3 pending ของ S2; C1/C2</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>guest เห็น approved เท่านั้น</li>
<li>S1 เห็น approved และงานที่เกี่ยวข้อง</li>
<li>A1 เห็นทั้งหมดตามตัวกรอง</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-015 — คำค้นมีหลายคำและบันทึก log

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-015</td><th>ชื่อ Test Case</th><td>คำค้นมีหลายคำและบันทึก log</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-008; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / API/Integration</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานตัวอย่าง</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง GET /research/search?q=สองคำ</li>
<li>ตรวจ ID/อันดับผล</li>
<li>อ่าน search_logs ก่อนและหลัง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 มีคำทดสอบใน title_th และ abstract; query สองคำ</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>งานที่ตรงเงื่อนไข OR ปรากฏ</li>
<li>มี search_log keyword ตรง q</li>
<li>ชื่อเรื่องได้รับคะแนนสูงกว่า abstract ตามโค้ด</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-016 — คำแนะนำไม่เผยงาน pending

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-016</td><th>ชื่อ Test Case</th><td>คำแนะนำไม่เผยงาน pending</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-009; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">ชื่อ/คำสำคัญเฉพาะใน pending</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /research และพิมพ์ keyword เฉพาะเพื่อดู suggestions</li>
<li>เรียก /research/search/suggestions?q=...</li>
<li>เทียบ titles/keywords กับ W1/W2</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 approved และ W2 pending มี keyword ไม่ซ้ำ</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ไม่มีข้อมูลจาก W2 pending ใน suggestions</li>
<li>ข้อมูล approved ที่ตรงค้นปรากฏ</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-017 — latest/popular และสถิติ

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-017</td><th>ชื่อ Test Case</th><td>latest/popular และสถิติ</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-010; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งาน approved/pending และ count</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>GET /home/latest?limit=1 และ /home/popular?limit=1</li>
<li>GET /stats/</li>
<li>เทียบตัวเลข/ลำดับกับ research_works และ users</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1/W4 approved มีวันเผยแพร่และ view_count ต่างกัน; W2 pending</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>latest/popular มี approved ไม่เกินหนึ่งรายการและเรียงตามฟิลด์ที่โค้ดใช้</li>
<li>stats ตรง count/sum ของ DB</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-018 — เปิดงานและแนะนำงานที่เกี่ยวข้อง

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-018</td><th>ชื่อ Test Case</th><td>เปิดงานและแนะนำงานที่เกี่ยวข้อง</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-011; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานที่มี category/keywords</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>อ่าน view_count ของ W1</li>
<li>เปิด /research/{id} ของ W1 และเรียก /research/{id}/recommendations</li>
<li>เรียก GET /research/{id} ของ W2 pending โดยไม่มี token เพื่อบันทึกการเข้าถึง URL ตรง</li>
<li>ตรวจ view_count และ download_view_logs</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 approved; W4 related approved; W2 pending</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>รายละเอียด W1 แสดง</li>
<li>view_count เพิ่ม 1 พร้อม view log</li>
<li>คำแนะนำไม่มี W1/W2</li>
<li>API ปัจจุบันคืนรายละเอียด W2 pending ให้คำขอไม่มี token; ให้บันทึกผลนี้เป็นความเสี่ยงด้านการมองเห็นงาน</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-019 — ID ไม่มีอยู่

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-019</td><th>ชื่อ Test Case</th><td>ID ไม่มีอยู่</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-011; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Negative / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">ไม่มี ID</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /research/{id} ของ ID ไม่มี</li>
<li>เรียก GET /research/{id} โดยตรง</li>
<li>ตรวจ view log</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">ID จำนวนเต็มบวกที่ไม่มีใน research_works</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>API ตอบ 404</li>
<li>หน้าเว็บแสดงสถานะไม่พบ</li>
<li>ไม่มี view log ใหม่</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-020 — ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-020</td><th>ชื่อ Test Case</th><td>ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-012; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">approved หลายหมวด</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>GET /research/recommendations/personalized ไม่มี token</li>
<li>GET ด้วย token S1</li>
<li>ตรวจ status/จำนวน/ลำดับผล</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1/W4 approved; S1 มี favorite W1</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ผลมีเฉพาะ approved ไม่เกิน 5</li>
<li>ไม่มี interaction ใช้ความนิยม และมี interaction ใช้ profile category/keyword</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.4 ส่งผลงานและตรวจข้อมูล

#### TC-021 — รายชื่อผู้เขียน/ที่ปรึกษา

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-021</td><th>ชื่อ Test Case</th><td>รายชื่อผู้เขียน/ที่ปรึกษา</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-013; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">student/advisor active/inactive</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 เปิด /student/research/new และดูตัวเลือกผู้เกี่ยวข้อง</li>
<li>GET /research/participants</li>
<li>เรียกโดยไม่มี token</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1/S2 active student; D1/D2 active advisor; U2 inactive</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>authors/advisors แยก role และไม่รวม U2</li>
<li>S1 มี is_current=true</li>
<li>ไม่มี token 401</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-022 — ส่งงานครบข้อมูลและผู้เกี่ยวข้อง

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-022</td><th>ชื่อ Test Case</th><td>ส่งงานครบข้อมูลและผู้เกี่ยวข้อง</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-014; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token student; category/IDs ถูก</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 เปิด /student/research/new</li>
<li>กรอกห้าขั้น เลือก author/advisor แนบไฟล์ แล้วยืนยัน</li>
<li>อ่านหน้าสำเร็จและ query research_works/research_authors/research_advisors</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1, C1, D1; ชื่อไทย งานวิจัยทดสอบ; ชื่ออังกฤษ Research Test; PDF/ภาพ valid</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>สร้างงาน status=pending และ submitted_by_id=S1</li>
<li>ผู้เกี่ยวข้องและ path ไฟล์ตรง input</li>
<li>ไม่มี draft</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak และ Natthaporn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-023 — ไม่ล็อกอินหรือ role guest ส่งงาน

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-023</td><th>ชื่อ Test Case</th><td>ไม่ล็อกอินหรือ role guest ส่งงาน</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-014; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / Web/API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">guest token หรือไม่มี token</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /student/research/new โดยไม่ล็อกอิน</li>
<li>ส่ง POST /research/ ไม่มี token</li>
<li>ส่งอีกครั้งด้วย G1</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">ไม่มี session และ G1 role guest; multipart body แบบ TC-022</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>หน้าเว็บพาไป /login</li>
<li>API ตอบ 401 และ 403</li>
<li>ไม่มีงานใหม่</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-024 — IDs ไม่ใช่ JSON array/มี 0/role ผิด

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-024</td><th>ชื่อ Test Case</th><td>IDs ไม่ใช่ JSON array/มี 0/role ผิด</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-015; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/Validation</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">category ถูก</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง POST /research/ ทีละชุดด้วย S1</li>
<li>บันทึก status/detail</li>
<li>เทียบจำนวน research_works</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">C1; author_ids เป็นข้อความผิดรูปแบบ, [0], advisor_ids เป็น student, category_id ไม่มี</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>รูปแบบ/role ผิดตอบ 422</li>
<li>ID ที่ไม่มีตอบ 404</li>
<li>ไม่มีงานถูกสร้าง</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>2 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-025 — ผู้เขียนคนละ prefix ปี

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-025</td><th>ชื่อ Test Case</th><td>ผู้เขียนคนละ prefix ปี</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-015; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Negative / Web/API/Validation</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">student สองคนมี student_id ต่าง prefix</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ตรวจตัวเลือก author ในฟอร์ม S1</li>
<li>ส่ง POST /research/ โดยตรงพร้อม author_ids สองคน</li>
<li>เทียบ DB</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1/S3 มี student_id สองตัวแรกต่างกัน</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>frontend กรองผู้เขียนต่าง prefix</li>
<li>backend ตอบ 422 และไม่สร้างงาน</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-026 — อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-026</td><th>ชื่อ Test Case</th><td>อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-016; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/Boundary</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">ไฟล์ภาพ/PDF ถูกต้อง</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ตรวจค่า MAX_COVER_IMAGE_BYTES/MAX_DOCUMENT_BYTES ของรอบทดสอบ</li>
<li>ส่ง POST multipart แยกสี่ไฟล์ด้วย S1</li>
<li>ตรวจ status และไฟล์ใน STATIC_DIR</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">ภาพที่ลายเซ็นถูก ขนาดเท่าขีดจำกัดและเกิน 1 byte; PDF เช่นเดียวกัน</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ไฟล์เท่าขีดจำกัดรับ</li>
<li>เกิน 1 byte ตอบ 413</li>
<li>ไฟล์เกินขนาดไม่ค้าง</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-027 — นามสกุล/MIME/ลายเซ็นผิด

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-027</td><th>ชื่อ Test Case</th><td>นามสกุล/MIME/ลายเซ็นผิด</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-016; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/Validation</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">เตรียมไฟล์ปลอม</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง POST multipart แต่ละแบบ</li>
<li>ตรวจ status</li>
<li>เทียบ research_works และโฟลเดอร์ upload ก่อน/หลัง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">MIME/นามสกุลไม่เข้าคู่; PDF ปลอม; cover valid กับ document invalid</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ตอบ 415</li>
<li>ไม่มีงานหรือ partial cover ใหม่ค้าง</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.5 ผลงานของฉัน การแก้ไข และไฟล์

#### TC-028 — ผู้ส่ง/author เห็นงานใน `/my`

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-028</td><th>ชื่อ Test Case</th><td>ผู้ส่ง/author เห็นงานใน <code>/my</code></td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-017; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานที่เกี่ยวข้องและไม่เกี่ยวข้อง</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 เปิด /student/research</li>
<li>GET /research/my</li>
<li>เทียบ ID ใน UI/API</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 ส่งโดย S1; W4 มี S1 เป็น author; W3 ไม่เกี่ยว</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>เห็น W1 และ W4 เท่านั้น</li>
<li>ไม่เห็น W3</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-029 — ผู้มีสิทธิ์แก้แล้วกลับ pending

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-029</td><th>ชื่อ Test Case</th><td>ผู้มีสิทธิ์แก้แล้วกลับ pending</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-018; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งาน approved ของตน</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /student/research/edit/{id} แล้วแก้ฟิลด์</li>
<li>บันทึกและ GET /research/{id}</li>
<li>ตรวจ status ใน DB</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 approved ของ S1; ชื่อและบทคัดย่อใหม่; C1</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ข้อมูลใหม่คงอยู่</li>
<li>status กลับ pending</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-030 — คนอื่นแก้งาน

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-030</td><th>ชื่อ Test Case</th><td>คนอื่นแก้งาน</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-018; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานของผู้อื่น</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง PUT /research/{id} ของ W3 ด้วย S1</li>
<li>GET W3 โดย A1</li>
<li>เทียบ fields/relations</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W3 เป็นของ S2 และ S1 ไม่ใช่ author</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>PUT ตอบ 403</li>
<li>W3 ไม่เปลี่ยน</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-031 — ส่งเอกสารใหม่หลัง `needs_revision`

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-031</td><th>ชื่อ Test Case</th><td>ส่งเอกสารใหม่หลัง <code>needs_revision</code></td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-019; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/Integration</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งาน needs_revision มีเอกสารเดิม</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิดหน้าแก้งานที่มีสิทธิ์และแนบ PDF ใหม่</li>
<li>ส่ง PUT /research/{id}</li>
<li>ตรวจ file_revisions และ research_works</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W2 status=needs_revision มี PDF เดิม; PDF ใหม่ valid</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>file_revisions เก็บ path เดิมกับ version_no เพิ่ม</li>
<li>งานชี้ไฟล์ใหม่และ status=pending</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-032 — เจ้าของลบงานพร้อมข้อมูลสัมพันธ์

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-032</td><th>ชื่อ Test Case</th><td>เจ้าของลบงานพร้อมข้อมูลสัมพันธ์</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-020; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานที่มี authors/advisors/favorites</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิดรายการงานของ S1 แล้วสั่งลบ</li>
<li>GET ID เดิม</li>
<li>ตรวจตารางสัมพันธ์และไฟล์หลัก</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 ของ S1 มี authors/advisors/reviews/favorite/log และไฟล์</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>DELETE สำเร็จและ GET 404</li>
<li>รายการสัมพันธ์ที่ service ลบหาย</li>
<li>ไฟล์หลักถูกลบ</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-033 — คนอื่นลบงาน

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-033</td><th>ชื่อ Test Case</th><td>คนอื่นลบงาน</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-020; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานของผู้อื่น</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ส่ง DELETE /research/{id} ของ W3 ด้วย S1</li>
<li>GET W3 และ relations ด้วย A1</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W3 ของ S2</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>DELETE ตอบ 403</li>
<li>W3 คงอยู่</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-034 — ผู้ใช้ active ดาวน์โหลดงานมีไฟล์

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-034</td><th>ชื่อ Test Case</th><td>ผู้ใช้ active ดาวน์โหลดงานมีไฟล์</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-021; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานมี PDF</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 เปิดรายละเอียดและกดดาวน์โหลดหรือ POST endpoint</li>
<li>ตรวจ file_url และเปิด URL ด้วย session ของ S1</li>
<li>เปิด file_url เดิมใน browser ที่ไม่มี session เพื่อบันทึกพฤติกรรม static file ตามโค้ดปัจจุบัน</li>
<li>ตรวจ counter/log</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 มี PDF; S1 active</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ได้ file_url</li>
<li>download_count เพิ่ม 1 และ log ระบุ S1/action_type=download</li>
<li>URL ใต้ /static เปิดตรงได้โดยไม่เรียก endpoint download; การเปิดตรงไม่เพิ่ม download_count ให้บันทึกเป็นความเสี่ยงที่ต้องยืนยันนโยบาย</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-035 — ไม่มี token หรือไม่มีไฟล์

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-035</td><th>ชื่อ Test Case</th><td>ไม่มี token หรือไม่มีไฟล์</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-021; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Negative / API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานไม่มีไฟล์</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST /research/{id}/download โดยไม่มี token</li>
<li>POST W5 ด้วย S1</li>
<li>ตรวจ counters ก่อน/หลัง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1 มีไฟล์; W5 ไม่มีไฟล์</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ตอบ 401 และ 404 ตามลำดับ</li>
<li>counter ไม่เพิ่ม</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.6 คิวและผลการตรวจ

#### TC-036 — admin/advisor/student ดู pending

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-036</td><th>ชื่อ Test Case</th><td>admin/advisor/student ดู pending</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-022; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานมอบหมายหลาย advisor</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิดคิว /advisor/reviews ด้วย D1 และ /admin/reviews ด้วย A1</li>
<li>GET /research/pending ด้วย A1/D1/S1 แล้วเทียบกับรายการบนหน้าเว็บ</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W2 pending assigned D1; W3 pending assigned D2; A1/S1</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>API admin เห็นทั้งสอง, D1 เห็น W2, S1 ตอบ 403</li>
<li>หน้า /advisor/reviews โหลดผ่าน searchResearch ซึ่ง backend อนุญาตให้ advisor เห็นงานทั้งหมด; หาก UI แสดง W3 ให้บันทึกความต่างจาก /research/pending และเปิดข้อสงสัยด้านการมองเห็นคิว</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>3 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-037 — ผู้ตรวจเห็นประวัติของตน

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-037</td><th>ชื่อ Test Case</th><td>ผู้ตรวจเห็นประวัติของตน</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-023; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">มี ReviewComment หลาย reviewer</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิด /advisor/history ด้วย D1</li>
<li>GET /research/history ด้วย D1/A1/S1</li>
<li>เทียบ reviewer_id ใน review_comments</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">D1/A1 มี review ของคนละงาน; S1</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>D1/A1 เห็นเฉพาะงานที่ตนตรวจ</li>
<li>S1 ตอบ 403</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-038 — advisor ที่ได้รับมอบหมายอนุมัติ pending

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-038</td><th>ชื่อ Test Case</th><td>advisor ที่ได้รับมอบหมายอนุมัติ pending</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-024; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งาน pending มอบหมาย advisor</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน D1 เปิด /advisor/reviews/{id}</li>
<li>เลือก approved กรอกคะแนน/ความคิดเห็นและยืนยัน modal</li>
<li>GET งานและ review_comments</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W2 pending assigned D1; comment และ score 80</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>status=approved</li>
<li>review ใหม่มี reviewer_id=D1, comment และ score ตรง</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak และ Sommai Kitikorn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-039 — advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-039</td><th>ชื่อ Test Case</th><td>advisor ไม่ได้รับมอบหมาย/งานไม่ pending/enum ผิด</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-024; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Negative / API/RBAC/Validation</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">มีงานตามเงื่อนไข</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST review W2 ด้วย D2</li>
<li>POST review W1 ด้วย D1</li>
<li>POST enum ผิดกับ W2</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W2 pending ไม่ assigned D2; W1 approved; status_result=unknown</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ตอบ 403, 400, 422 ตามกรณี</li>
<li>ไม่มี review เพิ่ม</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-040 — อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-040</td><th>ชื่อ Test Case</th><td>อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-025; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/Integration</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งาน pending มี submitter/author</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST review approved โดย D1 พร้อม comment/score</li>
<li>อ่าน research_works, review_comments, notifications</li>
<li>เปิดรายการแจ้งเตือนของ S1/S2</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W2 pending มี submitter S1 และ co-author S2</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>published_at ไม่ null</li>
<li>comment/score บันทึก</li>
<li>ผู้ส่งและ co-author มี notification</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn และ Natthaporn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-041 — admin เปลี่ยน advisor; student ถูกห้าม

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-041</td><th>ชื่อ Test Case</th><td>admin เปลี่ยน advisor; student ถูกห้าม</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-026; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานและ advisor สองคน</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST /research/{id}/assign-advisors ด้วย A1 ให้ [D2]</li>
<li>GET pending ด้วย D1/D2</li>
<li>POST เดิมด้วย S1</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W2 assigned D1; D2 active; A1/S1</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>relation เปลี่ยนเป็น D2</li>
<li>D2 เห็นงานในคิว, D1 ไม่เห็น</li>
<li>S1 ตอบ 403</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.7 Favorite และการแจ้งเตือน

#### TC-042 — บันทึกและยกเลิก favorite

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-042</td><th>ชื่อ Test Case</th><td>บันทึกและยกเลิก favorite</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-027; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">token active; งานมีอยู่</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>เปิดรายละเอียด W1 กดบันทึก</li>
<li>GET /favorites/ และเปิด /account/saved</li>
<li>กดยกเลิกหรือ POST ซ้ำ แล้ว GET อีกครั้ง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; W1; เริ่มไม่มี favorite</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>ครั้งแรกมี favorite ของ S1</li>
<li>ครั้งที่สองหาย</li>
<li>response ยกเลิกเป็น HTTP 200 กับ detail ตาม implementation</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-043 — อ่านเฉพาะของตนและ mark read

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-043</td><th>ชื่อ Test Case</th><td>อ่านเฉพาะของตนและ mark read</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-028; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / Web/API/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">แจ้งเตือนสองผู้ใช้</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 เปิดรายการแจ้งเตือน</li>
<li>GET /notifications/</li>
<li>POST read N1/N2 และ read-all</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">N1 ของ S1 และ N2 ของ S2</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>S1 เห็นเฉพาะ N1</li>
<li>N2 ตอบ 404</li>
<li>N1 เป็น is_read=true</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.8 AI

#### TC-044 — เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-044</td><th>ชื่อ Test Case</th><td>เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-029; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / API/AI</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">ตั้ง AI test double</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST generate-abstract, suggest-titles, suggest-keywords, check-writing ด้วย S1</li>
<li>ตรวจ response schema</li>
<li>ส่ง body ขาด field และไม่มี token</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1; AI test double; body ถูกและขาด required field</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>body ถูกคืนฟิลด์ตาม schema</li>
<li>body ผิดตอบ 422</li>
<li>ไม่มี token ตอบ 401</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Sommai Kitikorn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-045 — dashboard insight และ chat

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-045</td><th>ชื่อ Test Case</th><td>dashboard insight และ chat</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-030; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / API/AI/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">AI test double; งาน approved</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST /ai/dashboard-insights ด้วย A1 และ S1</li>
<li>POST /ai/chat แบบไม่มี token</li>
<li>ตรวจ response/relevant_works</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">A1/S1; AI test double; W1 approved</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>A1 ได้ insight, S1 403</li>
<li>chat คืน response และ relevant_works array</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Natthaporn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-046 — สี่ endpoint วิเคราะห์ผลงานและสิทธิ์

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-046</td><th>ชื่อ Test Case</th><td>สี่ endpoint วิเคราะห์ผลงานและสิทธิ์</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-031; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / Web/API/AI</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">งานมีอยู่; AI test double</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>POST ai-pre-review, ai-plagiarism, ai-reviewer-match, ai-review-summary ของ W1 ด้วย D1</li>
<li>ทำซ้ำด้วย S1 และ ID ไม่มี</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">W1; D1/S1; AI test double</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>D1 ได้ผลตาม service</li>
<li>S1 403</li>
<li>ID ไม่มี 404</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

### 2.9 กระบวนการข้ามบทบาทแบบ E2E

#### TC-047 — เว็บส่งงานแล้ว advisor ตรวจ

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-047</td><th>ชื่อ Test Case</th><td>เว็บส่งงานแล้ว advisor ตรวจ</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-032; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>สูง / Positive / E2E</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">backend/frontend และบัญชีทดสอบพร้อม</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน S1 ส่งงานผ่าน /student/research/new</li>
<li>บันทึก ID และตรวจ /student/research</li>
<li>ล็อกอิน D1 เปิด /advisor/reviews/{id} และส่งผลตรวจ</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">S1, D1, C1; browser แยก session; PDF valid</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>งานเริ่ม pending และอยู่ในคิว D1</li>
<li>หลังตรวจ review/status ตรง UI และ DB</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak, Sommai Kitikorn และ Natthaporn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

#### TC-048 — เว็บ admin จัดการหมวดหมู่/ผู้ใช้

<table>
<tbody>
<tr><th>รหัส Test Case</th><td>TC-048</td><th>ชื่อ Test Case</th><td>เว็บ admin จัดการหมวดหมู่/ผู้ใช้</td></tr>
<tr><th>อ้างอิง (US/FR)</th><td>FR-032; หลักฐาน Source Code ใน FUNCTIONAL-REQUIREMENTS.md</td><th>ความสำคัญ / ประเภท</th><td>กลาง / Positive / E2E/RBAC</td></tr>
<tr><th>เงื่อนไขตั้งต้น (Precondition)</th><td colspan="3">admin พร้อม</td></tr>
<tr><th>ขั้นตอนการทดสอบ (Test Steps)</th><td colspan="3"><ol>
<li>ล็อกอิน A1 เพิ่ม C2 ที่ /admin/categories และ U3 ที่ /admin/users</li>
<li>ตรวจ GET API/DB</li>
<li>ล็อกอิน S1 เปิด /admin และส่งคำขอ admin โดยตรง</li>
</ol></td></tr>
<tr><th>ข้อมูลทดสอบ (Test Data)</th><td colspan="3">A1, S1, C2 และ U3 ใหม่</td></tr>
<tr><th>ผลที่คาดหวัง (Expected Result)</th><td colspan="3"><ul>
<li>C2/U3 บันทึกจริง</li>
<li>คำขอ API ของ S1 ตอบ 403</li>
<li>การเปิด /admin ของ S1 ให้บันทึกพฤติกรรมจริงเพราะ layout ตรวจเพียง session</li>
</ul></td></tr>
<tr><th>ผลการทดสอบจริง (Actual Result)</th><td colspan="3"></td></tr>
<tr><th>สถานะ</th><td>☐ ผ่าน &nbsp; ☐ ไม่ผ่าน &nbsp; ☐ ข้าม</td><th>ผู้ทดสอบ / วันที่</th><td>Narongsak, Sommai Kitikorn และ Natthaporn<br>4 ตุลาคม 2026 (กำหนด)</td></tr>
</tbody>
</table>

## 3. สรุปผลและการลงนาม

| รายการ | จำนวน |
|---|---:|
| กรณีทดสอบทั้งหมด | 48 |
| Not Tested | 48 |
| ผ่าน | 0 |
| ไม่ผ่าน | 0 |
| ข้าม/Blocked | 0 |

ตัวเลขข้างต้นเป็นสถานะตั้งต้น ยังไม่มีการ execute จริง รายงานผลรายกรณีและการประเมิน exit criteria อยู่ใน TEST-PLAN-AND-REPORT.md

| บทบาท | ชื่อ-นามสกุล | วันที่ | สถานะรับรอง |
|---|---|---|---|
| ผู้ทดสอบ | TBD | TBD | รอ |
| ผู้พัฒนา | TBD | TBD | รอ |
| ผู้อนุมัติ | TBD | TBD | รอ |
