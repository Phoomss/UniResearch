from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.database import engine, Base
from app.models.user import User
from app.models.category import Category
from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, FileRevision, ReviewComment
from app.models.interactions import Favorite, DownloadViewLog, SearchLog
from app.routers import auth, research, stats, category, interactions, home

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(research.router)
app.include_router(interactions.router)
app.include_router(stats.router)
app.include_router(home.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to UniResearch API"}
