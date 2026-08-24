from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: str = Field(..., description="หัวข้อการแจ้งเตือน")
    message: str = Field(..., description="เนื้อหารายละเอียด")
    type: str = Field("info", description="ประเภท: info, success, warning, alert, ai_match, review")

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
