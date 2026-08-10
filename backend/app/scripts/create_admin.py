"""Safely provision an administrator in an approved local database."""

import asyncio
from dataclasses import dataclass
from enum import Enum
import os
import sys

from pydantic import ValidationError
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.database import AsyncSessionLocal
from app.models.user import User
from app.schemas.user import UserCreate


ALLOWED_ENVIRONMENTS = {"development", "dev", "local", "test", "testing"}
LOCAL_DATABASE_HOSTS = {"localhost", "127.0.0.1", "::1", "db"}
UNSAFE_DATABASE_MARKERS = {"production", "prod", "staging", "stage"}


class ProvisioningError(Exception):
    """Expected safety or provisioning failure safe to display to an operator."""


class ExistingNonAdminError(ProvisioningError):
    """The requested email belongs to an account that must not be promoted."""


class DatabaseProvisioningError(ProvisioningError):
    """A database operation failed without exposing its potentially sensitive detail."""


class ProvisioningStatus(str, Enum):
    CREATED = "created"
    ALREADY_EXISTS = "already_exists"


@dataclass(frozen=True)
class DatabaseTarget:
    driver: str
    host: str
    database: str


def mask_email(email: str) -> str:
    local, separator, domain = email.partition("@")
    visible = local[:2] if len(local) > 1 else local[:1]
    return f"{visible}***{separator}{domain}" if separator else "***"


from typing import Optional

def require_allowed_environment(value: Optional[str]) -> str:
    normalized = (value or "").strip().lower()
    if normalized not in ALLOWED_ENVIRONMENTS:
        raise ProvisioningError(
            "APP_ENV must be one of: development, dev, local, test, testing. "
            "Provisioning is disabled for missing, unknown, staging, and production environments."
        )
    return normalized


def inspect_database_target(database_url: str) -> DatabaseTarget:
    try:
        url = make_url(database_url)
    except Exception as exc:
        raise ProvisioningError("DATABASE_URL is invalid; provisioning was not attempted.") from exc

    driver = url.drivername.lower()
    host = (url.host or "").lower()
    database = url.database or ""
    target_text = f"{host} {database}".lower()

    if any(marker in target_text for marker in UNSAFE_DATABASE_MARKERS):
        raise ProvisioningError("The database target appears to be staging or production; provisioning was refused.")

    if driver.startswith("sqlite"):
        return DatabaseTarget(driver=driver, host="local", database=database or ":memory:")

    if driver.startswith("postgresql") and host in LOCAL_DATABASE_HOSTS:
        return DatabaseTarget(driver=driver, host=host, database=database)

    raise ProvisioningError(
        "The database target could not be confirmed as local. Use SQLite or PostgreSQL on localhost, "
        "a loopback address, or the local Docker Compose host 'db'."
    )


def read_credentials() -> tuple[str, str]:
    raw_email = os.getenv("DEV_ADMIN_EMAIL")
    password = os.getenv("DEV_ADMIN_PASSWORD")
    if not raw_email or not raw_email.strip():
        raise ProvisioningError("DEV_ADMIN_EMAIL is required.")
    if not password:
        raise ProvisioningError("DEV_ADMIN_PASSWORD is required.")

    try:
        validated = UserCreate(email=raw_email.strip(), password=password, role="admin")
    except ValidationError as exc:
        raise ProvisioningError("DEV_ADMIN_EMAIL must be a valid email address.") from exc
    return str(validated.email), password


async def provision_admin(session: AsyncSession, email: str, password: str) -> ProvisioningStatus:
    try:
        result = await session.execute(select(User).where(User.email == email))
        existing = result.scalars().first()
        if existing is not None:
            if existing.role == "admin":
                return ProvisioningStatus.ALREADY_EXISTS
            raise ExistingNonAdminError(
                "An account with this email already exists and is not an administrator. "
                "No changes were made; use a separate development email or request an approved backend-team action."
            )

        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            role="admin",
            is_active=True,
        )
        session.add(user)
        await session.commit()
        return ProvisioningStatus.CREATED
    except ExistingNonAdminError:
        await session.rollback()
        raise
    except SQLAlchemyError as exc:
        await session.rollback()
        raise DatabaseProvisioningError(
            "Administrator provisioning failed because of a database error; the transaction was rolled back."
        ) from exc


async def run() -> int:
    try:
        environment = require_allowed_environment(os.getenv("APP_ENV"))
        target = inspect_database_target(settings.DATABASE_URL)
        email, password = read_credentials()
        print(f"Environment confirmed: {environment}")
        print(f"Database target: driver={target.driver}, host={target.host}, database={target.database}")

        async with AsyncSessionLocal() as session:
            status = await provision_admin(session, email, password)

        safe_email = mask_email(email)
        if status is ProvisioningStatus.CREATED:
            print(f"Development administrator created: email={safe_email}, role=admin")
        else:
            print(f"Development administrator already exists: email={safe_email}, role=admin; no changes made")
        return 0
    except ProvisioningError as exc:
        print(f"Provisioning refused: {exc}", file=sys.stderr)
        return 1


def main() -> None:
    raise SystemExit(asyncio.run(run()))


if __name__ == "__main__":
    main()
