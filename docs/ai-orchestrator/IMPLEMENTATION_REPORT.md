# ResearchFlow implementation report

Date: 2026-10-07. Implemented in the existing UniResearch application; no deployment,
production database changes or paid AI requests were performed. Initial working tree
was clean. Existing architecture was inspected and CURRENT_ARCHITECTURE.md written
before application implementation; the integration plan was reported before edits.

## IMPLEMENTED

### Foundation and shared state

Eight normalized ResearchFlow tables: workflow, task, source, paper, claim, evidence,
citation and event. Important entities/links are independently queryable; bounded
JSON holds role-specific outputs, plan, structured draft and metrics. UUID identifiers,
owner IDs, timestamps, dependencies, task statuses, retries, usage and provenance persist.
Added a frozen additive Alembic migration and environment. A legacy-schema bootstrap
supports fresh databases. Compose startup now runs bootstrap/migration and fails on
migration errors instead of swallowing them.

### Orchestrator and agents

Durable central orchestrator plus planner/search/paper/evidence/verifier/critic/writer/
citation roles. Gemini reuses existing SDK/settings; provider protocol and injectable
MockProvider isolate model calls. Models can vary by role through configuration.
The search role uses the existing approved repository search/ranking with optional
bounded SQL candidates. No fake papers, DOI or publication metadata are generated.

Role contexts implement least privilege; no LLM can execute tools or SQL. Typed
Pydantic outputs forbid extra fields, cap lists and validate scores/identifiers.
Explicit paper fields must equal exact source quotes; interpretations are separately
labeled. Paper analysis uses bounded batches of three sources. Evidence links must
quote retained text exactly. An independent verification pass checks every link;
Critic checks adequacy and selects conditional routes. Code overrides permissive
approval for insufficient sources/unsupported claims/strong contradictions.

Writer receives verified evidence only. Citation validation requires each report
sentence to reference a known verified claim and its supporting source quotes, plus
independent semantic approval for every sentence. Missing checks, fake identifiers,
quote mismatch and unsupported sentences fail closed. Failed citation passes route
back through evidence. Non-completed drafts are withheld from workflow lists,
snapshots, task outputs and the report endpoint.

### Durability and human controls

Separate worker process reuses the backend image/database, with no broker or agent
microservices. Database leases and fencing tokens coordinate replicas and cancellation.
Provider/schema/provenance failures produce sanitized persisted task errors and bounded
retries/backoff. State writes/scheduling are transactional; invalid outputs roll back
through savepoints. Expired interrupted tasks recover with a consumed retry.

Configurable iteration/search/paper/context/deadline/retry/call/token caps pause for
human review. QUICK/STANDARD/DEEP default to 5/10/20 sources. Workflow creation has
hourly/user/global quotas using PostgreSQL transactional locking. Usage reserves costs
before provider I/O. Human actions support continue, search more, accept limited verified
evidence, modify question, retry failed/blocked agent and stop. Human adequacy overrides
never bypass citation validation or cumulative cost caps.

### API and frontend

Authenticated owner-scoped REST API and Next.js cookie/Bearer proxy, including sources,
papers, tasks, claims, evidence, citations, completed report and cursor-based events.
Proxy rejects arbitrary routes, cross-site commands, non-object/malformed/oversized
JSON and invalid event cursors. Existing API response/error helpers are reused.

/research-flow integrates DashboardShell, navigation and existing design tokens:
question/depth input, saved workflow selection, live agent/task status, plan/progress
history, critic feedback, human controls, evidence quote explorer, source excerpts,
separately labeled interpretation, final report and sentence→claim→source links.
Polling provides safe status summaries and stops at terminal/waiting states; no private
reasoning is exposed. Desktop/mobile layouts and screenshots were checked.
Confidence components/formula are observable system heuristics documented in
ARCHITECTURE.md, not an LLM confidence number or probability of truth.

### Observability, evaluation and documentation

Structured logs include workflow/task/agent/status/duration/retry/model/usage/error
category. SQL echo is disabled to avoid sensitive state logging. Prompts, secrets,
questions/source contents and raw provider exceptions are excluded from these logs.
Offline evaluation measures independently labeled correctness/completeness, evidence
coverage, relevance, contradictions, unsupported rate, success, iterations and duration;
unknown labels remain unknown. Synthetic arithmetic fixture/CLI result are explicitly
not an accuracy benchmark. All nine requested documentation files are present.

### Existing modules affected

- backend/app/main.py: model registration and router inclusion.
- backend/app/db/database.py: disable SQL echo.
- backend/app/services/research_service.py: optional limit/log_search parameters;
  existing callers keep default behavior.
- docker-compose.yml and docker-compose.prod.yml: migration startup and worker sharing
  backend configuration/image. All ResearchFlow settings can be forwarded; JSON model/
  depth maps use optional environment passthrough.
- frontend/src/components/shells.tsx: ResearchFlow navigation entry.
- frontend/package.json: isolated ResearchFlow browser test command.
- README.md: operating instructions/documentation links; .gitignore files: local artifacts.

New modules are isolated under backend/app/services/research_flow, associated
model/schema/router/config files, backend/alembic, frontend ResearchFlow page/feature/
proxy, tests and docs. Existing writing/chat/upload APIs and research table schemas
retain their contracts.

## VERIFIED

Executed checks on this machine; no result below is inferred:

| Check | Executed command / scope | Result |
|---|---|---|
| Full backend tests | PYTHONPATH=backend backend/test_venv/bin/python -m pytest backend/tests -q --disable-warnings | 78 passed, 1 skipped; PostgreSQL test opt-in skipped in this default run |
| PostgreSQL integration | Same pytest against test_research_flow_postgres.py with disposable local RESEARCH_FLOW_TEST_POSTGRES_URL | 1 passed; fresh legacy bootstrap + Alembic upgrade, concurrent quota enforcement, concurrent lease claims, completed mocked research report at full citation coverage |
| ResearchFlow tests | test_research_flow.py | 34 passed, included in full suite |
| Migration tests | test_research_flow_migrations.py | SQLite upgrade/downgrade/existing-table adoption and PostgreSQL offline DDL passed, included in full suite |
| Evaluation tests | test_research_flow_evaluation.py | 2 passed, included in full suite |
| Evaluation CLI | python -m app.services.research_flow.evaluation backend/tests/fixtures/research_flow_evaluation.json | Executed; result in evidence/evaluation-fixture-result.json |
| Python compilation | python -m compileall -q backend/app backend/alembic | Passed |
| Frontend existing tests | pnpm test | 32 passed |
| Type checking | pnpm typecheck / Next build TypeScript | Passed |
| New Python lint | Ruff over ResearchFlow modules/config/time/model/schema/router/bootstrap/migration/tests | Passed |
| New/affected frontend lint | ESLint over ResearchFlow page/proxy/feature, shared shells, isolated spec/config | Passed |
| Production frontend build | pnpm build | Passed; /research-flow and authenticated proxy included |
| UI/proxy browser tests | PLAYWRIGHT_BROWSERS_PATH=/private/tmp/uniresearch-flow-browser pnpm test:research-flow | 4 passed: login gate, report/evidence/source links and 390px layout, creation/human actions, proxy origin/route/JSON/cursor rejection |
| Compose configuration | docker compose config --quiet; merged production config --quiet | Both passed |
| Whitespace | git diff --check | Passed |

Covered orchestration behavior: creation, dependencies/routing, success, agent/provider
failure, retry/retry exhaustion, insufficient evidence, contradictions, unsupported
claims, fake quotations, citation mismatch/coverage, incomplete verification, human
review/accept/retry/question modification, cancellation during an active call, interrupted
lease recovery, quotas/budgets and cross-user access to every workflow route.

Browser fixtures are labeled test data; they do not represent a live Gemini research
session. Screenshots were visually inspected and retained under evidence/: preview,
desktop and phone. The in-app browser execution tool was unavailable, so isolated
local Playwright checks were used. Chromium was downloaded into a temporary directory.
The disposable PostgreSQL container was stopped/removed after testing; no original
application database was touched. Existing tracked test-run metadata was restored.

## NOT VERIFIED

- Live Gemini generation, deployed model availability, paid token billing, semantic
  accuracy/entailment, resistance to all prompt-injection variants or a human-rated
  research benchmark. Mock tests verify orchestration and integrity, not model truth.
- Production deployment, Docker image builds, Kubernetes rollout/HPA/load tests,
  network ingress behavior, database TLS/secret management or worker health monitoring.
- PostgreSQL downgrade (SQLite downgrade was executed), production data migration or
  retention/deletion policy at scale.
- Existing full Playwright P0/P1/workspace suites requiring separate disposable account
  fixtures; only isolated ResearchFlow browser checks were executed.
- Python static type checking: this repository has no configured Python checker.
  Runtime output validation, compilation and tests were executed; frontend tsc passed.

## BLOCKED

The full existing `pnpm lint` command ran and failed with **16 errors and 8 warnings**
in files outside ResearchFlow: existing AI research proxies, ChatbotFloat, notification
bell/client, AI dashboard/review assistant and related unused imports. These files were
not modified by this feature. Scoped lint for all ResearchFlow/affected UI files passed.
Project-wide clean lint remains blocked on that existing lint debt.

Initial dependency/font/network/local-server/database checks hit sandbox restrictions
and were rerun with authorized access. Missing dependencies/Chromium were installed;
these environment obstacles were resolved. There is no remaining blocker to local
mock-provider orchestration, migration or interface verification.

## FUTURE IMPROVEMENTS

- Add licensed external academic search adapters and verified full-text extraction/
  page/chunk ingestion through the existing document pipeline. Current corpus is only
  approved UniResearch abstract excerpts; metadata absent in the repository stays null.
- Add OpenAI/other provider implementations behind the existing protocol. Migrate the
  inherited deprecated google-generativeai SDK consistently across existing AI tools.
- Improve independent-study clustering, source-quality/recency policies and calibration
  with a manually reviewed corpus. Current document-count independence is a proxy.
- Add finer claim/clause segmentation, reviewer adjudication, ongoing evaluation jobs,
  retained evidence revisions and calibrated semantic citation benchmarks.
- Add optional SSE if polling cost justifies it; general HTTP/action rate limiting,
  retention/export/deletion policy, worker heartbeat monitoring and Kubernetes worker
  deployment/job manifests. Non-Compose environments must launch the worker explicitly.
- Clear inherited lint/type/deprecation debt, pin dependencies and address existing
  secure-cookie/default-secret/database-TLS configuration at deployment scope.

## Local operation

Existing database: run `cd backend && alembic upgrade head`. Fresh database: run
`python -m app.scripts.bootstrap_db` first. Start FastAPI as before and run
`python -m app.services.research_flow.worker` in another process, or use updated Compose.
Configure existing GEMINI_API_KEY/AI_ENABLED/AI_MODEL and optional ResearchFlow settings
from backend/research-flow.env.example. Open /research-flow after signing in.
No MockProvider fallback is exposed in production; missing provider configuration
produces recoverable task failure/human review, never fabricated research.
