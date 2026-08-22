import json
import logging
import os
from pathlib import Path
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from fastapi import HTTPException, UploadFile
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.models.category import Category
from app.models.interactions import DownloadViewLog, SearchLog, Favorite
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

    # Validate that all authors have the same student ID year prefix (e.g. first 2 characters)
    student_years = set()
    for user_id in author_ids:
        u = users.get(user_id)
        if u and u.student_id:
            student_years.add(u.student_id[:2])
    if len(student_years) > 1:
        raise HTTPException(status_code=422, detail="Authors must have the same student ID year prefix")

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
        
        # Calculate text embedding vector using AI service
        try:
            from app.services.ai_service import ai_service
            embedding_text = f"{research.title_th or ''} {research.title_en or ''} {research.abstract or ''} {research.keywords or ''}".strip()
            if embedding_text:
                research.embedding = await ai_service.get_embedding(embedding_text)
        except Exception:
            pass

        db.add(research)
        await db.flush()
        db.add_all([ResearchAuthor(research_id=research.id, user_id=user_id, role_in_work="primary" if index == 0 else "co-author") for index, user_id in enumerate(authors)])
        db.add_all([ResearchAdvisor(research_id=research.id, user_id=user_id) for user_id in advisors])
        await db.flush()
        
        # Trigger notifications for advisors
        from app.services.notification_service import notification_service
        author_name = f"{current_user.first_name or ''} {current_user.last_name or ''}".strip() or current_user.email
        for advisor_id in advisors:
            try:
                await notification_service.create_notification(
                    db=db,
                    user_id=advisor_id,
                    title="มีงานวิจัยใหม่รอการตรวจสอบจากคุณ",
                    message=f"นักศึกษา {author_name} ได้ยื่นเสนอผลงานวิจัยเรื่อง '{research.title_th or research.title_en}' และระบุคุณเป็นอาจารย์ที่ปรึกษา/ผู้ตรวจประเมิน",
                    type="review"
                )
            except Exception:
                pass
                
        await db.commit()
        query = select(ResearchWork).where(ResearchWork.id == research.id).options(
            selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
            selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
            selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
        )
        research = (await db.execute(query)).scalars().first()
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

    terms = []
    if q and q.strip():
        terms = [term for term in q.strip().split() if term]
        if terms:
            or_conds = []
            for term in terms:
                t = f"%{term}%"
                or_conds.extend([
                    ResearchWork.title_th.ilike(t),
                    ResearchWork.title_en.ilike(t),
                    ResearchWork.keywords.ilike(t),
                    ResearchWork.abstract.ilike(t)
                ])
            query = query.where(or_(*or_conds))
            db.add(SearchLog(keyword=q))
            await db.flush()

    if category_id:
        query = query.where(ResearchWork.category_id == category_id)

    query = query.options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
        selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
    )
    result = await db.execute(query)
    await db.commit()
    works = list(result.scalars().all())

    # Smart Python-side scoring and ranking if a query is specified
    if q and q.strip() and works:
        q_lower = q.strip().lower()
        ranked_works = []
        for work in works:
            score = 0
            title_th_lower = (work.title_th or "").lower()
            title_en_lower = (work.title_en or "").lower()
            keywords_lower = (work.keywords or "").lower()
            abstract_lower = (work.abstract or "").lower()

            # Exact phrase match in Title gets huge boost
            if q_lower in title_th_lower or q_lower in title_en_lower:
                score += 50

            # Exact match in keywords
            if q_lower in keywords_lower:
                score += 30

            # Individual term matches
            for term in terms:
                t_lower = term.lower()
                if t_lower in title_th_lower:
                    score += 15
                if t_lower in title_en_lower:
                    score += 15
                if t_lower in keywords_lower:
                    score += 10
                if t_lower in abstract_lower:
                    score += 5

            # Small popularity boost (up to 10 points)
            pop = (work.view_count or 0) * 0.1 + (work.download_count or 0) * 0.3
            score += min(pop, 10.0)

            ranked_works.append((work, score))

        ranked_works.sort(key=lambda x: x[1], reverse=True)
        works = [item[0] for item in ranked_works]

    return works


async def get_research_detail(db: AsyncSession, research_id: int) -> ResearchWork:
    query = select(ResearchWork).where(ResearchWork.id == research_id).options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
        selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
    )
    research = (await db.execute(query)).scalars().first()
    if not research: raise HTTPException(status_code=404, detail="Not found")
    research.view_count += 1; db.add(DownloadViewLog(research_id=research.id, action_type="view")); await db.commit(); await db.refresh(research); return research

async def download_research(db: AsyncSession, current_user: User, research_id: int) -> dict:
    research = (await db.execute(select(ResearchWork).where(ResearchWork.id == research_id))).scalars().first()
    if not research or not research.file_path: raise HTTPException(status_code=404, detail="File not found")
    research.download_count += 1; db.add(DownloadViewLog(research_id=research.id, user_id=current_user.id, action_type="download")); await db.commit(); return {"file_url": f"/{research.file_path}"}
async def review_research(db: AsyncSession, current_user: User, research_id: int, review_in: ReviewCommentCreate) -> ReviewComment:
    from app.services.notification_service import notification_service
    
    query = select(ResearchWork).where(ResearchWork.id == research_id).options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user)
    )
    research = (await db.execute(query)).scalars().first()
    if not research:
        raise HTTPException(status_code=404, detail="Not found")
        
    if research.status != "pending":
        raise HTTPException(status_code=400, detail="Can only review research works with pending status")
        
    if current_user.role != "admin":
        advisor_check = await db.execute(
            select(ResearchAdvisor).where(
                ResearchAdvisor.research_id == research_id,
                ResearchAdvisor.user_id == current_user.id
            )
        )
        if not advisor_check.scalars().first():
            raise HTTPException(status_code=403, detail="Not authorized to review this research (you are not an advisor for this work)")
            
    review = ReviewComment(
        research_id=research.id,
        reviewer_id=current_user.id,
        comment_text=review_in.comment_text,
        status_result=review_in.status_result
    )
    research.status = review_in.status_result
    if review_in.status_result == "approved":
        research.published_at = datetime.utcnow()
        
    db.add(review)
    await db.flush()
    
    # Notify all co-authors & submitter
    notify_recipients = {research.submitted_by_id}
    for auth_rel in research.authors:
        notify_recipients.add(auth_rel.user_id)
        
    status_th = {
        "approved": "อนุมัติแล้ว",
        "rejected": "ปฏิเสธแล้ว",
        "revision_needed": "ต้องแก้ไขผลงาน",
        "needs_revision": "ต้องแก้ไขผลงาน",
        "pending": "รอการตรวจสอบ"
    }.get(review_in.status_result, review_in.status_result)

    type_map = {
        "approved": "success",
        "rejected": "alert",
        "revision_needed": "warning",
        "needs_revision": "warning"
    }.get(review_in.status_result, "info")

    for uid in notify_recipients:
        try:
            await notification_service.create_notification(
                db=db,
                user_id=uid,
                title=f"สถานะผลงานได้รับการเปลี่ยนเป็น: {status_th}",
                message=f"ผลงานเรื่อง '{research.title_th or research.title_en}' ได้รับผลการตรวจสอบและปรับสถานะเป็น {status_th}. ความเห็นเพิ่มเติม: {review_in.comment_text}",
                type=type_map
            )
        except Exception:
            pass # Keep transactions clean
            
    await db.commit()
    await db.refresh(review)
    return review

async def update_research(db: AsyncSession, research_id: int, current_user: User, title_th: str, title_en: str, category_id: int,
    abstract: Optional[str], department: Optional[str], work_type: Optional[str], academic_year: Optional[int],
    keywords: Optional[str], author_ids: str, advisor_ids: str, cover_image: Optional[UploadFile],
    document: Optional[UploadFile]) -> ResearchWork:
    query = select(ResearchWork).where(ResearchWork.id == research_id).options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user)
    )
    research = (await db.execute(query)).scalars().first()
    if not research:
        raise HTTPException(status_code=404, detail="Research not found")
    
    author_user_ids = [a.user_id for a in research.authors]
    if current_user.role != "admin" and research.submitted_by_id != current_user.id and current_user.id not in author_user_ids:
        raise HTTPException(status_code=403, detail="Not authorized to edit this research")

    authors = _parse_ids(author_ids, "author_ids")
    advisors = _parse_ids(advisor_ids, "advisor_ids")
    await _validate_relations(db, category_id, authors, advisors)
    stored: list[Path] = []
    try:
        if cover_image:
            disk_path, cover_path = await _store_upload(cover_image, UPLOAD_COVERS_DIR, COVER_TYPES, settings.MAX_COVER_IMAGE_BYTES, "cover image")
            stored.append(disk_path)
            if research.cover_image_path:
                old_path = settings.STATIC_DIR / research.cover_image_path.replace("static/", "", 1)
                try:
                    if old_path.exists(): old_path.unlink()
                except Exception: pass
            research.cover_image_path = cover_path
        if document:
            disk_path, doc_path = await _store_upload(document, UPLOAD_DOCS_DIR, DOCUMENT_TYPES, settings.MAX_DOCUMENT_BYTES, "document")
            stored.append(disk_path)
            
            if research.status == "needs_revision" and research.file_path:
                from sqlalchemy import func
                from app.models.research import FileRevision
                max_ver_query = select(func.max(FileRevision.version_no)).where(FileRevision.research_id == research.id)
                max_ver_result = await db.execute(max_ver_query)
                max_ver = max_ver_result.scalar() or 0
                
                revision = FileRevision(
                    research_id=research.id,
                    file_path=research.file_path,
                    version_no=max_ver + 1,
                    uploaded_by=current_user.id,
                    uploaded_at=datetime.utcnow()
                )
                db.add(revision)
            else:
                if research.file_path:
                    old_path = settings.STATIC_DIR / research.file_path.replace("static/", "", 1)
                    try:
                        if old_path.exists(): old_path.unlink()
                    except Exception: pass
            research.file_path = doc_path
        research.title_th = title_th.strip()
        research.title_en = title_en.strip()
        research.category_id = category_id
        research.abstract = abstract
        research.department = department
        research.work_type = work_type
        research.academic_year = academic_year
        research.keywords = keywords
        research.status = "pending" # Reset status to pending when updated

        # Calculate updated text embedding vector using AI service
        try:
            from app.services.ai_service import ai_service
            embedding_text = f"{research.title_th or ''} {research.title_en or ''} {research.abstract or ''} {research.keywords or ''}".strip()
            if embedding_text:
                research.embedding = await ai_service.get_embedding(embedding_text)
        except Exception:
            pass
        
        from sqlalchemy import delete
        await db.execute(delete(ResearchAuthor).where(ResearchAuthor.research_id == research.id))
        await db.execute(delete(ResearchAdvisor).where(ResearchAdvisor.research_id == research.id))
        db.add_all([ResearchAuthor(research_id=research.id, user_id=user_id, role_in_work="primary" if index == 0 else "co-author") for index, user_id in enumerate(authors)])
        db.add_all([ResearchAdvisor(research_id=research.id, user_id=user_id) for user_id in advisors])
        await db.commit()
        query = select(ResearchWork).where(ResearchWork.id == research.id).options(
            selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
            selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
            selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
        )
        research = (await db.execute(query)).scalars().first()
        return research
    except HTTPException:
        await db.rollback()
        for path in stored: path.unlink(missing_ok=True)
        raise
    except IntegrityError as exc:
        await db.rollback()
        for path in stored: path.unlink(missing_ok=True)
        logger.warning("Research update violated a database constraint", exc_info=exc)
        raise HTTPException(status_code=409, detail="Research data conflicts with an existing or related record") from exc
    except SQLAlchemyError as exc:
        await db.rollback()
        for path in stored: path.unlink(missing_ok=True)
        logger.exception("Research update database failure")
        raise HTTPException(status_code=500, detail="Unable to update research") from exc

async def delete_research(db: AsyncSession, research_id: int, current_user: User) -> None:
    query = select(ResearchWork).where(ResearchWork.id == research_id).options(
        selectinload(ResearchWork.authors)
    )
    research = (await db.execute(query)).scalars().first()
    if not research:
        raise HTTPException(status_code=404, detail="Research not found")
    
    author_user_ids = [a.user_id for a in research.authors]
    if current_user.role != "admin" and research.submitted_by_id != current_user.id and current_user.id not in author_user_ids:
        raise HTTPException(status_code=403, detail="Not authorized to delete this research")

    for file_path_attr in [research.cover_image_path, research.file_path]:
        if file_path_attr:
            old_path = settings.STATIC_DIR / file_path_attr.replace("static/", "", 1)
            try:
                if old_path.exists(): old_path.unlink()
            except Exception: pass

    from sqlalchemy import delete
    from app.models.interactions import DownloadViewLog, Favorite
    from app.models.research import FileRevision
    await db.execute(delete(ResearchAuthor).where(ResearchAuthor.research_id == research.id))
    await db.execute(delete(ResearchAdvisor).where(ResearchAdvisor.research_id == research.id))
    await db.execute(delete(ReviewComment).where(ReviewComment.research_id == research.id))
    await db.execute(delete(DownloadViewLog).where(DownloadViewLog.research_id == research.id))
    await db.execute(delete(Favorite).where(Favorite.research_id == research.id))
    await db.execute(delete(FileRevision).where(FileRevision.research_id == research.id))
    await db.delete(research)
    await db.commit()


async def get_search_suggestions(db: AsyncSession, q: Optional[str] = None) -> dict:
    # 1. Popular keywords
    if not q or not q.strip():
        # Get recent search logs
        recent_query = select(SearchLog.keyword).order_by(SearchLog.searched_at.desc()).limit(30)
        recent_res = (await db.execute(recent_query)).scalars().all()
        # Find unique and top ones
        keywords_list = []
        for kw in recent_res:
            kw_clean = kw.strip()
            if kw_clean and kw_clean not in keywords_list:
                keywords_list.append(kw_clean)
        # Limit to 5
        keywords_list = keywords_list[:5]
        
        # Also fall back to general database keywords if search logs are empty
        if not keywords_list:
            works_query = select(ResearchWork.keywords).where(ResearchWork.status == "approved").limit(100)
            works_res = (await db.execute(works_query)).scalars().all()
            kws = set()
            for w_kws in works_res:
                if w_kws:
                    for kw in w_kws.split(','):
                        kw_clean = kw.strip()
                        if kw_clean:
                            kws.add(kw_clean)
            keywords_list = list(kws)[:5]
            
        return {"keywords": keywords_list, "titles": []}
    
    # If q is provided
    q_clean = q.strip().lower()
    
    # Get matching titles
    titles_query = select(ResearchWork).where(
        ResearchWork.status == "approved",
        or_(
            ResearchWork.title_th.ilike(f"%{q_clean}%"),
            ResearchWork.title_en.ilike(f"%{q_clean}%")
        )
    ).limit(5)
    matching_works = (await db.execute(titles_query)).scalars().all()
    titles = [
        {"id": w.id, "title_th": w.title_th, "title_en": w.title_en}
        for w in matching_works
    ]
    
    # Get matching keywords from ResearchWork
    works_query = select(ResearchWork.keywords).where(
        ResearchWork.status == "approved",
        ResearchWork.keywords.ilike(f"%{q_clean}%")
    ).limit(50)
    works_res = (await db.execute(works_query)).scalars().all()
    matching_kws = set()
    for w_kws in works_res:
        if w_kws:
            for kw in w_kws.split(','):
                kw_clean = kw.strip()
                if q_clean in kw_clean.lower():
                    matching_kws.add(kw_clean)
                    
    return {"keywords": list(matching_kws)[:5], "titles": titles}


async def get_related_recommendations(db: AsyncSession, research_id: int) -> List[ResearchWork]:
    # Get current work
    current_work = (await db.execute(
        select(ResearchWork).where(ResearchWork.id == research_id)
    )).scalars().first()
    if not current_work:
        return []
        
    # Get all other approved works
    query = select(ResearchWork).where(
        ResearchWork.id != research_id,
        ResearchWork.status == "approved"
    ).options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
        selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
    )
    all_works = (await db.execute(query)).scalars().all()
    
    # Score each other work relative to the current work
    scored_works = []
    curr_keywords = [k.strip().lower() for k in (current_work.keywords or "").split(',') if k.strip()]
    
    for work in all_works:
        score = 0
        
        # Category match
        if work.category_id == current_work.category_id:
            score += 20
            
        # Keyword matches
        work_keywords = [k.strip().lower() for k in (work.keywords or "").split(',') if k.strip()]
        matches = len(set(curr_keywords) & set(work_keywords))
        score += matches * 10
        
        # Department match
        if work.department and current_work.department and work.department.strip().lower() == current_work.department.strip().lower():
            score += 5
            
        # Advisor match
        curr_advs = {a.user_id for a in current_work.advisors}
        work_advs = {a.user_id for a in work.advisors}
        score += len(curr_advs & work_advs) * 10
        
        # Author match
        curr_auths = {a.user_id for a in current_work.authors}
        work_auths = {a.user_id for a in work.authors}
        score += len(curr_auths & work_auths) * 10

        # View/download popularity weight
        score += min((work.view_count or 0) * 0.05 + (work.download_count or 0) * 0.1, 5.0)

        if score > 0:
            scored_works.append((work, score))
            
    # Sort and return top 5
    scored_works.sort(key=lambda x: x[1], reverse=True)
    return [item[0] for item in scored_works[:5]]


async def get_personalized_recommendations(db: AsyncSession, current_user: Optional[User] = None) -> List[ResearchWork]:
    interactions_found = False
    profile_categories = {}
    profile_keywords = {}
    
    if current_user:
        # Get favorites
        favs = (await db.execute(
            select(Favorite.research_id).where(Favorite.user_id == current_user.id)
        )).scalars().all()
        
        # Get download/view logs
        logs = (await db.execute(
            select(DownloadViewLog.research_id).where(DownloadViewLog.user_id == current_user.id)
        )).scalars().all()
        
        interacted_ids = list(set(favs) | set(logs))
        if interacted_ids:
            interactions_found = True
            interacted_works = (await db.execute(
                select(ResearchWork).where(ResearchWork.id.in_(interacted_ids))
            )).scalars().all()
            
            for w in interacted_works:
                profile_categories[w.category_id] = profile_categories.get(w.category_id, 0) + 1
                if w.keywords:
                    for kw in w.keywords.split(','):
                        kw_clean = kw.strip().lower()
                        if kw_clean:
                            profile_keywords[kw_clean] = profile_keywords.get(kw_clean, 0) + 1
                            
    # Get all approved works
    query = select(ResearchWork).where(ResearchWork.status == "approved").options(
        selectinload(ResearchWork.authors).selectinload(ResearchAuthor.user),
        selectinload(ResearchWork.advisors).selectinload(ResearchAdvisor.user),
        selectinload(ResearchWork.reviews).selectinload(ReviewComment.reviewer)
    )
    all_works = (await db.execute(query)).scalars().all()
    
    if not interactions_found:
        sorted_works = sorted(
            all_works,
            key=lambda w: (w.view_count or 0) * 1 + (w.download_count or 0) * 3,
            reverse=True
        )
        return sorted_works[:5]
        
    scored_works = []
    for work in all_works:
        score = 0
        
        if work.category_id in profile_categories:
            score += profile_categories[work.category_id] * 15
            
        if work.keywords:
            for kw in work.keywords.split(','):
                kw_clean = kw.strip().lower()
                if kw_clean in profile_keywords:
                    score += profile_keywords[kw_clean] * 5
                    
        score += min((work.view_count or 0) * 0.05 + (work.download_count or 0) * 0.1, 5.0)
        
        scored_works.append((work, score))
        
    scored_works.sort(key=lambda x: x[1], reverse=True)
    return [item[0] for item in scored_works[:5]]


async def get_ai_pre_review_analysis(db: AsyncSession, research_id: int):
    from app.services.ai_service import ai_service
    work = (await db.execute(
        select(ResearchWork).where(ResearchWork.id == research_id).options(selectinload(ResearchWork.category))
    )).scalars().first()
    if not work:
        raise HTTPException(status_code=404, detail="ไม่พบงานวิจัยที่ระบุ")
        
    category_name = work.category.category_name if work.category else "ทั่วไป"
    return await ai_service.pre_review_analysis(
        title_th=work.title_th,
        title_en=work.title_en,
        abstract=work.abstract or "",
        keywords=work.keywords or "",
        category=category_name,
        department=work.department or ""
    )


async def get_ai_plagiarism_check(db: AsyncSession, research_id: int):
    from app.services.ai_service import ai_service
    work = (await db.execute(
        select(ResearchWork).where(ResearchWork.id == research_id)
    )).scalars().first()
    if not work:
        raise HTTPException(status_code=404, detail="ไม่พบงานวิจัยที่ระบุ")
        
    # Get other approved works
    other_query = select(ResearchWork).where(ResearchWork.id != research_id, ResearchWork.status == "approved")
    other_results = (await db.execute(other_query)).scalars().all()
    
    other_works = [
        {
            "id": w.id,
            "title_th": w.title_th,
            "title_en": w.title_en,
            "abstract": w.abstract or ""
        }
        for w in other_results
    ]
    
    return await ai_service.plagiarism_check(
        title_th=work.title_th,
        title_en=work.title_en,
        abstract=work.abstract or "",
        other_works=other_works
    )


async def get_ai_reviewer_match(db: AsyncSession, research_id: int):
    from app.services.ai_service import ai_service
    work = (await db.execute(
        select(ResearchWork).where(ResearchWork.id == research_id).options(selectinload(ResearchWork.category))
    )).scalars().first()
    if not work:
        raise HTTPException(status_code=404, detail="ไม่พบงานวิจัยที่ระบุ")
        
    # Get all advisors
    advisor_query = select(User).where(User.role == "advisor", User.is_active.is_(True))
    advisor_results = (await db.execute(advisor_query)).scalars().all()
    
    advisors = [
        {
            "id": u.id,
            "name": f"{u.first_name or ''} {u.last_name or ''}".strip() or u.email,
            "department": u.department or ""
        }
        for u in advisor_results
    ]
    
    category_name = work.category.category_name if work.category else "ทั่วไป"
    return await ai_service.reviewer_match(
        title_th=work.title_th,
        title_en=work.title_en,
        abstract=work.abstract or "",
        keywords=work.keywords or "",
        category=category_name,
        advisors=advisors
    )


async def get_ai_review_summary(db: AsyncSession, research_id: int):
    from app.services.ai_service import ai_service
    work = (await db.execute(
        select(ResearchWork).where(ResearchWork.id == research_id).options(selectinload(ResearchWork.reviews))
    )).scalars().first()
    if not work:
        raise HTTPException(status_code=404, detail="ไม่พบงานวิจัยที่ระบุ")
        
    if not work.reviews:
        return {
            "executive_summary": "ยังไม่มีการส่งข้อเสนอแนะหรือประเมินผลงานนี้ในระบบ",
            "key_issues_raised": [],
            "improvement_sentiment": "Neutral"
        }
        
    reviews = [
        {
            "status_result": r.status_result,
            "comment_text": r.comment_text
        }
        for r in work.reviews
    ]
    
    return await ai_service.review_summary(reviews)

