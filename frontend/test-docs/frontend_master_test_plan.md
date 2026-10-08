# เอกสารแผนการทดสอบระดับหน้าบ้าน (Frontend Master Test Plan)
**ระบบคลังข้อมูลวิทยานิพนธ์ งานวิจัย และโครงงานของมหาวิทยาลัย (UniResearch)**
**จัดทำโดย:** Sommai Supawong (Frontend developer)

---

## ส่วนที่ 1: ข้อมูลทั่วไปและขอบเขตการทดสอบ (Overview & Scope)

### 1.1 วัตถุประสงค์ (Objectives)
เพื่อควบคุมคุณภาพการพัฒนาซอฟต์แวร์ส่วนหน้าบ้าน (Frontend - Next.js) ของระบบ UniResearch ให้ได้มาตรฐานสากล ทั้งด้าน UI/UX, State Management, การทำงานร่วมกับ BFF (Backend-For-Frontend) และความสามารถในการเข้าถึง (Accessibility) โดยการใช้ Automation Testing ควบคู่กับ Manual Testing

### 1.2 ขอบเขตการทดสอบ (Scope)
*   **In-Scope:** การเรนเดอร์ UI Components, การนำทาง (Routing) ควบคุมสิทธิ์ด้วย RBAC, การจัดการฟอร์ม (React Hook Form + Zod), การเรียกใช้งาน API (Axios) และ End-to-End Workflow (Playwright)
*   **Out-of-Scope:** ฐานข้อมูล PostgreSQL, โลจิกฝั่ง FastAPI Backend เชิงลึก

---

## ส่วนที่ 2: กลยุทธ์และสภาพแวดล้อมการทดสอบ (Test Strategy & Environment)

### 2.1 ระดับการทดสอบ (Testing Levels)
1.  **Unit/Component Test:** ทดสอบ UI Component ย่อย (เน้น Accessibility และ Rendering)
2.  **Integration Test:** ทดสอบการเชื่อมต่อ API โดยใช้เทคนิค Mocking (เช่น MSW) เพื่อไม่ให้ผูกติดกับ Backend
3.  **E2E Test (Playwright):** จำลองการคลิกและพิมพ์เหมือนผู้ใช้งานจริง (Browser Automation)

### 2.2 เกณฑ์การเริ่มและสิ้นสุด (Entry & Exit Criteria)
*   **Entry Criteria:** โค้ดถูก Merge ลง Branch สำหรับทดสอบ, สภาพแวดล้อม Next.js 16.x ทำงานสมบูรณ์
*   **Exit Criteria:**
    *   ไม่มี Error หรือ Warning จาก ESLint (Zero ESLint Debt)
    *   Test Cases ระดับ High & Critical ผ่าน 100%
    *   ไม่มี Defect ระดับ High คงค้างในระบบ

---

## ส่วนที่ 3: กรณีทดสอบส่วนหน้าบ้าน (Frontend Test Cases)

| รหัส (TC-ID) | กรณีทดสอบ (Scenario) | ประเภท | ผลที่คาดหวัง (Expected Result) |
| :--- | :--- | :--- | :--- |
| TC-FE-001 | Happy Path: นศ. กรอกข้อมูลฟอร์มส่งงานวิจัย และอัปโหลดไฟล์ PDF สมบูรณ์ | E2E / UI | Zod validation ผ่าน, แสดง Loading State, และ Redirect ไปหน้าสำเร็จพร้อมแสดง Toast Notification |
| TC-FE-002 | Negative: นศ. กด Submit ฟอร์มโดยไม่กรอกข้อมูล Title และไม่แนบไฟล์ PDF | Validation | ระบบแสดง Error messages สีแดงใต้ช่อง Input ที่ Required ทันทีโดยไม่ส่ง API Call (Client-side validation) |
| TC-FE-003 | Edge Case: RAG Chatbot (Gemini) ตอบกลับช้ากว่า 15 วินาที (Timeout) | Edge Case | UI แสดงสถานะ "กำลังประมวลผล..." และหากเกินเวลา ให้แสดง Fallback message อย่างสุภาพแทนที่จะพัง (Crash) |
| TC-FE-004 | Boundary: อัปโหลดภาพหน้าปกขนาด 25.1 MB (เกินลิมิต 25MB) | Boundary | React Hook Form ปฏิเสธไฟล์ทันทีและแจ้งเตือน "ขนาดไฟล์เกิน 25MB" ก่อนทำการอัปโหลด |
| TC-FE-005 | a11y: Playwright ควบคุมฟอร์ม "Thai title" และ "Reviewer comment" ผ่าน getByLabel | Accessibility | หา Element พบ และสามารถใช้ Screen Reader อ่านชื่อ Label ได้ตรงกับ Input Field |

---

## ส่วนที่ 4: บันทึกข้อบกพร่องและแนวทางแก้ไข (Defect Log & Solutions)

| DefectID | คำอธิบาย (Description) | ความรุนแรง | สถานะ | ข้อเสนอแนะเชิงเทคนิค (Solution) |
| :--- | :--- | :--- | :--- | :--- |
| DEF-FE-001 | UI Component `<Field>` ขาดการส่งค่า "id" ทำให้ Label ไม่ผูกกับ Input (กระทบ a11y และ E2E Playwright) | High | Open | แก้ `ui.tsx`: `React.cloneElement(child, { id: controlId, ... })` เพื่อส่ง id ไปยัง Input |
| DEF-FE-002 | ESLint Pipeline พัง (พบ 16 Errors, 8 Warnings) | Medium | Open | รัน `pnpm lint --fix` และเคลียร์ strict type issues บังคับใช้ Husky ก่อน commit |
| DEF-FE-003 | หน้า `/admin` คัดกรองเพียง Session (ฝั่ง UI) หากผู้ใช้สุ่มเข้าถึงหน้าลูกอาจหลุดเข้าไปได้ชั่วขณะ (แม้ API จะบล็อก) | Medium | Open | สร้าง Next.js `middleware.ts` ตรวจสอบ JWT Role ระดับ Edge ก่อน Render หน้าเพจ `/admin` |