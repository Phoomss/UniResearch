from typing import Annotated

from app.db.database import get_db
from app.models.research_flow import ResearchEvent, ResearchWorkflow
from app.models.user import User
from app.routers.deps import get_current_active_user
from app.schemas.research_flow import CreateWorkflow, HumanCommand
from app.services.research_flow import service
from app.services.research_flow.state import serialize, snapshot
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/research-flow", tags=["ResearchFlow"])


@router.post("", status_code=201)
async def create_workflow(
    data: CreateWorkflow,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    return await service.create(db, user, data)


@router.get("")
async def list_workflows(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    rows = (
        await db.execute(
            select(ResearchWorkflow)
            .where(ResearchWorkflow.user_id == user.id)
            .order_by(ResearchWorkflow.created_at.desc())
            .limit(50)
        )
    ).scalars()
    return [serialize(wf) for wf in rows]


@router.get("/{workflow_id}")
async def get_workflow(
    workflow_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    wf = await service.owned(db, workflow_id, user)
    result = await snapshot(db, wf)
    # Unvalidated draft is never published as a report.
    if wf.status != "COMPLETED":
        result["draft"] = {}
    return result


@router.post("/{workflow_id}/start")
async def start_workflow(
    workflow_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    return await service.start(
        db, await service.owned(db, workflow_id, user, lock=True)
    )


@router.post("/{workflow_id}/stop")
async def stop_workflow(
    workflow_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    return await service.stop(db, await service.owned(db, workflow_id, user, lock=True))


@router.post("/{workflow_id}/continue")
async def continue_workflow(
    workflow_id: str,
    data: HumanCommand,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    return await service.continue_workflow(
        db, await service.owned(db, workflow_id, user, lock=True), data
    )


@router.get("/{workflow_id}/events")
async def events(
    workflow_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
    after: Annotated[int, Query(ge=0)] = 0,
):
    await service.owned(db, workflow_id, user)
    rows = (
        await db.execute(
            select(ResearchEvent)
            .where(ResearchEvent.workflow_id == workflow_id, ResearchEvent.id > after)
            .order_by(ResearchEvent.id)
            .limit(200)
        )
    ).scalars()
    return [serialize(e) for e in rows]


@router.get("/{workflow_id}/report")
async def report(
    workflow_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    return service.public_report(await service.owned(db, workflow_id, user))


@router.get("/{workflow_id}/{collection}")
async def collection(
    workflow_id: str,
    collection: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_active_user)],
):
    if collection not in {
        "tasks",
        "sources",
        "evidence",
        "claims",
        "papers",
        "citations",
    }:
        raise HTTPException(404, "Collection not found")
    state = await snapshot(db, await service.owned(db, workflow_id, user))
    return state[collection]
