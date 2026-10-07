import asyncio
from datetime import timedelta

import pytest
import pytest_asyncio
from app.core.research_flow_config import flow_settings as cfg
from app.core.research_flow_time import utc_now
from app.core.security import create_access_token
from app.models.research import ResearchWork
from app.models.research_flow import ResearchTask as Task
from app.models.research_flow import ResearchWorkflow as Workflow
from app.schemas.research_flow import CreateWorkflow, HumanCommand
from app.services.research_flow import service
from app.services.research_flow.engine import (
    InvalidOutput,
    calculate_metrics,
    run_once,
    validate_sentences,
)
from app.services.research_flow.providers import (
    GeminiProvider,
    MockProvider,
    ProviderError,
    get_provider,
)
from app.services.research_flow.state import snapshot
from conftest import TestingSessionLocal
from sqlalchemy import select, update

pytestmark = pytest.mark.asyncio
QUOTE = "Retrieval reduced factual errors in the evaluated university question answering sample."
QUESTION = "How does retrieval reduce factual errors in university question answering?"


def answers(agent, context):
    if agent == "planner":
        return {
            "sub_questions": [QUESTION],
            "queries": ["retrieval factual university"],
            "ambiguous": False,
            "summary": "Compare repository evidence.",
        }
    if agent == "paper":
        return {
            "papers": [
                {
                    "source_id": s["id"],
                    "findings": [{"text": QUOTE, "quote": QUOTE}],
                    "interpretation": "Abstract-only finding.",
                }
                for s in context["sources"]
            ]
        }
    if agent == "evidence":
        return {
            "claims": [
                {
                    "text": QUOTE,
                    "evidence": [
                        {"source_id": s["id"], "relation": "supporting", "quote": QUOTE}
                        for s in context["sources"]
                    ],
                }
            ]
        }
    if agent == "verifier":
        return {
            "checks": [
                {"evidence_id": e["id"], "supports_relation": True}
                for e in context["evidence"]
            ]
        }
    if agent == "critic":
        return {"status": "ACCEPT", "action": "ACCEPT", "issues": [], "queries": []}
    if agent == "writer":
        return {
            "sentences": [
                {
                    "section": "Key Findings",
                    "claim_id": context["claims"][0]["id"],
                    "text": QUOTE,
                    "source_ids": [s["id"] for s in context["sources"]],
                }
            ]
        }
    if agent == "citation":
        return {
            "checks": [
                {"sentence_index": i, "supported": True}
                for i, _ in enumerate(context["draft"]["sentences"])
            ]
        }
    raise AssertionError(agent)


@pytest_asyncio.fixture
async def flow(db_session, test_user):
    for n in range(2):
        db_session.add(
            ResearchWork(
                title_th=f"มหาวิทยาลัย {n}",
                title_en=f"University retrieval {n}",
                abstract=QUOTE,
                keywords="retrieval factual university",
                status="approved",
                submitted_by_id=test_user.id,
            )
        )
    await db_session.commit()
    created = await service.create(
        db_session, test_user, CreateWorkflow(research_question=QUESTION, depth="QUICK")
    )
    wf = await service.owned(db_session, created["id"], test_user)
    await service.start(db_session, wf)
    return wf.id


async def drive(flow_id, provider=None, search_provider=None, steps=35):
    for _ in range(steps):
        async with TestingSessionLocal() as db:
            wf = await db.get(Workflow, flow_id)
            if wf.status in {"COMPLETED", "WAITING_FOR_HUMAN", "FAILED"}:
                return await snapshot(db, wf)
            wf.ready_at = utc_now() - timedelta(seconds=1)
            await db.commit()
        assert await run_once(
            TestingSessionLocal,
            provider or MockProvider(answers),
            search_provider,
            flow_id,
        )
    raise AssertionError("workflow did not terminate")


async def run_until(flow_id, agent, provider=None):
    for _ in range(25):
        async with TestingSessionLocal() as db:
            wf = await db.get(Workflow, flow_id)
            if wf.next_agent == agent:
                return await snapshot(db, wf)
        await run_once(
            TestingSessionLocal, provider or MockProvider(answers), workflow_id=flow_id
        )
    raise AssertionError("agent not reached")


async def test_successful_workflow_creation_routing_and_persistence(flow):
    provider = MockProvider(answers)
    state = await drive(flow, provider)
    assert state["status"] == "COMPLETED"
    assert state["metrics"]["citation_coverage"] == 1
    assert state["metrics"]["unsupported_claims"] == 0
    assert len(state["citations"]) == 2
    assert provider.calls == [
        "planner",
        "paper",
        "evidence",
        "verifier",
        "critic",
        "writer",
        "citation",
    ]
    assert [t["agent_type"] for t in state["tasks"]] == [
        "planner",
        "search",
        "paper",
        "evidence",
        "verifier",
        "critic",
        "writer",
        "citation",
    ]
    for previous, current in zip(state["tasks"], state["tasks"][1:]):
        assert current["depends_on"] == previous["id"]
    assert all(t["status"] == "COMPLETED" for t in state["tasks"])
    assert all(s["chunk_ref"] == "abstract" and not s["doi"] for s in state["sources"])
    assert state["confidence"] < 1


async def test_agent_failure_then_retry(flow):
    calls = 0

    def transient(agent, context):
        nonlocal calls
        if agent == "planner":
            calls += 1
            if calls == 1:
                raise ProviderError("secret API key must not appear")
        return answers(agent, context)

    state = await drive(flow, MockProvider(transient))
    assert state["status"] == "COMPLETED"
    assert state["tasks"][0]["retry_count"] == 1
    assert "secret API" not in str(state)
    assert any(e["event_type"] == "agent.failed" for e in state["events"])


async def test_llm_provider_failure_retry_limit_human_review(flow):
    state = await drive(flow, MockProvider(lambda *_: ProviderError("secret")))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["tasks"][0]["status"] == "FAILED"
    assert state["tasks"][0]["retry_count"] == cfg.max_agent_retries + 1
    assert state["llm_calls"] == cfg.max_agent_retries + 1
    assert state["draft"] == {}


async def test_search_provider_failure(flow):
    class BrokenSearch:
        async def search(self, *_):
            raise RuntimeError("private provider content")

    state = await drive(flow, search_provider=BrokenSearch())
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert any(
        t["agent_type"] == "search" and t["status"] == "FAILED" for t in state["tasks"]
    )
    assert "private provider content" not in str(state)


async def test_insufficient_evidence_iterates(flow, monkeypatch):
    monkeypatch.setattr(cfg, "max_research_iterations", 2)

    def unsupported(agent, context):
        if agent == "evidence":
            return {
                "claims": [
                    {
                        "text": "This is an unsupported research conclusion.",
                        "evidence": [],
                    }
                ]
            }
        return answers(agent, context)

    state = await drive(flow, MockProvider(unsupported))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["search_rounds"] == 2
    assert state["claims"][0]["verified"] == 0
    assert not any(t["agent_type"] == "writer" for t in state["tasks"])


async def test_contradictory_evidence_routes_human(flow):
    def conflict(agent, context):
        result = answers(agent, context)
        if agent == "evidence":
            result["claims"][0]["evidence"][1]["relation"] = "contradicting"
        return result

    state = await drive(flow, MockProvider(conflict))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert any(e["event_type"] == "contradiction.detected" for e in state["events"])
    assert not state["draft"]


async def test_unsupported_report_sentence_triggers_correction(flow, monkeypatch):
    monkeypatch.setattr(cfg, "max_research_iterations", 2)

    def citation_failure(agent, context):
        if agent == "citation":
            return {"checks": [{"sentence_index": 0, "supported": False}]}
        return answers(agent, context)

    state = await drive(flow, MockProvider(citation_failure))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["metrics"]["citation_coverage"] == 0
    assert state["draft"] == {}
    assert sum(t["agent_type"] == "evidence" for t in state["tasks"]) == 2


async def test_citation_source_mismatch_rejected(flow):
    def mismatch(agent, context):
        result = answers(agent, context)
        if agent == "writer":
            result["sentences"][0]["source_ids"] = ["fabricated-source"]
        return result

    state = await drive(flow, MockProvider(mismatch))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["draft"] == {}
    assert any(
        t["agent_type"] == "writer" and t["status"] == "FAILED" for t in state["tasks"]
    )


async def test_fake_quote_rolls_back_partial_evidence(flow):
    def fake(agent, context):
        result = answers(agent, context)
        if agent == "evidence":
            result["claims"][0]["evidence"][1]["quote"] = (
                "A fabricated quotation never present in the abstract."
            )
        return result

    state = await drive(flow, MockProvider(fake))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["claims"] == [] and state["evidence"] == []


async def test_missing_verification_rejected(flow):
    def missing(agent, context):
        if agent == "verifier":
            return {"checks": []}
        return answers(agent, context)

    state = await drive(flow, MockProvider(missing))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert not any(c["verified"] for c in state["claims"])


@pytest.mark.parametrize(
    "action,target",
    [
        ("SEARCH_MORE", "search"),
        ("READ_MORE", "paper"),
        ("RECHECK_EVIDENCE", "evidence"),
        ("REWRITE", "evidence"),
        ("RECHECK_CITATIONS", "evidence"),
    ],
)
async def test_conditional_critic_routes(flow, action, target):
    await run_until(flow, "critic")

    def review(agent, context):
        return (
            {
                "status": "REVISION_REQUIRED",
                "action": action,
                "issues": [],
                "queries": ["factual errors"],
            }
            if agent == "critic"
            else answers(agent, context)
        )

    await run_once(TestingSessionLocal, MockProvider(review), workflow_id=flow)
    async with TestingSessionLocal() as db:
        wf = await db.get(Workflow, flow)
        assert wf.next_agent == target
        assert wf.iteration == 1
        assert wf.plan["queries"] == ["factual errors"]


async def test_cancellation_fences_inflight_result(flow, db_session, test_user):
    entered, release = asyncio.Event(), asyncio.Event()

    class SlowProvider:
        async def generate(self, *args):
            entered.set()
            await release.wait()
            return await MockProvider(answers).generate(*args)

    runner = asyncio.create_task(
        run_once(TestingSessionLocal, SlowProvider(), workflow_id=flow)
    )
    await entered.wait()
    wf = await service.owned(db_session, flow, test_user, lock=True)
    await service.stop(db_session, wf)
    release.set()
    await runner
    await db_session.refresh(wf)
    state = await snapshot(db_session, wf)
    assert state["status"] == "FAILED"
    assert state["plan"] == {} and state["draft"] == {}
    assert state["tasks"][0]["error"] == "cancelled"


async def test_active_lease_prevents_duplicate_worker(flow, db_session):
    await db_session.execute(
        update(Workflow)
        .where(Workflow.id == flow)
        .values(
            lease_until=utc_now() + timedelta(minutes=10), lease_token="another-worker"
        )
    )
    await db_session.commit()
    assert (
        await run_once(TestingSessionLocal, MockProvider(answers), workflow_id=flow)
        is False
    )


async def test_crashed_task_recovers_with_retry(flow, db_session):
    task = (
        await db_session.execute(select(Task).where(Task.workflow_id == flow))
    ).scalar_one()
    task.status = "RUNNING"
    task.started_at = utc_now() - timedelta(minutes=10)
    await db_session.execute(
        update(Workflow)
        .where(Workflow.id == flow)
        .values(lease_until=utc_now() - timedelta(seconds=1))
    )
    await db_session.commit()
    state = await drive(flow)
    assert state["status"] == "COMPLETED"
    assert state["tasks"][0]["retry_count"] == 1


async def test_ambiguous_question_human_intervention(flow, db_session, test_user):
    def ambiguous(agent, context):
        data = answers(agent, context)
        if agent == "planner":
            data["ambiguous"] = True
        return data

    state = await drive(flow, MockProvider(ambiguous))
    assert state["status"] == "WAITING_FOR_HUMAN"
    wf = await service.owned(db_session, flow, test_user)
    await service.continue_workflow(
        db_session,
        wf,
        HumanCommand(action="MODIFY_QUESTION", research_question=QUESTION),
    )
    state = await drive(flow)
    assert state["status"] == "COMPLETED"


async def test_human_accept_still_runs_citation_validation(
    flow, db_session, test_user, monkeypatch
):
    monkeypatch.setattr(cfg, "max_research_iterations", 1)

    def skeptical(agent, context):
        if agent == "critic":
            return {
                "status": "REVISION_REQUIRED",
                "action": "SEARCH_MORE",
                "issues": [],
                "queries": [],
            }
        return answers(agent, context)

    state = await drive(flow, MockProvider(skeptical))
    assert state["status"] == "WAITING_FOR_HUMAN"
    wf = await service.owned(db_session, flow, test_user)
    await service.continue_workflow(
        db_session, wf, HumanCommand(action="ACCEPT_CURRENT")
    )
    state = await drive(flow)
    assert state["status"] == "COMPLETED"
    assert state["metrics"]["citation_coverage"] == 1
    assert state["metrics"]["critic_accepted"] is False


async def test_human_retry_failed_agent(flow, db_session, test_user):
    state = await drive(flow, MockProvider(lambda *_: ProviderError()))
    wf = await service.owned(db_session, flow, test_user)
    await service.continue_workflow(
        db_session,
        wf,
        HumanCommand(action="RETRY_AGENT", task_id=state["tasks"][0]["id"]),
    )
    assert (await drive(flow))["status"] == "COMPLETED"


@pytest.mark.parametrize(
    "budget", ["llm_calls", "tokens", "deadline", "context", "search"]
)
async def test_budget_limits_require_human(flow, db_session, monkeypatch, budget):
    wf = await db_session.get(Workflow, flow)
    if budget == "llm_calls":
        wf.llm_calls = cfg.max_llm_calls
    if budget == "tokens":
        wf.input_tokens = cfg.max_tokens
    if budget == "deadline":
        wf.deadline = utc_now() - timedelta(seconds=1)
    if budget == "context":
        monkeypatch.setattr(cfg, "max_context_chars", 10)
    if budget == "search":
        wf.search_rounds = cfg.max_search_rounds
    await db_session.commit()
    state = await drive(flow)
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["draft"] == {}


async def test_authorization_all_workflow_routes(flow, client, admin_user, test_user):
    own = {"Authorization": f"Bearer {create_access_token(test_user.email)}"}
    other = {"Authorization": f"Bearer {create_access_token(admin_user.email)}"}
    for suffix in [
        "",
        "/tasks",
        "/sources",
        "/evidence",
        "/report",
        "/events",
        "/claims",
        "/papers",
        "/citations",
    ]:
        assert (await client.get(f"/research-flow/{flow}{suffix}")).status_code == 401
        assert (
            await client.get(f"/research-flow/{flow}{suffix}", headers=other)
        ).status_code == 404
    for suffix in ["/start", "/stop", "/continue"]:
        assert (
            await client.post(f"/research-flow/{flow}{suffix}", headers=other, json={})
        ).status_code == 404
    response = await client.get(f"/research-flow/{flow}", headers=own)
    assert response.status_code == 200
    assert "lease_token" not in response.json()
    assert (
        await client.get(f"/research-flow/{flow}/report", headers=own)
    ).status_code == 409
    assert (await client.get("/research-flow", headers=other)).json() == []


async def test_creation_api_and_resource_limit(client, test_user, monkeypatch):
    monkeypatch.setattr(cfg, "max_active_per_user", 1)
    headers = {"Authorization": f"Bearer {create_access_token(test_user.email)}"}
    assert (
        await client.post("/research-flow", json={"research_question": QUESTION})
    ).status_code == 401
    created = await client.post(
        "/research-flow",
        headers=headers,
        json={"research_question": QUESTION, "depth": "QUICK"},
    )
    assert created.status_code == 201
    assert created.json()["status"] == "PLANNING"
    assert (
        await client.post(
            "/research-flow", headers=headers, json={"research_question": QUESTION}
        )
    ).status_code == 429
    assert (
        await client.post(
            "/research-flow", headers=headers, json={"research_question": "short"}
        )
    ).status_code == 422


async def test_search_excludes_unapproved_sources(flow, db_session, test_user):
    db_session.add(
        ResearchWork(
            title_th="private",
            title_en="Private retrieval",
            abstract=QUOTE,
            status="pending",
            submitted_by_id=test_user.id,
        )
    )
    await db_session.commit()
    state = await drive(flow)
    assert len(state["sources"]) == 2
    assert all(s["title"] != "Private retrieval" for s in state["sources"])


async def test_provider_unavailable_is_explicit(monkeypatch):
    from app.core.ai_config import ai_settings

    monkeypatch.setattr(ai_settings, "AI_ENABLED", False)
    with pytest.raises(ProviderError):
        await GeminiProvider().generate("writer", "system", {}, {})
    monkeypatch.setattr(cfg, "provider", "nonexistent")
    with pytest.raises(ProviderError):
        get_provider()


async def test_citation_coverage_uses_every_sentence():
    state = {
        "claims": [{"id": "c", "verified": 1}],
        "evidence": [
            {
                "claim_id": "c",
                "source_id": "s",
                "support_verified": 1,
                "relation": "supporting",
                "quote": QUOTE,
            }
        ],
        "sources": [{"id": "s", "content": QUOTE, "quality": 0.5, "document_id": 1}],
    }
    draft = {
        "sentences": [
            {"claim_id": "c", "source_ids": ["s"]},
            {"claim_id": "c", "source_ids": ["fake"]},
        ]
    }
    assert validate_sentences(draft, state, False) == {0}
    with pytest.raises(InvalidOutput):
        validate_sentences(draft, state)
    metrics = calculate_metrics(state, draft, {0}, True)
    assert metrics["citation_coverage"] == 0.5
    assert metrics["unsupported_claims"] == 1


async def test_paper_agent_batches_selected_sources(flow, monkeypatch):
    monkeypatch.setattr(cfg, "paper_batch_size", 1)
    state = await drive(flow)
    assert state["status"] == "COMPLETED"
    assert len(state["papers"]) == 2
    assert sum(t["agent_type"] == "paper" for t in state["tasks"]) == 2


async def test_explicit_paper_interpretation_cannot_be_disguised_as_quote(flow):
    def interpreted(agent, context):
        result = answers(agent, context)
        if agent == "paper":
            result["papers"][0]["findings"][0]["text"] = (
                "Retrieval eliminates every hallucination in every research task."
            )
        return result

    state = await drive(flow, MockProvider(interpreted))
    assert state["status"] == "WAITING_FOR_HUMAN"
    assert state["papers"] == []


async def test_unvalidated_draft_is_withheld_from_lists_and_tasks(
    flow, client, test_user
):
    await run_until(flow, "citation")
    headers = {"Authorization": f"Bearer {create_access_token(test_user.email)}"}
    rows = (await client.get("/research-flow", headers=headers)).json()
    assert rows[0]["draft"] == {}
    state = (await client.get(f"/research-flow/{flow}", headers=headers)).json()
    assert state["draft"] == {}
    writer = next(t for t in state["tasks"] if t["agent_type"] == "writer")
    assert "sentences" not in writer["output"]
