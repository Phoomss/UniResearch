from fastapi import APIRouter, Depends
from app.routers.deps import get_current_user
from app.models.user import User
from app.schemas.ai import (
    GenerateAbstractRequest, GenerateAbstractResponse,
    SuggestTitleRequest, SuggestTitleResponse,
    SuggestKeywordsRequest, SuggestKeywordsResponse,
    CheckWritingRequest, CheckWritingResponse
)
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.post("/generate-abstract", response_model=GenerateAbstractResponse)
async def generate_abstract(request: GenerateAbstractRequest, current_user: User = Depends(get_current_user)):
    abstract = await ai_service.generate_abstract(
        title_th=request.title_th,
        title_en=request.title_en,
        keywords=request.keywords,
        language=request.language
    )
    return GenerateAbstractResponse(abstract=abstract, language=request.language)

@router.post("/suggest-titles", response_model=SuggestTitleResponse)
async def suggest_titles(request: SuggestTitleRequest, current_user: User = Depends(get_current_user)):
    suggestions = await ai_service.suggest_titles(
        abstract=request.abstract,
        keywords=request.keywords,
        category=request.category,
        language=request.language
    )
    return SuggestTitleResponse(suggestions=suggestions)

@router.post("/suggest-keywords", response_model=SuggestKeywordsResponse)
async def suggest_keywords(request: SuggestKeywordsRequest, current_user: User = Depends(get_current_user)):
    keywords = await ai_service.suggest_keywords(
        title_th=request.title_th,
        title_en=request.title_en,
        abstract=request.abstract
    )
    return SuggestKeywordsResponse(keywords=keywords)

@router.post("/check-writing", response_model=CheckWritingResponse)
async def check_writing(request: CheckWritingRequest, current_user: User = Depends(get_current_user)):
    result = await ai_service.check_writing(
        text=request.text,
        language=request.language
    )
    return CheckWritingResponse(
        issues=result.get("issues", []),
        improved_text=result.get("improved_text", ""),
        score=result.get("score", 0)
    )

from typing import Dict, Any, List
from app.routers.deps import require_role

@router.post("/dashboard-insights")
async def get_dashboard_insights(
    request: Dict[str, Any],
    current_user: User = Depends(require_role(["admin", "advisor"]))
):
    stats = request.get("stats", {})
    categories = request.get("categories", [])
    research_list = request.get("research_list", [])
    
    insights = await ai_service.generate_dashboard_insights(
        stats=stats,
        categories=categories,
        research_list=research_list
    )
    return insights

from app.schemas.ai import ChatRequest, ChatResponse
from app.services.rag_service import rag_chatbot_service
from app.services.research_service import search_research
from app.db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

@router.post("/chat", response_model=ChatResponse)
async def chat_rag(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy.future import select
    from sqlalchemy.orm import selectinload
    from app.models.research import ResearchWork
    from app.services.ai_service import ai_service
    
    relevant_works = []
    try:
        # Get vector embedding of query text
        query_vector = await ai_service.get_embedding(request.message)
        
        # Calculate cosine distance using pgvector operator
        # filter only approved works
        stmt = (
            select(ResearchWork)
            .where(ResearchWork.status == "approved")
            .order_by(ResearchWork.embedding.cosine_distance(query_vector))
            .limit(5)
            .options(selectinload(ResearchWork.category))
        )
        res = await db.execute(stmt)
        relevant_works = list(res.scalars().all())
    except Exception:
        # Fallback to standard text search if vector search fails (e.g. extension not loaded yet or DB starting up)
        relevant_works = await search_research(db, q=request.message, category_id=None, current_user=None)
    
    # Process with RAG Chatbot Service
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
    ai_response = await rag_chatbot_service.chat_with_context(
        message=request.message,
        chat_history=history_dicts,
        relevant_works=relevant_works
    )
    
    # Format metadata of relevant works for front-end citations
    works_metadata = []
    for w in relevant_works[:3]:
        works_metadata.append({
            "id": w.id,
            "title_th": w.title_th,
            "title_en": w.title_en,
            "category": w.category.category_name if w.category else "Other",
            "published_at": w.published_at.isoformat() if w.published_at else None
        })
        
    return ChatResponse(
        response=ai_response,
        relevant_works=works_metadata
    )


