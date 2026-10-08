"""
Test Data Fixtures and Configuration for UniResearch Test Suite.
Follows the entities defined in docs/system-audit/TEST-CASES.md:
- A1: Admin
- S1, S2, S3: Students
- D1, D2: Advisors
- G1: Guest
- C1, C2: Categories
- W1 - W5: Research Works
"""

import time
import uuid

# Base seed accounts matching environment / seeded data
DEFAULT_ADMIN = {
    "email": "admin@example.com",
    "password": "AdminPassword123!",
    "role": "admin",
    "first_name": "Admin",
    "last_name": "UniResearch"
}

DEFAULT_STUDENT_1 = {
    "email": "s1_student@example.com",
    "password": "StudentPassword123!",
    "role": "student",
    "first_name": "Sommai",
    "last_name": "Kitikorn",
    "student_id": "64010001",
    "department": "วิทยาการคอมพิวเตอร์"
}

DEFAULT_STUDENT_2 = {
    "email": "s2_student@example.com",
    "password": "StudentPassword123!",
    "role": "student",
    "first_name": "Natthaporn",
    "last_name": "Jaidee",
    "student_id": "64010002",
    "department": "วิทยาการคอมพิวเตอร์"
}

DEFAULT_STUDENT_3 = {
    "email": "s3_student@example.com",
    "password": "StudentPassword123!",
    "role": "student",
    "first_name": "Narongsak",
    "last_name": "Phoom",
    "student_id": "64010003",
    "department": "วิทยาการคอมพิวเตอร์"
}

DEFAULT_ADVISOR_1 = {
    "email": "d1_advisor@example.com",
    "password": "AdvisorPassword123!",
    "role": "advisor",
    "first_name": "Dr. Prateep",
    "last_name": "Chaiyaphum",
    "department": "วิทยาการคอมพิวเตอร์"
}

DEFAULT_ADVISOR_2 = {
    "email": "d2_advisor@example.com",
    "password": "AdvisorPassword123!",
    "role": "advisor",
    "first_name": "Dr. Wanida",
    "last_name": "Panyarachun",
    "department": "เทคโนโลยีสารสนเทศ"
}

DEFAULT_GUEST = {
    "email": "g1_guest@example.com",
    "password": "GuestPassword123!",
    "role": "guest",
    "first_name": "Somchai",
    "last_name": "Khondue"
}

DEFAULT_CATEGORY_1 = {
    "category_name": "วิทยาการคอมพิวเตอร์",
    "description": "งานวิจัยและโครงงานด้านวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์"
}

DEFAULT_CATEGORY_2 = {
    "category_name": "วิศวกรรมปัญญาประดิษฐ์",
    "description": "นวัตกรรมและแบบจำลองปัญญาประดิษฐ์เพื่อการประยุกต์ใช้งาน"
}


def unique_email(prefix="test_user"):
    """Generate a unique email address using timestamp and short uuid."""
    return f"{prefix}_{int(time.time())}_{uuid.uuid4().hex[:6]}@example.com"


def unique_category_name(prefix="หมวดหมู่วิจัย"):
    """Generate a unique category name."""
    return f"{prefix}_{int(time.time())}_{uuid.uuid4().hex[:4]}"


def unique_research_title(prefix="งานวิจัย"):
    """Generate unique Thai & English research titles."""
    ts = int(time.time())
    uid = uuid.uuid4().hex[:4]
    return {
        "title_th": f"{prefix}ทดสอบระบบอัตโนมัติ {ts}_{uid}",
        "title_en": f"Automated E2E Research Study {ts}_{uid}"
    }
