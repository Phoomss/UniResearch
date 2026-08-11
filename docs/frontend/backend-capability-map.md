# Backend capability map

Audit date: 2026-08-03. Support labels mean **Supported**, **Partially supported**, **Not supported**, or **Unknown / runtime verification required**. A model without a router is not a usable capability.

## Verification basis and runtime caveat

- FastAPI keeps the default OpenAPI URL, `/openapi.json`, while disabling only `docs_url`; `/docs` redirects to `/swagger`, whose UI reads `app.openapi_url` ([`backend/app/main.py:20-50`](../../backend/app/main.py)).
- The documented local command is `uvicorn app.main:app --reload` ([`backend/README.md:86`](../../backend/README.md)). A safe launch was attempted from a temporary working directory with a disposable SQLite URL and bytecode disabled (to prevent `research_service.py` from creating upload folders under `backend/`). It could not start because the installed Python has no `uvicorn`; the same environment also lacks `pytest_asyncio` and `httpx`. Docker could not be used because its daemon is inaccessible. Consequently, live OpenAPI and backend tests are **not runtime-verified in this audit**.
- [`backend-openapi.json`](../backend/backend-openapi.json) explicitly identifies itself as a **source-derived snapshot**, not a runtime capture. Its paths agree with the included routers, but it is not live-runtime evidence.
- The test suite uses disposable in-memory SQLite and overrides `get_db` ([`backend/tests/conftest.py:17-42`](../../backend/tests/conftest.py)). No development/production database mutation was attempted.

## Endpoint contract inventory

| Capability | Endpoint / method | Request schema | Response schema | Authentication | Required role | Backend proof | Test proof | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Registration | `POST /auth/register` | JSON `UserCreate`: email, password; role defaults `guest`; optional profile fields | `UserResponse` | None | None | [`auth.py:11-13`](../../backend/app/routers/auth.py), [`user.py:4-20`](../../backend/app/schemas/user.py) | [`test_auth.py:5-13`](../../backend/tests/test_auth.py) | Partially supported | Service persists only email, password hash, and caller-supplied role; it drops profile fields and trusts role ([`auth_service.py:9-19`](../../backend/app/services/auth_service.py)). Frontend safely forces `student`.
| Login / JWT | `POST /auth/login` | OAuth2 form: `username`, `password` | `Token {access_token, token_type}` | None | None | [`auth.py:15-19`](../../backend/app/routers/auth.py), [`token.py:4-6`](../../backend/app/schemas/token.py) | [`test_auth.py:16-33`](../../backend/tests/test_auth.py) | Supported | JWT subject is email; HS256; 30-minute default; no refresh token ([`security.py:15-23`](../../backend/app/core/security.py), [`config.py:8-10`](../../backend/app/core/config.py)).
| Current user | — | — | — | — | — | No router operation; dependency only resolves a user internally ([`deps.py:12-34`](../../backend/app/routers/deps.py)) | None | Not supported | Token presence cannot provide authoritative profile/role to the UI.
| Categories list | `GET /categories/` | — | `CategoryResponse[]` | None | Public | [`category.py:20-22`](../../backend/app/routers/category.py), [`category.py:4-16`](../../backend/app/schemas/category.py) | None | Supported | No slug, detail, update, or delete.
| Category create | `POST /categories/` | JSON `CategoryCreate` | `CategoryResponse` | Bearer JWT | `admin` | [`category.py:12-18`](../../backend/app/routers/category.py) | Indirectly used in [`test_research.py:6-16`](../../backend/tests/test_research.py) | Supported | Duplicate-name handling is not normalized.
| Create research | `POST /research/` | multipart: required `title_th`, `title_en`, `category_id`; optional scalar fields; JSON strings `author_ids`, `advisor_ids`; files `cover_image`, `document` | `ResearchWorkResponse` | Bearer JWT | `student`, `admin` | [`research.py:12-35`](../../backend/app/routers/research.py), [`research.py:5-32`](../../backend/app/schemas/research.py) | [`test_research.py:6-29`](../../backend/tests/test_research.py) | Partially supported | One-shot create only; initial status is `pending`. No draft/update/resubmit endpoint. Authors/advisors can be written by numeric ID but no lookup API exists.
| Cover upload | Part of `POST /research/` | multipart field `cover_image` | Stored path in response | Bearer JWT | `student`, `admin` | [`research.py:24-25`](../../backend/app/routers/research.py), [`research_service.py:15-47`](../../backend/app/services/research_service.py) | None | Partially supported | Backend has no MIME, size, filename, or overwrite protection. Frontend limits are policy, not backend contract.
| PDF upload | Part of `POST /research/` | multipart field `document` | Stored path in response | Bearer JWT | `student`, `admin` | Same files as cover upload | None | Partially supported | No backend PDF-only or size rule; no revision upload.
| Search and category filter | `GET /research/search` | query `q?`, `category_id?` | approved `ResearchWorkResponse[]` | None | Public | [`research.py:38-44`](../../backend/app/routers/research.py), [`research_service.py:77-95`](../../backend/app/services/research_service.py) | [`test_research.py:32-65`](../../backend/tests/test_research.py) | Partially supported | `q` searches Thai title, English title, keywords—not abstract. No sort, pagination, facets, or result count.
| Research detail / views | `GET /research/{research_id}` | integer path ID | `ResearchWorkResponse` | None | Public | [`research.py:46-51`](../../backend/app/routers/research.py), [`research_service.py:97-107`](../../backend/app/services/research_service.py) | None | Partially supported | Every GET increments views/logs and exposes any status by ID. Response omits authors, advisors, category object, reviews, and files metadata.
| Download | `POST /research/{research_id}/download` then static URL | integer path ID | JSON `{file_url}`; OpenAPI leaves body untyped | Bearer JWT for handshake | Any active user | [`research.py:53-59`](../../backend/app/routers/research.py), [`research_service.py:109-119`](../../backend/app/services/research_service.py) | None | Partially supported | POST does not stream bytes; returned `/static/...` is subsequently public. No `Content-Disposition` contract.
| Submit review decision | `POST /research/{research_id}/review` | JSON `ReviewCommentCreate {comment_text,status_result}` | `ReviewCommentResponse` | Bearer JWT | `advisor`, `admin` | [`research.py:61-68`](../../backend/app/routers/research.py), [`research.py:34-47`](../../backend/app/schemas/research.py) | Admin approval in [`test_research.py:49-54`](../../backend/tests/test_research.py) | Partially supported | Known-ID write only. No assignment/queue/history/read-comments endpoint. `status_result` is unconstrained and directly becomes research status ([`research_service.py:121-137`](../../backend/app/services/research_service.py)).
| Favorites / bookmarks | `POST /favorites/{research_id}`; `GET /favorites/` | path ID / none | add: `FavoriteResponse`; remove: HTTP 200 `{detail}`; list: IDs/timestamps | Bearer JWT | Any active user | [`interactions.py:13-41`](../../backend/app/routers/interactions.py), [`interactions.py:5-12`](../../backend/app/schemas/interactions.py) | None | Partially supported | Toggle removal contradicts declared response model. List lacks research metadata.
| Dashboard totals | `GET /stats/` | — | untyped object with total users, research works, views, downloads | None | Public | [`stats.py:12-25`](../../backend/app/routers/stats.py) | None | Supported | Global totals only; not admin-protected and not segmented analytics.
| Latest approved | `GET /home/latest` | `limit` integer, default 5 | `ResearchWorkResponse[]` | None | Public | [`home.py:12-20`](../../backend/app/routers/home.py) | None | Supported | `published_at` is never set by review service, so ordering can be weak.
| Popular approved | `GET /home/popular` | `limit` integer, default 5 | `ResearchWorkResponse[]` | None | Public | [`home.py:22-30`](../../backend/app/routers/home.py) | None | Supported | Popular means `view_count`, not downloads/citations.

The source-derived OpenAPI operation set is exactly: `POST /auth/register`, `POST /auth/login`, `GET|POST /categories/`, `POST /research/`, `GET /research/search`, `GET /research/{research_id}`, `POST /research/{research_id}/download`, `POST /research/{research_id}/review`, `GET /favorites/`, `POST /favorites/{research_id}`, `GET /stats/`, `GET /home/latest`, `GET /home/popular`, and `GET /`. This list is corroborative only; it is not represented as a live capture.

## Requested capability classification

| Capability | Classification | Exact evidence / limitation |
|---|---|---|
| Authentication | Supported | Login route and tests above. |
| Registration | Partially supported | Route/test exist; arbitrary role input and dropped profile fields. |
| Current user | Not supported | No `/me` or equivalent route. |
| JWT token behavior | Supported | Access token JSON, bearer header, email subject, 30-minute expiry; no refresh. |
| Roles and permissions | Partially supported | Enforcement exists only on create research/category/review; no authoritative frontend role lookup. Model comment lists `guest/student/advisor/admin` ([`models/user.py:10`](../../backend/app/models/user.py)). |
| Student research submissions | Partially supported | One-shot create only. |
| Draft and submission statuses | Not supported | Model default is `pending`; no draft or submit transition. |
| Multiple research authors | Partially supported | Join model and create-time numeric IDs exist, but no lookup/read/update API. |
| Cover upload | Partially supported | Create-time optional upload, no validation contract. |
| PDF upload | Partially supported | Create-time optional upload, no validation contract. |
| File revisions | Not supported | `FileRevision` model exists ([`models/research.py:56-67`](../../backend/app/models/research.py)); no route/service. |
| Search | Supported | Approved works; title/keywords search. |
| Filters | Partially supported | Category only. |
| Categories | Partially supported | List/create only; no slug/detail/update/delete. |
| Sorting | Not supported | Only fixed latest/popular feeds; search has no sort parameter. |
| Pagination | Not supported | Search returns a bare array. |
| Public research details | Partially supported | Scalar details only; any status exposed; GET mutates views. |
| Research views | Supported | Count and view log on detail GET. |
| Downloads | Partially supported | Authenticated handshake plus public static file URL. |
| Advisor review queue | Not supported | No list/assignment route. |
| Review comments | Partially supported | Create only; cannot read comments/history. |
| Scoring | Not supported | No score field/schema/route despite README claim. |
| Request revision | Unknown / runtime verification required | Model comment mentions `revision_needed` ([`models/research.py:76`](../../backend/app/models/research.py)); schema accepts any string, but no test, enum, or revision workflow. Do not expose yet. |
| Approval | Supported | Tested via review endpoint with `approved`. |
| Rejection | Partially supported | Model documents `rejected`, endpoint accepts it, but no test. |
| Admin research management | Not supported | Admin can create/review known IDs; no management list/update/delete/publication operation. |
| User management | Not supported | No users routes. |
| Category management | Partially supported | Create/list only. |
| Dashboard statistics | Supported | Four public totals. |
| Popular research | Supported | `/home/popular`. |
| Popular searches | Not supported | Search logs are written but never exposed. |
| View logs | Partially supported | Written internally; no read endpoint. |
| Download logs | Partially supported | Written internally; no read endpoint. |
| Google OAuth | Not supported | No OAuth route/service. |
| Email verification | Not supported | No fields/routes. |
| Password reset | Not supported | No routes/tokens. |
| Bookmarks | Partially supported | Favorite toggle/list, but list has IDs only. |
| Notifications | Not supported | No model/schema/route. |
| Profile management | Not supported | No current-user read/update route. |

## Source disagreements

- README claims abstract search, scoring, revision/version workflows, popular searches, and richer analytics; routers/services do not implement them. Router/service/test reality wins.
- `ResearchWorkCreate` models authors/advisors as integer arrays, but the actual multipart route accepts JSON-encoded strings. The route/OpenAPI shape wins.
- Registration schema accepts profile fields, but service discards them. Runtime output is expected to contain null defaults; live confirmation remains unavailable.
- OpenAPI says favorite toggle returns `FavoriteResponse`, while removal deliberately raises HTTP 200 with `{detail}`. Implementation wins.
