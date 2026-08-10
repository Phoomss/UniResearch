from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str = Field(..., description="role: user or assistant")
    content: str = Field(..., description="message content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user message")
    history: List[ChatMessage] = Field(default=[], description="Previous conversation turns")

class ChatResponse(BaseModel):
    response: str = Field(..., description="The AI response")
    relevant_works: List[Dict[str, Any]] = Field(default=[], description="Brief metadata of papers used as context")
