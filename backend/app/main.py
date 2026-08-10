from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from app.core.config import settings
from app.db.database import engine, Base, AsyncSessionLocal
from app.models.user import User
from app.models.category import Category
from app.models.options import Department, WorkType
from app.models.research import ResearchWork, ResearchAuthor, ResearchAdvisor, FileRevision, ReviewComment
from app.models.interactions import Favorite, DownloadViewLog, SearchLog
from app.routers import auth, research, stats, category, interactions, home, options, users, ai
from sqlalchemy.future import select

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        depts_check = await db.execute(select(Department))
        if not depts_check.scalars().first():
            defaults_depts = ["วิทยาการคอมพิวเตอร์", "เทคโนโลยีสารสนเทศ", "วิศวกรรมคอมพิวเตอร์", "วิศวกรรมซอฟต์แวร์", "เทคโนโลยีมัลติมีเดีย", "การจัดการเทคโนโลยีสารสนเทศ"]
            for name in defaults_depts:
                db.add(Department(name=name))
            
        types_check = await db.execute(select(WorkType))
        if not types_check.scalars().first():
            defaults_types = ["โครงงานวิทยาศาสตร์", "วิทยานิพนธ์", "สารนิพนธ์", "งานวิจัยระดับปริญญาตรี", "งานวิจัยระดับบัณฑิตศึกษา", "บทความวิชาการ", "โครงงานพัฒนาซอฟต์แวร์"]
            for name in defaults_types:
                db.add(WorkType(name=name))
        await db.commit()
    yield

# Disable default docs_url to serve our custom styled Thai Swagger UI
app = FastAPI(title=settings.PROJECT_NAME, docs_url=None, lifespan=lifespan)

@app.get("/docs", include_in_schema=False)
async def redirect_db_docs():
    return RedirectResponse(url="/swagger")

@app.get("/swagger", include_in_schema=False)
async def custom_swagger_ui():
    html_content = f"""
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <title>UniResearch API - ระบบเอกสาร</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {{
                margin: 0;
                background: #fafafa;
            }}
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {{
                const ui = SwaggerUIBundle({{
                    url: "{app.openapi_url}",
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                     ],
                    layout: "BaseLayout",
                    persistAuthorization: true
                }});
                window.ui = ui;

                // Thai Translations Dictionary
                const thTranslations = {{
                    "Try it out": "ทดลองใช้งาน",
                    "Cancel": "ยกเลิก",
                    "Clear": "ล้างข้อมูล",
                    "Execute": "ส่งคำขอ (Execute)",
                    "Parameters": "พารามิเตอร์ (Parameters)",
                    "Responses": "ผลลัพธ์การตอบกลับ (Responses)",
                    "No parameters": "ไม่มีพารามิเตอร์",
                    "Authorize": "ยืนยันตัวตน (Authorize)",
                    "Close": "ปิด",
                    "Description": "คำอธิบาย",
                    "Code": "รหัสสถานะ (Code)",
                    "Name": "ชื่อพารามิเตอร์",
                    "Required": "จำเป็น",
                    "Type": "ประเภท",
                    "Value": "ค่าทดสอบ",
                    "Empty": "ว่างเปล่า",
                    "No content": "ไม่มีข้อมูลตอบกลับ",
                    "RequestBody": "ข้อมูลที่ส่งไป (Request Body)",
                    "Response body": "ข้อมูลที่ตอบกลับ (Response Body)",
                    "Headers": "เฮดเดอร์ (Headers)"
                }};

                // Translate Text Nodes dynamically
                function translateNode(node) {{
                    if (node.nodeType === Node.TEXT_NODE) {{
                        const trimmed = node.nodeValue.trim();
                        if (thTranslations[trimmed]) {{
                            node.nodeValue = thTranslations[trimmed];
                        }} else {{
                            // Partial match translations
                            for (const [eng, tha] of Object.entries(thTranslations)) {{
                                if (trimmed === eng) {{
                                    node.nodeValue = tha;
                                    break;
                                }}
                            }}
                        }}
                    }} else {{
                        // Translate elements like inputs or buttons
                        if (node.tagName === 'BUTTON' || node.tagName === 'INPUT') {{
                            if (thTranslations[node.innerText]) {{
                                node.innerText = thTranslations[node.innerText];
                            }}
                            if (node.placeholder && thTranslations[node.placeholder]) {{
                                node.placeholder = thTranslations[node.placeholder];
                            }}
                        }}
                        for (let child of node.childNodes) {{
                            translateNode(child);
                        }}
                    }}
                }}

                // MutationObserver to watch for UI changes and apply translations
                const observer = new MutationObserver((mutations) => {{
                    for (let mutation of mutations) {{
                        for (let node of mutation.addedNodes) {{
                            translateNode(node);
                        }}
                    }}
                }});

                // Start observing the swagger-ui container
                const target = document.getElementById('swagger-ui');
                observer.observe(target, {{ childList: true, subtree: true }});

                // Run initial translation pass once loaded
                setTimeout(() => {{
                    translateNode(target);
                }}, 1000);
            }};
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

settings.STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(options.router)
app.include_router(research.router)
app.include_router(interactions.router)
app.include_router(stats.router)
app.include_router(home.router)
app.include_router(users.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to UniResearch API"}
