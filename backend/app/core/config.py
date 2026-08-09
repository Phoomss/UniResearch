from pydantic_settings import BaseSettings
from pydantic import SecretStr, field_validator
from typing import Optional
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniResearch"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/uniresearch"
    SECRET_KEY: str = "supersecretkey"  # change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    APP_ENV: Optional[str] = None
    DEV_ADMIN_EMAIL: Optional[str] = None
    DEV_ADMIN_PASSWORD: Optional[SecretStr] = None
    STATIC_DIR: Path = BACKEND_DIR / "static"
    MAX_COVER_IMAGE_BYTES: int = 5 * 1024 * 1024
    MAX_DOCUMENT_BYTES: int = 25 * 1024 * 1024
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+asyncpg://", 1)
            elif v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    class Config:
        env_file = ".env"

settings = Settings()