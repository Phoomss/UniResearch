from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

import ssl

connect_args = {}
# Check if DB_SSL is explicitly set, or auto-detect based on host/environment
use_ssl = settings.DB_SSL
if use_ssl is None:
    is_local = (
        "localhost" in settings.DATABASE_URL
        or "127.0.0.1" in settings.DATABASE_URL
        or "@db" in settings.DATABASE_URL
        or settings.APP_ENV in ("development", "local", "test")
    )
    use_ssl = not is_local

if use_ssl:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ctx

engine = create_async_engine(settings.DATABASE_URL, echo=True, connect_args=connect_args)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
