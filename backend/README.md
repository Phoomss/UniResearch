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
├── Dockerfile        # การสร้าง Docker Container
├── docker-compose.yml# การรันระบบพร้อม PostgreSQL DB
├── requirements.txt  # Python Dependencies
├── .gitignore        # ไฟล์ยกเว้นการอัปโหลด Git
└── README.md         # เอกสารแนะนำโปรเจกต์
```

---

## 🐳 วิธีการรันระบบด้วย Docker (แนะนำ)

เพื่อการติดตั้งที่รวดเร็วและถูกต้อง แนะนำให้รันระบบผ่าน **Docker Compose** ซึ่งจะทำการเซ็ตอัปทั้ง FastAPI backend และ PostgreSQL database ให้อัตโนมัติ:

1. **รันระบบขึ้นมา**:
   ```bash
   docker-compose up --build
   ```

2. **เปิดหน้า API Documentation (Swagger UI)**:
   เข้าไปที่: [http://localhost:8000/docs](http://localhost:8000/docs) เพื่อทดลองเรียกใช้งาน endpoint ต่างๆ

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
เมื่อรันเสร็จสิ้น สามารถเข้าสู่หน้าระบบเอกสาร API ที่: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 การทดสอบระบบ (Testing)

โปรเจกต์นี้มาพร้อมกับชุดทดสอบ Unit tests ครอบคลุมการทำงานหลักทั้งหมด (Auth, Research Submission, Review/Approve, Search) โดยทดสอบบน Memory database เพื่อความเป็นอิสระและรวดเร็ว:

รันคำสั่งทดสอบด้านล่าง:
```bash
PYTHONPATH=. pytest tests/ -v
```
