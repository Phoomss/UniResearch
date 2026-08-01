from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.database import get_db
from app.models.interactions import Favorite
from app.schemas.interactions import FavoriteResponse
from app.models.user import User
from app.routers.deps import get_current_active_user

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.post("/{research_id}", response_model=FavoriteResponse)
async def toggle_favorite(
    research_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(Favorite).where(
        Favorite.research_id == research_id, 
        Favorite.user_id == current_user.id
    ))
    existing = result.scalars().first()
    
    if existing:
        await db.delete(existing)
        await db.commit()
        raise HTTPException(status_code=200, detail="Removed from favorites")
        
    new_fav = Favorite(research_id=research_id, user_id=current_user.id)
    db.add(new_fav)
    await db.commit()
    await db.refresh(new_fav)
    return new_fav

@router.get("/", response_model=List[FavoriteResponse])
async def list_favorites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(Favorite).where(Favorite.user_id == current_user.id))
    return result.scalars().all()
