from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class ResearchFlowSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_prefix="RESEARCH_FLOW_"
    )
    enabled: bool = True
    provider: str = "gemini"
    agent_models: dict[str, str] = Field(default_factory=dict)
    max_research_iterations: int = Field(3, ge=1, le=20)
    max_agent_retries: int = Field(2, ge=0, le=5)
    max_search_rounds: int = Field(3, ge=1, le=10)
    max_papers: int = Field(20, ge=1, le=100)
    paper_batch_size: int = Field(3, ge=1, le=10)
    max_workflow_duration: int = Field(900, ge=30, le=7200)
    agent_timeout: int = Field(90, ge=1, le=300)
    max_llm_calls: int = Field(40, ge=1, le=200)
    max_tokens: int = Field(100000, ge=1000)
    output_tokens: int = Field(4096, ge=256, le=16384)
    max_context_chars: int = Field(40000, ge=1000, le=200000)
    max_active_per_user: int = Field(2, ge=1, le=10)
    max_active_global: int = Field(20, ge=1, le=1000)
    creations_per_hour: int = Field(10, ge=1, le=100)
    depth_sources: dict[str, int] = Field(
        default_factory=lambda: {"QUICK": 5, "STANDARD": 10, "DEEP": 20}
    )
    poll_seconds: float = Field(2, ge=0.1, le=60)

    @field_validator("depth_sources")
    @classmethod
    def validate_depth_sources(cls, value):
        if set(value) != {"QUICK", "STANDARD", "DEEP"} or any(
            n < 1 or n > 100 for n in value.values()
        ):
            raise ValueError(
                "depth_sources requires QUICK, STANDARD and DEEP limits between 1 and 100"
            )
        return value


flow_settings = ResearchFlowSettings()
