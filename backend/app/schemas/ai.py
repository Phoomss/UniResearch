from pydantic import BaseModel, Field
from typing import Optional, List

class GenerateAbstractRequest(BaseModel):
    title_th: str = Field(..., description="ชื่อผลงานภาษาไทย")
    title_en: str = Field(..., description="ชื่อผลงานภาษาอังกฤษ")
    keywords: Optional[str] = Field(None, description="คำสำคัญ")
    language: str = Field("th", description="ภาษาที่ต้องการ: th หรือ en")

class GenerateAbstractResponse(BaseModel):
    abstract: str
    language: str

class SuggestTitleRequest(BaseModel):
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    category: Optional[str] = None
    language: str = Field("th", description="th หรือ en")

class SuggestTitleResponse(BaseModel):
    suggestions: List[str]

class SuggestKeywordsRequest(BaseModel):
    title_th: Optional[str] = None
    title_en: Optional[str] = None
    abstract: Optional[str] = None

class SuggestKeywordsResponse(BaseModel):
    keywords: List[str]

class CheckWritingRequest(BaseModel):
    text: str
    language: str = Field("th")

class WritingIssue(BaseModel):
    original: str
    suggestion: str
    reason: str

class CheckWritingResponse(BaseModel):
    issues: List[WritingIssue]
    improved_text: str
    score: int = Field(ge=0, le=100, description="คะแนนคุณภาพ 0-100")

class AIErrorResponse(BaseModel):
    detail: str
