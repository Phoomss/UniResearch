# Fix Development Database Connection and Verify Admin Login

Read first:

* `AGENTS.md`
* `frontend/docs/admin-login-guide.md`
* `backend/docs/admin-provisioning-report.md` if present
* `backend/README.md`
* `backend/docker-compose.yml`
* `backend/.env.example`
* `backend/app/main.py`
* `backend/app/core/`
* `backend/app/db/`
* `backend/app/scripts/create_admin.py`
* `backend/tests/`

## Current problem

Running:

```powershell
python -m app.scripts.create_admin
```

and:

```powershell
python -m uvicorn app.main:app --reload
```

both fail with:

```text
asyncpg.exceptions.InvalidPasswordError:
password authentication failed for user "postgres"
```

The development environment check already succeeds when:

```text
APP_ENV=development
```

The administrator has not yet been created.

## Objective

Safely diagnose and fix the local development PostgreSQL connection, run the existing administrator provisioning command, verify authentication and administrator authorization, run tests, and create a report.

This task is for local development only.

Do not connect to production or shared staging systems.

## Security rules

Never:

* Print database passwords
* Print `DEV_ADMIN_PASSWORD`
* Print JWT values
* Commit `.env`
* Hardcode passwords in source code
* Add real credentials to `.env.example`
* Modify production data
* Reset or delete a database without explicit opt-in
* Run `docker compose down -v` automatically
* Change backend API contracts
* Change database models or migrations
* Change authentication or authorization behavior
* Allow public frontend administrator registration
* Promote an existing student automatically

Mask credentials in all logs and reports.

If any value looks like production, staging, remote, or shared infrastructure, stop without making database changes.

## Expected environment variables

Use the values already provided in the shell when available:

```text
APP_ENV
DEV_ADMIN_EMAIL
DEV_ADMIN_PASSWORD
DATABASE_URL
```

Required allowed environment values:

```text
development
dev
local
test
testing
```

Reject:

```text
production
prod
staging
stage
```

Do not invent database or administrator passwords.

If a required secret is missing, stop and print the exact PowerShell command the developer must run, using placeholders only.

## Phase 1 — Inspect configuration without modifying files

Determine exactly where the active database URL comes from.

Inspect:

* Current process environment
* `backend/.env`
* `backend/.env.example`
* Pydantic settings configuration
* SQLAlchemy engine creation
* Docker Compose environment
* Docker Compose interpolation
* Default values in source code
* Parent-directory environment files
* Windows PostgreSQL services
* Docker containers
* Port 5432 ownership

Run safe inspection commands equivalent to:

```powershell
Get-ChildItem Env: | Where-Object {
    $_.Name -match "DATABASE|POSTGRES|DB_|APP_ENV"
}

Get-ChildItem -Force .env*

Get-ChildItem app -Recurse -File |
    Select-String -Pattern "DATABASE_URL|database_url|postgresql\+asyncpg"

docker compose ps
docker compose ps --services
docker compose config
```

When displaying configuration:

* Mask passwords
* Mask secret keys
* Show only database driver, host, port, database name, and username
* Do not print complete connection URLs containing credentials

Determine whether PostgreSQL is:

1. Running in Docker Compose
2. Running as a Windows service
3. Running somewhere else
4. Not running

Determine whether port `5432` is mapped by the expected PostgreSQL instance.

## Phase 2 — Choose the safe repair path

Select exactly one repair path based on evidence.

### Path A — Docker PostgreSQL with an existing persistent volume

If Docker PostgreSQL is running and the volume may contain important data:

* Do not remove the volume
* Do not recreate the database
* Verify the PostgreSQL username, database, port, and configured password source
* Reconcile the backend `DATABASE_URL` with the existing database credential
* If the actual password cannot be determined safely, stop and report the required manual action
* Do not reset the password automatically unless an approved development-only mechanism already exists

### Path B — Disposable Docker development database

Use this path only if all of the following are true:

* `APP_ENV` is explicitly development/local/test
* The database is confirmed disposable
* The developer has explicitly set:

```text
ALLOW_RESET_DEV_DB=true
```

Only then may the database volume be recreated.

Before resetting:

* Report that all local database records will be deleted
* Confirm the Compose project and database name
* Confirm that the target is not production or staging

Never infer consent from the task text.

If `ALLOW_RESET_DEV_DB` is missing, do not run destructive commands.

### Path C — Windows PostgreSQL service

If PostgreSQL is a Windows service:

* Identify the service and port
* Verify that the backend is targeting that service
* Do not reset the PostgreSQL password automatically
* If the correct password is supplied through `DATABASE_URL`, use it
* Otherwise stop and provide safe pgAdmin or interactive `psql` instructions without exposing a password

### Path D — Missing PostgreSQL instance

If no PostgreSQL instance is running:

* Start only the existing repository Docker Compose services
* Do not introduce a new database architecture
* Verify health before continuing

## Phase 3 — Configure the backend environment

If `backend/.env` does not exist:

* Create it from `backend/.env.example` only when safe
* Preserve the repository's expected variable names
* Add local values from existing shell environment variables
* Never invent credentials
* Ensure `.env` is ignored by Git
* Do not overwrite an existing `.env`

If the shell has an old `DATABASE_URL` that overrides `.env`:

* Report the precedence issue
* Use the verified intended development value for this process
* Do not change machine-wide environment variables automatically

The final active URL must use the exact driver expected by the application, such as:

```text
postgresql+asyncpg
```

Verify:

* Driver
* Host
* Port
* Database name
* Username
* Password presence without printing it

## Phase 4 — Test the database connection

Before starting FastAPI, test the SQLAlchemy/asyncpg connection using the existing application engine or session configuration.

The check must:

1. Open a connection
2. Execute a harmless query such as `SELECT 1`
3. Close the connection
4. Return a clear success or failure status
5. Never print credentials

If the connection still fails:

* Stop
* Do not run provisioning
* Record the exact exception class
* Explain the likely configuration source
* Do not make speculative changes

## Phase 5 — Start and verify FastAPI

Start the backend using the repository's existing command.

Verify:

* Application startup completes
* Database initialization succeeds
* Swagger or the configured documentation endpoint responds
* OpenAPI responds
* No password authentication error remains

Do not leave duplicate Uvicorn processes running.

Record the PID or process management method used during testing.

## Phase 6 — Provision the development administrator

Use the existing command:

```powershell
python -m app.scripts.create_admin
```

Require:

```text
APP_ENV
DEV_ADMIN_EMAIL
DEV_ADMIN_PASSWORD
```

Do not echo `DEV_ADMIN_PASSWORD`.

Expected outcomes:

* Administrator created
* Administrator already exists
* Existing non-admin account prevents provisioning
* Provisioning failed

Do not modify an existing non-admin account.

If the administrator email already exists with another role:

* Stop
* Do not promote it
* Recommend using a new development-only email

## Phase 7 — Verify login safely

Verify the real backend login endpoint using:

```text
POST /auth/login
Content-Type: application/x-www-form-urlencoded
```

Send:

```text
username=<DEV_ADMIN_EMAIL>
password=<DEV_ADMIN_PASSWORD>
```

Verify:

* HTTP 200
* Response contains `access_token`
* Response contains `token_type`
* Do not print or store the full token in the report

If login fails:

* Report the HTTP status and sanitized error
* Do not recreate or overwrite the user automatically

## Phase 8 — Verify administrator authorization

Prefer verification against an isolated test database.

Use the existing backend test suite and admin fixture to prove that:

* Admin can call the protected category-create endpoint
* Student receives HTTP 403
* Advisor receives HTTP 403
* Missing token receives HTTP 401

For the persistent local development database:

* Do not create a verification category unless:

```text
ALLOW_DEV_WRITE_VERIFICATION=true
```

* If write verification is allowed, use a unique clearly temporary category name
* If no delete endpoint exists, clearly report that the verification record remains
* Never perform this write against shared or production data

Merely loading `/admin` is not proof of admin authorization because its statistics endpoint is public.

## Phase 9 — Verify the frontend flow

Do not change frontend behavior unless a frontend defect is discovered.

Start the Next.js frontend using the existing package manager.

Verify:

1. Open `/login?next=/admin`
2. Submit the administrator email and password
3. Confirm `POST /api/auth/login` returns success
4. Confirm the HttpOnly cookie is created
5. Confirm redirect to `/admin`
6. Open `/admin/categories`
7. Verify protected behavior using the safe authorization approach
8. Confirm logout clears the frontend cookie

Never expose the cookie value.

## Phase 10 — Run tests

Run the existing complete backend suite:

```powershell
$env:PYTHONPATH='.'
$env:PYTHONDONTWRITEBYTECODE='1'
python -m pytest tests -p no:cacheprovider -v
```

Run focused provisioning tests if present:

```powershell
python -m pytest tests/test_create_admin.py -p no:cacheprovider -v
```

Run frontend checks:

```powershell
pnpm.cmd typecheck
pnpm.cmd lint
pnpm.cmd test
pnpm.cmd build
```

Run relevant Playwright authentication/admin tests when the required isolated environment and credentials are available.

Do not report tests as passed unless they were actually executed.

Do not modify backend tests merely to make them pass.

## Required fixes

You may make minimal changes only when evidence proves they are required.

Allowed changes:

* Create a missing local `.env` from `.env.example`
* Correct local-only environment configuration
* Improve safe error handling in `create_admin.py`
* Add a sanitized database connection diagnostic
* Add or improve provisioning tests
* Improve local-development documentation
* Fix frontend defects directly blocking the verified login flow

Forbidden changes:

* API contract changes
* Model/schema changes
* Authentication logic changes
* Authorization weakening
* Database password hardcoding
* Production configuration changes
* Automatic role promotion
* Destructive database reset without explicit environment opt-in

## Improve provisioning error handling

If `create_admin.py` currently outputs a full traceback for expected connection failures, update it so that:

* `InvalidPasswordError` produces a concise safe message
* Connection-refused errors produce a concise safe message
* Unknown database errors return non-zero exit status
* Transactions roll back
* Passwords and complete URLs are never printed
* Debug tracebacks are available only with an explicit development debug flag

Do not hide unexpected failures from tests.

## Required reports

Create or update:

```text
backend/docs/database-connection-fix-report.md
backend/docs/admin-provisioning-report.md
frontend/docs/admin-login-verification-report.md
```

### `database-connection-fix-report.md`

Include:

* Date
* Environment
* Initial error
* Configuration source found
* PostgreSQL runtime type: Docker, Windows service, or other
* Driver, masked host, port, database, and username
* Root cause
* Changes made
* Whether `.env` was created
* Whether any database reset occurred
* Connection test result
* FastAPI startup result
* Security notes

Do not include credentials.

### `admin-provisioning-report.md`

Include:

* Provisioning command
* Result
* Masked administrator email
* Whether the account was created or already existed
* Login verification result
* Authorization verification result
* Environment used
* Database type
* Tests executed
* Remaining risks
* Confirmation that no password or JWT was recorded

### `admin-login-verification-report.md`

Include:

* Frontend and backend addresses
* Login route
* Redirect route
* Cookie name without value
* Admin pages verified
* HTTP results
* Failed or skipped checks
* Screenshots or Playwright traces when available
* Final readiness status

## Final response

Provide a concise Thai summary with:

1. Root cause
2. Configuration source used
3. Files changed
4. Whether the database connection works
5. Whether FastAPI starts
6. Whether the admin was created
7. Whether login succeeds
8. Whether admin authorization is verified
9. Test results
10. Report locations
11. Any manual action still required

Do not expose secrets.
