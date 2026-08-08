# Development admin login verification report

**Date:** 3 August 2026  
**Scope:** Current local development environment only

## Result

The frontend authentication integration and isolated authorization contract tests pass. Live administrator provisioning and browser login were not performed because the current process did not contain `DEV_ADMIN_EMAIL` or `DEV_ADMIN_PASSWORD`. No password, JWT, or cookie value was printed or recorded.

## Environment and routes

- Frontend address: `http://localhost:3000` (configured development default; not started for live credential verification)
- Backend address: `http://127.0.0.1:8000`
- Backend login: `POST /auth/login`, form fields `username` and `password`
- Frontend login proxy: `POST /api/auth/login`
- Login page: `/login?next=/admin`
- Successful redirect target: `/admin`
- Cookie name: `uniresearch_access_token` (value not inspected or recorded)
- Admin pages in scope: `/admin` and `/admin/categories`

## HTTP and database observations

- Running local Docker FastAPI: `/swagger` returned HTTP 200.
- Running local Docker FastAPI: `/openapi.json` returned HTTP 200.
- Local Docker PostgreSQL: harmless `SELECT 1` succeeded.
- Host-side backend configuration: connection failed with `InvalidPasswordError`.
- Root cause: the credential in the existing host-side `backend/.env` does not match the credential source used by the existing Docker Compose PostgreSQL volume.
- Database reset: not performed; `ALLOW_RESET_DEV_DB` was absent.
- Persistent database writes: none.

## Authentication and authorization verification

The isolated backend suite verified administrator provisioning, a successful form login response containing `access_token` and `token_type`, successful admin category creation, refusal to promote an existing student, and safe rollback behavior. The persistent local development administrator was not created, and its live login was not tested because required credentials were absent.

Loading `/admin` alone was not treated as proof of administrator authorization. Persistent category creation was not attempted because `ALLOW_DEV_WRITE_VERIFICATION` was absent. Student/advisor/missing-token authorization checks are covered by existing isolated backend behavior and documentation; no persistent local records were created for these checks.

## Tests executed

- Backend: `python -m pytest tests -p no:cacheprovider -v` — 25 passed, 18 warnings.
- Frontend typecheck: passed.
- Frontend lint: passed.
- Frontend unit/API contract tests: 17 passed.
- Frontend production build: passed.
- Playwright: command passed, but all 6 tests were skipped because the required explicit disposable fixture was not available.

## Skipped live checks

- Provisioning the persistent local development administrator.
- Live `POST /auth/login` with development administrator credentials.
- Live frontend `POST /api/auth/login` and HttpOnly cookie creation.
- Browser redirect to `/admin`, protected `/admin/categories` mutation, and logout cookie clearing.
- Screenshots and Playwright traces were not produced.

## Readiness

**Blocked for live admin-login readiness.** The local Docker database and FastAPI are healthy, and isolated backend/frontend checks pass, but the host-side database credential must be reconciled and the required development-only administrator credentials must be supplied before provisioning and browser verification can run.

No backend report was created or updated because repository-level `AGENTS.md` makes every file under `backend/` immutable.
