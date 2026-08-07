import json
import logging
import os
from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.models.category import Category
from app.models.interactions import DownloadViewLog, SearchLog
from app.models.research import ResearchAdvisor, ResearchAuthor, ResearchWork, ReviewComment
from app.models.user import User
from app.schemas.research import ReviewCommentCreate

logger = logging.getLogger(__name__)
UPLOAD_COVERS_DIR = settings.STATIC_DIR / "uploads" / "covers"
UPLOAD_DOCS_DIR = settings.STATIC_DIR / "uploads" / "docs"
COVER_TYPES = {"image/jpeg": {".jpg", ".jpeg"}, "image/png": {".png"}, "image/webp": {".webp"}}
DOCUMENT_TYPES = {"application/pdf": {".pdf"}}

def _parse_ids(raw: str, field: str) -> list[int]:
    try:
        values = json.loads(raw)
    except (TypeError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=422, detail=f"{field} must be a JSON array of user IDs") from exc
    if not isinstance(values, list) or any(isinstance(value, bool) or not isinstance(value, int) or value < 1 for value in values):
        raise HTTPException(status_code=422, detail=f"{field} must be a JSON array of positive integer user IDs")
    return list(dict.fromkeys(values))

def _participant(user: User, current_user: User) -> dict:
    return {"id": user.id, "email": user.email, "role": user.role, "first_name": user.first_name,
            "last_name": user.last_name, "student_id": user.student_id, "department": user.department,
            "is_current": user.id == current_user.id}

async def get_research_participants(db: AsyncSession, current_user: User) -> dict:
    result = await db.execute(select(User).where(User.is_active.is_(True), User.role.in_(["student", "advisor"])).order_by(User.first_name, User.last_name, User.email))
    users = result.scalars().all()
    return {"authors": [_participant(user, current_user) for user in users if user.role == "student"],
            "advisors": [_participant(user, current_user) for user in users if user.role == "advisor"]}

async def _validate_relations(db: AsyncSession, category_id: int, author_ids: list[int], advisor_ids: list[int]) -> None:
    if not await db.get(Category, category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    requested = set(author_ids + advisor_ids)
    if not requested:
        return
    result = await db.execute(select(User).where(User.id.in_(requested), User.is_active.is_(True)))
    users = {user.id: user for user in result.scalars().all()}
    missing = requested - users.keys()
    if missing:
        raise HTTPException(status_code=404, detail="One or more authors or advisors were not found")
    if any(users[user_id].role != "student" for user_id in author_ids):
        raise HTTPException(status_code=422, detail="author_ids may contain active student users only")
    if any(users[user_id].role != "advisor" for user_id in advisor_ids):
        raise HTTPException(status_code=422, detail="advisor_ids may contain active advisor users only")

def _signature_is_valid(content_type: str, content: bytes) -> bool:
    if content_type == "application/pdf": return content.startswith(b"%PDF-")
    if content_type == "image/png": return content.startswith(b"\x89PNG\r\n\x1a\n")
    if content_type == "image/jpeg": return content.startswith(b"\xff\xd8\xff")
    if content_type == "image/webp": return len(content) >= 12 and content[:4] == b"RIFF" and content[8:12] == b"WEBP"
    return False

async def _store_upload(upload: UploadFile, directory: Path, allowed: dict[str, set[str]], limit: int, label: str) -> tuple[Path, str]:
    suffix = Path(upload.filename or "").suffix.lower()
    if upload.content_type not in allowed or suffix not in allowed[upload.content_type]:
        raise HTTPException(status_code=415, detail=f"Unsupported {label} file type")
    content = await upload.read(limit + 1)
    if len(content) > limit:
        raise HTTPException(status_code=413, detail=f"{label} file is too large")
    if not content or not _signature_is_valid(upload.content_type, content):
        raise HTTPException(status_code=415, detail=f"Invalid {label} file content")
    directory.mkdir(parents=True, exist_ok=True)
    final_path = directory / f"{uuid4().hex}{suffix}"
    temporary_path = directory / f".{final_path.name}.tmp"
    try:
        temporary_path.write_bytes(content)
        os.replace(temporary_path, final_path)
    except OSError as exc:
        temporary_path.unlink(missing_ok=True)
        logger.exception("Unable to store research %s", label)
        raise HTTPException(status_code=500, detail=f"Unable to store {label} file") from exc
    relative = final_path.relative_to(settings.STATIC_DIR).as_posix()
    return final_path, f"static/{relative}"

async def create_research(db: AsyncSession, current_user: User, title_th: str, title_en: str, category_id: int,
    abstract: Optional[str], department: Optional[str], work_type: Optional[str], academic_year: Optional[int],
    keywords: Optional[str], author_ids: str, advisor_ids: str, cover_image: Optional[UploadFile],
    document: Optional[UploadFile]) -> ResearchWork:
    authors = _parse_ids(author_ids, "author_ids")
    advisors = _parse_ids(advisor_ids, "advisor_ids")
    await _validate_relations(db, category_id, authors, advisors)
    stored: list[Path] = []
    try:
        cover_path = doc_path = None
        if cover_image:
            disk_path, cover_path = await _store_upload(cover_image, UPLOAD_COVERS_DIR, COVER_TYPES, settings.MAX_COVER_IMAGE_BYTES, "cover image")
            stored.append(disk_path)
        if document:
            disk_path, doc_path = await _store_upload(document, UPLOAD_DOCS_DIR, DOCUMENT_TYPES, settings.MAX_DOCUMENT_BYTES, "document")
            stored.append(disk_path)
        research = ResearchWork(title_th=title_th.strip(), title_en=title_en.strip(), category_id=category_id,
            abstract=abstract, department=department, work_type=work_type, academic_year=academic_year, keywords=keywords,
            cover_image_path=cover_path, file_path=doc_path, submitted_by_id=current_user.id)
        db.add(research)
        await db.flush()
        db.add_all([ResearchAuthor(research_id=research.id, user_id=user_id, role_in_work="primary" if index == 0 else "co-author") for index, user_id in enumerate(authors)])
        db.add_all([ResearchAdvisor(research_id=research.id, user_id=user_id) for user_id in advisors])
        await db.commit()
        await db.refresh(research)
        return research
    except HTTPException:
        await db.rollback()
        for path in stored: path.unlink(missing_ok=True)
        raise
    except IntegrityError as exc:
        await db.rollback()
        for path in stored: path.unlink(missing_ok=True)
        logger.warning("Research creation violated a database constraint", exc_info=exc)
        raise HTTPException(status_code=409, detail="Research data conflicts with an existing or related record") from exc
    except SQLAlchemyError as exc:
        await db.rollback()
        for path in stored: path.unlink(missing_ok=True)
        logger.exception("Research creation database failure")
        raise HTTPException(status_code=500, detail="Unable to save research") from exc

async def search_research(db: AsyncSession, q: Optional[str], category_id: Optional[int], current_user: Optional[User] = None) -> List[ResearchWork]:
    if current_user:
        if current_user.role in ["admin", "advisor"]:
            query = select(ResearchWork)
        elif current_user.role == "student":
            query = select(ResearchWork).where(
                or_(
                    ResearchWork.status == "approved",
                    ResearchWork.submitted_by_id == current_user.id,
                    ResearchWork.id.in_(select(ResearchAuthor.research_id).where(ResearchAuthor.user_id == current_user.id))
                )
            )
        else:
            query = select(ResearchWork).where(ResearchWork.status == "approved")
    else:
        query = select(ResearchWork).where(ResearchWork.status == "approved")

    if q:
        query = query.where(or_(ResearchWork.title_th.ilike(f"%{q}%"), ResearchWork.title_en.ilike(f"%{q}%"), ResearchWork.keywords.ilike(f"%{q}%")))
        db.add(SearchLog(keyword=q)); await db.flush()
    if category_id: query = query.where(ResearchWork.category_id == category_id)
    result = await db.execute(query); await db.commit(); return result.scalars().all()


async def get_research_detail(db: AsyncSession, research_id: int) -> ResearchWork:
    research = (await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))).scalars().first()
    if not research: raise HTTPException(status_code=404, detail="Not found")
    research.view_count += 1; db.add(DownloadViewLog(research_id=research.id, action_type="view")); await db.commit(); await db.refresh(research); return research

async def download_research(db: AsyncSession, current_user: User, research_id: int) -> dict:
    research = (await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))).scalars().first()
    if not research or not research.file_path: raise HTTPException(status_code=404, detail="File not found")
    research.download_count += 1; db.add(DownloadViewLog(research_id=research.id, user_id=current_user.id, action_type="download")); await db.commit(); return {"file_url": f"/{research.file_path}"}

async def review_research(db: AsyncSession, current_user: User, research_id: int, review_in: ReviewCommentCreate) -> ReviewComment:
    research = (await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))).scalars().first()
    if not research: raise HTTPException(status_code=404, detail="Not found")
    review = ReviewComment(research_id=research.id, reviewer_id=current_user.id, comment_text=review_in.comment_text, status_result=review_in.status_result)
    research.status = review_in.status_result; db.add(review); await db.commit(); await db.refresh(review); return review
