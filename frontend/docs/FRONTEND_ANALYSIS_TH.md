# รายงานวิเคราะห์ Frontend: UniResearch

วันที่ตรวจ: 6 สิงหาคม 2026  
ขอบเขต: ตรวจโค้ดจริงภายใต้ `frontend/` เทียบกับ `docs/UniResearch_Requirements_Analysis.md` โดยไม่แก้ไข `backend/`

## สรุป

Frontend เป็น Next.js App Router ที่เชื่อม FastAPI ผ่าน server-side API client และ Next.js Route Handlers สำหรับ mutation ที่ต้องมี JWT. ฟังก์ชันสาธารณะหลัก (หน้าแรก, ค้นหา, รายละเอียด, สมัคร/เข้าสู่ระบบ) และส่วนที่ backend รองรับ (ส่งผลงานแบบครั้งเดียว, favorite, review ด้วย ID ที่ทราบ, สร้าง/list หมวดหมู่) มี UI แล้ว แต่ requirements จำนวนมากยังทำได้เพียงบางส่วนหรือทำไม่ได้เพราะ backend ไม่มี endpoint รองรับ. ไม่มีหลักฐานว่าระบบตรวจบทบาทจาก profile ปัจจุบันได้ เนื่องจากไม่มี `/me`.

## Technology stack และโครงสร้าง

| รายการ | หลักฐาน | หน้าที่ |
|---|---|---|
| Next.js 16.2.12, React 19.2.4, TypeScript | `package.json` | Web app แบบ App Router; TypeScript strict ตาม `tsconfig.json` |
| CSS/Tailwind PostCSS | `app/globals.css`, `postcss.config.mjs`, `package.json` | design token และ responsive CSS อยู่ใน global stylesheet |
| ESLint, Node test, Playwright | `eslint.config.mjs`, `tests/*.test.mjs`, `e2e/*.spec.mjs` | static check, contract/UI test, E2E ที่ต้องใช้ disposable fixture |
| `app/` | `app/layout.tsx`, `app/**/page.tsx` | routes, Server Components, loading/error/not-found boundary และ Route Handlers |
| `src/components/` | `src/components/ui.tsx`, `shells.tsx`, `research.tsx` | UI primitives, layout shell, card/action แสดงผลผลงาน |
| `src/features/` | `src/features/auth`, `research`, `review`, `admin` | client interaction และ feature-specific API/adapters |
| `src/lib/api/` | `client.ts`, `types.ts`, `errors.ts`, `session.ts` | API client, type, normalize error, HttpOnly-cookie session |

## Routes และหน้าที่

| Route | หลักฐาน | สถานะ/ข้อมูล |
|---|---|---|
| `/` | `app/page.tsx` | `/stats/`, `/home/latest`, `/home/popular`, `/categories/` ผ่าน `get*` |
| `/login`, `/register` | `app/login/page.tsx`, `app/register/page.tsx` | form ไปยัง Route Handler `/api/auth/login`, `/api/auth/register` |
| `/research`, `/research/[id]` | `app/research/page.tsx`, `app/research/[id]/page.tsx` | ค้นหาและรายละเอียด; detail มี favorite/download action |
| `/student/research/new` | `app/student/research/new/page.tsx`, `src/features/research/submission-form.tsx` | wizard multipart สร้างผลงาน |
| `/account/saved` | `app/account/saved/page.tsx` | list favorite เป็น ID/timestamp ตาม response จริง |
| `/dashboard/reviewer`, `/advisor/reviews/[id]` | `app/dashboard/reviewer/page.tsx`, `app/advisor/reviews/[id]/page.tsx` | เปิด review จาก ID ที่ทราบ ไม่มี queue |
| `/admin`, `/admin/categories` | `app/admin/page.tsx`, `app/admin/categories/page.tsx` | totals และ create/list categories |
| legacy redirects | `app/dashboard/student/page.tsx`, `app/dashboard/student/submit/page.tsx`, `app/dashboard/admin/page.tsx` | redirect ไป canonical routes |

## API/data flow และ authentication

Server Component → `src/features/research/api.ts` → `src/lib/api/client.ts` → `BACKEND_API_URL` เป็น flow หลักสำหรับ read. การ submit/login/favorite/review/category ใช้ browser → same-origin `/app/api/**/route.ts` → backend เพื่อหลีกเลี่ยง CORS. `app/api/research/route.ts` ส่ง multipart field ตรงตาม contract (`title_th`, `author_ids`, `cover_image`, `document` เป็นต้น) และไม่ตั้ง multipart Content-Type เอง.

`app/api/auth/login/route.ts` รับ token JSON จาก backend แล้ว `src/lib/api/session.ts` เก็บใน cookie `HttpOnly`, `SameSite=Lax`, อายุ 30 นาที; browser ไม่เก็บ JWT ใน localStorage. Route Handler แนบ Bearer token จาก cookie. หน้าที่ยืนยันตัวตนได้เพียงตรวจว่ามี token (`hasSession()`); ไม่มี current-user/profile endpoint สำหรับยืนยัน role ฝั่ง UI. Backend capability และข้อจำกัดที่ frontend ใช้อ้างอิงถูกบันทึกเดิมไว้ใน `docs/backend-capability-map.md`.

ความเสี่ยงสำคัญ: `src/features/research/adapters.ts` สร้าง `coverUrl` เป็น `/api/assets?...` แต่ไม่มี `app/api/assets/route.ts` ใน repository จึงไม่มีหลักฐานว่ารูปปกจะแสดงได้.

## เทียบ Functional Requirements

| Requirement | สถานะ | หลักฐาน/ข้อจำกัด |
|---|---|---|
| FR-1.1 | เสร็จบางส่วน | สมัคร/ล็อกอินมีใน `app/register/page.tsx`, `app/login/page.tsx`, Route Handlers auth; ไม่มี reset/OAuth |
| FR-1.2 | ขาด | ไม่พบ route หรือ API profile; backend map ระบุไม่มี current-user/update |
| FR-1.3 | เสร็จบางส่วน | `src/lib/api/types.ts` มี `guest/student/advisor/admin`; register บังคับ `student` ใน `app/api/auth/register/route.ts` |
| FR-1.4 | เสร็จบางส่วน | cookie/Bearer และ backend 401/403 handling มีใน forms/routes แต่ UI ไม่รู้ role จริง และ backend เป็นผู้ตัดสินสิทธิ์ |
| FR-2.1, FR-2.5 | เสร็จบางส่วน | wizard ใน `submission-form.tsx` มี titles, abstract, people IDs, metadata, cover/PDF; participant lookup `/research/participants` ไม่มีใน capability map จึงยืนยัน runtime ไม่ได้ |
| FR-2.2 | เสร็จบางส่วน | form ส่ง `author_ids` หลายคน; ไม่มี read/update author relation เพื่อยืนยันผลหลังบันทึก |
| FR-2.3, FR-2.4 | ขาด | ไม่พบ UI/API update, draft, resubmit หรือ revision |
| FR-3.1 | เสร็จบางส่วน | `/research` ส่ง `q`, `category_id` จาก `src/features/research/api.ts`; backend รองรับ title/keyword และ category เท่านั้น ไม่รองรับ author/advisor/department/year/type |
| FR-3.2 | เสร็จบางส่วน | มี keyword/category filter; ไม่มี filter อื่น, sort, pagination |
| FR-4.1 | เสร็จบางส่วน | `app/research/[id]/page.tsx` แสดง scalar metadata/count/keyword และ action; response ไม่มี author, advisor, related works, reviews, PDF preview |
| FR-4.2 | ขาด | ไม่พบ related-work API หรือ UI |
| FR-5.1 | เสร็จบางส่วน | upload อยู่ใน create form, backend ไม่มี separate upload/revision |
| FR-5.2 | เสร็จบางส่วน | `src/features/research/actions.tsx` เรียก download Route Handler แต่ backend handshake ต้อง auth; ไม่มี public reader/preview และ Content-Disposition ขึ้นกับ upstream |
| FR-5.3 | ยืนยันไม่ได้จาก frontend | UI แสดง `download_count`; การเพิ่ม log/count เป็นพฤติกรรม backend จึงต้องทดสอบกับ disposable backend |
| FR-6.1 | เสร็จบางส่วน | `review-form.tsx` ส่ง approved/rejected โดย advisor/admin ที่ backend อนุญาต; ไม่มี completeness checklist/queue |
| FR-6.2 | เสร็จบางส่วน | UI เห็น pending/approved/rejected; draft, published และ workflow needs-revision ที่ใช้งานได้ไม่มีหลักฐาน |
| FR-6.3 | เสร็จบางส่วน | ส่ง comment ได้ใน `review-form.tsx`; ไม่มี endpoint อ่าน comment/history หรือส่งกลับเพื่อแก้ไข |
| FR-7.1 | เสร็จบางส่วน | `app/admin/categories/page.tsx` list/create; edit/delete ไม่มี endpoint และ UI |
| FR-7.2 | เสร็จบางส่วน | category filter ใน `/research`; ไม่มี category detail/index route |
| FR-8.1 | เสร็จบางส่วน | favorite action ใน `actions.tsx`, proxy `app/api/research/[id]/favorite/route.ts` |
| FR-8.2 | เสร็จบางส่วน | `/account/saved` เรียก `listFavorites`; backend คืนเพียง ID/timestamp จึงแสดง metadata งานไม่ได้ |
| FR-9.1 | เสร็จ | หน้าแรกเรียก latest ใน `app/page.tsx` |
| FR-9.2 | เสร็จบางส่วน | มี popular ตาม view count; ไม่มี download-most |
| FR-9.3 | ขาด | ไม่พบ weekly recommendation หรือ trending categories |
| FR-10.1 | เสร็จบางส่วน | `/admin` แสดง 4 total จาก `/stats/`; ไม่มี author/advisor breakdown, yearly/category/search analytics |
| FR-10.2 | เสร็จบางส่วน | มี admin overview แต่ไม่มี dashboard analytics ครบตาม requirement |
| FR-11.1 | ขาด/บางส่วน | จัดการ category ได้เพียง create/list; ไม่พบ user, research, document management |

## เทียบ Non-functional Requirements

| Requirement | สถานะ | หลักฐาน/ข้อจำกัด |
|---|---|---|
| NFR-1 Usability | เสร็จบางส่วน | shared UI, loading/error/empty states (`src/components/ui.tsx`) และ responsive CSS (`app/globals.css`); ยังไม่ได้ทดสอบ usability กับผู้ใช้จริง |
| NFR-2 Localization | ขาด/บางส่วน | UI ผสมไทยและอังกฤษ; ไม่พบ i18n provider, locale routing หรือ language switcher |
| NFR-3 Accessibility | เสร็จบางส่วน | semantic controls/labels, `aria-describedby`, alert/status และ responsive tests (`tests/design-system.test.mjs`); ยังไม่มี audit screen-reader/keyboard ครบระบบ |
| NFR-4 Security & Access Control | เสร็จบางส่วน | HttpOnly cookie และ server-to-server Bearer; role enforcement/asset visibility ต้องยืนยันกับ backend test environment |
| NFR-5 Data Integrity | เสร็จบางส่วน | typed contracts, form validation และ review step; ไม่มี profile/update/revision/read relations ให้ตรวจสอบความครบถ้วน |
| NFR-6 Performance | ยืนยันไม่ได้ | server read flow มี no-store และ search API, แต่ไม่มี pagination/cache/benchmark สำหรับข้อมูลมาก |
| NFR-7 Storage | ยืนยันไม่ได้จาก frontend | frontend เป็น client ของ central backend; persistence ต้องพิสูจน์ที่ backend/runtime |
| NFR-8 Reliability | ยืนยันไม่ได้จาก frontend | UI แสดง counters แต่ความถูกต้องของ log/count เป็น backend responsibility |
| NFR-9 Scalability/Maintainability | เสร็จบางส่วน | แยก client/types/adapters/features และ contract tests; source หลายไฟล์ยัง minified จึงลด maintainability, ไม่มี extension APIs สำหรับ AI/plagiarism/citation |
| NFR-10 File Support | เสร็จบางส่วน | form จำกัด JPEG/PNG/PDF ใน `submission-form.tsx`; backend ไม่มี MIME/size contract และ cover asset proxy หาย |

## การจัดรูปแบบที่ทำ

ใช้ ESLint ที่ติดตั้งอยู่ (`eslint.config.mjs`) เป็นเครื่องมือที่มีในโครงการ; ไม่มี Prettier/formatter หรือ config อื่นติดตั้งอยู่ จึงไม่เพิ่ม dependency. ปรับเฉพาะไฟล์ one-line ที่ปลอดภัยโดยคง UI/route/API/business logic:

- `app/dashboard/student/page.tsx`
- `app/dashboard/student/submit/page.tsx`
- `app/dashboard/admin/page.tsx`
- `app/account/saved/loading.tsx`
- `app/admin/loading.tsx`
- `src/lib/api/route-response.ts`

ยังมีไฟล์ minified อีกหลายไฟล์ (เช่น `app/page.tsx`, `src/features/research/submission-form.tsx`, `src/components/ui.tsx`). ควรจัด format ต่อเมื่อมี formatter ที่ได้รับอนุมัติและปรับ contract tests ที่ผูกกับ whitespace ก่อน; ปัจจุบัน test มี regex ที่พึ่งพาข้อความ minified ใน `tests/api-contract.test.mjs` จึงการ format แบบทั้งโครงการเสี่ยงทำให้ test ที่ไม่เกี่ยว behavior ล้มเหลว.

## ปัญหา/ความเสี่ยงและงานถัดไป (เรียงลำดับ)

1. แก้ stale generated type ใน `.next/types/validator.ts` ที่อ้าง `app/profile/page.js`; ต้องยืนยันก่อนว่า `/profile` ถูกลบโดยเจตนาและให้เจ้าของ workspace ทำ clean build output ตามนโยบาย เพราะรายงานนี้ไม่ลบ build output.
2. เพิ่ม/ยืนยัน Route Handler สำหรับ cover asset (`/api/assets`) หรือหยุดสร้าง URL ที่ไม่มี route เพื่อไม่ให้รูปปกเสีย.
3. ทำ integration/E2E กับ disposable test backend และ fixture จริงสำหรับ login, submit, review, download, favorite; ปัจจุบัน E2E ถูกออกแบบให้ skip เมื่อไม่มี environment variables.
4. ปิด gap ที่ backend รองรับได้ก่อน: role-aware navigation หากมี authoritative current-user API, category search UX และ favorite presentation; ส่วน profile, revision, queue, analytics, user management ต้องรอ backend capability ไม่ควร invent endpoint.
5. เลือก formatter ที่ได้รับอนุมัติ (เช่นเพิ่มภายหลังโดยเจ้าของโครงการ) แล้ว format source ทั้งชุดพร้อมเปลี่ยน tests ให้ตรวจ semantic ไม่ผูก whitespace.

## ผลการตรวจจริง

| คำสั่ง | ผล |
|---|---|
| `pnpm.cmd lint` | ไม่จบภายใน 120 วินาที (stdout แสดง `$ eslint` แล้ว process timeout); จึงยังไม่ยืนยัน lint pass |
| `pnpm.cmd typecheck` | ไม่ผ่าน: `.next/types/validator.ts(143,39)` หา `../../app/profile/page.js` ไม่พบ (stale build artifact) |
| `pnpm.cmd test` | ผ่าน 19/19 tests, 0 fail; ผลจากรอบก่อน format ซึ่งการเปลี่ยนเป็น formatting-only ไม่แตะ assertion ที่เกี่ยวข้อง |
| `pnpm.cmd build` | compile สำเร็จ แต่ไม่ผ่าน TypeScript ด้วย stale `app/profile/page.js` ข้างต้น |
| `pnpm.cmd test:e2e` | สำเร็จเชิงเทคนิค: พบ 6 tests และ skip ทั้งหมด เพราะไม่มี disposable fixture environment variables; จึงไม่ใช่การยืนยันกับ backend จริง |

ตรวจ `git status` ก่อนเริ่มแล้ว: มี user changes เดิมเป็นการลบ `workflow-pack/**` และ untracked `codex-prompts/CODEX_FRONTEND_ANALYSIS_PROMPT.md`, `frontend/docs/UniResearch_Requirements_Analysis.md`; ไม่ได้แก้หรือกู้คืนรายการเหล่านี้ และไม่มีการแก้ไฟล์ใต้ `backend/`.
