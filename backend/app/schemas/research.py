from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ResearchWorkBase(BaseModel):
    title_th: str
    title_en: str
    abstract: Optional[str] = None
    category_id: int
    department: Optional[str] = None
    work_type: Optional[str] = None
    academic_year: Optional[int] = None
    keywords: Optional[str] = None

class ResearchWorkCreate(ResearchWorkBase):
    author_ids: List[int]
    advisor_ids: List[int]

class ResearchParticipantResponse(BaseModel):
    id: int
    email: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    student_id: Optional[str] = None
    department: Optional[str] = None
    is_current: bool = False

class ResearchParticipantsResponse(BaseModel):
    authors: List[ResearchParticipantResponse]
    advisors: List[ResearchParticipantResponse]

class ResearchWorkResponse(ResearchWorkBase):
    id: int
    cover_image_path: Optional[str]
    file_path: Optional[str]
    status: str
    view_count: int
    download_count: int
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    submitted_by_id: int

    class Config:
        from_attributes = True

class ReviewCommentCreate(BaseModel):
    comment_text: str
    status_result: str

class ReviewCommentResponse(BaseModel):
    id: int
    research_id: int
    reviewer_id: int
    comment_text: str
    status_result: str
    created_at: datetime

    class Config:
        from_attributes = True
