import shutil
import json
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from app.db.database import get_db
from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, ReviewComment
from app.models.interactions import DownloadViewLog, SearchLog
from app.models.user import User
from app.schemas.research import ResearchWorkResponse, ReviewCommentCreate, ReviewCommentResponse
from app.routers.deps import get_current_active_user, require_role, get_current_user

router = APIRouter(prefix="/research", tags=["research"])

UPLOAD_COVERS_DIR = Path("static/uploads/covers")
UPLOAD_DOCS_DIR = Path("static/uploads/docs")
UPLOAD_COVERS_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DOCS_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/", response_model=ResearchWorkResponse)
async def create_research(
    title_th: str = Form(...),
    title_en: str = Form(...),
    category_id: int = Form(...),
    abstract: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    work_type: Optional[str] = Form(None),
    academic_year: Optional[int] = Form(None),
    keywords: Optional[str] = Form(None),
    author_ids: str = Form("[]"), # JSON array string
    advisor_ids: str = Form("[]"), # JSON array string
    cover_image: UploadFile = File(None),
    document: UploadFile = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "student"]))
):
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

@router.get("/search", response_model=List[ResearchWorkResponse])
async def search_research(
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
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
        await db.commit()
        
    if category_id:
        query = query.where(ResearchWork.category_id == category_id)

    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{research_id}", response_model=ResearchWorkResponse)
async def get_research_detail(
    research_id: int, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))
    research = result.scalars().first()
    if not research:
        raise HTTPException(status_code=404, detail="Not found")
    
    research.view_count += 1
    db.add(DownloadViewLog(research_id=research.id, action_type="view"))
    await db.commit()
    await db.refresh(research)
    return research

@router.post("/{research_id}/download")
async def download_research(
    research_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))
    research = result.scalars().first()
    if not research or not research.file_path:
        raise HTTPException(status_code=404, detail="File not found")
        
    research.download_count += 1
    db.add(DownloadViewLog(research_id=research.id, user_id=current_user.id, action_type="download"))
    await db.commit()
    
    return {"file_url": f"/{research.file_path}"}

@router.post("/{research_id}/review", response_model=ReviewCommentResponse)
async def review_research(
    research_id: int,
    review_in: ReviewCommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["advisor", "admin"]))
):
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
