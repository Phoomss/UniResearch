import asyncio
import os
import sys

# Add backend app path to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.options import Department, WorkType

DATABASE_URL = "postgresql+asyncpg://postgres:postgrespassword@localhost:5433/uniresearch"
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed():
    async with AsyncSessionLocal() as db:
        # Seed departments
        defaults_depts = [
            "วิทยาการคอมพิวเตอร์",
            "เทคโนโลยีสารสนเทศ",
            "วิศวกรรมคอมพิวเตอร์",
            "วิศวกรรมซอฟต์แวร์",
            "เทคโนโลยีมัลติมีเดีย",
            "การจัดการเทคโนโลยีสารสนเทศ",
            "ความมั่นคงปลอดภัยไซเบอร์",
            "วิทยาศาสตร์ข้อมูลและการวิเคราะห์"
        ]
        for name in defaults_depts:
            db.add(Department(name=name))
        
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
            db.add(WorkType(name=name))
            
        await db.commit()
    print("Seed options successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
