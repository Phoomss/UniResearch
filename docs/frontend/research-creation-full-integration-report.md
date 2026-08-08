# Research creation full integration report

## 1. Executive summary

Research creation failed for multiple independent reasons. The configured local backend could not start because its PostgreSQL password did not match Docker Compose. The frontend environment named the backend variable `BACKEND_URL`, while the API client ignored it. Next 16 blocked client resources when Playwright/browser traffic used `127.0.0.1`, leaving forms unhydrated. An unhydrated login form defaulted to GET and exposed credentials in the URL. Shared fields did not consistently associate labels with controls. The research form discarded all selected people IDs, had no participant source, and could submit automatically while transitioning into Review because React reused a button while its type changed from `button` to `submit`.

The backend also wrote arbitrary uploads under client filenames before database validation, used launch-directory-dependent paths, did not validate related IDs or roles, and left files behind when a later database or upload operation failed.

After repair, a credentialed Playwright flow logged in through Next.js, loaded real participants and categories, completed every form step at desktop/tablet/mobile widths, uploaded real PNG/PDF content, received a real backend response, and displayed its real detail link. PostgreSQL record `id=5` was independently verified with one author relationship and both stored files. The direct live API verification also created and retrieved a real research record.

## 2. Reproduction

### Initial backend failure

Running `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000` initially failed during lifespan startup. The backend log ended with `asyncpg.exceptions.InvalidPasswordError: password authentication failed for user "postgres"`. A safe comparison confirmed that the `.env` URL password differed from `POSTGRES_PASSWORD` in `docker-compose.yml`.

After aligning the password, SQLAlchemy connected, inspected every expected table, and completed startup. A second bind then returned Windows error 10048 because the Compose backend already occupied port 8000; `docker compose ps` confirmed healthy `web` and `db` services.

### Browser/network failures

The first browser login remained on `/login`. The trace showed a native navigation to `/login?email=...&password=...`: React had not hydrated and the form defaulted to GET. After adding hydration protection, Next development logs showed the underlying resource problem: `Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr from "127.0.0.1"`.

Once hydration worked, Playwright could reach the submission page but could not locate controls by their visible labels. The DOM showed labels with `for` values while the corresponding inputs had no IDs. After that repair, the workflow reached Review but submitted before the explicit final click. The success snapshot already contained real research ID 2; React had reused the Continue DOM button while changing it from `type="button"` to `type="submit"` during activation.

### HTTP and data evidence

- Root and `/openapi.json`: HTTP 200.
- Live `/research/participants` route present.
- Direct authenticated `POST /research/`: HTTP 200 with integer ID.
- Direct `GET /research/{id}`: HTTP 200 with matching ID.
- Credentialed browser workflow: one Playwright test passed in 7.3 seconds, and the final viewport-enabled rerun passed in 7.3 seconds.
- PostgreSQL verification: research ID 5, status `pending`, one `research_authors` row, zero advisor rows because no advisor account existed, valid PNG and PDF signatures on disk.

## 3. Root cause analysis

| Root cause | Evidence | Impact | Repair |
| --- | --- | --- | --- |
| Local DB password mismatch | Uvicorn startup `InvalidPasswordError`; safe comparison returned false | Backend unavailable | Aligned local/example URL with Compose password |
| Frontend variable mismatch | `.env.local` has `BACKEND_URL`; client read only `BACKEND_API_URL` | Silent wrong backend target outside the default localhost case | Client accepts `BACKEND_API_URL` then `BACKEND_URL` |
| Next dev origin blocked | Next log explicitly blocked `127.0.0.1` resources | Client forms never hydrated | Added `allowedDevOrigins: ["127.0.0.1"]` |
| Unsafe pre-hydration auth submission | Trace navigated with email/password query parameters | Login blocked and credentials exposed in URL | Forms use POST and submit buttons remain disabled until hydration |
| Broken label association | Browser snapshot showed labels and unlabeled controls | Keyboard/assistive-tech failure and E2E interaction failure | Shared `Field` assigns IDs and wraps controls without a usable ID |
| People data discarded | Next proxy unconditionally wrote both arrays as `[]` | Authors/advisors never persisted | Real participant endpoint, UI selectors, JSON serialization, and proxy forwarding |
| Review auto-submitted | Success DOM appeared before final click | Users could not review before creation | Separate keyed Continue and Submit button instances |
| Unsafe/collision-prone storage | Service used `open(directory / upload.filename)` before DB validation | Traversal/collision risk and orphan files | Absolute configured root, UUID names, signature/type/size checks, atomic replace, cleanup |
| Related data not validated | Raw `json.loads` and immediate FK inserts | 500/constraint failures and unclear errors | Typed JSON parsing plus category/user/role validation |
| Missing rollback mapping | Service committed without scoped exception cleanup | Files and transactions could diverge | Rollback and file cleanup; 409/500 mappings and server logs |

## 4. Frontend analysis

- Entry points in the header and Index Rail point to the canonical submission route through the existing redirect convention.
- `/student/research/new` remains session-protected and uses the dashboard shell.
- Auth remains an HttpOnly cookie received by a Next route handler. JWTs are never stored in browser storage.
- The page now fetches categories and eligible participants server-side through the shared client.
- The five-step form preserves metadata, dynamic author rows with stable keys, advisor, abstract/keywords, and `File` objects.
- Client validation covers required backend fields, integer year, JPEG/PNG/WebP up to 5 MB, and PDF up to 25 MB.
- The proxy sends exact multipart field names and does not set a multipart boundary.
- Final submission is explicit, duplicate-protected, backend-derived, and retains state after errors.
- 401 redirects through login; 403, 413, 415, 422, 500, malformed responses, and network failures have normalized Thai messages.
- Success actions use the response ID and never synthesize a success response.

## 5. Backend analysis

- `POST /research/` is registered without an API prefix and requires an active `student` or `admin` bearer identity.
- New authenticated `GET /research/participants` returns active students and advisors only, marking the current student.
- Existing models and PostgreSQL tables already contained the required research, author, advisor, category, and file-path columns. No schema change was needed.
- The repository has `alembic.ini` but no `alembic/` directory; `python -m alembic current` failed with “Path doesn't exist: alembic.” Runtime schema creation still uses `Base.metadata.create_all`.
- Category IDs are checked before storage. Author IDs must reference active students; advisor IDs must reference active advisors.
- Uploads are stored below the absolute backend static root with UUID names. JPEG, PNG, WebP, and PDF content signatures are checked in addition to extension/MIME.
- Cover limit is 5 MiB and document limit is 25 MiB, configurable through settings.
- Partial files are deleted on later upload, database, or constraint failure.
- Static serving uses the same absolute root. Download URLs remain compatible as `/static/...`.
- Browser CORS changes were unnecessary because browser mutations remain same-origin: browser → Next route → FastAPI.

## 6. Backend contract

```text
endpoint: /research/
method: POST
content type: multipart/form-data
authentication: Authorization: Bearer <JWT>
permission: active student or admin
success status: 200
```

Required: `title_th` string, `title_en` string, `category_id` integer.

Optional: `abstract`, `department`, `work_type`, `academic_year` integer, `keywords`, `author_ids` JSON integer array (default `[]`), `advisor_ids` JSON integer array (default `[]`), `cover_image`, and `document`.

There are no work-type enum values. Keywords remain one string. Cover accepts JPEG/PNG/WebP up to 5 MiB. Document accepts PDF up to 25 MiB. Success is `ResearchWorkResponse` with ID, status, file paths, counts, timestamps, category, metadata, and submitter ID.

Observed/implemented errors: 401 missing/invalid token, 403 role failure, 404 missing category/person, 409 database constraint conflict, 413 oversized upload, 415 unsupported or invalid file, 422 FastAPI/form/JSON/role validation, and sanitized 500 storage/database failure.

Participant lookup:

```text
endpoint: /research/participants
method: GET
authentication: Bearer JWT
permission: active student or admin
success: { authors: ResearchParticipant[], advisors: ResearchParticipant[] }
```

## 7. Frontend–backend mapping

| Frontend value | Backend field | Type | Required | Transformation |
| --- | --- | --- | --- | --- |
| Thai title | `title_th` | string | yes | trim |
| English title | `title_en` | string | yes | trim |
| category selection | `category_id` | integer form text | yes | selected ID string |
| abstract | `abstract` | string | no | trim/omit empty |
| department | `department` | string | no | trim/omit empty |
| work type | `work_type` | string | no | trim/omit empty |
| academic year | `academic_year` | integer form text | no | validated digit string |
| keywords | `keywords` | string | no | trim/omit empty |
| author rows | `author_ids` | JSON integer array | no | selected IDs, deduplicated server-side |
| advisor | `advisor_ids` | JSON integer array | no | zero or one selected ID |
| cover | `cover_image` | multipart file | no | unchanged bytes/name sanitized by proxy; UUID backend name |
| PDF | `document` | multipart file | no | unchanged bytes/name sanitized by proxy; UUID backend name |

## 8. Changes implemented

### Frontend

- Fixed backend environment fallback and Next development origin.
- Added participant DTO/API loading and real dynamic author/advisor controls.
- Forwarded people arrays rather than overwriting them.
- Added contract-matched client file validation and 413/415 normalization.
- Fixed explicit Review/final-submit separation.
- Protected auth forms from pre-hydration GET submission.
- Fixed shared label/control association and responsive people rows.

### Backend

- Added participant lookup and response schemas.
- Added JSON ID parsing, related-record/role validation, and clear HTTP errors.
- Replaced unsafe upload writes with absolute, UUID, atomic, validated storage.
- Added transaction rollback and file cleanup.
- Made static serving independent of the launch directory.
- Added configurable upload limits and corrected example/local database configuration.

### Database/migrations

No model or table change was necessary, so no migration was created or applied. Alembic infrastructure remains incomplete and is listed below.

### Tests/configuration

- Added five backend integration tests covering full persistence/upload/detail, participants, invalid JSON/IDs, invalid content cleanup, and auth/role errors.
- Expanded frontend contract tests and the real Playwright workflow, including files and three viewport widths.
- Increased the Playwright case timeout from 30 to 60 seconds for initial Next compilation.

## 9. Design compliance

The repair retains the Living Research Index shell, warm paper, deep mulberry, periwinkle, apricot, Kanit/Plus Jakarta Sans typography, editorial panels, stepper, and responsive Index Rail from `frontend/DESIGN.md` and the Stitch submission reference. Existing `Button`, `Field`, `Input`, `Select`, `Textarea`, `StatePanel`, and `DashboardShell` components remain in use. Changes are functional additions to the existing design, not a redesign.

## 10. Testing

### Commands and results

- `pnpm.cmd typecheck`: PASS.
- `pnpm.cmd lint`: PASS with one non-blocking `aria-invalid` role warning in the file drop wrapper.
- `pnpm.cmd test`: PASS, 19/19.
- `pnpm.cmd build`: PASS, 20 pages generated and all routes compiled.
- `pnpm.cmd test:e2e`: completed, 6/6 skipped because the exact uncredentialed command has no fixture environment.
- Credentialed `pnpm.cmd test:e2e --grep 'student completes'`: PASS, 1/1, against live PostgreSQL/FastAPI and Next on port 3100.
- `python -m pytest tests -v -p no:cacheprovider`: PASS, 30/30, with 27 existing deprecation warnings.
- `python -m alembic current`: FAIL/NOT AVAILABLE because the Alembic scripts directory does not exist.
- `docker compose ps`: PASS; backend up and database healthy.

### Manual/API/database/file verification

- Backend health and OpenAPI: PASS.
- Direct authenticated create: PASS, HTTP 200 with real integer ID.
- Direct detail retrieval: PASS, matching ID.
- PostgreSQL record: PASS.
- Credentialed Next/browser workflow: PASS.
- Browser response success and detail link: PASS.
- Author relationship: PASS, one row for E2E record ID 5.
- Advisor relationship: supported and disposable-test verified; live count zero because the development database had no advisor account.
- Cover and PDF disk signatures: PASS in both disposable and live PostgreSQL verification.
- Responsive overflow at 1280×800, 768×900, and 390×844: PASS in the credentialed E2E.
- Accessibility: labels, keyboard drop zones, focus summaries, required/invalid states, live status, and hydration behavior were exercised or statically tested. Full assistive-technology audit was not run.

The local development verification intentionally created an ephemeral development administrator, one category, several temporary student accounts from iterative E2E reproduction, research verification records, and their uploaded files. No production or staging environment was touched. Credentials were generated in-process and never printed or committed.

## 11. Files changed

Backend:

- `backend/.env` (ignored local runtime password alignment)
- `backend/.env.example`
- `backend/app/core/config.py`
- `backend/app/main.py`
- `backend/app/routers/research.py`
- `backend/app/schemas/research.py`
- `backend/app/services/research_service.py`
- `backend/tests/conftest.py`
- `backend/tests/test_research.py`

Frontend:

- `frontend/next.config.ts`
- `frontend/app/api/research/route.ts`
- `frontend/app/student/research/new/page.tsx`
- `frontend/app/globals.css`
- `frontend/src/components/ui.tsx`
- `frontend/src/features/auth/auth-form.tsx`
- `frontend/src/features/research/api.ts`
- `frontend/src/features/research/submission-form.tsx`
- `frontend/src/lib/api/client.ts`
- `frontend/src/lib/api/errors.ts`
- `frontend/src/lib/api/types.ts`
- `frontend/tests/api-contract.test.mjs`
- `frontend/e2e/p0-pages.spec.mjs`
- `frontend/playwright.config.mjs`
- `frontend/docs/research-creation-full-integration-report.md`

Pre-existing unrelated backend provisioning changes, documentation, prompt files, and Playwright result artifacts were preserved.

## 12. Remaining issues

### Completed

Startup/database connectivity, authenticated create, participant selection, multipart mapping, validated storage, rollback cleanup, real success/detail, responsive overflow checks, and required automated suites.

### Partially completed

The live browser record has a real author but no advisor because no active advisor existed. Advisor persistence is verified by the disposable backend integration test.

### Blocked

Pending research is intentionally absent from the public research list because existing list/search endpoints filter to `approved`; it is accessible by the returned detail link. There is no submitter-specific “my submissions” endpoint.

### Not tested

Screen-reader software, malware scanning, large-file transfer performance at the exact maximum sizes, and an injected database/storage 500 through a live browser were not run. Those branches have automated service/error coverage where practical.

### Environment limitations

The exact fixture-free Playwright command skips all tests. The repository has an Alembic config but no migration environment. SQLAlchemy echo logging is very verbose. One lint warning remains for `aria-invalid` on the keyboard file-drop button wrapper; lint exits successfully.

### Recommended follow-up

- Initialize and baseline Alembic before the next schema change; stop relying on `create_all` for managed environments.
- Add a submitter-scoped research list endpoint so pending creations can appear in a dashboard.
- Add approved advisor provisioning/profile management and seed disposable full-role E2E fixtures.
- Add file malware scanning and streaming storage for larger deployments.
- Remove SQLAlchemy `echo=True` outside explicit debug mode and address existing Pydantic/datetime deprecations.
