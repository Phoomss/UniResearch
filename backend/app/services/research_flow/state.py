from datetime import datetime

from app.models.research_flow import (
    ResearchCitation,
    ResearchClaim,
    ResearchEvent,
    ResearchEvidence,
    ResearchPaper,
    ResearchSource,
    ResearchTask,
)
from sqlalchemy import select

ENTITIES = {
    "tasks": ResearchTask,
    "sources": ResearchSource,
    "papers": ResearchPaper,
    "claims": ResearchClaim,
    "evidence": ResearchEvidence,
    "citations": ResearchCitation,
    "events": ResearchEvent,
}


def serialize(row):
    result = {
        c.name: (
            getattr(row, c.name).isoformat()
            if isinstance(getattr(row, c.name), datetime)
            else getattr(row, c.name)
        )
        for c in row.__table__.columns
        if c.name not in {"lease_token", "lease_until"}
    }
    if row.__tablename__ == "research_flow_workflows" and row.status != "COMPLETED":
        result["draft"] = {}
    if row.__tablename__ == "research_flow_tasks" and row.agent_type == "writer":
        result["output"] = {
            "summary": "Draft available only through the citation-validated report."
        }
    return result


async def load_state(db, workflow_id):
    state = {}
    for key, model in ENTITIES.items():
        query = select(model).where(model.workflow_id == workflow_id)
        if key == "events":
            query = query.order_by(model.id).limit(1000)
        elif key == "tasks":
            query = query.order_by(model.started_at, model.id)
        state[key] = [serialize(row) for row in (await db.execute(query)).scalars()]
    return state


def event(db, workflow, name, summary, task_id=None):
    db.add(
        ResearchEvent(
            workflow_id=workflow.id,
            event_type=name,
            summary=summary[:256],
            task_id=task_id,
        )
    )


def schedule(db, workflow, agent, dependency=None):
    task = ResearchTask(
        workflow_id=workflow.id,
        agent_type=agent,
        depends_on=dependency,
        input={"iteration": workflow.iteration},
        output={},
    )
    db.add(task)
    workflow.next_agent = agent
    from app.services.research_flow.agents import AGENTS

    workflow.status = "SEARCHING" if agent == "search" else AGENTS[agent].state


async def snapshot(db, workflow):
    result = {**serialize(workflow), **await load_state(db, workflow.id)}
    if workflow.status != "COMPLETED":
        result["draft"] = {}
        for task in result["tasks"]:
            if task["agent_type"] == "writer":
                task["output"] = {
                    "summary": "Draft withheld until citation validation completes."
                }
    return result
