# P0 frontend page test plan

P0 includes one missing page and two high-risk existing-page completions. Tests must use the real backend only with its disposable test environment; no writes against development/production data.

## `/advisor/reviews/[id]` — review workspace

| Concern | Expectation |
|---|---|
| Happy path | Seed advisor/admin, category, and pending research in isolated DB; authenticate through frontend; load known ID; display exact scalar fields; submit non-empty comment with `approved` or `rejected`; show returned review ID/status. |
| Loading | Route skeleton announces loading and preserves dashboard layout without fake submission data. |
| Empty | Not applicable to a singular resource; absent optional abstract/file renders explicit unavailable state. |
| Validation failure | Empty comment/decision blocked client-side; backend 422 maps to field/global error. Only verified decisions are offered. |
| 401 | Missing/expired cookie redirects to `/login` or presents login recovery before mutation; clear invalid cookie. |
| 403 | Authenticated non-advisor/admin sees a dedicated forbidden state; never reports success. |
| 404 | Unknown research ID uses a not-found state with safe navigation. |
| 422 | Non-integer ID and malformed review body show validation state; no retry loop. |
| 500 | Persistent error panel with retry; retain unsent comment locally. |
| Responsive | Detail, document action, and decision form stack at ≤900px; controls remain reachable above mobile rail. |
| Accessibility | One `h1`; labeled fields; error summary/`aria-describedby`; keyboard-operable dialog; focus returned after confirmation; status announcement. |
| Integration test | Verify frontend handlers send `GET /research/{id}` and exact JSON `{comment_text,status_result}` with bearer cookie token; assert 401/403/404/422 normalization. |
| Playwright flow | Login as advisor fixture → navigate directly to known review URL → inspect work → approve with comment → assert success; repeat rejected path; student fixture asserts 403. |

## `/research/[id]` — public research detail completion

| Concern | Expectation |
|---|---|
| Happy path | Approved work renders titles, abstract, category-name adapter, counts, dates/null fallbacks; authenticated user can toggle favorite and download a present file. |
| Loading | Public-shell skeleton; no eager prefetch that increments view count multiple times. |
| Empty | Missing abstract/keywords/file gets factual empty labels and disabled download. |
| Validation failure | Invalid ID resolves to not found without calling backend. |
| 401 | Page remains readable; favorite/download explains login requirement and routes to login. |
| 403 | Mutation error shown inline; detail remains readable. |
| 404 | Existing not-found page; download file-not-found shown inline. |
| 422 | Invalid dynamic ID or handler parameter becomes safe validation/not-found state. |
| 500 | Public-shell error panel with retry/navigation; no fabricated metadata. |
| Responsive | Metadata grid and actions wrap; reading width and touch targets remain usable. |
| Accessibility | Semantic article/headings; action status announced; disabled state explained; links/buttons named distinctly. |
| Integration test | Assert detail fetch once per navigation; favorite union responses normalized; download handshake POST followed by backend-relative static fetch with content type/disposition forwarding. |
| Playwright flow | Guest opens detail → prompted to login for download → login → returns/open detail → toggles favorite → downloads seeded PDF; unknown ID shows 404. |

## `/student/research/new` — current submission page completion

| Concern | Expectation |
|---|---|
| Happy path | Login as student fixture; load categories; submit required exact multipart fields and optional files; receive `pending` work; navigate to returned ID. |
| Loading | Category/form skeleton; submit disabled until category data resolves. |
| Empty | Zero categories produces blocking empty state directing administrator to add a category; form cannot submit invalid category. |
| Validation failure | Required titles/category, invalid year, malformed/unsafe file blocked with wording that frontend rules are safety policy—not backend limits. |
| 401 | Missing/expired session redirects to login and does not upload. |
| 403 | Advisor/guest backend rejection renders forbidden state; never infer role from client input. |
| 404 | Not normally returned by create; if downstream navigation returns 404, show detail not-found with created ID for diagnosis. |
| 422 | Map backend validation issues to fields; preserve entered scalar data and selected filenames where browser permits. |
| 500 | Keep form data, announce server failure, allow explicit retry; prevent double submission. |
| Responsive | Two-column fields collapse; file controls and submit fit mobile width; progress/pending feedback visible. |
| Accessibility | Field labels, required indicators, error summary, focus first error, live pending/success state, keyboard-operable file inputs. |
| Integration test | Capture multipart request and assert exact field names, JSON-string `author_ids`/`advisor_ids`, no manually set multipart `Content-Type`, bearer token present. |
| Playwright flow | Student login → new research → select seeded category → fill titles/metadata → attach safe cover/PDF fixture → submit → assert pending detail; assert category-empty, 403, 422, and simulated 500 variants. |

## Test infrastructure gaps

- Current frontend has Node contract/design tests only; no Playwright dependency/config or page tests.
- Backend runtime/test prerequisites are currently missing locally (`uvicorn`, `pytest_asyncio`, `httpx`), and Docker daemon access is unavailable, so real-backend Playwright cannot run until the documented isolated environment is available.
- Tests must account for detail GET incrementing views and avoid prefetch/repeated assertions that mutate counts.
