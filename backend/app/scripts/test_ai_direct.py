import asyncio
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from dotenv import load_dotenv
load_dotenv()

from app.services.ai_service import ai_service

async def main():
    print(f"API Key: {os.getenv('GEMINI_API_KEY')[:10]}...")
    print(f"Model: {os.getenv('AI_MODEL')}")
    try:
        res = await ai_service.generate_abstract(
            title_th="ระบบบริหารจัดการงานวิจัย",
            title_en="Research Management System",
            keywords="Management, Research, University",
            language="th"
        )
        print("Success!")
        print(res)
    except Exception as e:
        print("Failed!")
        print(e)

if __name__ == "__main__":
    asyncio.run(main())
