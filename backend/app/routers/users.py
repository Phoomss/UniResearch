from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.schemas.user import UserResponse
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    """Return a list of all active users (excluding passwords)."""
    result = await db.execute(select(User).where(User.is_active == True))
    users = result.scalars().all()
    return users
