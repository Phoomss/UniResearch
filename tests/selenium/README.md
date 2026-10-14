# UniResearch Selenium tests

Python Selenium + pytest implementation of TC-001–TC-048, with the 18 cases assigned to Narongsak selectable separately. Docker browser workflows use real Brave, Next.js, and FastAPI. API-only cases use HTTPX; persistence, relationships, counters, and stored files are checked independently.

Sources read from `docs/system-audit/`:

- `uniresearch-test-cases-Narongsak.docx`: 18 assigned cases.
- `uniresearch-test-plan-and-report-Narongsak.docx`: individual plan and historical report.
- `uniresearch-test-cases.docx` and `TEST-CASES.md`: full 48-case specification.
- `uniresearch-test-pland-and-report.docx` and `TEST-PLAN.md`: full plan and historical report. The requested spelling `uniresesarch-test-pland-and-report` has no separate matching file.

The original DOCX/PDF reports remain unchanged. Their historical passes are not reused as results for this suite.

The [8 October execution report](../../docs/system-audit/SELENIUM-TEST-REPORT-2026-10-08.md) records 44 passed / 4 failed across all 48 cases, including 17 passed / 1 failed for Narongsak's subset. Failures expose related-recommendation, chat, and notification UI defects.

After the notification proxy fix, the [Narongsak subset rerun](artifacts/20261008-042008-398982/report.md) passed all 18 assigned cases. A [focused rerun](artifacts/20261008-041822-000844/report.md) also passed TC-040 and TC-043, including browser read actions. These macOS reruns supersede the notification failures for the patched working tree; the other full-suite failures have not been rerun. Rebuild the Docker image to include the fix before running in Docker.

The [8 October Brave Docker UI report](../../docs/system-audit/BRAVE-TEST-REPORT-2026-10-08.md) records **16 passed / 0 failed** for Narongsak’s web UI cases, with screenshots and browser/driver versions. This is a separate run from the historical Chrome results above.

## Run with Docker

Requires Docker Desktop (or Docker Engine with Compose). Run from the repository root. Python, Node, Brave, and a ChromeDriver matching Brave’s Chromium build are installed in the test image; no local virtual environment is needed.

```sh
# Build the test image
docker compose -f docker-compose.selenium.yml build

# Narongsak's 18 cases (default selection)
docker compose -f docker-compose.selenium.yml run --rm selenium-tests

# Only Narongsak’s web UI cases, using Brave
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -m "narongsak and ui" -v

# All web UI cases, using Brave
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -m ui -v

# All 48 cases
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -v

# One case
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -v -k tc_047

# API/database cases
docker compose -f docker-compose.selenium.yml run --rm selenium-tests -v -m 'not ui'
```

The runner starts FastAPI, Next.js, and Chromium inside one container, with its own temporary SQLite database and file store. It uses this dedicated Compose file independently of the normal application Compose stack. Reports and screenshots are saved to `tests/selenium/artifacts/` through a bind mount. Chromium runs as a non-root user with 2 GiB shared memory. The image uses `linux/amd64` because the official Chrome for Testing Linux driver is x86_64. Docker Desktop runs it with emulation on Apple Silicon.

Rebuild the image after changing application or test code. To record the host checkout's commit in Docker reports, set `UNIRESEARCH_TEST_COMMIT` to the output of `git rev-parse HEAD` before running Compose. The `.git` directory and environment files are excluded from the build context.

The 8 October results linked above were obtained on macOS; a Docker run produces its own report and browser version. Docker uses the same disposable SQLite functional scope and AI test doubles.

Brave is installed from the [official Brave APT repository](https://brave.com/linux/). The installer reads the installed package version and resolves its Chromium version from the matching [official Brave release](https://github.com/brave/brave-browser/releases). Brave's `--product-version` is not used because it contains Brave's version components rather than the Chromium build. The build selects ChromeDriver using the [official build-version metadata](https://developer.chrome.com/docs/chromedriver/downloads/version-selection), with a milestone fallback if the build is not listed yet, and fails if neither lookup provides a driver. It leaves Brave Shields at their defaults. Docker allows 300 seconds for service startup and the first Next.js compilation (`SELENIUM_STARTUP_TIMEOUT`); local runs default to 90 seconds.

## Optional local installation

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

To use local Brave, set `SELENIUM_CHROME_BINARY` to its executable path and `SELENIUM_BROWSER_NAME=Brave` (on macOS the binary is `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`). Selenium Manager obtains ChromeDriver automatically on first use. Docker installs the matching driver during the image build, so test runs do not download a driver. For offline runs, set `SELENIUM_CHROMEDRIVER` to a compatible local driver's absolute path. The helpers use explicit waits for hydration, elements, URLs, and committed data. See [Selenium installation](https://www.selenium.dev/documentation/webdriver/getting_started/install_library/) and [waiting strategies](https://www.selenium.dev/documentation/webdriver/waits/).

## Isolation and evidence

Each session creates a temporary `uniresearch-selenium-*` directory for SQLite and file storage. Each case resets only this private database and file store and seeds A1, S1/S2/S3, D1/D2, G1, U2, C1/C2, W1–W5, N1/N2. Credentials are generated for the session. The configured browser starts with a fresh profile per UI case. Run serially; pytest-xdist is rejected.

The test-only `server.py` replaces external AI service methods with deterministic responses, preserving the actual HTTP routes, authentication, validation, database access, and response schemas. Embedding requests deliberately fail to exercise the text retrieval fallback. This is functional evidence on SQLite, **not PostgreSQL/pgvector certification or evaluation of live AI quality**. Upload boundary cases use the backend's default limits of 5 MiB and 25 MiB.

`artifacts/<UTC timestamp>/` contains:

- `report.md`: results by TC, with screenshots for browser cases.
- `results.json`: commit, OS, browser name/binary, Chromium and driver versions, status, sanitized HTTP status evidence, and observed UI/API differences.
- `TC-xxx.png`: browser screenshots after each UI case, including failures.
- `backend.log` / `frontend.log`: disposable service logs; no request bodies or authorization headers are deliberately logged.

Setup failures are reported as blocked, assertion failures as failed. No missing credentials, missing services, or unexecuted cases are silently treated as passes. For a JUnit report, add `--junitxml=tests/selenium/artifacts/junit.xml`.

## Known distinctions in the specification

TC-018 records public access to pending detail URLs, TC-034 records unauthenticated static PDF access, TC-036 records the advisor UI/API queue difference, and TC-048 records student access to `/admin`. These are observations explicitly requested by the documents; they are not silently redefined as new access policies.

The user form offers `reviewer` rather than `advisor`. TC-008 records the UI creation and uses the specification's API alternative to set `advisor`. TC-048 creates a student through the available UI and verifies the actual stored role. AI title/keyword schemas allow omitted fields, so their negative tests use invalid field types rather than assuming an empty object is invalid.

TC-045 is expected to expose the current backend's `MissingGreenlet` error when text-search chat returns works whose category relationship has not been eagerly loaded. It remains a normal failing assertion, with HTTP and service-log evidence.

TC-018 exposes the same async lazy-loading problem for the current work's advisors in related recommendations. TC-040 and TC-043 previously exposed the empty notification dropdown and now pass after the proxy fix; the API checks establish persisted notification data and ownership independently.
