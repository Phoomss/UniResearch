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
