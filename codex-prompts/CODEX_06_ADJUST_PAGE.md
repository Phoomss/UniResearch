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