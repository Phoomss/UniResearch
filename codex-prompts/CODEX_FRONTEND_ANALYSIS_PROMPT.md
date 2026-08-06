# Codex Task: วิเคราะห์ ปรับรูปแบบ และจัดทำเอกสาร Frontend ของ UniResearch

## 1. บทบาทของคุณ

คุณทำหน้าที่เป็น Senior Frontend Developer และ Software Analyst

ให้ตรวจสอบโค้ด Frontend ของโปรเจกต์ UniResearch อย่างละเอียด จากนั้นดำเนินการดังนี้

1. วิเคราะห์ว่า Frontend ทำฟังก์ชันอะไรไปแล้วบ้าง
2. เปรียบเทียบความสามารถของ Frontend กับเอกสาร Requirements
3. ระบุสิ่งที่ทำเสร็จแล้ว ทำบางส่วน และยังไม่ได้ทำ
4. จัด Formatting โค้ดของแต่ละ Page ที่เขียนรวมเป็นบรรทัดเดียวหรืออ่านยาก
5. ปรับโครงสร้างโค้ดให้อ่านง่ายและแก้ไขต่อได้ โดยต้องไม่เปลี่ยนพฤติกรรมเดิมของระบบ
6. สรุปโครงสร้าง Frontend และการเชื่อมโยงของแต่ละไฟล์เป็นภาษาไทย
7. สร้างรายงานผลการวิเคราะห์เป็นไฟล์ Markdown ภาษาไทยที่เข้าใจง่าย

---

## 2. ตำแหน่งโปรเจกต์

Project Root:

```text
D:\Project-69\UniResearch
```

Frontend Root:

```text
D:\Project-69\UniResearch\frontend
```

Requirements Document:

```text
D:\Project-69\UniResearch\frontend\docs\UniResearch_Requirements_Analysis.md
```

ไฟล์รายงานที่ต้องสร้าง:

```text
D:\Project-69\UniResearch\frontend\docs\FRONTEND_ANALYSIS_TH.md
```

ให้ตรวจสอบว่าตำแหน่งไฟล์และโฟลเดอร์เหล่านี้มีอยู่จริงก่อนเริ่มทำงาน

หากชื่อไฟล์หรือโครงสร้างจริงแตกต่างจากที่ระบุ ให้ค้นหาไฟล์ที่เกี่ยวข้องในโปรเจกต์ และบันทึกความแตกต่างไว้ในรายงาน

---

## 3. กฎสำคัญก่อนแก้ไขโค้ด

ก่อนแก้ไขไฟล์ใด ๆ ให้ดำเนินการดังนี้

1. ตรวจสอบสถานะ Git ด้วยคำสั่ง:

```bash
git status
```

2. ห้ามใช้คำสั่งที่ลบหรือย้อนการเปลี่ยนแปลงของผู้ใช้ เช่น:

```bash
git reset --hard
git clean -fd
git checkout .
git restore .
```

3. หากมีไฟล์ที่ผู้ใช้แก้ไขค้างอยู่:

   * ห้ามลบ
   * ห้ามเขียนทับแบบไม่ตรวจสอบ
   * ให้แก้เฉพาะส่วนที่จำเป็น
   * บันทึกรายละเอียดไว้ในรายงาน

4. ห้ามแก้ไขไฟล์ต่อไปนี้โดยไม่จำเป็น:

   * `node_modules`
   * ไฟล์ build output
   * `dist`
   * `build`
   * ไฟล์ cache
   * ไฟล์ lock เช่น `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`

5. ห้ามเปลี่ยน Framework, Library หลัก หรือโครงสร้างโปรเจกต์ครั้งใหญ่

6. ห้ามเปลี่ยน API Contract ระหว่าง Frontend และ Backend

7. ห้ามเปลี่ยนชื่อ Route, Query Parameter, API Endpoint หรือชื่อฟิลด์ข้อมูลโดยไม่มีเหตุผลที่ชัดเจน

8. ห้ามลบโค้ดที่ไม่แน่ใจว่าใช้งานอยู่หรือไม่ ให้บันทึกเป็นข้อสังเกตแทน

9. ห้ามสร้างข้อมูลหรือสรุปสถานะขึ้นมาเอง หากตรวจสอบไม่ได้ให้ระบุว่า:

```text
ไม่สามารถยืนยันได้จากโค้ด Frontend ที่ตรวจพบ
```

---

## 4. ขั้นตอนที่ 1: อ่าน Requirements

อ่านไฟล์ต่อไปนี้ก่อนตรวจสอบโค้ด:

```text
frontend/docs/UniResearch_Requirements_Analysis.md
```

ให้ทำความเข้าใจ Requirements ทั้งหมด โดยเฉพาะ:

* FR-1 การจัดการบัญชีผู้ใช้งาน
* FR-2 การจัดเก็บและส่งผลงานวิจัย
* FR-3 การค้นหาและกรองผลงาน
* FR-4 การแสดงรายละเอียดผลงาน
* FR-5 การอัปโหลดและดาวน์โหลดเอกสาร
* FR-6 การตรวจสอบและอนุมัติผลงาน
* FR-7 การจัดการหมวดหมู่
* FR-8 รายการโปรด
* FR-9 หน้าแรกและผลงานแนะนำ
* FR-10 Dashboard และสถิติ
* FR-11 การจัดการข้อมูลโดยผู้ดูแลระบบ

รวมถึง Non-Functional Requirements เช่น:

* UI/UX
* รองรับภาษาไทยและภาษาอังกฤษ
* Role-based Access Control
* Security
* Performance
* Maintainability
* Accessibility
* File Support
* Reliability
* Scalability

หลังจากอ่าน Requirements แล้ว ให้ใช้ Requirement ID เช่น `FR-1.1`, `FR-3.2` หรือ `NFR-4` ในรายงาน เพื่อให้ตรวจสอบย้อนหลังได้ง่าย

---

## 5. ขั้นตอนที่ 2: วิเคราะห์โครงสร้าง Frontend

ตรวจสอบไฟล์และโฟลเดอร์ทั้งหมดภายใน Frontend โดยให้ความสำคัญกับ:

```text
package.json
src/
pages/
views/
components/
layouts/
routes/
router/
services/
api/
hooks/
contexts/
context/
store/
stores/
redux/
types/
interfaces/
utils/
helpers/
assets/
styles/
locales/
i18n/
config/
```

ชื่อโฟลเดอร์จริงอาจแตกต่างกัน ให้ตรวจสอบจากโครงสร้างจริงของโปรเจกต์

สำหรับแต่ละไฟล์ ให้พิจารณา:

1. ไฟล์นี้ทำหน้าที่อะไร
2. เป็น Page, Component, Layout, Service, Hook, Context, Store หรือ Utility
3. ถูกเรียกใช้จากไฟล์ใด
4. Import ไฟล์หรือ Module ใด
5. เชื่อมกับ Route ใด
6. เชื่อมกับ API หรือไม่
7. ใช้ Mock Data, Static Data หรือข้อมูลจาก Backend
8. มี State Management หรือไม่
9. มีการตรวจสอบสิทธิ์ผู้ใช้หรือไม่
10. มีการจัดการ Loading, Error และ Empty State หรือไม่
11. มีโค้ดที่ยังไม่สมบูรณ์หรือไม่
12. มี TODO, FIXME, Placeholder หรือข้อมูลจำลองหรือไม่
13. มีไฟล์ที่ไม่ได้ถูกใช้งานหรืออาจเป็น Dead Code หรือไม่
14. มี Component ที่เขียนซ้ำและควรนำกลับมาใช้ร่วมกันหรือไม่

---

## 6. ขั้นตอนที่ 3: วิเคราะห์ Routes และ Pages

ตรวจสอบระบบ Routing ทั้งหมด และจัดทำแผนผังว่า:

* URL ใดเชื่อมกับ Page ใด
* Route ใดเป็น Public Route
* Route ใดต้อง Login
* Route ใดจำกัดตาม Role
* Route ใดมีอยู่แล้วแต่ยังไม่มี Page
* Page ใดมีอยู่แต่ไม่ได้ถูกเชื่อมกับ Route
* Route ใดใช้ Parameter เช่น `:id`
* Route ใดเชื่อมไปยังหน้ารายละเอียด
* Route ใดเชื่อมไปยังหน้าแก้ไขข้อมูล
* Route ใดเกี่ยวข้องกับ Admin, Student, Advisor หรือ Guest

ให้ตรวจสอบ Navigation เช่น:

* Navbar
* Sidebar
* Menu
* Breadcrumb
* Button
* Link
* Redirect
* Protected Route
* Role Guard

หากพบปุ่มหรือเมนูที่ยังไม่มีการทำงาน ให้ระบุไว้ในรายงาน

---

## 7. ขั้นตอนที่ 4: วิเคราะห์การเชื่อมต่อ API

ตรวจสอบไฟล์ที่เกี่ยวข้องกับ API เช่น:

* Axios instance
* Fetch wrapper
* API service
* Environment variable
* Base URL
* Authentication token
* Request interceptor
* Response interceptor
* Error handler

สำหรับแต่ละ API ที่พบ ให้สรุป:

| รายการ                     | รายละเอียด                        |
| -------------------------- | --------------------------------- |
| Method                     | GET, POST, PUT, PATCH หรือ DELETE |
| Endpoint                   | URL หรือ Path ที่เรียก            |
| ไฟล์ที่เรียกใช้            | Page, Component หรือ Service      |
| วัตถุประสงค์               | API นี้ใช้ทำอะไร                  |
| สถานะ                      | ใช้งานจริง / Mock / ยังไม่สมบูรณ์ |
| การจัดการข้อผิดพลาด        | มีหรือไม่มี                       |
| Requirements ที่เกี่ยวข้อง | เช่น FR-2.1 หรือ FR-3.1           |

ห้ามสรุปว่า API ทำงานสมบูรณ์เพียงเพราะพบชื่อฟังก์ชัน ต้องตรวจสอบว่าฟังก์ชันถูกเรียกใช้งานจริงหรือไม่

---

## 8. ขั้นตอนที่ 5: จัด Formatting โค้ดที่เป็นบรรทัดเดียว

ตรวจสอบไฟล์ Page และ Component ทุกไฟล์ โดยเฉพาะไฟล์ที่มีลักษณะดังนี้:

* โค้ดทั้งหมดอยู่บรรทัดเดียว
* JSX หรือ HTML รวมกันเป็นบรรทัดยาว
* Import หลายรายการรวมกันจนอ่านยาก
* Object หรือ Array ขนาดใหญ่อยู่บรรทัดเดียว
* Function ขนาดใหญ่ไม่มีการแบ่งส่วน
* Conditional Rendering ซ้อนกันมาก
* มี Indentation ไม่สม่ำเสมอ
* มีช่องว่างและบรรทัดว่างไม่เหมาะสม

ให้จัด Formatting โดยใช้กฎต่อไปนี้:

1. หนึ่ง Statement ต่อหนึ่งบรรทัด
2. ใช้ Indentation ให้สม่ำเสมอ
3. แยก JSX Props ที่ยาวออกเป็นหลายบรรทัด
4. แยก Object และ Array ที่ยาวออกเป็นหลายบรรทัด
5. จัดกลุ่ม Imports ให้อ่านง่าย
6. ลบ Import ที่ไม่ได้ใช้งาน เฉพาะเมื่อยืนยันได้อย่างปลอดภัย
7. ใช้ชื่อ Variable และ Function เดิม หากการเปลี่ยนชื่ออาจกระทบการทำงาน
8. ห้ามเปลี่ยน Logic เดิมเพียงเพื่อให้โค้ดดูสวย
9. ห้ามเปลี่ยน UI โดยไม่จำเป็น
10. ห้ามเปลี่ยน Styling หรือ Class Name โดยไม่จำเป็น
11. ห้ามเปลี่ยนข้อความที่แสดงต่อผู้ใช้
12. ห้ามเปลี่ยน API Payload
13. ห้ามเปลี่ยนเงื่อนไข Business Logic
14. ห้ามแยก Component ออกเป็นหลายไฟล์แบบกว้างขวาง เว้นแต่จำเป็นและมั่นใจว่าไม่กระทบระบบ

หากโปรเจกต์มี Prettier หรือ ESLint อยู่แล้ว ให้ใช้ Configuration เดิมของโปรเจกต์

ตรวจสอบ Script จาก `package.json` ก่อน เช่น:

```bash
npm run format
npm run lint
npm run typecheck
npm run build
```

ให้ใช้เฉพาะ Script ที่มีอยู่จริงใน `package.json`

ห้ามสมมติว่ามี Script หากไม่ได้ประกาศไว้

---

## 9. หลักการ Clean Code ที่ให้ปรับได้

สามารถปรับปรุงได้ในขอบเขตต่อไปนี้:

* จัด Formatting
* จัด Indentation
* จัดกลุ่ม Import
* ลบ Import ที่ไม่ใช้งาน
* ลบ Comment ที่ไม่มีประโยชน์และไม่เกี่ยวข้อง
* ตั้งชื่อ Constant ภายในไฟล์ให้เข้าใจง่ายขึ้น เมื่อมั่นใจว่าไม่กระทบภายนอก
* แยกค่าคงที่หรือข้อมูล Static ออกจาก JSX ภายในไฟล์เดียวกัน
* ลด JSX ที่ซ้ำกันภายในไฟล์เดียวกัน
* เพิ่ม Type ที่ขาดหายไปแบบปลอดภัย
* แยก Function ย่อยภายในไฟล์เมื่อ Function เดิมยาวเกินไป
* เพิ่ม Early Return เพื่อให้อ่านง่าย เมื่อไม่เปลี่ยน Logic
* เพิ่มข้อความ Error ที่เหมาะสมในส่วนที่มีการจัดการ Error อยู่แล้ว

สิ่งที่ยังไม่ควรทำในงานนี้:

* เปลี่ยน Architecture ทั้งระบบ
* เปลี่ยน State Management
* เปลี่ยน UI Library
* เปลี่ยน Router
* เปลี่ยนระบบ Authentication
* เปลี่ยน API Client
* เปลี่ยนชื่อไฟล์จำนวนมาก
* ย้ายโฟลเดอร์จำนวนมาก
* Rewrite Page ใหม่ทั้งหมด
* เพิ่ม Feature ที่ Requirements ต้องการแต่ยังไม่มี

งานนี้เน้นวิเคราะห์และปรับให้อ่านง่าย ไม่ใช่พัฒนาฟีเจอร์ทั้งหมดให้เสร็จ

---

## 10. ขั้นตอนที่ 6: เปรียบเทียบ Frontend กับ Requirements

สร้างตาราง Requirement Traceability โดยใช้รูปแบบต่อไปนี้:

| Requirement | รายละเอียด                | สถานะ                                        | หลักฐานจากไฟล์ | สิ่งที่ทำแล้ว | สิ่งที่ยังขาด |
| ----------- | ------------------------- | -------------------------------------------- | -------------- | ------------- | ------------- |
| FR-1.1      | สมัครสมาชิกและเข้าสู่ระบบ | Done / Partial / Not Started / Cannot Verify | ระบุ Path ไฟล์ | อธิบาย        | อธิบาย        |

สถานะที่อนุญาตให้ใช้มีเพียง:

* `เสร็จแล้ว`
* `ทำบางส่วน`
* `ยังไม่ได้ทำ`
* `ไม่สามารถยืนยันได้`
* `ไม่เกี่ยวข้องกับ Frontend โดยตรง`

กฎการประเมิน:

### เสร็จแล้ว

ใช้เมื่อพบหลักฐานครบถ้วน เช่น:

* มี Page
* มี Route
* มี Form หรือ UI
* มี Event Handler
* มีการเชื่อม API หรือข้อมูลจริง
* มี Loading และ Error Handling ที่เหมาะสม
* สามารถเดิน Flow การทำงานได้ครบจากโค้ด

### ทำบางส่วน

ใช้เมื่อพบเพียงบางองค์ประกอบ เช่น:

* มีหน้าจอแต่ยังใช้ Mock Data
* มีปุ่มแต่ยังไม่มี Event
* มี Service แต่ยังไม่ได้เรียก
* มี Route แต่ Page ยังไม่สมบูรณ์
* มี UI แต่ยังไม่เชื่อม Backend
* มีการเชื่อม API แต่ไม่มี Error Handling
* มี Feature แต่ยังไม่รองรับ Role หรือ Validation

### ยังไม่ได้ทำ

ใช้เมื่อไม่พบ Page, Component, Route, Service หรือ Logic ที่เกี่ยวข้อง

### ไม่สามารถยืนยันได้

ใช้เมื่อการทำงานต้องอาศัย Backend, Database หรือ Environment ที่ไม่มีข้อมูลเพียงพอ

### ไม่เกี่ยวข้องกับ Frontend โดยตรง

ใช้กับ Requirements ที่เป็นหน้าที่หลักของ Backend แต่ให้ระบุด้วยว่า Frontend ต้องมี UI หรือ Integration อะไรรองรับ

---

## 11. ขั้นตอนที่ 7: ตรวจสอบคุณภาพ Frontend

ให้ตรวจสอบประเด็นต่อไปนี้เพิ่มเติม:

### UI/UX

* Layout สม่ำเสมอหรือไม่
* Responsive หรือไม่
* มี Loading State หรือไม่
* มี Empty State หรือไม่
* มี Error State หรือไม่
* Form มี Validation หรือไม่
* ปุ่มสำคัญมี Disabled State หรือไม่
* มีข้อความแจ้งผลสำเร็จหรือไม่

### Authentication และ Authorization

* มีระบบเก็บ Token หรือ Session หรือไม่
* มี Protected Route หรือไม่
* มี Role Guard หรือไม่
* ซ่อนเมนูตาม Role หรือไม่
* มีการ Redirect เมื่อไม่มีสิทธิ์หรือไม่
* มีความเสี่ยงจากการเก็บ Token หรือไม่

### Maintainability

* Page มีขนาดใหญ่เกินไปหรือไม่
* Component ถูกนำกลับมาใช้ซ้ำหรือไม่
* มี Logic ซ้ำกันหรือไม่
* Type ถูกกำหนดเหมาะสมหรือไม่
* มี `any` จำนวนมากหรือไม่
* มี Hard-coded URL หรือไม่
* มี Hard-coded Data หรือไม่
* Environment Variable ถูกใช้งานหรือไม่
* มี Circular Dependency หรือไม่

### Localization

* รองรับภาษาไทยและภาษาอังกฤษจริงหรือไม่
* มีระบบ i18n หรือไม่
* ข้อความถูก Hard-code ใน Component หรือไม่
* มีปุ่มเปลี่ยนภาษาหรือไม่

### Accessibility

* รูปภาพมี `alt` หรือไม่
* Input มี Label หรือไม่
* Button ใช้ Element ที่ถูกต้องหรือไม่
* รองรับ Keyboard หรือไม่
* สีและข้อความอ่านง่ายหรือไม่
* Icon Button มีชื่ออธิบายหรือไม่

---

## 12. ขั้นตอนที่ 8: ตรวจสอบผลหลังแก้ไข

หลังจัด Formatting และปรับ Clean Code แล้ว ให้ตรวจสอบตามลำดับ:

1. ตรวจสอบ Git Diff:

```bash
git diff
```

2. ตรวจสอบว่าไม่มี Business Logic ถูกเปลี่ยนโดยไม่ตั้งใจ

3. ตรวจสอบว่าไม่มี Route หรือ API Endpoint ถูกเปลี่ยน

4. ตรวจสอบว่าไม่มีข้อความหรือ UI หายไป

5. รันคำสั่งที่มีอยู่จริงใน `package.json` เช่น:

```bash
npm run lint
npm run typecheck
npm run build
```

6. หากใช้ Package Manager อื่น ให้ใช้ตาม Lock File ของโปรเจกต์:

* `package-lock.json` ใช้ npm
* `yarn.lock` ใช้ Yarn
* `pnpm-lock.yaml` ใช้ pnpm

7. ห้ามติดตั้ง Package ใหม่โดยไม่จำเป็น

8. หาก Build, Lint หรือ Type Check ไม่ผ่าน ให้ระบุ:

* คำสั่งที่ใช้
* Error ที่พบ
* Error เกิดก่อนหรือหลังแก้ไข
* ไฟล์ที่เกี่ยวข้อง
* สามารถแก้ไขได้หรือไม่
* เหตุผลที่ยังไม่ได้แก้

ห้ามซ่อน Error หรือเขียนว่าผ่าน หากคำสั่งไม่ผ่านจริง

---

## 13. รูปแบบไฟล์รายงานที่ต้องสร้าง

สร้างไฟล์:

```text
frontend/docs/FRONTEND_ANALYSIS_TH.md
```

รายงานต้องเขียนเป็นภาษาไทยที่เข้าใจง่าย และประกอบด้วยหัวข้อต่อไปนี้

# รายงานการวิเคราะห์ Frontend ระบบ UniResearch

## 1. บทสรุปภาพรวม

อธิบายสั้น ๆ ว่า:

* Frontend ใช้ Technology อะไร
* ระบบอยู่ในระดับใด
* ฟังก์ชันหลักที่ทำแล้ว
* ฟังก์ชันหลักที่ยังขาด
* ปัญหาสำคัญที่พบ
* ผลจากการจัด Formatting

## 2. Technology Stack

จัดทำตาราง:

| หัวข้อ           | รายละเอียด |
| ---------------- | ---------- |
| Framework        |            |
| Language         |            |
| Build Tool       |            |
| Styling          |            |
| Router           |            |
| State Management |            |
| API Client       |            |
| Form Library     |            |
| Validation       |            |
| Icon Library     |            |
| Testing          |            |
| Package Manager  |            |

หากไม่พบให้ระบุว่า `ไม่พบในโปรเจกต์`

## 3. โครงสร้างโฟลเดอร์ Frontend

แสดง Directory Tree แบบกระชับ เช่น:

```text
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── ...
├── public/
├── package.json
└── ...
```

ไม่ต้องแสดง `node_modules` หรือไฟล์ที่ไม่เกี่ยวข้อง

## 4. หน้าที่ของแต่ละโฟลเดอร์

จัดทำตาราง:

| โฟลเดอร์ | หน้าที่ | เชื่อมกับส่วนใด | หมายเหตุ |
| -------- | ------- | --------------- | -------- |

## 5. หน้าที่ของแต่ละไฟล์สำคัญ

จัดทำตาราง:

| Path ไฟล์ | ประเภท | หน้าที่ | ถูกเรียกใช้จาก | เชื่อมต่อกับ | สถานะ |
| --------- | ------ | ------- | -------------- | ------------ | ----- |

ประเภทไฟล์ เช่น:

* Page
* Component
* Layout
* Route
* Service
* Hook
* Context
* Store
* Utility
* Type
* Config

ไม่จำเป็นต้องอธิบายไฟล์ Asset ทุกไฟล์ แต่ต้องครอบคลุม Source Code สำคัญทั้งหมด

## 6. แผนผัง Routes และ Pages

จัดทำตาราง:

| URL | Page | สิทธิ์ | Layout | สถานะ | หมายเหตุ |
| --- | ---- | ------ | ------ | ----- | -------- |

## 7. การเชื่อมโยงการทำงานของ Frontend

อธิบาย Flow สำคัญ เช่น:

```text
ผู้ใช้เปิดหน้า Login
→ กรอกข้อมูล
→ เรียก Auth Service
→ ส่ง Request ไป Backend
→ เก็บ Token
→ Redirect ไป Dashboard
```

ให้จัดทำ Flow ตามที่พบจริงในโค้ด เช่น:

* Login
* Register
* Search
* Research Detail
* Submit Research
* Upload PDF
* Favorite
* Review
* Admin Dashboard

หาก Flow ใดยังไม่มี ให้ระบุว่าไม่พบ

## 8. การเชื่อมต่อ API

จัดทำตาราง:

| Method | Endpoint | Service | ผู้เรียกใช้ | วัตถุประสงค์ | สถานะ |
| ------ | -------- | ------- | ----------- | ------------ | ----- |

## 9. เปรียบเทียบกับ Functional Requirements

จัดทำ Requirement Traceability Matrix ครบทุกข้อที่พบในเอกสาร Requirements

| Requirement | รายละเอียด | สถานะ | หลักฐาน | สิ่งที่ทำแล้ว | สิ่งที่ยังขาด |
| ----------- | ---------- | ----- | ------- | ------------- | ------------- |

## 10. การประเมิน Non-Functional Requirements

จัดทำตาราง:

| NFR | หัวข้อ | สถานะ | หลักฐาน | ข้อเสนอแนะ |
| --- | ------ | ----- | ------- | ---------- |

ให้ประเมินอย่างน้อย:

* Usability
* Localization
* Accessibility
* Security
* Data Integrity ในมุม Frontend
* Performance
* Maintainability
* Reliability
* Scalability
* File Support

## 11. รายการไฟล์ที่ปรับ Formatting

จัดทำตาราง:

| Path ไฟล์ | ปัญหาก่อนแก้ | สิ่งที่ปรับ | มีการเปลี่ยน Logic หรือไม่ |
| --------- | ------------ | ----------- | -------------------------- |

ค่าของคอลัมน์ `มีการเปลี่ยน Logic หรือไม่` ควรเป็น:

```text
ไม่มี
```

หากมีการเปลี่ยน Logic ต้องอธิบายเหตุผลอย่างละเอียด

## 12. ปัญหาที่พบในโค้ด

แบ่งประเภทเป็น:

### ปัญหาระดับสูง

ปัญหาที่ทำให้ระบบใช้งานไม่ได้ เช่น:

* Build ไม่ผ่าน
* Route ใช้งานไม่ได้
* Import ผิด
* API Client ผิด
* Authentication ไม่ทำงาน

### ปัญหาระดับกลาง

เช่น:

* ใช้ Mock Data
* ไม่มี Error Handling
* ไม่มี Validation
* Page ยังไม่เชื่อม API
* Role Guard ไม่ครบ

### ปัญหาระดับต่ำ

เช่น:

* Formatting
* ชื่อ Variable ไม่ชัดเจน
* Component ใหญ่
* Code ซ้ำ
* Hard-coded Text

## 13. สิ่งที่ Frontend ทำเสร็จแล้ว

สรุปเป็นรายการ โดยต้องมีหลักฐานจากไฟล์จริง

ตัวอย่างรูปแบบ:

```text
- มีหน้าเข้าสู่ระบบแล้ว
  - ไฟล์: src/pages/LoginPage.tsx
  - Route: /login
  - สถานะการเชื่อม API: เชื่อมแล้ว/ยังเป็น Mock
```

## 14. สิ่งที่ทำบางส่วน

อธิบายว่าส่วนใดทำแล้ว และยังขาดอะไร

## 15. สิ่งที่ยังไม่ได้ทำ

เรียงตาม Requirements และผลกระทบต่อระบบ

## 16. งานที่ควรทำต่อ

แบ่ง Priority ดังนี้:

### P0 — ต้องแก้ก่อนจึงจะใช้งานระบบได้

เช่น Build Error, Route Error, Authentication Error

### P1 — ฟังก์ชันหลักตาม Requirements

เช่น Submission, Search, Review, Admin Management

### P2 — คุณภาพและประสบการณ์ใช้งาน

เช่น Responsive, Accessibility, Empty State, Error State

### P3 — ฟังก์ชันเพิ่มเติมในอนาคต

เช่น Recommendation, AI Summary, Plagiarism Check

แต่ละงานต้องระบุ:

| Priority | งาน | Requirement | ไฟล์ที่คาดว่าจะเกี่ยวข้อง | เหตุผล |
| -------- | --- | ----------- | ------------------------- | ------ |

## 17. ผลการตรวจสอบ Build และคุณภาพโค้ด

จัดทำตาราง:

| คำสั่ง | ผลลัพธ์ | Error ที่พบ | หมายเหตุ |
| ------ | ------- | ----------- | -------- |

## 18. ความเสี่ยงและข้อควรระวัง

ระบุความเสี่ยง เช่น:

* Frontend และ Backend ใช้ชื่อฟิลด์ไม่ตรงกัน
* มี Mock Data ปะปนกับ API จริง
* Token ถูกเก็บไม่ปลอดภัย
* Route Guard ตรวจสอบเฉพาะฝั่ง Client
* Environment Variable ไม่ครบ
* Component ขนาดใหญ่เกินไป
* ไม่มี Test

## 19. ลำดับการพัฒนาที่แนะนำ

สรุปลำดับงานที่ควรทำต่อเป็นขั้นตอน เช่น:

```text
1. แก้ Build และ Type Error
2. จัดระบบ API Service
3. ทำ Authentication และ Role Guard ให้ครบ
4. เชื่อมหน้า Research List และ Detail
5. ทำระบบ Submission และ Upload
6. ทำ Review Workflow
7. ทำ Admin Dashboard
8. เพิ่ม Validation, Loading และ Error State
9. เพิ่ม Responsive และ Accessibility
10. เพิ่ม Test
```

ลำดับจริงต้องอ้างอิงจากสิ่งที่พบในโปรเจกต์

---

## 14. รูปแบบการเขียนรายงาน

รายงานต้อง:

* เขียนเป็นภาษาไทย
* ใช้คำอธิบายที่นักศึกษาหรือสมาชิกในทีมอ่านเข้าใจง่าย
* ระบุ Path ไฟล์จริง
* ใช้ Requirement ID
* แยกสิ่งที่ทำแล้วและยังไม่ทำอย่างชัดเจน
* ไม่สรุปเกินหลักฐาน
* ไม่ใช้คำกว้าง ๆ เช่น “ระบบสมบูรณ์แล้ว” หากยังไม่ได้ตรวจสอบครบ
* ใช้ Markdown Table เมื่อต้องเปรียบเทียบข้อมูล
* ใช้ Code Block สำหรับ Path, Route หรือ Flow
* ระบุว่าใช้ Mock Data หรือ API จริง
* ระบุปัญหาเดิมที่มีอยู่ก่อนการแก้ไข
* ระบุไฟล์ที่ถูกแก้ไขจริง

---

## 15. ผลลัพธ์สุดท้ายที่ต้องส่งมอบ

เมื่อทำงานเสร็จ ต้องมีผลลัพธ์ดังนี้:

1. ไฟล์ Page และ Component ที่เป็นบรรทัดเดียวถูกจัด Formatting ให้อ่านง่าย
2. โค้ดที่แก้ไขต้องไม่เปลี่ยนพฤติกรรมเดิมโดยไม่จำเป็น
3. ไม่มีการลบการเปลี่ยนแปลงเดิมของผู้ใช้
4. มีไฟล์รายงาน:

```text
frontend/docs/FRONTEND_ANALYSIS_TH.md
```

5. รายงานต้องอธิบาย:

   * โครงสร้าง Frontend
   * หน้าที่ของแต่ละไฟล์สำคัญ
   * Routes และ Pages
   * การเชื่อมต่อ API
   * Flow การทำงาน
   * สิ่งที่ทำแล้ว
   * สิ่งที่ทำบางส่วน
   * สิ่งที่ยังไม่ได้ทำ
   * การเปรียบเทียบกับ Requirements
   * รายการไฟล์ที่จัด Formatting
   * ผลการ Build, Lint และ Type Check
   * งานที่ควรทำต่อเรียงตาม Priority

---

## 16. สรุปผลใน Terminal เมื่อทำเสร็จ

เมื่อทำงานทั้งหมดเสร็จ ให้แสดงสรุปแบบสั้นใน Terminal ด้วยรูปแบบนี้:

```text
สรุปการตรวจสอบ Frontend UniResearch

- จำนวนไฟล์ที่ตรวจสอบ:
- จำนวนไฟล์ที่ปรับ Formatting:
- จำนวน Requirements ที่เสร็จแล้ว:
- จำนวน Requirements ที่ทำบางส่วน:
- จำนวน Requirements ที่ยังไม่ได้ทำ:
- ผลการ Build:
- ผลการ Lint:
- ผลการ Type Check:
- ไฟล์รายงาน:
  frontend/docs/FRONTEND_ANALYSIS_TH.md

ไฟล์ที่มีการแก้ไข:
- ระบุ Path ไฟล์

ปัญหาสำคัญที่พบ:
- ระบุปัญหา

งานที่ควรทำต่อเป็นอันดับแรก:
- ระบุงาน
```

---

## 17. คำสั่งเริ่มต้น

เริ่มดำเนินการตามลำดับต่อไปนี้:

1. ตรวจสอบตำแหน่งปัจจุบันของโปรเจกต์
2. ตรวจสอบ `git status`
3. อ่าน `frontend/docs/UniResearch_Requirements_Analysis.md`
4. อ่าน `frontend/package.json`
5. ตรวจสอบโครงสร้าง `frontend/src`
6. วิเคราะห์ Routes, Pages, Components, Services และ API
7. จัด Formatting ไฟล์ที่เป็นบรรทัดเดียว
8. ตรวจสอบ Git Diff
9. รัน Build, Lint และ Type Check ตาม Script ที่มีจริง
10. สร้าง `frontend/docs/FRONTEND_ANALYSIS_TH.md`
11. ตรวจสอบว่ารายงานอ้างอิงไฟล์จริงและ Requirements ครบ
12. แสดงสรุปผลสุดท้ายใน Terminal

ให้ดำเนินการจนจบโดยไม่หยุดเพียงแค่เสนอแผนการทำงาน
