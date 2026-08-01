# Prompt 01 — Analyze backend without modifying code

Read `AGENTS.md` first.

Analyze the existing UniResearch backend. Do not modify any file in `backend/` or `frontend/` yet.

Inspect runtime OpenAPI, main application configuration, routers, Pydantic schemas, authentication/JWT code, services, tests, file upload handling, roles, status enums, pagination, search filters, and error responses.

Start the backend only with its documented existing commands. Run its existing tests only in the isolated test environment.

Create these files under `frontend/docs/` only:

- `backend-api-analysis.md`
- `backend-endpoint-inventory.md`
- `backend-integration-matrix.md`
- `backend-contract-risks.md`
- `backend-openapi.json`

The endpoint inventory must record method, path, auth requirement, role, request schema, response schema, query/path parameters, success codes, error codes, multipart field names, and relevant backend test coverage.

Compare runtime OpenAPI, source, tests, and README. Report disagreements without changing the backend.

Also inspect the current frontend and list every mock API, mock dataset, hardcoded auth flow, frontend-only field, unsupported Stitch action, and contract mismatch.

End with a phased frontend-only implementation plan and confirm that `git -C backend status --porcelain` is empty.
