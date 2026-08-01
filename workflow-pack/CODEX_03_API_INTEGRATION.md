# Prompt 03 — Connect frontend to the existing backend

Read `AGENTS.md` and all files under `frontend/docs/` produced by backend analysis.

Modify `frontend/` only. The backend contract is immutable.

Replace frontend mocks one vertical slice at a time:

1. Shared typed API client and error normalization
2. Authentication and session handling
3. Public research list, search, filters, sorting, and pagination
4. Research detail and downloads
5. Student draft/submission, authors, cover, PDF, and revisions
6. Advisor review workflow
7. Admin dashboard and management features that are actually supported

Rules:

- Use exact endpoint paths, HTTP methods, request fields, response fields, enum values, multipart names, and auth headers from the backend.
- Never invent Google OAuth, bookmark, related research, refresh token, or admin operations if the backend does not implement them.
- When backend data differs from UI needs, create typed adapter functions in the frontend.
- Prefer Browser → Next.js Route Handler/Server Action → FastAPI for authenticated or browser-sensitive requests.
- Keep JWT credentials out of localStorage.
- Do not manually set multipart `Content-Type`.
- Preserve backend error codes while mapping them to understandable Thai messages.
- Handle 400, 401, 403, 404, 409, 422, 500, network failure, and session expiration.
- Delete mock data only after its real integration and tests pass.

After each vertical slice, run relevant tests, typecheck, and verify backend git status is clean.
