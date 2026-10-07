"""Provider boundary; mocks are injected by tests, never silently used in production."""

import json
from dataclasses import dataclass
from typing import Protocol

import google.generativeai as genai
from app.core.ai_config import ai_settings
from app.core.research_flow_config import flow_settings


class ProviderError(RuntimeError):
    pass


@dataclass
class LLMResult:
    data: dict
    model: str
    input_tokens: int = 0
    output_tokens: int = 0


class LLMProvider(Protocol):
    async def generate(
        self, agent: str, system: str, context: dict, schema: dict
    ) -> LLMResult: ...


class GeminiProvider:
    async def generate(self, agent, system, context, schema):
        if not ai_settings.AI_ENABLED or not ai_settings.GEMINI_API_KEY:
            raise ProviderError("provider_unavailable")
        genai.configure(api_key=ai_settings.GEMINI_API_KEY)
        model_name = flow_settings.agent_models.get(agent, ai_settings.AI_MODEL)
        model = genai.GenerativeModel(model_name, system_instruction=system)
        try:
            response = await model.generate_content_async(
                json.dumps(
                    {"untrusted_data": context, "output_json_schema": schema},
                    ensure_ascii=False,
                ),
                generation_config={
                    "temperature": 0.0,
                    "max_output_tokens": flow_settings.output_tokens,
                    "response_mime_type": "application/json",
                },
            )
            usage = getattr(response, "usage_metadata", None)
            return LLMResult(
                json.loads(response.text),
                model_name,
                getattr(usage, "prompt_token_count", 0) or 0,
                getattr(usage, "candidates_token_count", 0) or 0,
            )
        except Exception as exc:
            raise ProviderError("provider_failure") from exc


class MockProvider:
    def __init__(self, responses):
        self.responses = responses
        self.calls = []

    async def generate(self, agent, system, context, schema):
        self.calls.append(agent)
        result = (
            self.responses(agent, context)
            if callable(self.responses)
            else self.responses[agent]
        )
        if isinstance(result, Exception):
            raise result
        return LLMResult(result, "mock", 10, 10)


def get_provider() -> LLMProvider:
    if flow_settings.provider != "gemini":
        raise ProviderError("unknown_provider")
    return GeminiProvider()
