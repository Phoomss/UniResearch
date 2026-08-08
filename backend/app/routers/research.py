from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.user import User
from app.schemas.research import ResearchParticipantsResponse, ResearchWorkResponse, ReviewCommentCreate, ReviewCommentResponse
from app.routers.deps import get_current_active_user, require_role, oauth2_scheme
from app.services import research_service

router = APIRouter(prefix="/research", tags=["research"])

@router.get("/participants", response_model=ResearchParticipantsResponse)
async def get_research_participants(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "student", "advisor"]))
):
    return await research_service.get_research_participants(db, current_user)

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
    author_ids: str = Form("[]"),
    advisor_ids: str = Form("[]"),
    cover_image: UploadFile = File(None),
    document: UploadFile = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "student", "advisor"]))
):
    return await research_service.create_research(
        db=db, current_user=current_user,
        title_th=title_th, title_en=title_en, category_id=category_id,
        abstract=abstract, department=department, work_type=work_type,
        academic_year=academic_year, keywords=keywords,
        author_ids=author_ids, advisor_ids=advisor_ids,
        cover_image=cover_image, document=document
    )

from fastapi.security import OAuth2PasswordBearer
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

@router.get("/search", response_model=List[ResearchWorkResponse])
async def search_research(
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(optional_oauth2_scheme)
):
    # Retrieve user optionally if token is provided to filter search by role
    current_user = None
    if token:
        try:
            from app.routers.deps import get_current_user
            current_user = await get_current_user(token, db)
        except Exception:
            pass
    return await research_service.search_research(db, q, category_id, current_user)

@router.get("/my", response_model=List[ResearchWorkResponse])
async def get_my_research(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    from sqlalchemy import select, or_
    from sqlalchemy.orm import selectinload
    from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, ReviewComment
    query = select(ResearchWork).where(
        or_(
            ResearchWork.submitted_by_id == current_user.id,
            ResearchWork.id.in_(select(ResearchAuthor.research_id).where(ResearchAuthor.user_id == current_user.id))
        )
    ).options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
        selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
    ).order_by(ResearchWork.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/pending", response_model=List[ResearchWorkResponse])
async def get_pending_research(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "advisor"]))
):
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, ReviewComment
    query = select(ResearchWork).where(ResearchWork.status == "pending").options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
        selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
    ).order_by(ResearchWork.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{research_id}", response_model=ResearchWorkResponse)
async def get_research_detail(
    research_id: int, 
    db: AsyncSession = Depends(get_db)
):
    return await research_service.get_research_detail(db, research_id)

@router.post("/{research_id}/download")
async def download_research(
    research_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await research_service.download_research(db, current_user, research_id)

@router.post("/{research_id}/review", response_model=ReviewCommentResponse)
async def review_research(
    research_id: int,
    review_in: ReviewCommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["advisor", "admin"]))
):
    return await research_service.review_research(db, current_user, research_id, review_in)

@router.put("/{research_id}", response_model=ResearchWorkResponse)
async def update_research(
    research_id: int,
    title_th: str = Form(...),
    title_en: str = Form(...),
    category_id: int = Form(...),
    abstract: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    work_type: Optional[str] = Form(None),
    academic_year: Optional[int] = Form(None),
    keywords: Optional[str] = Form(None),
    author_ids: str = Form("[]"),
    advisor_ids: str = Form("[]"),
    cover_image: UploadFile = File(None),
    document: UploadFile = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "student", "advisor"]))
):
    return await research_service.update_research(
        db=db, research_id=research_id, current_user=current_user,
        title_th=title_th, title_en=title_en, category_id=category_id,
        abstract=abstract, department=department, work_type=work_type,
        academic_year=academic_year, keywords=keywords,
        author_ids=author_ids, advisor_ids=advisor_ids,
        cover_image=cover_image, document=document
    )

@router.delete("/{research_id}")
async def delete_research(
    research_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "student", "advisor"]))
):
    await research_service.delete_research(db=db, research_id=research_id, current_user=current_user)
    return {"message": "Research deleted successfully"}
