# Development administrator provisioning report

## 1. Task summary

- **Purpose:** Add a safe, repeatable, development-only administrator provisioning command without changing API contracts, database schemas, migrations, JWT behavior, authorization rules, or public registration behavior.
- **Date:** 3 August 2026
- **Environment:** Implementation and verification used the repository test environment with disposable in-memory SQLite. The command's missing-environment refusal was also verified without opening a provisioning database session.
- **Backend commit inspected:** `fa69d2b`
- **Files changed:**
  - `backend/app/core/config.py`
  - `backend/app/scripts/__init__.py`
  - `backend/app/scripts/create_admin.py`
  - `backend/tests/test_create_admin.py`
  - `backend/.env.example`
  - `backend/README.md`
  - `backend/docs/admin-provisioning-report.md`

No frontend application file, API route, model, schema, migration, existing seed, existing user, or persistent database record was changed.

## 2. Implementation

### CLI

The command is implemented at `backend/app/scripts/create_admin.py` and runs from the backend directory as:

```powershell
python -m app.scripts.create_admin
```

### Environment variables

- `APP_ENV` is required and accepts only `development`, `dev`, `local`, `test`, or `testing`, case-insensitively after trimming.
- `DEV_ADMIN_EMAIL` is required and validated through the existing `UserCreate`/`EmailStr` validation path.
- `DEV_ADMIN_PASSWORD` is required and has no default. The current backend schema defines no additional password-length or complexity constraint.
- `DATABASE_URL` continues to come from the existing application settings.

The three development provisioning variables were added to `.env.example` using placeholders only. Optional settings fields allow an environment file containing those documented variables to coexist with the existing FastAPI configuration; they do not alter application runtime behavior.

### Safety checks

- Missing, unknown, staging, and production `APP_ENV` values are rejected before database access.
- SQLite targets are accepted as local.
- PostgreSQL is accepted only on `localhost`, `127.0.0.1`, `::1`, or the repository's local Docker Compose host `db`.
- Database host/name text containing `production`, `prod`, `staging`, or `stage` is rejected.
- Remote or otherwise unconfirmed database targets are rejected.
- The command reports only the parsed driver, host, and database name; URL credentials are never displayed.
- Console account messages use a masked email. The password is never printed.
- The command does not accept a role argument and always assigns the exact internal role `admin`.

### Idempotent behavior

- A missing email creates one active administrator with a password hash and commits once.
- An existing administrator returns success without changing its password or creating a duplicate.
- An existing non-admin account causes a refusal. The transaction is rolled back and the account is not promoted or otherwise modified.
- Database failures trigger rollback and a non-secret error message with a non-zero CLI exit code.

### Password and database handling

The implementation uses the existing `get_password_hash` helper and `User` model. It uses the existing asynchronous `AsyncSessionLocal` factory and SQLAlchemy transaction methods. It does not create tables, run migrations, delete data, update roles, or overwrite accounts.

## 3. Account result

**Provisioning command implemented but no persistent account was created.**

The developer did not provide `APP_ENV`, `DEV_ADMIN_EMAIL`, or `DEV_ADMIN_PASSWORD` for an approved persistent local database. No credential was invented. The direct CLI safety check returned exit code 1 with a missing-`APP_ENV` refusal before any provisioning database session was opened.

Tests created temporary accounts only inside the isolated in-memory SQLite fixture. Those records were dropped automatically after each test.

## 4. Verification

- **Login endpoint:** `POST /auth/login`
- **Login result:** HTTP 200 for the isolated administrator created by the provisioning function.
- **Login response shape:** `access_token` and `token_type` were present.
- **Admin-protected endpoint:** `POST /categories/`
- **Authorization result:** HTTP 200 with the isolated administrator's bearer token.
- **Database:** Disposable in-memory SQLite using the existing backend test dependency override.
- **Persistent writes:** None.
- **JWT handling:** The test passed the token directly from the login response to the protected request. No JWT value was printed, logged in this report, or retained.

The disposable verification category was removed when the test fixture dropped all in-memory tables. No category was created in persistent data because the backend has no category-delete endpoint.

## 5. Tests

### Focused provisioning tests

Command:

```powershell
$env:PYTHONPATH='D:\Project-69\UniResearch\backend'
$env:PYTHONDONTWRITEBYTECODE='1'
python -m pytest backend/tests/test_create_admin.py -p no:cacheprovider -v
```

- **Passed:** 20
- **Failed:** 0
- **Skipped:** 0
- **Warnings:** 8
- **Duration:** 2.24 seconds

### Fail-closed CLI check

Command executed with `APP_ENV`, `DEV_ADMIN_EMAIL`, and `DEV_ADMIN_PASSWORD` absent:

```powershell
python -m app.scripts.create_admin
```

Result: exit code 1 and a clear missing-`APP_ENV` refusal. It did not connect for provisioning or create an account.

### Complete backend suite

Command:

```powershell
$env:PYTHONPATH='D:\Project-69\UniResearch\backend'
$env:PYTHONDONTWRITEBYTECODE='1'
python -m pytest backend/tests -p no:cacheprovider -v
```

- **Passed:** 25
- **Failed:** 0
- **Skipped:** 0
- **Warnings:** 18
- **Duration:** 4.13 seconds

The warnings are existing Pydantic class-config and naive `datetime.utcnow()` deprecations; no warning indicates a provisioning test failure.

Coverage includes:

1. New active administrator creation.
2. Password hashing and password verification.
3. Real login through `POST /auth/login`.
4. Real authorization through `POST /categories/`.
5. Duplicate prevention on a second run.
6. Existing administrator password/account preservation.
7. Refusal to promote an existing student.
8. Missing email refusal.
9. Missing password refusal.
10. Masked console email.
11. Missing/production/staging/unknown environment refusal.
12. Allowed development/test environment normalization.
13. Remote and production-named database refusal.
14. Database-error rollback without leaking database exception detail.

## 6. Security notes

- Public `POST /auth/register` currently accepts a caller-supplied role value. This remains an unresolved privilege-escalation risk.
- The frontend registration proxy forces `role: "student"`, but that restriction does not protect direct backend registration requests.
- Development administrator provisioning must remain separate from public registration.
- The new CLI does not change public registration, authentication, JWT claims, authorization dependencies, or API routes.
- Existing student, advisor, guest, or other non-admin accounts are never promoted.
- Production administrator provisioning requires a separate, approved backend-team process. This local command intentionally refuses production, staging, remote, and unconfirmed targets.
- Credentials must be supplied out of band through environment variables and must not be committed.

## 7. Login instructions

Only perform these steps with an approved local/disposable database and developer-provided credentials.

1. Inspect `DATABASE_URL` and confirm the host/database are local and non-production.
2. From `backend/`, set `APP_ENV`, `DEV_ADMIN_EMAIL`, and `DEV_ADMIN_PASSWORD` in the current shell. Do not save real values in the repository.
3. Run:

   ```powershell
   python -m app.scripts.create_admin
   python -m uvicorn app.main:app --reload
   ```

4. In a separate shell, start the frontend:

   ```powershell
   Set-Location D:\Project-69\UniResearch\frontend
   pnpm.cmd dev
   ```

5. Open `http://localhost:3000/login?next=/admin`.
6. Enter the developer-provided `DEV_ADMIN_EMAIL` and password, then submit.
7. Confirm the browser redirects to `/admin`.
8. Open `/admin/categories`.
9. To prove administrator authorization, perform category creation only on a disposable database and confirm HTTP 200. Merely viewing `/admin` is insufficient because its statistics read is public. HTTP 403 means the account is authenticated but is not an administrator.

## 8. Remaining work

- Remediate public registration's unrestricted role input through a separately approved backend security change.
- Define an approved production administrator provisioning process; this development CLI is intentionally not that process.
- Decide whether deployment environments should omit development provisioning variables entirely or enforce an additional packaging/runtime control.
- Provision a real local-development administrator only after the developer supplies credentials and confirms an approved local database target.
- Perform the manual frontend browser flow after such a local account exists. No persistent account was available during this task.
- The earlier frontend admin-login guide predates this CLI and should be updated in a separately authorized frontend-documentation task if it is intended to remain the primary operator guide.
