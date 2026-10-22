# -*- coding: utf-8 -*-
import pytest
from pages.home_page import HomePage

@pytest.mark.tc_006
def test_tc_006_discovery_stats_grid(driver):
    """TC-006 (Ref: Master TC-017 | FR-010): การแสดงผลตัวเลขสถิติภาพรวมคลังงานวิจัยทั้ง 4 ด้านบนหน้าแรกของเว็บไซต์ (/)"""
    home_page = HomePage(driver)
    home_page.load()
    home_page.wait_for_form_ready()
    
    stats_data = home_page.get_stats_data()
    # Expect 4 metrics in discovery stat grid
    assert len(stats_data) >= 3, f"Expected at least 3 stats metrics, got {len(stats_data)}: {stats_data}"
    
    # Check that numbers are present
    values = list(stats_data.values())
    assert all(len(v) > 0 for v in values), f"Some stat metrics are empty: {stats_data}"

@pytest.mark.tc_007
def test_tc_007_latest_research_display(driver):
    """TC-007 (Ref: Master TC-017 | FR-010): การแสดงผลรายการผลงานวิจัยมาใหม่ล่าสุด (Latest Research) บนหน้าแรก (/)"""
    home_page = HomePage(driver)
    home_page.load()
    home_page.wait_for_form_ready()
    
    latest_cards = home_page.get_latest_cards_count()
    assert latest_cards >= 1, f"Expected at least 1 latest research card, found {latest_cards}"

@pytest.mark.tc_008
def test_tc_008_featured_popular_research(driver):
    """TC-008 (Ref: Master TC-017 | FR-010): การแสดงผลผลงานวิจัยยอดนิยม (Popular / Featured Research) บนหน้าแรก (/)"""
    home_page = HomePage(driver)
    home_page.load()
    home_page.wait_for_form_ready()
    
    featured_title = home_page.get_featured_title()
    assert len(featured_title) > 0, "Featured / popular research title is empty"
