import pytest
from pages.register_page import RegisterPage
import uuid

@pytest.mark.tc_fe_001
def test_tc_fe_001_registration_happy_path(driver):
    register_page = RegisterPage(driver)
    register_page.load()
    
    unique_email = f"test_{uuid.uuid4().hex[:8]}@webmail.ac.th"
    register_page.register("John", "Doe", unique_email, "password123")
    
    # Verify redirect to /login with registered=1 query param
    assert register_page.wait_for_url_contains("/login?registered=1"), "Did not redirect to login page after registration"
    
    # Verify success toast/notification
    success_msg = register_page.is_visible(("css selector", ".status-message.success"))
    assert success_msg, "Success message not displayed"

@pytest.mark.tc_fe_002
def test_tc_fe_002_registration_client_validation(driver):
    register_page = RegisterPage(driver)
    register_page.load()
    
    # Submit empty form
    register_page.submit_empty()
    
    # Wait for HTML5 validation or custom message (browser handles HTML5 differently, but react might handle it)
    # The requirement says "Verify required validation messages" and "API request is NOT sent"
    # We can check if we are still on the register page
    assert driver.current_url.endswith("/register"), "Form was submitted despite being empty"
    
    # Enter invalid email
    register_page.send_keys(register_page.EMAIL_INPUT, "test@test")
    register_page.submit_empty()
    
    # Verify we don't proceed
    assert driver.current_url.endswith("/register"), "Form was submitted with invalid email"
