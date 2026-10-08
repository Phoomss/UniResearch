import os

class Config:
    BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
    STUDENT_EMAIL = os.getenv("STUDENT_EMAIL", "s1@webmail.ac.th")
    STUDENT_PASSWORD = os.getenv("STUDENT_PASSWORD", "password123")
    ADVISOR_EMAIL = os.getenv("ADVISOR_EMAIL", "a1@university.ac.th")
    ADVISOR_PASSWORD = os.getenv("ADVISOR_PASSWORD", "password123")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@university.ac.th")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "password123")
    HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
