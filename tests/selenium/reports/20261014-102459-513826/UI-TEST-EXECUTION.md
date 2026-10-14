# รายงานการรันทดสอบ UI — Narongsak

เวลารัน UTC: 2026-10-14T10:26:05.705884+00:00
โหมด: **headed**; Browser: chrome; commit: `7ff6c6750f0982ca4a34834daf5dee5ff223e976` (รวม working tree)

ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock

- Test Cases ในขอบเขต: 18
- UI-automatable: 18
- รัน browser tests: 18
- PASS: 3; FAIL: 15; BLOCKED: 0
- API-only Test Cases: 0
- UI automation coverage ใน session นี้: 100.0%

Coverage หมายถึงจำนวนเคสที่รันขั้นตอน UI จริง ไม่ใช่การยืนยันว่าทุก invariant ตรวจได้ผ่าน UI อย่างเดียว ความสัมพันธ์ในฐานข้อมูล การเก็บ revision สิทธิ์ API และ counters มี assertions เสริมแยกจาก browser evidence ทั้งสี่ AI endpoints มี UI จึงไม่มี API-only case ใน 18 เคสนี้

| TC ID | Category | UI Tested | Status | Evidence |
|---|---|---|---|---|
| TC-001 | AUTH | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/auth/TC-001/20261014-102459-513826/001-register.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/auth/TC-001/20261014-102459-513826/002-button-normalize-space.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/auth/TC-001/20261014-102459-513826/003-ui.png) / [Screenshot 4](../../../tests/selenium/reports/screenshots/auth/TC-001/20261014-102459-513826/004-final-result.png) |
| TC-004 | AUTH | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/auth/TC-004/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/auth/TC-004/20261014-102459-513826/002-button-normalize-space.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/auth/TC-004/20261014-102459-513826/003-toast-error.png) / [Screenshot 4](../../../tests/selenium/reports/screenshots/auth/TC-004/20261014-102459-513826/004-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-007 | AUTH | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/auth/TC-007/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/auth/TC-007/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/auth/TC-007/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-010 | CATEGORY | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/category/TC-010/20261014-102459-513826/001-research.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/category/TC-010/20261014-102459-513826/002-C1-Selenium.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/category/TC-010/20261014-102459-513826/003-C2-Selenium.png) / [Screenshot 4](../../../tests/selenium/reports/screenshots/category/TC-010/20261014-102459-513826/004-login.png) / [Screenshot 5](../../../tests/selenium/reports/screenshots/category/TC-010/20261014-102459-513826/005-A1.png) / [Screenshot 6](../../../tests/selenium/reports/screenshots/category/TC-010/20261014-102459-513826/006-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-013 | USER | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/user/TC-013/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/user/TC-013/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/user/TC-013/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-016 | RECOMMENDATION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/recommendation/TC-016/20261014-102459-513826/001-research.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/recommendation/TC-016/20261014-102459-513826/002-final-result.png) |
| TC-019 | SUBMISSION | Yes | PASS | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-019/20261014-102459-513826/001-research-999999999.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/submission/TC-019/20261014-102459-513826/002-ui.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/submission/TC-019/20261014-102459-513826/003-final-result.png) |
| TC-022 | SUBMISSION | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-022/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/submission/TC-022/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/submission/TC-022/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-025 | SUBMISSION | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-025/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/submission/TC-025/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/submission/TC-025/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-028 | SUBMISSION | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-028/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/submission/TC-028/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/submission/TC-028/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-031 | SUBMISSION | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-031/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/submission/TC-031/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/submission/TC-031/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-034 | SUBMISSION | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/submission/TC-034/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/submission/TC-034/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/submission/TC-034/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-037 | REVIEW | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/review/TC-037/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/review/TC-037/20261014-102459-513826/002-D1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/review/TC-037/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-038 | REVIEW | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/review/TC-038/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/review/TC-038/20261014-102459-513826/002-D1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/review/TC-038/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-043 | NOTIFICATION | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/notification/TC-043/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/notification/TC-043/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/notification/TC-043/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-046 | AI | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/ai/TC-046/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/ai/TC-046/20261014-102459-513826/002-D1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/ai/TC-046/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-047 | E2E | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/e2e/TC-047/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/e2e/TC-047/20261014-102459-513826/002-S1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/e2e/TC-047/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |
| TC-048 | E2E | Yes | FAIL | [Screenshot 1](../../../tests/selenium/reports/screenshots/e2e/TC-048/20261014-102459-513826/001-login.png) / [Screenshot 2](../../../tests/selenium/reports/screenshots/e2e/TC-048/20261014-102459-513826/002-A1.png) / [Screenshot 3](../../../tests/selenium/reports/screenshots/e2e/TC-048/20261014-102459-513826/003-failure-call.png) / [error log](../../../tests/selenium/artifacts/20261014-102459-513826/errors.log) |

## ขั้นตอนและผลที่ตรวจ

[Structured execution report (JSON)](../../../tests/selenium/reports/20261014-102459-513826/ui-results.json)

### TC-001 — สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin

Browser: chrome 155.0.8059.41; ระยะเวลา 4.809 วินาที
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

Browser: chrome 155.0.8059.41; ระยะเวลา 2.969 วินาที
ผลที่คาดหวัง: แสดงข้อผิดพลาดและไม่สร้าง session
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. เปิดหน้า: /login — PASS
2. กรอกช่อง: email — PASS
3. กรอกช่อง: password — PASS
4. คลิก: //button[normalize-space(.)='เข้าสู่ระบบ'] — PASS
5. อ่านข้อความปฏิเสธ: toast-error — PASS

ข้อผิดพลาด: Incorrect-password UI error mismatch: อีเมลหรือรหัสผ่านไม่ถูกต้อง [bad_request] assert 'Incorrect email or password' in 'อีเมลหรือรหัสผ่านไม่ถูกต้อง [bad_request]'

### TC-007 — ล็อกอินแล้วออกจากระบบ

Browser: chrome 155.0.8059.41; ระยะเวลา 3.001 วินาที
ผลที่คาดหวัง: ล็อกอินสำเร็จ ออกจากระบบ และหน้าที่ต้องล็อกอินปฏิเสธการเข้าถึง
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 789)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x00000001047a0a84 chromedriver + 3508868 1   chromedriver                        0x000000010448cf10 chromedriver + 282384 2   chromedriver                        0x00000001044db770 chromedriver + 604016 3   chromedriver                        0x00000001044da024 chromedriver + 598052 4   chromedriver                        0x00000001044d8108 chromedriver + 590088 5   chromedriver                        0x00000001044d74dc chromedriver + 586972 6   chromedriver                        0x00000001044ccbc0 chromedriver + 543680 7   chromedriver                        0x00000001044cc654 chromedriver + 542292 8   chromedriver                        0x0000000104515c30 chromedriver + 842800 9   chromedriver                        0x00000001044cb42c chromedriver + 537644 10  chromedriver                        0x000000010476ee68 chromedriver + 3305064 11  chromedriver                        0x0000000104772168 chromedriver + 3318120 12  chromedriver                        0x000000010475842c chromedriver + 3212332 13  chromedriver                        0x00000001047729f8 chromedriver + 3320312 14  chromedriver                        0x000000010474bf00 chromedriver + 3161856 15  chromedriver                        0x000000010478efb4 chromedriver + 3436468 16  chromedriver                        0x000000010478f114 chromedriver + 3436820 17  chromedriver                        0x00000001047a0744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-010 — อ่านสาธารณะและเพิ่มโดย admin

Browser: chrome 155.0.8059.41; ระยะเวลา 4.418 วินาที
ผลที่คาดหวัง: อ่านหมวดหมู่สาธารณะได้และ admin เพิ่มหมวดหมู่ผ่าน UI สำเร็จ
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. เปิดหน้า: /research — PASS
2. รอข้อความที่มองเห็น: C1 Selenium — PASS
3. รอข้อความที่มองเห็น: C2 Selenium — PASS
4. ล็อกอินผ่านฟอร์ม: A1 — FAIL
5. เปิดหน้า: /login — PASS
6. กรอกช่อง: email — PASS
7. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 783)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000105154a84 chromedriver + 3508868 1   chromedriver                        0x0000000104e40f10 chromedriver + 282384 2   chromedriver                        0x0000000104e8f770 chromedriver + 604016 3   chromedriver                        0x0000000104e8e024 chromedriver + 598052 4   chromedriver                        0x0000000104e8c108 chromedriver + 590088 5   chromedriver                        0x0000000104e8b4dc chromedriver + 586972 6   chromedriver                        0x0000000104e80bc0 chromedriver + 543680 7   chromedriver                        0x0000000104e80654 chromedriver + 542292 8   chromedriver                        0x0000000104ec9c30 chromedriver + 842800 9   chromedriver                        0x0000000104e7f42c chromedriver + 537644 10  chromedriver                        0x0000000105122e68 chromedriver + 3305064 11  chromedriver                        0x0000000105126168 chromedriver + 3318120 12  chromedriver                        0x000000010510c42c chromedriver + 3212332 13  chromedriver                        0x00000001051269f8 chromedriver + 3320312 14  chromedriver                        0x00000001050fff00 chromedriver + 3161856 15  chromedriver                        0x0000000105142fb4 chromedriver + 3436468 16  chromedriver                        0x0000000105143114 chromedriver + 3436820 17  chromedriver                        0x0000000105154744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-013 — student เปลี่ยนตัวเลือก

Browser: chrome 155.0.8059.41; ระยะเวลา 3.063 วินาที
ผลที่คาดหวัง: student บันทึกตัวเลือกส่วนกลางไม่ได้ ข้อมูลเดิมไม่เปลี่ยน
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 782)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x00000001005eca84 chromedriver + 3508868 1   chromedriver                        0x00000001002d8f10 chromedriver + 282384 2   chromedriver                        0x0000000100327770 chromedriver + 604016 3   chromedriver                        0x0000000100326024 chromedriver + 598052 4   chromedriver                        0x0000000100324108 chromedriver + 590088 5   chromedriver                        0x00000001003234dc chromedriver + 586972 6   chromedriver                        0x0000000100318bc0 chromedriver + 543680 7   chromedriver                        0x0000000100318654 chromedriver + 542292 8   chromedriver                        0x0000000100361c30 chromedriver + 842800 9   chromedriver                        0x000000010031742c chromedriver + 537644 10  chromedriver                        0x00000001005bae68 chromedriver + 3305064 11  chromedriver                        0x00000001005be168 chromedriver + 3318120 12  chromedriver                        0x00000001005a442c chromedriver + 3212332 13  chromedriver                        0x00000001005be9f8 chromedriver + 3320312 14  chromedriver                        0x0000000100597f00 chromedriver + 3161856 15  chromedriver                        0x00000001005dafb4 chromedriver + 3436468 16  chromedriver                        0x00000001005db114 chromedriver + 3436820 17  chromedriver                        0x00000001005ec744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-016 — คำแนะนำไม่เผยงาน pending

Browser: chrome 155.0.8059.41; ระยะเวลา 1.688 วินาที
ผลที่คาดหวัง: คำแนะนำไม่เผยข้อมูล pending
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research — PASS

### TC-019 — ID ไม่มีอยู่

Browser: chrome 155.0.8059.41; ระยะเวลา 3.764 วินาที
ผลที่คาดหวัง: แสดงไม่พบงานวิจัยและ API ตอบ 404
ผลจริง: ขั้นตอนและ assertions ผ่านทั้งหมด (PASS)

1. เปิดหน้า: /research/999999999 — PASS
2. รอข้อความที่มองเห็น: รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ — PASS

### TC-022 — ส่งงานครบข้อมูลและผู้เกี่ยวข้อง

Browser: chrome 155.0.8059.41; ระยะเวลา 2.975 วินาที
ผลที่คาดหวัง: บันทึกข้อมูล ไฟล์ ผู้เขียน และที่ปรึกษาครบ สถานะ pending
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 782)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000104df8a84 chromedriver + 3508868 1   chromedriver                        0x0000000104ae4f10 chromedriver + 282384 2   chromedriver                        0x0000000104b33770 chromedriver + 604016 3   chromedriver                        0x0000000104b32024 chromedriver + 598052 4   chromedriver                        0x0000000104b30108 chromedriver + 590088 5   chromedriver                        0x0000000104b2f4dc chromedriver + 586972 6   chromedriver                        0x0000000104b24bc0 chromedriver + 543680 7   chromedriver                        0x0000000104b24654 chromedriver + 542292 8   chromedriver                        0x0000000104b6dc30 chromedriver + 842800 9   chromedriver                        0x0000000104b2342c chromedriver + 537644 10  chromedriver                        0x0000000104dc6e68 chromedriver + 3305064 11  chromedriver                        0x0000000104dca168 chromedriver + 3318120 12  chromedriver                        0x0000000104db042c chromedriver + 3212332 13  chromedriver                        0x0000000104dca9f8 chromedriver + 3320312 14  chromedriver                        0x0000000104da3f00 chromedriver + 3161856 15  chromedriver                        0x0000000104de6fb4 chromedriver + 3436468 16  chromedriver                        0x0000000104de7114 chromedriver + 3436820 17  chromedriver                        0x0000000104df8744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-025 — ผู้เขียนคนละ prefix ปี

Browser: chrome 155.0.8059.41; ระยะเวลา 2.907 วินาที
ผลที่คาดหวัง: UI ไม่เสนอผู้เขียนคนละปี และ backend ปฏิเสธด้วย 422
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 782)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x00000001050a4a84 chromedriver + 3508868 1   chromedriver                        0x0000000104d90f10 chromedriver + 282384 2   chromedriver                        0x0000000104ddf770 chromedriver + 604016 3   chromedriver                        0x0000000104dde024 chromedriver + 598052 4   chromedriver                        0x0000000104ddc108 chromedriver + 590088 5   chromedriver                        0x0000000104ddb4dc chromedriver + 586972 6   chromedriver                        0x0000000104dd0bc0 chromedriver + 543680 7   chromedriver                        0x0000000104dd0654 chromedriver + 542292 8   chromedriver                        0x0000000104e19c30 chromedriver + 842800 9   chromedriver                        0x0000000104dcf42c chromedriver + 537644 10  chromedriver                        0x0000000105072e68 chromedriver + 3305064 11  chromedriver                        0x0000000105076168 chromedriver + 3318120 12  chromedriver                        0x000000010505c42c chromedriver + 3212332 13  chromedriver                        0x00000001050769f8 chromedriver + 3320312 14  chromedriver                        0x000000010504ff00 chromedriver + 3161856 15  chromedriver                        0x0000000105092fb4 chromedriver + 3436468 16  chromedriver                        0x0000000105093114 chromedriver + 3436820 17  chromedriver                        0x00000001050a4744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-028 — ผู้ส่ง/author เห็นงานใน /my

Browser: chrome 155.0.8059.41; ระยะเวลา 2.719 วินาที
ผลที่คาดหวัง: เห็นงานที่ส่งและร่วมเขียน ไม่เห็น pending ของผู้อื่น
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 789)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000100488a84 chromedriver + 3508868 1   chromedriver                        0x0000000100174f10 chromedriver + 282384 2   chromedriver                        0x00000001001c3770 chromedriver + 604016 3   chromedriver                        0x00000001001c2024 chromedriver + 598052 4   chromedriver                        0x00000001001c0108 chromedriver + 590088 5   chromedriver                        0x00000001001bf4dc chromedriver + 586972 6   chromedriver                        0x00000001001b4bc0 chromedriver + 543680 7   chromedriver                        0x00000001001b4654 chromedriver + 542292 8   chromedriver                        0x00000001001fdc30 chromedriver + 842800 9   chromedriver                        0x00000001001b342c chromedriver + 537644 10  chromedriver                        0x0000000100456e68 chromedriver + 3305064 11  chromedriver                        0x000000010045a168 chromedriver + 3318120 12  chromedriver                        0x000000010044042c chromedriver + 3212332 13  chromedriver                        0x000000010045a9f8 chromedriver + 3320312 14  chromedriver                        0x0000000100433f00 chromedriver + 3161856 15  chromedriver                        0x0000000100476fb4 chromedriver + 3436468 16  chromedriver                        0x0000000100477114 chromedriver + 3436820 17  chromedriver                        0x0000000100488744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-031 — ส่งเอกสารใหม่หลัง needs_revision

Browser: chrome 155.0.8059.41; ระยะเวลา 2.84 วินาที
ผลที่คาดหวัง: ส่งไฟล์ใหม่สำเร็จ เก็บไฟล์เดิม และกลับเป็น pending
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 788)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000100394a84 chromedriver + 3508868 1   chromedriver                        0x0000000100080f10 chromedriver + 282384 2   chromedriver                        0x00000001000cf770 chromedriver + 604016 3   chromedriver                        0x00000001000ce024 chromedriver + 598052 4   chromedriver                        0x00000001000cc108 chromedriver + 590088 5   chromedriver                        0x00000001000cb4dc chromedriver + 586972 6   chromedriver                        0x00000001000c0bc0 chromedriver + 543680 7   chromedriver                        0x00000001000c0654 chromedriver + 542292 8   chromedriver                        0x0000000100109c30 chromedriver + 842800 9   chromedriver                        0x00000001000bf42c chromedriver + 537644 10  chromedriver                        0x0000000100362e68 chromedriver + 3305064 11  chromedriver                        0x0000000100366168 chromedriver + 3318120 12  chromedriver                        0x000000010034c42c chromedriver + 3212332 13  chromedriver                        0x00000001003669f8 chromedriver + 3320312 14  chromedriver                        0x000000010033ff00 chromedriver + 3161856 15  chromedriver                        0x0000000100382fb4 chromedriver + 3436468 16  chromedriver                        0x0000000100383114 chromedriver + 3436820 17  chromedriver                        0x0000000100394744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-034 — ผู้ใช้ active ดาวน์โหลดงานมีไฟล์

Browser: chrome 155.0.8059.41; ระยะเวลา 2.825 วินาที
ผลที่คาดหวัง: ดาวน์โหลด PDF ผ่าน UI ได้ บันทึกผู้ใช้และนับหนึ่งครั้ง
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 789)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000100c08a84 chromedriver + 3508868 1   chromedriver                        0x00000001008f4f10 chromedriver + 282384 2   chromedriver                        0x0000000100943770 chromedriver + 604016 3   chromedriver                        0x0000000100942024 chromedriver + 598052 4   chromedriver                        0x0000000100940108 chromedriver + 590088 5   chromedriver                        0x000000010093f4dc chromedriver + 586972 6   chromedriver                        0x0000000100934bc0 chromedriver + 543680 7   chromedriver                        0x0000000100934654 chromedriver + 542292 8   chromedriver                        0x000000010097dc30 chromedriver + 842800 9   chromedriver                        0x000000010093342c chromedriver + 537644 10  chromedriver                        0x0000000100bd6e68 chromedriver + 3305064 11  chromedriver                        0x0000000100bda168 chromedriver + 3318120 12  chromedriver                        0x0000000100bc042c chromedriver + 3212332 13  chromedriver                        0x0000000100bda9f8 chromedriver + 3320312 14  chromedriver                        0x0000000100bb3f00 chromedriver + 3161856 15  chromedriver                        0x0000000100bf6fb4 chromedriver + 3436468 16  chromedriver                        0x0000000100bf7114 chromedriver + 3436820 17  chromedriver                        0x0000000100c08744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-037 — ผู้ตรวจเห็นประวัติของตน

Browser: chrome 155.0.8059.41; ระยะเวลา 2.818 วินาที
ผลที่คาดหวัง: ประวัติแสดงเฉพาะงานที่ผู้ตรวจคนนี้ตรวจ
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: D1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 781)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x00000001029dca84 chromedriver + 3508868 1   chromedriver                        0x00000001026c8f10 chromedriver + 282384 2   chromedriver                        0x0000000102717770 chromedriver + 604016 3   chromedriver                        0x0000000102716024 chromedriver + 598052 4   chromedriver                        0x0000000102714108 chromedriver + 590088 5   chromedriver                        0x00000001027134dc chromedriver + 586972 6   chromedriver                        0x0000000102708bc0 chromedriver + 543680 7   chromedriver                        0x0000000102708654 chromedriver + 542292 8   chromedriver                        0x0000000102751c30 chromedriver + 842800 9   chromedriver                        0x000000010270742c chromedriver + 537644 10  chromedriver                        0x00000001029aae68 chromedriver + 3305064 11  chromedriver                        0x00000001029ae168 chromedriver + 3318120 12  chromedriver                        0x000000010299442c chromedriver + 3212332 13  chromedriver                        0x00000001029ae9f8 chromedriver + 3320312 14  chromedriver                        0x0000000102987f00 chromedriver + 3161856 15  chromedriver                        0x00000001029cafb4 chromedriver + 3436468 16  chromedriver                        0x00000001029cb114 chromedriver + 3436820 17  chromedriver                        0x00000001029dc744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-038 — advisor ที่ได้รับมอบหมายอนุมัติ pending

Browser: chrome 155.0.8059.41; ระยะเวลา 2.913 วินาที
ผลที่คาดหวัง: ที่ปรึกษาที่ได้รับมอบหมายอนุมัติและบันทึกผลสำเร็จ
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: D1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 781)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x000000010044ca84 chromedriver + 3508868 1   chromedriver                        0x0000000100138f10 chromedriver + 282384 2   chromedriver                        0x0000000100187770 chromedriver + 604016 3   chromedriver                        0x0000000100186024 chromedriver + 598052 4   chromedriver                        0x0000000100184108 chromedriver + 590088 5   chromedriver                        0x00000001001834dc chromedriver + 586972 6   chromedriver                        0x0000000100178bc0 chromedriver + 543680 7   chromedriver                        0x0000000100178654 chromedriver + 542292 8   chromedriver                        0x00000001001c1c30 chromedriver + 842800 9   chromedriver                        0x000000010017742c chromedriver + 537644 10  chromedriver                        0x000000010041ae68 chromedriver + 3305064 11  chromedriver                        0x000000010041e168 chromedriver + 3318120 12  chromedriver                        0x000000010040442c chromedriver + 3212332 13  chromedriver                        0x000000010041e9f8 chromedriver + 3320312 14  chromedriver                        0x00000001003f7f00 chromedriver + 3161856 15  chromedriver                        0x000000010043afb4 chromedriver + 3436468 16  chromedriver                        0x000000010043b114 chromedriver + 3436820 17  chromedriver                        0x000000010044c744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-043 — อ่านเฉพาะของตนและ mark read

Browser: chrome 155.0.8059.41; ระยะเวลา 3.094 วินาที
ผลที่คาดหวัง: เห็นและทำเครื่องหมายอ่านเฉพาะการแจ้งเตือนของตน
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 782)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000102724a84 chromedriver + 3508868 1   chromedriver                        0x0000000102410f10 chromedriver + 282384 2   chromedriver                        0x000000010245f770 chromedriver + 604016 3   chromedriver                        0x000000010245e024 chromedriver + 598052 4   chromedriver                        0x000000010245c108 chromedriver + 590088 5   chromedriver                        0x000000010245b4dc chromedriver + 586972 6   chromedriver                        0x0000000102450bc0 chromedriver + 543680 7   chromedriver                        0x0000000102450654 chromedriver + 542292 8   chromedriver                        0x0000000102499c30 chromedriver + 842800 9   chromedriver                        0x000000010244f42c chromedriver + 537644 10  chromedriver                        0x00000001026f2e68 chromedriver + 3305064 11  chromedriver                        0x00000001026f6168 chromedriver + 3318120 12  chromedriver                        0x00000001026dc42c chromedriver + 3212332 13  chromedriver                        0x00000001026f69f8 chromedriver + 3320312 14  chromedriver                        0x00000001026cff00 chromedriver + 3161856 15  chromedriver                        0x0000000102712fb4 chromedriver + 3436468 16  chromedriver                        0x0000000102713114 chromedriver + 3436820 17  chromedriver                        0x0000000102724744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-046 — สี่ endpoint วิเคราะห์ผลงานและสิทธิ์

Browser: chrome 155.0.8059.41; ระยะเวลา 10.145 วินาที
ผลที่คาดหวัง: ทั้งสี่ AI tabs แสดงผล mock จริงและปฏิเสธสิทธิ์ student/anonymous
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: D1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 790)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000103278a84 chromedriver + 3508868 1   chromedriver                        0x0000000102f64f10 chromedriver + 282384 2   chromedriver                        0x0000000102fb3770 chromedriver + 604016 3   chromedriver                        0x0000000102fb2024 chromedriver + 598052 4   chromedriver                        0x0000000102fb0108 chromedriver + 590088 5   chromedriver                        0x0000000102faf4dc chromedriver + 586972 6   chromedriver                        0x0000000102fa4bc0 chromedriver + 543680 7   chromedriver                        0x0000000102fa4654 chromedriver + 542292 8   chromedriver                        0x0000000102fedc30 chromedriver + 842800 9   chromedriver                        0x0000000102fa342c chromedriver + 537644 10  chromedriver                        0x0000000103246e68 chromedriver + 3305064 11  chromedriver                        0x000000010324a168 chromedriver + 3318120 12  chromedriver                        0x000000010323042c chromedriver + 3212332 13  chromedriver                        0x000000010324a9f8 chromedriver + 3320312 14  chromedriver                        0x0000000103223f00 chromedriver + 3161856 15  chromedriver                        0x0000000103266fb4 chromedriver + 3436468 16  chromedriver                        0x0000000103267114 chromedriver + 3436820 17  chromedriver                        0x0000000103278744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-047 — เว็บส่งงานแล้ว advisor ตรวจ

Browser: chrome 155.0.8059.41; ระยะเวลา 2.9 วินาที
ผลที่คาดหวัง: ส่งงานผ่าน UI และที่ปรึกษาอนุมัติผ่าน UI สำเร็จ
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: S1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 788)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000104ec4a84 chromedriver + 3508868 1   chromedriver                        0x0000000104bb0f10 chromedriver + 282384 2   chromedriver                        0x0000000104bff770 chromedriver + 604016 3   chromedriver                        0x0000000104bfe024 chromedriver + 598052 4   chromedriver                        0x0000000104bfc108 chromedriver + 590088 5   chromedriver                        0x0000000104bfb4dc chromedriver + 586972 6   chromedriver                        0x0000000104bf0bc0 chromedriver + 543680 7   chromedriver                        0x0000000104bf0654 chromedriver + 542292 8   chromedriver                        0x0000000104c39c30 chromedriver + 842800 9   chromedriver                        0x0000000104bef42c chromedriver + 537644 10  chromedriver                        0x0000000104e92e68 chromedriver + 3305064 11  chromedriver                        0x0000000104e96168 chromedriver + 3318120 12  chromedriver                        0x0000000104e7c42c chromedriver + 3212332 13  chromedriver                        0x0000000104e969f8 chromedriver + 3320312 14  chromedriver                        0x0000000104e6ff00 chromedriver + 3161856 15  chromedriver                        0x0000000104eb2fb4 chromedriver + 3436468 16  chromedriver                        0x0000000104eb3114 chromedriver + 3436820 17  chromedriver                        0x0000000104ec4744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

### TC-048 — เว็บ admin จัดการหมวดหมู่/ผู้ใช้

Browser: chrome 155.0.8059.41; ระยะเวลา 2.752 วินาที
ผลที่คาดหวัง: admin เพิ่มหมวดหมู่และผู้ใช้ผ่าน UI; student ถูกปฏิเสธ API จัดการ
ผลจริง: ขั้นตอนหรือ assertion ล้มเหลว (FAIL)

1. ล็อกอินผ่านฟอร์ม: A1 — FAIL
2. เปิดหน้า: /login — PASS
3. กรอกช่อง: email — PASS
4. กรอกช่อง: password — PASS

ข้อผิดพลาด: Message: element click intercepted: Element is not clickable at point (1009, 789)   (Session info: chrome=155.0.8059.41); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception Stacktrace: 0   chromedriver                        0x0000000100c18a84 chromedriver + 3508868 1   chromedriver                        0x0000000100904f10 chromedriver + 282384 2   chromedriver                        0x0000000100953770 chromedriver + 604016 3   chromedriver                        0x0000000100952024 chromedriver + 598052 4   chromedriver                        0x0000000100950108 chromedriver + 590088 5   chromedriver                        0x000000010094f4dc chromedriver + 586972 6   chromedriver                        0x0000000100944bc0 chromedriver + 543680 7   chromedriver                        0x0000000100944654 chromedriver + 542292 8   chromedriver                        0x000000010098dc30 chromedriver + 842800 9   chromedriver                        0x000000010094342c chromedriver + 537644 10  chromedriver                        0x0000000100be6e68 chromedriver + 3305064 11  chromedriver                        0x0000000100bea168 chromedriver + 3318120 12  chromedriver                        0x0000000100bd042c chromedriver + 3212332 13  chromedriver                        0x0000000100bea9f8 chromedriver + 3320312 14  chromedriver                        0x0000000100bc3f00 chromedriver + 3161856 15  chromedriver                        0x0000000100c06fb4 chromedriver + 3436468 16  chromedriver                        0x0000000100c07114 chromedriver + 3436820 17  chromedriver                        0x0000000100c18744 chromedriver + 3508036 18  libsystem_pthread.dylib             0x000000018caf5cfc _pthread_start + 132 19  libsystem_pthread.dylib             0x000000018caf0ce8 thread_start + 4 

ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider

Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production
