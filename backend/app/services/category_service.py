from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.models.category import Category
from app.schemas.category import CategoryCreate

async def create_category(db: AsyncSession, category_in: CategoryCreate) -> Category:
    new_cat = Category(**category_in.model_dump())
    db.add(new_cat)
    await db.commit()
    await db.refresh(new_cat)
    return new_cat

async def get_categories(db: AsyncSession) -> List[Category]:
    result = await db.execute(select(Category))
    return result.scalars().all()
