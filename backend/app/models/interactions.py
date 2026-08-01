from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    research_id = Column(Integer, ForeignKey("research_works.id"))
    saved_at = Column(DateTime, default=datetime.utcnow)

class DownloadViewLog(Base):
    __tablename__ = "download_view_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    research_id = Column(Integer, ForeignKey("research_works.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action_type = Column(String, nullable=False) # view, download
    action_at = Column(DateTime, default=datetime.utcnow)

class SearchLog(Base):
    __tablename__ = "search_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, nullable=False)
    searched_at = Column(DateTime, default=datetime.utcnow)
