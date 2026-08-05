import pytest
from httpx import AsyncClient
import json
from pathlib import Path
from sqlalchemy import select

from app.core.config import settings
from app.models.research import ResearchAdvisor, ResearchAuthor, ResearchWork
from app.services import research_service

@pytest.fixture
def isolated_uploads(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    static_dir = tmp_path / "static"
    covers = static_dir / "uploads" / "covers"
    docs = static_dir / "uploads" / "docs"
    monkeypatch.setattr(settings, "STATIC_DIR", static_dir)
    monkeypatch.setattr(research_service, "UPLOAD_COVERS_DIR", covers)
    monkeypatch.setattr(research_service, "UPLOAD_DOCS_DIR", docs)
    return static_dir

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

@pytest.mark.asyncio
async def test_full_research_creation_persists_relationships_and_files(client: AsyncClient, db_session, test_user, advisor_user, isolated_uploads):
    from app.models.category import Category
    category = Category(category_name="Integration")
    db_session.add(category); await db_session.commit(); await db_session.refresh(category)
    token = (await client.post("/auth/login", data={"username":"student@test.com","password":"password123"})).json()["access_token"]
    response = await client.post("/research/", headers={"Authorization":f"Bearer {token}"}, data={
        "title_th":"งานวิจัยบูรณาการ", "title_en":"Full Integration", "category_id":str(category.id),
        "abstract":"Verified through the real service and disposable database.", "keywords":"integration,upload",
        "author_ids":json.dumps([test_user.id]), "advisor_ids":json.dumps([advisor_user.id])},
        files={"cover_image":("cover.png",b"\x89PNG\r\n\x1a\nvalid-image","image/png"),
               "document":("paper.pdf",b"%PDF-1.7\nverified","application/pdf")})
    assert response.status_code == 200, response.text
    body=response.json(); assert body["status"] == "pending"
    research = await db_session.get(ResearchWork, body["id"])
    assert research and research.title_en == "Full Integration"
    assert (await db_session.execute(select(ResearchAuthor).where(ResearchAuthor.research_id==research.id))).scalar_one().user_id == test_user.id
    assert (await db_session.execute(select(ResearchAdvisor).where(ResearchAdvisor.research_id==research.id))).scalar_one().user_id == advisor_user.id
    assert (isolated_uploads / Path(research.cover_image_path).relative_to("static")).read_bytes().startswith(b"\x89PNG")
    assert (isolated_uploads / Path(research.file_path).relative_to("static")).read_bytes().startswith(b"%PDF-")
    detail=await client.get(f"/research/{research.id}"); assert detail.status_code==200 and detail.json()["id"]==research.id

@pytest.mark.asyncio
async def test_participants_are_role_filtered(client: AsyncClient, test_user, advisor_user):
    token=(await client.post("/auth/login",data={"username":"student@test.com","password":"password123"})).json()["access_token"]
    response=await client.get("/research/participants",headers={"Authorization":f"Bearer {token}"})
    assert response.status_code==200
    assert [item["id"] for item in response.json()["authors"]]==[test_user.id]
    assert [item["id"] for item in response.json()["advisors"]]==[advisor_user.id]
    assert response.json()["authors"][0]["is_current"] is True

@pytest.mark.asyncio
async def test_creation_rejects_bad_people_json_and_related_ids(client: AsyncClient, db_session, test_user):
    from app.models.category import Category
    category=Category(category_name="Validation");db_session.add(category);await db_session.commit();await db_session.refresh(category)
    token=(await client.post("/auth/login",data={"username":"student@test.com","password":"password123"})).json()["access_token"]
    headers={"Authorization":f"Bearer {token}"};base={"title_th":"ทดสอบ","title_en":"Validation","category_id":str(category.id)}
    bad_json=await client.post("/research/",headers=headers,data={**base,"author_ids":"not-json"});assert bad_json.status_code==422
    missing=await client.post("/research/",headers=headers,data={**base,"author_ids":"[999999]"});assert missing.status_code==404

@pytest.mark.asyncio
async def test_creation_rejects_invalid_files_and_cleans_partial_upload(client: AsyncClient, db_session, test_user, isolated_uploads):
    from app.models.category import Category
    category=Category(category_name="Files");db_session.add(category);await db_session.commit();await db_session.refresh(category)
    token=(await client.post("/auth/login",data={"username":"student@test.com","password":"password123"})).json()["access_token"]
    response=await client.post("/research/",headers={"Authorization":f"Bearer {token}"},data={"title_th":"ไฟล์","title_en":"Files","category_id":str(category.id)},files={"cover_image":("cover.png",b"\x89PNG\r\n\x1a\nvalid","image/png"),"document":("fake.pdf",b"not a pdf","application/pdf")})
    assert response.status_code==415
    assert not list(isolated_uploads.rglob("*.png"))
    assert (await db_session.execute(select(ResearchWork).where(ResearchWork.title_en=="Files"))).scalar_one_or_none() is None

@pytest.mark.asyncio
async def test_creation_requires_auth_and_submitter_role(client: AsyncClient, advisor_user):
    unauthenticated=await client.post("/research/",data={"title_th":"x","title_en":"x","category_id":"1"});assert unauthenticated.status_code==401
    token=(await client.post("/auth/login",data={"username":"advisor@test.com","password":"password123"})).json()["access_token"]
    forbidden=await client.post("/research/",headers={"Authorization":f"Bearer {token}"},data={"title_th":"x","title_en":"x","category_id":"1"});assert forbidden.status_code==403
