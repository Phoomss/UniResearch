import pytest
from httpx import AsyncClient
import json

@pytest.mark.asyncio
async def test_create_research(client: AsyncClient, admin_user):
    # Login as admin
    login_resp = await client.post("/auth/login", data={"username": "admin@test.com", "password": "password123"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create category first
    cat_resp = await client.post("/categories/", json={"category_name": "AI"}, headers=headers)
    assert cat_resp.status_code == 200
    cat_id = cat_resp.json()["id"]

    # Create research (form data)
    data = {
        "title_th": "ทดสอบ",
        "title_en": "Test Research",
        "category_id": cat_id,
        "author_ids": json.dumps([]),
        "advisor_ids": json.dumps([])
    }
    resp = await client.post("/research/", data=data, headers=headers)
    assert resp.status_code == 200
    res_data = resp.json()
    assert res_data["title_en"] == "Test Research"
    assert res_data["status"] == "pending"

@pytest.mark.asyncio
async def test_search_and_filter(client: AsyncClient, admin_user):
    login_resp = await client.post("/auth/login", data={"username": "admin@test.com", "password": "password123"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    cat_resp = await client.post("/categories/", json={"category_name": "Science"}, headers=headers)
    cat_id = cat_resp.json()["id"]

    resp = await client.post("/research/", data={
        "title_th": "วิทยาศาสตร์",
        "title_en": "Science Project",
        "category_id": cat_id,
        "keywords": "science, physics"
    }, headers=headers)
    
    research_id = resp.json()["id"]

    # Approve it to show up in search
    rev_resp = await client.post(f"/research/{research_id}/review", json={
        "comment_text": "Looks good",
        "status_result": "approved"
    }, headers=headers)
    assert rev_resp.status_code == 200

    # Test Search
    search_resp = await client.get("/research/search?q=Science")
    assert search_resp.status_code == 200
    results = search_resp.json()
    assert len(results) > 0
    assert results[0]["title_en"] == "Science Project"
