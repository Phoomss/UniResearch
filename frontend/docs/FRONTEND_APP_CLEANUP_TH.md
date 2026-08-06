# รายงานการจัดรูปแบบโค้ด Frontend App

## 1. สรุปภาพรวม

- ตรวจ source TypeScript/TSX ทุกไฟล์ใต้ `frontend/app` จำนวน 36 ไฟล์ (และตรวจ `globals.css`/`favicon.ico` โดยไม่แก้)
- จัดรูปแบบเพิ่มในรอบนี้ 11 ไฟล์ที่เป็น one-line หรืออ่านยาก; พบ 5 ไฟล์ใน `app` ที่มี formatting-only change อยู่ก่อนเริ่มงานและเก็บไว้ตามเดิม
- ไม่เปลี่ยน route, API endpoint, payload, ข้อความ, class, state หรือ business logic
- Build: ผ่าน
- Lint: ผ่านโดยมี warning เดิม 1 รายการนอก `app`
- Type Check: ผ่าน

ไม่มี Prettier หรือ format script ใน `package.json`; ใช้ style ที่ปรากฏใน `eslint.config.mjs` และปรับแบบ manual เพื่อไม่ติดตั้งเครื่องมือเพิ่ม

## 2. โครงสร้าง Route และ Page

| Route | Path ไฟล์ | หน้าที่ | Component ที่เชื่อมต่อ |
|---|---|---|---|
| `/` | `app/page.tsx` | หน้าแรก/สถิติ/latest/popular | `SiteHeader`, `FolioCard`, research API |
| `/login`, `/register` | `app/login/page.tsx`, `app/register/page.tsx` | ยืนยันตัวตน/สมัคร | `AuthShell`, `LoginForm`, `RegisterForm` |
| `/research`, `/research/[id]` | `app/research/page.tsx`, `app/research/[id]/page.tsx` | ค้นหาและรายละเอียด | adapter, `ResearchActions` |
| `/student/research/new` | `app/student/research/new/page.tsx` | ส่งผลงาน | `SubmissionForm` |
| `/account/saved` | `app/account/saved/page.tsx` | รายการโปรด | `SavedResearchList` |
| `/dashboard/reviewer`, `/advisor/reviews/[id]` | `app/dashboard/reviewer/page.tsx`, `app/advisor/reviews/[id]/page.tsx` | หน้าเริ่ม review และ review ด้วย ID | `KnownResearchIdForm`, `ReviewForm` |
| `/admin`, `/admin/categories` | `app/admin/page.tsx`, `app/admin/categories/page.tsx` | totals และ category list/create | `CategoryTable`, `CategoryForm` |
| `/api/**` | `app/api/**/route.ts` | same-origin proxies/auth mutations | shared API/session modules |

## 3. ไฟล์ที่แก้ไข

| Path ไฟล์ | ปัญหาก่อนแก้ | สิ่งที่ปรับ | เปลี่ยน Logic หรือไม่ |
|---|---|---|---|
| `app/account/saved/error.tsx` | JSX/type รวมบรรทัดเดียว | แยก props/type/JSX | ไม่ |
| `app/admin/error.tsx` | JSX/type รวมบรรทัดเดียว | แยก props/type/JSX | ไม่ |
| `app/admin/categories/loading.tsx` | JSX รวมบรรทัดเดียว | จัด hierarchy loading UI | ไม่ |
| `app/admin/categories/error.tsx` | JSX/type รวมบรรทัดเดียว | จัด hierarchy error UI | ไม่ |
| `app/advisor/reviews/[id]/loading.tsx` | JSX รวมบรรทัดเดียว | จัด DashboardShell/StatePanel | ไม่ |
| `app/advisor/reviews/[id]/not-found.tsx` | JSX รวมบรรทัดเดียว | จัด empty state/link | ไม่ |
| `app/research/[id]/not-found.tsx` | JSX/style รวมบรรทัดเดียว | แยก JSX/style props | ไม่ |
| `app/student/research/new/loading.tsx` | JSX รวมบรรทัดเดียว | จัด loading UI | ไม่ |
| `app/register/page.tsx` | page JSX บรรทัดเดียว | แยก structure/props | ไม่ |
| `app/login/page.tsx` | helper/type/page JSX อัดรวม | แยก helper, async parameter และ JSX | ไม่ |
| `app/dashboard/reviewer/page.tsx` | auth guard/JSX อัดรวม | แยก guard และ dashboard JSX | ไม่ |

ไฟล์ `app/account/saved/loading.tsx`, `app/admin/loading.tsx`, `app/dashboard/admin/page.tsx`, `app/dashboard/student/page.tsx` และ `app/dashboard/student/submit/page.tsx` มี formatting-only change อยู่ก่อนเริ่มคำขอนี้ จึงรักษาไว้และไม่ย้อนการเปลี่ยนแปลงของผู้ใช้

## 4. ไฟล์ที่ตรวจสอบแต่ไม่แก้ไข

| Path ไฟล์ | เหตุผลที่ไม่แก้ |
|---|---|
| `app/layout.tsx`, `app/globals.css`, `app/favicon.ico` | layout/style/asset อ่านได้ หรือไม่ใช่ source page ที่ต้อง format |
| `app/page.tsx`, `app/research/page.tsx`, `app/research/[id]/page.tsx` | ตรวจแล้วมี JSX อัดรวมขนาดใหญ่; ควรใช้ formatter ที่ได้รับอนุมัติในงานถัดไปเพื่อหลีกเลี่ยงการเปลี่ยน whitespace แบบ manual จำนวนมาก |
| `app/student/research/new/page.tsx`, `app/advisor/reviews/[id]/page.tsx`, `app/admin/page.tsx`, `app/admin/categories/page.tsx` | logic/server data flow เดิมถูกต้อง แต่ยังควร format ต่อด้วย formatter ที่กำหนด |
| `app/api/**/route.ts`, error/loading ที่เหลือ | ตรวจ contract/import แล้ว; ไม่ปรับ endpoint/payload ใน cleanup รอบนี้ |

## 5. การเชื่อมโยงของแต่ละ Page

| Page | Import สำคัญ | State / Hook | API / Service | Route ที่เชื่อมต่อ |
|---|---|---|---|---|
| Home | shells/research/api | ไม่มี client state | `getStats`, `getLatest`, `getPopular` | `/` |
| Login/Register | auth shell/forms | form state อยู่ feature | `/api/auth/login`, `/api/auth/register` | `/login`, `/register` |
| Research list/detail | research components/adapters | action state อยู่ feature | search/detail/favorite/download | `/research`, `/research/[id]` |
| Submission | `SubmissionForm` | client wizard อยู่ feature | multipart `/api/research` | `/student/research/new` |
| Review | `ReviewForm` | form state อยู่ feature | `/api/research/[id]/review` | `/advisor/reviews/[id]` |
| Admin categories | category components | form state อยู่ feature | `/api/categories` | `/admin/categories` |

## 6. ปัญหาที่พบ

### ปัญหาระดับสูง

- ไม่มีปัญหาใหม่จากการจัด format; build และ type check ผ่าน

### ปัญหาระดับกลาง

- หลาย page/Route Handler ยังเป็น one-line source แต่ไม่มี Prettier/format script ที่ติดตั้งอยู่; การจัดทุกไฟล์ด้วยมือมีความเสี่ยงสูงต่อ JSX/contract tests ที่ตรวจ source text

### ปัญหาระดับต่ำ

- Lint warning เดิมที่ `src/features/research/submission-form.tsx:25:114`: `aria-invalid` ไม่รองรับกับ role `button`; อยู่นอก scope `app` และไม่ได้แก้

## 7. ผลการตรวจสอบ

| คำสั่ง | ผลลัพธ์ | Error หรือ Warning |
|---|---|---|
| `pnpm.cmd lint` | ผ่าน | warning เดิม 1 รายการตามข้างต้น |
| `pnpm.cmd typecheck` | ผ่าน | ไม่มี error |
| `pnpm.cmd test` | ผ่าน 19/19 | ไม่มี fail |
| `pnpm.cmd build` | ผ่าน | Next.js build สร้าง 20 routes สำเร็จ |

## 8. งานที่ควรทำต่อ

- เพิ่ม formatter ที่ได้รับอนุมัติพร้อม config หรือจัดให้มี script format ใน `package.json`; ใช้กับ page ที่เหลือใน `app` และแก้ tests ที่ตรวจ whitespace ให้ตรวจ semantics แทน
- จัด format ต่อที่ `app/page.tsx`, `app/research/page.tsx`, `app/research/[id]/page.tsx`, `app/student/research/new/page.tsx` ซึ่งเป็นไฟล์ใหญ่ที่อ่านยากที่สุด
- แก้ lint warning ใน `src/features/research/submission-form.tsx` หลังยืนยัน semantics ของ interactive element
