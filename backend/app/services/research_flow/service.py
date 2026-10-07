from datetime import timedelta

from app.core.research_flow_config import flow_settings as cfg
from app.core.research_flow_time import utc_now
from app.models.research_flow import ResearchCitation as Citation
from app.models.research_flow import ResearchClaim as Claim
from app.models.research_flow import ResearchEvidence as Evidence
from app.models.research_flow import ResearchPaper as Paper
from app.models.research_flow import ResearchSource as Source
from app.models.research_flow import ResearchTask as Task
from app.models.research_flow import ResearchWorkflow as Workflow
from app.models.user import User
from app.services.research_flow.engine import TERMINAL, verified_context
from app.services.research_flow.state import event, schedule, snapshot
from fastapi import HTTPException
from sqlalchemy import delete, func, select, text, update


async def owned(db, workflow_id, user, lock=False):
    query = select(Workflow).where(
        Workflow.id == workflow_id, Workflow.user_id == user.id
    )
    if lock:
        query = query.with_for_update()
    wf = (await db.execute(query)).scalar_one_or_none()
    if wf is None:
        raise HTTPException(404, "Research workflow not found")
    return wf


async def create(db, user, data):
    if not cfg.enabled:
        raise HTTPException(503, "ResearchFlow is disabled")
    # Shared transactional gate across API processes/replicas on PostgreSQL.
    if db.bind.dialect.name == "postgresql":
        await db.execute(text("SELECT pg_advisory_xact_lock(72419031)"))
    await db.execute(select(User.id).where(User.id == user.id).with_for_update())
    active = ~Workflow.status.in_(
        ["COMPLETED", "FAILED"]
    )  # Paused workflows also consume a slot.
    user_count = (
        await db.execute(
            select(func.count())
            .select_from(Workflow)
            .where(active, Workflow.user_id == user.id)
        )
    ).scalar_one()
    global_count = (
        await db.execute(select(func.count()).select_from(Workflow).where(active))
    ).scalar_one()
    recent = (
        await db.execute(
            select(func.count())
            .select_from(Workflow)
            .where(
                Workflow.user_id == user.id,
                Workflow.created_at >= utc_now() - timedelta(hours=1),
            )
        )
    ).scalar_one()
    if (
        user_count >= cfg.max_active_per_user
        or global_count >= cfg.max_active_global
        or recent >= cfg.creations_per_hour
    ):
        raise HTTPException(
            429,
            "ResearchFlow resource limit reached; stop or finish an existing workflow",
        )
    if not data.research_question.strip() or len(data.research_question.strip()) < 12:
        raise HTTPException(422, "Research question is too short")
    wf = Workflow(
        user_id=user.id,
        research_question=data.research_question.strip(),
        depth=data.depth,
        limitations=[
            "Sources are repository abstracts; full papers and publication metadata have not been verified.",
            "Confidence is a system heuristic, not a probability of truth.",
        ],
    )
    db.add(wf)
    await db.flush()
    schedule(db, wf, "planner")
    event(db, wf, "workflow.created", "Research workflow created.")
    await db.commit()
    return await snapshot(db, wf)


async def start(db, wf):
    if wf.started_at or wf.status in TERMINAL:
        raise HTTPException(
            409, "Workflow already started; use continue for human review"
        )
    wf.started_at = utc_now()
    wf.deadline = wf.started_at + timedelta(seconds=cfg.max_workflow_duration)
    wf.ready_at = wf.started_at
    event(db, wf, "workflow.started", "Research workflow queued.")
    await db.commit()
    return await snapshot(db, wf)


async def stop(db, wf):
    if wf.status == "COMPLETED":
        raise HTTPException(409, "Completed workflow cannot be stopped")
    wf.status = "FAILED"
    wf.ready_at = wf.lease_until = wf.lease_token = None
    wf.draft = {}
    wf.limitations = [*wf.limitations, "Stopped by researcher."]
    await db.execute(
        update(Task)
        .where(
            Task.workflow_id == wf.id,
            Task.status.in_(["PENDING", "RUNNING", "RETRYING", "BLOCKED"]),
        )
        .values(status="FAILED", error="cancelled", completed_at=utc_now())
    )
    event(db, wf, "workflow.stopped", "Stopped by researcher.")
    await db.commit()
    return await snapshot(db, wf)


async def continue_workflow(db, wf, command):
    if wf.status != "WAITING_FOR_HUMAN":
        raise HTTPException(409, "Workflow must be waiting for human review")
    state = await snapshot(db, wf)
    action = command.action
    if action == "MODIFY_QUESTION":
        if not command.research_question or len(command.research_question.strip()) < 12:
            raise HTTPException(422, "A modified research question is required")
        for model in (Citation, Evidence, Claim, Paper, Source):
            await db.execute(delete(model).where(model.workflow_id == wf.id))
        wf.research_question = command.research_question.strip()
        wf.plan = {}
        wf.draft = {}
        wf.critic_feedback = {}
        wf.metrics = {}
        wf.confidence = 0
        target = "planner"
    elif action == "ACCEPT_CURRENT":
        # Human acceptance can relax adequacy, never provenance/citation support.
        if not verified_context(state)["claims"]:
            raise HTTPException(409, "No verified evidence to accept")
        wf.limitations = [
            *wf.limitations,
            "Researcher accepted limited evidence; adequacy review was overridden.",
        ]
        target = "writer"
    elif action == "RETRY_AGENT":
        task = next((t for t in state["tasks"] if t["id"] == command.task_id), None)
        if not task or task["status"] not in {"FAILED", "BLOCKED"}:
            raise HTTPException(
                422, "Select a failed or blocked task from this workflow"
            )
        target = task["agent_type"]
    else:
        target = "search" if action == "SEARCH_MORE" else wf.next_agent
        if target == "planner" and wf.plan:
            target = "search"
    await db.execute(
        update(Task)
        .where(
            Task.workflow_id == wf.id,
            Task.status.in_(["PENDING", "RUNNING", "RETRYING", "BLOCKED"]),
        )
        .values(status="BLOCKED", error="superseded_by_human")
    )
    wf.iteration = 0
    wf.search_rounds = 0
    # Explicit intervention grants a new bounded research cycle; cumulative token/call caps remain.
    wf.deadline = utc_now() + timedelta(seconds=cfg.max_workflow_duration)
    wf.lease_token = wf.lease_until = None
    schedule(db, wf, target)
    wf.ready_at = utc_now()
    event(
        db,
        wf,
        "workflow.continued",
        f"Researcher requested {action.lower().replace('_', ' ')}.",
    )
    await db.commit()
    return await snapshot(db, wf)


def public_report(wf):
    if wf.status != "COMPLETED":
        raise HTTPException(
            409,
            "Report is not citation validated; inspect evidence and workflow limitations",
        )
    return {
        "research_question": wf.research_question,
        "report": wf.draft,
        "limitations": wf.limitations,
        "metrics": wf.metrics,
        "confidence": wf.confidence,
    }
