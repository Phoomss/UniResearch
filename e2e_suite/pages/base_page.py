"""
Base Page implementing Page Object Model (POM) foundation.
Uses Explicit Waits (WebDriverWait with expected_conditions) exclusively.
"""

from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException


class BasePage:
    def __init__(self, driver, base_url="http://localhost:3000", default_timeout=10):
        self.driver = driver
        self.base_url = base_url.rstrip("/")
        self.timeout = default_timeout
        self.wait = WebDriverWait(self.driver, self.timeout)

    def open(self, path=""):
        """Navigates to full URL based on relative path."""
        url = f"{self.base_url}{path}" if path.startswith("/") else f"{self.base_url}/{path}"
        self.driver.get(url)

    def get_current_url(self):
        """Returns current browser URL."""
        return self.driver.current_url

    def find(self, locator, timeout=None):
        """Finds an element once it is visible using explicit wait."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(
            EC.visibility_of_element_located(locator),
            message=f"Element not visible: {locator} within {t}s"
        )

    def find_present(self, locator, timeout=None):
        """Finds an element present in the DOM."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(
            EC.presence_of_element_located(locator),
            message=f"Element not present in DOM: {locator} within {t}s"
        )

    def find_all(self, locator, timeout=None):
        """Finds all visible elements matching locator."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(
            EC.visibility_of_all_elements_located(locator),
            message=f"Elements not found: {locator} within {t}s"
        )

    def find_clickable(self, locator, timeout=None):
        """Finds element when clickable."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(
            EC.element_to_be_clickable(locator),
            message=f"Element not clickable: {locator} within {t}s"
        )

    def click(self, locator, timeout=None):
        """Waits until clickable, then clicks element."""
        element = self.find_clickable(locator, timeout)
        element.click()

    def js_click(self, locator, timeout=None):
        """Executes JavaScript click directly on element (useful for overlays)."""
        element = self.find_present(locator, timeout)
        self.driver.execute_script("arguments[0].click();", element)

    def fill(self, locator, text, clear_first=True, timeout=None):
        """Fills input with text."""
        element = self.find(locator, timeout)
        if clear_first:
            element.clear()
        element.send_keys(text)

    def select_by_value(self, locator, value, timeout=None):
        """Selects option from <select> element by value."""
        element = self.find(locator, timeout)
        select_obj = Select(element)
        select_obj.select_by_value(str(value))

    def select_by_index(self, locator, index, timeout=None):
        """Selects option from <select> element by index."""
        element = self.find(locator, timeout)
        select_obj = Select(element)
        select_obj.select_by_index(index)

    def select_by_visible_text(self, locator, text, timeout=None):
        """Selects option from <select> element by visible text."""
        element = self.find(locator, timeout)
        select_obj = Select(element)
        select_obj.select_by_visible_text(text)

    def get_text(self, locator, timeout=None):
        """Extracts text of visible element."""
        return self.find(locator, timeout).text

    def is_visible(self, locator, timeout=3):
        """Checks if element is visible within short timeout without raising error."""
        try:
            WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))
            return True
        except (TimeoutException, NoSuchElementException):
            return False

    def wait_for_url_contains(self, fragment, timeout=None):
        """Waits until browser URL contains specified fragment."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(
            EC.url_contains(fragment),
            message=f"URL did not contain '{fragment}' within {t}s. Current URL: {self.driver.current_url}"
        )

    def wait_for_url_matches(self, pattern, timeout=None):
        """Waits until browser URL matches pattern."""
        t = timeout or self.timeout
        return WebDriverWait(self.driver, t).until(
            EC.url_matches(pattern),
            message=f"URL did not match '{pattern}' within {t}s. Current URL: {self.driver.current_url}"
        )
