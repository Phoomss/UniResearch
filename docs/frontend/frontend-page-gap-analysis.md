# Frontend page-gap analysis

## Decision principles

Recommendations only use verified routes in [backend-capability-map.md](backend-capability-map.md). All work must retain the existing Mulberry Library / Living Research Index tokens, typography, public/dashboard shells, Folio cards, archive tabs, and status components described in [`frontend/DESIGN.md`](../DESIGN.md).

## Pages required now

| Recommended page | Proposed route | Role | Goal | Backend capability / endpoints | Reuse | Priority | Support | Why / surface |
|---|---|---|---|---|---|---|---|---|
| Review workspace by known research ID | `/advisor/reviews/[id]` | Advisor/admin | Read submission context and submit approve/reject comment | `GET /research/{id}`; `POST /research/{id}/review`; authenticated download handshake | `DashboardShell`, Folio/detail sections, `ReviewForm`, status, buttons | P0 | Partially supported | A review is a substantial role-gated stage with a shareable ID. Build as a **page**. It cannot provide queue/history/author metadata. Approval/rejection confirmation should be a **modal**. |
| Saved research | `/account/saved` | Any authenticated role | See and open bookmarks | `GET /favorites/`; optional details (caution: detail GET increments views) | `DashboardShell`, `ResearchRow`, empty/error panels | P1 | Partially supported | A repeat destination is more discoverable than burying it in a student dashboard. Build as a **page**, initially ID-based unless the backend adds enriched favorites. |
| Category administration | `/admin/categories` | Admin | List and create supported categories | `GET /categories/`; `POST /categories/` | Existing admin table and `CategoryForm` | P1 | Supported slice | It is a role-gated primary management workflow. Build as a **page**; create is a **section or modal**, not another route. |
| Category index | `/categories` | Guest/all | Browse categories and jump to filtered research | `GET /categories/`, links to `/research?category_id=` | Public shell, archive tabs, cards | P2 | Supported | Optional navigation convenience; category browsing is shallow. A **page** is acceptable because it is a primary public navigation label. Do not add `/categories/[slug]`: no slug/detail contract. |

Missing-page totals: **P0 1**, **P1 2**, **P2 1**.

## Existing pages requiring completion

| Existing page | Role | Required completion | Backend used | Priority | Surface decision |
|---|---|---|---|---|---|
| `/research/[id]` | Guest/all | Use public shell; add loading/error boundaries; show auth-required messaging for download/favorite; avoid exposing controls as immediately usable to guests; handle any-status caveat | detail, favorite, download | P0 | Keep as **page**; PDF/download action remains a **section/button**, not a new page. |
| `/dashboard/student/submit` | Student/admin | Remove claims that 5/25 MB are backend limits; clearly label frontend safety policy; add 403 and category failure handling; preserve exact multipart names | create research, categories | P0 | Keep as **page**. Author management belongs in a **section**, but remains blocked without lookup. |
| `/dashboard/reviewer` | Advisor/admin | Convert to a landing/entry point linking to `/advisor/reviews/[id]`, or remove after links can deep-link to workspace | no queue endpoint | P1 | Merge functionality into review workspace; no fake queue. |
| `/dashboard/admin` | Admin | Keep only supported global totals/overview; move category management to `/admin/categories`; make lack of authoritative role check explicit | stats | P1 | Keep as overview **page**, with category form removed after merge. |
| `/dashboard/student` | Authenticated | Rename/generalize to account landing or limit to saved items; do not promise student submission tracking | favorites | P1 | Merge saved-items section into `/account/saved`; current “my submissions” section remains blocked. |
| `/login`, `/register` | All/student | Add consistent 500/network and focus management; avoid role-specific redirect claims | auth routes | P1 | Keep pages. |
| `/`, `/research` | Guest | Add route `loading.tsx`; clarify category navigation and error behavior | public feeds/search/categories/stats | P2 | Keep pages; filters remain a **section**. |

## Pages to merge

| Current / proposed elements | Merge target | Reason |
|---|---|---|
| `/dashboard/reviewer` known-ID form | `/advisor/reviews/[id]` | Reviewing without submission context is unsafe and duplicates the detail+decision workflow. Keep only a lightweight ID entry/blocked explanation if no link source exists. |
| Favorites section in `/dashboard/student` | `/account/saved` | Favorites are available to any active role, not specifically students. |
| Category table/form in `/dashboard/admin` | `/admin/categories` | Distinct, supported role workflow; overview remains focused on totals. |
| Both Stitch discovery screens | `/research` | Same search/filter user goal. |
| Student feedback/revisions candidate routes | `/student/research/[id]` tabs/sections, if backend support is later added | Comments, status, and revisions are tightly attached to one submission; separate pages would fragment the workflow. |

## Pages to remove or not create

| Route / screen | Decision | Reason |
|---|---|---|
| `/categories/[slug]` | Do not create | Backend categories have integer IDs and no slug/detail endpoint. Use `/research?category_id=`. |
| `/forgot-password`, `/reset-password`, `/verify-email` | Do not create as functional pages | No backend support. Remove active links; a static blocked page adds little value. |
| `/account` profile editor | Do not create | No current-user/profile read or update API. |
| `/student/research`, `/student/research/[id]`, edit/revisions/feedback variants | Do not create now | No own-submissions list, update, revisions, or comments-read route. |
| `/advisor/reviews`, `/advisor/reviews/history` | Do not create now | No queue/list/history endpoint. |
| `/admin/research`, `/admin/users`, `/admin/reviews` | Do not create now | No management/list endpoints. |
| `/admin/analytics/*` | Do not create now | Only four global totals exist; no popular searches or log-read endpoints. |

## Pages blocked by missing backend support

| Blocked page/workflow | Missing contract |
|---|---|
| Student submissions dashboard and tracking | list by submitter/current user |
| Draft/edit/resubmit/revisions/feedback | create draft, update, submit transition, revision upload/list, comments/history read |
| Advisor queue and history | assignment/list/history/read-review endpoints |
| Admin research/user/review management | list/update/delete/status/user endpoints |
| Detailed analytics pages | aggregate/search/view/download log endpoints |
| Profile/account management | `/me` read/update |
| Password recovery/email verification/OAuth | corresponding auth flows |

## Optional future pages

- `/categories` (P2) may be added now from the list endpoint.
- A public “About” section—not a page—can support the existing `/#about` link with static institutional content.
- If backend contracts are added later: student research detail with tabs, advisor queue, admin research/users, and analytics become appropriate standalone pages.

## Complete role journeys under the actual contract

### Guest

`/` discover latest/popular → `/research` search by title/keyword and filter category → `/research/[id]` view scalar details. Download and bookmark require login. Public PDF preview is not a verified capability.

### Student

`/register` → `/login` → `/dashboard/student/submit` one-shot create (pending) → `/research/[id]` view known ID → `/account/saved` manage favorites. The ideal draft, own-list, feedback, revision, and resubmit journey is blocked.

### Advisor

`/login` → receive/know a research ID outside the API → `/advisor/reviews/[id]` inspect scalar detail/download → add comment → approve or reject. Queue, scoring, revision request, and history are blocked.

### Administrator

`/login` → `/admin` view four global totals → `/admin/categories` list/create categories → `/advisor/reviews/[id]` approve/reject a known work. User/research management and detailed analytics are blocked.

## Final summary

1. **Existing frontend pages:** 9.
2. **Complete pages:** 4 (`/`, `/login`, `/register`, `/research`) for the backend-supported slice.
3. **Incomplete pages:** 5 (`/research/[id]` and the four dashboard pages).
4. **Missing P0 pages:** 1 (`/advisor/reviews/[id]`). Two existing pages also require P0 completion but are not counted as missing.
5. **Missing P1 pages:** 2 (`/account/saved`, `/admin/categories`).
6. **Optional P2 pages:** 1 (`/categories`).
7. **Frontend feature groups blocked by missing backend contracts:** 22. This count is the backend-dependent rows in [unsupported-design-features.md](unsupported-design-features.md); it excludes three non-API product/content gaps (unverified marketing metrics, language-switch implementation, and legal/help destinations).
8. **Top five pages to implement/complete next:** `/advisor/reviews/[id]`; `/research/[id]`; migrate and complete `/student/research/new`; `/account/saved`; `/admin/categories`.
9. **Merge/remove:** merge the known-ID reviewer form into the review workspace, student favorites into Saved, and admin category controls into Admin Categories; keep one `/research` discovery flow; remove or do not create password recovery, verification, profile editing, student tracking/revision, advisor queue/history, admin management, analytics drill-down, and category-slug routes until APIs exist.
10. **Backend integrity:** no backend source file was intentionally modified; final content-hash and Git checks are recorded in the handoff.
