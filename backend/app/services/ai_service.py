import google.generativeai as genai
from app.core.ai_config import ai_settings
from fastapi import HTTPException
import json
import re

class AIService:
    def __init__(self):
        if not ai_settings.GEMINI_API_KEY:
            self._model = None
            return
        genai.configure(api_key=ai_settings.GEMINI_API_KEY)
        self._model = genai.GenerativeModel(ai_settings.AI_MODEL)
    
    def _ensure_available(self):
        if not ai_settings.AI_ENABLED or not self._model:
            raise HTTPException(status_code=503, detail="ระบบ AI ยังไม่พร้อมใช้งาน กรุณาตั้งค่า GEMINI_API_KEY")
            
    def _parse_json(self, text: str):
        # Extract JSON from markdown blocks if any
        match = re.search(r'```(?:json)?(.*?)```', text, re.DOTALL)
        if match:
            text = match.group(1).strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI response is not in correct JSON format")
    
    async def generate_abstract(self, title_th, title_en, keywords=None, language="th"):
        self._ensure_available()
        lang_str = "Thai" if language == "th" else "English"
        prompt = f"""You are an expert academic writer. Generate a professional academic abstract in {lang_str}.
Title (TH): {title_th}
Title (EN): {title_en}
Keywords: {keywords if keywords else 'None'}

The abstract should be concise, clear, and follow standard academic structure (background, objectives, methods, results, conclusion). Do not include any other conversational text. Return only the abstract text."""
        
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return response.text.strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate abstract: {str(e)}")
    
    async def suggest_titles(self, abstract=None, keywords=None, category=None, language="th"):
        self._ensure_available()
        lang_str = "Thai" if language == "th" else "English"
        prompt = f"""You are an expert academic advisor. Suggest 3-5 academic research titles in {lang_str} based on the following context:
Abstract: {abstract if abstract else 'None'}
Keywords: {keywords if keywords else 'None'}
Category: {category if category else 'None'}

You must respond ONLY with a valid JSON array of strings, where each string is a suggested title. Example: ["Title 1", "Title 2"]"""
        
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            data = self._parse_json(response.text)
            if not isinstance(data, list):
                data = [str(x) for x in data] if isinstance(data, dict) else [str(data)]
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to suggest titles: {str(e)}")
    
    async def suggest_keywords(self, title_th=None, title_en=None, abstract=None):
        self._ensure_available()
        prompt = f"""You are an expert academic indexer. Suggest 5-10 relevant academic keywords based on the following context:
Title (TH): {title_th if title_th else 'None'}
Title (EN): {title_en if title_en else 'None'}
Abstract: {abstract if abstract else 'None'}

Provide keywords in both Thai and English if appropriate.
You must respond ONLY with a valid JSON array of strings, where each string is a keyword. Example: ["Keyword 1", "Keyword 2"]"""
        
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            data = self._parse_json(response.text)
            if not isinstance(data, list):
                data = [str(x) for x in data] if isinstance(data, dict) else [str(data)]
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to suggest keywords: {str(e)}")
    
    async def check_writing(self, text, language="th"):
        self._ensure_available()
        lang_str = "Thai" if language == "th" else "English"
        prompt = f"""You are an expert academic editor. Review the following {lang_str} text for grammar, academic writing style, and clarity.
Text to check:
{text}

Identify issues and provide an improved version of the entire text. Calculate a quality score (0-100).
You must respond ONLY with a valid JSON object matching this schema:
{{
  "issues": [
    {{
      "original": "original text fragment",
      "suggestion": "suggested replacement",
      "reason": "explanation of why it should be changed"
    }}
  ],
  "improved_text": "The fully improved version of the text",
  "score": 85
}}"""
        
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            data = self._parse_json(response.text)
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to check writing: {str(e)}")

ai_service = AIService()
