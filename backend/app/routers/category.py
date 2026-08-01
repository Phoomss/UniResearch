from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse
from app.models.user import User
from app.routers.deps import require_role

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryResponse)
async def create_category(
    category_in: CategoryCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    new_cat = Category(**category_in.model_dump())
    db.add(new_cat)
    await db.commit()
    await db.refresh(new_cat)
    return new_cat

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    return result.scalars().all()
