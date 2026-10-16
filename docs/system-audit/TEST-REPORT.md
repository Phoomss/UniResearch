# รายงานผลการทดสอบ UniResearch

ชื่องานปัจจุบันใช้ชื่อเต็มจาก [migrate.py/seed_thai_data.py](TEST-RESEARCH-DATA.md) พร้อมระบุสำเนาที่เตรียมเพิ่ม สถานะและการเชื่อมบัญชี CSV เป็นเงื่อนไขบนฐานทดสอบ ไม่ใช่ผล migration หรือผลทดสอบย้อนหลังของบุคคลนั้น

ฉบับข้อมูลทดสอบปัจจุบันใช้ชื่อ/อีเมลจาก [student.csv](../../backend/app/scripts/student.csv) และ [advisors.csv](../../backend/app/scripts/advisors.csv) ตามตารางใน [Test Cases ข้อ 1.2](TEST-CASES.md#12-สภาพแวดล้อมและข้อมูลร่วม) ต้องเตรียมสำเนาฐานทดสอบให้ตรงก่อนรัน เลขผู้ใช้ในเอกสารเป็น mapping ของฐานทดสอบตามแผน ไม่ใช่ id จาก CSV ผลรันย้อนหลังใช้บัญชีตัวอย่างของรอบเดิมและยังไม่ได้ทดสอบชุด CSV นี้

ฉบับทบทวนเนื้อหา: **16 ตุลาคม 2026** · ส่วนที่ 2 ของ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md)

**ข้อสรุป:** มีหลักฐาน Selenium baseline ทั้ง 48 กรณีวันที่ 8 ตุลาคม: **44 PASS / 4 FAIL** และมีผล UI subset 18 กรณีวันที่ 14 ตุลาคม: **18 PASS** ใน session เดียว ส่วน session ล่าสุดที่ตรวจพบวันที่ 16 ตุลาคมรันเฉพาะ TC-038: **1 PASS / 17 NOT RUN** ไม่มีหลักฐานว่ารันเงื่อนไขที่เพิ่มใน Test Cases ฉบับทบทวนครบแล้ว จึงยังรับรองระบบครบขอบเขตไม่ได้

รายงานนี้ตรวจและเรียบเรียงจากผลที่มีอยู่ **ไม่ได้รันทดสอบใหม่** ไม่รวม PASS ข้าม session/commit เป็นผลรันเดียว และไม่ถือว่า NOT RUN ใน session ใหม่ลบล้างประวัติรอบเก่า

สี่หัวข้อหลักของ Test Cases ปัจจุบันเป็นคู่มือกดหน้าเว็บด้วยบัญชี CSV และชื่อเมนูจาก frontend source; รายละเอียด API/DB/ไฟล์อยู่ใน [คู่มือจุดตรวจเสริม](TEST-CASES-TECHNICAL-CHECKS.md) การเรียบเรียงครั้งนี้ไม่ได้เปิด browser execute ใหม่ และผลย้อนหลังไม่รับรองลำดับกด/บัญชี/รหัสผ่านสำเนาฉบับนี้โดยอัตโนมัติ

## 2.1 ข้อมูลรอบทดสอบและหลักฐาน

| รอบ | Scope / สภาพแวดล้อม | Commit ที่หลักฐานระบุ | หลักฐาน |
|---|---|---|---|
| D04 — 4 ต.ค. 2026 | Docker; Playwright/API; SQLite functional และ PostgreSQL smoke แยก | `67dfab6` + working tree | [หลักฐาน Docker](DOCKER-TEST-EVIDENCE-2026-10-04.md) |
| S08 — 8 ต.ค. 2026 | 48 TC; Chrome headless 154.0.8037.98, macOS, Python 3.14.5, Selenium 4.50.0, pytest 9.1.1; SQLite/mock | `009d772fb0a3233cd353e7c56917e764cb682c92` + working tree | [รายงาน](../../tests/selenium/artifacts/20261008-023513-332743/report.md), [JSON](../../tests/selenium/artifacts/20261008-023513-332743/results.json) |
| N08 — notification retest | TC-040/043 หลังแก้ frontend notification proxy | `c6e941ebc0794323ca24a82405efcf1b059aee93` + working tree | [รายงาน](../../tests/selenium/artifacts/20261008-041822-000844/report.md), [JSON](../../tests/selenium/artifacts/20261008-041822-000844/results.json) |
| A08 — assignment subset | 18 TC ของ Narongsak; Chrome/SQLite/mock | `c6e941ebc0794323ca24a82405efcf1b059aee93` + working tree | [รายงาน](../../tests/selenium/artifacts/20261008-042008-398982/report.md), [JSON](../../tests/selenium/artifacts/20261008-042008-398982/results.json) |
| U14 — 14 ต.ค. 2026 | 18 TC; UI จริง Chrome headed 155.0.8059.41; macOS 27.0.1; SQLite/mock | `7ff6c6750f0982ca4a34834daf5dee5ff223e976` + working tree | [UI report](../../tests/selenium/reports/20261014-102745-778362/UI-TEST-EXECUTION.md), [JSON](../../tests/selenium/reports/20261014-102745-778362/ui-results.json) |
| U16 — 16 ต.ค. 2026 | TC-038; Chrome headed 155.0.8059.82; SQLite/mock | `f435e68deb29a5c6531012e877c7b8f7e9be9209` + working tree | [UI report](../../tests/selenium/reports/20261016-094537-437659/UI-TEST-EXECUTION.md), [JSON](../../tests/selenium/reports/20261016-094537-437659/ui-results.json) |

ผู้รันอัตโนมัติย้อนหลัง: Codex ตามรายงานเดิม ชื่อ Narongsak/Sommai Kitikorn/Natthaporn ใน Test Cases เป็นการจัดสรรงาน ไม่ใช่หลักฐานว่ารันด้วยตนเอง ผู้รับรองผลยังไม่ระบุ

`generated_at` ใน JSON ของ S08 คือ `2026-10-08T02:39:41.704974+00:00`, U14 คือ `2026-10-14T10:31:38.712029+00:00`, U16 คือ `2026-10-16T09:46:09.178357+00:00` ใช้ UTC ของ metadata เมื่อเทียบลำดับ ไม่เรียงจากชื่อ directory อย่างเดียว: พบ directory `20261008-092316` ที่ JSON ระบุเวลา `02:28:58 UTC` และผล 31 PASS/17 FAIL ซึ่งเป็นคนละ session ไม่ใช่ผลล่าสุดของ S08 และห้ามนำไปรวมกัน ต้องตรวจ logs ก่อนใช้แก้ chronology

ไฟล์ `artifacts/` บางส่วนไม่ได้ติดตาม Git จึงอาจไม่มีใน checkout อื่น ส่วนผล UI ที่มี versioned reports อ้าง path ใต้ `reports/` โดยตรง ควรแนบ JSON/log/screenshot ของรอบที่จะส่งรับรองให้ครบ ไม่มีการแก้ raw evidence ในงานทบทวนนี้

## 2.2 สรุปผลแยกตามรอบ

| รอบ | Planned/ขอบเขต | PASS | FAIL | BLOCKED | SKIPPED/ข้าม | NOT RUN/ไม่อยู่ในรอบ | Executed | Pass rate ของ Executed |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| D04 | 48 | 17 | 0 | ไม่แยกในหลักฐานเดิม | 31 ข้าม | 0 ตามรายงานเดิม | 17 | 100% |
| S08 | 48 | 44 | 4 | 0 | 0 | 0 | 48 | 91.67% |
| N08 | 2 ที่เลือก | 2 | 0 | 0 | 0 | อีก 46 ไม่อยู่ในรอบ | 2 | 100% |
| A08 | 18 ที่เลือก | 18 | 0 | 0 | 0 | อีก 30 ไม่อยู่ในรอบ | 18 | 100% |
| U14 | 18 | 18 | 0 | 0 | 0 | 0 ใน subset; อีก 30 นอก scope | 18 | 100% |
| U16 | 18 | 1 | 0 | 0 | 0 | 17 ใน subset; อีก 30 นอก scope | 1 | 100% |
| เงื่อนไขฉบับทบทวน 16 ต.ค. | 48 | 0 | 0 | 0 | 0 | 48 ยังไม่ได้รันครบฉบับนี้ | 0 | N/A |

D04 execution coverage = 17/48 = 35.42%; S08 = 48/48 = 100%; U14 UI coverage = 18/18 = 100% ของ subset; U16 UI coverage = 1/18 = 5.56% ของ subset ตัวเลข 100% ของ subset ไม่ใช่ coverage ของทั้ง 48 หรือทุก subcase ที่เพิ่มภายหลัง

### 2.2.1 ผล S08 ตามกลุ่มฟังก์ชัน

| กลุ่ม | TC | Executed | PASS | FAIL |
|---|---:|---:|---:|---:|
| บัญชีและโปรไฟล์ | 7 | 7 | 7 | 0 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | 6 | 6 | 6 | 0 |
| ค้นหา รายละเอียด และคำแนะนำ | 7 | 7 | 6 | 1 |
| ส่งผลงานและตรวจข้อมูล | 7 | 7 | 7 | 0 |
| ผลงานของฉัน การแก้ไข และไฟล์ | 8 | 8 | 8 | 0 |
| คิวและผลการตรวจ | 6 | 6 | 5 | 1 |
| Favorite และการแจ้งเตือน | 2 | 2 | 1 | 1 |
| AI | 3 | 3 | 2 | 1 |
| E2E ข้ามบทบาท | 2 | 2 | 2 | 0 |
| รวม | 48 | 48 | 44 | 4 |

### 2.2.2 Quality gates ที่มีหลักฐาน

ผล Docker D04: backend pytest **40/40**, frontend Node tests **32/32**, Playwright **10/10**, TypeScript และ production build ผ่าน; ESLint **ไม่ผ่าน 16 errors / 8 warnings** ตาม [หลักฐาน D04](DOCKER-TEST-EVIDENCE-2026-10-04.md) จำนวน unit tests เหล่านี้ไม่ใช่จำนวน TC ใน specification และไม่ใช้บวกเพิ่มกับ 48

หลังแก้ notification รายงาน S08 ระบุ lint เฉพาะสองไฟล์ที่เปลี่ยนผ่าน แต่ typecheck ปกติติด generated `.next/types`; source-only check ผ่าน ข้อมูลนี้ไม่เท่ากับ frontend quality gates ทั้งโครงการผ่าน ส่วน quality gates ของ commit `343fb57` และเงื่อนไขฉบับทบทวน **ไม่ได้รันใหม่ในงานนี้**

## 2.3 ผลรายกรณีโดยไม่รวมข้ามรอบ

ชื่อกรณีในตารางใช้ชื่อฉบับทบทวนเพื่อค้นหาด้วย TC ID; ผลย้อนหลังรับรองเฉพาะ assertions ของสคริปต์รอบเดิม ไม่รับรองข้อมูลเตรียมเพิ่มทุกข้อ

S08 = baseline 48 TC; U14 = session UI subset 18 TC; U16 = session ล่าสุดที่ตรวจพบในหลักฐาน UI เครื่องหมาย “นอก scope” ไม่ใช่ FAIL/NOT RUN ของ subset 18 ข้อ แต่หมายถึงไม่ได้อยู่ในชุดนั้น ทุกแถวของฉบับ specification ปรับปรุงยังเป็น NOT RUN จนกว่าจะตรวจ assertions ที่เพิ่มครบ

| TC | FR | ชื่อกรณี | S08 | U14 | U16 | หมายเหตุผล S08 |
|---|---|---|---|---|---|---|
| TC-001 | FR-001 | สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-002 | FR-001 | ปฏิเสธการสมัครสมาชิกด้วยอีเมล 674259009@webmail.npru.ac.th ที่มีอยู่แล้วโดยไม่สร้างผู้ใช้ซ้ำ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-003 | FR-002 | เข้าสู่ระบบด้วยบัญชีนักศึกษา 674259009@webmail.npru.ac.th และตรวจข้อมูลผู้ใช้กับ session หลังเข้าสู่ระบบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-004 | FR-002 | ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-005 | FR-003 | แก้ชื่อและภาควิชาของ 674259009@webmail.npru.ac.th พร้อมเปลี่ยนรหัสผ่านและตรวจการเข้าสู่ระบบด้วยรหัสใหม่ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-006 | FR-003 | ปฏิเสธ token ปลอม บัญชี 674259013@webmail.npru.ac.th ที่ปิดใช้งาน และการแก้อีเมลให้ซ้ำ 674259009@webmail.npru.ac.th | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-007 | FR-004 | ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-008 | FR-005 | ผู้ดูแลระบบ admin@uniresearch.ac.th สร้าง อ่าน แก้ไข และลบบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บและ API | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-009 | FR-005 | ปฏิเสธการอ่าน สร้าง แก้ไข และลบผู้ใช้ผ่าน API เมื่อใช้สิทธิ์นักศึกษา 674259009@webmail.npru.ac.th | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-010 | FR-006 | ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-011 | FR-006 | ปฏิเสธการสร้างหมวดหมู่ Denied C3 เมื่อผู้ส่งคำขอเป็นนักศึกษา 674259009@webmail.npru.ac.th | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-012 | FR-007 | ผู้ดูแลระบบแทนรายการภาควิชาและประเภทงานด้วย New Department กับ New Type พร้อมตัดช่องว่าง | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-013 | FR-007 | นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-014 | FR-008 | ตรวจสิทธิ์การค้นหางานที่เผยแพร่และรอตรวจแยกตามผู้เยี่ยมชม นักศึกษา ที่ปรึกษา และผู้ดูแลระบบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-015 | FR-008 | ค้นคำว่า ranktitle rankabstract แบบจับคู่คำใดคำหนึ่งและตรวจลำดับกับการบันทึกประวัติค้นหา | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-016 | FR-009 | คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-017 | FR-010 | หน้าแรกจัดงานล่าสุดและยอดนิยมถูกลำดับพร้อมสถิติรวมตรงกับข้อมูลผู้ใช้และผลงานทั้งหมด | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-018 | FR-011 | เปิดรายละเอียดงานเลข 1 แล้วเพิ่มยอดดูและแนะนำงานที่เกี่ยวข้องโดยไม่รวมงานรอตรวจ | FAIL | นอก scope | นอก scope | 500 recommendations / MissingGreenlet |
| TC-019 | FR-011 | แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-020 | FR-012 | จัดอันดับคำแนะนำส่วนบุคคลจากความนิยมและรายการบันทึกของ 674259009@webmail.npru.ac.th โดยคืนเฉพาะงานที่เผยแพร่ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-021 | FR-013 | แสดงรายชื่อนักศึกษาและที่ปรึกษาที่เปิดใช้งานสำหรับเลือกผู้เกี่ยวข้องในการส่งงาน | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-022 | FR-014 | นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-023 | FR-014 | ปฏิเสธการส่งผลงานจากผู้ไม่เข้าสู่ระบบและบัญชีผู้เยี่ยมชม g1@example.org | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-024 | FR-015 | ปฏิเสธรายการผู้เขียนและที่ปรึกษาที่รูปแบบผิด รหัสไม่มีจริง บทบาทผิด หรือหมวดหมู่ไม่พบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-025 | FR-015 | ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-026 | FR-016 | อัปโหลดภาพปกและเอกสาร PDF ที่ขนาดต่ำกว่า เท่ากับ และเกินขีดจำกัดหนึ่งไบต์ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-027 | FR-016 | ปฏิเสธไฟล์เอกสารชนิดหรือเนื้อหาผิดและตรวจไม่ให้ไฟล์ใหม่ค้างหรือไฟล์เดิมสูญหายเมื่อแก้ไขล้มเหลว | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-028 | FR-017 | รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-029 | FR-018 | เจ้าของแก้ผลงานที่เผยแพร่เป็น การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ) แล้วสถานะกลับไปรอตรวจสอบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-030 | FR-018 | ปฏิเสธการแก้ผลงานเลข 3 ของ 674259003@webmail.npru.ac.th โดยนักศึกษาอื่นและที่ปรึกษาที่ไม่ได้เป็นเจ้าของหรือผู้เขียน | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-031 | FR-019 | ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-032 | FR-020 | เจ้าของลบ การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) แล้วลบข้อมูลสัมพันธ์และไฟล์หลักของงานพร้อมตรวจไฟล์เวอร์ชันเก่าตกค้าง | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-033 | FR-020 | ปฏิเสธการลบงานเลข 3 ของ 674259003@webmail.npru.ac.th เมื่อผู้ร้องขอเป็น 674259009@webmail.npru.ac.th ที่ไม่มีส่วนเกี่ยวข้อง | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-034 | FR-021 | นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-035 | FR-021 | ปฏิเสธการขอดาวน์โหลดเมื่อไม่มี token งานไม่มีไฟล์ หรือใช้รหัสงานที่ไม่มีในระบบ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-036 | FR-022 | คิวรอตรวจแสดงงานตามการมอบหมายของที่ปรึกษาและปฏิเสธนักศึกษาพร้อมตรวจความต่างระหว่าง UI กับ API | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-037 | FR-023 | ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-038 | FR-024 | ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review | PASS | PASS | PASS | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-039 | FR-024 | ปฏิเสธการตรวจงานเมื่อที่ปรึกษาไม่ได้รับมอบหมาย งานไม่รอตรวจ หรือส่งผลตรวจนอกค่าที่รองรับ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-040 | FR-025 | อนุมัติ ปฏิเสธ และส่งงานกลับแก้ไขพร้อมบันทึกคะแนน ความคิดเห็น และแจ้งผู้ส่งกับผู้เขียนร่วม | FAIL | นอก scope | นอก scope | DB approval/notification ผ่าน; dropdown UI ไม่แสดง |
| TC-041 | FR-026 | ผู้ดูแลระบบเปลี่ยนที่ปรึกษาของงานเลข 2 จาก udsanee@webmail.npru.ac.th เป็น wuttha@webmail.npru.ac.th และนักศึกษาเปลี่ยนไม่ได้ | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-042 | FR-027 | บันทึกและยกเลิกงานเลข 1 ในรายการโปรดของ 674259009@webmail.npru.ac.th พร้อมตรวจหน้ารายการบันทึก | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-043 | FR-028 | อ่านแจ้งเตือนและทำเครื่องหมายอ่านทีละรายการหรือทั้งหมดเฉพาะของ 674259009@webmail.npru.ac.th โดยไม่แก้ของ 674259003@webmail.npru.ac.th | FAIL | PASS | NOT RUN | ownership/read API ผ่าน; dropdown UI ไม่แสดง |
| TC-044 | FR-029 | เรียก AI ช่วยเขียนทั้งสี่บริการด้วยข้อมูลจริงในชุดทดสอบและปฏิเสธคำขอไม่มี token หรือชนิดข้อมูลผิด | PASS | นอก scope | นอก scope | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-045 | FR-030 | ตรวจสิทธิ์ AI สรุปแดชบอร์ดและการแชตสาธารณะค้นงานด้วยคำว่า “การ” เมื่อระบบใช้ text-search fallback | FAIL | นอก scope | นอก scope | insight/RBAC ผ่าน; chat fallback 500 |
| TC-046 | FR-031 | ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-047 | FR-032 | นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่ | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |
| TC-048 | FR-032 | ผู้ดูแลระบบเพิ่ม E2E Selenium Category และบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บพร้อมปฏิเสธ API จัดการของนักศึกษา | PASS | PASS | NOT RUN | assertions ของสคริปต์รอบ S08 ผ่าน |

ผล/ขั้นตอน/ภาพราย TC เปิดจากรายงานและ JSON ของแต่ละรอบในข้อ 2.1 ตัวอย่าง TC-038 ล่าสุดมี 17 UI steps และผล PASS ใช้เวลาราย TC 31.49 วินาที; เวลา UI steps/ราย TC ไม่ใช่ระยะเวลารวมเปิดบริการของ session สำหรับ TC-040/043 ผล N08 เป็น PASS ทั้งสองกรณีหลังแก้ notification แต่ไม่เปลี่ยน FAIL ของ S08 ที่บันทึกไว้

### 2.3.1 ประวัติอื่นที่เกี่ยวข้อง

- [รายงาน Selenium 8 ต.ค.](SELENIUM-TEST-REPORT-2026-10-08.md) มีรายละเอียด S08/N08/A08 และข้อบกพร่องเดิม
- [Brave Docker 8 ต.ค.](BRAVE-TEST-REPORT-2026-10-08.md) ผ่าน 16 UI TC จากชุดที่เลือกในขณะนั้น; อีก 2 เคสถูกจัดเป็น API-only ตามสคริปต์รุ่นเก่า ปัจจุบัน TC-013/046 มี UI แล้ว จึงไม่ใช้เลข 16 เป็น scope ปัจจุบัน
- [Category report 14 ต.ค.](NARONGSAK-SELENIUM-CATEGORY-REPORT-2026-10-14.md) เดิมรวมผลล่าสุดราย TC จากหลาย session; U14 ที่แยกในรายงานฉบับนี้เป็นหลักฐาน 18 PASS ใน session เดียวที่เกิดภายหลัง
- ผล focused U16 เป็นผลเฉพาะ TC-038; ไม่ได้รัน TC-018/045 และไม่ได้ยืนยันว่าข้อผิดพลาดเดิมของสองกรณีนั้นหายแล้ว

## 2.4 ข้อบกพร่อง การแก้ และประเด็นสังเกต

รหัส AUD ด้านล่างเป็นรหัสติดตามภายในเอกสารฉบับนี้ ไม่ใช่ issue ID จากระบบภายนอก ระดับผลกระทบเป็นการประเมินเพื่อจัดลำดับ ไม่ใช่ severity ที่เจ้าของระบบลงนามแล้ว

| รหัส | TC / สิ่งที่พบ | หลักฐาน/สาเหตุ | สถานะที่ยืนยันได้ | สิ่งที่ต้องทำก่อนปิด |
|---|---|---|---|---|
| AUD-01 | TC-018 recommendations 500 | S08; เข้าถึง relation ของ current work ที่ยังไม่โหลด ทำให้ MissingGreenlet | พบ FAIL ใน baseline; ยังไม่มี retest ผ่านในรอบที่อ้าง | แก้ eager loading แล้วรัน detail/recommendations ทั้ง API/UI และ PostgreSQL |
| AUD-02 | TC-040/043 dropdown ไม่แสดง notification | S08 API/DB มีข้อมูล; browser client ใช้ URL ไม่ถูก | N08 ผ่าน 2/2 หลังแก้ same-origin proxy; U14 TC-043 ผ่าน | เก็บ fix commit/dirty diff และ regression notification ทั้งสอง TC ของ revision ที่รับรอง |
| AUD-03 | TC-045 public chat fallback 500 | S08; category relationship ไม่โหลดก่อนสร้าง metadata | พบ FAIL; ไม่มีหลักฐาน retest ผ่านของ TC-045 ในรอบอ้าง | แก้ category loading และทดสอบ fallback/vector branch แยก |
| AUD-04 | frontend lint ไม่ผ่าน | D04: 16 errors/8 warnings | เป็นผลเก่า; ยังไม่ทราบ gate ปัจจุบัน | รัน lint/typecheck/tests/build กับ commit ที่จะรับรอง |

### 2.4.1 ข้อสงสัยจากโค้ดและนโยบายที่ยังไม่ใช่ FAIL ใหม่

| ประเด็น | สิ่งที่โค้ด/หลักฐานบ่งชี้ | วิธีตรวจและผู้ตัดสิน |
|---|---|---|
| Public pending/static | รายละเอียด pending และไฟล์ static เปิดตรงได้; static ไม่เพิ่ม download_count | TC-018/034 และเจ้าของนโยบายการเผยแพร่ |
| Admin/queue visibility | admin layout ตรวจ session; advisor UI queue ใช้ search ที่กว้างกว่า pending API | TC-036/048 ตรวจ UI/API แล้วให้เจ้าของระบบตัดสิน |
| Update rollback กับไฟล์เดิม | service อาจลบ cover เดิมก่อน document ใหม่ตรวจผ่าน; DB rollback ไม่คืน bytes อัตโนมัติ | TC-027 เพิ่ม snapshot ของไฟล์เก่า; ยังไม่ได้ reproduce ในการทบทวนเอกสาร |
| Revision cleanup | ลบแถว file_revisions แต่ service ลบเฉพาะไฟล์ cover/document ปัจจุบัน | TC-032 ตรวจ orphan files; ต้องกำหนด retention/cleanup policy |
| Schema/validation | suggest-titles/keywords รับ {} ได้; score review ไม่จำกัด 0–100 ใน schema | แก้ expectation ตาม schema และกำหนด requirement เพิ่มหากต้องการบังคับ |

ปัญหา locator, intermediate redirect และการเปรียบเทียบ comma spacing ใน category report เป็นการแก้ชุดทดสอบตามหลักฐานเดิม ต้องแยกจาก defect ระบบ การรัน BLOCKED เพราะ sandbox เปิด port ไม่ได้เป็น environment limitation ไม่ใช่ข้อบกพร่องแอป

## 2.5 Coverage และข้อจำกัดของหลักฐาน

แผนมี TC เชื่อมครบ **32/32 FR**; S08 execute ครบ 48 TC และแตะทุก FR แต่ FR-011, FR-025, FR-028, FR-030 มี TC FAIL ใน baseline จึงไม่เรียกว่าทุก FR ผ่าน ผล N08 ยืนยันการแก้ notification เฉพาะ working tree นั้น ส่วน U14 ทดสอบ 18 TC ครอบคลุม **17 FR** โดย FR-024 มี TC-038 และ FR-032 มี TC-047/048; subset ไม่ครอบคลุม FR ทั้งหมด

SQLite functional evidence ไม่รับรอง PostgreSQL FK/transaction semantics, pgvector operator หรือ vector retrieval จริง; deterministic mock ไม่รับรองคุณภาพ/latency/cost ของ live AI หนึ่ง browser/version ไม่รับรองทุก browser/mobile และ test coverage เป็น case-level ไม่ใช่ line/branch coverage ของ source

ฉบับทบทวนเพิ่ม boundary L−1, rejected/needs_revision outcomes, การอ่านทั้งหมดที่มีแจ้งเตือนของตนมากกว่าหนึ่งรายการ, file rollback และ checks อื่นใน TC เดิม จึงห้ามใช้ PASS เก่ารับรอง assertions ใหม่โดยไม่มี mapping และผลรันใหม่

## 2.6 การประเมิน Exit Criteria

| เกณฑ์ฉบับทบทวน | ผลประเมิน | เหตุผล |
|---|---|---|
| Execute 48/48 พร้อม subcase ฉบับนี้ | ยังไม่ผ่าน | มี S08 48 TC ของ specification เดิม; ฉบับปรับปรุงยัง NOT RUN |
| Priority สูง 31 TC ผ่านและจัดการ defect | ยังยืนยันไม่ได้ | baseline มี FAIL และยังไม่มี regression ครบฉบับนี้ |
| ทุก FR มีแผน/หลักฐาน | แผนครบ; หลักฐานรับรองยังไม่ครบ | 32/32 มีแผน แต่ TC-018/045 และเงื่อนไขเพิ่มยังไม่ยืนยันผ่าน |
| Quality gates ของ revision ที่รับรอง | ยังไม่ยืนยัน | มีผลเก่าบาง gate ไม่ผ่าน; ไม่ได้รัน gates ปัจจุบัน |
| PostgreSQL/pgvector integration | ยังไม่ครบ | มีเพียง smoke D04; Selenium เป็น SQLite |
| ผู้ทบทวน/ผู้อนุมัติรับรอง | ยังไม่ดำเนินการ | ไม่มีการลงนามในหลักฐาน |

## 2.7 ข้อสรุปและงานติดตาม

**ผลตัดสิน: ยังไม่รับรองความครบของระบบทั้ง 48 TC ตามฉบับปรับปรุง** ผล U14 ผ่าน 18/18 เป็นหลักฐานที่ใช้ทบทวน subset ได้ ส่วน U16 ยืนยัน TC-038 เฉพาะ session ล่าสุด การเพิ่มความละเอียดเอกสารไม่ใช่การปิดข้อบกพร่อง

1. จัด run manifest และกำหนดผู้ทบทวน/ผู้อนุมัติ scope/นโยบาย pending URL, static files และ queue
2. รันทดสอบ TC-018/045 เพื่อยืนยันสถานะปัจจุบัน พร้อมแก้และ retest เมื่อยังผิด
3. รันเงื่อนไขฉบับปรับปรุง โดยเน้นไฟล์ rollback, revision cleanup, boundary, ผลตรวจทั้งสามสถานะ และ notification isolation
4. รันครบ 48 unique TC, PostgreSQL/pgvector integration และ backend/frontend gates บน revision เดียวกัน
5. แนบ defect disposition/หลักฐาน retest แล้วประเมิน exit criteria และลงนาม

## 2.8 การทบทวนและลงนาม

| บทบาท | ชื่อ/สถานะ | วิธีรับรอง/วันที่ |
|---|---|---|
| ผู้จัดทำฉบับทบทวน | Codex | ตรวจเอกสารและหลักฐานที่มี 16 ต.ค. 2026; ไม่ได้ execute ใหม่ |
| ผู้รันระบบจริงของรอบที่จะรับรอง | รอระบุ | ต้องแนบ run ID/commit/วันเวลา |
| Test Manager / ผู้ทบทวน | รอระบุ | ยังไม่มีการรับรอง |
| Developer | รอระบุ | รอ fix/retest disposition |
| Approver | รอระบุ | ยังไม่มีการรับรอง/รับความเสี่ยง |
