# UniResearch administrator login guide

**Verified:** 3 August 2026  
**Scope:** Local development and isolated testing only  
**Backend protection:** No backend source, configuration, schema, migration, seed, test, user, role, or persistent database was modified.

## Admin login summary

Administrator login is supported **only when the database already contains an active user whose exact `role` value is `admin`**. The normal frontend registration page cannot create that account: its route handler always sends `role: "student"` ([frontend register handler](../app/api/auth/register/route.ts), line 8).

| Item | Exact behavior |
|---|---|
| Backend login endpoint | `POST /auth/login` ([auth router](../../backend/app/routers/auth.py), lines 9 and 15–19) |
| Request media type | `application/x-www-form-urlencoded`, using OAuth2 password-form fields `username` and `password` |
| Login identifier | Email address placed in the form field named `username`; the authentication service queries `User.email` ([auth service](../../backend/app/services/auth_service.py), lines 21–25) |
| Successful response | JSON containing only `access_token` and `token_type: "bearer"` ([token schema](../../backend/app/schemas/token.py), lines 4–6) |
| Required database role | Exact string `admin` |
| JWT claims | `sub` containing the email and `exp`; the role is **not** included ([security module](../../backend/app/core/security.py), lines 15–22) |
| Role verification | The backend decodes `sub`, reloads that user from the database, checks `is_active`, then compares the current database role in `require_role` ([authorization dependencies](../../backend/app/routers/deps.py), lines 12–42) |
| Frontend cookie | `uniresearch_access_token`, HttpOnly, SameSite=Lax, path `/`, 30-minute max age, and `Secure` in production ([session helper](../src/lib/api/session.ts), lines 3–7) |
| Canonical admin routes | `/admin` and `/admin/categories` |
| Compatibility route | `/dashboard/admin` redirects to `/admin` ([redirect route](../app/dashboard/admin/page.tsx), lines 1–2) |

The frontend login transformation is correct. The browser sends JSON `{email, password}` to `POST /api/auth/login`; the Next.js route handler converts it to URL-encoded `{username: email, password}` before calling FastAPI, stores the returned access token in the HttpOnly cookie, and returns no token to client JavaScript ([frontend login handler](../app/api/auth/login/route.ts), lines 6–13).

### What the admin pages authorize

`/admin` does **not** verify the user's role. It checks only whether the session cookie exists and then reads public `GET /stats/` data ([admin page](../app/admin/page.tsx), lines 7–10; [stats router](../../backend/app/routers/stats.py), lines 10–25).

`/admin/categories` also checks only cookie presence. Listing categories is public. The actual admin authorization occurs only when its form calls `POST /categories/`, whose backend dependency is `require_role(["admin"])` ([admin categories page](../app/admin/categories/page.tsx), lines 9–12; [category router](../../backend/app/routers/category.py), lines 10–22; [frontend category proxy](../app/api/categories/route.ts), line 5).

Other backend operations that accept admin are:

- `POST /research/`: `admin` or `student` ([research router](../../backend/app/routers/research.py), lines 12–28).
- `POST /research/{research_id}/review`: `admin` or `advisor` ([research router](../../backend/app/routers/research.py), lines 61–67).

`POST /research/{research_id}/download` requires any active authenticated user, not specifically an administrator. Search, detail, statistics, category listing, and home endpoints are public.

## Existing admin account

### A testing admin fixture exists

The repository intentionally defines this pytest-only fixture in [backend/tests/conftest.py](../../backend/tests/conftest.py), lines 61–72:

- Identifier: `admin@test.com`
- Password: `password123`
- Role: `admin`
- Active: yes

This credential is safe only for the repository's isolated tests. The fixture writes to an in-memory SQLite database created and dropped around tests ([backend/tests/conftest.py](../../backend/tests/conftest.py), lines 13–36). It is not a development account, is not inserted by starting FastAPI or Docker Compose, and normally cannot be used from the separately running frontend. Existing research tests demonstrate its backend login and category-creation use ([backend/tests/test_research.py](../../backend/tests/test_research.py), lines 5–15 and 31–38).

### No development admin or seed was found

The inspected repository contains:

- No development admin credential.
- No seed script or seed fixture that creates a persistent administrator.
- No Alembic migration files or `versions/` directory; only `backend/alembic.ini` is present.
- No official administrator-creation CLI command.
- No user-update, role-update, or promotion endpoint.
- No documented procedure in [backend/README.md](../../backend/README.md); it documents startup and pytest only (lines 52–100).
- No admin creation in [backend/docker-compose.yml](../../backend/docker-compose.yml); it starts PostgreSQL and FastAPI only (lines 1–38).
- No account credentials in `backend/.env.example`; it contains service/database/JWT configuration only (lines 1–5).

The application startup calls `Base.metadata.create_all` but does not insert users ([backend main](../../backend/app/main.py), lines 13–17).

### Backend-supported account provisioning behavior

The existing backend registration endpoint accepts `UserCreate`, whose `role` field is an unrestricted string defaulting to `guest` ([user schema](../../backend/app/schemas/user.py), lines 4–13). The authentication service copies that supplied role directly into the user row ([auth service](../../backend/app/services/auth_service.py), lines 9–19). Consequently, `POST /auth/register` with JSON containing `"role": "admin"` currently creates an administrator.

This was runtime-verified against disposable in-memory SQLite: registration returned `200` with role `admin`, subsequent form login returned `200`, and `POST /categories/` returned `200`. No credential or token from that disposable run is reusable.

This is the only implemented backend account-creation path, but public privilege self-assignment is a security risk—not a safe production provisioning design. For a local persistent development database, ask the backend team to provision a dedicated development administrator through the existing backend-supported registration action in that isolated environment and deliver its credential securely. Do not expose or use that operation to self-register administrators in shared, staging, or production systems.

An existing student cannot be promoted through any current API. Registration rejects an already registered email, and no update-role route exists. The backend team must create a separate admin account or use an approved backend-team provisioning process; this frontend task must not edit database rows directly.

## How to log in

### Option A: Verify the committed test administrator

This validates the backend fixture in an isolated in-memory database; it does not create a browser-accessible development account.

```powershell
Set-Location D:\Project-69\UniResearch\backend
$env:PYTHONPATH='.'
$env:PYTHONDONTWRITEBYTECODE='1'
python -m pytest tests/test_research.py -p no:cacheprovider -v
```

The test creates `admin@test.com`, sends `username=admin@test.com` and the committed fixture password to `/auth/login`, then successfully creates a category. The database tables and user are dropped after the test.

### Option B: Browser login in local development

This option requires a backend-team-provisioned administrator in an approved local/disposable database. There is no committed development credential to substitute below.

1. Ask the backend team for the identifier and password of an active local-development account whose database role is exactly `admin`. If none exists, follow **If no admin account exists** below.
2. Configure and start the backend with an approved local/disposable database. Backend startup creates tables, so verify the database URL before running it:

   ```powershell
   Set-Location D:\Project-69\UniResearch\backend
   python -m uvicorn app.main:app --reload
   ```

3. Start the frontend with `BACKEND_API_URL` pointing to that backend (the default is `http://127.0.0.1:8000`, as defined in [API client](../src/lib/api/client.ts), line 4):

   ```powershell
   Set-Location D:\Project-69\UniResearch\frontend
   pnpm.cmd dev
   ```

4. Open `http://localhost:3000/login?next=/admin`. Using `next=/admin` matters because a plain `/login` defaults to `/account/saved` ([login page](../app/login/page.tsx), lines 4–5; [login form](../src/features/auth/auth-form.tsx), line 10).
5. Enter the administrator's **email address** and password. Do not enter a display username.
6. Submit. Confirm in browser developer tools that the response to `POST /api/auth/login` is `200` and that an HttpOnly `uniresearch_access_token` cookie exists. JavaScript cannot and should not read its value.
7. The browser follows the safe `next` path to `/admin`. If login was opened without `next=/admin`, navigate manually to `http://localhost:3000/admin`.
8. Open `/admin/categories` and submit a non-destructive test category only when using a disposable database. A `200` from the frontend category proxy confirms backend admin authorization. Merely seeing `/admin` or the category list does not prove the account is an administrator because those reads are public.

There is no general role-aware post-login redirect. The form redirects only to its supplied `next` path, defaulting to `/account/saved`. A future frontend-only improvement could provide an explicit “administrator sign in” link targeting `/login?next=/admin` and improve messaging after a protected `403`. Automatically discovering the correct dashboard would require backend-supported current-user/role data; the JWT itself has no role claim.

## If no admin account exists

Request this exact action from the backend team:

> Provision a new active user with role exactly `admin` in the approved local or disposable test database using the currently supported `POST /auth/register` account-creation contract, then share the development-only email and password through the approved secret channel. Do not alter an existing student, do not edit production/shared data, and do not reuse test fixture credentials outside their in-memory pytest environment.

The backend request contract currently implemented is:

```http
POST /auth/register
Content-Type: application/json

{
  "email": "<backend-team-selected-local-admin-email>",
  "password": "<backend-team-selected-local-admin-password>",
  "role": "admin"
}
```

The placeholders are intentional; this guide does not invent an account or password. Because this unauthenticated endpoint trusts the requested role, the backend team should also treat public role assignment as a security defect for production remediation. No supported API can promote an existing student.

## Expected authorization responses

The table below uses `POST /categories/`, the only endpoint used by the current admin pages that actually requires the admin role.

| Credential state | Backend response | Frontend behavior |
|---|---|---|
| No token | `401`, `{"detail":"Not authenticated"}` | `/admin` redirects to `/login?next=%2Fadmin` only when the cookie is absent; the category proxy also returns 401 if called without a cookie |
| Invalid/expired token | `401`, `{"detail":"Could not validate credentials"}` | Cookie presence can initially render `/admin`; a protected proxied request returns 401 and `toRouteResponse` clears the cookie ([route response helper](../src/lib/api/route-response.ts), lines 3–5) |
| Valid student token | `403`, `{"detail":"Not enough permissions"}` | `/admin` and category listing can render, but category creation shows the forbidden message |
| Valid advisor token | `403`, `{"detail":"Not enough permissions"}` | Same behavior as student for category creation |
| Valid admin token | `200` and the created `CategoryResponse` | Category creation succeeds |

Runtime evidence from disposable in-memory SQLite:

- No token → `401 Not authenticated`.
- Invalid token → `401 Could not validate credentials`.
- Student login → `200`; protected admin endpoint → `403`.
- Advisor login → `200`; protected admin endpoint → `403`.
- Admin login → `200`; protected admin endpoint → `200`.
- Decoded claim names for all valid tokens were exactly `exp` and `sub`; no `role` claim was present.
- Successful login response fields were exactly `access_token` and `token_type`.

No full JWT value was printed or retained.

## Troubleshooting

### 401 Unauthorized

- No bearer token was sent, the token is malformed/expired, its signature does not match the backend secret, its `sub` is missing, or the subject email no longer resolves to a user.
- With no cookie, revisit `/login?next=/admin`.
- With an invalid cookie, trigger a protected frontend request or log out so the stale cookie is cleared, then log in again.

### 403 Forbidden

- Authentication succeeded, but the current database user role is not exactly `admin` for `POST /categories/`.
- Student and advisor tokens are expected to receive 403.
- Ask the backend team to verify the account in the same local/disposable database. Do not edit or promote the user directly.

### Login succeeds but `/admin` fails

- Confirm the browser and frontend are using the same origin so the HttpOnly cookie is sent.
- Confirm the frontend server's `BACKEND_API_URL` targets the backend where the admin account exists.
- If the page renders but category creation fails, the account is likely not an admin; viewing public statistics does not prove role authorization.
- If FastAPI reports 401, the backend secret or database may differ from the instance that issued the token.

### Cookie is not created

- Inspect `POST /api/auth/login`, not the direct FastAPI request. The frontend handler is responsible for setting the cookie.
- A `400` generally means incorrect email/password; `422` means the frontend request omitted a required field.
- In production mode the cookie is `Secure`, so use HTTPS. It is not Secure in development mode.
- The cookie is HttpOnly and therefore intentionally unavailable through `document.cookie`.

### Wrong backend URL

- The frontend defaults to `http://127.0.0.1:8000`.
- Set `BACKEND_API_URL` for the frontend server before startup if FastAPI uses another address, then restart Next.js.
- A test fixture account exists only inside its pytest process and in-memory database; pointing a regular frontend at port 8000 does not make that fixture available.

### Wrong role

- The exact accepted value for category administration is `admin`.
- The JWT cannot be inspected for role because it does not contain one; the backend reloads the database user on every authorized request.
- There is no supported promotion endpoint.

### Admin route redirects unexpectedly

- `/dashboard/admin` always redirects to `/admin` by design.
- `/admin` and `/admin/categories` redirect to `/login` when the frontend cookie is absent.
- Login from a bare `/login` goes to `/account/saved`; use `/login?next=/admin` or first open `/admin` and follow its generated login redirect.

## Evidence index

| Conclusion | Evidence |
|---|---|
| Router mounting and no startup seed | [backend main](../../backend/app/main.py), lines 13–17 and 141–148 |
| Login endpoint and OAuth2 form | [auth router](../../backend/app/routers/auth.py), lines 9 and 15–19 |
| Email lookup, hashing, account creation | [auth service](../../backend/app/services/auth_service.py), lines 9–29; [security module](../../backend/app/core/security.py), lines 7–22 |
| User role and active fields | [user model](../../backend/app/models/user.py), lines 4–15 |
| Registration accepts an arbitrary role string | [user schema](../../backend/app/schemas/user.py), lines 4–13 |
| Token response and claims | [token schema](../../backend/app/schemas/token.py), lines 4–9; [security module](../../backend/app/core/security.py), lines 15–22 |
| Database role authorization and 401/403 details | [authorization dependencies](../../backend/app/routers/deps.py), lines 10–42 |
| Admin-only category mutation | [category router](../../backend/app/routers/category.py), lines 10–22 |
| Admin fixture and disposable DB | [test fixtures](../../backend/tests/conftest.py), lines 13–72 |
| Fixture login and admin mutation | [research tests](../../backend/tests/test_research.py), lines 5–15 and 31–38 |
| Standard login test request/response | [authentication tests](../../backend/tests/test_auth.py), lines 15–32 |
| No seed/admin setup in documented startup | [backend README](../../backend/README.md), lines 52–100; [Docker Compose](../../backend/docker-compose.yml), lines 1–38 |
| Frontend OAuth-form transformation | [frontend login handler](../app/api/auth/login/route.ts), lines 6–13 |
| HttpOnly cookie behavior | [session helper](../src/lib/api/session.ts), lines 3–7 |
| Login navigation behavior | [login page](../app/login/page.tsx), lines 4–5; [auth form](../src/features/auth/auth-form.tsx), lines 6–10 |
| Admin pages check only cookie presence | [admin page](../app/admin/page.tsx), lines 7–10; [admin categories page](../app/admin/categories/page.tsx), lines 9–12 |
| Protected category proxy forwards bearer token | [category proxy](../app/api/categories/route.ts), line 5; [API client](../src/lib/api/client.ts), lines 8–17 |
| Runtime status matrix | Disposable SQLite/ASGI verification performed 3 August 2026; results recorded above, with JWT values omitted |

