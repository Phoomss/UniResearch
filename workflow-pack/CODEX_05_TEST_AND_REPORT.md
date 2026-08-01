# Prompt 05 — Run project, test integration, and summarize

Read `AGENTS.md` and the completed integration matrix.

Do not modify `backend/`.

Use the backend's isolated test environment or disposable Docker database. Never run write-flow tests against persistent development or production data.

Execute and record exact commands and exit codes for:

1. Existing backend test suite
2. Frontend lint
3. Frontend TypeScript check
4. Frontend unit tests
5. Frontend API contract tests against the real test backend
6. Frontend production build
7. Playwright E2E tests against Next.js plus the real isolated backend

Test supported flows including public search, research detail, login, invalid login, role-based protection, student submission, PDF upload, advisor review, admin features, logout, and session expiration. Skip only flows unsupported by the backend or missing deterministic fixtures, and record the exact reason.

Create `frontend/docs/integration-test-report.md` with:

- commits tested
- environment
- exact commands
- endpoint coverage
- passed, failed, and skipped tests
- remaining mock data
- unsupported Stitch actions
- contract mismatches
- failed-test traces/screenshots
- confirmation that backend remained unchanged

Finally run:

```bash
git -C backend status --porcelain
git -C backend diff --exit-code
```

Do not claim success if either command reports changes or any required test failed.
