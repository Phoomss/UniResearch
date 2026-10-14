"""Test-only entry point. Never imported by the production application."""

import os
from pathlib import Path
from unittest.mock import AsyncMock

root = Path(os.environ["UNIRESEARCH_TEST_ROOT"]).resolve()
assert root.name.startswith("uniresearch-selenium-")
os.environ.update(
    DATABASE_URL=f"sqlite+aiosqlite:///{root / 'test.db'}",
    STATIC_DIR=str(root / "static"),
    APP_ENV="test",
    DB_SSL="false",
    GEMINI_API_KEY="",
    DEV_ADMIN_EMAIL="",
    DEV_ADMIN_PASSWORD="",
    MAX_COVER_IMAGE_BYTES=str(5 * 1024 * 1024),
    MAX_DOCUMENT_BYTES=str(25 * 1024 * 1024),
)

from app.db.database import engine
from app.main import app  # noqa: F401
from app.services.ai_service import ai_service
from app.services.rag_service import rag_chatbot_service

engine.echo = False
AI_RESULTS = {
    "generate_abstract": "Deterministic test abstract",
    "suggest_titles": ["Deterministic research title"],
    "suggest_keywords": ["selenium", "research"],
    "check_writing": {"issues": [], "improved_text": "Test writing", "score": 90},
    "generate_dashboard_insights": {"summary": "Deterministic dashboard insight"},
    "pre_review_analysis": {
        "overall_score": 80,
        "summary": "Deterministic pre-review",
        "structure_score": 80,
        "methodology_score": 80,
        "language_score": 80,
        "strengths": ["Controlled fixture"],
        "weaknesses": [],
        "suggestions": [],
        "methodology_feedback": "Deterministic methodology",
        "overall_evaluation": "Deterministic pre-review",
    },
    "plagiarism_check": {
        "similarity_score": 0,
        "summary": "Deterministic similarity",
        "overall_similarity_score": 0,
        "matches": [],
        "verdict": "Deterministic similarity",
    },
    "reviewer_match": {
        "matches": [
            {
                "advisor_id": 5,
                "name": "Deterministic advisor",
                "score": 90,
                "reason": "Controlled match",
            }
        ],
        "summary": "Deterministic reviewer match",
    },
    "review_summary": {
        "executive_summary": "Deterministic review summary",
        "key_issues_raised": [],
        "improvement_sentiment": "Positive",
    },
}
for name, result in AI_RESULTS.items():
    setattr(ai_service, name, AsyncMock(return_value=result))
# Exercise the application's documented text-search fallback on SQLite.
ai_service.get_embedding = AsyncMock(
    side_effect=RuntimeError("test: no vector provider")
)
rag_chatbot_service.chat_with_context = AsyncMock(
    return_value="Deterministic chat response"
)
