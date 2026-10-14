# Selenium Python execution — 8 October 2026

Implemented and executed all 48 cases from the full test specification. **44 passed, 4 failed, 0 skipped, 0 blocked.** The 18 cases assigned to Narongsak had **17 passed and 1 failed (TC-043)** in the full run. Execution was automated by Codex; Narongsak denotes assignment in the source documents.

The suite and installation/run instructions are in [tests/selenium/README.md](../../tests/selenium/README.md). The original Word/PDF reports retain their historical results.

## Environment and evidence

| Item | Actual value |
|---|---|
| Source commit | `009d772fb0a3233cd353e7c56917e764cb682c92`, with test changes in the working tree |
| Host | macOS 27.0, ARM64 |
| Python / Selenium / pytest | 3.14.5 / 4.50.0 / 9.1.1 |
| Browser | Chrome 154.0.8037.98, headless; fresh profile per UI case |
| Application | Real Next.js webpack development server and FastAPI on private loopback ports |
| Database/files | Disposable SQLite and temporary file store, reset per case |
| Fixtures | A1, S1/S2/S3, D1/D2, G1, U2; C1/C2; W1–W5; N1/N2; valid PNG/PDF files |
| AI | Deterministic service test doubles; embedding failure exercises text retrieval fallback |
| Full-run duration | 268.39 seconds |
| Requirement mapping | 48 cases mapped to FR-001–FR-032; all 32 exercised |

Full-run [case report](../../tests/selenium/artifacts/20261008-023513-332743/report.md) and [structured evidence](../../tests/selenium/artifacts/20261008-023513-332743/results.json) include screenshots, database query results with password hashes excluded, sanitized HTTP status logs, and UI/API observations. Runtime artifacts are ignored by Git and remain available in the local workspace.

This run provides SQLite functional evidence. PostgreSQL/pgvector behavior and live provider quality require separate verification.

## Confirmed failures

| Cases | Observed behavior | Diagnosis |
|---|---|---|
| TC-018 | `GET /research/1/recommendations` returns 500 | `get_related_recommendations` accesses the current work's unloaded advisor relationship. Backend log records SQLAlchemy `MissingGreenlet`. |
| TC-040, TC-043 | Notification dropdown is empty despite persisted notifications | TC-040 confirms approval, score, publication time, and notifications for submitter/co-author before its UI assertion fails. TC-043's focused rerun confirms notification ownership and read-state APIs before the dropdown fails. Source inspection suggests the notification client imports the server backend-URL helper instead of requesting the frontend proxy. |
| TC-045 | Public `POST /ai/chat` returns 500 on text retrieval fallback | Chat accesses an unloaded category relationship. Backend log records SQLAlchemy `MissingGreenlet`. Dashboard insight and its student RBAC check succeed before the chat assertion fails. |

These remain ordinary failing assertions, without skips or expected-failure masking. Application code was preserved so the tests expose the defects.

The focused [TC-043 rerun](../../tests/selenium/artifacts/20261008-024035-658986/report.md) and [API/database evidence](../../tests/selenium/artifacts/20261008-024035-658986/results.json) confirm:

- S1's notification list contains only N1.
- Reading S2's N2 as S1 returns 404 and leaves N2 unread.
- Reading N1 succeeds; read-all changes only S1's notification.
- The Selenium dropdown still fails to display N1.

## Documented observations

The run also records public static PDF access without a counter increment, advisor queue UI visibility differing from `/research/pending`, and student access to the `/admin` page while admin data APIs reject the student. The test plan explicitly requests recording these behaviors for policy review.

The results do not meet a full-pass acceptance criterion. The three defects above and PostgreSQL/pgvector verification remain open.

## Notification fix and focused rerun

After the full run above, the notification browser client was changed to request the same-origin `/api/notifications` proxy, which supplies the session token. The read-all action now posts `{ "all": true }` to that existing route instead of requesting a missing `/api/notifications/read-all` route.

The [focused rerun](../../tests/selenium/artifacts/20261008-041822-000844/report.md) passed **TC-040 and TC-043 (2 passed / 46 deselected)**. TC-043 also checks that both browser read actions persist to the database while leaving another user's notification unread. These results supersede the notification failures for the patched working tree; the original full-run results above are retained as historical evidence.

Lint passed for the two changed TypeScript files. The normal frontend typecheck remains blocked by duplicate and stale generated files in `.next/types`; a separate check of application source excluding those generated files passed.

The subsequent [Narongsak subset rerun](../../tests/selenium/artifacts/20261008-042008-398982/report.md) passed **all 18 assigned cases / 30 deselected** in 161.10 seconds. This rerun used macOS Chrome and disposable SQLite, rather than Docker. The remaining full-suite cases were not rerun, so this does not establish a new 48-case result.

## Docker Brave installer fix and verification

The Docker installer originally treated Brave's hybrid `--product-version` (for example `155.1.97.56`) as a Chromium build, causing the ChromeDriver metadata lookup to fail. It now resolves the installed Brave package version through its exact official GitHub release tag, reads the Chromium version from the release name, and selects ChromeDriver by Chromium build, with the documented milestone fallback.

The rebuilt `linux/amd64` image successfully installed Brave **1.97.56**, Chromium **155.0.8059.40**, and ChromeDriver **155.0.8059.39**. The [Docker Brave TC-043 rerun](../../tests/selenium/artifacts/20261008-042758-724956/report.md) passed **1 case / 47 deselected** in 69.46 seconds, confirming browser startup and notification read actions. The sole warning was passlib's Python `crypt` deprecation. The full Narongsak subset has not been rerun with this Brave image.
