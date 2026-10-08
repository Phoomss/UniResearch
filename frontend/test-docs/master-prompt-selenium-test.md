# MASTER PROMPT — UniResearch Frontend Selenium E2E Automation

You are operating as a **Senior QA Automation Engineer + Senior Frontend Engineer + Test Architect**.

Your mission is to inspect the existing **UniResearch Frontend project**, understand its actual implementation, compare it against the provided QA documentation, create a maintainable **Python + Selenium E2E automation test suite**, execute the tests against the real application, debug failures, and produce a complete test execution report.

Do NOT blindly generate tests from the documentation alone.

You MUST inspect the actual source code, routing, components, forms, selectors, API integration, authentication/session mechanism, RBAC implementation, file-upload implementation, chatbot behavior, and existing test infrastructure before writing automation.

---

## 1. PROJECT CONTEXT

Project:

**UniResearch — University Thesis, Research, and Project Repository**

Frontend technology is expected to be based on:

* Next.js
* React
* TypeScript
* React Hook Form
* Zod
* Axios / BFF API integration
* RBAC
* Authentication/session management
* AI-related UI
* Research submission workflow

The project should be inspected from:

```text
/Users/technology06/674259024/UniResearch/frontend
```

QA documentation is located at:

```text
/Users/technology06/674259024/UniResearch/frontend/test-docs
```

You MUST inspect all relevant files under:

```text
frontend/test-docs
```

including Test Plan, Test Case Specification, supporting fixtures, documentation, and any related configuration.

The uploaded QA documents are authoritative references for expected testing scope and scenarios.

---

# 2. PRIMARY OBJECTIVE

Build a production-quality Selenium automation framework using:

```text
Python
Selenium WebDriver
pytest
```

The automation code MUST live inside:

```text
/Users/technology06/674259024/UniResearch/frontend
```

Prefer a dedicated structure such as:

```text
frontend/
├── selenium_tests/
│   ├── tests/
│   ├── pages/
│   ├── fixtures/
│   ├── utils/
│   ├── config/
│   ├── conftest.py
│   ├── requirements.txt
│   └── README.md
├── test-results/
└── ...
```

Adapt the structure if the existing project has an established testing convention.

DO NOT unnecessarily modify the application architecture.

---

# 3. IMPORTANT — FIRST INSPECT, THEN IMPLEMENT

Before creating any test:

### Step 1 — Inspect the project

Analyze:

* package.json
* pnpm/npm/yarn configuration
* Next.js configuration
* environment files
* routing structure
* app router / pages router
* authentication implementation
* middleware.ts
* RBAC logic
* API/BFF endpoints
* Axios configuration
* React Hook Form usage
* Zod schemas
* UI component library
* form components
* file upload components
* chatbot components
* AI writing assistant
* dashboard pages
* research submission pages
* admin pages
* advisor/reviewer pages
* existing tests
* existing test IDs
* existing accessibility attributes
* existing selectors

Search the codebase rather than assuming names.

For example, discover actual:

```text
routes
buttons
labels
inputs
data-testid
aria-label
form names
API endpoints
role names
authentication tokens
cookies
localStorage/sessionStorage usage
```

Do not invent selectors when a reliable selector already exists.

---

# 4. READ AND MAP THE TEST DOCUMENTATION

Read and analyze the documents under:

```text
frontend/test-docs
```

Create an internal mapping:

```text
Test Case ID
→ Feature
→ Route
→ User Role
→ Preconditions
→ Test Data
→ UI elements
→ API behavior
→ Expected result
→ Automation strategy
```

The QA specification contains scenarios including:

* TC-FE-001 — Registration happy path
* TC-FE-002 — Registration client-side validation
* TC-FE-003 — Student login + RBAC dashboard redirect
* TC-FE-004 — Student attempting to access /admin
* TC-FE-005 — Research submission with file upload
* TC-FE-006 — Oversized file validation
* TC-FE-007 — Accessibility / getByLabel-style form accessibility
* TC-FE-008 — Advisor review workflow
* TC-FE-009 — AI Writing Assistant
* TC-FE-010 — RAG Chatbot timeout/fallback

The exact implementation must follow the source documentation and actual frontend behavior.

---

# 5. IMPORTANT DOCUMENTATION CONFLICT RULE

If the Master Test Plan and Test Case Specification contain different TC-ID mappings or slightly different descriptions:

DO NOT silently choose one.

Record the discrepancy in:

```text
test-results/test-plan-discrepancies.md
```

Example:

```text
TC-FE-001

Master Test Plan:
...

Frontend Test Case Specification:
...

Observed implementation:
...

Decision:
...
```

Then implement the most appropriate test coverage while preserving traceability.

---

# 6. TEST AUTOMATION ARCHITECTURE

Use a maintainable Page Object Model.

Preferred structure:

```text
selenium_tests/
│
├── tests/
│   ├── test_authentication.py
│   ├── test_registration.py
│   ├── test_rbac.py
│   ├── test_research_submission.py
│   ├── test_file_upload.py
│   ├── test_accessibility.py
│   ├── test_advisor_review.py
│   ├── test_ai_assistant.py
│   └── test_chatbot.py
│
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   ├── register_page.py
│   ├── student_dashboard_page.py
│   ├── research_submission_page.py
│   ├── research_list_page.py
│   ├── advisor_review_page.py
│   ├── admin_page.py
│   └── chatbot_component.py
│
├── fixtures/
│   ├── users.py
│   ├── research_data.py
│   └── files/
│
├── utils/
│   ├── config.py
│   ├── waits.py
│   ├── screenshots.py
│   └── logging_utils.py
│
├── conftest.py
├── pytest.ini
├── requirements.txt
└── README.md
```

Adapt this to the actual project.

Avoid overengineering.

---

# 7. SELENIUM REQUIREMENTS

Use modern Selenium practices.

Prefer:

```python
WebDriverWait
expected_conditions
By
```

Avoid:

```python
time.sleep()
```

unless absolutely unavoidable.

Do NOT create brittle tests based on:

* CSS nth-child selectors
* generated React class names
* random DOM hierarchy
* fragile XPath
* pixel coordinates

Prefer selectors in this order:

1. `data-testid`
2. `id`
3. accessible label
4. name
5. semantic role / accessible attributes
6. stable text
7. robust CSS
8. XPath only when necessary

If the frontend lacks stable selectors, document the problem and add minimal testability attributes only where appropriate.

---

# 8. TEST DATA MANAGEMENT

Do not hardcode sensitive credentials directly into source code.

Use environment variables such as:

```text
BASE_URL
STUDENT_EMAIL
STUDENT_PASSWORD
ADVISOR_EMAIL
ADVISOR_PASSWORD
ADMIN_EMAIL
ADMIN_PASSWORD
```

Support:

```text
.env
.env.test
```

if appropriate.

Provide:

```text
.env.example
```

with placeholders.

Never expose real secrets in:

* test source
* logs
* screenshots
* reports
* Git commits

---

# 9. TEST CASE IMPLEMENTATION

Implement automation coverage for all applicable documented test cases.

## TC-FE-001 — Registration Happy Path

Verify:

1. Navigate to `/register`
2. Fill:

   * first name
   * last name
   * email
   * password
3. Submit registration
4. Verify loading state
5. Verify successful API interaction
6. Verify redirect to `/login`
7. Verify success toast/notification

Do not assume exact text if the actual application differs.

Use the actual implementation discovered in the source code.

---

## TC-FE-002 — Registration Client Validation

Verify:

1. Open `/register`
2. Submit empty form
3. Verify required validation messages
4. Enter invalid email such as:

```text
test@test
```

5. Submit
6. Verify validation error
7. Verify API request is NOT sent

If network interception is needed, implement appropriate Selenium-compatible monitoring or application-level verification.

---

## TC-FE-003 — Student Login + RBAC

Verify:

1. Open `/login`
2. Login using Student test account
3. Verify authentication succeeds
4. Verify session/token state
5. Verify redirect to Student dashboard
6. Verify Student-specific UI

Do not assume route names. Confirm them from the actual frontend.

---

## TC-FE-004 — Student Access to `/admin`

Using a Student account:

1. Login
2. Navigate directly to `/admin`
3. Also test a relevant nested `/admin/...` route if available
4. Verify unauthorized access is blocked
5. Verify redirect or 403 behavior
6. Verify Admin UI does not flash/render before authorization

Specifically investigate:

```text
middleware.ts
Next.js middleware
HOC
route guards
RBAC implementation
```

The test should detect possible FOUC/security-related UI exposure.

---

# 10. RESEARCH SUBMISSION E2E

Implement the complete student workflow.

Example:

```text
Login
→ Student Dashboard
→ New Research
→ Fill Thai title
→ Fill English title
→ Fill Thai abstract
→ Fill English abstract
→ Add co-authors
→ Select advisor
→ Upload cover image
→ Upload PDF
→ Submit
→ Wait for upload
→ Verify redirect
→ Verify submitted research
→ Verify Pending status
```

Verify loading/progress UI during upload.

Use realistic fixture files.

Create test fixtures if necessary:

```text
fixtures/files/
├── valid-cover.jpg
├── valid-research.pdf
├── oversized.pdf
└── invalid-file.txt
```

Do NOT generate unnecessarily huge files if a client-side size validation mechanism can be tested safely and deterministically.

---

# 11. FILE SIZE BOUNDARY TEST

Implement the documented oversized-file scenario.

Example:

```text
26 MB PDF
```

or the exact limit discovered from the implementation.

Verify:

1. User selects oversized file
2. UI immediately rejects it
3. Correct validation message appears
4. Upload request is NOT initiated

The documented expected behavior is equivalent to:

```text
"ขนาดไฟล์เกินที่กำหนด"
```

or the actual equivalent implemented by the application.

Do not hardcode Thai text if the real application uses a different localization string. Assert semantically or use the actual UI text.

---

# 12. ACCESSIBILITY TESTING

Implement Selenium-based accessibility-oriented checks.

Verify that important form fields have correctly associated labels.

At minimum inspect fields corresponding to:

```text
Thai title
Reviewer comment
```

Verify:

```html
<label for="...">
<input id="...">
```

association.

Use Selenium to inspect:

```python
element.get_attribute("id")
```

and the corresponding label relationship.

If an accessibility testing package can be safely integrated, consider:

```text
axe-core
```

but do not add unnecessary dependencies if a focused DOM-level test is sufficient.

Also verify keyboard-accessible interaction where practical.

---

# 13. ADVISOR REVIEW WORKFLOW

Using Advisor credentials:

1. Login
2. Navigate to pending research
3. Open research detail
4. Download/open research file if supported
5. Enter review comment
6. Select Approved
7. Submit review
8. Verify confirmation modal if present
9. Verify API success
10. Verify UI status becomes:

```text
Approved
```

Use actual application terminology if different.

---

# 14. AI WRITING ASSISTANT

Locate the actual AI Writing Assistant implementation.

Test:

```text
Research Submission
→ Enter research title
→ Click AI Auto-generate Abstract
→ Verify loading/thinking state
→ Wait for response
→ Verify generated content appears in Abstract field
```

Use the documented test title:

```text
การประยุกต์ใช้ AI ในเกษตรกรรม
```

Do not assert an exact generated paragraph.

Instead verify:

* response completes
* abstract field receives non-empty content
* UI does not crash
* loading state disappears

If the real API requires external credentials or cannot safely be called during automation, create a deterministic test strategy and clearly document it.

---

# 15. RAG CHATBOT TIMEOUT / FALLBACK

Test the chatbot timeout behavior.

The requirement is:

```text
Chatbot must not crash.
A polite fallback message must be displayed when the AI request times out.
```

Preferred strategy:

* identify the actual chatbot API endpoint
* use Selenium-compatible network conditions if possible
* otherwise use an appropriate deterministic test environment mechanism
* do NOT introduce arbitrary delays
* do NOT make tests dependent on real AI response timing

Verify:

```text
Chat UI remains functional
+
loading state appears
+
timeout/failure occurs
+
fallback message appears
+
page does not crash
```

The documented fallback behavior is conceptually:

```text
"ขณะนี้ระบบ AI ทำงานล่าช้า กรุณาลองใหม่อีกครั้ง"
```

Assert the application's actual equivalent.

---

# 16. REAL E2E TESTING

This is NOT a mock-only exercise.

You MUST attempt to run the tests against the actual frontend.

Before execution:

1. Detect how the application is started.
2. Detect package manager.
3. Start the Next.js frontend if it is not already running.
4. Detect the correct port.
5. Set `BASE_URL`.
6. Wait until the application is ready.
7. Run Selenium tests.

For example:

```bash
pytest -v
```

or:

```bash
pytest -v --tb=short
```

Use the appropriate command based on the actual project.

---

# 17. FAILURE DEBUGGING LOOP

Do not stop at the first test failure.

For every failure:

1. Read traceback.
2. Identify root cause.
3. Determine whether failure is:

   * automation bug
   * selector bug
   * environment issue
   * fixture issue
   * frontend defect
   * backend dependency
   * authentication issue
   * timing issue
   * actual requirement violation
4. Fix the appropriate layer.
5. Re-run the failed test.
6. Re-run related tests.
7. Eventually run the full suite.

Never hide failures by weakening assertions.

Never change expected behavior simply to make a test pass.

---

# 18. DEFECT CLASSIFICATION

Classify defects as:

```text
Critical
High
Medium
Low
Blocked
Environment
Automation Defect
```

For each actual frontend defect record:

```text
Defect ID
Test Case ID
Severity
Route
Steps to reproduce
Expected
Actual
Evidence
Likely root cause
Recommended fix
```

Store results under:

```text
test-results/
```

---

# 19. SCREENSHOTS AND EVIDENCE

For failed tests automatically capture:

```text
screenshot
URL
test name
timestamp
```

Prefer:

```text
test-results/screenshots/
```

Use descriptive filenames such as:

```text
TC-FE-004_admin_access_denied_failure.png
```

Do not capture or store passwords/tokens.

---

# 20. TEST REPORT

Generate a final report:

```text
test-results/TEST_EXECUTION_REPORT.md
```

Include:

## Executive Summary

* total tests
* passed
* failed
* skipped
* blocked
* pass rate

## Test Case Matrix

Example:

| TC-ID     | Scenario     | Result | Evidence | Defect |
| --------- | ------------ | ------ | -------- | ------ |
| TC-FE-001 | Registration | PASS   | ...      | -      |
| TC-FE-002 | Validation   | PASS   | ...      | -      |

## Environment

Include:

```text
OS
Python
Selenium
pytest
Browser
Browser version
Node
Next.js
Base URL
```

## Defects

List all discovered defects.

## Recommendations

Prioritize:

```text
Critical
High
Medium
Low
```

---

# 21. TRACEABILITY MATRIX

Generate:

```text
test-results/TRACEABILITY_MATRIX.md
```

Map:

```text
Requirement
→ Test Case
→ Selenium Test
→ Result
→ Defect
```

No documented test case should silently disappear.

---

# 22. MASTER TEST SUMMARY

Generate:

```text
test-results/MASTER_TEST_SUMMARY.md
```

Include:

### Coverage

```text
Authentication
RBAC
Research Submission
File Upload
Accessibility
Advisor Review
AI Assistant
RAG Chatbot
```

### Automation Coverage

Show:

```text
Automated
Partially Automated
Blocked
Not Automatable
```

Explain why.

---

# 23. EXIT CRITERIA

Follow the Master Test Plan.

The target exit criteria include:

```text
High & Critical test cases = 100% PASS
No open High severity defects
No ESLint errors/warnings
```

The documentation explicitly identifies concerns around:

```text
DEF-FE-001
UI component label/input ID association

DEF-FE-002
ESLint errors/warnings

DEF-FE-003
Admin route RBAC protection / Middleware
```

Investigate whether these defects still exist in the current codebase.

Do NOT assume the historical defects are still present.

Verify them.

---

# 24. ESLINT / CODE QUALITY

Before finalizing:

Inspect and run the project's actual lint command.

For example:

```bash
pnpm lint
```

or the equivalent detected from package.json.

Record:

```text
errors
warnings
status
```

Do not modify application code simply to satisfy tests unless the defect is genuinely required to fix the frontend behavior.

If a frontend fix is necessary, document exactly what changed and why.

---

# 25. TEST QUALITY REQUIREMENTS

Tests must be:

* deterministic
* readable
* maintainable
* independently executable where practical
* isolated where practical
* explicit about preconditions
* robust against normal rendering delays
* free of arbitrary sleeps
* safe with credentials
* traceable to test case IDs

Every test should have a clear identifier, e.g.:

```python
@pytest.mark.tc_fe_001
def test_tc_fe_001_registration_happy_path():
    ...
```

Add pytest markers if appropriate.

---

# 26. DO NOT CHEAT

Do NOT:

* fake successful results
* mark failed tests as passed
* remove assertions to avoid failures
* skip tests without documenting why
* replace real E2E with mocked unit tests
* hardcode a fake DOM
* modify production behavior only to satisfy automation
* ignore documented test cases
* assume a feature exists without inspecting it
* invent credentials
* invent routes
* invent API endpoints

If a test cannot be executed, mark it:

```text
BLOCKED
```

and explain the exact blocker.

---

# 27. FINAL EXECUTION

After implementation:

Run:

```text
1. Static inspection
2. Lint
3. Selenium smoke tests
4. Full Selenium E2E suite
5. Re-run failed tests after fixes
6. Full regression run
```

Do not declare success until the full suite has actually been executed.

---

# 28. FINAL RESPONSE FORMAT

At the end, provide a concise but technically detailed summary:

```text
========================================
UniResearch Frontend E2E Test Summary
========================================

Test Framework:
Python + Selenium + pytest

Total:
Passed:
Failed:
Skipped:
Blocked:
Pass Rate:

High/Critical:
Passed:
Failed:

ESLint:
Status:

Major Defects:
- ...

Files Created:
- ...

Files Modified:
- ...

Reports:
- ...

Overall Assessment:
PASS / CONDITIONAL PASS / FAIL
```

Then explain:

1. What was implemented
2. What was tested
3. What passed
4. What failed
5. What defects were found
6. What remains blocked
7. What should be fixed next

---

# 29. MOST IMPORTANT OPERATING PRINCIPLE

Act as a **real senior QA engineer working on a real production codebase**.

Do not optimize for "making the test suite green."

Optimize for:

```text
Correctness
+
Real User Behavior
+
Requirement Traceability
+
Reliable Automation
+
Defect Detection
+
Reproducible Evidence
```

When the frontend violates the test specification, the correct outcome is to report the defect — not to weaken the test.

When the test specification conflicts with the implementation, investigate and document the discrepancy.

When the environment prevents execution, report the blocker honestly.

The final result must allow another engineer to clone/open the UniResearch frontend project and understand:

```text
What was tested
What was automated
What passed
What failed
Why it failed
What must be fixed
```

Start by inspecting the project and all files under:

```text
/Users/technology06/674259024/UniResearch/frontend/test-docs
```

Then inspect the frontend implementation.

Only after understanding both should you begin writing the Selenium automation.

BEGIN.
