# Backend contract risks

| Severity | Risk | Frontend consequence / mitigation |
|---|---|---|
| Critical | Public registration trusts arbitrary `role`; service persists it | Never expose role escalation; frontend cannot secure this backend behavior. Escalate to backend/security owners. |
| Critical | Uploads use unsanitized original filenames and no size/MIME validation | Add frontend/BFF validation, but document that backend remains directly exploitable and files may overwrite/traverse. |
| High | Static document URLs are unauthenticated after an authenticated counter POST | Do not describe files as access-controlled; proxying cannot fix direct backend exposure. |
| High | Runtime and tests were not executable in this environment | Replace derived OpenAPI and rerun suite before implementation acceptance. |
| High | `requirements.txt` omits all test dependencies including SQLite driver | Reproducibility blocker; report to backend owner, do not change backend in frontend integration. |
| High | Status and role fields are unconstrained strings | Define conservative frontend unions plus unknown fallback; do not assume exhaustive enums. |
| High | Detail GET and search GET write database state | Avoid prefetching detail routes; understand retries/crawlers inflate analytics. |
| High | Favorite toggle has two incompatible 200 bodies despite one OpenAPI response model | Normalize as a frontend discriminated union by inspecting `detail` vs favorite fields. |
| High | Registration response schema includes profile fields that service never persists from input | Do not promise persisted student ID/name/department; confirm runtime output defaults to null. |
| High | No current-user endpoint and JWT only identifies email | Server session can prove token presence, not fetch authoritative role/profile without another endpoint. Avoid client-trusted role authorization. |
| Medium | Download POST returns JSON URL, not a file | BFF must call POST, resolve backend-relative URL, then fetch/forward bytes if desired; backend provides no disposition filename. |
| Medium | Search has no pagination/sort and uses unescaped wildcard semantics | Keep result sets bounded only by backend data; UI pagination would be client-only and incomplete. `%`/`_` act as SQL wildcards. |
| Medium | README claims abstract full-text search, scoring, revisions, and richer analytics not implemented by routes | Treat these features as blocked, not hidden endpoints. |
| Medium | Research detail is public for any ID/status | UI should not assume pending/rejected works are confidential. |
| Medium | `published_at` is never assigned in reviewed service | Latest feed may order approved rows with null publication dates; adapters need null handling. |
| Medium | Research create accepts author/advisor IDs but no user lookup endpoint exists | UI cannot provide a correct selector from backend data; block or require externally known IDs. |
| Medium | Malformed JSON ID strings, duplicate categories, FK failures, and file errors are not normalized | BFF error normalizer must handle non-JSON/500 responses and avoid leaking internals. |
| Medium | No duplicate constraint/logic is evident for favorites | Concurrent toggles may produce duplicates; UI should serialize toggle requests. |
| Low | OAuth security scheme token URL is relative `auth/login` | Use actual `/auth/login`; verify runtime client generation behavior. |
| Low | No CORS middleware | Use Next server-to-server calls as required. |
| Low | Home `limit` has no minimum/maximum | Frontend should send a positive bounded value. |

## Verification blockers and required follow-up

1. Provision an isolated environment with backend and test dependencies (without changing backend-owned files).
2. Start with a disposable SQLite/PostgreSQL database because application startup creates tables.
3. Capture the live `/openapi.json` and diff it against `backend-openapi.json`.
4. Run `PYTHONPATH=. pytest tests/ -v` with bytecode/cache writes disabled or outside `backend/`.
5. Probe error bodies, favorite removal, upload behavior, static downloads, null serialization, and role/status acceptance only against disposable fixtures.
6. Re-run repository integrity checks. Current status is not empty because the parent worktree already contains untracked `AGENTS.md`, `frontend/design/`, and `workflow-pack/`; this is not a backend application change made in Phase 1.
