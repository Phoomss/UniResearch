"""Initialize legacy tables on fresh installations before additive Alembic upgrades.
Existing tables are left intact, matching the application's existing create_all behavior.
"""

import asyncio

from app.db.database import Base, engine
from app.models import (  # noqa: F401
    category,
    interactions,
    notification,
    options,
    research,
    user,
)
from sqlalchemy import text


async def main():
    async with engine.begin() as connection:
        await connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        tables = [
            t
            for t in Base.metadata.sorted_tables
            if not t.name.startswith("research_flow_")
        ]
        await connection.run_sync(
            lambda conn: Base.metadata.create_all(conn, tables=tables)
        )
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
