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

    async def pre_review_analysis(self, title_th: str, title_en: str, abstract: str, keywords: str, category: str, department: str):
        self._ensure_available()
        prompt = f"""You are an expert peer reviewer for academic research papers. Analyze the following research paper details:
Title (TH): {title_th}
Title (EN): {title_en}
Abstract: {abstract}
Keywords: {keywords}
Category: {category}
Department: {department}

Provide a detailed peer-review analysis in Thai. Evaluate the paper's structure, methodology, academic tone, and potential areas of improvement.
You must respond ONLY with a valid JSON object matching this schema:
{{
  "structure_score": 85,
  "methodology_score": 80,
  "language_score": 90,
  "strengths": ["list of strengths"],
  "weaknesses": ["list of weaknesses/gaps"],
  "methodology_feedback": "detailed feedback on methodology",
  "suggestions": ["list of concrete recommendations for improvement"],
  "overall_evaluation": "brief overall summary"
}}"""
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return self._parse_json(response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to analyze research: {str(e)}")

    async def plagiarism_check(self, title_th: str, title_en: str, abstract: str, other_works: list):
        self._ensure_available()
        other_works_str = "\n".join([
            f"ID: {w['id']}\nTitle: {w['title_en']} ({w['title_th']})\nAbstract: {w['abstract'][:250]}..."
            for w in other_works[:12]
        ])
        
        prompt = f"""You are an expert academic integrity officer. Check if the following research work has any potential plagiarism or heavy similarity with other papers in the system:
---
Target Work:
Title (TH): {title_th}
Title (EN): {title_en}
Abstract: {abstract}
---
Other Works in System:
{other_works_str}

Evaluate the similarity. Give a similarity score (0 to 100) and pinpoint overlapping concepts or duplicate phrasing.
You must respond ONLY with a valid JSON object matching this schema:
{{
  "overall_similarity_score": 15,
  "matches": [
    {{
      "research_id": 1,
      "title": "Title of similar work",
      "similarity_score": 45,
      "reasons": ["concept overlap in ...", "similar methodology"]
    }}
  ],
  "verdict": "Clear, Safe, High Similarity, or Suspected Plagiarism"
}}"""
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return self._parse_json(response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to check plagiarism: {str(e)}")

    async def reviewer_match(self, title_th: str, title_en: str, abstract: str, keywords: str, category: str, advisors: list):
        self._ensure_available()
        advisors_str = "\n".join([
            f"ID: {adv['id']}\nName: {adv['name']}\nDepartment: {adv['department']}"
            for adv in advisors
        ])
        
        prompt = f"""You are an academic administrator. Suggest the best matching advisors for the following research paper:
Title (TH): {title_th}
Title (EN): {title_en}
Abstract: {abstract}
Keywords: {keywords}
Category: {category}

Available Advisors:
{advisors_str}

Rate each advisor's match score (0-100) and explain the reason (e.g. expertise/department fit).
You must respond ONLY with a valid JSON object matching this schema:
{{
  "matches": [
    {{
      "advisor_id": 1,
      "name": "Name of advisor",
      "score": 95,
      "reason": "Expert in department X and research alignment with category Y"
    }}
  ]
}}"""
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return self._parse_json(response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to match reviewer: {str(e)}")

    async def review_summary(self, reviews: list):
        self._ensure_available()
        reviews_str = "\n".join([
            f"- Status: {r['status_result']}\n  Comment: {r['comment_text']}"
            for r in reviews
        ])
        
        prompt = f"""You are an academic coordinator. Summarize the following historical review comments for a research paper:
{reviews_str}

Consolidate the comments, highlight key changes required, and summarize the general sentiment/progress. Return the response in Thai.
You must respond ONLY with a valid JSON object matching this schema:
{{
  "executive_summary": "Overall summary of the review process",
  "key_issues_raised": ["List of main issues raised across all rounds"],
  "improvement_sentiment": "Positive, Neutral, or Negative progress"
}}"""
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=ai_settings.AI_TEMPERATURE,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return self._parse_json(response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to summarize reviews: {str(e)}")

    async def generate_dashboard_insights(self, stats: dict, categories: list, research_list: list):
        self._ensure_available()
        
        # Summarize research list to feed into Gemini prompt without overloading tokens
        summary_research = []
        for rw in research_list[:25]: # limit to top 25 latest/relevant items
            summary_research.append({
                "title": rw.get("title_en") or rw.get("title_th"),
                "category": rw.get("category_name") or "Other",
                "academic_year": rw.get("academic_year"),
                "status": rw.get("status"),
                "views": rw.get("view_count", 0),
                "downloads": rw.get("download_count", 0),
                "keywords": rw.get("keywords") or ""
            })
            
        stats_str = json.dumps(stats, ensure_ascii=False)
        categories_str = json.dumps(categories, ensure_ascii=False)
        research_str = json.dumps(summary_research, ensure_ascii=False)
        
        prompt = f"""You are a senior academic research director and dashboard data analyst. Analyze the following university research database stats and list of latest submissions:
---
Overall Stats:
{stats_str}

Categories Available:
{categories_str}

Sample of Research Submissions (Top/Latest):
{research_str}
---

Perform a professional data analytics evaluation and return a JSON object in Thai containing:
1. "overview_analysis": A high-level professional narrative (2-3 sentences) explaining the current state of research submissions, student participation, and usage trends.
2. "trending_topics": A list of 3 key research domains or keywords that are trending or show strong momentum, with a brief explanation of why.
3. "strategic_recommendations": 3 specific actionable recommendations for the university admin to improve research output, enhance review efficiency, or boost collaboration.
4. "reviewer_workload_analysis": Analysis of the reviewer process, advising patterns, and status (e.g., pending vs approved ratios).

Ensure the entire output is structured ONLY as a valid JSON object matching this schema:
{{
  "overview_analysis": "บทวิเคราะห์ภาพรวม...",
  "trending_topics": [
    {{
      "topic": "ชื่อหัวข้อ/คีย์เวิร์ด",
      "momentum": "High/Medium/Low",
      "reason": "เหตุผลวิเคราะห์..."
    }}
  ],
  "reviewer_workload_analysis": "บทวิเคราะห์ผู้ตรวจ...",
  "strategic_recommendations": [
    "ข้อแนะนำที่ 1...",
    "ข้อแนะนำที่ 2...",
    "ข้อแนะนำที่ 3..."
  ]
}}"""
        try:
            response = await self._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.2, # low temperature for precise analytics
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return self._parse_json(response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate dashboard insights: {str(e)}")

ai_service = AIService()

