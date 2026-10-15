import pytest
from pages.login_page import LoginPage
from utils.config import Config

@pytest.mark.tc_fe_003
def test_tc_fe_003_student_login_rbac(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    # Verify redirect to Student dashboard
    # Default nextPath is /account/saved as per auth-form.tsx
    assert login_page.wait_for_url_contains("/account/saved"), "Did not redirect to student dashboard"

@pytest.mark.tc_fe_004
def test_tc_fe_004_student_access_admin(driver):
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    # Wait for login to complete
    login_page.wait_for_url_contains("/account/saved")
    
    # Attempt to access /admin directly
    login_page.go_to("/admin")
    
    # Verify unauthorized access is blocked (expecting redirect or 403, but due to defect DEF-FE-003, this might fail)
    # If the app redirects to login or shows an error, it passes.
    # Otherwise, if it loads the admin page, it fails.
    assert not driver.current_url.endswith("/admin"), "Student was able to access /admin (RBAC defect)"
