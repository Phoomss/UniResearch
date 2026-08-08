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

class ReviewCommentCreate(BaseModel):
    comment_text: str
    status_result: str

class ReviewCommentResponse(ReviewCommentCreate):
    id: int
    research_id: int
    reviewer_id: int
    created_at: datetime
    reviewer: Optional[ResearchParticipantResponse] = None

    class Config:
        from_attributes = True

class ResearchAuthorSchema(BaseModel):
    id: int
    research_id: int
    user_id: int
    role_in_work: str
    user: ResearchParticipantResponse

    class Config:
        from_attributes = True

class ResearchAdvisorSchema(BaseModel):
    id: int
    research_id: int
    user_id: int
    user: ResearchParticipantResponse

    class Config:
        from_attributes = True

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
    authors: List[ResearchAuthorSchema] = []
    advisors: List[ResearchAdvisorSchema] = []
    reviews: List[ReviewCommentResponse] = []

    class Config:
        from_attributes = True

