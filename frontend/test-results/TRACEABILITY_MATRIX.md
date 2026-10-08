# Traceability Matrix

| Requirement / Module | Test Case ID | Selenium Test Function | Result | Defect / Note |
| :--- | :--- | :--- | :--- | :--- |
| Registration (Happy Path) | TC-FE-001 | `test_tc_fe_001_registration_happy_path` | BLOCKED/FAIL | Fails due to missing backend environment. Cannot complete API call. |
| Registration (Validation) | TC-FE-002 | `test_tc_fe_002_registration_client_validation` | PASS | Client-side validation works as expected. Fixed `ElementClickInterceptedException` in automation. |
| Authentication / Login | TC-FE-003 | `test_tc_fe_003_student_login_rbac` | BLOCKED/FAIL | Fails due to missing backend environment. Student login hangs. |
| RBAC (Admin Protection) | TC-FE-004 | `test_tc_fe_004_student_access_admin` | FAIL | UI renders `/admin` without throwing 403. Defect **DEF-FE-003** is still active. |
| Research Submission | TC-FE-005 | `test_tc_fe_005_research_submission_e2e` | BLOCKED/FAIL | Fails due to missing backend environment. Form dependencies (categories) fail to load. |
| Boundary Upload Size | TC-FE-006 | `test_tc_fe_006_oversized_file_validation` | BLOCKED/FAIL | Cannot reach form due to missing backend. |
| Accessibility (a11y) | TC-FE-007 | `test_tc_fe_007_accessibility_form_labels` | BLOCKED/FAIL | Cannot reach form due to missing backend. |
| Advisor Review Workflow | TC-FE-008 | `test_tc_fe_008_advisor_review_workflow` | BLOCKED/FAIL | Cannot retrieve pending research due to missing backend. |
| AI Writing Assistant | TC-FE-009 | `test_tc_fe_009_ai_writing_assistant` | BLOCKED/FAIL | Cannot reach form due to missing backend. |
| RAG Chatbot Timeout | TC-FE-010 | `test_tc_fe_010_rag_chatbot_timeout` | BLOCKED/FAIL | Cannot login as student to access chat without backend. |
