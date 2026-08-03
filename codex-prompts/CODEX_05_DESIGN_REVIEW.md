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