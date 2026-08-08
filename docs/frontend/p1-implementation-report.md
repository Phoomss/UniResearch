# P1 frontend implementation report

Implementation date: 2026-08-03.

## Pages implemented

- `/account/saved`: role-neutral authenticated favorites index showing only backend-provided research IDs and saved timestamps.
- `/admin`: authenticated workspace containing only the four supported global totals and a link to category management.
- `/admin/categories`: category list and administrator-authorized create form with loading, empty, error, forbidden, pending, and success states.
- `/dashboard/reviewer`: usable known-positive-ID entry to `/advisor/reviews/[id]`, while explicitly stating that no queue exists.
- `/dashboard/student` now redirects to `/account/saved`; `/dashboard/admin` now redirects to `/admin`. Existing `/dashboard/student/submit` continues to redirect to `/student/research/new`.
- `/login` and `/register` were completed for the supported contract: safe same-origin return routing, focused coded errors, disabled pending controls, and removal of unsupported registration profile fields.

## API integrations

| Surface | Backend contract |
|---|---|
| Saved research | `GET /favorites/` with bearer token |
| Admin overview | `GET /stats/` |
| Category management | `GET /categories/`; `POST /categories/` with bearer token |
| Login | `POST /auth/login`, translated to OAuth form fields by the existing BFF |
| Registration | `POST /auth/register`, with frontend-forced `student` role |

Saved research deliberately does not fan out to detail endpoints because every `GET /research/{id}` increments views. Category creation refreshes the server-rendered list after success. The reviewer landing performs navigation only and makes no fabricated queue request.

## Role restrictions

- Saved research requires any active authenticated user.
- Admin pages require token presence for workspace access, but only backend `POST /categories/` can authoritatively establish the admin role. Public category/stat responses are not treated as role proof.
- Reviewer landing requires token presence; review permission remains enforced by the backend when the advisor/admin submits a decision.
- Registration always sends `role: "student"`; no role selector is exposed.

## Components

Reused: `DashboardShell`, `StatePanel`, `Button`, `ButtonLink`, `Field`, `Input`, `Textarea`, `CategoryForm`, shared API/session/error helpers, and existing editorial table/panel patterns.

Added: `SavedResearchList`, `CategoryTable`, and `KnownResearchIdForm`. Shared CSS adds archive-row, category workspace, admin callout, screen-reader-only caption, and responsive rules without introducing a new design system.

## Tests

| Command | Result |
|---|---|
| `pnpm.cmd test` | 16 passed, 0 failed |
| `pnpm.cmd typecheck` | Passed |
| `pnpm.cmd lint` | Passed |
| `pnpm.cmd build` | Passed; `/account/saved`, `/admin`, and `/admin/categories` compiled |
| `pnpm.cmd test:e2e` | Runner passed; 6 guarded P0/P1 tests skipped |

Three guarded P1 Playwright flows were added for saved research, reviewer known-ID entry, and admin overview/categories. They did not execute because disposable student/advisor/admin credentials were not present. No write was attempted against an unknown backend, and no P1 page is marked fully `Tested`.

## Remaining pages and blocked features

The optional P2 `/categories` public index and public route-state refinements remain. Blocked features remain unchanged: current-user/profile management, student submission tracking, drafts/edit/revisions/resubmission, advisor queue/history/scoring, admin research/user/review management, detailed analytics/logs, category edit/delete/detail, OAuth, password recovery, email verification, notifications, citations, and related research.

## Backend limitations

- Favorites contain no research metadata.
- Stats are public totals rather than protected or segmented analytics.
- Categories support list/create only; duplicate behavior is not normalized by the backend.
- There is no current-user endpoint, so frontend navigation cannot authoritatively identify roles.
- There is no review queue; a known ID must come from outside the API.
- Registration accepts profile fields in its schema, but the service does not persist them; they were removed from the active form.

## Backend integrity

No backend file was modified, formatted, renamed, or created. No database migration or write-operation backend test was run. Final Git verification found no change under `backend/`.
