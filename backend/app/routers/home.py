from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.db.database import get_db
from app.models.research import ResearchWork
from app.schemas.research import ResearchWorkResponse
from typing import List

router = APIRouter(prefix="/home", tags=["home"])

@router.get("/latest", response_model=List[ResearchWorkResponse])
async def get_latest_research(limit: int = 5, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResearchWork)
        .where(ResearchWork.status == "approved")
        .order_by(desc(ResearchWork.published_at))
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/popular", response_model=List[ResearchWorkResponse])
async def get_popular_research(limit: int = 5, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResearchWork)
        .where(ResearchWork.status == "approved")
        .order_by(desc(ResearchWork.view_count))
        .limit(limit)
    )
    return result.scalars().all()
