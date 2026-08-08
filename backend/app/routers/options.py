from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.options import Department, WorkType
from app.models.user import User
from app.routers.deps import require_role
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/options", tags=["options"])

class OptionsUpdate(BaseModel):
    departments: List[str]
    work_types: List[str]

@router.get("/")
async def get_options(db: AsyncSession = Depends(get_db)):
    depts_res = await db.execute(select(Department))
    depts = [d.name for d in depts_res.scalars().all()]
    
    types_res = await db.execute(select(WorkType))
    types = [t.name for t in types_res.scalars().all()]
    
    return {"departments": depts, "work_types": types}

@router.post("/")
async def update_options(
    options: OptionsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    # Clear existing
    await db.execute(Department.__table__.delete())
    await db.execute(WorkType.__table__.delete())
    
    # Insert new departments
    for name in options.departments:
        if name.strip():
            db.add(Department(name=name.strip()))
            
    # Insert new work types
    for name in options.work_types:
        if name.strip():
            db.add(WorkType(name=name.strip()))
            
    await db.commit()
    return {"success": True}
