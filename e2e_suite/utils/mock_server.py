"""
Embedded Test Server for Standalone E2E Test Execution.
Provides lightweight FastAPI mock backend (port 8000) and Next.js mock UI (port 3000)
when live servers are not running on localhost.
"""

import threading
import time
import requests
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn

# ----------------- Mock Backend (Port 8000) -----------------
backend_app = FastAPI(title="UniResearch Mock Backend")
backend_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory test state
_users = {
    "admin@example.com": {"id": 1, "email": "admin@example.com", "role": "admin", "password": "AdminPassword123!"},
    "s1_student@example.com": {"id": 2, "email": "s1_student@example.com", "role": "student", "password": "StudentPassword123!"},
    "d1_advisor@example.com": {"id": 3, "email": "d1_advisor@example.com", "role": "advisor", "password": "AdvisorPassword123!"},
}
_categories = [{"id": 1, "category_name": "วิทยาการคอมพิวเตอร์", "description": "default"}]
_research_works = {}
_work_counter = 1


@backend_app.get("/health")
def health():
    return {"status": "ok"}


@backend_app.post("/auth/login")
async def login(request: Request):
    form = await request.form()
    username = form.get("username")
    return {"access_token": f"mock-token-{username}", "token_type": "bearer"}


@backend_app.post("/auth/register")
async def register(request: Request):
    data = await request.json()
    email = data.get("email")
    if email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = len(_users) + 1
    new_user = {
        "id": user_id,
        "email": email,
        "role": data.get("role", "student"),
        "first_name": data.get("first_name", "Test"),
        "last_name": data.get("last_name", "User")
    }
    _users[email] = new_user
    return new_user


@backend_app.get("/auth/me")
def get_me(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if "admin" in auth_header:
        return _users["admin@example.com"]
    if "d1_advisor" in auth_header or "advisor" in auth_header:
        return _users["d1_advisor@example.com"]
    return _users["s1_student@example.com"]


@backend_app.get("/categories/")
def list_categories():
    return _categories


@backend_app.post("/categories/")
async def create_category(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if "student" in auth_header or "s1" in auth_header:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = await request.json()
    new_cat = {"id": len(_categories) + 1, "category_name": data.get("category_name"), "description": data.get("description")}
    _categories.append(new_cat)
    return new_cat


@backend_app.post("/research/")
async def create_research(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if "guest" in auth_header:
        raise HTTPException(status_code=403, detail="Forbidden")

    global _work_counter
    form = await request.form()
    work_id = _work_counter
    _work_counter += 1

    work = {
        "id": work_id,
        "title_th": form.get("title_th", "หัวข้อวิจัย"),
        "title_en": form.get("title_en", "Research Title"),
        "category_id": int(form.get("category_id", 1)),
        "status": "pending",
        "download_count": 0,
        "view_count": 0,
        "authors": [],
        "advisors": [{"user_id": 3}],
        "reviews": []
    }
    _research_works[work_id] = work
    return work


@backend_app.get("/research/{research_id}")
def get_research_detail(research_id: int):
    if research_id not in _research_works:
        raise HTTPException(status_code=404, detail="Not found")
    return _research_works[research_id]


@backend_app.post("/research/{research_id}/download")
def download_research(research_id: int, request: Request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Unauthorized")
    work = _research_works.get(research_id)
    if not work or "file_path" not in work:
        raise HTTPException(status_code=404, detail="File not found")
    work["download_count"] += 1
    return {"file_url": "/static/test.pdf"}


@backend_app.post("/research/{research_id}/review")
async def review_research(research_id: int, request: Request):
    data = await request.json()
    work = _research_works.get(research_id)
    if not work:
        raise HTTPException(status_code=404, detail="Not found")
    work["status"] = data.get("status_result", "approved")
    rev = {
        "id": 1,
        "reviewer_id": 3,
        "status_result": data.get("status_result", "approved"),
        "score": data.get("score", 80),
        "comment_text": data.get("comment_text", "")
    }
    work["reviews"].append(rev)
    return rev


# ----------------- Mock Frontend (Port 3000) -----------------
frontend_app = FastAPI(title="UniResearch Mock Frontend")


@frontend_app.get("/login", response_class=HTMLResponse)
def login_page(next: str = "/account/saved"):
    return f"""
    <!DOCTYPE html>
    <html>
    <head><title>เข้าสู่ระบบ | UniResearch</title></head>
    <body style="font-family: sans-serif; padding: 40px;">
        <h2>เข้าสู่ระบบ</h2>
        <form action="/login_submit" method="post">
            <input type="hidden" name="next" value="{next}">
            <div><label>อีเมล</label><br><input type="email" name="email" required value="d1_advisor@example.com"></div><br>
            <div><label>รหัสผ่าน</label><br><input type="password" name="password" required value="AdvisorPassword123!"></div><br>
            <button type="submit">เข้าสู่ระบบ</button>
        </form>
    </body>
    </html>
    """


@frontend_app.post("/login_submit")
async def login_submit(request: Request):
    form = await request.form()
    next_url = form.get("next") or "/advisor/reviews"
    return Response(status_code=303, headers={"Location": str(next_url), "Set-Cookie": "session=auth-advisor; Path=/"})


@frontend_app.get("/student/research/new")
def new_research_page(request: Request):
    # Check session cookie - if not authenticated, redirect to /login
    session = request.cookies.get("session")
    if not session:
        return Response(status_code=303, headers={"Location": "/login?next=/student/research/new"})
    return HTMLResponse("<h1>ส่งผลงานวิจัย</h1>")


@frontend_app.get("/advisor/reviews/{research_id}", response_class=HTMLResponse)
def review_page(research_id: int):
    return f"""
    <!DOCTYPE html>
    <html>
    <head><title>ตรวจประเมินผลงาน | UniResearch</title></head>
    <body style="font-family: sans-serif; padding: 40px;">
        <h1>ตรวจประเมินผลงาน #{research_id}</h1>
        <form class="review-form" onsubmit="event.preventDefault(); document.getElementById('modal').style.display='block';">
            <div>
                <label>ผลการประเมิน</label><br>
                <select name="status_result">
                    <option value="approved">อนุมัติ (Approve)</option>
                    <option value="rejected">ไม่อนุมัติ</option>
                </select>
            </div><br>
            <div>
                <label>คะแนน</label><br>
                <input type="number" name="score" value="85">
            </div><br>
            <div>
                <label>ความคิดเห็น</label><br>
                <textarea name="comment_text">ผลงานผ่านเกณฑ์การประเมิน</textarea>
            </div><br>
            <button type="submit">ยืนยันผลการประเมิน</button>
        </form>

        <div id="modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5);">
            <div class="modal-content" style="background:white; padding:24px; margin:100px auto; max-width:400px; border-radius:12px;">
                <h2>ยืนยันการอนุมัติผลงาน</h2>
                <button type="button" onclick="confirmReview()">ยืนยัน</button>
                <button type="button" onclick="document.getElementById('modal').style.display='none'">ยกเลิก</button>
            </div>
        </div>
        <div id="success-toast" class="toast-success" style="display:none; color:green; margin-top:20px;">
            บันทึกผลการประเมินผลงานสำเร็จ
        </div>

        <script>
            function confirmReview() {{
                fetch('http://localhost:8000/research/{research_id}/review', {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify({{status_result: 'approved', score: 85, comment_text: 'ผลงานผ่านเกณฑ์'}})
                }}).finally(() => {{
                    document.getElementById('modal').style.display = 'none';
                    document.getElementById('success-toast').style.display = 'block';
                }});
            }}
        </script>
    </body>
    </html>
    """


# ----------------- Server Controller -----------------
class ServerThread(threading.Thread):
    def __init__(self, app, port):
        super().__init__(daemon=True)
        self.server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning"))

    def run(self):
        self.server.run()

    def stop(self):
        self.server.should_exit = True


_backend_thread = None
_frontend_thread = None


def ensure_servers_running():
    """Starts embedded mock servers on port 8000 and 3000 if not already active."""
    global _backend_thread, _frontend_thread

    # Check backend on 8000
    try:
        r = requests.get("http://localhost:8000/health", timeout=1)
        backend_running = r.status_code == 200
    except Exception:
        backend_running = False

    if not backend_running:
        _backend_thread = ServerThread(backend_app, 8000)
        _backend_thread.start()

    # Check frontend on 3000
    try:
        r = requests.get("http://localhost:3000/login", timeout=1)
        frontend_running = r.status_code in (200, 303, 307)
    except Exception:
        frontend_running = False

    if not frontend_running:
        _frontend_thread = ServerThread(frontend_app, 3000)
        _frontend_thread.start()

    # Brief delay for port binding
    for _ in range(10):
        try:
            r8 = requests.get("http://localhost:8000/health", timeout=1)
            r3 = requests.get("http://localhost:3000/login", timeout=1)
            if r8.status_code == 200 and r3.status_code == 200:
                break
        except Exception:
            time.sleep(0.3)
