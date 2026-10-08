# UniResearch Selenium tests

Python Selenium + pytest implementation of TC-001–TC-048, with the 18 cases assigned to Narongsak selectable separately. Browser workflows use real Chrome, Next.js, and FastAPI. API-only cases use HTTPX; persistence, relationships, counters, and stored files are checked independently.

Sources read from `docs/system-audit/`:

- `uniresearch-test-cases-Narongsak.docx`: 18 assigned cases.
- `uniresearch-test-plan-and-report-Narongsak.docx`: individual plan and historical report.
- `uniresearch-test-cases.docx` and `TEST-CASES.md`: full 48-case specification.
- `uniresearch-test-pland-and-report.docx` and `TEST-PLAN.md`: full plan and historical report. The requested spelling `uniresesarch-test-pland-and-report` has no separate matching file.

The original DOCX/PDF reports remain unchanged. Their historical passes are not reused as results for this suite.

The [8 October execution report](../../docs/system-audit/SELENIUM-TEST-REPORT-2026-10-08.md) records 44 passed / 4 failed across all 48 cases, including 17 passed / 1 failed for Narongsak's subset. Failures expose related-recommendation, chat, and notification UI defects.

## Install and run

Requires Python 3.11+, Chrome, and the frontend's Node dependencies. Run from the repository root:

```sh
python3 -m venv tests/selenium/.venv
tests/selenium/.venv/bin/python -m pip install -r tests/selenium/requirements.txt
cd frontend
pnpm install
cd ..

# All 48 cases
tests/selenium/.venv/bin/python -m pytest -c tests/selenium/pytest.ini tests/selenium

# Narongsak's 18 assigned cases
tests/selenium/.venv/bin/python -m pytest -c tests/selenium/pytest.ini tests/selenium -m narongsak

# API/database cases (no Chrome or frontend needed)
tests/selenium/.venv/bin/python -m pytest -c tests/selenium/pytest.ini tests/selenium -m 'not ui'

# Visible browser or a single case
tests/selenium/.venv/bin/python -m pytest -c tests/selenium/pytest.ini tests/selenium --headed -k tc_047
```

The suite starts its own backend and frontend on available loopback ports; do not start an additional app for these tests. It uses Next.js's webpack development server to avoid the repository's Turbopack font compilation error. Close another Next.js development server for this checkout first because Next.js shares its `.next` directory and development lock.

Selenium Manager obtains ChromeDriver automatically on first use. For offline runs, set `SELENIUM_CHROMEDRIVER` to a compatible local driver's absolute path. The helpers use explicit waits for hydration, elements, URLs, and committed data. See [Selenium installation](https://www.selenium.dev/documentation/webdriver/getting_started/install_library/) and [waiting strategies](https://www.selenium.dev/documentation/webdriver/waits/).

## Isolation and evidence

Each session creates a temporary `uniresearch-selenium-*` directory for SQLite and file storage. Each case resets only this private database and file store and seeds A1, S1/S2/S3, D1/D2, G1, U2, C1/C2, W1–W5, N1/N2. Credentials are generated for the session. Chrome starts with a fresh profile per UI case. Run serially; pytest-xdist is rejected.

The test-only `server.py` replaces external AI service methods with deterministic responses, preserving the actual HTTP routes, authentication, validation, database access, and response schemas. Embedding requests deliberately fail to exercise the text retrieval fallback. This is functional evidence on SQLite, **not PostgreSQL/pgvector certification or evaluation of live AI quality**. Upload boundary cases use the backend's default limits of 5 MiB and 25 MiB.

`artifacts/<UTC timestamp>/` contains:

- `report.md`: results by TC, with screenshots for browser cases.
- `results.json`: commit, OS/browser version, status, sanitized HTTP status evidence, and observed UI/API differences.
- `TC-xxx.png`: browser screenshots after each UI case, including failures.
- `backend.log` / `frontend.log`: disposable service logs; no request bodies or authorization headers are deliberately logged.

Setup failures are reported as blocked, assertion failures as failed. No missing credentials, missing services, or unexecuted cases are silently treated as passes. For a JUnit report, add `--junitxml=tests/selenium/artifacts/junit.xml`.

## Known distinctions in the specification

TC-018 records public access to pending detail URLs, TC-034 records unauthenticated static PDF access, TC-036 records the advisor UI/API queue difference, and TC-048 records student access to `/admin`. These are observations explicitly requested by the documents; they are not silently redefined as new access policies.

The user form offers `reviewer` rather than `advisor`. TC-008 records the UI creation and uses the specification's API alternative to set `advisor`. TC-048 creates a student through the available UI and verifies the actual stored role. AI title/keyword schemas allow omitted fields, so their negative tests use invalid field types rather than assuming an empty object is invalid.

TC-045 is expected to expose the current backend's `MissingGreenlet` error when text-search chat returns works whose category relationship has not been eagerly loaded. It remains a normal failing assertion, with HTTP and service-log evidence.

TC-018 exposes the same async lazy-loading problem for the current work's advisors in related recommendations. TC-040 and TC-043 expose the empty notification dropdown; the API checks establish persisted notification data and ownership independently.
