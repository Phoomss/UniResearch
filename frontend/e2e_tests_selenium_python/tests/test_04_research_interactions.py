# -*- coding: utf-8 -*-
import pytest
import time
import requests
import asyncpg
import asyncio
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.research_detail_page import ResearchDetailPage
from pages.base_page import BasePage
from utils.config import Config

async def get_research_download_count(research_id=1):
    conn = await asyncpg.connect(user="postgres", password="postgrespassword", database="uniresearch", host="127.0.0.1", port=5433)
    row = await conn.fetchrow("SELECT download_count FROM research_works WHERE id = $1;", research_id)
    await conn.close()
    return row["download_count"]

async def reset_favorite(user_email, research_id=1):
    conn = await asyncpg.connect(user="postgres", password="postgrespassword", database="uniresearch", host="127.0.0.1", port=5433)
    user = await conn.fetchrow("SELECT id FROM users WHERE email = $1;", user_email)
    if user:
        await conn.execute("DELETE FROM favorites WHERE user_id = $1 AND research_id = $2;", user["id"], research_id)
    await conn.close()

@pytest.mark.tc_022
def test_tc_022_unauthenticated_download_button_hidden_and_prompt_shown(driver):
    """TC-022 (Ref: Master TC-035 | FR-021): การซ่อนปุ่มดาวน์โหลดและแสดงกล่องแจ้งเตือนให้เข้าสู่ระบบ เมื่อผู้เข้าชมทั่วไป (Guest) เปิดดูหน้ารายละเอียดงานวิจัย"""
    driver.delete_all_cookies()
    detail_page = ResearchDetailPage(driver)
    detail_page.load(1)
    
    # Assert auth prompt panel is displayed
    assert detail_page.is_auth_prompt_visible(), "Unauthenticated user was not prompted to sign in"
    # Assert download button is NOT present for unauthenticated visitor
    assert not detail_page.is_download_button_present(), "Download button should be hidden for unauthenticated visitor"

@pytest.mark.tc_023
def test_tc_023_unauthenticated_download_api_rejected_and_counter_unchanged(driver):
    """TC-023 (Ref: Master TC-035 | FR-021): การปฏิเสธคำขอดาวน์โหลดไฟล์งานวิจัยโดยไม่เข้าสู่ระบบ และไม่เพิ่มยอดดาวน์โหลดสะสม (No Token -> HTTP 401)"""
    count_before = asyncio.run(get_research_download_count(1))
    
    res = requests.get(f"{Config.BASE_URL}/api/research/1/download")
    assert res.status_code == 401, f"Expected HTTP 401 for download without session, got: {res.status_code}"
    
    count_after = asyncio.run(get_research_download_count(1))
    assert count_before == count_after, f"Download count increased on unauthorized request: {count_before} -> {count_after}"

@pytest.mark.tc_024
def test_tc_024_authenticated_download_nonexistent_file_returns_404(driver):
    """TC-024 (Ref: Master TC-035 | FR-021): การจัดการกรณีผู้ใช้งานที่เข้าสู่ระบบแล้วพยายามดาวน์โหลดผลงานวิจัยที่ไม่มีไฟล์เอกสารแนบในระบบ (file_path = NULL -> HTTP 404)"""
    count_before = asyncio.run(get_research_download_count(1))
    
    session = requests.Session()
    login_res = session.post(f"{Config.BASE_URL}/api/auth/login", json={"email": Config.STUDENT_EMAIL, "password": Config.STUDENT_PASSWORD})
    assert login_res.status_code == 200, "Student login failed"
    
    download_res = session.get(f"{Config.BASE_URL}/api/research/1/download")
    assert download_res.status_code == 404, f"Expected HTTP 404 for research with missing file, got: {download_res.status_code}"
    
    count_after = asyncio.run(get_research_download_count(1))
    assert count_before == count_after, f"Download count increased on missing file: {count_before} -> {count_after}"

@pytest.mark.tc_025
def test_tc_025_add_favorite_toast_and_verify_saved_page(driver):
    """TC-025 (Ref: Master TC-042 | FR-027): การกดปุ่มบันทึกผลงานวิจัยเข้าสู่รายการที่สนใจ (Add Favorite) และตรวจสอบการแสดงผลในหน้า /account/saved"""
    # Ensure not favorited initially
    asyncio.run(reset_favorite(Config.STUDENT_EMAIL, 1))
    
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    detail_page = ResearchDetailPage(driver)
    detail_page.load(1)
    
    # Click Save research button
    detail_page.click_save_favorite()
    toast = detail_page.wait_for_toast("Saved to your research list.", timeout=10)
    assert toast is not None, "Toast message was not displayed after adding favorite"
    
    # Navigate to /account/saved and verify card appears
    base_page = BasePage(driver)
    base_page.go_to("/account/saved")
    base_page.wait_for_form_ready()
    time.sleep(1)
    
    # Research link for ID 1 should be visible in saved list
    saved_link = (By.XPATH, "//a[contains(@href, '/research/1')]")
    assert base_page.is_visible(saved_link, timeout=10), "Saved research 1 was not found on /account/saved page"

@pytest.mark.tc_026
def test_tc_026_remove_favorite_toast_and_verify_removed_saved_page(driver):
    """TC-026 (Ref: Master TC-042 | FR-027): การกดปุ่มยกเลิกการบันทึกผลงานวิจัย (Remove Favorite) และตรวจสอบว่าผลงานถูกนำออกจากหน้า /account/saved"""
    # Student is logged in from TC-025, or re-login
    login_page = LoginPage(driver)
    login_page.load()
    login_page.login(Config.STUDENT_EMAIL, Config.STUDENT_PASSWORD)
    login_page.wait_for_redirect("/account/saved", timeout=15)
    
    detail_page = ResearchDetailPage(driver)
    detail_page.load(1)
    
    # Click Save research button again to toggle / remove
    detail_page.click_save_favorite()
    toast = detail_page.wait_for_toast("Removed from saved research.", timeout=10)
    assert toast is not None, "Toast message was not displayed after removing favorite"
    
    # Navigate to /account/saved and verify card is no longer there
    base_page = BasePage(driver)
    base_page.go_to("/account/saved")
    base_page.wait_for_form_ready()
    time.sleep(1)
    
    saved_link = (By.XPATH, "//a[contains(@href, '/research/1')]")
    assert not base_page.is_visible(saved_link, timeout=3), "Removed research 1 should no longer be visible on /account/saved"
