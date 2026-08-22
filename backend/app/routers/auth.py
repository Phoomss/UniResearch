from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.services import auth_service
from app.models.user import User
from app.routers.deps import get_current_active_user


from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user_in.role = "student"
    return await auth_service.create_user(db, user_in)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await auth_service.authenticate_user(db, form_data.username, form_data.password)
    access_token = auth_service.create_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    if user_update.email is not None and user_update.email != current_user.email:
        from sqlalchemy.future import select
        result = await db.execute(select(User).where(User.email == user_update.email))
        if result.scalars().first():
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
            
    if user_update.first_name is not None:
        current_user.first_name = user_update.first_name
    if user_update.last_name is not None:
        current_user.last_name = user_update.last_name
    if user_update.department is not None:
        current_user.department = user_update.department
    if user_update.student_id is not None:
        current_user.student_id = user_update.student_id
    if user_update.password is not None:
        from app.core.security import get_password_hash
        current_user.hashed_password = get_password_hash(user_update.password)
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

