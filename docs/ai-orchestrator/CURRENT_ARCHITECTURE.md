# Current UniResearch architecture

Inspected before implementation on 2026-10-07: backend/app, backend/tests,
frontend/app and src, frontend/tests and e2e, Compose/Dockerfiles, CI,
infrastructure Kubernetes/Terraform, existing schema/API/system-audit documentation.
No repository AGENTS.md was found. Working tree was clean.

## Existing architecture
- Next.js 16.2.12 App Router, React 19, TypeScript, Tailwind 4. Shared shells,
  UI classes/components and role-specific student/advisor/admin areas.
- Next route handlers proxy requests to FastAPI through apiRequest/toRouteResponse.
  JWT stays in an HTTP-only cookie; server proxy adds Bearer authentication.
- FastAPI routers/services/Pydantic schemas; async SQLAlchemy sessions and PostgreSQL.
  Users have guest/student/advisor/admin roles, active flags; dependencies enforce JWT/roles.
- ResearchWork stores bilingual titles, abstract, keywords, year, approval state,
  authors/advisors, revisions/reviews, paths and a 768-dimensional pgvector embedding.
- AIService uses google-generativeai, AI_MODEL, GEMINI_API_KEY, AI_ENABLED,
  token/temperature settings. No generic provider or agent interface exists.
- Writing assistant generates abstracts/titles/keywords and checks writing.
  Review tools handle pre-review, plagiarism heuristics, reviewer matching and summaries.
- RAG chatbot retrieves approved ResearchWork records by vector distance with text
  fallback and sends metadata/abstracts to Gemini. There is no PDF parsing,
  document chunk table, page locator, external academic search adapter or evidence map.
- research_service.search_research implements keyword matching, relevance ranking,
  role-aware visibility and search logging. Upload pipeline enforces MIME, suffix,
  magic signatures and configured size limits; files live under static/uploads.
- REST JSON and HTTPException errors; no SSE/WebSocket or durable task queue.
- Base.metadata.create_all runs at application startup. alembic.ini exists but
  its configured alembic directory does not. Compose currently tolerates migration failure.
- Compose runs pgvector PostgreSQL, backend and frontend. Production backend uses
  four uvicorn workers; Kubernetes also has replicas/HPA. No agent microservices needed.
- CI runs SQLite-backed pytest, frontend Node tests, tsc, ESLint and Next build;
  Playwright specs are also present. Python dependencies are unpinned.
- Service logging is limited; SQLAlchemy engine has echo=True (sensitive SQL risk).
  Embedding failure currently returns a zero vector; ResearchFlow must not depend on it.

## Reusable components and integration points
Reuse get_current_active_user, get_db/AsyncSessionLocal/Base, existing ResearchWork
metadata and search service (with an optional bounded query), existing Gemini
configuration/SDK, Next API/session helpers, DashboardShell and global CSS variables.
Add router/model imports in main.py, navigation link, additive config/Compose values.
Existing writing/chat/upload features retain their contracts.

## Proposed changes
1. Foundation: normalized ResearchFlow tables, validated schemas/provider interface,
   additive Alembic migration and shared state loader.
2. Agents: planner/search/paper/evidence/critic/writer/citation roles with restricted
   context, JSON outputs and deterministic provenance checks.
3. Orchestration: persisted task dependencies, conditional review routes, database
   leases, standalone worker using the same backend image, retry/budget/deadline limits,
   durable events and human commands.
4. Frontend: /research-flow input, workflow history/status, evidence/source/report
   explorer, authenticated proxy, safe progress polling.
5. Quality: mock-provider tests, evaluation harness, security/operations documentation.

## Limitations and compatibility risks
Internal approved papers/abstracts are the initial source corpus; no claim of full-text
reading, external discovery, journal authority or verified publication dates. Missing
method/dataset information must remain missing. Semantic entailment checks remain
fallible and need human evaluation. UUID strings and generic JSON make new tables
SQLite-testable; important entities and links are normalized. A migration only creates
new tables, assumes existing UniResearch schema, and does not alter old tables.
Worker leases must coordinate processes; API requests never run long research jobs.
Rate/concurrency/budget limits must be enforced in the database, not per-process memory.
