import google.generativeai as genai
from app.core.ai_config import ai_settings
from fastapi import HTTPException
from app.services.ai_service import ai_service
import json

class RAGChatbotService:
    async def chat_with_context(self, message: str, chat_history: list, relevant_works: list) -> str:
        ai_service._ensure_available()
        
        # Build context from relevant works
        context_str = ""
        if relevant_works:
            context_str = "Here is the relevant academic research papers context from our database:\n"
            for idx, w in enumerate(relevant_works[:5]):
                context_str += f"""
---
[RESEARCH #{idx + 1}]
ID: {w.id}
Title (TH): {w.title_th}
Title (EN): {w.title_en}
Category: {w.category.category_name if w.category else "Other"}
Department: {w.department or "N/A"}
Academic Year: {w.academic_year or "N/A"}
Keywords: {w.keywords or "N/A"}
Abstract: {w.abstract or "No abstract provided."}
---
"""
        else:
            context_str = "No specific relevant research works were found matching the query in our database."

        # Format chat history
        history_str = ""
        for turn in chat_history[-6:]:  # Keep last 3 turns
            role = "User" if turn.get("role") == "user" else "Assistant"
            content = turn.get("content", "")
            history_str += f"{role}: {content}\n"

        prompt = f"""You are "UniResearch AI Chatbot", a smart academic assistant helper for the university's research repository.
You answer user inquiries accurately and professionally based on the research papers stored in the system.

{context_str}

Conversation history:
{history_str}
User message: {message}

Instructions:
1. Always respond in Thai (ภาษาไทย).
2. If there are relevant research papers provided above, reference them by title (either TH or EN) and explain how they relate to the user's question. Use bullet points if listing multiple papers.
3. If the user's question cannot be answered by the context, answer generally and helpfully while stating that no direct research work on this exact topic was found.
4. Keep the tone helpful, modern, encouraging, and academic.
5. Do not output markdown code blocks wrapping the entire response. Return just the response text.
"""
        try:
            response = await ai_service._model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=ai_settings.AI_MAX_TOKENS,
                )
            )
            return response.text.strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate AI response: {str(e)}")

rag_chatbot_service = RAGChatbotService()
