from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    research_id: int
    saved_at: datetime

    class Config:
        from_attributes = True

class SearchLogResponse(BaseModel):
    id: int
    keyword: str
    searched_at: datetime

    class Config:
        from_attributes = True
