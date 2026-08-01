# UniResearch Workspace Rules

## Ownership

- `backend/` is owned by the backend team and is strictly read-only.
- `frontend/` is owned by the frontend team and is the only writable application directory.
- `design/` contains Stitch exports, screenshots, and `DESIGN.md` references.

## Absolute backend protection

Never create, modify, format, rename, delete, migrate, seed, or generate files under `backend/`.
Do not change backend routes, schemas, models, services, tests, configuration, CORS, roles, status values, or database data.
Do not run write-flow tests against development or production data.

The backend may only be read, started using existing commands, and tested using its existing isolated test environment.

Any incompatibility must be solved in `frontend/` with typed adapters, route handlers, server actions, validation, or UI changes.

## Sources of truth

Inspect backend information in this order:

1. Runtime OpenAPI document
2. `backend/app/main.py`
3. `backend/app/routers/`
4. `backend/app/schemas/`
5. `backend/app/core/`
6. `backend/app/services/`
7. `backend/tests/`
8. `backend/README.md`

Do not invent endpoint paths, field names, enums, roles, status values, token fields, OAuth support, pagination, or error formats.

## Frontend architecture

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Server Components by default
- Client Components only for browser-only interaction
- Centralize API communication under `frontend/src/lib/api/` and `frontend/src/features/`
- Use Next.js Route Handlers or Server Actions for authenticated mutations
- Keep JWT credentials out of localStorage
- Backend authorization is the source of truth

## Design rules

Read `frontend/DESIGN.md` and all Stitch screenshots before changing UI.
Preserve the Mulberry Library system and The Living Research Index concept.
Use Kanit for Thai and Plus Jakarta Sans for English.
Do not introduce generic purple SaaS layouts, large gradients, glassmorphism, random blobs, repeated identical cards, or unrelated component libraries.
New pages must reuse design tokens and existing components before adding new patterns.

## Testing and completion

Before completing any feature, run the applicable commands:

- backend existing pytest suite
- frontend lint
- frontend typecheck
- frontend unit tests
- frontend contract tests
- frontend production build
- Playwright E2E tests

Verify the backend remains unchanged:

```bash
git -C backend status --porcelain
git -C backend diff --exit-code
```

Never claim a test passed unless it was actually executed.
