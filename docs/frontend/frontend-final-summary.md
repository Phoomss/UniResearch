# UniResearch Frontend Final Summary

**Prepared:** 3 August 2026  
**Scope:** Frontend integration and validation only  
**Backend policy:** The existing FastAPI backend was inspected and tested but not modified.

## 1. Project overview

The frontend is a Next.js 16 App Router application using React 19, strict TypeScript, pnpm, and the existing UniResearch styling system. It implements the backend-supported research discovery, authentication, submission, review, favorites, statistics, and category-administration flows without changing backend contracts.

The visual direction is the **Living Research Index / Mulberry Library**: a warm-paper academic archive with mulberry and periwinkle accents, Kanit for Thai-facing typography, Plus Jakarta Sans for Latin text, a responsive navigation rail, editorial grids, and restrained elevation.

Backend communication is centralized under `src/lib/api/`, `src/features/`, and `app/api/`. Browser mutations pass through Next.js route handlers, which call FastAPI server-to-server. JWT access tokens returned by the backend are stored in secure, HttpOnly, SameSite=Lax cookies rather than browser storage. Frontend adapters normalize backend records for presentation without altering request or response contracts.

The current application contains 14 executable page routes: 11 rendered pages and 3 compatibility redirects. Ten rendered pages integrate with real backend endpoints; one is a frontend-only known-ID reviewer landing page necessitated by the absence of a reviewer queue endpoint.

This document reconciles all reports under `frontend/docs/`. Where older phase reports conflict with later evidence, the current route tree, progress report, and full-test report take precedence.

## 2. Implemented pages

| Route | Intended role | Purpose | Implementation | Backend integration | Latest test status |
|---|---|---|---|---|---|
| `/` | Public | Research portal home, totals, latest and popular research | Implemented | `GET /stats/`, `/home/latest`, `/home/popular`, `/categories/` | Unit/build coverage; no dedicated E2E flow |
| `/login` | Public | Authenticate and return safely to an internal route | Implemented | `POST /auth/login` through a route handler | Unit/build coverage; exercised indirectly by authenticated E2E setup |
| `/register` | Public | Student registration | Implemented; role is fixed to `student` | `POST /auth/register` through a route handler | Unit/build coverage; no registration E2E write flow |
| `/research` | Public | Keyword and category research search | Implemented within backend filters | `GET /research/search`, `GET /categories/` | Unit/build coverage; no dedicated E2E flow |
| `/research/[id]` | Public/authenticated | Research detail, favorite action, authenticated download | Implemented | `GET /research/{id}`, `POST /favorites/{id}`, `POST /research/{id}/download` | Guest detail and unknown-ID E2E passed; authenticated actions not fully covered |
| `/student/research/new` | Student | One-shot research submission with optional cover and PDF | Implemented, but acceptance is incomplete | `POST /research/` exact multipart contract | E2E failed at the shared label/control accessibility defect |
| `/advisor/reviews/[id]` | Advisor | Known-ID review detail, download, approve or reject | Implemented within backend review actions | `GET /research/{id}`, download, `POST /research/{id}/review` | E2E failed at the shared label/control accessibility defect |
| `/account/saved` | Authenticated | List saved research IDs and timestamps | Implemented to the backend's limited favorite representation | `GET /favorites/` | E2E passed |
| `/admin` | Admin workspace | Four backend-provided platform totals | Implemented; backend remains the authorization authority | `GET /stats/` | Admin overview/category flow passed E2E |
| `/admin/categories` | Admin | List and create research categories | Implemented; edit/delete are not supported | `GET /categories/`, `POST /categories/` | Admin overview/category flow passed E2E |
| `/dashboard/reviewer` | Reviewer | Enter a known research ID and open its review workspace | Implemented as frontend navigation only | None; no reviewer queue endpoint exists | E2E failed at the shared label/control accessibility defect |
| `/dashboard/student` | Student | Compatibility entry point | Redirects to `/account/saved` | None | Build/router coverage |
| `/dashboard/student/submit` | Student | Compatibility entry point | Redirects to `/student/research/new` | None | Build/router coverage |
| `/dashboard/admin` | Admin | Compatibility entry point | Redirects to `/admin` | None | Build/router coverage |

No executable page uses a fabricated backend endpoint. Features without backend support were omitted or reduced to an honest known-ID workflow.

## 3. Implemented functionality

### Authentication

- Login translates the frontend JSON form into the backend's OAuth-form-compatible `username` and `password` request.
- Registration preserves the backend schema and forces the public frontend role to `student`.
- Access tokens are received by Next.js route handlers and stored in HttpOnly cookies. There is no localStorage token use.
- Authenticated server requests attach the expected bearer authorization header.
- Logout clears the frontend cookie only because the backend has no logout endpoint.
- Refresh tokens, OAuth login, password reset, email verification, and a current-user profile were not implemented because the backend does not support them.

### Discovery and research detail

- Search supports only the backend's `q` and `category_id` parameters.
- Home sections use real totals, latest research, and popular research responses.
- Detail pages use a view-model adapter for nullable fields, category representations, status, and keyword presentation.
- Favorite toggling and authenticated download are proxied through same-origin frontend handlers.
- Download handling preserves the backend response content type and content disposition.
- The frontend deliberately avoids detail fan-out on the saved page because backend detail reads increment view counts.
- Advanced filters, sorting, pagination, related works, citation export, DOI tools, and PDF preview are absent.

### Submission and files

- Student submission sends one exact multipart request to `POST /research/` and preserves backend field names.
- Optional cover and PDF files are forwarded without manually setting multipart `Content-Type`.
- The frontend applies a 5 MB image and 25 MB PDF policy before forwarding uploads.
- Submitted research begins with the backend's pending workflow.
- Drafts, editing, revision resubmission, author/advisor lookup, and file replacement are not implemented because supporting endpoints are absent.

### Review

- Advisors can open a known research ID, inspect its scalar detail, download it, and submit an approved or rejected result.
- Confirmation UI is present for the review mutation.
- Reviewer/advisor queues, assignments, review history, readable prior comments, scoring, and revision-request actions are backend-blocked.

### Dashboards, analytics, and administration

- The admin overview displays exactly the four totals returned by `/stats/`.
- Category administration supports list and create only.
- The reviewer landing page accepts a known ID because no queue API exists.
- Detailed analytics, popular-search reporting, user management, research moderation lists, review management, and category edit/delete are not implemented.

## 4. Design implementation

The design system is implemented through shared UI, shell, and research presentation components instead of page-specific styling. Server Components are used by default; Client Components are limited to forms and browser interactions.

Key implemented design behavior includes:

- A 12-column editorial grid, generous desktop gutters, and compact mobile spacing.
- A 64 px desktop navigation rail that becomes bottom navigation below the responsive breakpoint.
- Warm neutral surfaces, mulberry action color, periwinkle support color, and restrained shadow usage.
- Shared field, button, panel, table, badge, empty-state, and feedback patterns.
- Responsive refinements for wide dashboards, tablet layouts, form hierarchy, mobile rail clearance, disabled controls, keyboard table focus, loading announcements, and state headings.
- 18 design-review screenshots for nine routes at 1440×1000 and 390×844 in `test-results/design-review/`.

The design review's earlier accessibility assessment is superseded by the full E2E result: the shared `Field` component gives labels an `htmlFor` value but does not assign the matching `id` to cloned controls. This is a real accessibility defect and caused three Playwright flows to fail. It remains unresolved because this phase permits documentation changes only.

Remaining manual visual checks include populated backend states, exact 1024 px and 768 px layouts, copy/language consistency, and static legal/support/marketing content.

## 5. Backend integration

### Integrated backend surface

- `POST /auth/register`
- `POST /auth/login`
- `GET /categories/`
- `POST /categories/`
- `POST /research/`
- `GET /research/search`
- `GET /research/{id}`
- `POST /research/{id}/download`
- `POST /research/{id}/review`
- `GET /favorites/`
- `POST /favorites/{id}`
- `GET /stats/`
- `GET /home/latest`
- `GET /home/popular`

The integration layer provides typed request/response definitions, a shared server-side client, cookie authentication helpers, error normalization, view-model adapters, and feature-specific modules. Same-origin frontend handlers avoid requiring backend CORS changes.

### Contract and security limitations observed

- The backend has no current-user endpoint, so token presence alone cannot prove a role in the UI; backend authorization remains authoritative.
- Public registration accepts an arbitrary role at the backend. The frontend constrains its form to `student`, but direct backend registration remains a backend security concern.
- Research detail can expose non-approved records when their IDs are known.
- Detail and search reads have database side effects, including view-count mutation.
- Upload handling retains original filenames and lacks equivalent backend-side MIME/size validation; frontend checks do not protect direct backend access.
- Static upload URLs become publicly reachable after the authenticated download handshake.
- Role and status values are not strongly constrained in the backend schemas.
- Favorite toggle runtime responses use a union shape that is not fully represented by the generated OpenAPI contract.
- Statistics are public.
- Backend test output contains Pydantic/deprecation and naive-datetime warnings.

The source-derived OpenAPI contract was inspected during integration. A separately recorded live-runtime OpenAPI diff is still outstanding.

## 6. Testing and verification

The latest authoritative results are from `full-test-report.md` and supersede earlier reports that described tests as unavailable or not yet run.

| Check | Result |
|---|---:|
| Backend pytest against isolated in-memory SQLite | **5 passed, 0 failed, 17 warnings** |
| Frontend unit and API-contract tests | **17 passed, 0 failed** |
| TypeScript strict checking | **Passed** |
| ESLint | **Passed** |
| Production build | **Passed; 20 route/build entries compiled** |
| Playwright against the real isolated backend | **3 passed, 3 failed** |

The passing E2E flows covered guest research detail and an unknown ID, the authenticated saved page, and the admin overview/categories path. The student submission, reviewer known-ID landing, and advisor review flows failed because their labels did not resolve to form controls.

The E2E run used an isolated backend on port 8010 and a production frontend on port 3010 with credential probing. Temporary runtime artifacts were removed afterward, and no test listeners were left running.

The application therefore does **not** meet the full completion gate. Static checks and production compilation are green, but Playwright is not fully green and several important actions lack complete browser-level coverage.

## 7. Remaining work

### Frontend fixes

1. Fix the shared `Field` component so every rendered control receives the same ID referenced by its label.
2. Rerun all six isolated-backend Playwright flows after that fix.
3. Add E2E coverage for login failure/success, registration, research search, favorite toggle, download headers, category creation, and review error states.
4. Record a live-runtime OpenAPI comparison as a repeatable contract check.
5. Complete manual responsive and populated-state review at desktop, tablet, and mobile sizes.
6. Review placeholder marketing counts, footer destinations, legal/support copy, and language consistency.

### Backend-blocked features

- Current-user/profile retrieval and profile editing.
- Refresh token, backend logout/revocation, OAuth, password reset, and email verification.
- Student submission lists, drafts, editing, resubmission, and revision history.
- Author and advisor directory/search data.
- Reviewer/advisor queues, assignments, history, scoring, readable prior comments, and revision requests.
- Admin user, research, and review management.
- Category detail by slug, edit, and delete.
- Detailed analytics, popular-search reports, and activity-log reads.
- Notifications, citations, DOI/export tooling, related works, advanced search filters/sort/pagination, and PDF preview.

### Optional enhancements

- A public category browsing route once product priority and backend detail behavior are agreed.
- Route-level loading/skeleton treatments for home and search.
- Richer saved-item cards if the backend provides favorite records without triggering detail-view side effects.
- Deployment observability, error reporting, and analytics appropriate to the target environment.

### Deployment work

- Configure production frontend and backend origins and secure cookie behavior.
- Configure a production database and storage strategy through the backend team's approved process.
- Run the complete test matrix in CI against a disposable backend database.
- Review public static-upload exposure, registration roles, and authorization boundaries before production release.

## 8. Known limitations

- The product is a supported backend slice, not a complete research-management system.
- Role-aware navigation cannot be derived reliably from the token because no current-user endpoint exists.
- Favorites contain IDs and timestamps only; displaying full cards would require backend support or view-mutating detail calls.
- Submission and review are one-shot/known-ID workflows rather than dashboards with queues and lifecycle history.
- File rules enforced only by the frontend can be bypassed through direct backend access.
- Three core E2E flows currently fail due to the shared form-label defect.
- Only three of six planned browser flows pass; untested routes must not be treated as acceptance-tested.
- No executable application page is intentionally backed by mock research data, but static marketing/legal/support content still requires product verification.

## 9. How to run

Use a disposable or approved development database when starting FastAPI; backend startup creates tables and must never be pointed at production for integration testing.

### Frontend development

```powershell
Set-Location D:\Project-69\UniResearch\frontend
pnpm.cmd install
pnpm.cmd dev
```

### Frontend verification

```powershell
Set-Location D:\Project-69\UniResearch\frontend
pnpm.cmd typecheck
pnpm.cmd lint
pnpm.cmd test
pnpm.cmd build
pnpm.cmd test:e2e
```

`test:e2e` requires the isolated backend, frontend server, and required `E2E_*` credentials/environment values described by the test configuration. On non-Windows systems, use `pnpm` instead of `pnpm.cmd`.

### Backend development server

After configuring the backend environment for an approved disposable/development database:

```powershell
Set-Location D:\Project-69\UniResearch\backend
python -m uvicorn app.main:app --reload
```

### Backend test suite

Run only with the repository's isolated test configuration:

```powershell
Set-Location D:\Project-69\UniResearch
$env:PYTHONPATH='D:\Project-69\UniResearch\backend'
$env:PYTHONDONTWRITEBYTECODE='1'
python -m pytest backend/tests -p no:cacheprovider -v
```

## 10. Final status

| Measure | Final count/status |
|---|---:|
| Executable page routes | **14** |
| Rendered pages | **11** |
| Compatibility redirects | **3** |
| Rendered routes integrated with backend APIs | **10** |
| Frontend-only rendered routes | **1** (`/dashboard/reviewer`) |
| Routes implemented for the supported slice | **11 rendered + 3 redirects** |
| Routes with failing acceptance flows | **3** |
| Fully passing planned E2E flows | **3 of 6** |
| Routes meeting the complete page-level definition of done | **0 claimed**; the required full matrix is incomplete |
| Executable routes using mock research data | **0** |
| Backend-blocked feature groups | **Multiple; listed above and not fabricated** |
| Backend files modified | **0** |

**Overall status: partially complete and not release-ready.** The frontend architecture, real API integration, implemented page set, static checks, unit/contract tests, and production build are in place. Release readiness is blocked by the shared form-label accessibility defect, three failing E2E flows, incomplete browser coverage, remaining manual visual checks, and backend security/contract limitations that require backend-team ownership.
