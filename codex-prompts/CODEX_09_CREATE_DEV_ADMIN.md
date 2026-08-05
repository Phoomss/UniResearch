# UniResearch Development Admin Provisioning

Read the following files before making changes:

* AGENTS.md
* frontend/docs/admin-login-guide.md
* backend/README.md
* backend/app/main.py
* backend/app/core/
* backend/app/db/
* backend/app/models/user.py
* backend/app/schemas/user.py
* backend/app/services/auth_service.py
* backend/app/routers/auth.py
* backend/tests/conftest.py
* backend/docker-compose.yml
* backend/.env.example

## Objective

Create a safe, repeatable, development-only method for provisioning an administrator account in the UniResearch backend.

This task is allowed to modify backend files only when required to add the local-development provisioning command and its tests.

Do not modify frontend application code.

Do not change existing API contracts, database schemas, authentication behavior, JWT format, role authorization logic, or production behavior.

## Safety requirements

This task is for:

* Local development
* Disposable testing databases
* Approved development databases

This task must never:

* Connect to production
* Connect to a shared staging database without explicit approval
* Insert credentials into source code
* Commit a real password
* Print a password in console output
* Print JWT values
* Modify an existing user's role automatically
* Promote a student account
* Delete or overwrite an existing user
* Change migrations
* Change database models
* Change public registration behavior
* Create a public frontend admin-registration page
* Disable authorization checks

Before creating any account, inspect the active database configuration.

If the database appears to be production or cannot be confirmed as local/development, stop and report the issue without creating data.

## Preferred implementation

Create a backend development CLI command or script using the existing application configuration, async SQLAlchemy session, password hashing, and User model.

Suggested location:

```text
backend/app/scripts/create_admin.py
```

Add package initialization files only if required by the repository structure.

The command should be executable as:

```bash
python -m app.scripts.create_admin
```

On Windows PowerShell:

```powershell
python -m app.scripts.create_admin
```

## Credentials

Read credentials only from environment variables:

```text
DEV_ADMIN_EMAIL
DEV_ADMIN_PASSWORD
```

Do not hardcode default credentials.

Do not silently generate a password.

If either variable is missing, stop with a clear message explaining which variable is required.

Never print `DEV_ADMIN_PASSWORD`.

Validate:

* Email is present and normalized consistently with the existing authentication service
* Password meets the existing backend requirements
* Role is always set internally to the exact string `admin`
* `is_active` is set according to the existing User model defaults or explicit safe value

Do not accept a role argument from the command line.

## Idempotent behavior

The provisioning command must be idempotent.

When the email does not exist:

1. Hash the password using the existing backend password-hashing helper
2. Create a new active user
3. Set role exactly to `admin`
4. Commit the transaction
5. Print only a safe success message containing the email and role

When the email already exists and role is `admin`:

* Do not change the password
* Do not create a duplicate
* Print that the administrator already exists
* Exit successfully

When the email already exists with a role other than `admin`:

* Do not promote or modify the account
* Roll back or perform no write
* Exit with a clear error
* Tell the operator to use a separate development email or request an approved backend-team action

When any database error occurs:

* Roll back the transaction
* Return a non-zero exit code
* Do not expose secrets in the error message

## Environment protection

Add a required environment variable:

```text
APP_ENV
```

Allow provisioning only when its normalized value is one of:

```text
development
dev
local
test
testing
```

Reject values such as:

```text
production
prod
staging
stage
```

Also reject missing or unknown values.

If the project already has an equivalent environment setting, reuse it rather than creating a duplicate.

Do not change the behavior of the running FastAPI application.

## Documentation

Update `backend/.env.example` with placeholders only:

```text
APP_ENV=development
DEV_ADMIN_EMAIL=
DEV_ADMIN_PASSWORD=
```

Do not include a real email or password.

Update `backend/README.md` with a section:

```text
Development administrator provisioning
```

The section must explain:

1. This command is for local/development databases only
2. How to verify the database URL
3. How to set the environment variables
4. How to run the command
5. How to start Backend and Frontend
6. How to log in through `/login?next=/admin`
7. How to verify admin access through `/admin/categories`
8. That HTTP 403 means the account is authenticated but is not an admin
9. That the command does not promote existing accounts
10. That credentials must not be committed

PowerShell example:

```powershell
Set-Location D:\Project-69\UniResearch\backend

$env:APP_ENV='development'
$env:DEV_ADMIN_EMAIL='admin-local@example.com'
$env:DEV_ADMIN_PASSWORD='<enter-a-local-development-password>'

python -m app.scripts.create_admin
python -m uvicorn app.main:app --reload
```

Do not put an actual password in the documentation.

## Tests

Add focused backend tests for the provisioning logic using the existing isolated test database approach.

Test at least:

1. Creates a new active admin
2. Stores a password hash rather than plain text
3. The created account can log in through `POST /auth/login`
4. The created account can call `POST /categories/`
5. A second run does not create a duplicate
6. An existing admin is left unchanged
7. An existing student with the same email is not promoted
8. Missing email is rejected
9. Missing password is rejected
10. Production environment is rejected
11. Database failure rolls back safely

Do not modify or weaken existing tests.

Run the complete existing backend test suite afterward.

## Runtime verification

Use only an isolated or approved local development database.

Before running the provisioning command:

1. Display the database host and database name when it is safe
2. Mask credentials
3. Confirm that `APP_ENV` is allowed
4. Confirm that the target is not production

Provision the account using environment variables provided by the developer.

Do not invent a credential.

If the environment variables have not been provided, implement and test the command but do not create an account in a persistent database.

After provisioning, verify:

1. Login returns HTTP 200
2. Response contains `access_token` and `token_type`
3. Do not print the access token
4. `POST /categories/` returns HTTP 200 using a disposable verification category
5. Remove the disposable verification category only if an existing supported delete operation exists
6. If no category delete operation exists, do not create a verification category in persistent data; instead verify against the isolated test database

## Frontend login verification

Do not modify frontend code.

Document the browser steps:

1. Start FastAPI
2. Start Next.js
3. Open:

```text
http://localhost:3000/login?next=/admin
```

4. Enter `DEV_ADMIN_EMAIL`
5. Enter the development password
6. Submit the login form
7. Confirm redirect to `/admin`
8. Open `/admin/categories`
9. Perform a write verification only against a disposable development database

Do not report that merely viewing `/admin` proves administrator authorization because its statistics read is public.

## Required report

Create:

```text
backend/docs/admin-provisioning-report.md
```

Create the `backend/docs/` directory if it does not exist.

The report must contain:

### 1. Task summary

* Purpose
* Date
* Environment
* Backend commit
* Files changed

### 2. Implementation

* CLI or script location
* Environment variables
* Safety checks
* Idempotent behavior
* Password handling
* Database handling

### 3. Account result

State exactly one:

* Development admin created successfully
* Development admin already existed
* Provisioning command implemented but no persistent account was created
* Provisioning was blocked because the environment was unsafe
* Provisioning failed

Do not include the password.

Mask the email when the report may be shared publicly, for example:

```text
ad***@example.com
```

### 4. Verification

Include:

* Login endpoint
* Login result
* Admin-protected endpoint used
* Authorization result
* Whether verification used an isolated database
* Confirmation that no JWT value was printed

### 5. Tests

Include:

* Commands executed
* Passed tests
* Failed tests
* Skipped tests
* Warnings

Do not report unexecuted tests as passed.

### 6. Security notes

Include:

* Public registration currently accepts a role value
* The frontend restricts registration to student
* Development provisioning must remain separate from public registration
* Production administrator provisioning requires an approved backend-team process
* Existing student accounts are not promoted

### 7. Login instructions

Include verified instructions for:

```text
/login?next=/admin
/admin
/admin/categories
```

### 8. Remaining work

Include any:

* Security concern
* Environment limitation
* Missing production provisioning process
* Deployment consideration
* Manual verification requirement

## Final response

At the end, provide a concise Thai summary containing:

1. Files created or changed
2. Whether an admin account was actually created
3. Which environment was used
4. How to run the provisioning command
5. How to log in through the frontend
6. Test results
7. Report file location
8. Any unresolved security risk

Do not expose passwords, tokens, database credentials, or production secrets.
