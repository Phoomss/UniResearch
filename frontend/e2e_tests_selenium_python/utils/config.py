import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
    STUDENT_EMAIL = os.getenv("STUDENT_EMAIL", "thanapat.suw@student.npru.ac.th")
    STUDENT_PASSWORD = os.getenv("STUDENT_PASSWORD", "password123")
    STUDENT_NEW_PASSWORD = os.getenv("STUDENT_NEW_PASSWORD", "Thanapat#New2026")
    STUDENT_NAME = "นายธนภัทร สุวรรณโชติ"
    STUDENT_ID = "654259012"
    STUDENT_DEPT = "วิศวกรรมซอฟต์แวร์"
    STUDENT_NEW_DEPT = "วิทยาการคอมพิวเตอร์"
    STUDENT_NEW_NAME = "ธนภัทร สุวรรณโชติกุล"
    
    GUEST_EMAIL = os.getenv("GUEST_EMAIL", "pimchanok.rat@gmail.com")
    GUEST_PASSWORD = os.getenv("GUEST_PASSWORD", "password123")
    GUEST_NAME = "นางสาวพิมพ์ชนก รัตนากร"
    
    TESTER_NAME = "นายสมหมาย ศุภวงศ์"
    
    ADVISOR_EMAIL = os.getenv("ADVISOR_EMAIL", "a1@university.ac.th")
    ADVISOR_PASSWORD = os.getenv("ADVISOR_PASSWORD", "password123")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@university.ac.th")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "password123")
    HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
