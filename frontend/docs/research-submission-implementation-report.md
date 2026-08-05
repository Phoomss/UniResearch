# Research submission implementation report

## 1. Executive summary

The authenticated research-submission route now provides a five-step, Thai-first workflow for the complete portion of the real backend contract: research metadata, an explicit people-data limitation, abstract and keywords, optional files, review/edit, and submission result. It submits one multipart request through the same-origin Next.js route handler to FastAPI. No backend file was edited and no production mock endpoint or fake success state was added.

Completed: contract-backed metadata entry, category selection, optional abstract/keywords, optional cover/document selection, review/edit navigation, final submission, success/error states, authentication forwarding, responsive styling, accessibility behavior, and frontend tests.

Partially completed: authors/advisors are represented as a dedicated workflow step, but selection is blocked by the absence of a safe backend user/advisor lookup API. Upload UI works, but the backend declares and enforces no MIME, extension, or size policy.

Blocked: truthful author/advisor selection, backend-verified cover/PDF restrictions, draft saving, and server-backed browser-history restoration.

Untested: real browser submission and responsive screenshots because disposable E2E credentials and seeded identifiers were not provided; Playwright collected six tests and skipped all six by fixture guards.

## 2. Repository areas inspected

- `frontend/DESIGN.md`, the Stitch `submit_research_uniresearch` HTML and screenshot, shared UI/shell components, global CSS, routes, API client/session/error utilities, feature modules, unit tests, Playwright tests/configuration, and `package.json`.
- Backend sources in the required order: `app/main.py`, research/category/auth routers and dependencies, research/user/category schemas, security/config, research service, research/user/category models, backend tests, and README.
- Existing research listing/detail/submission pages and dashboard routing conventions.

## 3. Backend contract discovered

- Endpoint: `POST /research/`.
- Encoding: one `multipart/form-data` request.
- Authentication: bearer JWT; `require_role(["admin", "student"])` and active-user checks are authoritative.
- Required form fields: `title_th: string`, `title_en: string`, `category_id: integer`.
- Optional fields: `abstract: string`, `department: string`, `work_type: string`, `academic_year: integer`, `keywords: string`.
- People fields: `author_ids` and `advisor_ids`, each a JSON-encoded array of integer user IDs, defaulting to `[]`. No lookup/list endpoint exists.
- Files: `cover_image` and `document`, both optional `UploadFile` values. The service writes either file without MIME, extension, size, or content validation. Therefore there is no truthful supported-type or maximum-size list.
- Success: HTTP 200 `ResearchWorkResponse`, including a usable integer `id`, `status` (model default `pending`), file paths, timestamps, counters, and submitted-user ID.
- Validation: FastAPI HTTP 422 detail arrays. Authentication produces 401; role failure produces 403. Creation has no explicit 404, 409, or 413 branch. Unhandled failures can produce 500. Infrastructure may produce 413 before FastAPI.

Runtime tests and backend source agree on the multipart endpoint and required core fields. The Stitch design conflicts with the backend by presenting English title as optional, named research-type choices, required year, people entry, upload expectations, and draft-saving UI; the backend contract takes precedence.

## 4. Pages or workflow steps implemented

1. Basic research information with both required titles, category, and optional department/work type/year.
2. Authors/advisor limitation panel explaining why IDs cannot be safely selected.
3. Optional abstract and keywords with an actual character counter and no invented limits.
4. Optional cover/document picker with drag/drop, keyboard activation, replacement, removal, filename, and size display.
5. Review of every supported value and edit links to each section.
6. Result state embedded after final submission, including detail, dashboard, and reset actions.

## 5. Routes added or modified

- Modified canonical page: `/student/research/new`.
- Existing legacy `/dashboard/student/submit` continues to redirect to the canonical page.
- Modified same-origin mutation route: `POST /api/research`.

## 6. Existing components reused

`DashboardShell`, `StatePanel`, `Button`, `Field`, `Input`, `Select`, and `Textarea` remain the UI primitives. The existing server API client, session-cookie helper, route-response adapter, normalized errors, categories API, and response DTO are reused.

## 7. Existing components modified

`SubmissionForm` was expanded from a one-page form into the contract-backed workflow. No shared component API was changed.

## 8. New components created

`FileDrop` is a focused local component for keyboard/click/drop selection and removal. It remains local because no other current route has a compatible upload workflow.

## 9. API endpoints integrated

- `GET /categories/` supplies real category choices.
- `POST /research/` creates the pending research record.

## 10. Request and multipart field mapping

The proxy forwards trimmed non-empty values for `title_th`, `title_en`, `category_id`, `abstract`, `department`, `work_type`, `academic_year`, and `keywords`; always supplies `author_ids="[]"` and `advisor_ids="[]"`; and conditionally forwards `cover_image` and `document`. It does not manually set `Content-Type`, so the runtime creates the multipart boundary. Filenames are sanitized and prefixed to reduce collisions without changing file content or MIME metadata.

## 11. Validation implemented

Client validation matches declared backend requirements: both titles and category are required; optional academic year must be integer text when present. Full validation runs before final submission. FastAPI validation issues are mapped back to known form fields. No unsupported title/abstract/keyword length, work-type enum, author count, MIME, extension, or file-size rule was invented.

## 12. File-upload behavior

Files stay in component memory and are sent only at final submission. The drop zones support pointer, keyboard, and drag/drop input; show name and size; and allow replacement/removal. No object URL is created. The UI states that the backend supplies no upload restriction policy and never claims an upload succeeded before the create response.

## 13. Authentication and permission handling

The server page redirects unauthenticated users to login with a safe return path. The route handler reads the secure HttpOnly session cookie and sends the backend bearer header server-to-server. Browser storage is not used. A 401 redirects back to login; a 403 preserves state and displays the backend role limitation.

## 14. Error handling

Required-field failures focus an alert summary. HTTP 422 issues are mapped where possible; 403, 413, other backend failures, malformed responses, and network failures have Thai messages. Recoverable errors preserve text and selected `File` references. The pending guard and disabled controls prevent duplicate clicks. Safe backend diagnostics are retained through the existing normalization layer.

## 15. Accessibility improvements

Persistent labels, required indicators, `aria-invalid`, alert/status regions, focus transfer to error/result summaries, labeled step navigation, keyboard-operable drop zones, visible focus styles, live character count, descriptive remove controls, and disabled-state communication were implemented. No dialog was introduced, so dialog focus restoration is not applicable.

## 16. Responsive behavior

The workflow uses the existing responsive dashboard shell. At narrow widths the five-step rail scrolls horizontally, form grids and review definition lists collapse to one column, buttons become full width, long names wrap, and the existing bottom Index Rail remains clear of content through dashboard padding. Static CSS/build verification passed; live desktop/tablet/mobile screenshots remain untested without an E2E environment.

## 17. Tests added or updated

- Contract tests now assert the five workflow steps, unload protection, duplicate-submit guard, accessible file interaction, 413 handling, exact people fields, and absence of invented upload limits or browser persistence.
- The real-backend Playwright submission scenario now navigates the multi-step form and expects the backend-derived success state and detail link.

## 18. Commands actually run

- `git -c safe.directory='D:/Project-69/UniResearch' status --short`
- `pnpm.cmd typecheck`
- `pnpm.cmd lint` (first attempt timed out at 120 seconds; rerun completed)
- `pnpm.cmd test`
- `pnpm.cmd build`
- `pnpm.cmd test:e2e`
- `$env:PYTHONDONTWRITEBYTECODE='1'; python -m pytest tests -v -p no:cacheprovider`

## 19. Tests that passed

- TypeScript: PASS.
- ESLint: PASS on completed rerun.
- Frontend unit/contract tests: PASS, 18/18.
- Production build: PASS, all routes compiled and page generation completed.
- Backend isolated test suite: PASS, 25/25, with 18 existing deprecation warnings.

## 20. Tests that failed

No completed test command failed. The initial lint process timed out without diagnostics and was successfully rerun.

## 21. Tests not run and reason

No real submission E2E body ran. `pnpm.cmd test:e2e` completed with 6 skipped because `E2E_STUDENT_EMAIL`, `E2E_STUDENT_PASSWORD`, `E2E_RESEARCH_ID`, advisor credentials, and admin credentials were absent. Consequently real-browser submission, upload transfer, unsaved-change prompt, keyboard traversal, and viewport behavior were not runtime-verified.

## 22. Backend limitations

- No user, student, or advisor list/search endpoint.
- No author/advisor relationship data in the create response.
- No declared people-count constraints.
- No upload MIME, extension, size, collision, malware, or safe-storage validation.
- Original filenames are used by the backend storage service; the frontend proxy mitigates collisions with a prefix but cannot make backend storage robust.
- No enum or option endpoint for `work_type`, department, or academic year.
- No validation lengths for titles, abstract, or keywords and keywords remain one string.
- No draft, update, revision-upload, or submission-resume endpoint.

## 23. Backend-blocked features

Author row addition/removal, advisor selection, student-ID/name entry, authoritative file restrictions, draft saving, and persisted multi-session/browser-back restoration are blocked. They are not presented as working.

## 24. Differences from the Stitch design

The implementation retains the warm paper, mulberry, periwinkle, editorial panel, Index Rail, folio stepper, and Thai-first hierarchy. It uses five steps rather than Stitch's six because category is part of the backend-backed basic metadata and has no separate payload phase. It omits the fake saved-draft indicator, prescribed work-type choices, optional-English-title claim, required-year claim, and invented author/advisor inputs. The UI uses existing shared shells/components instead of copying the Stitch HTML.

## 25. Known limitations

Form state is preserved while navigating workflow steps but not across a reload or a completed browser navigation; `File` objects are intentionally not persisted. Browser `beforeunload` warnings depend on browser policy. A backend response can still reject or mishandle files because it provides no explicit policy.

## 26. Recommended follow-up work

The backend team should define authenticated user/advisor lookup APIs, explicit relationship permissions, file type/size/content rules with collision-safe storage, structured keyword semantics, work-type/department options, and draft/update endpoints. Then add disposable seeded E2E fixtures and run desktop/tablet/mobile Playwright projects against the real test backend.

## 27. Files changed

- `frontend/src/features/research/submission-form.tsx`
- `frontend/app/api/research/route.ts`
- `frontend/app/student/research/new/page.tsx`
- `frontend/app/globals.css`
- `frontend/tests/api-contract.test.mjs`
- `frontend/e2e/p0-pages.spec.mjs`
- `frontend/docs/research-submission-implementation-report.md`

Pre-existing unrelated backend changes and frontend Playwright result artifacts were preserved and are not part of this implementation.
