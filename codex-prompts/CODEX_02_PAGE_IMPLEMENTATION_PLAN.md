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