from pydantic_settings import BaseSettings

class AISettings(BaseSettings):
    GEMINI_API_KEY: str = ""
    AI_MODEL: str = "gemini-2.0-flash"  # Default to fast model
    AI_MAX_TOKENS: int = 2048
    AI_TEMPERATURE: float = 0.7
    AI_ENABLED: bool = True  # Feature flag
    
    class Config:
        env_file = ".env"

ai_settings = AISettings()
