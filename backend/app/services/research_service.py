import shutil
import json
from pathlib import Path
from typing import List, Optional
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, ReviewComment
from app.models.interactions import DownloadViewLog, SearchLog
from app.models.user import User
from app.schemas.research import ReviewCommentCreate

UPLOAD_COVERS_DIR = Path("static/uploads/covers")
UPLOAD_DOCS_DIR = Path("static/uploads/docs")
UPLOAD_COVERS_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DOCS_DIR.mkdir(parents=True, exist_ok=True)

async def create_research(
    db: AsyncSession,
    current_user: User,
    title_th: str,
    title_en: str,
    category_id: int,
    abstract: Optional[str],
    department: Optional[str],
    work_type: Optional[str],
    academic_year: Optional[int],
    keywords: Optional[str],
    author_ids: str,
    advisor_ids: str,
    cover_image: Optional[UploadFile],
    document: Optional[UploadFile]
) -> ResearchWork:
    cover_path = None
    doc_path = None
    
    if cover_image:
        cover_path = str(UPLOAD_COVERS_DIR / cover_image.filename)
        with open(cover_path, "wb") as buffer:
            shutil.copyfileobj(cover_image.file, buffer)
            
    if document:
        doc_path = str(UPLOAD_DOCS_DIR / document.filename)
        with open(doc_path, "wb") as buffer:
            shutil.copyfileobj(document.file, buffer)

    new_project = ResearchWork(
        title_th=title_th,
        title_en=title_en,
        category_id=category_id,
        abstract=abstract,
        department=department,
        work_type=work_type,
        academic_year=academic_year,
        keywords=keywords,
        cover_image_path=cover_path,
        file_path=doc_path,
        submitted_by_id=current_user.id
    )
    db.add(new_project)
    await db.flush()

    authors = json.loads(author_ids)
    for aid in authors:
        db.add(ResearchAuthor(research_id=new_project.id, user_id=aid))
        
    advisors = json.loads(advisor_ids)
    for adv_id in advisors:
        db.add(ResearchAdvisor(research_id=new_project.id, user_id=adv_id))

    await db.commit()
    await db.refresh(new_project)
    return new_project

async def search_research(db: AsyncSession, q: Optional[str], category_id: Optional[int]) -> List[ResearchWork]:
    query = select(ResearchWork).where(ResearchWork.status == "approved")
    if q:
        query = query.where(
            or_(
                ResearchWork.title_th.ilike(f"%{q}%"),
                ResearchWork.title_en.ilike(f"%{q}%"),
                ResearchWork.keywords.ilike(f"%{q}%")
            )
        )
        db.add(SearchLog(keyword=q))
        await db.flush()
        
    if category_id:
        query = query.where(ResearchWork.category_id == category_id)

    result = await db.execute(query)
    await db.commit()
    return result.scalars().all()

async def get_research_detail(db: AsyncSession, research_id: int) -> ResearchWork:
    result = await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))
    research = result.scalars().first()
    if not research:
        raise HTTPException(status_code=404, detail="Not found")
    
    research.view_count += 1
    db.add(DownloadViewLog(research_id=research.id, action_type="view"))
    await db.commit()
    await db.refresh(research)
    return research

async def download_research(db: AsyncSession, current_user: User, research_id: int) -> dict:
    result = await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))
    research = result.scalars().first()
    if not research or not research.file_path:
        raise HTTPException(status_code=404, detail="File not found")
        
    research.download_count += 1
    db.add(DownloadViewLog(research_id=research.id, user_id=current_user.id, action_type="download"))
    await db.commit()
    
    return {"file_url": f"/{research.file_path}"}

async def review_research(db: AsyncSession, current_user: User, research_id: int, review_in: ReviewCommentCreate) -> ReviewComment:
    result = await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))
    research = result.scalars().first()
    if not research:
        raise HTTPException(status_code=404, detail="Not found")
        
    new_review = ReviewComment(
        research_id=research.id,
        reviewer_id=current_user.id,
        comment_text=review_in.comment_text,
        status_result=review_in.status_result
    )
    research.status = review_in.status_result
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    return new_review
