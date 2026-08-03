# Frontend current route inventory

There are **9 executable page routes**. Static Stitch HTML files are design references, not routes. “Complete” here means complete for the backend-supported slice, with a real data source and essential success/empty/error behavior; it does not mean the backend provides the role’s ideal end-to-end workflow.

| Existing route | Intended role | Status | Data source | Mock / hardcoded data | API integration | Design completeness | Missing states / issues |
|---|---|---|---|---|---|---|---|
| `/` | Guest | Complete | `/stats/`, `/home/latest`, `/home/popular`, `/categories/` | Hardcoded `50k+` publications and `120+` institutions remain in `AuthShell`, not this page; footer contact/copyright is static | Server-side feature API | Mulberry Library public shell and Folio cards | No route-level `loading.tsx`; category result is fetched but unused; `#about` target does not exist. |
| `/login` | All roles | Complete | Next route handler → `/auth/login`; HttpOnly cookie | Institutional marketing counts are unsupported decorative copy in shared `AuthShell` | Working | Complete auth shell/form | No role-aware post-login destination because `/me` is absent; no standalone loading state. |
| `/register` | Student | Complete for safe registration | Next route handler → `/auth/register`, forces `student` | None in form | Working | Complete auth shell/form | Backend does not persist names sent by handler; no email verification. |
| `/research` | Guest/all | Complete for supported search slice | `/research/search`, `/categories/` | None | Working server-side | Complete search/filter layout | No route loading skeleton; no pagination/sort because backend lacks them; category fetch failure silently becomes empty options. |
| `/research/[id]` | Guest/all | Incomplete | `/research/{id}`, categories; authenticated favorite/download handlers | None | Working but contract-limited | Strong Folio detail pattern | Uses dashboard shell for a public page; favorite/download controls do not render an initial auth/selected state; no loading file; non-approved IDs are public; missing author/advisor/category object/PDF preview because responses omit them. |
| `/dashboard/student` | Authenticated user/student intent | Incomplete / blocked core | `/favorites/` | Explicit empty explanatory panel, no fake submissions | Favorites working | Dashboard shell present | No actual role check, current user, or my-submissions data; favorites show only IDs. 401 redirect exists; 403 cannot be handled proactively. |
| `/dashboard/student/submit` | Student/admin | Incomplete | categories plus multipart route handler → `/research/` | No fake data; forcibly sends empty author/advisor arrays | Working one-shot create | Existing submission form and states | No role check; frontend invents 5 MB/25 MB rules not backed by backend; author/advisor UI impossible; no draft/save/edit/revision; category error state exists but no loading file. |
| `/dashboard/reviewer` | Advisor/admin | Incomplete | known-ID form → `/research/{id}/review` | No mock queue; explicit blocked queue panel | Working approve/reject mutation | Reuses dashboard/form primitives | No role check, queue, submission context, PDF workspace, comments read, history, score, or revision request. Asking for an ID is poor task UX. |
| `/dashboard/admin` | Admin | Incomplete | `/stats/`, `/categories/`, category-create handler | None | Working supported slice | KPI/table/form patterns complete | No role check; category mutation does not refresh list; dashboard copy may imply admin-only stats although endpoint is public; unsupported research/user/analytics management absent. |

## Route counts

- Existing pages: **9**
- Complete pages: **4** (`/`, `/login`, `/register`, `/research`)
- Incomplete pages: **5**
- Mock-only executable pages: **0**
- Static Stitch screen sets: **10**; these contain fixtures and `href="#"`/no-op interactions and are not application routes.

## Shared components to retain

- `SiteHeader`, `SiteFooter`, `AuthShell`, `DashboardShell`, and `ResearchRail` in [`src/components/shells.tsx`](../src/components/shells.tsx).
- Form/button/state primitives in [`src/components/ui.tsx`](../src/components/ui.tsx).
- `FolioCard` and `ResearchRow` in [`src/components/research.tsx`](../src/components/research.tsx).
- Research adapters and centralized API calls in [`src/features/research`](../src/features/research).

## Duplication and action audit

- Two Stitch discovery screens (`explore_research_uniresearch` and `uniresearch_research_discovery`) duplicate the single `/research` workflow; retain one executable route.
- Student, reviewer, and admin pages share one non-role-aware `DashboardShell`; route groups/layouts should reuse the visual shell but expose role-specific navigation only after an authoritative role endpoint exists.
- Header “Explore categories” points to `/research`, correctly treating category browsing as a filter, but the label suggests a distinct destination.
- Language switches are visual only. Footer privacy/terms/help text and contact details are non-routed/static.
- `SiteHeader` links to `/#about`, but the home page has no `id="about"` section.
- Login/register and all mutation forms are wired. No executable Google, forgot-password, verify-email, notification, citation, profile-edit, revision, or scoring action exists.

