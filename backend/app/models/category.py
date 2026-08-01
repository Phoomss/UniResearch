from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
