"""Opt-in integration checks; URL must target the disposable local flowtest database."""

import asyncio
import os
import sys
from pathlib import Path

import pytest
from app.core.research_flow_config import flow_settings as cfg
from app.models.research import ResearchWork
from app.models.research_flow import ResearchWorkflow as Workflow
from app.models.user import User
from app.schemas.research_flow import CreateWorkflow
from app.services.research_flow import service
from app.services.research_flow.engine import run_once
from app.services.research_flow.providers import MockProvider
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from test_research_flow import QUESTION, QUOTE, answers

URL = os.environ.get("RESEARCH_FLOW_TEST_POSTGRES_URL", "")
pytestmark = [
    pytest.mark.asyncio,
    pytest.mark.skipif(not URL, reason="Disposable PostgreSQL URL not configured"),
]


async def test_postgresql_migration_quotas_and_leases(monkeypatch):
    assert "@127.0.0.1:55437/flowtest" in URL, (
        "Only the dedicated local test database is allowed"
    )
    root = Path(__file__).resolve().parents[1]
    env = {
        **os.environ,
        "DATABASE_URL": URL,
        "DB_SSL": "false",
        "APP_ENV": "test",
        "PYTHONPATH": str(root),
    }
    for args in [
        ("-m", "app.scripts.bootstrap_db"),
        ("-m", "alembic", "upgrade", "head"),
    ]:
        process = await asyncio.create_subprocess_exec(
            sys.executable,
            *args,
            cwd=root,
            env=env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await process.communicate()
        assert process.returncode == 0, stderr.decode()
    engine = create_async_engine(URL)
    factory = async_sessionmaker(engine, expire_on_commit=False)
    try:
        async with factory() as db:
            user = User(
                email="postgres-fixture@test.invalid",
                hashed_password="fixture-only",
                role="student",
                is_active=True,
            )
            db.add(user)
            await db.flush()
            for n in range(2):
                db.add(
                    ResearchWork(
                        title_th="test",
                        title_en=f"University retrieval fixture {n}",
                        abstract=QUOTE,
                        keywords="retrieval factual university",
                        status="approved",
                        submitted_by_id=user.id,
                    )
                )
            await db.commit()
        monkeypatch.setattr(cfg, "max_active_per_user", 1)

        async def create():
            async with factory() as db:
                try:
                    state = await service.create(
                        db,
                        user,
                        CreateWorkflow(research_question=QUESTION, depth="QUICK"),
                    )
                    return state["id"]
                except HTTPException as exc:
                    assert exc.status_code == 429
                    return None

        results = await asyncio.gather(create(), create())
        assert sum(r is not None for r in results) == 1
        flow = next(r for r in results if r)
        async with factory() as db:
            wf = await service.owned(db, flow, user, lock=True)
            await service.start(db, wf)

        class SlowMock(MockProvider):
            async def generate(self, *args):
                await asyncio.sleep(0.2)
                return await super().generate(*args)

        provider = SlowMock(answers)
        claimed = await asyncio.gather(
            run_once(factory, provider, workflow_id=flow),
            run_once(factory, provider, workflow_id=flow),
        )
        assert sorted(claimed) == [False, True]
        assert provider.calls == ["planner"]
        for _ in range(12):
            await run_once(factory, MockProvider(answers), workflow_id=flow)
        async with factory() as db:
            wf = (
                await db.execute(select(Workflow).where(Workflow.id == flow))
            ).scalar_one()
            assert wf.status == "COMPLETED"
            assert wf.metrics["citation_coverage"] == 1
    finally:
        await engine.dispose()
