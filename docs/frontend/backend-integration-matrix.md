# Backend integration matrix

| Frontend capability / design | Backend support | Integration decision |
|---|---|---|
| Public landing metrics | Partial: public `/stats/` | Adapt four exact totals; no institution/publication/citation metrics |
| Latest/popular research | Yes | Use `/home/latest` and `/home/popular`; bare arrays, approved only |
| Discovery/search | Partial | Use `q` and `category_id`; no pagination, abstract search, multi-filter, sort, or advanced facets |
| Research detail | Partial | Adapt scalar response; detail GET mutates view count; category/authors/advisors must not be invented |
| Categories | Yes | Public list; admin-only creation |
| Login | Yes | Next Route Handler posts OAuth form; HttpOnly access-token cookie |
| Registration | Partial/risky | Send only intended safe role and fields; backend drops profile fields in service and trusts arbitrary role |
| Google login/register | No | Hide/disable and label blocked |
| Forgot/reset password | No | No working mutation; render informational blocked state only if page retained |
| Verify email/resend | No | No working mutation; do not claim verification |
| Role-selection welcome flow | No server workflow | Treat as navigation/UX only; never as authorization |
| Logout | No endpoint | Clear frontend cookie only |
| Session refresh | No | On expiry/401, clear session and require login |
| Current user/profile | No | Token cannot safely supply full frontend profile; no `/me` endpoint |
| Submit research | Yes, partial | Exact multipart fields; encode author/advisor ID arrays as JSON strings; validate files client/server-side |
| File constraints | No backend constraints | Frontend policy can improve UX but must not be represented as backend enforcement |
| Student “my submissions” dashboard | No list endpoint | Block dynamic list; creation response alone is insufficient persistent data source |
| Reviewer queue | No list endpoint | Block queue/dashboard data |
| Approve/reject | Yes, by known research ID | `advisor`/`admin`; send `comment_text` + unconstrained `status_result` |
| Request revision | Ambiguous | Model comment mentions `revision_needed`, but no enum/test; treat as contract risk until runtime/product confirmation |
| Review score/rubric | No | Remove/disable |
| Revisions/version upload | No | Models only; block UI actions |
| Favorites/bookmarks | Yes | Handle union-shaped toggle result; list returns IDs only, requiring detail calls (which increment views) |
| PDF download | Partial | Authenticated POST returns URL; subsequent static GET is not access-controlled and is not binary from the POST |
| Notifications | No | Decorative only or remove action |
| Citations/DOI/export citation | No | Static/decorative only; do not fabricate values/actions |
| Author/advisor/institution metadata | No usable response/lookup | Do not invent; submit IDs cannot be selected from backend APIs |

## Current frontend audit

The actual Next.js application is an untouched create-next-app placeholder. It contains no API client, route handlers, feature modules, domain types, mock APIs, mock datasets, authentication, or UniResearch pages. Its only hardcoded content is the Next.js/Vercel starter copy and links. All UniResearch UX currently exists as static Stitch reference HTML under `frontend/design/stitch/`, not executable application routes.

The Stitch exports contain static mock datasets and hardcoded display values across landing/discovery/detail/student/reviewer screens: research titles, authors, institutions/departments, years, categories, abstracts, keywords, status badges, submission-relative dates, view/download/citation-like counts, dashboard totals, “50k+” publications, and “120+” institutions. These are design fixtures and have no API binding.

Hardcoded/unsupported Stitch actions include `href="#"` navigation, no-op forms, Google auth, forgot password, email verification/resend, role selection as if it established identity, notifications, profile controls, advanced discovery filtering/sorting/pagination, citation/metadata actions, reviewer queue selection, scoring/rubrics, revision workflows, direct PDF download, and author/advisor selection without a user lookup API. Bookmarking, approval/rejection, login, registration, search, category selection, submission, and download have some backend support but their displayed shapes/actions require the adapters and caveats above.

Frontend-only fields shown or implied but absent from backend response contracts include category name/object, author/advisor names and profiles, institution, degree/program/faculty labels, language, DOI, publication date semantics (often null), citation count, tags/keyword arrays, file metadata/size/pages, review score/rubric, reviewer queue metadata, revision number/history/deadlines, notification state, user avatar/full profile, submission progress, and arbitrary dashboard aggregates.
