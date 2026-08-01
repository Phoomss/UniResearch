import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/auth/register",
        json={"email": "newuser@test.com", "password": "password123", "role": "student"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["role"] == "student"

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient, test_user):
    response = await client.post(
        "/auth/login",
        data={"username": "student@test.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, test_user):
    response = await client.post(
        "/auth/login",
        data={"username": "student@test.com", "password": "wrongpassword"}
    )
    assert response.status_code == 400
