# แผนการทดสอบ UniResearch

ชื่องานปัจจุบันใช้ชื่อเต็มจาก [migrate.py/seed_thai_data.py](TEST-RESEARCH-DATA.md) พร้อมระบุสำเนาที่เตรียมเพิ่ม สถานะและการเชื่อมบัญชี CSV เป็นเงื่อนไขบนฐานทดสอบ ไม่ใช่ผล migration หรือผลทดสอบย้อนหลังของบุคคลนั้น

ฉบับข้อมูลทดสอบปัจจุบันใช้ชื่อ/อีเมลจาก [student.csv](../../backend/app/scripts/student.csv) และ [advisors.csv](../../backend/app/scripts/advisors.csv) ตามตารางใน [Test Cases ข้อ 1.2](TEST-CASES.md#12-สภาพแวดล้อมและข้อมูลร่วม) ต้องเตรียมสำเนาฐานทดสอบให้ตรงก่อนรัน เลขผู้ใช้ในเอกสารเป็น mapping ของฐานทดสอบตามแผน ไม่ใช่ id จาก CSV ผลย้อนหลังอ้างข้อมูลของรอบเดิม ส่วนผลรันด้วยบัญชี CSV และ migration ปัจจุบันแยกใน [รายงานปรับสคริปต์ 16 ตุลาคม](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md)

ฉบับทบทวนเนื้อหา: **16 ตุลาคม 2026** · ขอบเขต **48 TC / 32 FR**

ส่วนที่ 1 ของ [TEST-PLAN-AND-REPORT.md](TEST-PLAN-AND-REPORT.md) ใช้กับ [TEST-CASES.md](TEST-CASES.md) ฉบับวันที่เดียวกัน แผนนี้ระบุวิธีและเกณฑ์ที่จะใช้; ผลการดำเนินการย้อนหลังอยู่ใน [TEST-REPORT.md](TEST-REPORT.md) การทบทวนเอกสารเดิมไม่ได้ execute ใหม่ ต่อมามีการปรับสคริปต์และรันทดสอบตาม [รายงานปรับสคริปต์](SELENIUM-CSV-MIGRATION-ALIGNMENT-2026-10-16.md) ผลยังต้องให้ผู้รับผิดชอบรับรองตามเกณฑ์

## 1.1 วัตถุประสงค์และฐานอ้างอิง

ตรวจพฤติกรรม FR-001–FR-032 จาก implementation และความต่อเนื่องระหว่าง UI, Next.js proxy, FastAPI, ฐานข้อมูล และไฟล์ โดยมีฐานโค้ดที่ทบทวนคือ commit `343fb57f3b04b756f6f7129154df9649d5177afc` ก่อนแก้เอกสาร ต้องบันทึก commit/working tree ของรอบรันจริงแยกทุกครั้ง

เป้าหมายหลักมีดังนี้

- ยืนยันการสมัคร/ล็อกอิน/โปรไฟล์/session และ RBAC ของ anonymous, guest, student, advisor, admin; แยก anonymous ออกจากบัญชี role guest
- ยืนยันการสร้างงาน `pending`, การตรวจเป็น `approved`/`rejected`/`needs_revision`, การแก้แล้วกลับ `pending`, revision และ notification
- ตรวจการค้นหา/คำแนะนำ/สถิติ การจัดการผู้ใช้/หมวดหมู่/ตัวเลือก favorite และการดาวน์โหลดทั้ง UI/API
- ตรวจ negative/boundary และผลข้างเคียงหลังคำขอถูกปฏิเสธ รวมถึงไฟล์เดิมเมื่อ update ล้มเหลว
- ตรวจ AI contract และสิทธิ์ด้วย provider mock โดยไม่ bypass authentication/validation; ประเมิน provider จริงแยก
- บันทึกพฤติกรรมสาธารณะของ pending URL/static และความต่างของ queue/route guard เพื่อให้ผู้รับผิดชอบตัดสินนโยบาย

ข้อกำหนดจากโค้ดไม่ใช่หลักฐานว่าเป็นนโยบายธุรกิจที่อนุมัติแล้ว โดยเฉพาะการมองเห็นงานที่ยังไม่เผยแพร่

## 1.2 ขอบเขตและรายการที่ทดสอบ

### 1.2.1 In Scope

| กลุ่ม | Test Cases | จำนวน |
|---|---|---:|
| บัญชีและโปรไฟล์ | TC-001–007 | 7 |
| ผู้ใช้ หมวดหมู่ และตัวเลือก | TC-008–013 | 6 |
| ค้นหา รายละเอียด และคำแนะนำ | TC-014–020 | 7 |
| ส่งผลงานและตรวจข้อมูล | TC-021–027 | 7 |
| ผลงานของฉัน การแก้ไข และไฟล์ | TC-028–035 | 8 |
| คิวและผลการตรวจ | TC-036–041 | 6 |
| Favorite และการแจ้งเตือน | TC-042–043 | 2 |
| AI | TC-044–046 | 3 |
| E2E ข้ามบทบาท | TC-047–048 | 2 |
| รวม | TC-001–048 | 48 |

ประเภทหลัก Positive 32 / Negative 16; ความสำคัญสูง 31 / กลาง 17 แต่ละ TC อาจมีหลาย subcase และนับเป็น PASS ได้ต่อเมื่อตรวจครบ เงื่อนไขที่เพิ่มในฉบับ 16 ตุลาคมยังไม่มีผล execution ของฉบับนี้

ขอบเขต source: `backend/app`, `backend/tests`, `frontend/app`, `frontend/src`, `frontend/tests`, `frontend/e2e`, `tests/selenium`, Docker/CI configuration ที่เกี่ยวข้อง ส่วน Selenium ที่รันโดยค่าเริ่มต้นปัจจุบันเป็น **18 TC ของ Narongsak**; อีก 30 TC อยู่ในชุด legacy ต้องเลือกให้ชัดตาม README ของชุดทดสอบ การรัน pytest ค่าเริ่มต้นจึงไม่ใช่ผลครบ 48 TC

### 1.2.2 Out of Scope และข้อจำกัด

ยังไม่รวม load/stress, penetration test เต็มรูปแบบ, compatibility ทุก browser/mobile, Kubernetes/Terraform และการตัดสินความถูกต้องทางวิชาการของ AI ส่วน PostgreSQL/pgvector เป็นขอบเขตรับรองที่ต้องมีรอบ integration จริงก่อนสรุปผลระบบ แต่ **ไม่รวมอยู่ในผล Selenium SQLite ที่มีแล้ว**

ไม่มีการนำ requirement ของระบบตัวอย่าง SPRS มาใช้ เช่น committee, draft/submitted/completed หรือคะแนนประเมินสี่ด้าน หากต้องเพิ่มนโยบายต้องเปลี่ยน requirement และกำหนด TC ก่อน

## 1.3 กลยุทธ์ เครื่องมือ และหลักฐาน

### 1.3.1 ชั้นการทดสอบ

| ชั้น | วิธีดำเนินการ | หลักฐานที่ต้องมี |
|---|---|---|
| UI functional / E2E | Selenium WebDriver บน frontend/backend จริง; รอ visible result; ใช้ session แยกตาม role | steps, screenshots, URL, browser/driver/mode, final result |
| API/Integration | ส่ง HTTP ตรง backend และ proxy แยกกัน; เทียบ persisted state | method/path/status, response ที่ปกปิดข้อมูลลับ, DB/file snapshot |
| RBAC / negative | body valid ยกเว้นจุดที่ทดสอบ; anonymous/role ผิด/ID ผิดแยก subcase | error ที่ตรงเหตุ, snapshot ก่อนหลัง, UI guard ถ้ามี |
| Boundary / file | แยก L−1/L/L+1 bytes และ MIME/extension/signature | ขนาดจริง, status, path/bytes หรือ hash, cleanup result |
| Backend automated | pytest ของ backend/tests บนฐานทดสอบ | command, exit code, test counts, logs และ commit |
| Frontend quality | typecheck, lint, Node tests, production build | command/exit code, error summary และ commit |
| Playwright regression | ใช้ specs/fixtures ที่มีอยู่และตรวจ skip | test counts, trace/screenshot, config ที่ใช้จริง |
| AI controlled | mock provider ให้ผลแน่นอน; ทดสอบ schema/auth/fallback จริง | mock contract/version, HTTP/UI result; ระบุว่าไม่ได้รับรอง live AI |
| PostgreSQL/pgvector | ฐานแยกพร้อม extension; relation/transaction/vector retrieval จริง | version/schema/extension, query evidence, integration logs |

HTTP/DB assertions ที่อยู่ร่วม Selenium เป็นหลักฐานเสริม ไม่ใช่ browser steps การเห็นหน้าเว็บไม่พอพิสูจน์การบันทึก DB และ API สำเร็จไม่พอพิสูจน์ว่า UI แสดงถูก TC-046 ปัจจุบันมี UI ทั้งสี่ AI tabs จึงไม่ใช่ API-only case

### 1.3.2 ลำดับดำเนินงาน

ผู้ทดสอบที่เดินผ่านหน้าเว็บใช้สี่หัวข้อหลักใน [TEST-CASES.md](TEST-CASES.md): ล็อกอินด้วยอีเมลและรหัสผ่านสำเนาที่กำหนด → กดเมนูจริง → เลือกงาน/กรอกค่า → กดยืนยัน → ตรวจข้อความและสถานะบนหน้า ไม่ใช้ HTTP status หรือคำสั่ง SQL เป็นขั้นตอนที่ผู้ใช้ต้องเดาเอง

ส่วน [TEST-CASES-TECHNICAL-CHECKS.md](TEST-CASES-TECHNICAL-CHECKS.md) เก็บเงื่อนไข API/RBAC/schema/DB/ไฟล์ที่ยังต้องตรวจครบ เช่น token ปลอม malformed IDs และการมอบหมาย advisor ที่ไม่มีปุ่มบนเว็บ ผลของ UI และผลส่วนเสริมต้องบันทึกแยกกัน แล้วจึงตัดสิน TC รวมตามเกณฑ์เดิม

ก่อนรันคู่มือ ผู้เตรียมฐานสำเนาตั้งรหัสผ่าน `UniResearchTest2026!` ให้บัญชีที่เลือกจาก CSV และจัดข้อมูลตาม mapping; ค่านี้เป็นค่าทดสอบที่กำหนดขึ้นสำหรับสำเนา ไม่ใช่รหัสผ่านบัญชีต้นทาง ส่วน TC-005 ใช้รหัสใหม่ตามที่ระบุและ reset หลังจบ


1. บันทึก run ID, commit/dirty diff, เวอร์ชันและ configuration ที่ไม่รวม secret; ตรวจว่าเป็นฐาน/ไฟล์ทดสอบแยก
2. ตรวจ frontend/backend health, schema, browser driver และ provider mock; ถ้าทดสอบ PostgreSQL ให้ตรวจ extension เพิ่ม
3. seed fixture ตามข้อ 1.2 ของ Test Cases และ override เฉพาะกรณี; ตรวจ role/status/relations ก่อนเริ่ม
4. รันบัญชี/RBAC → ส่งงาน/ไฟล์ → ตรวจงาน/notification → ค้นหา/AI → E2E โดย reset แต่ละกรณี; ห้ามพึ่งผลจาก TC ก่อนหน้า
5. เก็บผลทุก subcase; เปิด defect เมื่อ assertion ต่าง; แยก failure ของระบบออกจาก locator/wait/fixture
6. แก้ defect แล้ว rerun TC เดิมพร้อมกรณีที่ได้รับผลกระทบ บันทึกเป็น session ใหม่ ไม่เขียนทับผลเดิม
7. ตรวจ consistency ของ TC/FR/counts/หลักฐานก่อนสรุป exit criteria และเสนอผู้อนุมัติ

### 1.3.3 สูตรและสถานะผล

`Planned = PASS + FAIL + BLOCKED + SKIPPED + NOT RUN` โดยหนึ่ง TC มีสถานะสุดท้ายหนึ่งค่าในหนึ่ง session; `Executed = PASS + FAIL` และ `Pass rate = PASS / Executed × 100` ถ้า Executed=0 ให้ระบุ N/A ไม่ใช่ 0% หรือ 100% ส่วน `Execution coverage = Executed / Planned × 100`

รายงาน UI ใช้ `UI Tested / UI-automatable cases` เป็นอีก metric หนึ่ง ต้องไม่แทน execution coverage ของทั้ง 48 TC การมี TC ครบทุก FR คือ coverage เชิงแผน ไม่ใช่ coverage ของ assertions หรือผลผ่านของ FR

ถ้าบาง subcase ทำไม่ได้ให้ BLOCKED พร้อมบอกส่วนที่ทำแล้ว หากมีผลผิดแน่ชัดให้ FAIL และบันทึกส่วนที่ blocked เพิ่ม ผลเก่าที่ใช้คำว่า “ข้าม” คงคำเดิม ห้ามตีความเป็น BLOCKED ทุกข้อโดยไม่มีหลักฐาน

## 1.4 เกณฑ์เริ่ม สิ้นสุด ระงับ และกลับมาทดสอบ

### 1.4.1 Entry Criteria

- มี specification version และ scope ของรอบรันชัดเจน; ไม่ใช้คำว่า “ทั้งชุด” โดยไม่ระบุ 18 หรือ 48 TC
- frontend/backend พร้อมบน loopback/สภาพแวดล้อมแยก; SQLite ใช้ได้สำหรับ functional รอบจำกัด ส่วนรอบ PostgreSQL ต้องเริ่ม DB/pgvector และ schema ของมันได้
- บัญชี fixture/งาน/relations/ไฟล์และ revision ตรง precondition; ไม่มี dependency กับข้อมูล production
- browser/driver ใช้งานได้; AI provider mock พร้อม; มี directory หลักฐานที่เขียนได้และเก็บข้อมูลลับแยก
- ระบุผู้รันจริงและผู้ทบทวน; ผู้อนุมัติแผน/นโยบายที่ยังไม่ระบุให้แสดง “รอระบุ” ไม่ถือว่าอนุมัติแล้ว

### 1.4.2 Exit Criteria

เกณฑ์ด้านล่างเป็น **ข้อเสนอสำหรับฉบับทบทวน** ยังไม่ใช่การอนุมัติย้อนหลัง

- มีสถานะและเหตุผลครบ 48 TC ของฉบับนี้; สำหรับการรับรองครบขอบเขตต้อง execute 48/48 และทำครบ subcases
- TC ความสำคัญสูงทั้ง 31 ต้อง PASS; กรณี FAIL ที่เหลือต้องมี defect และการตัดสินความเสี่ยงอย่างชัดเจน ไม่ใช้ pass rate กลบ defect สำคัญ
- ไม่มี defect ที่ทำให้เข้าถึง/แก้ข้อมูลโดยไม่ได้รับสิทธิ์ ข้อมูลหรือไฟล์สูญหาย หรือ workflow หลักใช้งานไม่ได้ค้างโดยไม่จัดการ
- มีผล backend/frontend quality gates ของ commit ที่จะรับรอง; warning ต้องมีข้อสรุปตามผลกระทบ ผล gate วันที่ 4 ตุลาคมไม่ใช่ gate ของ commit ปัจจุบัน
- มีผล PostgreSQL/pgvector หากสรุปการรับรองระบบที่ใช้ฐานดังกล่าว; SQLite ผ่านไม่ทดแทนได้
- รายงานและหลักฐานครบ มีผู้ทบทวน และผู้อนุมัติรับรอง/รับความเสี่ยงพร้อมวันเวลา

ผล 18/18 ของ subset ยืนยันได้เฉพาะ subset และ version นั้น; ไม่ทำให้ exit criteria 48 TC เป็นผ่าน

### 1.4.3 Suspension / Resumption

ระงับกรณีที่พึ่ง dependency เมื่อล็อกอิน fixture ไม่ได้, service/DB/browser ล่ม, schema ไม่ตรง, mock ใช้ไม่ได้ หรือ fixture ปนข้อมูลจริง บันทึก BLOCKED พร้อมเวลาและ error ห้ามเปลี่ยนเป็น FAIL ของระบบโดยอัตโนมัติ กลับมารันเมื่อแก้สาเหตุและผ่าน smoke check ของ dependency แล้ว โดยสร้าง session ใหม่และ reset ข้อมูล

## 1.5 สภาพแวดล้อมและการจัดการข้อมูล

| รายการ | ฐานอ้างอิง/ข้อกำหนดการบันทึก |
|---|---|
| แอป | Next.js 16.2.12, React 19.2.4, FastAPI; บันทึก lockfile/image/commit จริง |
| Runtime | CI อ้าง Node 22 / Python 3.11; local Selenium ที่มีหลักฐานใช้ Python 3.14.5; ไม่ถือว่าผลข้าม runtime เทียบกันได้ทันที |
| ฐานข้อมูล | Compose อ้าง pgvector/pgvector:pg15; Selenium runner ใช้ SQLite ชั่วคราว ให้ระบุชนิดจริงในรายงาน |
| Startup | backend ใช้ Base.metadata.create_all; ทดสอบฐานใหม่ไม่ใช่หลักฐานการ migrate ฐานเก่า |
| Browser | Chrome ค่าเริ่มต้น local headed; CI/container headless; Brave ต้องกำหนด binary/driver; บันทึก browser version จริง |
| URL | ค่าปกติ 3000/8000/5433; runner ใช้พอร์ตของตนเอง; บันทึก actual origin โดยไม่เผย secret |
| ข้อมูลทดสอบ | อีเมลจาก CSV/เลขผู้ใช้ที่จัดในฐานทดสอบตามแผน ตามตาราง Test Cases: admin@uniresearch.ac.th เลข 1, 674259009@webmail.npru.ac.th เลข 2, 674259003@webmail.npru.ac.th เลข 3, 644259003@webmail.npru.ac.th เลข 4, udsanee@webmail.npru.ac.th เลข 5, wuttha@webmail.npru.ac.th เลข 6, g1@example.org เลข 7, 674259013@webmail.npru.ac.th เลข 8; หมวดหมู่ทั้งสี่ตามบัญชีแหล่งข้อมูลผลงาน, ผลงาน 1–5, แจ้งเตือน 1/2; เพิ่มข้อมูลตามแต่ละ subcase |
| Storage | directory ชั่วคราวแยกและ reset; cover 5 MiB / document 25 MiB เป็น default ที่ override ได้ |
| AI | deterministic provider mock สำหรับ functional; vector fallback และ provider จริงบันทึกเป็นคนละรอบ |
| Evidence | artifacts และ reports แยกตาม run ID; ห้ามเก็บ password/token/hash/secret ใน Markdown หรือ screenshot |

คำสั่งและ flags ให้ใช้ [tests/selenium/README.md](../../tests/selenium/README.md) เป็นคู่มือปัจจุบัน ตัวอย่างเลือก scope:

```sh
pytest tests/selenium/ -v --headed
pytest tests/selenium/ -m ai -v --headless
pytest tests/selenium/ --all-cases -v --headless
```

คำสั่งแรกปัจจุบันเลือก 18 TC; คำสั่งสุดท้ายขอรวม legacy แต่ต้องตรวจ collection/จำนวน unique TC ก่อนเรียกผลว่า 48/48 ห้ามรวม duplicate ID หรือแปลง deselected เป็น PASS Runner local ใช้ `.next`/dev lock ร่วมกับ checkout จึงรัน serial และจัดการ dev server เดิมก่อน; ไม่รัน pytest-xdist กับ fixture reset นี้

## 1.6 บทบาทและผู้รับผิดชอบ

| บทบาท | หน้าที่ | สถานะผู้รับผิดชอบ |
|---|---|---|
| Test Manager | กำหนด scope/priority ตรวจ entry/exit และ defect | รอระบุ |
| Tester | ดำเนินขั้นตอนและเก็บหลักฐาน | Narongsak, Sommai Kitikorn, Natthaporn เป็นการจัดสรรเดิม; ต้องบันทึกผู้รันจริงต่อ session |
| ผู้รันอัตโนมัติย้อนหลัง | รันเครื่องมือและบันทึกผล | Codex ตามรายงานเดิม; ไม่ใช่ลายเซ็นของสมาชิกที่รับมอบหมาย |
| Environment owner | ดูแล DB/storage/mock และ reset | รอระบุ |
| Developer | วิเคราะห์/แก้ defect และระบุ commit สำหรับ retest | รอระบุ |
| Reviewer / Approver | ตรวจความครบและตัดสินการรับรอง/ความเสี่ยง | รอระบุ |

## 1.7 กำหนดการและ milestone

| กิจกรรม | วันที่/สถานะ | ผลงานที่ต้องได้ |
|---|---|---|
| Docker baseline | 4 ต.ค. 2026 ดำเนินการแล้ว | 17 PASS / 31 ข้าม; quality gates ตามหลักฐานเดิม |
| Selenium full baseline และ notification retest | 8 ต.ค. 2026 ดำเนินการแล้ว | ผลทั้ง 48 และผล focused แยก session |
| ปรับ Selenium/UI subset | 14 ต.ค. 2026 ดำเนินการแล้ว | session 18/18 และหลักฐาน UI |
| Focused UI retest | 16 ต.ค. 2026 มีผลบาง TC | U16 ก่อนปรับสคริปต์: TC-038 PASS, อีก 17 NOT RUN |
| ปรับข้อมูล CSV/migration และสคริปต์ | 16 ต.ค. 2026 ดำเนินการแล้ว | C16 ครบ 48 (43 PASS/5 FAIL), R16/R16B focused แยก; ติดตาม TC-018/027/045 |
| ทบทวนเนื้อหาเอกสาร | 16 ต.ค. 2026 | ฉบับนี้; ไม่มี execution ใหม่ |
| รันเงื่อนไขที่เพิ่มครบ 48 TC / PostgreSQL | รอจัดกำหนดการ | evidence ของฉบับปรับปรุงและ defect log |
| Regression / รับรอง | หลังแก้ defect และผ่าน gates | ผลรอบใหม่พร้อมการลงนาม |

## 1.8 ความเสี่ยงและการรองรับ

| ความเสี่ยง | ผลกระทบ | วิธีตรวจ/รองรับ |
|---|---|---|
| pending detail และ static URL สาธารณะ | อาจเผยงานที่ยังไม่เผยแพร่/ข้าม download counter | TC-018/034 แยก observation; เจ้าของระบบยืนยันนโยบาย |
| /admin layout ตรวจเพียง session | UI ดูเข้าถึงได้แม้ API ปฏิเสธ | TC-013/048 ตรวจหน้าและ API แยกกัน |
| advisor queue ใช้ search ที่กว้างกว่า pending API | เห็นงานนอก assignment | TC-036 เทียบ ID และยืนยันนโยบาย |
| reviewer role ใน frontend ไม่ตรง backend | เปิด workspace แต่ตรวจงานไม่ได้ | ไม่ใช้ reviewer แทน advisor; เพิ่ม regression เมื่อกำหนด role จริง |
| update ล้มเหลวหลังลบไฟล์เดิม | DB rollback แต่ bytes เดิมอาจหาย | TC-027 ตรวจ old path/bytes ด้วย; เป็นข้อสงสัยจากโค้ด ยังไม่ใช่ผล FAIL ใหม่ |
| ลบแถว revision แต่ไม่ลบไฟล์ revision เก่า | ไฟล์ตกค้าง | TC-032 ตรวจ filesystem แยกและกำหนด cleanup policy |
| SQLite/mock ผ่านแต่ PostgreSQL/vector จริงผิด | ผล functional ไม่แทน deployment | ทดสอบ FK/transaction/pgvector แยก |
| ผลต่าง commit/working tree/เวลา metadata | สรุป pass จากคนละเวอร์ชันผิด | เก็บ run ID/JSON/UTC; ห้ามรวม PASS หลายรอบเป็นผล session เดียว |
| retry toggle/side effects GET | favorite กลับค่าเดิม หรือ counter เกิน | TC-018/034/042 คุมจำนวน HTTP และตรวจ DB |

## 1.9 สิ่งส่งมอบและการควบคุมการแก้ไข

ส่งมอบเฉพาะ Markdown: Test Cases พร้อมคู่มือจุดตรวจเสริม, Test Plan, Test Report, ฉบับรวม, Traceability และดัชนีอ้างอิง ผลการทดสอบดั้งเดิม/JSON/screenshots คงเป็นหลักฐานของรอบเดิม ไฟล์ Word/PDF ไม่ได้ปรับในงานนี้

หากเปลี่ยน Expected Result หรือเพิ่ม subcase ต้องระบุ specification version ใหม่และไม่ยก PASS เดิมมาเป็น PASS ของเงื่อนไขใหม่ Defect log ต้องมี TC/subcase, run/commit, steps, expected/actual, severity ที่ประเมิน, owner, status, fix commit และ retest evidence

`TEST-PLAN.md` และ `TEST-REPORT.md` เป็นแหล่งแก้ไขหลักของแต่ละส่วน; `TEST-PLAN-AND-REPORT.md` ต้องประกอบจากสองไฟล์นี้เมื่อแก้ เพื่อป้องกันข้อมูลต่างกัน

## 1.10 การทบทวนและอนุมัติแผน

| บทบาท | ผู้รับผิดชอบ | วิธีรับรอง/วันที่ |
|---|---|---|
| ผู้จัดทำฉบับทบทวน | Codex (ตรวจเอกสารตามคำขอ) | 16 ต.ค. 2026; ไม่ใช่ผล execute |
| ผู้ทบทวนแผน | รอระบุ | รอตรวจ |
| ผู้อนุมัติ scope/exit criteria/นโยบาย | รอระบุ | ยังไม่มีการรับรอง |
