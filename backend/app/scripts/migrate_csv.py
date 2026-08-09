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

STUDENTS_CSV = os.path.abspath(os.path.join(os.path.dirname(__file__), "student.csv"))
ADVISORS_CSV = os.path.abspath(os.path.join(os.path.dirname(__file__), "advisors.csv"))

async def migrate_csv_to_db():
    print("=== Starting Student & Advisor Migration ===")
    
    async with AsyncSessionLocal() as session:
        # 1. Process Students
        if os.path.exists(STUDENTS_CSV):
            print(f"Reading students from: {STUDENTS_CSV}")
            with open(STUDENTS_CSV, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                student_count = 0
                for row in reader:
                    email = row["email"].strip()
                    # Check if user already exists
                    result = await session.execute(select(User).where(User.email == email))
                    existing = result.scalars().first()
                    
                    if not existing:
                        # Hash the password (using hashed_password field from CSV or default to student_id)
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
                
                print(f"Adding {student_count} new students...")
        else:
            print(f"Error: {STUDENTS_CSV} not found!")

        # 2. Process Advisors
        if os.path.exists(ADVISORS_CSV):
            print(f"Reading advisors from: {ADVISORS_CSV}")
            with open(ADVISORS_CSV, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                advisor_count = 0
                for row in reader:
                    email = row["email"].strip()
                    # Check if user already exists
                    result = await session.execute(select(User).where(User.email == email))
                    existing = result.scalars().first()
                    
                    if not existing:
                        # Hash the password (using hashed_password field from CSV or default)
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
                
                print(f"Adding {advisor_count} new advisors...")
        else:
            print(f"Error: {ADVISORS_CSV} not found!")

        try:
            await session.commit()
            print("=== Migration completed successfully! ===")
        except Exception as e:
            await session.rollback()
            print(f"Error committing migration: {e}")

if __name__ == "__main__":
    asyncio.run(migrate_csv_to_db())
