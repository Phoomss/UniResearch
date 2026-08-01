from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.schemas.category import CategoryCreate, CategoryResponse
from app.models.user import User
from app.routers.deps import require_role
from app.services import category_service

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryResponse)
async def create_category(
    category_in: CategoryCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return await category_service.create_category(db, category_in)

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    return await category_service.get_categories(db)
