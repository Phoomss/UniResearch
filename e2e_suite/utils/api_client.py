"""
API Client Helper for UniResearch REST API endpoints.
Provides direct HTTP methods using requests with token management.
"""

import json
import requests


class ApiClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()

    def _headers(self, token=None):
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        return headers

    # ---------------- Auth Endpoints ----------------

    def login(self, username, password):
        """POST /auth/login - returns access_token or raises error."""
        url = f"{self.base_url}/auth/login"
        resp = self.session.post(url, data={"username": username, "password": password})
        return resp

    def get_token(self, username, password):
        """Helper to login and extract access_token directly."""
        resp = self.login(username, password)
        if resp.status_code == 200:
            return resp.json().get("access_token")
        return None

    def register(self, email, password, role="student", first_name=None, last_name=None, department=None, student_id=None):
        """POST /auth/register"""
        url = f"{self.base_url}/auth/register"
        payload = {
            "email": email,
            "password": password,
            "role": role,
            "first_name": first_name,
            "last_name": last_name,
            "department": department,
            "student_id": student_id
        }
        return self.session.post(url, json=payload)

    def get_me(self, token):
        """GET /auth/me"""
        url = f"{self.base_url}/auth/me"
        return self.session.get(url, headers=self._headers(token))

    def update_me(self, token, update_data):
        """PUT /auth/me"""
        url = f"{self.base_url}/auth/me"
        return self.session.put(url, json=update_data, headers=self._headers(token))

    # ---------------- Users Endpoints (Admin only) ----------------

    def list_users(self, token):
        """GET /users/"""
        url = f"{self.base_url}/users/"
        return self.session.get(url, headers=self._headers(token))

    def create_user(self, token, user_data):
        """POST /users/"""
        url = f"{self.base_url}/users/"
        return self.session.post(url, json=user_data, headers=self._headers(token))

    def get_user_by_id(self, token, user_id):
        """GET /users/{user_id}"""
        url = f"{self.base_url}/users/{user_id}"
        return self.session.get(url, headers=self._headers(token))

    def update_user(self, token, user_id, update_data):
        """PUT /users/{user_id}"""
        url = f"{self.base_url}/users/{user_id}"
        return self.session.put(url, json=update_data, headers=self._headers(token))

    def delete_user(self, token, user_id):
        """DELETE /users/{user_id}"""
        url = f"{self.base_url}/users/{user_id}"
        return self.session.delete(url, headers=self._headers(token))

    # ---------------- Categories Endpoints ----------------

    def get_categories(self):
        """GET /categories/"""
        url = f"{self.base_url}/categories/"
        return self.session.get(url)

    def create_category(self, token, category_data):
        """POST /categories/"""
        url = f"{self.base_url}/categories/"
        return self.session.post(url, json=category_data, headers=self._headers(token))

    # ---------------- Research Endpoints ----------------

    def create_research(self, token, data, files=None):
        """POST /research/ (multipart/form-data)"""
        url = f"{self.base_url}/research/"
        return self.session.post(url, data=data, files=files, headers=self._headers(token))

    def search_research(self, token=None, q=None, category_id=None):
        """GET /research/search"""
        url = f"{self.base_url}/research/search"
        params = {}
        if q:
            params["q"] = q
        if category_id:
            params["category_id"] = category_id
        return self.session.get(url, params=params, headers=self._headers(token))

    def get_research_detail(self, research_id):
        """GET /research/{research_id}"""
        url = f"{self.base_url}/research/{research_id}"
        return self.session.get(url)

    def get_pending_research(self, token):
        """GET /research/pending"""
        url = f"{self.base_url}/research/pending"
        return self.session.get(url, headers=self._headers(token))

    def update_research(self, token, research_id, data, files=None):
        """PUT /research/{research_id}"""
        url = f"{self.base_url}/research/{research_id}"
        return self.session.put(url, data=data, files=files, headers=self._headers(token))

    def delete_research(self, token, research_id):
        """DELETE /research/{research_id}"""
        url = f"{self.base_url}/research/{research_id}"
        return self.session.delete(url, headers=self._headers(token))

    def download_research(self, token, research_id):
        """POST /research/{research_id}/download"""
        url = f"{self.base_url}/research/{research_id}/download"
        return self.session.post(url, headers=self._headers(token))

    def review_research(self, token, research_id, comment_text, status_result="approved", score=80):
        """POST /research/{research_id}/review"""
        url = f"{self.base_url}/research/{research_id}/review"
        payload = {
            "comment_text": comment_text,
            "status_result": status_result,
            "score": score
        }
        return self.session.post(url, json=payload, headers=self._headers(token))

    def assign_advisors(self, token, research_id, advisor_ids):
        """POST /research/{research_id}/assign-advisors"""
        url = f"{self.base_url}/research/{research_id}/assign-advisors"
        return self.session.post(url, json=advisor_ids, headers=self._headers(token))

    def get_personalized_recommendations(self, token=None):
        """GET /research/recommendations/personalized"""
        url = f"{self.base_url}/research/recommendations/personalized"
        return self.session.get(url, headers=self._headers(token))

    # ---------------- Interactions / Favorites ----------------

    def toggle_favorite(self, token, research_id):
        """POST /favorites/{research_id}"""
        url = f"{self.base_url}/favorites/{research_id}"
        return self.session.post(url, headers=self._headers(token))

    def list_favorites(self, token):
        """GET /favorites/"""
        url = f"{self.base_url}/favorites/"
        return self.session.get(url, headers=self._headers(token))

    # ---------------- Notifications ----------------

    def get_notifications(self, token):
        """GET /notifications/"""
        url = f"{self.base_url}/notifications/"
        return self.session.get(url, headers=self._headers(token))

    # ---------------- Home & Stats ----------------

    def get_latest_home(self, limit=5):
        """GET /home/latest"""
        url = f"{self.base_url}/home/latest"
        return self.session.get(url, params={"limit": limit})

    def get_popular_home(self, limit=5):
        """GET /home/popular"""
        url = f"{self.base_url}/home/popular"
        return self.session.get(url, params={"limit": limit})

    def get_stats(self):
        """GET /stats/"""
        url = f"{self.base_url}/stats/"
        return self.session.get(url)

    # ---------------- AI Assistant Endpoints ----------------

    def ai_generate_abstract(self, token, payload):
        """POST /ai/generate-abstract"""
        url = f"{self.base_url}/ai/generate-abstract"
        return self.session.post(url, json=payload, headers=self._headers(token))

    def ai_suggest_titles(self, token, payload):
        """POST /ai/suggest-titles"""
        url = f"{self.base_url}/ai/suggest-titles"
        return self.session.post(url, json=payload, headers=self._headers(token))

    def ai_suggest_keywords(self, token, payload):
        """POST /ai/suggest-keywords"""
        url = f"{self.base_url}/ai/suggest-keywords"
        return self.session.post(url, json=payload, headers=self._headers(token))

    def ai_check_writing(self, token, payload):
        """POST /ai/check-writing"""
        url = f"{self.base_url}/ai/check-writing"
        return self.session.post(url, json=payload, headers=self._headers(token))
