"""One durable task per lease. The model proposes; deterministic code validates/routes."""

import asyncio
import json
import logging
import time
from datetime import timedelta
from uuid import uuid4

from app.core.ai_config import ai_settings
from app.core.research_flow_config import flow_settings as cfg
from app.core.research_flow_time import utc_now
from app.models.research_flow import ResearchCitation as Citation
from app.models.research_flow import ResearchClaim as Claim
from app.models.research_flow import ResearchEvidence as Evidence
from app.models.research_flow import ResearchPaper as Paper
from app.models.research_flow import ResearchSource as Source
from app.models.research_flow import ResearchTask as Task
from app.models.research_flow import ResearchWorkflow as Workflow
from app.schemas.research_flow import SearchOutput
from app.services.research_flow.agents import AGENTS, BASE
from app.services.research_flow.providers import get_provider
from app.services.research_flow.search import LocalSearchProvider
from app.services.research_flow.state import event, load_state, schedule
from sqlalchemy import delete, or_, select, update

logger = logging.getLogger("research_flow")
TERMINAL = {"COMPLETED", "FAILED", "WAITING_FOR_HUMAN"}


class InvalidOutput(ValueError):
    pass


class BudgetReached(RuntimeError):
    pass


def index(items):
    return {item["id"]: item for item in items}


def verified_context(state):
    claims = [c for c in state["claims"] if c["verified"]]
    claim_ids = {c["id"] for c in claims}
    links = [
        e
        for e in state["evidence"]
        if e["support_verified"] and e["claim_id"] in claim_ids
    ]
    source_ids = {e["source_id"] for e in links}
    return {
        "claims": claims,
        "evidence": links,
        "sources": [
            {k: s[k] for k in ("id", "title", "url", "chunk_ref")}
            for s in state["sources"]
            if s["id"] in source_ids
        ],
    }


def context_for(agent, wf, state):
    question = {"research_question": wf.research_question}
    if agent == "planner":
        return question
    if agent == "paper":
        read_ids = {p["source_id"] for p in state["papers"]}
        unread = [s for s in state["sources"] if s["id"] not in read_ids]
        selected = (unread or state["sources"])[: cfg.paper_batch_size]
        return {
            "sources": [
                {k: s[k] for k in ("id", "title", "content", "chunk_ref")}
                for s in selected
            ]
        }
    if agent == "evidence":
        return {
            **question,
            "papers": [
                {
                    "source_id": p["source_id"],
                    "explicit": {
                        k: v for k, v in p["summary"].items() if k != "interpretation"
                    },
                }
                for p in state["papers"]
            ],
            "sources": [
                {k: s[k] for k in ("id", "title", "content", "chunk_ref")}
                for s in state["sources"]
            ],
        }
    if agent == "verifier":
        return {
            "claims": state["claims"],
            "evidence": state["evidence"],
            "sources": [{k: s[k] for k in ("id", "content")} for s in state["sources"]],
        }
    if agent == "critic":
        return {
            **question,
            "claims": state["claims"],
            "evidence": state["evidence"],
            "sources": [
                {
                    k: s[k]
                    for k in ("id", "title", "quality", "retrieval_score", "authors")
                }
                for s in state["sources"]
            ],
        }
    if agent == "writer":
        return verified_context(state)
    if agent == "citation":
        return {**verified_context(state), "draft": wf.draft}
    raise InvalidOutput("unknown_agent")


def require_quote(quote, source):
    if not quote.strip() or quote not in source["content"]:
        raise InvalidOutput("quote_not_in_source")


def wait_for_human(db, wf, reason, task_id=None):
    wf.status = "WAITING_FOR_HUMAN"
    wf.ready_at = None
    wf.limitations = list(dict.fromkeys([*(wf.limitations or []), reason]))
    event(db, wf, "human_review.required", reason, task_id)


def route(db, wf, task, agent, feedback=False):
    if feedback:
        wf.iteration += 1
        if wf.iteration >= cfg.max_research_iterations:
            wait_for_human(db, wf, "Research iteration limit reached.", task.id)
            return
    if agent == "search" and wf.search_rounds >= cfg.max_search_rounds:
        wait_for_human(db, wf, "Search round limit reached.", task.id)
        return
    schedule(db, wf, agent, task.id)
    wf.ready_at = utc_now()


async def clear_claims(db, wf):
    for model in (Citation, Evidence, Claim):
        await db.execute(delete(model).where(model.workflow_id == wf.id))
    wf.draft = {}
    wf.metrics = {}
    wf.confidence = 0


def calculate_metrics(state, draft, supported_indices, critic_accepted):
    total = len(draft.get("sentences", []))
    coverage = len(supported_indices) / total if total else 0
    claims = state["claims"]
    evidence_coverage = (
        sum(bool(c["verified"]) for c in claims) / len(claims) if claims else 0
    )
    links = [e for e in state["evidence"] if e["support_verified"]]
    agreeing = (
        sum(e["relation"] == "supporting" for e in links) / len(links) if links else 0
    )
    cited = {
        sid
        for i, sentence in enumerate(draft.get("sentences", []))
        if i in supported_indices
        for sid in sentence["source_ids"]
    }
    sources = [s for s in state["sources"] if s["id"] in cited]
    quality = sum(s["quality"] for s in sources) / len(sources) if sources else 0
    # Document count is an independence proxy, not proof of independent studies.
    independence = min(len({s["document_id"] for s in sources}) / 5, 1)
    confidence = coverage * (
        0.3 * evidence_coverage
        + 0.2 * agreeing
        + 0.2 * quality
        + 0.2 * independence
        + 0.1 * int(critic_accepted)
    )
    return {
        "total_claims": total,
        "supported_claims": len(supported_indices),
        "unsupported_claims": total - len(supported_indices),
        "citation_coverage": coverage,
        "evidence_coverage": evidence_coverage,
        "source_agreement": agreeing,
        "source_quality": quality,
        "source_independence_proxy": independence,
        "critic_accepted": critic_accepted,
        "confidence": round(confidence, 4),
    }


async def apply_output(db, wf, task, state, result):
    agent = task.agent_type
    sources = index(state["sources"])
    if agent == "planner":
        wf.plan = result
        if result["ambiguous"]:
            wait_for_human(db, wf, "Research question needs clarification.", task.id)
        else:
            route(db, wf, task, "search")
    elif agent == "search":
        existing = {s["document_id"] for s in state["sources"]}
        room = min(cfg.max_papers, cfg.depth_sources.get(wf.depth, 10)) - len(existing)
        for data in result["results"][: max(room, 0)]:
            if data["document_id"] in existing:
                continue
            # Adapter metadata is trusted code; URL never comes from an LLM.
            if (
                data["url"] != f"/research/{data['document_id']}"
                or data["provider"] != "uniresearch"
            ):
                raise InvalidOutput("invalid_source_provenance")
            data["content"] = data["content"][
                : min(6000, cfg.max_context_chars // max(cfg.max_papers, 1))
            ]
            db.add(Source(workflow_id=wf.id, **data))
            existing.add(data["document_id"])
            event(db, wf, "source.found", "Repository source added.", task.id)
        wf.search_rounds += 1
        if not existing:
            route(db, wf, task, "search", feedback=True)
        else:
            route(db, wf, task, "paper")
    elif agent == "paper":
        seen = set()
        if not result["papers"]:
            raise InvalidOutput("empty_paper_output")
        for summary in result["papers"]:
            sid = summary["source_id"]
            if sid not in sources or sid in seen:
                raise InvalidOutput("unknown_or_duplicate_source")
            seen.add(sid)
            for key in (
                "objective",
                "methodology",
                "dataset",
                "findings",
                "limitations",
                "conclusions",
            ):
                values = (
                    summary[key] if isinstance(summary[key], list) else [summary[key]]
                )
                for value in values:
                    if value:
                        require_quote(value["quote"], sources[sid])
                        if value["text"] != value["quote"]:
                            raise InvalidOutput("explicit_statement_must_be_verbatim")
            await db.execute(
                delete(Paper).where(Paper.workflow_id == wf.id, Paper.source_id == sid)
            )
            db.add(Paper(workflow_id=wf.id, source_id=sid, summary=summary))
            event(
                db,
                wf,
                "paper.analyzed",
                "Abstract analyzed; interpretation stored separately.",
                task.id,
            )
        expected = {s["id"] for s in context_for("paper", wf, state)["sources"]}
        if seen != expected:
            raise InvalidOutput("incomplete_paper_batch")
        read_ids = {p["source_id"] for p in state["papers"]} | seen
        route(db, wf, task, "paper" if set(sources) - read_ids else "evidence")
    elif agent == "evidence":
        await clear_claims(db, wf)
        for proposed in result["claims"]:
            claim = Claim(id=str(uuid4()), workflow_id=wf.id, text=proposed["text"])
            db.add(claim)
            seen = set()
            for link in proposed["evidence"]:
                sid = link["source_id"]
                key = (sid, link["relation"], link["quote"])
                if sid not in sources or key in seen:
                    raise InvalidOutput("unknown_or_duplicate_evidence")
                seen.add(key)
                require_quote(link["quote"], sources[sid])
                db.add(
                    Evidence(
                        workflow_id=wf.id,
                        claim_id=claim.id,
                        source_id=sid,
                        relation=link["relation"],
                        quote=link["quote"],
                        locator=sources[sid]["chunk_ref"],
                    )
                )
        await db.flush()
        event(
            db,
            wf,
            "evidence.updated",
            f"{len(result['claims'])} claims mapped to source excerpts.",
            task.id,
        )
        route(db, wf, task, "verifier")
    elif agent == "verifier":
        checks = {v["evidence_id"]: v["supports_relation"] for v in result["checks"]}
        if len(checks) != len(result["checks"]) or set(checks) != set(
            index(state["evidence"])
        ):
            raise InvalidOutput("incomplete_verification")
        for evidence in state["evidence"]:
            await db.execute(
                update(Evidence)
                .where(Evidence.id == evidence["id"])
                .values(support_verified=int(checks[evidence["id"]]))
            )
        for claim in state["claims"]:
            support = {
                e["source_id"]
                for e in state["evidence"]
                if e["claim_id"] == claim["id"]
                and e["relation"] == "supporting"
                and checks[e["id"]]
            }
            contradict = {
                e["source_id"]
                for e in state["evidence"]
                if e["claim_id"] == claim["id"]
                and e["relation"] == "contradicting"
                and checks[e["id"]]
            }
            strength = (
                "moderate"
                if len(support) >= 2
                else "weak"
                if support
                else "insufficient"
            )
            await db.execute(
                update(Claim)
                .where(Claim.id == claim["id"])
                .values(verified=int(bool(support)), strength=strength)
            )
            if contradict:
                event(
                    db,
                    wf,
                    "contradiction.detected",
                    "Conflicting evidence detected.",
                    task.id,
                )
        route(db, wf, task, "critic")
    elif agent == "critic":
        if any(
            issue["claim_id"] and issue["claim_id"] not in index(state["claims"])
            for issue in result["issues"]
        ):
            raise InvalidOutput("unknown_critic_claim")
        wf.critic_feedback = result
        if result["queries"]:
            wf.plan = {**wf.plan, "queries": result["queries"]}
        links = [e for e in state["evidence"] if e["support_verified"]]
        strong_conflict = any(
            len(
                {
                    e["source_id"]
                    for e in links
                    if e["claim_id"] == c["id"] and e["relation"] == "contradicting"
                }
            )
            >= max(
                1,
                len(
                    {
                        e["source_id"]
                        for e in links
                        if e["claim_id"] == c["id"] and e["relation"] == "supporting"
                    }
                ),
            )
            for c in state["claims"]
        )
        supported_sources = {
            e["source_id"] for e in links if e["relation"] == "supporting"
        }
        min_sources = {"QUICK": 2, "STANDARD": 3, "DEEP": 5}[wf.depth]
        if strong_conflict or result["action"] == "REQUEST_HUMAN_REVIEW":
            wait_for_human(
                db,
                wf,
                "Conflicting or unreliable evidence requires human review.",
                task.id,
            )
        elif (
            not state["claims"]
            or any(not c["verified"] for c in state["claims"])
            or len(supported_sources) < min_sources
        ):
            route(db, wf, task, "search", feedback=True)
        elif (
            result["status"] == "ACCEPT"
            and result["action"] == "ACCEPT"
            and not result["issues"]
        ):
            route(db, wf, task, "writer")
        else:
            mapping = {
                "SEARCH_MORE": "search",
                "READ_MORE": "paper",
                "RECHECK_EVIDENCE": "evidence",
                "REWRITE": "writer",
                "RECHECK_CITATIONS": "citation",
            }
            target = mapping.get(result["action"], "evidence")
            # A draft cannot be accepted before a successful evidence review.
            if target in {"writer", "citation"}:
                target = "evidence"
            route(db, wf, task, target, feedback=True)
    elif agent == "writer":
        # Structural citation integrity checked before persisting the draft.
        validate_sentences(result, state)
        wf.draft = result
        event(
            db,
            wf,
            "draft.generated",
            "Draft generated from verified evidence.",
            task.id,
        )
        route(db, wf, task, "citation")
    elif agent == "citation":
        sentences = wf.draft.get("sentences", [])
        checks = {c["sentence_index"]: c["supported"] for c in result["checks"]}
        if (
            not sentences
            or len(checks) != len(result["checks"])
            or set(checks) != set(range(len(sentences)))
        ):
            raise InvalidOutput("incomplete_citation_validation")
        structural = validate_sentences(wf.draft, state, raise_error=False)
        supported = {i for i, ok in checks.items() if ok and i in structural}
        metrics = calculate_metrics(
            state, wf.draft, supported, wf.critic_feedback.get("status") == "ACCEPT"
        )
        wf.metrics = metrics
        wf.confidence = metrics["confidence"]
        await db.execute(delete(Citation).where(Citation.workflow_id == wf.id))
        for i in supported:
            sentence = sentences[i]
            for sid in sentence["source_ids"]:
                link = next(
                    e
                    for e in state["evidence"]
                    if e["claim_id"] == sentence["claim_id"]
                    and e["source_id"] == sid
                    and e["relation"] == "supporting"
                    and e["support_verified"]
                )
                db.add(
                    Citation(
                        workflow_id=wf.id,
                        claim_id=sentence["claim_id"],
                        source_id=sid,
                        evidence_id=link["id"],
                        sentence_index=i,
                    )
                )
        event(
            db,
            wf,
            "citation.validated",
            f"{len(supported)}/{len(sentences)} report sentences supported.",
            task.id,
        )
        if len(supported) != len(sentences):
            # Never release a failed draft; retain counts for inspection.
            wf.draft = {}
            route(db, wf, task, "evidence", feedback=True)
        else:
            wf.status = "COMPLETED"
            wf.ready_at = None
            event(db, wf, "workflow.completed", "Research report validated.", task.id)


def validate_sentences(draft, state, raise_error=True):
    claims = index(state["claims"])
    sources = index(state["sources"])
    valid = set()
    for i, sentence in enumerate(draft["sentences"]):
        claim = claims.get(sentence["claim_id"])
        ok = bool(claim and claim["verified"]) and len(
            set(sentence["source_ids"])
        ) == len(sentence["source_ids"])
        for sid in sentence["source_ids"]:
            matching = [
                e
                for e in state["evidence"]
                if e["claim_id"] == sentence["claim_id"]
                and e["source_id"] == sid
                and e["relation"] == "supporting"
                and e["support_verified"]
            ]
            ok = (
                ok
                and sid in sources
                and bool(matching)
                and all(e["quote"] in sources[sid]["content"] for e in matching)
            )
        if ok:
            valid.add(i)
        elif raise_error:
            raise InvalidOutput("citation_source_mismatch")
    return valid


async def run_once(
    session_factory, provider=None, search_provider=None, workflow_id=None
):
    now = utc_now()
    token = str(uuid4())
    async with session_factory() as db:
        query = select(Workflow.id).where(
            Workflow.ready_at <= now,
            ~Workflow.status.in_(TERMINAL),
            or_(Workflow.lease_until.is_(None), Workflow.lease_until < now),
        )
        if workflow_id:
            query = query.where(Workflow.id == workflow_id)
        candidate = (
            await db.execute(query.order_by(Workflow.ready_at).limit(1))
        ).scalar_one_or_none()
        if not candidate:
            return False
        claimed = await db.execute(
            update(Workflow)
            .where(
                Workflow.id == candidate,
                Workflow.ready_at <= now,
                ~Workflow.status.in_(TERMINAL),
                or_(Workflow.lease_until.is_(None), Workflow.lease_until < now),
            )
            .values(
                lease_token=token,
                lease_until=now + timedelta(seconds=cfg.agent_timeout * 2 + 30),
            )
        )
        if claimed.rowcount != 1:
            await db.rollback()
            return False
        wf = await db.get(Workflow, candidate, populate_existing=True)
        task = (
            await db.execute(
                select(Task)
                .where(
                    Task.workflow_id == candidate,
                    Task.status.in_(["PENDING", "RETRYING", "RUNNING"]),
                )
                .order_by(Task.started_at.desc())
                .limit(1)
            )
        ).scalar_one_or_none()
        if task is None:
            wait_for_human(db, wf, "Missing pending task; recovery required.")
            wf.lease_token = wf.lease_until = None
            await db.commit()
            return True
        if task.depends_on:
            dependency = await db.get(Task, task.depends_on)
            if dependency is None or dependency.status != "COMPLETED":
                task.status = "BLOCKED"
                wait_for_human(db, wf, "Task dependency is incomplete.", task.id)
                wf.lease_token = wf.lease_until = None
                await db.commit()
                return True
        state = await load_state(db, candidate)
        context = (
            None
            if task.agent_type == "search"
            else context_for(task.agent_type, wf, state)
        )
        estimated_input = len(
            json.dumps(context or {}, ensure_ascii=False)
        )  # Conservative UTF text budget proxy.
        reason = None
        if wf.deadline and now >= wf.deadline:
            reason = "Workflow duration limit reached."
        elif context is not None and estimated_input > cfg.max_context_chars:
            reason = "Agent context size limit reached."
        elif context is not None and (
            wf.llm_calls >= cfg.max_llm_calls
            or wf.input_tokens + wf.output_tokens + estimated_input + cfg.output_tokens
            > cfg.max_tokens
        ):
            reason = "LLM call or token budget reached."
        elif task.status == "RUNNING":
            # A previous process died after reserving this attempt.
            task.retry_count += 1
            if task.retry_count > cfg.max_agent_retries:
                reason = "Interrupted task retry limit reached."
        if reason:
            task.status = "BLOCKED"
            wait_for_human(db, wf, reason, task.id)
            wf.lease_token = wf.lease_until = None
            await db.commit()
            return True
        task.status = "RUNNING"
        task.started_at = now
        task.model = (
            "local-search"
            if context is None
            else cfg.agent_models.get(task.agent_type, ai_settings.AI_MODEL)
        )
        task.input_tokens = estimated_input if context is not None else 0
        task.output_tokens = cfg.output_tokens if context is not None else 0
        if context is not None:
            wf.llm_calls += 1
            wf.input_tokens += (
                estimated_input  # Reserve before provider I/O; retain on failure.
            )
            wf.output_tokens += cfg.output_tokens
        event(
            db,
            wf,
            "agent.started",
            f"{task.agent_type.title()} agent started.",
            task.id,
        )
        await db.commit()
        task_id, agent = task.id, task.agent_type
        # Read state is detached; no long DB transaction during provider calls.
        db.expunge(wf)
    start = time.monotonic()
    output, llm_result, error = None, None, None
    try:
        remaining = (
            (wf.deadline - utc_now()).total_seconds()
            if wf.deadline
            else cfg.agent_timeout
        )
        async with asyncio.timeout(max(0.01, min(cfg.agent_timeout, remaining))):
            if agent == "search":
                async with session_factory() as read_db:
                    output = {
                        "results": await (
                            search_provider or LocalSearchProvider()
                        ).search(
                            read_db,
                            wf.plan.get("queries", [wf.research_question]),
                            min(cfg.max_papers, cfg.depth_sources.get(wf.depth, 10)),
                        )
                    }
                output = SearchOutput.model_validate(output).model_dump()
            else:
                role = AGENTS[agent]
                llm_result = await (provider or get_provider()).generate(
                    agent,
                    BASE + "\n" + role.policy,
                    context,
                    role.output_schema.model_json_schema(),
                )
                output = role.output_schema.model_validate(llm_result.data).model_dump()
    except Exception as exc:  # noqa: BLE001 - isolate external calls and persist recoverable failure
        error = type(exc).__name__  # Never persist raw provider messages or secrets.
    duration = int((time.monotonic() - start) * 1000)
    async with session_factory() as db:
        # CAS fences stale workers and makes cancellation win before any result writes.
        guard = await db.execute(
            update(Workflow)
            .where(
                Workflow.id == candidate,
                Workflow.lease_token == token,
                Workflow.lease_until > utc_now(),
                ~Workflow.status.in_(TERMINAL),
            )
            .values(updated_at=utc_now())
        )
        if guard.rowcount != 1:
            await db.rollback()
            return True
        current = await db.get(Workflow, candidate, populate_existing=True)
        task = await db.get(Task, task_id)
        if llm_result:
            task.model = llm_result.model
            task.input_tokens = llm_result.input_tokens or estimated_input
            task.output_tokens = llm_result.output_tokens or cfg.output_tokens
            current.input_tokens += task.input_tokens - estimated_input
            current.output_tokens += task.output_tokens - cfg.output_tokens
        if not error:
            try:
                # Reject all partial state mutations from malformed agent output.
                async with db.begin_nested():
                    await apply_output(db, current, task, state, output)
                    await db.flush()
            except Exception as exc:  # noqa: BLE001 - isolate external calls and persist recoverable failure
                error = type(exc).__name__
                await db.refresh(current)
                await db.refresh(task)
        task.duration_ms = duration
        if error:
            task.error = error
            task.retry_count += 1
            task.status = (
                "RETRYING" if task.retry_count <= cfg.max_agent_retries else "FAILED"
            )
            event(
                db,
                current,
                "agent.failed",
                f"{agent.title()} failed ({error}).",
                task.id,
            )
            if task.status == "FAILED":
                wait_for_human(db, current, "Agent retry limit reached.", task.id)
            else:
                current.ready_at = utc_now() + timedelta(
                    seconds=min(2**task.retry_count, 30)
                )
        else:
            task.status = "COMPLETED"
            task.output = (
                output if agent != "search" else {"results": len(output["results"])}
            )
            task.completed_at = utc_now()
            task.error = None
            event(
                db,
                current,
                "agent.completed",
                f"{agent.title()} agent completed.",
                task.id,
            )
        current.lease_token = current.lease_until = None
        await db.commit()
        logger.info(
            json.dumps(
                {
                    "workflowId": candidate,
                    "taskId": task_id,
                    "agentType": agent,
                    "status": task.status,
                    "duration": duration,
                    "retryCount": task.retry_count,
                    "model": task.model,
                    "inputTokens": task.input_tokens,
                    "outputTokens": task.output_tokens,
                    "errorCategory": error,
                }
            )
        )
    return True
