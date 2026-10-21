import pytest
from pages.home_page import HomePage

@pytest.mark.tc_017
def test_tc017_latest_popular_and_stats(driver):
    """TC-017: ทดสอบการแสดงผล latest/popular และสถิติบนหน้าหลัก"""
    home_page = HomePage(driver)
    home_page.load()
    home_page.wait_for_form_ready()
    
    # 1. Verify system stats section
    stats_data = home_page.get_stats_data()
    assert len(stats_data) >= 3, f"Expected at least 3 stats metrics, got {len(stats_data)}: {stats_data}"
    
    # 2. Verify latest research cards
    latest_cards = home_page.get_latest_cards_count()
    assert latest_cards >= 1, f"Expected at least 1 latest research card, found {latest_cards}"
    
    # 3. Verify featured/popular research title
    featured_title = home_page.get_featured_title()
    assert len(featured_title) > 0, "Featured/popular research title is empty"
