UniResearch Frontend Page Implementation Workflow

Use these prompts one phase at a time.

Do not execute every phase in one run.

The backend is strictly read-only throughout all phases.

PHASE 1 — Create the page implementation plan

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/backend-capability-map.md
frontend/docs/frontend-current-route-inventory.md
frontend/docs/frontend-page-gap-analysis.md
frontend/docs/frontend-route-plan.md
frontend/docs/frontend-page-test-plan.md
frontend/docs/unsupported-design-features.md
frontend/src/app/
frontend/src/components/
frontend/src/features/
frontend/src/lib/
frontend/design/stitch/ if present

Do not modify application code during this phase.

Objective

Create a detailed implementation plan for all remaining frontend pages that are supported by the existing backend.

The backend is immutable.

Never modify:

backend routes
backend schemas
backend services
backend models
backend tests
backend configuration
backend database
backend static files

Use the completed backend analysis as the source of truth.

Do not invent an endpoint because a button exists in the design.

Page selection

Classify all missing or incomplete pages into:

P0: required for the core user workflow
P1: required for complete system management
P2: optional or future enhancement
Blocked: visible in the design but not supported by the backend

For every page, determine:

Proposed route
User role
User goal
Backend endpoints
Authentication requirement
Required permission
Existing reusable components
New components required
Form fields
Loading state
Empty state
Error state
Success state
Responsive behavior
Required tests
Design references
Implementation dependencies
Design requirements

Read frontend/DESIGN.md completely.

Do not copy only colors from DESIGN.md.

Follow its complete design language, including:

Typography
Color tokens
Spacing
Layout grid
Container widths
Border radius
Elevation
Responsive behavior
Interaction states
Accessibility
Editorial composition
Research archive visual language

Inspect existing completed pages and reuse their visual patterns.

New pages must appear to belong to the same product.

Do not create a different dashboard style for each role.

Do not introduce:

New random colors
New font families
Generic SaaS card grids
Full-page gradients
Glassmorphism
Excessive shadows
Excessive pill components
Unnecessary animations
Duplicate design components
Required output

Create:

frontend/docs/page-implementation-plan.md

The document must contain:

Current implementation status
Remaining supported pages
Pages ordered by implementation priority
Page dependencies
Reusable component map
API endpoint map
Testing requirements
Blocked pages
Recommended implementation batches
Definition of done for each page

Also create:

frontend/docs/page-implementation-progress.md

Initial status values:

Not started
In progress
Implemented
Integrated
Tested
Blocked

Do not implement pages yet.

Confirm at the end that no backend file changed.

PHASE 2 — Implement supported P0 pages

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/page-implementation-plan.md
frontend/docs/page-implementation-progress.md
frontend/docs/backend-capability-map.md
frontend/docs/frontend-page-gap-analysis.md
frontend/docs/frontend-route-plan.md
frontend/docs/frontend-page-test-plan.md
frontend/docs/unsupported-design-features.md

Inspect the existing frontend before modifying files.

Objective

Implement all P0 pages that are explicitly marked as supported by the backend.

Modify frontend only.

Do not modify backend.

Do not implement blocked functionality.

Implementation order

Follow the order defined in:

frontend/docs/page-implementation-plan.md

Complete one page or one tightly related workflow at a time.

Suggested workflow order when supported:

Public research search
Research detail
Authentication
Student research list
Create research submission
Edit research submission
Submission detail and status
File revision history
Advisor review queue
Advisor review workspace

Do not keep this order when the analysis documents prove that a different dependency order is required.

Before implementing each page

For every route:

Verify the backend endpoint again
Verify request and response schemas
Verify authentication requirements
Verify required role
Inspect related backend tests
Inspect similar existing frontend pages
Identify reusable components
Identify missing UI states

Do not begin implementation when the endpoint contract is unknown.

Mark the page as blocked instead.

Design implementation

Use frontend/DESIGN.md as the primary design specification.

Use existing pages as implementation references for:

Header
Sidebar
Page title hierarchy
Breadcrumbs
Tabs
Filters
Tables
Forms
Status indicators
Research cards
Empty states
Error states
Dialogs
Responsive layout

Preserve the UniResearch design pattern.

Reuse existing components before creating new components.

When a reusable component does not yet support the required variant:

Extend the existing component
Keep backward compatibility
Add a documented variant
Test existing usages

Do not duplicate a component only to change spacing or color.

API integration

Use only verified backend endpoints.

Centralize API access under:

frontend/src/lib/api/
frontend/src/features/
frontend/src/app/api/

Do not write raw backend fetch calls directly inside presentation components.

Use adapters when the backend schema differs from the UI model.

Do not change the backend response.

Remove mock data only after the real API flow works.

Do not silently fall back to mock data when an API request fails.

Implement:

Loading state
Empty state
Validation state
Success state
Network error
400 response
401 response
403 response
404 response
409 response
422 response
500 response
Session expired state

Use understandable Thai messages while retaining the backend error code for debugging.

Authentication and authorization

Use the authentication behavior found during backend analysis.

Do not invent:

Google OAuth
Refresh tokens
Email verification
Password reset
Bookmark persistence
Notification persistence

Keep protected page checks on the server where practical.

The backend remains the authority for role and permission checks.

Frontend role checks are for navigation and user experience only.

Per-page verification

After completing each page:

Run lint for affected files
Run TypeScript checking
Run relevant unit tests
Run relevant integration tests
Test the page against the real backend test environment
Verify loading, empty, success, and error states
Verify desktop and mobile layouts
Verify keyboard navigation
Verify no backend file changed
Update frontend/docs/page-implementation-progress.md

Do not continue to the next page when the current page has unresolved TypeScript or build errors.

Required output

At the end of this phase:

Update frontend/docs/page-implementation-progress.md
Create frontend/docs/p0-implementation-report.md

The report must include:

Pages implemented
Routes created
Endpoints connected
Components reused
Components added
Tests executed
Tests passed
Tests failed
Remaining mock data
Blocked functionality
Known design differences
Confirmation that backend remained unchanged

Do not mark a page as tested unless tests were actually executed.

PHASE 3 — Implement supported P1 pages

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/page-implementation-plan.md
frontend/docs/page-implementation-progress.md
frontend/docs/p0-implementation-report.md
frontend/docs/backend-capability-map.md
frontend/docs/frontend-page-gap-analysis.md
Objective

Implement the remaining P1 pages supported by the backend.

Modify frontend only.

Do not modify backend.

Likely P1 areas may include:

Admin research management
Admin research detail
Dashboard statistics
Analytics
Review history
Category browsing
Category management
User management
Profile management
System status pages

Do not implement any item from this list unless backend support was verified.

Requirements

Follow the same requirements as Phase 2:

Verified endpoints only
Existing design system
Existing reusable components
Real API integration
No hidden mock fallback
Complete UI states
Responsive layouts
Accessibility
Tests
Backend read-only verification

Avoid creating multiple separate pages when tabs, sections, dialogs, or drawers provide a better workflow.

Examples:

Approval confirmation should be a dialog
Search filters should be part of the search page
Author management should be part of the submission workflow
PDF preview should be part of research detail or review workspace
Small status changes should not require a separate route
Required output

Update:

frontend/docs/page-implementation-progress.md

Create:

frontend/docs/p1-implementation-report.md

Include:

Pages implemented
API integrations
Role restrictions
Test results
Remaining pages
Blocked features
Backend support limitations
Confirmation that backend remained unchanged
PHASE 4 — Review and refine the design

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/page-implementation-plan.md
frontend/docs/page-implementation-progress.md
frontend/design/stitch/
All frontend routes
All shared frontend components

Run the frontend and inspect every completed page.

Objective

Review and refine the visual quality of the entire frontend without changing backend behavior or API contracts.

Modify frontend only.

Do not redesign the product from scratch.

Preserve the design identity defined in frontend/DESIGN.md.

Design review areas

Review each page for:

Visual consistency
Typography hierarchy
Thai font rendering
Text line height
Page width
Grid alignment
Spacing rhythm
Section spacing
Border radius
Border usage
Shadow usage
Color usage
Icon sizes
Status appearance
Button hierarchy
Form consistency
Table consistency
Card consistency
Product identity

Ensure every page preserves:

UniResearch identity
Mulberry Library design language
Living Research Index concept
Editorial academic character
Warm and credible visual tone
Consistent archive and research motifs

Remove generic AI-generated patterns.

Avoid turning every group of content into a rounded card.

Use typography, dividers, alignment, structured whitespace, and document-like metadata to create hierarchy.

Existing-page consistency

Compare newly created pages with completed reference pages.

Match:

Header height
Sidebar width
Page padding
Container width
Breadcrumb style
Page heading style
Form layout
Button sizing
Filter layout
Table density
Status badges
Loading states
Empty states
Error states

Do not change a shared pattern on one page without checking every page that uses it.

Responsive design

Inspect at approximately:

1440px
1024px
768px
390px

Verify:

No horizontal overflow
No clipped Thai text
No inaccessible controls
Tables have an appropriate mobile strategy
Filters have a mobile strategy
Sidebars transform correctly
Forms remain readable
Buttons remain reachable
Decorative elements do not obscure content
Accessibility

Verify:

Visible keyboard focus
Logical tab order
Persistent labels
Error associations
Sufficient contrast
Minimum target sizes
Screen-reader labels
Status does not depend on color alone
Reduced-motion support
Refactoring rules

You may:

Fix spacing
Improve responsive layouts
Refactor duplicated UI
Extend shared component variants
Correct inconsistent typography
Improve form usability
Add missing UI states
Improve accessibility
Align new pages with existing pages

You must not:

Change backend contracts
Change working business logic without evidence
Remove required fields
Rename API fields
Change role behavior
Introduce a new design system
Install a large UI library only to replace existing components
modify backend files
Visual verification

Create Playwright screenshots for major completed routes at desktop and mobile sizes.

Store generated test artifacts in the existing test output directory.

Do not commit unnecessary temporary screenshots unless the project policy requires them.

Required output

Create:

frontend/docs/design-review-report.md

Include:

Pages reviewed
Design inconsistencies found
Changes made
Shared components updated
Responsive issues fixed
Accessibility issues fixed
Remaining visual differences
Pages requiring manual review
Confirmation that backend remained unchanged

Update:

frontend/docs/page-implementation-progress.md

PHASE 5 — Targeted page adjustment prompt

Use this phase whenever a specific page needs additional adjustment.

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/backend-capability-map.md
frontend/docs/page-implementation-progress.md
The target page
Its parent layout
Related shared components
At least two visually related completed pages
Relevant Stitch references if present
Target

Page or route:

[TARGET_ROUTE]

Requested changes:

[DESCRIBE_REQUIRED_CHANGES]

Problem observed:

[DESCRIBE_CURRENT_PROBLEM]

Instructions

Before modifying code:

Inspect the target page
Inspect related completed pages
Identify the design pattern that should be reused
Verify whether the requested behavior requires backend support
Verify the existing endpoint contract
Explain briefly which frontend files need changes

Then implement the adjustment.

Modify frontend only.

Do not modify backend.

Preserve frontend/DESIGN.md.

Do not fix a local visual issue by introducing a conflicting global style.

Prefer shared components when the change applies to multiple pages.

Keep unrelated pages unchanged.

Verification

After the change:

Run lint
Run TypeScript checking
Run related unit tests
Run related integration tests
Run the target Playwright flow
Inspect desktop and mobile layouts
Verify no backend file changed

Update:

frontend/docs/page-implementation-progress.md

Add a short entry to:

frontend/docs/design-change-log.md

Include:

Date
Route
Problem
Change
Files changed
Tests executed
Result
Backend unchanged confirmation
PHASE 6 — Full project testing

Read:

AGENTS.md
frontend/docs/backend-capability-map.md
frontend/docs/page-implementation-progress.md
frontend/docs/frontend-page-test-plan.md
frontend/docs/p0-implementation-report.md
frontend/docs/p1-implementation-report.md
frontend/docs/design-review-report.md
frontend/package.json
backend/README.md
Existing backend tests
Objective

Run the complete available test suite using the real isolated backend testing environment.

Do not use production data.

Do not change backend code or backend tests.

Backend verification

Run the backend using the existing documented configuration.

Run the existing backend test suite.

Do not change backend dependencies to force tests to pass.

Record:

Command
Environment
Result
Passed count
Failed count
Skipped count
Frontend verification

Detect the package manager from the repository.

Run the available equivalents of:

Lint
TypeScript check
Unit tests
Component tests
API contract tests
Integration tests
Production build
Playwright end-to-end tests
Required user journeys

Test supported journeys only.

Guest
Open homepage
Search research
Apply filters
Open research detail
Preview or download a document
Student
Login
Open own research list
Create draft
Complete supported metadata
Add authors
Upload supported files
Submit
View status
Read feedback
Upload revision
Resubmit
Advisor
Login
Open review queue
Open submission
Preview PDF
Add comment
Add score when supported
Request revision or approve
View review history
Administrator
Login
Open dashboard
View statistics
Manage research
Use supported management functions
View supported analytics

Skip unsupported journeys and state the exact backend limitation.

Failure rules

Do not:

Change backend to make a frontend test pass
Mark an unexecuted test as passed
Hide failed tests
Replace a failing API with mock data
Delete a failing test without explanation
Test write operations against production data

For each failure, determine whether it is:

Frontend defect
Test defect
Environment problem
Backend contract mismatch
Unsupported capability
Non-deterministic test data

Fix frontend defects only.

Document all other failures.

Backend unchanged verification

Run:

git -C backend status --porcelain

git -C backend diff --exit-code

The backend must remain unchanged.

Required output

Create:

frontend/docs/full-test-report.md

Include:

Test date
Environment
Backend commit
Frontend commit
Commands executed
Backend test result
Frontend lint result
TypeScript result
Unit-test result
Contract-test result
Integration-test result
Build result
Playwright result
User journeys verified
Failures
Skipped tests
Blocked features
Screenshots or trace locations
Backend unchanged confirmation

Update:

frontend/docs/page-implementation-progress.md

PHASE 7 — Final project summary

Read all reports under frontend/docs/.

Inspect the final frontend route tree.

Do not modify application code in this phase unless a report contains a small documentation-only correction.

Objective

Create a final frontend implementation summary for the UniResearch project.

Create:

frontend/docs/frontend-final-summary.md

Required summary

Include:

1. Project overview
Frontend technology
Design system
Frontend architecture
Backend integration strategy
Testing strategy
2. Implemented pages

For each page:

Route
Role
Purpose
Implementation status
Backend integration status
Test status
3. Implemented functionality

Include:

Authentication
Search and filters
Research detail
Submission
File upload
File revisions
Review workflow
Dashboard
Analytics
Administration

Include only functionality actually implemented.

4. Design implementation

Summarize:

DESIGN.md usage
Reusable components
Responsive behavior
Accessibility
Stitch design differences
Design refinements made
5. Backend integration

Summarize:

Endpoint coverage
Authentication behavior
Role handling
Error handling
File handling
Adapter usage
Unsupported backend capabilities
6. Testing

Summarize:

Backend tests
Frontend lint
TypeScript
Unit tests
Integration tests
Contract tests
Production build
Playwright tests

Do not report an unexecuted test as passing.

7. Remaining work

Separate into:

Frontend work
Backend-blocked work
Optional enhancements
Manual verification
Deployment preparation
8. Known limitations

State all known limitations clearly.

9. How to run

Include verified commands for:

Backend
Frontend development
Frontend build
Unit tests
End-to-end tests
10. Final status

Report:

Total routes
Completed routes
Partially completed routes
Blocked routes
API-integrated routes
Tested routes
Remaining mock data
Backend unchanged confirmation

Do not claim the project is complete if required pages or tests remain unresolved.