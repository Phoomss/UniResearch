# Phase 3 API integration report

## Implemented

- Central server API client using `BACKEND_API_URL` (default `http://127.0.0.1:8000`), exact contract types, normalized Thai errors, and frontend view-model adapters.
- Login proxy translates JSON form input to backend OAuth password fields `username`/`password`. The access token is held in a 30-minute Secure-in-production, HttpOnly, SameSite=Lax cookie. Logout clears only the frontend cookie. A backend 401 also clears the session.
- Safe registration always sends role `student`; the UI never accepts a role value.
- Public stats, latest/popular feeds, category list, search by `q`/`category_id`, and detail by ID.
- Favorite add/remove union response, authenticated download handshake followed by binary forwarding, exact research multipart submission, review with confirmed `approved`/`rejected` values, and admin category creation.
- Handling for 400, 401, 403, 404, 409, 422, 500, unrecognized statuses, network failures, and session expiration.

## Contract adaptations

- Research category IDs are joined to the public category list; missing categories display `หมวดหมู่ #ID`.
- Nullable backend fields receive explicit “not specified” display values. Keyword strings are split for display only.
- Unknown role/status strings are not treated as authorization truth. Status adapters preserve the raw value.
- Detail links disable Next.js prefetch because backend detail reads increment view counts.
- Search displays the complete bare array. Sorting and pagination controls were removed because the backend supports neither.
- Download uses the backend POST handshake and then proxies bytes while preserving backend `Content-Type` and `Content-Disposition` when present.

## Blocked or intentionally omitted

- Google OAuth, password reset, email verification, refresh tokens, backend logout, and current-user/profile lookup.
- My Submissions, reviewer queues, review history, revision upload/history, user/author/advisor lookup, notifications, citations, related research, reviewer scoring, and admin user/research management.
- Author/advisor fields submit as JSON strings `[]` because no lookup API exists. The UI discloses this limitation.
- `revision_needed` is not offered as a review action because it appears only in a model comment and lacks contract/test confirmation.
- Frontend upload checks (image ≤5 MB, PDF ≤25 MB) are a UI/BFF policy, not a claim about backend enforcement.

## Verification results and constraints

- Frontend contract/unit tests: 7 passed.
- TypeScript strict check: passed.
- ESLint: passed with zero warnings.
- Next.js production build: passed; all expected application and Route Handler routes compiled.

The backend OpenAPI file is source-derived rather than runtime-captured. A real backend was not called because no isolated backend environment is available and registration/submission/review writes must never target development or production. Live integration tests and Playwright against a real test backend therefore remain blocked. The backend Python environment also remains unavailable/undeclared as documented in Phase 1.
