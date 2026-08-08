# Frontend page implementation plan

Audit date: 2026-08-03. This is an analysis and sequencing document; it does not authorize backend changes or claim unsupported backend behavior. The executable App Router is currently rooted at `frontend/app/` (not `frontend/src/app/`). Backend calls remain centralized in `frontend/src/lib/api/`, `frontend/src/features/`, and `frontend/app/api/`.

## Planning basis

- Backend contract: [backend-capability-map.md](backend-capability-map.md), with router/service/test behavior taking precedence over README claims.
- Current UI: the executable routes under `frontend/app/`, shared components under `frontend/src/components/`, feature modules under `frontend/src/features/`, and API modules under `frontend/src/lib/api/`.
- Design: the complete Living Research Index language in [`frontend/DESIGN.md`](../DESIGN.md) and Stitch references. Pages must retain Kanit/Plus Jakarta Sans pairing, Thai 110% sizing/line-height rule, warm-paper surfaces, mulberry/periwinkle hierarchy, 12-column grid, 24px gutters, 48px desktop and 16px mobile margins, restrained rules/elevation, 64px Index Rail, editorial folio composition, visible interaction states, and reduced-motion behavior.
- Authentication limitation: an HttpOnly JWT cookie proves only token presence. No `/me` operation exists, so the frontend must not infer or display an authoritative role. The backend remains responsible for 401/403 decisions.

## Current implementation status

There are 12 executable page routes: 11 rendered pages plus the legacy redirect `/dashboard/student/submit`. The earlier nine-route inventory is historical and predates the P0 implementation.

| Route | Current status | Supported scope | Remaining work |
|---|---|---|---|
| `/` | Integrated | Stats, latest, popular | P2 loading boundary, category-navigation clarification, real-backend E2E |
| `/login` | Integrated | OAuth-form backend login through HttpOnly-cookie BFF | P1 focus/error polish and return-path verification |
| `/register` | Integrated | Student-only safe registration | P1 focus/error polish and persistence-copy verification |
| `/research` | Integrated | Approved search by `q` and `category_id` | P2 loading boundary and explicit category-load failure |
| `/research/[id]` | Integrated | Scalar detail, favorite, download | Full real-backend tests; backend privacy/metadata limits remain blocked |
| `/student/research/new` | Integrated | One-shot pending submission | Full real-backend tests; role is enforced only by backend |
| `/advisor/reviews/[id]` | Integrated | Known-ID context and approve/reject | Full real-backend tests; queue/history remain blocked |
| `/dashboard/student/submit` | Implemented | Redirect to canonical submission URL | Retain as compatibility redirect and add redirect test |
| `/dashboard/student` | In progress | Favorites IDs and explicit blocked-state copy | Replace with `/account/saved`; decide redirect/retirement |
| `/dashboard/reviewer` | In progress | Honest known-ID entry explanation | Add usable ID entry/deep-link surface; never fabricate a queue |
| `/dashboard/admin` | In progress | Public totals plus category list/create | Move category workflow to `/admin/categories`; retain totals-only overview |
| `/account/saved` | Not started | Favorite IDs/timestamps | P1 implementation |
| `/admin/categories` | Not started | Category list/create | P1 implementation |
| `/categories` | Not started | Public category list linked to research filter | P2 optional implementation |

“Integrated” means the page is wired to the verified backend-facing modules, not that real-backend E2E has passed. No page is marked fully `Tested` while the disposable backend fixture environment is unavailable.

## Pages ordered by implementation priority

### P0 — core workflow

No supported P0 page remains unimplemented. The three P0 pages are `/research/[id]`, `/student/research/new`, and `/advisor/reviews/[id]`; all are integrated but still require the real-backend test matrix before they satisfy definition of done.

#### P0 verification batch: `/research/[id]`

- Role and goal: guest or authenticated user reads a research folio; authenticated users may save or download it.
- Endpoints: `GET /research/{research_id}`, `GET /categories/`, `POST /favorites/{research_id}`, `POST /research/{research_id}/download`, then the returned backend-relative static URL through the server proxy.
- Authentication/permission: detail is public; favorite/download require any active bearer-authenticated user.
- Reuse: `SiteHeader`, `SiteFooter`, `ArchiveTab`, `Status`, `StatePanel`, `ResearchActions`, `adaptResearch`.
- New components: none planned; only extract a shared detail metadata block if reuse with the review workspace becomes clearer than duplication.
- Form fields: none; mutation controls are save and download.
- States: loading skeleton; 404/not-found for invalid or absent ID; scalar-null fallbacks; inline 401 sign-in recovery; 403/422/500 mutation errors; save/download success announcement.
- Responsive/design: public shell, reading width near 820px, editorial metadata grid collapsing to two columns, warm-paper folio, bracket/reference metadata, 44px touch targets, no repeated prefetch because detail reads increment views.
- Tests: numeric-ID validation, one detail fetch per navigation, category fallback, guest auth prompt, favorite add/remove union, download header forwarding, 401/403/404/422/500, keyboard and live-region checks, mobile layout, Playwright guest/detail/login/save/download.
- Dependencies: disposable backend with seeded approved research, authenticated fixture, and downloadable file.
- Definition of done: contract/unit/integration/E2E pass; no duplicate view increment caused by frontend prefetch; download preserves content headers; all states and focus behavior are verified.

#### P0 verification batch: `/student/research/new`

- Role and goal: student or administrator creates one pending research record.
- Endpoints: `GET /categories/`; `POST /research/` multipart through the Next Route Handler.
- Authentication/permission: token cookie required by the page; backend permits `student` and `admin` and is authoritative for 403.
- Reuse: `DashboardShell`, `StatePanel`, `SubmissionForm`, shared fields/buttons.
- New components: none unless the form is split into accessible fieldsets for metadata and files.
- Form fields: exact backend names `title_th`, `title_en`, `category_id`, optional `abstract`, `department`, `work_type`, `academic_year`, `keywords`, `cover_image`, `document`; `author_ids` and `advisor_ids` remain JSON-string `[]` because lookup is unavailable.
- States: category loading/error/empty; client validation; submitting/disabled; backend 401/403/422/500; success redirect to returned ID. Retain scalar data on retry and never claim draft persistence.
- Responsive/design: dashboard editorial grid becomes one column at 900px; file controls fit mobile width; restrained form shadow; explicit safety-policy copy for 5 MB image/25 MB PDF checks.
- Tests: exact multipart field names, no manual multipart `Content-Type`, empty categories, filename/type/size policy, double-submit prevention, 401/403/422/500, successful `pending` response, redirect compatibility from `/dashboard/student/submit`, accessibility, Playwright against disposable student/admin fixtures.
- Dependencies: isolated writable backend store, seeded category, student/admin credentials, safe file fixtures.
- Definition of done: exact multipart contract proven and all state/E2E cases pass without touching development or production data.

#### P0 verification batch: `/advisor/reviews/[id]`

- Role and goal: advisor or administrator inspects a known research ID and records an approve/reject comment.
- Endpoints: `GET /research/{research_id}`, `GET /categories/`, `POST /research/{research_id}/download`, `POST /research/{research_id}/review`.
- Authentication/permission: cookie required; backend permits `advisor` and `admin` for review and returns authoritative 403.
- Reuse: `DashboardShell`, folio/detail patterns, `ResearchActions`, `ReviewForm`, `Status`, confirmation dialog.
- New components: optional shared `ResearchSummary` only if it removes real duplication with public detail.
- Form fields: required `comment_text`; required `status_result`, limited in UI to verified `approved` and contract-supported `rejected`.
- States: loading; invalid/unknown ID; missing optional content/document; 401 redirect; 403 dedicated forbidden message; 422 and 500 while preserving comment; confirmed success with returned review ID/status.
- Responsive/design: two-column workspace collapses at 900px; Index Rail becomes bottom navigation; editorial research pane and restrained decision panel share one product language; modal traps/restores focus and respects reduced motion.
- Tests: exact JSON, no scoring/revision values, confirmation cancel/confirm, 401/403/404/422/500, document action, keyboard dialog, success live region, Playwright advisor approve/reject and student 403.
- Dependencies: seeded pending IDs supplied outside the API, advisor/admin/student fixtures, disposable DB.
- Definition of done: both decisions are runtime-verified, unauthorized roles never show success, and all integration/Playwright checks pass.

### P1 — complete supported account and management flows

#### `/account/saved`

- Role and goal: any authenticated active user sees and opens saved research IDs without implying a student-only feature.
- Endpoints: `GET /favorites/`; do not fan out to `GET /research/{id}` because each detail read increments views.
- Authentication/permission: session required; any active user. Redirect missing session to `/login?next=/account/saved`; clear expired session on backend 401.
- Reuse: `DashboardShell`, `ButtonLink`, `StatePanel`, date formatting and existing favorite ID presentation from `/dashboard/student`.
- New components: `SavedResearchList` or `SavedResearchRow` accepting ID and timestamp, intentionally not a `ResearchRow` because title/category metadata is absent.
- Form fields: none. Removal should remain on detail unless product explicitly accepts toggle semantics on this list.
- States: loading boundary; empty list; list of ID/date links; 401 recovery; 403/500 error; no fabricated title/card; optional success only if remove is later added.
- Responsive/design: archive-led list with monospaced IDs, restrained rules, no generic card grid; rows stack on mobile and clear the bottom rail.
- Tests: auth redirect, exact `GET /favorites/`, ID/timestamp rendering, empty/error/expired-session, no detail fan-out, keyboard links, mobile viewport.
- Design references: student dashboard saved panel, `ResearchRow` rhythm, Living Research Index folio/reference treatment.
- Dependencies: shared loading boundary; navigation update that does not pretend to know role.
- Definition of done: all supported states and tests pass, and `/dashboard/student` no longer duplicates favorites.

#### `/admin/categories`

- Role and goal: administrator lists and creates categories.
- Endpoints: `GET /categories/`, `POST /categories/` through the Route Handler.
- Authentication/permission: session required; backend alone proves `admin` on create. The public list cannot prove page authorization, so describe the limitation and handle create 403 explicitly.
- Reuse: `DashboardShell`, accessible table, `CategoryForm`, `StatePanel`, existing admin category markup.
- New components: `CategoryTable`; optionally a server-refresh hook/action after successful create.
- Form fields: required `category_name`; optional `description`; no slug/edit/delete fields.
- States: route loading; empty table; category-list error; create pending; validation/duplicate/401/403/422/500; create success followed by list refresh.
- Responsive/design: table in scroll wrapper, editorial panel rather than SaaS cards, 12px Latin table labels, one-column form/table under 900px, visible focus and status announcement.
- Tests: exact list/create calls, server refresh after success, duplicate normalization, all auth/error states, empty list, accessible table/form, mobile, admin Playwright.
- Design references: current `/dashboard/admin`, shared panel/table primitives, Mulberry/Periwinkle management language.
- Dependencies: decide refresh mechanism without raw component fetch; retain centralized BFF access.
- Definition of done: successful create appears without manual reload, forbidden users get an honest state, and no edit/delete affordance exists.

#### `/admin`

- Proposed route: migrate `/dashboard/admin` to `/admin`, retaining the old route as a temporary redirect.
- Role and goal: administrator sees only the four global totals and navigates to category management.
- Endpoints: `GET /stats/` only. These totals are public, so the UI must not claim the response itself proves admin authorization.
- Authentication/permission: require token presence for workspace consistency; no authoritative proactive role check is possible.
- Reuse/new: `DashboardShell`, `StatePanel`, metric pattern; add a small `AdminMetricStrip` only if it is also reused on home.
- Fields/states: no form; loading, stats error, success totals, and supported-capabilities note. Empty is not applicable because totals are numeric.
- Responsive/design: editorial metrics strip; avoid generic SaaS KPI grid proliferation; use tonal depth and one category-management callout.
- Tests: redirect compatibility, stats success/error, no category mutation on overview, no unsupported links, mobile/accessibility.
- Dependencies: `/admin/categories` available first.
- Definition of done: overview is totals-only, links to supported management, and legacy URL behavior is tested.

#### `/dashboard/reviewer`

- Role and goal: advisor/admin enters a known research ID supplied outside the API and navigates to its review workspace.
- Endpoints: none on landing; navigation leads to the existing known-ID page.
- Authentication/permission: token required; role cannot be verified until review mutation.
- Reuse: `DashboardShell`, `Input`, `Button`, `StatePanel` explanation.
- New components: `KnownResearchIdForm`, performing positive-integer validation and client navigation only.
- Form fields: `research_id` positive integer.
- States: empty explanatory state, validation error, navigation success; no queue loading or fake assignments.
- Responsive/design: compact editorial entry form, explicit `[Known ID]` language, one-column mobile layout.
- Tests: invalid/valid ID, keyboard submission, auth redirect, no backend queue call, target URL construction.
- Dependencies: `/advisor/reviews/[id]` already integrated.
- Definition of done: the landing is usable without implying queue/history support and contains no fixture submissions.

#### Authentication completion: `/login` and `/register`

- Roles/goals: all roles log in; public registration safely creates only students.
- Endpoints: `POST /auth/login` form-encoded by the BFF; `POST /auth/register` JSON with forced `role: "student"`.
- Authentication/permissions: public. No Google OAuth, refresh, reset, verification, or role selector.
- Reuse/new: retain `AuthShell` and auth forms; no new page-level components expected.
- Fields: login email/password; registration backend-safe fields only. Copy must state profile fields are not persisted if still shown.
- States: pending/disabled, validation, 401/409/422/500/network, success, focus first error, announced status. Validate sanitized `next` handling to prevent an open redirect.
- Responsive/design: split auth shell on desktop, single paper form on mobile, bilingual type hierarchy, unsupported marketing/legal links non-interactive or explicitly future content.
- Tests: exact encoding/schema, forced role, cookie flags, unsafe `next`, network/server errors, keyboard/focus, Playwright login/register only against disposable data.
- Definition of done: all errors are recoverable and accessible, tokens never reach browser storage, and no unsupported auth control appears active.

### P2 — optional public completeness

#### `/categories`

- Role and goal: public user browses categories and opens `/research?category_id={id}`.
- Endpoints/auth: public `GET /categories/`; no authentication or mutation.
- Reuse: `SiteHeader`, `SiteFooter`, `ArchiveTab`, `StatePanel`, editorial rules.
- New components: `CategoryIndexRow` or `CategoryIndexList`; do not create category cards that imply counts.
- Fields: none.
- States: loading, empty, list error, success. Category descriptions may be null; use factual fallback.
- Responsive/design: archive index, monospaced integer references, 12-column composition, not a generic card grid; 16px mobile margins.
- Tests: list/error/empty, correct integer filter links, no slug/count claims, accessibility and responsive layout.
- Dependencies: update header/footer label/link consistently.
- Definition of done: every entry links to the supported filter and no `/categories/[slug]` route exists.

#### `/` and `/research` state completion

- Goals/endpoints: retain current public discovery contracts. Add route loading boundaries and expose category-list failure without treating it as a legitimate empty category set.
- Reuse/new: `SiteHeader`, `SiteFooter`, `StatePanel`, `FolioCard`; no new design system.
- States: independent feed/stats/category failure, empty approved results, loading skeletons, invalid `category_id` normalization.
- Responsive/design: preserve hero/editorial search and folio rhythm; add an actual `#about` section or remove the link as separate static-content work.
- Tests: partial API failures, query escaping, invalid category ID, loading accessibility, no sort/pagination, mobile.
- Definition of done: failures are distinguishable from empty data and navigation contains no dead anchor.

## Page dependencies

```text
Shared API/session/error layer (existing)
├── Public shell + folio/state primitives (existing)
│   ├── /research/[id] verification
│   ├── /categories
│   └── / and /research state completion
├── Dashboard shell + session guard (existing, role-agnostic)
│   ├── /account/saved ── retire duplicate favorites on /dashboard/student
│   ├── /admin/categories ── simplify /admin overview ── legacy admin redirect
│   └── /dashboard/reviewer entry ── /advisor/reviews/[id] verification
└── Disposable backend fixtures
    └── P0/P1 integration and Playwright completion
```

## Reusable component map

| Pattern | Existing source | Planned consumers | Guidance |
|---|---|---|---|
| Public shell | `src/components/shells.tsx` | `/`, `/research`, detail, categories | Retain shared header/footer; fix destinations centrally |
| Auth shell | `src/components/shells.tsx` | login/register | Preserve editorial split; do not activate unsupported links |
| Dashboard shell/rail | `src/components/shells.tsx` | saved, submission, review, admin | One visual language for all roles; never infer role from cookie |
| Controls and state panels | `src/components/ui.tsx` | all pages | Preserve focus/disabled/live states; improve label association where needed |
| Folio and research row | `src/components/research.tsx` | discovery/detail-derived lists | Use only when full research metadata exists; favorites need an ID-specific row |
| Research adapter/API | `src/features/research/` | all research surfaces | Keep nullable/category/status adaptation centralized |
| Submission/review/actions | feature modules | P0 pages | Keep browser mutations behind Next Route Handlers |
| Category form | `src/features/admin/category-form.tsx` | `/admin/categories` | Move, do not duplicate |

## API endpoint map

| Frontend surface | Backend operations | Contract constraint |
|---|---|---|
| Home | `GET /stats/`, `/home/latest`, `/home/popular`, `/categories/` | Latest/popular approved only; weak published ordering possible |
| Search/categories | `GET /research/search`, `GET /categories/` | Only `q` and integer `category_id`; bare array, no sort/page/count |
| Detail | `GET /research/{id}` | Increments views; scalar response; any status exposed by backend |
| Saved/actions | `GET /favorites/`, `POST /favorites/{id}` | List contains IDs/timestamps; toggle has union response |
| Download | `POST /research/{id}/download` + static URL | Auth handshake; no promised preview or disposition contract |
| Submission | `POST /research/` | One-shot multipart; no draft/edit/resubmit; author/advisor lookup absent |
| Review | `POST /research/{id}/review` | Known ID only; no queue/history/read comments; accept only planned decisions in UI |
| Admin overview/categories | `GET /stats/`, `GET|POST /categories/` | Stats are public; category edit/delete absent |
| Auth | `POST /auth/login`, `POST /auth/register` | Access token only; no refresh/current user/OAuth/recovery |

## Testing requirements

Every page definition of done includes TypeScript strict checking, ESLint, Node unit/contract tests, frontend integration tests, production build, and Playwright against the real disposable test backend. Write flows must use isolated SQLite/PostgreSQL fixtures and never development or production data. Tests must explicitly cover loading, empty where applicable, success, validation, 401, 403, 404, 422, 500/network, responsive layout, keyboard/focus, semantic headings/labels, status announcements, and reduced motion. Detail tests must account for view-count mutation and disabled prefetch.

Current infrastructure has contract/design tests and guarded P0 Playwright specs. Real-backend integration and E2E remain blocked until backend dependencies, fixture credentials, seeded IDs, and an isolated writable database are available.

## Blocked pages and features

| Priority | Page/workflow | Missing backend contract | Decision |
|---|---|---|---|
| Blocked | Student submissions list/tracking | Current user and list-by-submitter | Do not create `/student/research` dashboard data |
| Blocked | Draft/edit/resubmit/revisions/feedback | Draft/update/transition/revision/comment-read APIs | Do not create routes or active controls |
| Blocked | Advisor queue/history | Assignment/list/history/read-review APIs | Keep known-ID landing/workspace only |
| Blocked | Admin research/users/reviews | Management list/update/delete/user APIs | Do not create admin routes |
| Blocked | Detailed analytics/popular searches/logs | Aggregate/log read APIs | Show exact four totals only |
| Blocked | Profile/account settings | `/me` read/update | Do not create profile editor |
| Blocked | OAuth/recovery/verification | Corresponding authentication flows | Do not create functional pages |
| Blocked | Category detail/edit/delete | Slug/detail/update/delete APIs | Use filter links; list/create only |
| Blocked | Authors/advisors, citations, related research | Lookup/enriched-response/recommendation fields | Do not fabricate metadata or controls |
| Blocked | PDF preview and revision upload | Verified streaming/preview/revision contracts | Keep authenticated download only |

Non-backend product/content gaps remain the language switch, institutional marketing metrics, and legal/help destinations. They require content/product decisions, not invented API calls.

## Recommended implementation batches

1. **P0 runtime verification:** provision the disposable backend and finish integration/Playwright for detail, submission, and review without changing backend code.
2. **Account consolidation:** implement `/account/saved`, add its loading/error states, then remove favorites duplication from `/dashboard/student` and retain a deliberate redirect or blocked landing.
3. **Admin consolidation:** implement `/admin/categories`, make create refresh the list, simplify `/admin`, and preserve `/dashboard/admin` as a tested compatibility redirect.
4. **Reviewer entry:** add positive-integer known-ID navigation to `/dashboard/reviewer`; keep queue/history visibly unavailable.
5. **Auth/state hardening:** finish focus management, return-path safety, route loading boundaries, and partial-failure behavior.
6. **Optional public index:** add `/categories`, correct header/footer destinations, and resolve the dead `#about` anchor.

## Global definition of done

A page is done only when its per-page definition is met; backend contract names are preserved; raw backend calls remain centralized; tokens remain HttpOnly; unsupported controls/routes are absent or honestly disabled; all design foundations and responsive/accessibility states are applied; frontend lint, typecheck, unit/contract/integration tests, build, and real-backend Playwright pass; existing backend tests pass in their isolated environment; and final Git/content checks show no changed or new file under `backend/`.
