from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
from pgvector.sqlalchemy import Vector

class ResearchWork(Base):
    __tablename__ = "research_works"

    id = Column(Integer, primary_key=True, index=True)
    title_th = Column(String, nullable=False)
    title_en = Column(String, nullable=False)
    abstract = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    department = Column(String, nullable=True)
    work_type = Column(String, nullable=True)
    academic_year = Column(Integer, nullable=True)
    keywords = Column(String, nullable=True)
    cover_image_path = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, approved, rejected
    view_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    submitted_by_id = Column(Integer, ForeignKey("users.id"))
    embedding = Column(Vector(768), nullable=True)

    
    category = relationship("Category")
    submitter = relationship("User", foreign_keys=[submitted_by_id])
    authors = relationship("ResearchAuthor", back_populates="research")
    advisors = relationship("ResearchAdvisor", back_populates="research")
    revisions = relationship("FileRevision", back_populates="research")
    reviews = relationship("ReviewComment", back_populates="research")

class ResearchAuthor(Base):
    __tablename__ = "research_authors"
    
    id = Column(Integer, primary_key=True, index=True)
    research_id = Column(Integer, ForeignKey("research_works.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role_in_work = Column(String, default="primary") # primary, co-author

    research = relationship("ResearchWork", back_populates="authors")
    user = relationship("User")

class ResearchAdvisor(Base):
    __tablename__ = "research_advisors"
    
    id = Column(Integer, primary_key=True, index=True)
    research_id = Column(Integer, ForeignKey("research_works.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    research = relationship("ResearchWork", back_populates="advisors")
    user = relationship("User")

class FileRevision(Base):
    __tablename__ = "file_revisions"
    
    id = Column(Integer, primary_key=True, index=True)
    research_id = Column(Integer, ForeignKey("research_works.id"))
    file_path = Column(String, nullable=False)
    version_no = Column(Integer, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    research = relationship("ResearchWork", back_populates="revisions")
    uploader = relationship("User")

class ReviewComment(Base):
    __tablename__ = "review_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    research_id = Column(Integer, ForeignKey("research_works.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    comment_text = Column(Text, nullable=False)
    status_result = Column(String, nullable=False) # e.g. approved, rejected, revision_needed
    created_at = Column(DateTime, default=datetime.utcnow)

    research = relationship("ResearchWork", back_populates="reviews")
    reviewer = relationship("User")
