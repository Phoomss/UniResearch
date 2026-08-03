# Unsupported and partially supported design features

This list covers visible Stitch/application concepts that exceed the verified backend contract. “Unsupported” is based on router/service absence, not on whether a model or visual exists.

## Not supported

The first 22 rows below are backend-dependent feature groups and are the “blocked by backend” count used in the final summary. The final three rows are separately identified product/content gaps, not missing FastAPI operations.

| Visible feature | Evidence in design/frontend | Backend verification | Recommendation |
|---|---|---|---|
| Google login/register | Stitch login/register buttons | No OAuth router/service | **Remove** active control; optionally show disabled “not available” messaging only if product requires it. Request future OAuth endpoint. |
| Forgot/reset password | Stitch forgot-password screen and login link | No recovery/token routes | **Hide** link and do not create routes; request future endpoints. |
| Email verification/resend | Stitch verify-email screen | No verification fields/routes | **Remove** from active journey; request future endpoints. |
| Role-selection welcome flow | Stitch welcome screen | Registration trusts arbitrary role but frontend safely forces student; no role-assignment workflow | **Remove** as authorization step; keep only non-interactive onboarding copy if desired. |
| Profile/avatar editing | Discovery/student/reviewer header visuals | No `/me` or user update | **Hide** controls; request current-user and update endpoints. Generic avatar may remain decorative. |
| Notifications | Dashboard bell/icons | No model/schema/route | **Remove** interactive bell/badges; request future endpoint. |
| My submissions, progress, deadlines | Student dashboard fixtures | No list-by-user/current-user endpoint | **Disable with clear messaging** only on a blocked dashboard; request list endpoint. Do not show fixture counts. |
| Draft save/edit/resubmit | Submission/student designs | Create-only research route | **Hide/remove** buttons; request draft/update/submit-transition endpoints. |
| File revision history/upload | Models/design status imply revisions | Model exists but no route/service | **Hide** actions; request revision list/upload endpoints. |
| Advisor queue/assignment/history | Reviewer dashboard cards/tabs | No queue/assignment/history/read-review endpoint | **Replace** with known-ID workspace only; request endpoints. |
| Scoring/rubric | Reviewer design | No score schema/route | **Remove**; request future backend endpoint/schema. |
| Request revision | Reviewer design/status copy | Only a model comment; unconstrained string endpoint and no revision workflow/test | **Disable with clear messaging** pending runtime/product contract; request explicit enum and workflow endpoints. |
| Read reviewer feedback/comments | Student/review designs | Review create only | **Hide** feedback panels; request comments/history read endpoint. |
| Admin research management | Admin candidate designs/routes | No list/update/delete/publish route | **Remove** navigation; request endpoints. |
| User management | Admin candidates | No users router | **Remove** navigation; request endpoints. |
| Category edit/delete | Typical category management affordances | List/create only | **Hide** edit/delete controls; request endpoints. |
| Detailed analytics, popular searches, view/download logs | README/design dashboard concepts | Logs are written, never read; only four totals endpoint exists | **Remove** drill-down links/charts; retain exact totals; request aggregate/log endpoints. |
| Advanced search: abstract, year, department, work type, language, author, advisor | Stitch discovery filters | `q` searches titles/keywords; category is only filter | **Hide** unsupported filters; request query parameters. |
| Search sorting and pagination | Stitch sorting/pages | Search returns unsorted bare array | **Remove** controls rather than client-paginating an incomplete dataset; request server parameters/count. |
| Citation count/export/DOI/BibTeX | Research detail designs/pattern text | No fields/routes | **Remove** actions/values; static citation-like visual line may remain decorative without numbers. |
| Related research | Detail design | No relationship/recommendation endpoint | **Remove** dynamic section; request endpoint. |
| Author/advisor names and selectors | Detail/submission designs | Create accepts IDs, but no lookup; response omits relationships | **Disable with clear messaging**; never invent names/IDs; request lookup and enriched response. |
| Institution/network counts (`50k+`, `120+`) *(product/content gap; not backend-blocked count)* | `AuthShell` and Stitch auth screens | Stats API exposes only four totals, no institution metric | **Keep only as clearly non-interactive marketing copy** if institution validates it; otherwise remove. |
| Language switching *(frontend product gap; not backend-blocked count)* | Header/auth/dashboard switch | No localization mechanism; control has no action | **Disable with clear messaging** or remove until translations/routes exist. |
| Privacy/terms/help destinations and footer support details *(content gap; not backend-blocked count)* | Shared shells/Stitch `href="#"` | Static content, no frontend destination; not an API feature | **Keep as non-interactive visual content** only if institution-provided, or add static legal/help pages as separate content work. |

## Partially supported and must be constrained

| Feature | Supported slice | Missing / risk | Recommendation |
|---|---|---|---|
| Bookmarking | Favorite toggle/list | List returns IDs only; toggle removal response differs from OpenAPI | Keep working action and a simple saved page; normalize union response; do not fabricate cards. |
| Download | Authenticated handshake and static path | No binary response/disposition from POST; static URL is public | Keep server proxy; label auth behavior accurately; do not promise inline PDF preview. |
| Cover/PDF validation | Optional multipart uploads | Backend defines no MIME/size limits and uses raw filenames | Keep frontend safety policy but do not call 5/25 MB backend rules; backend risk requires future remediation outside this immutable scope. |
| Approval/rejection | Known-ID review mutation; approval tested | No queue/history; rejection untested; arbitrary statuses accepted | Offer only `approved` and `rejected`; use confirmation dialog; show backend 403/404/422. |
| Category browsing | Public list and search filter by integer ID | No slug/detail | Use `/research?category_id=`; do not create slug routes. |
| Public detail | Scalar work response | Authors/advisors/reviews/category object absent; any status exposed | Render only returned fields and category adapter; do not claim publication confidentiality. |
