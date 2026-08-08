# Frontend page implementation progress

Audit date: 2026-08-03. Allowed status values are **Not started**, **In progress**, **Implemented**, **Integrated**, **Tested**, and **Blocked**.

`Integrated` means connected to verified backend-facing modules. `Tested` is reserved for pages that have completed the full contract, integration, production-build, accessibility/responsive, and real disposable-backend Playwright requirements.

| Priority | Route/workflow | Status | Current evidence | Next exit criterion |
|---|---|---|---|---|
| P0 | `/research/[id]` | Integrated | Public detail, category adapter, favorite/download BFF actions, loading/error/not-found boundaries; positive-ID handlers and accessible shared labels verified statically | Pass real-backend guest/authenticated detail, favorite, download, and error E2E |
| P0 | `/student/research/new` | Integrated | Exact one-shot multipart flow, category states, 401/403 handling, legacy redirect; controls now have programmatic labels | Pass isolated student/admin multipart integration and Playwright with safe file fixtures |
| P0 | `/advisor/reviews/[id]` | Integrated | Known-ID detail/download and confirmed approve/reject mutation; blank comments and non-positive IDs rejected by BFF | Runtime-verify decisions and full advisor/admin/student authorization matrix |
| P0 | `/dashboard/student/submit` compatibility | Implemented | Redirects to `/student/research/new` | Add redirect integration/E2E assertion |
| P1 | `/account/saved` | Integrated | Authenticated ID/timestamp index uses `GET /favorites/` without detail fan-out; loading/empty/error states included | Pass disposable-backend authenticated Playwright |
| P1 | `/admin/categories` | Integrated | Category list/create split into canonical page; create handles 401/403/errors and refreshes the server list | Pass disposable-admin create/list Playwright and runtime duplicate behavior |
| P1 | `/admin` overview | Integrated | Canonical totals-only overview uses `GET /stats/`; old dashboard redirects | Pass disposable-backend overview Playwright |
| P1 | `/dashboard/reviewer` entry | Implemented | Validated positive-ID navigation to known-ID workspace; no queue request or fixtures | Pass disposable-advisor browser flow |
| P1 | `/dashboard/student` consolidation | Implemented | Legacy route redirects to role-neutral `/account/saved`; favorites duplication removed | Pass redirect browser assertion |
| P1 | `/login` | Integrated | HttpOnly-cookie BFF login, normalized coded errors, focus recovery, sanitized return path | Pass disposable-backend Playwright |
| P1 | `/register` | Integrated | Forced-student registration; unsupported profile fields removed; coded/focused errors | Pass disposable-data registration Playwright |
| P2 | `/categories` | Not started | Public list endpoint exists | Implement archive index linking to integer category filter; no slug/count claims |
| P2 | `/` state completion | In progress | Stats/latest/popular integrated | Add loading boundary, partial-failure tests, and resolve `#about` destination |
| P2 | `/research` state completion | In progress | Search/category filter integrated | Add loading boundary and distinguish category API failure from empty categories |
| Blocked | Student submissions/tracking | Blocked | No current-user or list-by-submitter endpoint | Requires backend contract from backend team |
| Blocked | Draft/edit/resubmit/revisions/feedback | Blocked | Create-only research; no revision/comment-read APIs | Requires backend workflow contracts |
| Blocked | Advisor queue/history/scoring/revision request | Blocked | Known-ID review write only | Requires queue/history/schema/workflow contracts |
| Blocked | Admin research/user/review management | Blocked | No corresponding routers | Requires management APIs |
| Blocked | Detailed analytics/log pages | Blocked | Only four global totals are readable | Requires aggregate/log-read APIs |
| Blocked | Profile/settings | Blocked | No `/me` read/update | Requires current-user/profile APIs |
| Blocked | OAuth/password recovery/email verification | Blocked | No corresponding auth flows | Requires backend auth contracts |
| Blocked | Category detail/edit/delete | Blocked | Categories support list/create only | Requires detail/update/delete contract |

## Batch tracker

| Batch | Status | Completion signal |
|---|---|---|
| 1. P0 runtime verification | In progress | Disposable backend available; all P0 integration and Playwright cases pass |
| 2. Account consolidation | Integrated | `/account/saved` implemented; student duplicate redirected; runtime E2E remains |
| 3. Admin consolidation | Integrated | `/admin/categories` and totals-only `/admin` implemented; runtime E2E remains |
| 4. Reviewer known-ID entry | Implemented | Validated landing navigation covered statically; runtime E2E remains |
| 5. Auth and route-state hardening | Integrated | Focus, coded errors, safe return path, and truthful registration fields implemented; runtime E2E remains |
| 6. Optional public category index | Not started | `/categories` tested and navigation destinations corrected |

## Verification ledger

| Check | Status | Note |
|---|---|---|
| Backend contract analysis | Tested | Source-derived audit documents exist; live OpenAPI remains unavailable |
| Frontend static contract/unit tests | Tested | 17/17 passed on 2026-08-03 |
| Frontend typecheck | Tested | `pnpm.cmd typecheck` passed on 2026-08-03 |
| Frontend lint | Tested | `pnpm.cmd lint` passed on 2026-08-03 |
| Frontend production build | Tested | `pnpm.cmd build` passed on 2026-08-03; all P0 pages and handlers compiled |
| Real-backend integration | Blocked | No isolated runnable backend environment currently available |
| Playwright against real test backend | Blocked | Runner executed on 2026-08-03; all 6 guarded P0/P1 cases skipped because disposable fixture variables were absent |
| Backend tests | Tested | 5/5 passed against in-memory SQLite on 2026-08-03; 17 deprecation warnings |
| Backend file integrity for this analysis | Tested | Final read-only Git check found no backend changes |

## Design review

| Scope | Status | Evidence |
|---|---|---|
| Shared visual consistency | Tested | Typography, panel/form hierarchy, dashboard width, and tablet navigation refined across all routes |
| Responsive CSS | Tested | 1120px header, 900px dashboard/rail, and 520px mobile strategies covered by design tests and production build |
| Accessibility refinements | Tested | Field hints, loading announcements, disabled controls, and keyboard-scroll table region implemented |
| Desktop/mobile screenshots | Tested | Nine major routes captured at 1440×1000 and 390×844 and inspected |
| Populated real-backend visual states | Blocked | Requires disposable seeded backend and role credentials |

## Full isolated test run

| Check | Status | Result |
|---|---|---|
| Isolated backend pytest | Tested | 5 passed, 0 failed |
| Frontend unit/contract | Tested | 17 passed, 0 failed |
| TypeScript, lint, build | Tested | All passed |
| Playwright with isolated backend | Blocked | 3 passed, 3 failed due unmatched `Field` label/control IDs |
| Submission mutation E2E | Blocked | Could not reach form interaction because `Thai title` label does not resolve |
| Review mutation E2E | Blocked | Could not reach comment interaction because `Reviewer comment` label does not resolve |

Update a route to `Tested` only after its complete definition of done in [page-implementation-plan.md](page-implementation-plan.md) is satisfied. Do not use `Implemented` or `Integrated` to conceal missing runtime verification.
