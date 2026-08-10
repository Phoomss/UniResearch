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
