"""Run with python -m app.services.research_flow.worker. Same backend image, no broker."""

import asyncio
import logging

from app.core.research_flow_config import flow_settings
from app.db.database import AsyncSessionLocal, engine

# Register model dependencies when not importing the FastAPI application.
from app.models import (  # noqa: F401
    category,
    interactions,
    notification,
    options,
    research,
    user,
)
from app.services.research_flow.engine import run_once


async def main():
    logging.basicConfig(level=logging.INFO)
    try:
        while True:
            try:
                worked = (
                    await run_once(AsyncSessionLocal)
                    if flow_settings.enabled
                    else False
                )
            except Exception as exc:  # noqa: BLE001 - isolate external calls and persist recoverable failure
                logging.getLogger("research_flow").error(
                    "worker_error category=%s", type(exc).__name__
                )
                worked = False
            if not worked:
                await asyncio.sleep(flow_settings.poll_seconds)
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
