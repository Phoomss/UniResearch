import pytest
import time
from pages.login_page import LoginPage
from pages.profile_page import ProfilePage
from utils.config import Config

@pytest.mark.tc_003
def test_tc003_student_valid_login(driver):
    """TC-003: ล็อกอินข้อมูลถูกต้อง ด้วยบัญชี Student"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    # Assert redirect to student saved works / dashboard
    assert login_page.wait_for_redirect("/account/saved", timeout=15), "Did not redirect to /account/saved after login"
    assert "/account/saved" in driver.current_url, f"Expected /account/saved in URL but got {driver.current_url}"

@pytest.mark.tc_005
def test_tc005_view_edit_profile_and_password(driver):
    """TC-005: ดู/แก้โปรไฟล์และเปลี่ยนรหัสผ่าน"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    profile_page = ProfilePage(driver)
    profile_page.load()
    profile_page.wait_for_form_ready()
    
    # Update profile fields and password
    new_first_name = "นักศึกษา"
    new_last_name = "ทดสอบระบบ"
    profile_page.update_profile(
        first_name=new_first_name,
        last_name=new_last_name,
        new_password=Config.STUDENT_PASSWORD,
        confirm_password=Config.STUDENT_PASSWORD
    )
    
    # Verify success toast appears
    toast_elem = profile_page.wait_for_success(timeout=10)
    assert toast_elem is not None, "Profile update success toast was not displayed"
    assert "อัปเดตข้อมูลส่วนตัวสำเร็จ" in toast_elem.text, f"Unexpected toast text: {toast_elem.text}"
