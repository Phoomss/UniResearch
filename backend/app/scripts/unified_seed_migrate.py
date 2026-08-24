# -*- coding: utf-8 -*-
import asyncio
import csv
import os
import sys
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

# Add backend root to path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.core.security import get_password_hash
from app.db.database import AsyncSessionLocal
from app.models.user import User
from app.models.options import Department, WorkType

STUDENTS_CSV = os.path.abspath(os.path.join(os.path.dirname(__file__), "student.csv"))
ADVISORS_CSV = os.path.abspath(os.path.join(os.path.dirname(__file__), "advisors.csv"))

async def seed_options(session: AsyncSession):
    print("-> Seeding default departments and work types...")
    # Seed departments
    defaults_depts = [
        "วิทยาการคอมพิวเตอร์",
        "เทคโนโลยีสารสนเทศ",
        "วิศวกรรมคอมพิวเตอร์",
        "วิศวกรรมซอฟต์แวร์",
        "เทคโนโลยีมัลทีมีเดีย",
        "การจัดการเทคโนโลยีสารสนเทศ",
        "ความมั่นคงปลอดภัยไซเบอร์",
        "วิทยาศาสตร์ข้อมูลและการวิเคราะห์"
    ]
    for name in defaults_depts:
        result = await session.execute(select(Department).where(Department.name == name))
        if not result.scalars().first():
            session.add(Department(name=name))
    
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
    for name in defaults_types:
        result = await session.execute(select(WorkType).where(WorkType.name == name))
        if not result.scalars().first():
            session.add(WorkType(name=name))

async def provision_admin(session: AsyncSession):
    print("-> Provisioning default administrator...")
    admin_email = os.getenv("DEV_ADMIN_EMAIL") or "admin@uniresearch.ac.th"
    admin_password = os.getenv("DEV_ADMIN_PASSWORD") or "password123"
    
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
    # 1. Process Students
    if os.path.exists(STUDENTS_CSV):
        print(f"-> Reading students from: {STUDENTS_CSV}")
        with open(STUDENTS_CSV, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
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
                else:
                    existing.student_id = row["student_id"].strip()
                    existing.department = row["department"].strip()
                    existing.first_name = row["first_name"].strip()
                    existing.last_name = row["last_name"].strip()
                    existing.is_active = row["is_active"].strip().lower() == "true"
                    session.add(existing)
            print("   Students processed.")
    else:
        print(f"   Note: student.csv not found, skipping student migration.")

    # 2. Process Advisors
    if os.path.exists(ADVISORS_CSV):
        print(f"-> Reading advisors from: {ADVISORS_CSV}")
        with open(ADVISORS_CSV, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
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
                else:
                    existing.department = row["department"].strip()
                    existing.first_name = row["first_name"].strip()
                    existing.last_name = row["last_name"].strip()
                    existing.is_active = row["is_active"].strip().lower() == "true"
                    session.add(existing)
            print("   Advisors processed.")
    else:
        print(f"   Note: advisors.csv not found, skipping advisor migration.")

async def main():
    print("=== Starting Unified Seed & Migration Script ===")
    async with AsyncSessionLocal() as session:
        await seed_options(session)
        await provision_admin(session)
        await migrate_csv(session)
        
        try:
            await session.commit()
            print("=== Seeding and Migration Completed Successfully! ===")
        except Exception as e:
            await session.rollback()
            print(f"Error during commit: {e}")

if __name__ == "__main__":
    asyncio.run(main())
