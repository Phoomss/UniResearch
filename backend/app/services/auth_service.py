from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password, create_access_token

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    new_user = User(email=user_in.email, hashed_password=hashed_password, role=user_in.role)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return user

def create_token_for_user(user: User) -> str:
    return create_access_token(subject=user.email)
