# Test Plan Discrepancies

## DEF-FE-003
Master Test Plan describes DEF-FE-003 as:
`หน้า /admin คัดกรองเพียง Session (ฝั่ง UI) หากผู้ใช้สุ่มเข้าถึงหน้าลูกอาจหลุดเข้าไปได้ชั่วขณะ (แม้ API จะบล็อก)`
It suggests creating `middleware.ts` to check JWT roles at the Edge before rendering `/admin`.

Frontend Test Case Specification states for TC-FE-004:
`middleware.ts (หรือ HOC) ต้องทำการตรวจจับและ Redirect กลับไปยังหน้าหลัก หรือแสดงหน้า 403 Forbidden ทันที`

**Observed implementation:**
No `middleware.ts` exists in the codebase.
`app/admin/layout.tsx` checks only for `hasSession()` (presence of any valid token). It does not check the role.
`app/admin/page.tsx` loads data without checking the role. Since the backend API rejects requests with a 403 status (when backend is available), the page handles the fetch errors by defaulting to empty data. However, the UI still renders completely for a student, showing the admin dashboard structure.

**Decision:**
This is an active defect (DEF-FE-003). I wrote the E2E test to verify if a lower-privileged user can access `/admin`. The test fails because the user is indeed allowed to view the admin UI structure, meaning the defect is still present. This needs to be reported in the test execution report.
