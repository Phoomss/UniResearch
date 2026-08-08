# P0 frontend implementation report

Verification date: 2026-08-03.

## Pages implemented

All backend-supported P0 pages are implemented and integrated:

- `/research/[id]`: public scalar research folio with category adaptation, authenticated favorite toggle, authenticated download, and loading/error/not-found/auth-required states.
- `/student/research/new`: authenticated one-shot multipart submission with required categories and the backend-created `pending` status.
- `/advisor/reviews/[id]`: authenticated known-ID review workspace with research context, download, confirmation dialog, and `approved`/`rejected` decisions.
- `/dashboard/student/submit`: compatibility redirect to the canonical submission route.

These pages existed at the start of this phase. This pass re-verified their backend contracts and completed two concrete P0 hardening items: shared form labels are now programmatically associated with controls, and all research-ID BFF handlers reject zero/negative IDs. The review handler also rejects whitespace-only comments.

## Routes and endpoints

No new page route was required. Existing integrations remain:

| Frontend route | Verified backend operations |
|---|---|
| `/research/[id]` | `GET /research/{research_id}`, `GET /categories/`, `POST /favorites/{research_id}`, `POST /research/{research_id}/download` |
| `/student/research/new` | `GET /categories/`, `POST /research/` multipart |
| `/advisor/reviews/[id]` | `GET /research/{research_id}`, `GET /categories/`, `POST /research/{research_id}/download`, `POST /research/{research_id}/review` |

Browser mutations continue through Next Route Handlers. No raw backend call was added to a presentation page, no backend schema was adapted in place, and no mock fallback was introduced.

## Components

Reused: `SiteHeader`, `SiteFooter`, `DashboardShell`, `ArchiveTab`, `Status`, `StatePanel`, `ResearchActions`, `SubmissionForm`, `ReviewForm`, and the centralized research adapter/API/session/error modules.

No duplicate component was added. The existing `Field` primitive was extended backward-compatibly so its visible label targets the child control's `id` or `name`. This benefits P0 submission and review controls while preserving existing usages.

## Authentication and role restrictions

- Public detail remains unauthenticated.
- Favorite and download require any active backend-authenticated user.
- Submission requires backend role `student` or `admin`.
- Review requires backend role `advisor` or `admin`.
- The frontend checks token presence where practical and handles 401/403, but does not infer roles because the backend has no current-user endpoint.

## Tests executed

| Command | Result |
|---|---|
| `pnpm.cmd test` | Passed: 10 tests, 0 failures |
| `pnpm.cmd typecheck` | Passed |
| `pnpm.cmd lint` | Passed |
| `pnpm.cmd build` | Passed; all P0 pages and Route Handlers compiled |
| `pnpm.cmd test:e2e` | Runner passed with 3 tests skipped |

The Playwright cases were skipped by their safety guards because no disposable-backend `E2E_*` fixture variables were provided. They were not marked passed or used against development/production data. Real-backend P0 integration therefore remains blocked, and the pages remain `Integrated` rather than `Tested` in the progress tracker.

## Remaining mock data and blocked functionality

Executable P0 pages contain no research fixture fallback. Static institutional marketing/support copy remains outside the P0 data flows.

Deliberately blocked: current-user/role lookup, student own-submission list, drafts, editing, resubmission, author/advisor lookup, file revisions, reviewer queue/assignment/history, scoring, revision requests, read-review comments, PDF preview, citations, and related research. No endpoint was invented for any of these features.

## Known design differences

- Detail and review render only scalar metadata returned by the backend.
- Submission cannot select authors/advisors and sends the documented empty JSON arrays.
- Review is reachable only by a known ID because there is no queue endpoint.
- Download is an authenticated handshake and server-proxied file, not an inline PDF preview.
- Frontend file limits remain explicitly described as frontend safety policy, not backend validation.

## Backend integrity

No backend file was modified or created. Backend tests were not rerun because the previously documented local backend runtime dependencies and isolated test environment are unavailable. The final Git check for this phase must remain clean under `backend/`.
