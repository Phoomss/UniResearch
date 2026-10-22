# -*- coding: utf-8 -*-
import pytest
import time
import requests
from pages.login_page import LoginPage
from pages.profile_page import ProfilePage
from pages.base_page import BasePage
from utils.config import Config

@pytest.mark.tc_001
def test_tc_001_student_valid_login(driver):
    """TC-001 (Ref: Master TC-003 | FR-002): การเข้าสู่ระบบสำเร็จด้วยบัญชีนักศึกษาที่มีสถานะปกติผ่านหน้าเว็บไซต์ (/login)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    
    # Assert redirect to /account/saved works
    assert login_page.wait_for_redirect("/account/saved", timeout=15), "Did not redirect to /account/saved after login"
    assert "/account/saved" in driver.current_url, f"Expected /account/saved in URL but got {driver.current_url}"

@pytest.mark.tc_002
def test_tc_002_session_verification_and_persistence(driver):
    """TC-002 (Ref: Master TC-003 | FR-002): การคงสถานะเข้าสู่ระบบและตรวจสอบข้อมูลผู้ใช้งานปัจจุบันหลังล็อกอินสำเร็จ (/account/saved & Session Verification)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    assert login_page.wait_for_redirect("/account/saved", timeout=15), "Login failed"
    
    # Check session cookie exists
    cookies = driver.get_cookies()
    cookie_names = [c["name"] for c in cookies]
    assert any("session" in name.lower() or "auth" in name.lower() or "token" in name.lower() for name in cookie_names), f"No session cookie found: {cookie_names}"
    
    # Refresh page and verify still on /account/saved
    driver.refresh()
    base_page = BasePage(driver)
    base_page.wait_for_form_ready()
    assert "/account/saved" in driver.current_url, f"Session lost after refresh: {driver.current_url}"

@pytest.mark.tc_003
def test_tc_003_view_student_profile(driver):
    """TC-003 (Ref: Master TC-005 | FR-003): การเปิดดูข้อมูลส่วนตัวปัจจุบันในหน้าโปรไฟล์นักศึกษา (/student/profile)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    profile_page = ProfilePage(driver)
    profile_page.load()
    profile_page.wait_for_form_ready()
    
    # Verify current student information
    first_name = profile_page.get_first_name()
    last_name = profile_page.get_last_name()
    email = profile_page.get_email()
    student_id = profile_page.get_student_id()
    
    assert "ธนภัทร" in first_name, f"Expected first name 'ธนภัทร', got: {first_name}"
    assert "สุวรรณโชติ" in last_name, f"Expected last name 'สุวรรณโชติ', got: {last_name}"
    assert Config.STUDENT_EMAIL == email, f"Expected email {Config.STUDENT_EMAIL}, got: {email}"
    assert Config.STUDENT_ID in student_id, f"Expected student ID {Config.STUDENT_ID}, got: {student_id}"

@pytest.mark.tc_004
def test_tc_004_edit_name_and_department(driver):
    """TC-004 (Ref: Master TC-005 | FR-003): การแก้ไขชื่อ-นามสกุลและเปลี่ยนภาควิชาในหน้าโปรไฟล์นักศึกษา (/student/profile)"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    profile_page = ProfilePage(driver)
    profile_page.load()
    profile_page.wait_for_form_ready()
    
    try:
        # Edit last name and department
        new_last_name = "สุวรรณโชติกุล"
        new_dept = "วิทยาการคอมพิวเตอร์"
        profile_page.update_profile(
            last_name=new_last_name,
            department=new_dept
        )
        
        # Verify success toast
        toast_elem = profile_page.wait_for_success(timeout=10)
        assert toast_elem is not None, "Profile update success toast was not displayed"
        assert "อัปเดตข้อมูลส่วนตัวสำเร็จ" in toast_elem.text, f"Unexpected toast text: {toast_elem.text}"
        
        # Refresh and verify persisted values
        time.sleep(1)
        driver.refresh()
        profile_page.wait_for_form_ready()
        assert profile_page.get_last_name() == new_last_name, f"Last name was not updated"
        assert profile_page.get_department() == new_dept, f"Department was not updated"
    finally:
        # Teardown: revert back to original values
        profile_page.update_profile(
            last_name="สุวรรณโชติ",
            department="วิศวกรรมซอฟต์แวร์"
        )
        time.sleep(1)

@pytest.mark.tc_005
def test_tc_005_change_password_and_relogin(driver):
    """TC-005 (Ref: Master TC-005 | FR-003): การเปลี่ยนรหัสผ่านใหม่ในหน้าโปรไฟล์นักศึกษา และการเข้าสู่ระบบด้วยรหัสผ่านใหม่"""
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    profile_page = ProfilePage(driver)
    profile_page.load()
    profile_page.wait_for_form_ready()
    
    try:
        # Change password to new password
        profile_page.update_profile(
            new_password=Config.STUDENT_NEW_PASSWORD,
            confirm_password=Config.STUDENT_NEW_PASSWORD
        )
        toast_elem = profile_page.wait_for_success(timeout=10)
        assert toast_elem is not None, "Password update toast was not displayed"
        
        # Logout / clear session
        driver.delete_all_cookies()
        
        # Relogin with new password
        login_page.load()
        login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_NEW_PASSWORD)
        assert login_page.wait_for_redirect("/account/saved", timeout=15), "Login with new password failed"
        assert "/account/saved" in driver.current_url, f"Expected /account/saved but got {driver.current_url}"
    finally:
        # Teardown: restore default password
        session = requests.Session()
        res = session.post(f"{Config.BASE_URL}/api/auth/login", json={"email": Config.STUDENT_EMAIL, "password": Config.STUDENT_NEW_PASSWORD})
        if res.status_code == 200:
            session.put(f"{Config.BASE_URL}/api/auth/me", json={"password": Config.STUDENT_PASSWORD})
        else:
            # Fallback direct DB reset
            from fixtures.seed_e2e_data import seed_e2e_users
            import asyncio
            asyncio.run(seed_e2e_users())
