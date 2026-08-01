# UniResearch Frontend Workflow Pack

This pack bootstraps a Next.js + TypeScript + Tailwind frontend, applies the Mulberry Library design foundation, and supplies Codex prompts for read-only backend analysis, frontend integration, continued page work, testing, and reporting.

## Expected workspace

```text
UniResearch/
├── AGENTS.md
├── backend/                 # existing backend; read-only
├── frontend/                # generated Next.js app
└── workflow-pack/           # this folder
```

## Setup

From the workspace directory:

```bash
/path/to/workflow-pack/bootstrap-frontend.sh "$(pwd)"
cp frontend/.env.example frontend/.env.local
mkdir -p frontend/design/stitch
```

Copy Stitch screenshots, exported assets, and exported HTML/CSS into `frontend/design/stitch/`.

Keep the original `DESIGN.md` at `frontend/DESIGN.md`.

Run Codex from the workspace root so it can read both repositories while respecting `AGENTS.md`:

```bash
codex
```

Execute prompts in order:

1. `CODEX_01_BACKEND_ANALYSIS.md`
2. `CODEX_02_DESIGN_IMPLEMENTATION.md`
3. `CODEX_03_API_INTEGRATION.md`
4. `CODEX_04_CHANGE_PAGES_KEEP_DESIGN.md` for future work
5. `CODEX_05_TEST_AND_REPORT.md`

## Run

Backend, following its own README:

```bash
cd backend
docker compose up --build
```

Frontend:

```bash
cd frontend
pnpm dev
```

## Verify

```bash
cd frontend
pnpm verify
pnpm test:e2e

git -C ../backend status --porcelain
git -C ../backend diff --exit-code
```
