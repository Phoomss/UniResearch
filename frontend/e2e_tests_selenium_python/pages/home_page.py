from selenium.webdriver.common.by import By
from .base_page import BasePage

class HomePage(BasePage):
    STAT_NUMBERS = (By.CSS_SELECTOR, ".discovery-stat-grid div strong")
    STAT_LABELS = (By.CSS_SELECTOR, ".discovery-stat-grid div span")
    LATEST_SECTION = (By.CSS_SELECTOR, "section[aria-labelledby='latest-research']")
    LATEST_CARDS = (By.CSS_SELECTOR, "section[aria-labelledby='latest-research'] article.folio, section[aria-labelledby='latest-research'] .folio")
    FEATURED_HEADING = (By.CSS_SELECTOR, ".featured-body h2")
    SEARCH_INPUT = (By.ID, "home-search")

    def load(self):
        self.go_to("/")

    def get_stats_data(self):
        numbers = self.find_elements(self.STAT_NUMBERS)
        labels = self.find_elements(self.STAT_LABELS)
        return {l.text.strip(): n.text.strip() for n, l in zip(numbers, labels)}

    def get_latest_cards_count(self):
        return len(self.driver.find_elements(*self.LATEST_CARDS))

    def get_featured_title(self):
        elem = self.find_element(self.FEATURED_HEADING)
        return elem.text.strip()
