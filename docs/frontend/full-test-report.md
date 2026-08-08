# UniResearch full test report

Test date: 2026-08-03. Environment: Windows, Python 3.13.14, Node/Next.js through the existing pnpm workspace.

## Executive result

The backend isolated suite, frontend unit/contract suite, TypeScript check, ESLint, and production build passed. The isolated real-backend Playwright run completed with **3 passed and 3 failed**. The project is therefore **not fully tested**.

The three E2E failures identify one shared frontend accessibility defect: `Field` sets a label's `htmlFor` from the child control's `name`, but it does not assign that value to the child control's `id`. Consequently, label-based browser interaction fails for the submission title, review comment, and reviewer known-ID fields.

## Isolation and data safety

- Backend unit/integration tests used the repository's autouse in-memory SQLite fixture from `backend/tests/conftest.py`.
- Backend tests ran from `.test-runtime/backend-cwd` with `PYTHONPATH` pointing to `backend/`, `PYTHONDONTWRITEBYTECODE=1`, and pytest cache disabled. This prevented imports/uploads/cache from generating files in `backend/`.
- Browser tests used a disposable SQLite file under `.test-runtime/`, a disposable `static/` directory under the same temporary root, and temporary accounts/category/research data.
- Disposable credentials: student, advisor, and admin accounts scoped to the test database only.
- No development or production database was contacted or modified.
- No migration or destructive backend command was run.

## Backend tests

Command:

```powershell
python -m pytest D:\Project-69\UniResearch\backend\tests -p no:cacheprovider -v
```

Result: **5 passed, 0 failed**, in 3.29 seconds.

| Test | Result |
|---|---|
| `test_register_user` | Passed |
| `test_login_user` | Passed |
| `test_login_wrong_password` | Passed |
| `test_create_research` | Passed |
| `test_search_and_filter` | Passed |

Warnings: 17 deprecation warnings—seven Pydantic class-based configuration warnings and ten `datetime.utcnow()` warnings from backend/SQLAlchemy code paths. They do not fail the current suite but are forward-compatibility risks.

## Frontend unit and contract tests

Command: `pnpm.cmd test`

Result: **17 passed, 0 failed**.

Covered areas include endpoint/method inventory, exact multipart fields, HttpOnly session storage, unsupported-path exclusion, P0 state boundaries, positive-ID validation, design tokens/responsive rail, field/loading accessibility source checks, route presence, centralized network access, favorites without detail fan-out, constrained admin capabilities, legacy redirects, known-ID validation, safe login return paths, and Playwright fixture guards.

Important coverage gap: the static field accessibility assertion checks for `htmlFor`/`aria-describedby` source text but does not render the component and therefore did not detect the missing matching control `id` found by Playwright.

## Static quality gates

| Check | Command | Result |
|---|---|---|
| TypeScript strict check | `pnpm.cmd typecheck` | Passed |
| ESLint | `pnpm.cmd lint` | Passed |
| Production build | `pnpm.cmd build` | Passed |

The production build compiled 20 application entries, including all page routes and Route Handlers.

## Playwright against the isolated backend

Final controlled run used:

- FastAPI on `127.0.0.1:8010` with the disposable SQLite database.
- A production Next.js server on `127.0.0.1:3010` with `BACKEND_API_URL=http://127.0.0.1:8010`.
- `PLAYWRIGHT_EXTERNAL_SERVER=1` and the existing six P0/P1 cases.
- A direct backend credential probe that returned HTTP 200 before Playwright started.

Result: **3 passed, 3 failed**, total 1.2 minutes.

| Flow | Result | Evidence |
|---|---|---|
| Guest opens known research and unknown ID | Passed | Detail/auth-required and not-found navigation rendered against seeded research ID 1 |
| Authenticated account opens `/account/saved` | Passed | Student login and canonical saved page succeeded |
| Administrator opens `/admin` and `/admin/categories` | Passed | Admin login, totals, and category navigation succeeded |
| Student submits research | Failed | Timed out waiting for `getByLabel("Thai title")` |
| Advisor opens known-ID reviewer entry | Failed | Timed out waiting for `getByLabel("Research ID")` |
| Advisor records review decision | Failed | Timed out waiting for `getByLabel("Reviewer comment")` |

Failure traces and page snapshots are stored under `frontend/test-results/`.

### Root cause

In `frontend/src/components/ui.tsx`, `Field` computes:

```tsx
const controlId = control?.props.id ?? control?.props.name;
<label htmlFor={controlId}>...</label>
```

but it only clones the child to add `aria-describedby`; it does not add `id={controlId}`. The rendered inputs therefore have names such as `title_th` and `comment_text`, while the corresponding label targets an ID that does not exist.

This blocks label-based keyboard/assistive-browser semantics and prevents the three E2E flows from reaching their mutation steps. The underlying submission/review API mutations were not exercised in the final run and must not be reported as passing.

## Harness diagnostics

Two preliminary E2E attempts were non-authoritative:

1. The dev-server attempt failed all six cases while Next.js reported blocked cross-origin HMR requests and older English-label selectors timed out.
2. The first production attempt used a stale backend listener and failed authentication; a direct database/password verification and isolated port change resolved that harness issue.

The final run used fresh ports, a direct credential probe, corrected stable login selectors, and is the result reported above.

## Test result summary

| Suite | Passed | Failed | Skipped | Status |
|---|---:|---:|---:|---|
| Backend pytest | 5 | 0 | 0 | Passed |
| Frontend unit/contract | 17 | 0 | 0 | Passed |
| TypeScript | 1 check | 0 | 0 | Passed |
| ESLint | 1 check | 0 | 0 | Passed |
| Production build | 1 build | 0 | 0 | Passed |
| Playwright isolated E2E | 3 | 3 | 0 | Failed |

## Required follow-up

1. Update `Field` so the cloned child receives the computed `id`, preserving any explicit child ID.
2. Add a rendered component/accessibility test proving each label resolves to its control and hint text resolves through `aria-describedby`.
3. Rerun the full frontend matrix.
4. Reseed the disposable database and rerun all six Playwright cases.
5. Only after all six pass, update P0/P1 routes from `Integrated` to `Tested` where their complete definitions of done are satisfied.

## Backend integrity

No backend file was modified, formatted, renamed, or created. Backend source remained read-only throughout the run. Temporary test runtime data was created outside `backend/` and removed after testing.
