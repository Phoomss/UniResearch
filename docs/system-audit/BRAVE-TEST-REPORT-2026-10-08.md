# ผลทดสอบหน้าเว็บของ Narongsak ด้วย Brave ใน Docker — 8 ตุลาคม 2026

ผลรัน: **ผ่าน 16 / ไม่ผ่าน 0 / ข้าม 0**; pytest exit code 0 ระยะเวลา 414.04 วินาที (6 นาที 54 วินาที)

ใช้ Selenium + pytest เปิด Brave แบบ headless ใน Docker image `uniresearch-selenium-tests` (`linux/amd64`, Docker Desktop บน Apple Silicon) โดยรัน Next.js แบบ development ด้วย webpack และ FastAPI ภายใน container ของชุดทดสอบ

- Brave: `155.1.97.56`
- Chromium ที่ WebDriver รายงาน: `155.0.8059.40`
- ChromeDriver: `155.0.8059.39`
- ผู้รันอัตโนมัติ: Codex; Narongsak หมายถึงเจ้าของกรณีทดสอบตามแผน
- ขอบเขต: เฉพาะ 16 กรณีที่มี UI จาก 18 กรณีของ Narongsak; TC-013 และ TC-046 เป็น API-only จึงไม่ได้รันในรอบนี้ รวม 32 กรณีที่ไม่ได้เลือกจากชุดเต็ม 48 กรณี
- ใช้ฐานข้อมูล SQLite และพื้นที่เก็บไฟล์ชั่วคราว รวมถึง AI test double; ไม่ใช่ผลทดสอบ PostgreSQL/pgvector หรือ AI provider จริง
- ผลนี้อ้างอิง working tree ขณะ build รวมการแก้แจ้งเตือนที่มีอยู่ก่อนเริ่มงานนี้; image ไม่ได้ระบุ commit (`unknown`)

## คำสั่งรัน

```sh
docker compose -f docker-compose.selenium.yml build
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -m 'narongsak and ui' -v
```

## หลักฐาน

- [รายงานรายเคสพร้อม screenshot](../../tests/selenium/artifacts/20261008-044414-944149/report.md)
- [ผล JSON รวมเวอร์ชันเบราว์เซอร์และหลักฐาน API/DB](../../tests/selenium/artifacts/20261008-044414-944149/results.json)
- [วิธีรันชุดทดสอบ](../../tests/selenium/README.md)

ไฟล์หลักฐานอยู่ใน `tests/selenium/artifacts/20261008-044414-944149/` ซึ่งไม่ได้ติดตามด้วย Git

## ผลรายกรณี

| รหัส | เรื่องที่ทดสอบ | ผล |
|---|---|---|
| TC-001 | สมัครด้วย email ใหม่และ role ที่ส่งมาเป็น admin | ผ่าน |
| TC-004 | รหัสผ่านผิด | ผ่าน |
| TC-007 | ล็อกอินแล้วออกจากระบบ | ผ่าน |
| TC-010 | อ่านสาธารณะและเพิ่มโดย admin | ผ่าน |
| TC-016 | คำแนะนำไม่เผยงาน pending | ผ่าน |
| TC-019 | ID ไม่มีอยู่ | ผ่าน |
| TC-022 | ส่งงานครบข้อมูลและผู้เกี่ยวข้อง | ผ่าน |
| TC-025 | ผู้เขียนคนละ prefix ปี | ผ่าน |
| TC-028 | ผู้ส่ง/author เห็นงานใน /my | ผ่าน |
| TC-031 | ส่งเอกสารใหม่หลัง needs_revision | ผ่าน |
| TC-034 | ผู้ใช้ active ดาวน์โหลดงานมีไฟล์ | ผ่าน |
| TC-037 | ผู้ตรวจเห็นประวัติของตน | ผ่าน |
| TC-038 | advisor ที่ได้รับมอบหมายอนุมัติ pending | ผ่าน |
| TC-043 | อ่านเฉพาะของตนและ mark read | ผ่าน |
| TC-047 | เว็บส่งงานแล้ว advisor ตรวจ | ผ่าน |
| TC-048 | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | ผ่าน |

## การปรับชุดทดสอบ

ติดตั้ง Brave จาก APT repository ทางการ และจับคู่ ChromeDriver จากเวอร์ชัน Chromium ใน Brave release ทางการ บันทึกชื่อ executable เวอร์ชัน Brave/Chromium และ ChromeDriver ในหลักฐาน กำหนดเวลารอเริ่มบริการใน Docker เป็น 300 วินาที และปิด process group ของเบราว์เซอร์แต่ละกรณีหลัง WebDriver quit เพื่อป้องกัน process ค้างภายใต้ amd64 emulation

รอบก่อนแก้มีปัญหาเริ่มเว็บไม่ทันและ process Brave สะสมจนเว็บหยุดทำงาน จึงไม่นำผลรอบนั้นมารวมกับผลผ่าน 16 กรณีนี้
