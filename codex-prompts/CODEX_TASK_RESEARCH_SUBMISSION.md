# Codex Task: Implement the UniResearch Research Submission Workflow

## Role

Act as a senior full-stack engineer responsible for implementing, integrating, testing, and documenting the research submission workflow in the UniResearch project.

Work directly inside:

```text
D:\Project-69\UniResearch
```

Complete the implementation rather than only explaining what should be done.

Do not stop after producing an implementation plan. Continue through code changes, tests, build verification, and the final implementation report.

---

## Main Objective

Implement the complete frontend workflow for adding and submitting a research item.

The workflow must allow an authenticated user to:

1. Enter basic research information.
2. Add one or more authors.
3. Specify the research advisor.
4. Select the research type, academic year, department, and supported categories.
5. Enter the abstract and keywords.
6. Upload a cover image.
7. Upload the research PDF.
8. Review all entered information.
9. Return to previous steps to edit information.
10. Submit the research to the real backend.
11. See an appropriate success or error result.

This task is limited to the research submission workflow.

Do not redesign or reimplement the login, registration, or admin provisioning workflows unless a minimal compatibility adjustment is strictly required for the submission feature.

---

## Sources of Truth and Priority

Use the following priority when information conflicts:

1. Existing backend endpoints, schemas, models, validation rules, permissions, and error responses.
2. Existing frontend architecture and application conventions.
3. `frontend/DESIGN.md`.
4. Visual references in:

```text
D:\Project-69\UniResearch\frontend\design\stitch\submit_research_uniresearch
```

5. Existing reusable frontend components.
6. Safe implementation assumptions.

The backend is the authoritative source for:

* Endpoint paths
* HTTP methods
* Request schemas
* Response schemas
* Required fields
* Optional fields
* Field names
* Data types
* Enum values
* Multipart field names
* File restrictions
* Authentication requirements
* Role permissions
* Validation behavior
* Error response structures

Do not modify the backend merely to make it match the Stitch design.

Do not invent fields, endpoints, enum values, permissions, upload behavior, or successful draft-saving behavior.

---

## Mandatory Repository Inspection

Before editing code, inspect the repository thoroughly.

At minimum, inspect:

```text
frontend/DESIGN.md
frontend/design/stitch/submit_research_uniresearch
frontend/package.json
frontend/src
backend
```

Also locate and inspect:

* Existing frontend routing conventions
* Existing dashboard layouts
* Existing authentication and authorization handling
* Existing API client or HTTP utility
* Existing form libraries
* Existing validation libraries
* Existing state-management approach
* Existing reusable UI components
* Existing upload components
* Existing toast, alert, dialog, and error components
* Existing frontend tests
* Existing end-to-end test setup
* Backend research-related routes
* Backend request and response schemas
* Backend database models
* Backend upload configuration
* Backend authorization dependencies
* Existing research detail and research listing pages

Run `git status` before making changes.

Preserve unrelated uncommitted changes. Do not reset, overwrite, delete, or reformat unrelated work.

---

## Backend Contract Discovery

Before implementing the form, identify and document the actual backend contract for research submission.

Determine:

* The submission endpoint
* The HTTP method
* Whether the request is JSON, multipart, or a combination
* Whether all information is submitted once or through multiple endpoints
* Exact request field names
* Required and optional fields
* Author data structure
* Advisor data structure
* Category data structure
* Keyword data structure
* Academic year format
* Research type values
* Cover image multipart field name
* PDF multipart field name
* Supported image types
* Supported document types
* Maximum file sizes
* Authentication requirement
* Role or permission requirement
* Success response format
* Validation error format
* Error responses for 401, 403, 404, 409, 413, 422, and 500 when applicable

Search the backend implementation rather than guessing from frontend examples.

If no usable research submission endpoint exists, do not fake successful integration.

Instead:

1. Implement only the frontend portions that can be implemented truthfully.
2. Mark submission-dependent behavior as blocked.
3. Record the exact missing backend capability in the implementation report.
4. Do not display a false success state.

Do not change the backend as part of this task.

---

## Visual and Design Requirements

Use the existing UniResearch visual language.

The implementation must remain consistent with:

* Mulberry Library
* The Living Research Index
* Warm Paper Background
* Deep Mulberry
* Periwinkle
* Soft Apricot
* Kanit
* Plus Jakarta Sans
* Editorial Layout
* Research Archive Visual Language

Read all relevant screens inside:

```text
frontend/design/stitch/submit_research_uniresearch
```

Use those screens as visual references.

Use `frontend/DESIGN.md` as the design-system rulebook.

Do not introduce a separate design style.

Do not copy Stitch-generated code blindly. Translate the visual design into the existing frontend architecture and component system.

---

## Component Reuse

Search for existing components before creating new ones.

Prefer reusing or extending existing components such as:

* Button
* Field
* Input
* Select
* Textarea
* File Upload
* Status Badge
* Panel
* Card
* Step Indicator
* Form Error
* Alert
* Dialog
* Success State
* Dashboard Layout
* Loading State

Create a new component only when:

* No suitable component exists.
* Extending an existing component would create incorrect coupling.
* The new component is reusable and follows the current design system.

Avoid page-specific duplicated components when a shared component is appropriate.

Do not perform unrelated large-scale component refactoring.

---

## Required Workflow

Implement the workflow using the routing and state-management patterns already used by the project.

Do not invent a new architecture if an established pattern exists.

The workflow must contain the following logical steps.

### Step 1: Basic Research Information

Support only fields that are accepted by the backend.

Potential information includes:

* Thai research title
* English research title
* Research type
* Academic year
* Department or program
* Research category

Requirements:

* Use exact backend field names and values in API mapping.
* Clearly indicate required fields.
* Use persistent labels.
* Display Thai validation messages.
* Prevent continuation while required values are invalid.
* Preserve valid values when navigating between steps.
* Do not include decorative Stitch fields that have no backend mapping unless they are explicitly frontend-only and never submitted.

### Step 2: Authors and Advisor

Support:

* One or more research authors when allowed by the backend
* Student ID when supported
* First name and last name, or the exact backend-supported author structure
* Research advisor
* Adding authors
* Removing authors

Requirements:

* Enforce any backend limits on the number of authors.
* Do not allow removal below the minimum required number of authors.
* Use stable keys for dynamic author rows.
* Validate every author independently.
* Preserve entered values when adding or removing rows.
* Avoid using array indexes as React keys when a stable identifier can be used.
* Use the backend-supported advisor representation.
* Do not invent advisor fields.

### Step 3: Abstract and Keywords

Support:

* Abstract
* Keywords
* Character count
* Field validation

Requirements:

* Use backend-supported minimum and maximum lengths.
* Implement a character counter based on actual validation limits.
* Support the backend keyword structure.
* Normalize values only when compatible with the backend contract.
* Prevent empty or duplicate keywords when appropriate.
* Display Thai error messages.

### Step 4: File Upload

Support:

* Cover image
* Research PDF
* File picker
* Drag and drop
* File validation
* Selected file name
* Selected file size
* File replacement
* File removal
* Loading state
* Upload error state

Requirements:

* Use exact backend multipart field names.
* Use backend-supported MIME types and extensions.
* Enforce actual backend file-size limits.
* Do not rely only on the HTML `accept` attribute.
* Validate MIME type, extension, and size before submission where practical.
* Keep server validation as authoritative.
* Make the drop zone keyboard accessible.
* Do not automatically upload files before the final step unless the backend contract explicitly requires it.
* Revoke generated object URLs when no longer needed.
* Do not claim an upload succeeded before receiving backend confirmation.

### Step 5: Review Before Submission

Display all supported information entered by the user, including:

* Research details
* Authors
* Advisor
* Abstract
* Keywords
* Category
* Cover image
* PDF file information

Requirements:

* Provide an edit action for each logical section.
* Return the user to the correct step when editing.
* Preserve all entered values and selected files.
* Clearly distinguish missing optional information from missing required information.
* Disable final submission while data is invalid.
* Validate all steps again before creating the request.
* Show a clear submission summary without exposing raw internal IDs unnecessarily.

### Step 6: Submission Result

Support the following outcomes:

* Submission succeeded
* Required information is missing
* Client validation failed
* File validation failed
* Upload failed
* Network error
* Backend error
* Authentication expired
* User does not have permission to submit

After a successful submission, provide actions equivalent to:

* View research details
* Return to the main page or dashboard
* Submit another research item

Only show “View research details” when the backend success response provides a usable research ID or URL.

Use the route structure and navigation patterns already established in the application.

---

## Form State and Navigation

Implement reliable state handling across all steps.

Requirements:

* Preserve data when moving backward and forward.
* Validate the current step before continuing.
* Validate the entire form before submission.
* Avoid storing `File` objects in unsupported persistent browser storage.
* Do not expose sensitive data in URLs.
* Prevent accidental duplicate submissions.
* Disable relevant controls while submitting.
* Show a visible loading state during submission.
* Keep the current form state after a recoverable submission error.
* Move focus to the error summary or first invalid field after validation failure.
* Associate errors with inputs using accessible attributes.
* Provide keyboard-accessible navigation.
* Support browser back behavior safely where compatible with the current architecture.
* Warn before leaving the workflow when unsent changes exist.
* Do not warn after a successful submission or after an intentional reset.

If the backend accepts a single final request, gather the complete form data and submit only at the final step.

If the backend does not support draft saving, do not show a fake “draft saved” message.

---

## API Integration

Use the existing API client and authentication mechanism.

Do not create a separate HTTP stack unless no existing client exists.

Requirements:

* Use the application’s existing base URL configuration.
* Use the existing access-token or session mechanism.
* Do not hardcode credentials or secrets.
* Do not hardcode environment-specific production URLs.
* Correctly serialize JSON and multipart data.
* Do not manually set a multipart boundary.
* Map frontend state to the exact backend schema.
* Parse backend validation errors into field-level or form-level messages.
* Preserve backend error details when safe and useful.
* Avoid exposing raw internal server errors to users.
* Use Thai user-facing error messages.
* Log development diagnostics only using existing project conventions.

Suggested behavior:

* `401`: handle expired or missing authentication using the existing auth flow.
* `403`: show that the user has no permission to submit.
* `413`: show that an uploaded file exceeds the server limit.
* `422`: map validation errors to relevant fields where possible.
* `500`: show a recoverable general backend error.
* Network failure: show a retryable connection error without clearing form data.

Base the final behavior on actual backend responses.

---

## Responsive Requirements

Verify the complete workflow at:

* Desktop width
* Tablet width
* Mobile width

Requirements:

* No horizontal page overflow.
* Form controls remain usable on small screens.
* Step navigation remains understandable.
* Long research titles wrap correctly.
* Author rows remain editable on mobile.
* Upload controls remain accessible.
* Review sections remain readable.
* Sticky actions must not cover content.
* Touch targets must be appropriately sized.
* Error messages must not break the layout.

---

## Accessibility Requirements

At minimum, verify:

* Every form control has an accessible label.
* Required state is communicated.
* Error messages are programmatically associated with fields.
* Keyboard users can complete the workflow.
* Drag-and-drop upload areas can also be activated by keyboard.
* Dialogs have correct focus management.
* Focus is restored appropriately after closing dialogs.
* Dynamic author controls have descriptive accessible names.
* Loading and submission states are announced appropriately.
* Color is not the only method used to communicate errors or status.
* Visible focus indicators are preserved.

Use the project’s existing accessibility patterns where available.

---

## Testing Requirements

Add or update tests using the existing test framework.

Do not replace the project’s current testing stack.

Test the following scenarios where supported by the repository:

### Successful Flow

* Complete all required fields.
* Add the supported number of authors.
* Select or enter an advisor.
* Add an abstract and keywords.
* Select valid cover and PDF files.
* Review the information.
* Submit successfully.
* Verify the success actions.

### Validation

* Required fields are empty.
* Field values have an invalid format.
* Abstract exceeds or does not meet backend limits.
* Invalid keyword input.
* Invalid author data.
* Missing required file.
* Wrong cover-image type.
* Wrong document type.
* File exceeds the supported size.

### Dynamic Authors

* Add multiple authors.
* Remove an author.
* Preserve other author values.
* Prevent removal below the minimum.
* Display errors on the correct author row.

### API and Error Handling

Test or mock the frontend response handling for:

* 401
* 403
* 413 when applicable
* 422
* 500
* Network failure
* Successful backend response

Frontend tests may mock transport responses, but production code must not use mock data or mock endpoints.

### Interaction and Accessibility

* Back and Continue navigation
* Final submission protection
* Duplicate-click protection
* Unsaved-change confirmation
* Keyboard navigation
* Labels and accessible descriptions
* Focus handling after validation errors

### Responsive Behavior

Verify:

* Desktop
* Tablet
* Mobile

Use the existing end-to-end viewport configuration when available.

---

## Required Verification Commands

Inspect `frontend/package.json` before running commands.

Use the package manager already configured by the repository.

From the appropriate frontend directory, run all available scripts corresponding to:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Rules:

* Do not falsely report a command as passing if it was not run.
* If a script does not exist, report it as unavailable rather than inventing it.
* If a command fails because of an existing unrelated issue, identify that clearly.
* Fix issues introduced by this implementation.
* Do not hide errors by disabling type checking, lint rules, or tests.
* Do not remove tests merely to make the suite pass.
* Do not use broad ignore directives unless they are technically justified and narrowly scoped.
* Re-run relevant checks after fixes.

If the full test suite is impractical because of an environment dependency, run the largest reliable subset and document the exact limitation.

---

## Required Implementation Report

Create or update:

```text
frontend/docs/research-submission-implementation-report.md
```

The report must contain:

1. Executive summary
2. Repository areas inspected
3. Backend contract discovered
4. Pages or workflow steps implemented
5. Routes added or modified
6. Existing components reused
7. Existing components modified
8. New components created
9. API endpoints integrated
10. Request and multipart field mapping
11. Validation implemented
12. File-upload behavior
13. Authentication and permission handling
14. Error handling
15. Accessibility improvements
16. Responsive behavior
17. Tests added or updated
18. Commands actually run
19. Tests that passed
20. Tests that failed
21. Tests not run and the reason
22. Backend limitations
23. Backend-blocked features
24. Differences from the Stitch design
25. Known limitations
26. Recommended follow-up work
27. Files changed

The report must clearly separate:

* Completed functionality
* Partially completed functionality
* Blocked functionality
* Untested functionality

Do not describe blocked functionality as completed.

---

## Code Quality Requirements

Follow the existing project conventions for:

* TypeScript
* React
* Next.js
* File naming
* Imports
* API access
* Styling
* Components
* Form handling
* Validation
* Testing

Additional requirements:

* Avoid `any` unless strictly necessary and documented.
* Avoid duplicated schema definitions when existing generated or shared types are available.
* Avoid unsafe type assertions.
* Keep API mapping code explicit and testable.
* Separate backend DTO mapping from presentation components when practical.
* Keep components focused.
* Avoid unnecessary global state.
* Avoid unnecessary dependencies.
* Do not add a package when the project already has an equivalent solution.
* Do not expose secrets.
* Do not commit generated build output unless the repository already tracks it.
* Do not alter unrelated formatting across the repository.

---

## Safety and Scope Rules

Do not:

* Modify backend behavior to satisfy the UI.
* Add fake endpoints.
* Use mock data in production code.
* Display fake successful uploads.
* Display fake draft-saving success.
* Invent backend-supported fields.
* Invent category options.
* Invent advisor data.
* Invent permissions.
* Hardcode secrets.
* Delete unrelated code.
* Reset existing work.
* Rewrite unrelated pages.
* Perform a large unrelated refactor.
* Silence tests or lint failures without justification.

When something is unclear:

1. Inspect the relevant implementation.
2. Search for existing project patterns.
3. Make the safest compatible implementation decision.
4. Record the decision in the report.
5. Mark unsupported behavior as blocked.

Do not pause merely to ask the user a question that can be answered by inspecting the repository.

---

## Working Process

Execute the task in this order:

1. Check the repository status.
2. Inspect the frontend architecture.
3. Read `frontend/DESIGN.md`.
4. Inspect the Stitch visual references.
5. Inspect the backend research submission contract.
6. Inspect existing shared components.
7. Inspect existing tests and package scripts.
8. Create a concise implementation plan.
9. Implement the workflow incrementally.
10. Add validation and API mapping.
11. Add upload handling.
12. Add error and success states.
13. Add or update tests.
14. Run type checking.
15. Run linting.
16. Run tests.
17. Run the production build.
18. Run end-to-end tests where available.
19. Fix implementation-related failures.
20. Create the implementation report.
21. Review the complete Git diff.
22. Provide the final summary.

Do not end the task after step 8.

---

## Definition of Done

The task is complete only when:

* The research submission workflow is implemented as far as the real backend permits.
* All submitted fields match the backend contract.
* No production mock data is used.
* The design is consistent with Stitch and `DESIGN.md`.
* Existing components are reused where appropriate.
* Required validation is implemented.
* Upload constraints reflect the backend.
* Error states are handled.
* Duplicate submissions are prevented.
* The workflow is responsive.
* The workflow is keyboard accessible.
* Tests are added or updated.
* Available verification commands are run.
* The implementation report is created.
* Backend-blocked behavior is documented honestly.

---

## Final Response Format

After completing the work, provide a concise final response containing:

### Implemented

* Main workflow steps completed
* Routes created or changed
* Important components created or reused
* Backend endpoint integrated

### Verification

For every command, report the real result:

```text
typecheck: PASS / FAIL / NOT AVAILABLE
lint: PASS / FAIL / NOT AVAILABLE
test: PASS / FAIL / NOT AVAILABLE
build: PASS / FAIL / NOT AVAILABLE
test:e2e: PASS / FAIL / NOT AVAILABLE
```

### Limitations

* Backend-blocked functionality
* Tests not run
* Environment limitations
* Differences from Stitch

### Files

* List the main files created or modified.
* Confirm the report location:

```text
frontend/docs/research-submission-implementation-report.md
```

Do not claim success for work that was not completed or verified.
