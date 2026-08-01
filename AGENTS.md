# UniResearch Frontend Integration Rules

## Project Scope

This workspace contains:

- backend/: existing FastAPI backend owned by the backend team
- frontend/: Next.js frontend owned by the frontend team

The objective is to integrate the frontend with the existing backend.

## Absolute Backend Protection

The backend is immutable.

Never:

- Modify any file under backend/
- Format backend files
- Rename backend files
- Change API routes
- Change request or response schemas
- Change database models
- Change migrations
- Change authentication behavior
- Change roles or permissions
- Change backend environment variables
- Add backend endpoints
- Add backend compatibility code
- Modify backend tests
- Modify backend seed data
- Write to the development or production database
- Generate files inside backend/static/
- Run Alembic migrations
- Run destructive database commands

The backend may only be:

- Read
- Inspected
- Started
- Tested using its existing commands

Any frontend incompatibility must be solved inside frontend/.

If the frontend expects data in a different shape, create a frontend adapter.
Never change the backend response to fit the frontend.

## Sources of Truth

Inspect the backend in this order:

1. backend/app/main.py
2. backend/app/routers/
3. backend/app/schemas/
4. backend/app/core/
5. backend/app/services/
6. backend/tests/
7. Live OpenAPI schema
8. backend/README.md

Do not invent endpoints, fields, roles, status values, error codes,
query parameters, authentication behavior, or upload formats.

When source code, README, tests, and OpenAPI disagree:

- Report the mismatch
- Prefer observed runtime behavior and existing backend tests
- Do not change the backend

## Frontend Scope

Only modify files under frontend/.

Use:

- Next.js App Router
- TypeScript strict mode
- Existing frontend package manager
- Existing styling system
- Existing UniResearch design system
- Server Components by default
- Client Components only for browser interaction
- Route Handlers or Server Actions for authenticated mutations

Do not redesign unrelated pages.

## API Integration

Centralize all backend communication under:

frontend/src/lib/api/
frontend/src/features/
frontend/src/app/api/

Do not scatter raw fetch calls across UI components.

Create:

- Typed API request and response types
- A shared server-side API client
- Authentication helpers
- Error normalization
- Frontend view-model adapters
- Feature-specific API modules

Preserve the exact backend request and response contract.

## Authentication

Inspect the backend implementation before choosing the frontend session strategy.

The backend uses JWT, but do not assume:

- Token endpoint paths
- Token field names
- Refresh token availability
- Token expiration format
- OAuth support
- Cookie support

If the backend returns JWT tokens in JSON:

- Receive tokens through a Next.js Route Handler
- Store session credentials in secure HttpOnly cookies where compatible
- Send the expected Authorization header from the Next.js server
- Do not store JWT or refresh tokens in localStorage

Do not implement refresh-token behavior unless the backend supports it.

Do not claim Google login works unless a corresponding backend OAuth flow exists.

## CORS

Do not change backend CORS configuration.

Prefer server-to-server calls:

Browser
→ Next.js Route Handler or Server Action
→ FastAPI backend

This keeps browser requests on the Next.js origin and avoids requiring
backend changes solely for frontend CORS.

## File Uploads

Inspect the backend multipart schemas and tests.

For cover and PDF uploads:

- Preserve exact field names
- Preserve supported MIME types
- Preserve size rules
- Do not manually set multipart Content-Type
- Forward binary responses correctly
- Preserve Content-Disposition and Content-Type headers for downloads

## Testing Rules

The existing backend tests must remain unchanged and must still pass.

Run write-operation integration tests only against:

- Backend testing environment
- Disposable SQLite database
- Disposable PostgreSQL container
- Existing isolated test fixtures

Never run registration, submission, review, upload, or delete tests
against development or production data.

Frontend validation must include:

- Type checking
- Linting
- Unit tests
- API contract tests
- Integration tests
- Playwright end-to-end tests
- Production build

## Completion Requirements

Before finishing:

1. Verify no backend file changed
2. Verify backend tests pass
3. Verify frontend lint passes
4. Verify frontend type checking passes
5. Verify frontend tests pass
6. Verify frontend production build passes
7. Verify Playwright tests pass against the real test backend
8. Produce an integration report
9. List blocked features without inventing backend support

A task is not complete if backend/ contains any new or modified file.