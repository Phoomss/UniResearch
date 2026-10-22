# -*- coding: utf-8 -*-
import pytest
import os
import json
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from utils.config import Config
from fixtures.test_files_manager import ensure_test_files, cleanup_oversized_files
from fixtures.seed_e2e_data import seed_e2e_users
import asyncio

RESULTS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "results", "execution_results.json"))

def pytest_sessionstart(session):
    """Run before tests start: seed DB personas and generate required test files."""
    os.makedirs(os.path.dirname(RESULTS_FILE), exist_ok=True)
    ensure_test_files()
    try:
        asyncio.run(seed_e2e_users())
    except Exception as e:
        print(f"[conftest] Warning: failed to seed users: {e}")

def pytest_sessionfinish(session, exitstatus):
    """Run after all tests finish: cleanup oversized files."""
    cleanup_oversized_files()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_" + rep.when, rep)
    
    if rep.when == "call":
        # Record execution results
        results = {}
        if os.path.exists(RESULTS_FILE):
            try:
                with open(RESULTS_FILE, "r", encoding="utf-8") as f:
                    results = json.load(f)
            except Exception:
                results = {}
        
        test_id = item.nodeid
        results[test_id] = {
            "name": item.name,
            "status": "PASS" if rep.passed else "FAIL",
            "duration": round(rep.duration, 2),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        with open(RESULTS_FILE, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

@pytest.fixture(scope="function")
def driver():
    options = Options()
    if Config.HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    yield driver
    try:
        driver.quit()
    except Exception:
        pass

@pytest.fixture(autouse=True)
def take_screenshot_on_failure(request, driver):
    yield
    rep_call = getattr(request.node, "rep_call", None)
    if rep_call and rep_call.failed:
        results_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "test-results", "screenshots"))
        os.makedirs(results_dir, exist_ok=True)
        timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        test_name = request.node.name
        screenshot_path = os.path.join(results_dir, f"{test_name}_{timestamp}.png")
        try:
            driver.save_screenshot(screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
        except Exception as e:
            print(f"Failed to capture screenshot: {e}")
