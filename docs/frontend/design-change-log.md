# Frontend design change log

## 2026-08-03 — all implemented routes

- **Problem:** tablet header crowding, weak editorial differentiation between passive panels and active forms, marginal mobile rail clearance, silent loading skeletons, unassociated form hints, and non-focusable scroll tables.
- **Change:** refined shared typography/spacing/radius/elevation and responsive breakpoints; added form folio rules, dashboard maximum width, mobile safe area, complete disabled styles, accessible hint/loading relationships, and keyboard table regions.
- **Files changed:** `frontend/app/globals.css`, `frontend/src/components/ui.tsx`, `frontend/src/features/admin/category-table.tsx`, design tests, progress/report documentation.
- **Tests executed:** `pnpm.cmd test`, `pnpm.cmd typecheck`, `pnpm.cmd lint`, `pnpm.cmd build`; local desktop/mobile screenshot capture for nine representative routes.
- **Result:** automated checks and production build passed; generated screenshots were inspected. Real-backend populated states remain for manual review.
- **Backend unchanged:** confirmed; no file under `backend/` was modified or created.

## 2026-08-10 — pagination, directory, migration and layout improvements

- **Problem:** Missing pagination and filtering controls on administrative directories (research, users, participants), lacking mobile responsiveness on admin/reviewer shells, and absence of database SSL configurations for production, plus missing seed data.
- **Change:**
  - Integrated Pagination and Search/Role Filters to `ParticipantDirectory`, `AdminResearchManager`, `AdminReviewDecision`, and `AdminUserManager`.
  - Added responsive sidebar menus and hamburger navigation for mobile viewports, displaying user profiles inside `SiteHeader`.
  - Added data migration script (`migrate_csv.py`) supporting advisor and student imports from CSV files.
  - Implemented secure database connections with optional `DB_SSL` support for production deployments.
- **Files changed:**
  - `backend/app/scripts/migrate_csv.py`, `backend/app/scripts/student.csv`, `backend/app/scripts/advisors.csv`
  - `backend/app/services/research_service.py`
  - `frontend/app/admin/reviews/[id]/page.tsx`
  - `frontend/app/api/assets/route.ts`
  - `frontend/app/research/[id]/page.tsx`
  - `frontend/src/components/LanguageSwitch.tsx`
  - `frontend/src/features/admin/admin-research-manager.tsx`, `admin-review-decision.tsx`, `admin-user-manager.tsx`
  - `frontend/src/features/advisor/participant-directory.tsx`
- **Result:** All page tables support paging and text-based filter matching. User layout adjusts correctly for small screen sizes, and data imports can be run successfully.

