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
    forbidden=await client.post("/research/",headers={"Authorization":f"Bearer {token}"},data={"title_th":"x","title_en":"x","category_id":"1"});assert forbidden.status_code==404


@pytest.mark.asyncio
async def test_get_my_research(client: AsyncClient, db_session, test_user, advisor_user):
    token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    from app.models.category import Category
    category = Category(category_name="My Category")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)
    data = {
        "title_th": "งานวิจัยของฉัน",
        "title_en": "My Own Research",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    }
    resp = await client.post("/research/", data=data, headers=headers)
    assert resp.status_code == 200
    my_resp = await client.get("/research/my", headers=headers)
    assert my_resp.status_code == 200
    my_list = my_resp.json()
    assert len(my_list) == 1
    assert my_list[0]["title_en"] == "My Own Research"

@pytest.mark.asyncio
async def test_get_pending_research(client: AsyncClient, db_session, test_user, advisor_user):
    token = (await client.post("/auth/login", data={"username": "advisor@test.com", "password": "password123"})).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    from app.models.category import Category
    category = Category(category_name="Pending Category")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)
    
    # Create research (using a student token)
    student_token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    data = {
        "title_th": "งานวิจัยรอตรวจ",
        "title_en": "Pending Research",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    }
    resp = await client.post("/research/", data=data, headers={"Authorization": f"Bearer {student_token}"})
    assert resp.status_code == 200
    
    # Fetch pending queue
    pending_resp = await client.get("/research/pending", headers=headers)
    assert pending_resp.status_code == 200
    pending_list = pending_resp.json()
    assert len(pending_list) >= 1
    assert any(item["title_en"] == "Pending Research" for item in pending_list)

@pytest.mark.asyncio
async def test_update_and_delete_research(client: AsyncClient, db_session, test_user, advisor_user):
    # Log in student
    student_token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # Create category
    from app.models.category import Category
    category = Category(category_name="Crud Category")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)

    # Create research
    data = {
        "title_th": "ชื่อเดิม",
        "title_en": "Old Title",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    }
    create_resp = await client.post("/research/", data=data, headers=student_headers)
    assert create_resp.status_code == 200
    res_id = create_resp.json()["id"]

    # Update research
    update_data = {
        "title_th": "ชื่อใหม่",
        "title_en": "New Title",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    }
    update_resp = await client.put(f"/research/{res_id}", data=update_data, headers=student_headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["title_en"] == "New Title"

    # Delete research
    delete_resp = await client.delete(f"/research/{res_id}", headers=student_headers)
    assert delete_resp.status_code == 200

    # Ensure it's deleted
    get_resp = await client.get(f"/research/{res_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_registration_overrides_role_to_student(client: AsyncClient):
    response = await client.post("/auth/register", json={
        "email": "malicious_admin@test.com",
        "password": "password123",
        "role": "admin",
        "first_name": "Malicious",
        "last_name": "Admin"
    })
    assert response.status_code == 200
    assert response.json()["role"] == "student"


@pytest.mark.asyncio
async def test_advisor_review_authorization_and_validation(client: AsyncClient, db_session, test_user, advisor_user):
    # Register another advisor
    from app.models.user import User
    from app.core.security import get_password_hash
    other_advisor = User(
        email="advisor2@test.com",
        hashed_password=get_password_hash("password123"),
        role="advisor",
        is_active=True
    )
    db_session.add(other_advisor)
    await db_session.commit()
    await db_session.refresh(other_advisor)

    # Login student to submit research
    student_token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    from app.models.category import Category
    category = Category(category_name="Security")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)

    # Submit research with advisor_user as advisor
    res_resp = await client.post("/research/", headers=student_headers, data={
        "title_th": "ความปลอดภัยข้อมูล",
        "title_en": "Data Security",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    })
    research_id = res_resp.json()["id"]

    # Login other advisor
    other_adv_token = (await client.post("/auth/login", data={"username": "advisor2@test.com", "password": "password123"})).json()["access_token"]
    other_adv_headers = {"Authorization": f"Bearer {other_adv_token}"}

    # Other advisor tries to review - must be 403
    bad_rev = await client.post(f"/research/{research_id}/review", json={
        "comment_text": "Bypassed review",
        "status_result": "approved"
    }, headers=other_adv_headers)
    assert bad_rev.status_code == 403

    # Main advisor tries to review - must succeed
    adv_token = (await client.post("/auth/login", data={"username": "advisor@test.com", "password": "password123"})).json()["access_token"]
    adv_headers = {"Authorization": f"Bearer {adv_token}"}

    # Reviewing status non-pending later, but first review works
    good_rev = await client.post(f"/research/{research_id}/review", json={
        "comment_text": "Approved work",
        "status_result": "approved"
    }, headers=adv_headers)
    assert good_rev.status_code == 200
    assert good_rev.json()["status_result"] == "approved"

    # Try to review again now that status is approved (non-pending) - must be 400
    dup_rev = await client.post(f"/research/{research_id}/review", json={
        "comment_text": "Review again",
        "status_result": "approved"
    }, headers=adv_headers)
    assert dup_rev.status_code == 400


@pytest.mark.asyncio
async def test_review_updates_published_at(client: AsyncClient, db_session, test_user, advisor_user):
    student_token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    from app.models.category import Category
    category = Category(category_name="Workflow")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)

    res_resp = await client.post("/research/", headers=student_headers, data={
        "title_th": "กระบวนการทำงาน",
        "title_en": "Workflow",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    })
    research_id = res_resp.json()["id"]

    adv_token = (await client.post("/auth/login", data={"username": "advisor@test.com", "password": "password123"})).json()["access_token"]
    adv_headers = {"Authorization": f"Bearer {adv_token}"}

    # Review and approve
    rev_resp = await client.post(f"/research/{research_id}/review", json={
        "comment_text": "Approved",
        "status_result": "approved"
    }, headers=adv_headers)
    assert rev_resp.status_code == 200

    # Verify published_at is set
    research = (await db_session.execute(select(ResearchWork).where(ResearchWork.id == research_id))).scalars().first()
    assert research.published_at is not None


@pytest.mark.asyncio
async def test_revision_archives_file_revision(client: AsyncClient, db_session, test_user, advisor_user, isolated_uploads):
    student_token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    from app.models.category import Category
    category = Category(category_name="Revision")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)

    # Create research with initial document
    res_resp = await client.post("/research/", headers=student_headers, data={
        "title_th": "ระบบเวอร์ชันเอกสาร",
        "title_en": "Document Revision",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    }, files={"document": ("v1.pdf", b"%PDF-1.4 Initial Version", "application/pdf")})
    research_id = res_resp.json()["id"]
    initial_file_path = res_resp.json()["file_path"]

    # Mark as needs_revision by advisor
    adv_token = (await client.post("/auth/login", data={"username": "advisor@test.com", "password": "password123"})).json()["access_token"]
    adv_headers = {"Authorization": f"Bearer {adv_token}"}
    await client.post(f"/research/{research_id}/review", json={
        "comment_text": "Please fix formatting",
        "status_result": "needs_revision"
    }, headers=adv_headers)

    # Submit updated research document (v2)
    update_resp = await client.put(f"/research/{research_id}", headers=student_headers, data={
        "title_th": "ระบบเวอร์ชันเอกสาร",
        "title_en": "Document Revision",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    }, files={"document": ("v2.pdf", b"%PDF-1.4 Revised Version", "application/pdf")})
    assert update_resp.status_code == 200

    # Ensure the old file was NOT deleted and is stored in FileRevision
    from app.models.research import FileRevision
    revisions_result = await db_session.execute(select(FileRevision).where(FileRevision.research_id == research_id))
    revisions = revisions_result.scalars().all()
    assert len(revisions) == 1
    assert revisions[0].file_path == initial_file_path
    assert revisions[0].version_no == 1

    # Verify both physical files exist in isolated uploads
    initial_full_path = isolated_uploads / Path(initial_file_path).relative_to("static")
    new_full_path = isolated_uploads / Path(update_resp.json()["file_path"]).relative_to("static")
    assert initial_full_path.exists()
    assert new_full_path.exists()


@pytest.mark.asyncio
async def test_advisor_pending_queue_filtered(client: AsyncClient, db_session, test_user, advisor_user, admin_user):
    # Register advisor 2
    from app.models.user import User
    from app.core.security import get_password_hash
    advisor2 = User(
        email="advisor_other@test.com",
        hashed_password=get_password_hash("password123"),
        role="advisor",
        is_active=True
    )
    db_session.add(advisor2)
    await db_session.commit()
    await db_session.refresh(advisor2)

    student_token = (await client.post("/auth/login", data={"username": "student@test.com", "password": "password123"})).json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    from app.models.category import Category
    category = Category(category_name="Queue")
    db_session.add(category)
    await db_session.commit()
    await db_session.refresh(category)

    # Work 1 for Advisor 1 (advisor_user)
    await client.post("/research/", headers=student_headers, data={
        "title_th": "งานของที่ปรึกษาคนแรก",
        "title_en": "Work For First Advisor",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor_user.id])
    })

    # Work 2 for Advisor 2 (advisor2)
    await client.post("/research/", headers=student_headers, data={
        "title_th": "งานของที่ปรึกษาคนที่สอง",
        "title_en": "Work For Second Advisor",
        "category_id": category.id,
        "author_ids": json.dumps([test_user.id]),
        "advisor_ids": json.dumps([advisor2.id])
    })

    # Login Advisor 1
    adv1_token = (await client.post("/auth/login", data={"username": "advisor@test.com", "password": "password123"})).json()["access_token"]
    adv1_headers = {"Authorization": f"Bearer {adv1_token}"}

    # Get pending queue for Advisor 1
    pending_adv1 = await client.get("/research/pending", headers=adv1_headers)
    assert pending_adv1.status_code == 200
    adv1_list = pending_adv1.json()
    assert len(adv1_list) == 1
    assert adv1_list[0]["title_en"] == "Work For First Advisor"

    # Login Admin
    admin_token = (await client.post("/auth/login", data={"username": "admin@test.com", "password": "password123"})).json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin should see both in pending
    pending_admin = await client.get("/research/pending", headers=admin_headers)
    assert pending_admin.status_code == 200
    admin_list = pending_admin.json()
    assert len(admin_list) >= 2


