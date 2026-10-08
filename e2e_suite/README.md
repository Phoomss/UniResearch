# UniResearch Automated E2E & Integration Testing Suite

Automated End-to-End (E2E) and Integration Testing Suite using Python, Selenium, and pytest for the **UniResearch** system based on the Test Plan and Specifications assigned to **Sommai Kitikorn** (TC-002 through TC-048).

---

## 1. Project Structure (Page Object Model)

```
e2e_suite/
├── conftest.py                       # Pytest fixtures, WebDriver setup, teardown, base URLs, seed fixtures
├── pytest.ini                        # Pytest config, markers (ui, api, rbac, e2e, boundary), HTML report options
├── requirements.txt                  # selenium, pytest, pytest-html, requests, etc.
├── pages/                            # Page Objects (POM Pattern)
│   ├── base_page.py                  # Core POM: explicit wait helpers (WebDriverWait + EC)
│   ├── login_page.py                 # Login, Registration, Logout actions
│   ├── student_page.py               # Profile edit, research submission wizard, edit submission
│   ├── advisor_page.py               # Advisor review queue, review submission modal
│   └── admin_page.py                 # Admin dashboard, category creation, user CRUD modal
├── utils/                            # Helpers & Fixtures Setup
│   ├── api_client.py                 # Direct HTTP client with token handling and endpoints
│   ├── test_data.py                  # Standard fixtures (A1, S1-S3, D1-D2, G1, C1-C2, W1-W5)
│   └── file_helpers.py               # Generates valid mock PNG/PDF bytes and boundary files
└── tests/                            # Test Scripts corresponding to TC IDs
    ├── test_tc002_duplicate_register.py         # TC-002: Duplicate email registration
    ├── test_tc005_student_profile.py            # TC-005: Update profile & change password
    ├── test_tc008_admin_crud_users.py           # TC-008: Admin CRUD user management
    ├── test_tc011_non_admin_category.py         # TC-011: Non-admin create category forbidden
    ├── test_tc014_role_search_visibility.py     # TC-014: Role-based search visibility
    ├── test_tc017_home_latest_popular_stats.py  # TC-017: Homepage feeds & statistics
    ├── test_tc020_recommendations.py            # TC-020: Personalized recommendations
    ├── test_tc023_guest_submit_research.py      # TC-023: Guest submit forbidden
    ├── test_tc026_file_upload_boundary.py       # TC-026: File upload size limits (413 boundary)
    ├── test_tc029_edit_revert_pending.py        # TC-029: Edit research reverts status to pending
    ├── test_tc032_delete_research_cascade.py    # TC-032: Owner deletes research & cascades
    ├── test_tc035_download_negative.py          # TC-035: Download without token / missing file
    ├── test_tc038_advisor_approve_review.py     # TC-038: Assigned advisor approves research
    ├── test_tc040_review_notification.py        # TC-040: Notification dispatch on approval
    ├── test_tc041_admin_assign_advisor.py       # TC-041: Admin assigns advisor & RBAC check
    ├── test_tc044_ai_endpoints_validation.py    # TC-044: AI endpoints schema & token validation
    ├── test_tc047_e2e_submit_and_review.py      # TC-047: Full E2E student submit -> advisor approve
    └── test_tc048_e2e_admin_manage_and_rbac.py  # TC-048: Admin management & RBAC protection
```

---

## 2. Test Cases Covered (Sommai Kitikorn)

| TC ID | Test Case Name | Priority / Type | Test Script |
|:---|:---|:---|:---|
| **TC-002** | สมัคร email ซ้ำ | High / Negative / API | `tests/test_tc002_duplicate_register.py` |
| **TC-005** | ดู/แก้โปรไฟล์และเปลี่ยนรหัส | High / Positive / Web & API | `tests/test_tc005_student_profile.py` |
| **TC-008** | admin CRUD ผู้ใช้ | High / Positive / Web & API | `tests/test_tc008_admin_crud_users.py` |
| **TC-011** | ผู้ไม่ใช่ admin เพิ่มหมวดหมู่ | High / Negative / API/RBAC | `tests/test_tc011_non_admin_category.py` |
| **TC-014** | guest/student/admin ค้นงาน approved และ pending | High / Positive / Web/API/RBAC | `tests/test_tc014_role_search_visibility.py` |
| **TC-017** | latest/popular และสถิติ | Medium / Positive / Web & API | `tests/test_tc017_home_latest_popular_stats.py` |
| **TC-020** | ผู้ไม่ล็อกอิน/มี favorite ได้คำแนะนำ | Medium / Positive / API | `tests/test_tc020_recommendations.py` |
| **TC-023** | ไม่ล็อกอินหรือ role guest ส่งงาน | High / Negative / Web/API/RBAC | `tests/test_tc023_guest_submit_research.py` |
| **TC-026** | อัปโหลดชนิดถูกและทดสอบขนาดขอบเขต | High / Positive / Boundary | `tests/test_tc026_file_upload_boundary.py` |
| **TC-029** | ผู้มีสิทธิ์แก้แล้วกลับ pending | High / Positive / Web & API | `tests/test_tc029_edit_revert_pending.py` |
| **TC-032** | เจ้าของลบงานพร้อมข้อมูลสัมพันธ์ | High / Positive / Web & API | `tests/test_tc032_delete_research_cascade.py` |
| **TC-035** | ไม่มี token หรือไม่มีไฟล์ | Medium / Negative / API | `tests/test_tc035_download_negative.py` |
| **TC-038** | advisor ที่ได้รับมอบหมายอนุมัติ pending | High / Positive / Web & API | `tests/test_tc038_advisor_approve_review.py` |
| **TC-040** | อนุมัติพร้อมคะแนนและแจ้งผู้เกี่ยวข้อง | High / Positive / Integration | `tests/test_tc040_review_notification.py` |
| **TC-041** | admin เปลี่ยน advisor; student ถูกห้าม | High / Positive / API/RBAC | `tests/test_tc041_admin_assign_advisor.py` |
| **TC-044** | เรียกสี่ API ด้วย token และ schema ที่ถูก/ผิด | Medium / Positive / API/AI | `tests/test_tc044_ai_endpoints_validation.py` |
| **TC-047** | เว็บส่งงานแล้ว advisor ตรวจ | High / Positive / E2E | `tests/test_tc047_e2e_submit_and_review.py` |
| **TC-048** | เว็บ admin จัดการหมวดหมู่/ผู้ใช้ | Medium / Positive / E2E/RBAC | `tests/test_tc048_e2e_admin_manage_and_rbac.py` |

---

## 3. Installation & Prerequisites

1. **Python 3.9+** and Google Chrome installed.
2. Install Python dependencies:
   ```bash
   pip install -r e2e_suite/requirements.txt
   ```
3. Ensure the UniResearch application is running:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

---

## 4. Running the Tests

From the `e2e_suite` directory:

```bash
cd e2e_suite
```

### Run All Tests:
```bash
pytest
```

### Run UI/E2E Tests in Headless Mode:
```bash
pytest -m ui --headless=true
```

### Run UI/E2E Tests in Visible Browser Mode (Headed):
```bash
pytest -m ui --headless=false
```

### Run Pure API & RBAC Tests:
```bash
pytest -m "api or rbac"
```

### Run a Specific Test Case:
```bash
pytest tests/test_tc002_duplicate_register.py
pytest tests/test_tc047_e2e_submit_and_review.py --headless=false
```

### Generate HTML Test Report:
```bash
pytest --html=report.html --self-contained-html
```
