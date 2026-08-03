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