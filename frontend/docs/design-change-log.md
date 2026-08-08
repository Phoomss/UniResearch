# Frontend design change log

## 2026-08-03 — all implemented routes

- **Problem:** tablet header crowding, weak editorial differentiation between passive panels and active forms, marginal mobile rail clearance, silent loading skeletons, unassociated form hints, and non-focusable scroll tables.
- **Change:** refined shared typography/spacing/radius/elevation and responsive breakpoints; added form folio rules, dashboard maximum width, mobile safe area, complete disabled styles, accessible hint/loading relationships, and keyboard table regions.
- **Files changed:** `frontend/app/globals.css`, `frontend/src/components/ui.tsx`, `frontend/src/features/admin/category-table.tsx`, design tests, progress/report documentation.
- **Tests executed:** `pnpm.cmd test`, `pnpm.cmd typecheck`, `pnpm.cmd lint`, `pnpm.cmd build`; local desktop/mobile screenshot capture for nine representative routes.
- **Result:** automated checks and production build passed; generated screenshots were inspected. Real-backend populated states remain for manual review.
- **Backend unchanged:** confirmed; no file under `backend/` was modified or created.
