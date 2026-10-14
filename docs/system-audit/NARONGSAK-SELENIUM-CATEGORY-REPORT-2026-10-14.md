# รายงานผลการปรับโครงสร้าง Selenium — Narongsak

วันที่ทดสอบ: 14 ตุลาคม 2026

ผลล่าสุดรายเคส: **18 PASS / 0 FAIL / 0 BLOCKED / 0 NOT RUN**

ผลนี้รวมหลักฐานจากรอบทดสอบทั้งชุดและรอบแก้ไขเฉพาะเคส ไม่ใช่ผลจากการรันผ่าน 18 เคสใน session เดียว และไม่ได้ใช้ PASS จากเอกสารประวัติ

ใช้ Python 3.14.5, Pytest 9.1.1, Selenium, Chrome 155.0.8059.41 บน macOS; FastAPI และ Next.js จริงบน localhost ฐานข้อมูล SQLite และไฟล์เป็นข้อมูลชั่วคราวแยกจาก production AI provider ใช้ deterministic mock โดยไม่ bypass route หรือ authorization

| รอบรัน | ผลจริง | รายงานต้นทาง |
|---|---|---|
| 20261014-100458-084487 | 0 PASS / 0 FAIL / 18 BLOCKED | [รายงาน](../../tests/selenium/artifacts/20261014-100458-084487/report.md) |
| 20261014-100514-891870 | 17 PASS / 1 FAIL / 0 BLOCKED | [รายงาน](../../tests/selenium/artifacts/20261014-100514-891870/report.md) |
| 20261014-101102-345136 | 15 PASS / 3 FAIL / 0 BLOCKED | [รายงาน](../../tests/selenium/artifacts/20261014-101102-345136/report.md) |
| 20261014-101425-385463 | 4 PASS / 0 FAIL / 0 BLOCKED | [รายงาน](../../tests/selenium/artifacts/20261014-101425-385463/report.md) |

รอบ sandbox ไม่สามารถเปิดพอร์ต localhost จึงเป็น BLOCKED ต่อมารันนอก sandbox ด้วยสิทธิ์ที่ได้รับอนุญาต
รอบแรกพบชื่อ locator ของ AI tab ไม่ตรง (`Reviewer Matching`) รอบถัดมาพบ assertion รอ intermediate redirect แทน URL ปลายทาง และ assertion คำสำคัญไม่รองรับช่องว่างหลัง comma แก้เฉพาะโค้ดทดสอบและรัน TC-001, TC-022, TC-046, TC-047 ซ้ำ เคสอื่นใช้ผลรอบทั้งชุดล่าสุด

| Test Case ID | หมวดหมู่ | สถานการณ์ | ผลที่คาดหวัง | ผลจริง | สถานะ | Screenshot / error log |
|---|---|---|---|---|---|---|
| TC-001 | AUTH | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | สมัครสำเร็จโดยได้สิทธิ์ student แม้ส่ง role admin | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101425-385463/TC-001.png) |
| TC-004 | AUTH | รหัสผ่านผิด | แสดงข้อผิดพลาดและไม่สร้าง session | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-004.png) |
| TC-007 | AUTH | ล็อกอินแล้วออกจากระบบ | ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-007.png) |
| TC-010 | CATEGORY | อ่านสาธารณะและเพิ่มโดย admin | อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-010.png) |
| TC-013 | USER | student เปลี่ยนตัวเลือก | student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-013.png) |
| TC-016 | RECOMMENDATION | คำแนะนำไม่เผยงาน pending | คำแนะนำไม่เผยข้อมูล pending | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-016.png) |
| TC-019 | SUBMISSION | ID ไม่มีอยู่ | แสดงไม่พบงานวิจัยและ API ตอบ 404 | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-019.png) |
| TC-022 | SUBMISSION | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101425-385463/TC-022.png) |
| TC-025 | SUBMISSION | ผู้เขียนคนละ prefix ปี | UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422 | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-025.png) |
| TC-028 | SUBMISSION | ผู้ส่ง/author เห็นงานใน /my | เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-028.png) |
| TC-031 | SUBMISSION | ส่งเอกสารใหม่หลัง needs_revision | ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-031.png) |
| TC-034 | SUBMISSION | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-034.png) |
| TC-037 | REVIEW | ผู้ตรวจเห็นประวัติของตน | ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-037.png) |
| TC-038 | REVIEW | advisor ที่ได้รับมอบหมายอนุมัติ pending | ที่ปรึกษาที่ได้รับมอบหมายอนุมัติและบันทึกผลสำเร็จ | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-038.png) |
| TC-043 | NOTIFICATION | อ่านเฉพาะของตนและ mark read | เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-043.png) |
| TC-046 | AI | สี่ endpoint วิเคราะห์ผลงานและสิทธิ์ | ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101425-385463/TC-046.png) / [Pre-Review Analysis](../../tests/selenium/artifacts/20261014-101425-385463/TC-046-pre-review-analysis.png) / [Plagiarism Check](../../tests/selenium/artifacts/20261014-101425-385463/TC-046-plagiarism-check.png) / [Reviewer Matching](../../tests/selenium/artifacts/20261014-101425-385463/TC-046-reviewer-matching.png) / [Review Summary](../../tests/selenium/artifacts/20261014-101425-385463/TC-046-review-summary.png) |
| TC-047 | E2E | เว็บส่งงานแล้ว advisor ตรวจ | ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101425-385463/TC-047.png) |
| TC-048 | E2E | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ | ขั้นตอนและ assertions ผ่านทั้งหมด | PASS | [Screenshot](../../tests/selenium/artifacts/20261014-101102-345136/TC-048.png) |

ทั้ง 18 เคสมีขั้นตอน Selenium จริง TC-046 มี UI สำหรับทั้งสี่ endpoints จึงไม่ต้องแยก API-only endpoint ในแอปรุ่นนี้ HTTP assertions ที่อยู่ร่วมกับเคสเป็นหลักฐานเสริมด้าน contract และสิทธิ์ ไม่ถือว่า HTTP calls เป็น Selenium interaction

TC-013 บันทึกตัวเลือกส่วนกลางผ่าน UI แล้วแสดง error และข้อมูลเดิมไม่เปลี่ยน; API ปฏิเสธ student ด้วย 403 TC-048 บันทึกข้อสังเกตว่า student ยังเปิดหน้า /admin ได้ แต่ API จัดการผู้ใช้/หมวดหมู่ปฏิเสธด้วย 403 ไม่มีการแก้ business logic

ตรวจ collection ได้ 18 ไฟล์ หนึ่ง test ต่อไฟล์และ marker ตรงทุกหมวด; ตรวจการเลือก `-m ai` และไฟล์ TC-004 เดี่ยวแล้ว; Ruff และ git diff --check ผ่าน ตรวจ AST ยืนยันว่า test functions, helpers และ imports ของสมาชิกคนอื่นยังเหมือนเดิม

ขอบเขตผล: ไม่ยืนยัน PostgreSQL/pgvector, live AI provider หรือ production ระบบทดสอบ cleanup browser, services และ directory ชั่วคราวผ่าน fixtures

[วิธีติดตั้งและรัน](../../tests/selenium/README.md)
