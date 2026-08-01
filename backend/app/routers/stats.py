from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.database import get_db
from app.models.research import ResearchWork
from app.models.interactions import DownloadViewLog
from app.models.user import User

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    users_count = await db.scalar(select(func.count(User.id)))
    projects_count = await db.scalar(select(func.count(ResearchWork.id)))
    
    total_views = await db.scalar(select(func.sum(ResearchWork.view_count)))
    total_downloads = await db.scalar(select(func.sum(ResearchWork.download_count)))
    
    return {
        "total_users": users_count or 0,
        "total_research_works": projects_count or 0,
        "total_views": total_views or 0,
        "total_downloads": total_downloads or 0
    }
