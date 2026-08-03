# P0 frontend implementation report

Implemented routes:

- `/research/[id]`: public research folio using `GET /research/{research_id}`, public shell, authenticated save/download actions, and loading/error/not-found/auth-required states.
- `/student/research/new`: authenticated one-shot submission using `GET /categories/` and the existing `POST /research/` multipart proxy. The legacy `/dashboard/student/submit` redirects here.
- `/advisor/reviews/[id]`: authenticated known-ID workspace using `GET /research/{research_id}`, document download, and `POST /research/{research_id}/review` with only `approved` and `rejected` decisions.

## Deliberately blocked

No fake behavior was added for current-user/role lookup, reviewer queue or assignment, review history, scoring, revision requests, drafts, editing, resubmission, file revisions, author/advisor lookup, PDF preview, citations, or related research. These still require backend contracts documented in `unsupported-design-features.md`.

Authorization remains backend-owned. The frontend can detect a missing HttpOnly session and handles backend `401` and `403` responses, but it does not infer roles from the JWT because no current-user endpoint exists.

## Test environment

Static contract/integration tests cover exact endpoint usage, centralized server access, state boundaries, and forbidden handling. Playwright flows require a disposable real backend plus `E2E_RESEARCH_ID`, student credentials, and advisor credentials; write flows must never target development or production data.

Without those fixture variables the Playwright cases are reported as skipped and no local web server is started. This is intentional protection against running submission or review mutations against an unknown backend.
