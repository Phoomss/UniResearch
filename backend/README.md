# 🏫 UniResearch Backend

ระบบ Backend API ของแพลตฟอร์ม **UniResearch** คลังจัดเก็บ ค้นหา และเผยแพร่ผลงานวิชาการ (งานวิจัย โครงงานนักศึกษา วิทยานิพนธ์ และผลงานอาจารย์) พัฒนาด้วย FastAPI, SQLAlchemy 2.0 (async), Pydantic v2 และ PostgreSQL

---

## 🚀 ฟังก์ชันการใช้งานหลัก (Core Features)

1. **Authentication & RBAC**: ระบบยืนยันตัวตนผ่าน JWT รองรับ 4 บทบาทการทำงาน (`guest`, `student`, `advisor`, `admin`)
2. **Research Submission**: ระบบส่งผลงานวิจัย รองรับการอัปโหลดไฟล์รูปภาพหน้าปกและเอกสาร PDF, ระบบสลับเวอร์ชันแก้ไข (`FileRevision`), รองรับผู้จัดทำหลายคน (`ResearchAuthor`)
3. **Review & Approval Workflow**: ระบบให้คะแนน ข้อคิดเห็น และการอนุมัติโดยอาจารย์หรือผู้ดูแลระบบ (`ReviewComment`)
4. **Search & Filter**: ค้นหาข้อมูลแบบ Full-Text จากชื่อเรื่อง บทคัดย่อ หรือ Keywords กรองข้อมูลด้วย Category และจัดเรียงความนิยม
5. **Dashboard & Statistics**: รายงานข้อมูลสถิติตัวเลขสำคัญ (ยอดผู้ใช้, ผลงานยอดนิยม, ยอดเข้าดูและดาวน์โหลด, คำค้นหายอดนิยม)
6. **Robust Logging**: บันทึกการดาวน์โหลดและการเข้าชม (`DownloadViewLog`) และการค้นหาเพื่อนำมาสร้างสถิติ (`SearchLog`)

---

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (Dockerized) / SQLite (สำหรับ Testing Environment)
- **ORM**: SQLAlchemy 2.0 (Async Engine)
- **Migration**: Alembic
- **Validation**: Pydantic v2
- **Testing**: pytest + pytest-asyncio + httpx (AsyncClient)

---

## 📁 โครงสร้างโปรเจกต์ (Directory Structure)

```text
backend/
├── app/
│   ├── core/         # การตั้งค่าระบบ JWT และ Configuration
│   ├── db/           # การเชื่อมต่อ Database (asyncpg) และ Session Setup
│   ├── models/       # Table Models (SQLAlchemy 2.0)
│   ├── schemas/      # Data Validation Schemas (Pydantic v2)
│   ├── routers/      # API Endpoint Handlers
│   ├── services/     # Business & DB Processing Logic
│   └── main.py       # จุดเริ่มต้น FastAPI Application
├── tests/            # ชุดทดสอบ API endpoints ทั้งหมด (pytest)
├── static/           # โฟลเดอร์เก็บไฟล์ (Covers/Documents)
├── Dockerfile        # การสร้าง Docker Container (multi-stage: dev + prod)
├── requirements.txt  # Python Dependencies
├── .gitignore        # ไฟล์ยกเว้นการอัปโหลด Git
└── README.md         # เอกสารแนะนำโปรเจกต์
```

---

## 🐳 วิธีการรันระบบด้วย Docker (แนะนำ)

ระบบ Docker Compose หลักอยู่ที่ **root ของโปรเจกต์** (`UniResearch/docker-compose.yml`) ซึ่งจะเซ็ตอัปทั้ง Backend, Frontend และ PostgreSQL ให้พร้อมใช้งาน:

1. **กลับไปที่ root directory ของโปรเจกต์:**
   ```bash
   cd ..  # หรือไปที่ UniResearch/
   ```

2. **รันระบบทั้งหมดผ่าน Make:**
   ```bash
   make dev-build
   ```
   หรือรันด้วย Docker Compose โดยตรง:
   ```bash
   docker compose up --build
   ```

3. **เปิดหน้า API Documentation (Swagger UI):**
   เข้าไปที่: [http://localhost:8000/swagger](http://localhost:8000/swagger) เพื่อทดลองเรียกใช้งาน endpoint ต่างๆ

4. **คำสั่ง Docker ที่มีประโยชน์ (จาก root directory):**
   ```bash
   make logs-backend      # ดู log เฉพาะ backend
   make shell-backend     # เปิด bash ใน backend container
   make migrate           # รัน Alembic migrations
   make shell-db          # เปิด psql ใน database container
   ```

> **หมายเหตุ**: ไฟล์ `backend/docker-compose.yml` เดิมถูกแทนที่ด้วย `docker-compose.yml` ที่ root ของโปรเจกต์ สามารถลบไฟล์เดิมได้

---

## 💻 วิธีการรันระบบแบบ Local Setup (ไม่ใช้ Docker)

หากต้องการติดตั้งและรันทีละส่วนบนคอมพิวเตอร์ของคุณ ให้ทำตามขั้นตอนดังนี้:

### 1. ติดตั้ง Virtual Environment และ Dependencies
```bash
# สร้างและเปิดใช้ venv
python3 -m venv venv
source venv/bin/activate

# ติดตั้งแพ็คเกจเสริม
pip install -r requirements.txt
```

### 2. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
คัดลอกไฟล์ต้นแบบ `.env.example` ไปเป็น `.env` จากนั้นเปลี่ยนรายละเอียดการต่อฐานข้อมูลให้ถูกต้อง:
```bash
cp .env.example .env
```

### 3. รันเซิร์ฟเวอร์
```bash
uvicorn app.main:app --reload
```
เมื่อรันเสร็จสิ้น สามารถเข้าสู่หน้าระบบเอกสาร API ที่: [http://localhost:8000/swagger](http://localhost:8000/swagger) (หรือ [http://localhost:8000/docs](http://localhost:8000/docs) ซึ่งจะ Redirect ไปที่หน้า Swagger UI)

---

## 🧪 การทดสอบระบบ (Testing)

โปรเจกต์นี้มาพร้อมกับชุดทดสอบ Unit tests ครอบคลุมการทำงานหลักทั้งหมด (Auth, Research Submission, Review/Approve, Search) โดยทดสอบบน Memory database เพื่อความเป็นอิสระและรวดเร็ว:

รันคำสั่งทดสอบด้านล่าง:
```bash
PYTHONPATH=. pytest tests/ -v
```

## Development administrator provisioning

The `python -m app.scripts.create_admin` command provisions an administrator only for local development, disposable testing databases, and approved development databases. It refuses missing, unknown, staging, and production `APP_ENV` values. It also refuses database targets that cannot be confirmed as local.

Before running the command, inspect `DATABASE_URL` and confirm the target host and database name. Supported targets are SQLite or PostgreSQL on `localhost`, a loopback address, or the `db` service from this repository's local Docker Compose configuration. Never run this command against production or a shared staging database.

Set credentials through environment variables only. Do not put real credentials in source control or documentation:

```powershell
Set-Location D:\Project-69\UniResearch\backend

$env:APP_ENV='development'
$env:DEV_ADMIN_EMAIL='admin-local@example.com'
$env:DEV_ADMIN_PASSWORD='<enter-a-local-development-password>'

python -m app.scripts.create_admin
python -m uvicorn app.main:app --reload
```

The command always assigns the exact role `admin`, creates an active account, and hashes the password with the application's existing password helper. It never accepts a role argument and never prints the password. Running it again for an existing administrator succeeds without changing the password or creating a duplicate. If the email belongs to a student, advisor, guest, or any other non-admin role, the command refuses to promote or modify that account; use a separate development email or request an approved backend-team action.

Start the frontend in a separate terminal:

```powershell
Set-Location D:\Project-69\UniResearch\frontend
pnpm.cmd dev
```

Open `http://localhost:3000/login?next=/admin`, enter `DEV_ADMIN_EMAIL` and the development password, and submit. Confirm the redirect to `/admin`, then open `/admin/categories`. Merely viewing `/admin` does not prove administrator authorization because its statistics request is public. A category creation returning HTTP 200 verifies administrator authorization, but perform that write only against a disposable development database. HTTP 403 means login succeeded but the database account is not an administrator.

Production administrator provisioning requires a separate approved backend-team process. This development command must remain separate from public registration, and credentials must never be committed.
