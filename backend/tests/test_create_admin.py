from unittest.mock import AsyncMock, Mock

import pytest
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select

from app.core.security import verify_password
from app.models.user import User
from app.scripts.create_admin import (
    DatabaseProvisioningError,
    ExistingNonAdminError,
    ProvisioningError,
    ProvisioningStatus,
    inspect_database_target,
    mask_email,
    provision_admin,
    read_credentials,
    require_allowed_environment,
)


ADMIN_EMAIL = "provisioned-admin@example.com"
ADMIN_PASSWORD = "local-test-password"


@pytest.mark.asyncio
async def test_creates_active_admin_with_hashed_password(db_session):
    status = await provision_admin(db_session, ADMIN_EMAIL, ADMIN_PASSWORD)
    user = (await db_session.execute(select(User).where(User.email == ADMIN_EMAIL))).scalars().one()

    assert status is ProvisioningStatus.CREATED
    assert user.role == "admin"
    assert user.is_active is True
    assert user.hashed_password != ADMIN_PASSWORD
    assert verify_password(ADMIN_PASSWORD, user.hashed_password)


@pytest.mark.asyncio
async def test_created_admin_can_login_and_create_category(db_session, client):
    await provision_admin(db_session, ADMIN_EMAIL, ADMIN_PASSWORD)

    login = await client.post(
        "/auth/login",
        data={"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert login.status_code == 200
    assert set(login.json()) == {"access_token", "token_type"}

    response = await client.post(
        "/categories/",
        json={"category_name": "Provisioning verification"},
        headers={"Authorization": f"Bearer {login.json()['access_token']}"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_second_run_does_not_duplicate_or_change_existing_admin(db_session):
    await provision_admin(db_session, ADMIN_EMAIL, ADMIN_PASSWORD)
    original = (await db_session.execute(select(User).where(User.email == ADMIN_EMAIL))).scalars().one()
    original_hash = original.hashed_password

    status = await provision_admin(db_session, ADMIN_EMAIL, "different-password")
    users = (await db_session.execute(select(User).where(User.email == ADMIN_EMAIL))).scalars().all()

    assert status is ProvisioningStatus.ALREADY_EXISTS
    assert len(users) == 1
    assert users[0].hashed_password == original_hash
    assert verify_password(ADMIN_PASSWORD, users[0].hashed_password)


@pytest.mark.asyncio
async def test_existing_student_is_not_promoted(db_session):
    student = User(
        email=ADMIN_EMAIL,
        hashed_password="unchanged-hash",
        role="student",
        is_active=True,
    )
    db_session.add(student)
    await db_session.commit()

    with pytest.raises(ExistingNonAdminError):
        await provision_admin(db_session, ADMIN_EMAIL, ADMIN_PASSWORD)

    await db_session.refresh(student)
    assert student.role == "student"
    assert student.hashed_password == "unchanged-hash"


def test_missing_email_is_rejected(monkeypatch):
    monkeypatch.delenv("DEV_ADMIN_EMAIL", raising=False)
    monkeypatch.setenv("DEV_ADMIN_PASSWORD", ADMIN_PASSWORD)
    with pytest.raises(ProvisioningError, match="DEV_ADMIN_EMAIL"):
        read_credentials()


def test_missing_password_is_rejected(monkeypatch):
    monkeypatch.setenv("DEV_ADMIN_EMAIL", ADMIN_EMAIL)
    monkeypatch.delenv("DEV_ADMIN_PASSWORD", raising=False)
    with pytest.raises(ProvisioningError, match="DEV_ADMIN_PASSWORD"):
        read_credentials()


def test_email_is_masked_for_console_output():
    masked = mask_email(ADMIN_EMAIL)
    assert masked == "pr***@example.com"
    assert ADMIN_EMAIL not in masked


@pytest.mark.parametrize("value", [None, "production", "prod", "staging", "stage", "preview"])
def test_unsafe_environment_is_rejected(value):
    with pytest.raises(ProvisioningError, match="APP_ENV"):
        require_allowed_environment(value)


@pytest.mark.parametrize("value", ["development", "DEV", " local ", "test", "testing"])
def test_local_environment_is_allowed(value):
    assert require_allowed_environment(value) in {"development", "dev", "local", "test", "testing"}


def test_remote_or_production_database_is_rejected():
    with pytest.raises(ProvisioningError, match="local"):
        inspect_database_target("postgresql+asyncpg://user:secret@database.example.com/app")
    with pytest.raises(ProvisioningError, match="staging or production"):
        inspect_database_target("postgresql+asyncpg://user:secret@localhost/production")


@pytest.mark.asyncio
async def test_database_failure_rolls_back_without_exposing_details():
    session = Mock()
    result = Mock()
    result.scalars.return_value.first.return_value = None
    session.execute = AsyncMock(return_value=result)
    session.commit = AsyncMock(side_effect=SQLAlchemyError("secret database detail"))
    session.rollback = AsyncMock()

    with pytest.raises(DatabaseProvisioningError) as caught:
        await provision_admin(session, ADMIN_EMAIL, ADMIN_PASSWORD)

    session.rollback.assert_awaited_once()
    assert "secret database detail" not in str(caught.value)
