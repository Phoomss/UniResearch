# UniResearch backend API analysis

Analysis date: 2026-08-01 (Phase 1 only)

## Scope and evidence

The backend was read only. Evidence was reviewed from `app/main.py`, every router, schema, core security/configuration module, service, model, the two test modules and fixtures, then `README.md`. The current frontend application and all Stitch HTML exports were also inspected.

Runtime OpenAPI and tests could not be executed on this host. Python 3.13.14 is present but none of the backend packages are installed. A temporary dependency installation outside the repository did not complete, and Docker has no running daemon. In addition, `requirements.txt` omits `pytest`, `pytest-asyncio`, `httpx`, and `aiosqlite`, although the test suite imports them. `backend-openapi.json` is therefore a clearly identified **source-derived FastAPI contract snapshot**, not an observed `/openapi.json` response. It must be replaced and diffed when a runnable isolated backend is available.

## Application topology

- FastAPI mounts `/static` from the process-relative `static/` directory.
- `/docs` redirects to a custom `/swagger`; schema remains at the FastAPI default `/openapi.json`.
- Startup calls `Base.metadata.create_all`, so starting against development/production is a write operation. Runtime verification must use a disposable database.
- Routers: authentication, categories, research, favorites, statistics, home feeds.
- No CORS middleware is configured. Frontend integration should be server-to-server through Next.js.

## Authentication and authorization

- Login is `POST /auth/login` using OAuth2 password form fields `username` and `password`, not JSON and not an `email` field.
- Success returns `{access_token, token_type: "bearer"}`. There is no refresh token, logout endpoint, current-user endpoint, cookie support, email verification, password reset, or OAuth provider flow.
- JWT uses HS256 by default, `sub` is the user's email, and `exp` is a numeric JWT timestamp derived from a 30-minute default. Only access tokens exist.
- Protected calls require `Authorization: Bearer <token>`. Missing/invalid tokens produce 401 with `WWW-Authenticate: Bearer`; inactive users produce 400; role denial produces 403.
- Roles observed in models/README are `guest`, `student`, `advisor`, and `admin`, but schemas do not constrain the string. Public registration accepts an arbitrary client-supplied role, including `admin`; this is a critical security/contract risk.
- Recommended frontend session: login through a Next.js Route Handler, store only the access token in a Secure/HttpOnly/SameSite cookie, and attach the bearer header from server code. Do not implement refresh behavior.

## Data contracts

`ResearchWorkResponse` contains scalar research fields and storage paths, but no category object/name, authors, advisors, submitter profile, reviews, citation count, DOI, institution, language, tags array, or revision history. `keywords` is one nullable string rather than an array. Dates serialize as ISO date-time strings.

Status is an unconstrained string. The model comment names `pending`, `approved`, `rejected`; review comments also mention `revision_needed`. Any supplied `status_result` is persisted both as the review result and research status.

There is no pagination envelope anywhere. Search returns a bare array and supports only `q` and `category_id`. Home feeds accept only `limit`, with no declared bounds. Search checks Thai title, English title, and keywords; contrary to README, it does not search abstract. There is no sort parameter.

FastAPI's normal validation errors use `{detail: [{type, loc, msg, input, ...}]}`. Explicit application errors use `{detail: string}`. Unhandled database/JSON/file errors may be 500 responses and have no normalized application schema.

## Mutating reads and file behavior

- `GET /research/{id}` increments `view_count` and inserts a view log, including for unapproved works and anonymous users.
- `GET /research/search?q=...` inserts a search log and commits.
- Create upload fields are exactly `cover_image` and `document`. Both are optional. No MIME, extension, size, filename, or content validation exists.
- Uploads use the original client filename under predictable process-relative paths, overwriting collisions and permitting unsafe filenames/path traversal depending on platform/path input.
- `POST /research/{id}/download` requires login, increments a counter, and returns JSON `{file_url}`. It does not stream binary data or set `Content-Disposition`/download `Content-Type`. Static-file retrieval is a separate unauthenticated GET under `/static/...`.

## Tests and observed coverage

Five tests exist: registration success, login success, wrong-password 400, admin research creation, and admin create/review/search. The fixture uses disposable in-memory SQLite and dependency override, but required test dependencies are undeclared. There are no tests for authorization denial, arbitrary roles, inactive users, duplicate email, categories reads, uploads, detail/view logging, downloads, favorites, stats, home feeds, advisor review, errors, pagination, or static files.

## Source/README/tests/OpenAPI disagreements

- README says four RBAC roles, while public input accepts any role string and no enum is exposed.
- README describes full-text search over title, abstract, or keywords; source implements SQL `ILIKE` only on two titles and keywords.
- README describes revision/version support; models exist, but no revision endpoint/service behavior exists.
- README describes review scoring; no score field exists.
- README describes popular search statistics; no endpoint exposes them.
- README says its suite covers review/approval and describes an in-memory database, but test dependencies are missing from requirements. Only five narrow cases exist.
- OpenAPI will advertise a `FavoriteResponse` for favorite toggle success, while the removal branch deliberately raises an HTTP 200 exception with `{detail: "Removed from favorites"}`.
- OpenAPI declares the OAuth password flow token URL as relative `auth/login`; the actual route is `/auth/login`.
- Tests approve research using an admin, so they do not demonstrate the advertised advisor path.

## Frontend-only implementation phases

1. Establish generated/handwritten strict API types, normalized errors, server-only base client, and source-vs-runtime contract tests.
2. Add login/register Route Handlers and HttpOnly access-token session handling; omit unsupported OAuth, verification, reset, refresh, and current-user features.
3. Integrate public categories, search, home feeds, details, stats, and adapters for nullable/string fields and static URLs.
4. Integrate authenticated submission with exact multipart fields, JSON-encoded ID strings, frontend file validation, and student/admin role gating as UX only.
5. Integrate favorites, JSON download handshake, and advisor/admin review with explicit handling for the favorite toggle union response.
6. Build dashboards only from available contracts; mark user-specific submissions, reviewer queues, revisions, notifications, scoring, profiles, and richer analytics blocked.
7. Against a disposable real backend, replace the derived OpenAPI snapshot, run contract/integration/Playwright checks, then lint, typecheck, unit tests, and production build.

## Repository integrity

No backend or frontend application code was modified. The exact requested `git -C backend status --porcelain` could not be confirmed empty: Git resolves `backend` to the parent repository and reports pre-existing untracked `AGENTS.md`, `frontend/design/`, and `workflow-pack/`. This Phase 1 work added only files under `frontend/docs/`; no path under `backend/` was changed.
