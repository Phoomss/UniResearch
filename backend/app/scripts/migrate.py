# -*- coding: utf-8 -*-
import asyncio
import csv
import json
import os
import sys
from pathlib import Path
from uuid import uuid4
from datetime import datetime

from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

# Add backend root to path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.core.security import get_password_hash
from app.core.config import settings
from app.db.database import engine, Base, AsyncSessionLocal
from app.models.user import User
from app.models.category import Category
from app.models.options import Department, WorkType
from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, FileRevision, ReviewComment

STUDENTS_CSV = os.path.abspath(os.path.join(os.path.dirname(__file__), "student.csv"))
ADVISORS_CSV = os.path.abspath(os.path.join(os.path.dirname(__file__), "advisors.csv"))

async def init_db():
    print("=== 1. Initializing Database Schema ===")
    async with engine.begin() as conn:
        try:
            print("-> Creating vector extension if not exists...")
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        except Exception as e:
            print(f"   Note: Could not create vector extension (might require superuser): {e}")
        
        print("-> Creating all database tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("   Database tables initialized.")

async def seed_options(session: AsyncSession):
    print("=== 2. Seeding Default Departments and Work Types ===")
    
    # Seed departments
    defaults_depts = [
        "วิทยาการคอมพิวเตอร์",
        "เทคโนโลยีสารสนเทศ",
        "วิศวกรรมคอมพิวเตอร์",
        "วิศวกรรมซอฟต์แวร์",
        "เทคโนโลยีมัลติมีเดีย",
        "เทคโนโลยีมัลทีมีเดีย",
        "การจัดการเทคโนโลยีสารสนเทศ",
        "ความมั่นคงปลอดภัยไซเบอร์",
        "วิทยาศาสตร์ข้อมูลและการวิเคราะห์"
    ]
    dept_count = 0
    for name in defaults_depts:
        result = await session.execute(select(Department).where(Department.name == name))
        if not result.scalars().first():
            session.add(Department(name=name))
            dept_count += 1
    print(f"   Added {dept_count} new departments.")
    
    # Seed work types
    defaults_types = [
        "โครงงานวิทยาศาสตร์",
        "วิทยานิพนธ์",
        "สารนิพนธ์",
        "งานวิจัยระดับปริญญาตรี",
        "งานวิจัยระดับบัณฑิตศึกษา",
        "บทความวิชาการ",
        "โครงงานพัฒนาซอฟต์แวร์",
        "นวัตกรรม/สิ่งประดิษฐ์"
    ]
    type_count = 0
    for name in defaults_types:
        result = await session.execute(select(WorkType).where(WorkType.name == name))
        if not result.scalars().first():
            session.add(WorkType(name=name))
            type_count += 1
    print(f"   Added {type_count} new work types.")

async def provision_admin(session: AsyncSession):
    print("=== 3. Provisioning Administrator ===")
    admin_email = os.getenv("DEV_ADMIN_EMAIL") or (settings.DEV_ADMIN_EMAIL) or "admin@uniresearch.ac.th"
    admin_password = os.getenv("DEV_ADMIN_PASSWORD") or (settings.DEV_ADMIN_PASSWORD.get_secret_value() if settings.DEV_ADMIN_PASSWORD else None) or "password123"
    
    result = await session.execute(select(User).where(User.email == admin_email))
    existing = result.scalars().first()
    if not existing:
        user = User(
            email=admin_email,
            hashed_password=get_password_hash(admin_password),
            role="admin",
            first_name="สมชาย",
            last_name="แอดมิน",
            is_active=True,
        )
        session.add(user)
        print(f"   Created Admin: {admin_email}")
    else:
        print(f"   Admin already exists: {admin_email}")

async def migrate_csv(session: AsyncSession):
    print("=== 4. Migrating Students & Advisors from CSV ===")
    
    # 1. Process Students
    if os.path.exists(STUDENTS_CSV):
        print(f"-> Reading students from: {STUDENTS_CSV}")
        with open(STUDENTS_CSV, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            student_count = 0
            for row in reader:
                email = row["email"].strip()
                result = await session.execute(select(User).where(User.email == email))
                existing = result.scalars().first()
                
                if not existing:
                    raw_pwd = row.get("hashed_password") or row.get("student_id") or "password123"
                    hashed_pwd = get_password_hash(raw_pwd.strip())
                    
                    student = User(
                      email=email,
                      hashed_password=hashed_pwd,
                      role="student",
                      student_id=row["student_id"].strip(),
                      department=row["department"].strip(),
                      first_name=row["first_name"].strip(),
                      last_name=row["last_name"].strip(),
                      is_active=row["is_active"].strip().lower() == "true"
                    )
                    session.add(student)
                    student_count += 1
                else:
                    existing.student_id = row["student_id"].strip()
                    existing.department = row["department"].strip()
                    existing.first_name = row["first_name"].strip()
                    existing.last_name = row["last_name"].strip()
                    existing.is_active = row["is_active"].strip().lower() == "true"
                    session.add(existing)
            print(f"   Students processed (Added {student_count} new students).")
    else:
        print(f"   Note: student.csv not found at {STUDENTS_CSV}, skipping student migration.")

    # 2. Process Advisors
    if os.path.exists(ADVISORS_CSV):
        print(f"-> Reading advisors from: {ADVISORS_CSV}")
        with open(ADVISORS_CSV, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            advisor_count = 0
            for row in reader:
                email = row["email"].strip()
                result = await session.execute(select(User).where(User.email == email))
                existing = result.scalars().first()
                
                if not existing:
                    raw_pwd = row.get("hashed_password") or "password123"
                    hashed_pwd = get_password_hash(raw_pwd.strip())
                    
                    advisor = User(
                      email=email,
                      hashed_password=hashed_pwd,
                      role="advisor",
                      student_id=None,
                      department=row["department"].strip(),
                      first_name=row["first_name"].strip(),
                      last_name=row["last_name"].strip(),
                      is_active=row["is_active"].strip().lower() == "true"
                    )
                    session.add(advisor)
                    advisor_count += 1
                else:
                    existing.department = row["department"].strip()
                    existing.first_name = row["first_name"].strip()
                    existing.last_name = row["last_name"].strip()
                    existing.is_active = row["is_active"].strip().lower() == "true"
                    session.add(existing)
            print(f"   Advisors processed (Added {advisor_count} new advisors).")
    else:
        print(f"   Note: advisors.csv not found at {ADVISORS_CSV}, skipping advisor migration.")

async def seed_thai_data(session: AsyncSession):
    print("=== 5. Seeding Thai Language Mockup Categories & Research Papers ===")
    
    # 1. Ensure mock users exist
    mock_users_info = [
        {
            "email": "advisor1@uniresearch.ac.th",
            "password": "password123",
            "role": "advisor",
            "first_name": "ดร.วิชา",
            "last_name": "เชี่ยวชาญ",
            "department": "วิทยาการคอมพิวเตอร์"
        },
        {
            "email": "advisor2@uniresearch.ac.th",
            "password": "password123",
            "role": "advisor",
            "first_name": "ผศ.ดร.มานะ",
            "last_name": "หมั่นเพียร",
            "department": "วิศวกรรมคอมพิวเตอร์"
        },
        {
            "email": "student1@uniresearch.ac.th",
            "password": "password123",
            "role": "student",
            "first_name": "สมเกียรติ",
            "last_name": "เรียนดี",
            "student_id": "62010001",
            "department": "วิทยาการคอมพิวเตอร์"
        },
        {
            "email": "student2@uniresearch.ac.th",
            "password": "password123",
            "role": "student",
            "first_name": "วิภา",
            "last_name": "ขยันยิ่ง",
            "student_id": "62010002",
            "department": "วิศวกรรมคอมพิวเตอร์"
        }
    ]
    
    user_map = {}
    for u in mock_users_info:
        result = await session.execute(select(User).where(User.email == u["email"]))
        existing = result.scalars().first()
        if not existing:
            user = User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
                first_name=u["first_name"],
                last_name=u["last_name"],
                student_id=u.get("student_id"),
                department=u.get("department"),
                is_active=True
            )
            session.add(user)
            await session.flush()
            user_map[u["email"]] = user.id
            print(f"   Created mock user: {u['email']}")
        else:
            user_map[u["email"]] = existing.id
            print(f"   Mock user already exists: {u['email']}")

    # Get Admin user ID
    admin_email = os.getenv("DEV_ADMIN_EMAIL") or (settings.DEV_ADMIN_EMAIL) or "admin@uniresearch.ac.th"
    admin_result = await session.execute(select(User).where(User.email == admin_email))
    admin_user = admin_result.scalars().first()
    if admin_user:
        user_map[admin_email] = admin_user.id

    # 2. Seed Categories
    categories = [
        {"category_name": "วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์", "description": "การวิจัยและนวัตกรรมทางด้านคอมพิวเตอร์ ปัญญาประดิษฐ์ การประมวลผลข้อมูล และเครือข่าย"},
        {"category_name": "วิศวกรรมศาสตร์และนาโนเทคโนโลยี", "description": "การพัฒนาและประยุกต์ใช้องค์ความรู้ทางวิศวกรรมและเทคโนโลยีระดับนาโน"},
        {"category_name": "วิทยาศาสตร์ข้อมูลเชิงประยุกต์", "description": "การประยุกต์ใช้วิทยาการข้อมูลเพื่อแก้ไขปัญหาจริงในอุตสาหกรรม"},
        {"category_name": "เทคโนโลยีการศึกษาและนวัตกรรมการเรียนรู้", "description": "การวิจัยเครื่องมือและระบบการสอนยุคใหม่"}
    ]
    
    category_ids = []
    for cat in categories:
        result = await session.execute(select(Category).where(Category.category_name == cat["category_name"]))
        existing = result.scalars().first()
        if not existing:
            new_cat = Category(category_name=cat["category_name"], description=cat["description"])
            session.add(new_cat)
            await session.flush()
            category_ids.append(new_cat.id)
            print(f"   Created Category: {cat['category_name']}")
        else:
            category_ids.append(existing.id)
            print(f"   Category already exists: {cat['category_name']}")

    # 3. Setup paths for upload cover image & documents
    covers_dir = settings.STATIC_DIR / "uploads" / "covers"
    docs_dir = settings.STATIC_DIR / "uploads" / "docs"
    covers_dir.mkdir(parents=True, exist_ok=True)
    docs_dir.mkdir(parents=True, exist_ok=True)
    
    dummy_cover = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc`\x00\x00\x00\x02\x00\x01H\xaf\xa4q\x00\x00\x00\x00IEND\xaeB`\x82"
    dummy_pdf = b"%PDF-1.4\n%EOF"

    # 4. Define Mock Research Works
    research_papers = [
        {
            "submitter_email": "student1@uniresearch.ac.th",
            "title_th": "การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์",
            "title_en": "Development of an Automatic Research Topic Recommendation System using Artificial Intelligence",
            "category_id": category_ids[0],
            "abstract": "งานวิจัยนี้นำเสนอการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์อัตโนมัติ สำหรับนักศึกษาและอาจารย์ เพื่อเป็นตัวช่วยในการค้นหาแนวทางการตั้งโจทย์วิจัยที่เหมาะสม โดยการวิเคราะห์ข้อมูลความสนใจ ทักษะ และประวัติการทำโครงงานก่อนหน้าของผู้ใช้งาน ระบบใช้โมเดลโครงข่ายประสาทเทียมลึก (Deep Neural Networks) ในการประมวลผลภาษาธรรมชาติของบทคัดย่อภาษาไทยและภาษาอังกฤษ ผลสัมฤทธิ์พบว่ามีความถูกต้องในการแนะนำหัวข้อที่ผู้ใช้พึงพอใจสูงถึงร้อยละ 87.5",
            "department": "วิทยาการคอมพิวเตอร์",
            "work_type": "วิทยานิพนธ์",
            "academic_year": 2568,
            "keywords": "ปัญญาประดิษฐ์, ระบบแนะนำ, การประมวลผลภาษาธรรมชาติ, โครงงานวิจัย",
            "authors": ["student1@uniresearch.ac.th"],
            "advisors": ["advisor1@uniresearch.ac.th"],
            "review": {
                "reviewer_email": "advisor1@uniresearch.ac.th",
                "comment_text": "เนื้อหาดีมาก มีความเป็นระบอบระเบียบ มีการวิเคราะห์ผลลัพธ์ที่ชัดเจนและครอบคลุม อนุมัติให้เผยแพร่ได้",
                "status_result": "approved"
            }
        },
        {
            "submitter_email": "student2@uniresearch.ac.th",
            "title_th": "การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย",
            "title_en": "Performance Evaluation of Transformer-based NLP Models for Thai Research Document Classification",
            "category_id": category_ids[0],
            "abstract": "เอกสารวิจัยนี้นำเสนอการประเมินและเปรียบเทียบประสิทธิภาพของสถาปัตยกรรมโมเดล Transformer ประเภทต่างๆ เช่น WangchanBERTa และ Multilingual BERT ในการทำความเข้าใจและคัดแยกหมวดหมู่เอกสารงานวิจัยวิชาการภาษาไทย ผลการทดลองบนคลังข้อมูลขนาด 5,000 ชิ้นแสดงให้เห็นว่าการปรับจูนไฮเปอร์พารามิเตอร์แบบกำหนดเองให้ผลลัพธ์ที่มีคะแนน F1-score สูงถึง 91.2% ซึ่งเป็นประโยชน์อย่างมากต่อการนำไปใช้งานในคลังห้องสมุดดิจิทัลแบบอัตโนมัติ",
            "department": "วิศวกรรมคอมพิวเตอร์",
            "work_type": "วิทยานิพนธ์",
            "academic_year": 2567,
            "keywords": "การประมวลผลภาษาธรรมชาติ, สถาปัตยกรรมหม้อแปลง, การจัดหมวดหมู่เอกสาร, ภาษาไทย",
            "authors": ["student2@uniresearch.ac.th"],
            "advisors": ["advisor2@uniresearch.ac.th"],
            "review": {
                "reviewer_email": "advisor2@uniresearch.ac.th",
                "comment_text": "การวิเคราะห์โมเดลละเอียดดีมาก ข้อคิดเห็นเพิ่มคือควรเพิ่มเปรียบเทียบกับโมเดลแบบเดิมอีกเล็กน้อยในบทความหลัก แต่อยู่ในเกณฑ์ดีมาก อนุมัติ",
                "status_result": "approved"
            }
        },
        {
            "submitter_email": "student1@uniresearch.ac.th",
            "title_th": "การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล",
            "title_en": "Energy-Efficient Sensor Design for Smart Agriculture in Remote Areas",
            "category_id": category_ids[1],
            "abstract": "โครงงานนี้นำเสนอแนวทางการออกแบบตัวประมวลผลและเซ็นเซอร์วัดความชื้นในดินและอุณหภูมิที่ทำงานโดยใช้พลังงานต่ำมาก (Ultra-low power) เพื่อใช้กับระบบฟาร์มอัจฉริยะในท้องถิ่นชนบทห่างไกลที่ไม่มีไฟฟ้าและสัญญาณอินเทอร์เน็ตที่เสถียร โดยส่งสัญญาณผ่านโปรโตคอล LoRaWAN ทำให้แบตเตอรี่หนึ่งก้อนสามารถใช้งานได้ยาวนานเกิน 3 ปี",
            "department": "วิทยาการคอมพิวเตอร์",
            "work_type": "โครงงานวิจัย",
            "academic_year": 2568,
            "keywords": "เกษตรอัจฉริยะ, พลังงานต่ำ, เซ็นเซอร์, LoRaWAN",
            "authors": ["student1@uniresearch.ac.th"],
            "advisors": ["advisor1@uniresearch.ac.th"],
            "review": {
                "reviewer_email": "advisor1@uniresearch.ac.th",
                "comment_text": "เป็นผลงานที่มีการทดสอบและสร้างต้นแบบขึ้นจริง มีความสมบูรณ์สูงมาก อนุมัติ",
                "status_result": "approved"
            }
        },
        {
            "submitter_email": "student2@uniresearch.ac.th",
            "title_th": "การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา",
            "title_en": "Development of a Digital Repository for Educational Research in Higher Education Institutions",
            "category_id": category_ids[3],
            "abstract": "การวิจัยครั้งนี้มีวัตถุประสงค์เพื่อพัฒนาแพลตฟอร์มคลังความรู้ดิจิทัลสำหรับรวบรวมและเปิดให้ดาวน์โหลดผลงานวิจัยนวัตกรรมการเรียนรู้ของบุคลากรทางการศึกษา ระบบมีส่วนช่วยในการแบ่งปันและแลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัยได้อย่างมีประสิทธิภาพ",
            "department": "วิศวกรรมคอมพิวเตอร์",
            "work_type": "วิทยานิพนธ์",
            "academic_year": 2568,
            "keywords": "คลังความรู้ดิจิทัล, ผลงานวิจัยทางการศึกษา, การจัดการความรู้",
            "authors": ["student2@uniresearch.ac.th"],
            "advisors": ["advisor2@uniresearch.ac.th"],
            "review": {
                "reviewer_email": "advisor2@uniresearch.ac.th",
                "comment_text": "เนื้อหาดีและน่าสนใจมาก รูปแบบการพัฒนาคลังข้อมูลครอบคลุมความปลอดภัยและการใช้งานง่ายดี ผ่านเกณฑ์",
                "status_result": "approved"
            }
        }
    ]

    for p in research_papers:
        # Check if research paper already exists (by title_th)
        chk = await session.execute(select(ResearchWork).where(ResearchWork.title_th == p["title_th"]))
        existing_paper = chk.scalars().first()
        if existing_paper:
            print(f"   Research work already exists: {p['title_th']}")
            continue
            
        # Write dummy files to static folder
        cover_filename = f"{uuid4().hex}.png"
        doc_filename = f"{uuid4().hex}.pdf"
        
        cover_path = covers_dir / cover_filename
        doc_path = docs_dir / doc_filename
        
        cover_path.write_bytes(dummy_cover)
        doc_path.write_bytes(dummy_pdf)
        
        db_cover_rel_path = f"uploads/covers/{cover_filename}"
        db_doc_rel_path = f"uploads/docs/{doc_filename}"

        submitter_id = user_map.get(p["submitter_email"])
        
        # Create ResearchWork
        work = ResearchWork(
            title_th=p["title_th"],
            title_en=p["title_en"],
            abstract=p["abstract"],
            category_id=p["category_id"],
            department=p["department"],
            work_type=p["work_type"],
            academic_year=p["academic_year"],
            keywords=p["keywords"],
            cover_image_path=db_cover_rel_path,
            file_path=db_doc_rel_path,
            status=p["review"]["status_result"],
            submitted_by_id=submitter_id,
            published_at=datetime.utcnow() if p["review"]["status_result"] == "approved" else None
        )
        session.add(work)
        await session.flush()
        
        # Create Authors
        for author_email in p["authors"]:
            author_uid = user_map.get(author_email)
            if author_uid:
                author_rel = ResearchAuthor(research_id=work.id, user_id=author_uid, role_in_work="primary")
                session.add(author_rel)
                
        # Create Advisors
        for advisor_email in p["advisors"]:
            advisor_uid = user_map.get(advisor_email)
            if advisor_uid:
                advisor_rel = ResearchAdvisor(research_id=work.id, user_id=advisor_uid)
                session.add(advisor_rel)
                
        # Create FileRevision
        revision = FileRevision(
            research_id=work.id,
            file_path=db_doc_rel_path,
            version_no=1,
            uploaded_by=submitter_id
        )
        session.add(revision)
        
        # Create ReviewComment
        reviewer_id = user_map.get(p["review"]["reviewer_email"])
        if reviewer_id:
            review = ReviewComment(
                research_id=work.id,
                reviewer_id=reviewer_id,
                comment_text=p["review"]["comment_text"],
                status_result=p["review"]["status_result"]
            )
            session.add(review)
            
        print(f"   Created mock paper & approved: {p['title_th']}")

async def main():
    print("=== Starting Unified Migration and Seeding Script ===")
    await init_db()
    
    async with AsyncSessionLocal() as session:
        await seed_options(session)
        await provision_admin(session)
        await migrate_csv(session)
        await seed_thai_data(session)
        
        try:
            await session.commit()
            print("=== Seeding and Migration Completed Successfully! ===")
        except Exception as e:
            await session.rollback()
            print(f"Error during commit: {e}")

if __name__ == "__main__":
    asyncio.run(main())
