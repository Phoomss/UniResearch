from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from utils.config import Config

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(self.driver, 10)

    def go_to(self, path):
        self.driver.get(f"{Config.BASE_URL}{path}")

    def find_element(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_elements(self, locator):
        return self.wait.until(EC.presence_of_all_elements_located(locator))

    def click(self, locator):
        element = self.wait.until(EC.element_to_be_clickable(locator))
        try:
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            element.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", element)

    def send_keys(self, locator, text):
        element = self.wait.until(EC.visibility_of_element_located(locator))
        try:
            element.click()
            element.send_keys(Keys.CONTROL, "a")
            element.send_keys(Keys.BACKSPACE)
        except Exception:
            element.clear()
        element.send_keys(text)

    def set_react_input(self, locator, text):
        element = self.wait.until(EC.visibility_of_element_located(locator))
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        js = """
        var element = arguments[0];
        var value = arguments[1];
        var isTextArea = element.tagName.toLowerCase() === 'textarea';
        var proto = isTextArea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
        setter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        """
        self.driver.execute_script(js, element, text)

    def set_react_select(self, locator, value):
        element = self.wait.until(EC.visibility_of_element_located(locator))
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        js = """
        var element = arguments[0];
        var value = arguments[1];
        var setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
        setter.call(element, value);
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        """
        self.driver.execute_script(js, element, value)

    def wait_for_form_ready(self, timeout=10):
        WebDriverWait(self.driver, timeout).until(
            lambda d: d.execute_script("return document.readyState === 'complete';")
        )
        WebDriverWait(self.driver, timeout).until(
            lambda d: len(d.find_elements(By.CSS_SELECTOR, "select[name='category_id'] option")) > 1
        )

    def wait_for_step(self, step_name, timeout=10):
        locator = (By.XPATH, f"//li[contains(@class, 'step') and contains(@class, 'active')][contains(., '{step_name}')]")
        return WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))

    def advance_step(self, next_step_name, timeout=10):
        continue_btn = (By.XPATH, "//button[contains(text(), 'ดำเนินการต่อ')]")
        self.click(continue_btn)
        elem = self.wait_for_step(next_step_name, timeout=timeout)
        import time
        time.sleep(0.3)
        return elem

    def is_visible(self, locator, timeout=10):
        try:
            return bool(WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator)))
        except TimeoutException:
            return False

    def wait_for_url_contains(self, text, timeout=10):
        return WebDriverWait(self.driver, timeout).until(EC.url_contains(text))

    def wait_for_element_text(self, locator, timeout=10):
        element = WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))
        return element.text
