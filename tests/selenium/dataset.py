"""Isolated test data sourced from the CSVs and migration, without importing the app.

Only public identity fields are read from CSV. Passwords in those files are never
used: the private test database gets the documented test-only password instead.
The numeric IDs below belong exclusively to the disposable fixture database.
"""

import ast
import csv
from functools import lru_cache
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SCRIPTS = REPO / "backend" / "app" / "scripts"
DEFAULT_TEST_PASSWORD = "UniResearchTest2026!"
IDENTITY_FIELDS = (
    "email",
    "role",
    "student_id",
    "department",
    "first_name",
    "last_name",
    "is_active",
)
ACCOUNT_EMAILS = {
    "A1": "admin@uniresearch.ac.th",
    "S1": "674259009@webmail.npru.ac.th",
    "S2": "674259003@webmail.npru.ac.th",
    "S3": "644259003@webmail.npru.ac.th",
    "D1": "udsanee@webmail.npru.ac.th",
    "D2": "wuttha@webmail.npru.ac.th",
    "G1": "g1@example.org",
    "U2": "674259013@webmail.npru.ac.th",
}
EXTRA_EMAILS = {
    "registration": "674259006@webmail.npru.ac.th",
    "registration_admin": "674259024@webmail.npru.ac.th",
    "registration_api": "674259010@webmail.npru.ac.th",
    "new_user": "674259002@webmail.npru.ac.th",
    "new_advisor": "tko@webmail.npru.ac.th",
    "denied_user": "674259011@webmail.npru.ac.th",
}


@lru_cache(maxsize=1)
def csv_identities():
    identities = {}
    for filename in ("student.csv", "advisors.csv"):
        with (SCRIPTS / filename).open(encoding="utf-8-sig", newline="") as handle:
            for raw in csv.DictReader(handle):
                row = {key: raw[key].strip() for key in IDENTITY_FIELDS}
                if row["email"] in identities:
                    raise ValueError(f"Duplicate CSV identity: {row['email']}")
                row["student_id"] = row["student_id"] or None
                row["is_active"] = row["is_active"].lower() == "true"
                identities[row["email"]] = row
    return identities


def identity(email):
    return dict(csv_identities()[email])


def fixture_accounts():
    result = []
    for uid, key in enumerate(ACCOUNT_EMAILS, 1):
        email = ACCOUNT_EMAILS[key]
        if key in {"A1", "G1"}:
            row = dict(
                email=email,
                role="admin" if key == "A1" else "guest",
                student_id=None,
                department=None,
                first_name="ผู้ดูแลระบบทดสอบ" if key == "A1" else "ผู้เยี่ยมชมทดสอบ",
                last_name="",
                is_active=True,
            )
        else:
            row = identity(email)
        if key == "U2":
            row["is_active"] = False  # Only this disposable copy, never the CSV.
        result.append(dict(row, id=uid, key=key))
    return result


def _assignment(tree, name):
    matches = [
        node.value
        for node in ast.walk(tree)
        if isinstance(node, ast.Assign)
        and any(
            isinstance(target, ast.Name) and target.id == name
            for target in node.targets
        )
    ]
    if len(matches) != 1:
        raise ValueError(f"Expected one {name} assignment in migrate.py")
    return matches[0]


@lru_cache(maxsize=1)
def migration_data():
    # Reading AST constants never invokes migration/main or accesses a database.
    tree = ast.parse((SCRIPTS / "migrate.py").read_text(encoding="utf-8"))
    categories = ast.literal_eval(_assignment(tree, "categories"))
    works = []
    for node in _assignment(tree, "research_papers").elts:
        fields = {key.value: value for key, value in zip(node.keys, node.values)}
        record = {
            key: ast.literal_eval(value)
            for key, value in fields.items()
            if key != "category_id"
        }
        record["category_id"] = ast.literal_eval(fields["category_id"].slice) + 1
        works.append(record)
    if len(works) != 4:
        raise ValueError(
            "Update the documented dataset if migration's four works change"
        )
    return categories, works


CATEGORIES, SOURCE_WORKS = migration_data()
WORK_TITLES = {index + 1: work["title_th"] for index, work in enumerate(SOURCE_WORKS)}
WORK_TITLES[5] = WORK_TITLES[1] + " (สำเนาทดสอบไม่มีไฟล์เอกสาร)"
SUBMISSION_TITLE = WORK_TITLES[1] + " (สำเนาทดสอบส่งผลงาน)"
EDITED_TITLE = WORK_TITLES[1] + " (ฉบับปรับปรุงสำหรับทดสอบ)"
REVISED_TITLE = WORK_TITLES[2] + " (ฉบับแก้ไขสำหรับทดสอบ)"
DELETE_TITLE = WORK_TITLES[3] + " (สำเนาสำหรับทดสอบการลบ)"
E2E_TITLE = WORK_TITLES[4] + " (สำเนาทดสอบส่งและตรวจประเมิน)"


def submission_fields(title=SUBMISSION_TITLE):
    work = next(
        (work for work in SOURCE_WORKS if title.startswith(work["title_th"])),
        SOURCE_WORKS[0],
    )
    return {
        key: work[key]
        for key in (
            "title_en",
            "abstract",
            "category_id",
            "department",
            "work_type",
            "academic_year",
            "keywords",
        )
    } | {"title_th": title, "author_ids": "[2]", "advisor_ids": "[5]"}


def fixture_works():
    markers = (
        "publickeyword,research",
        "pendingsecret",
        "otherpending",
        "publickeyword,selenium",
        "research",
    )
    states = ("approved", "pending", "pending", "approved", "approved")
    owners = (2, 2, 3, 3, 3)
    views = (20, 0, 0, 40, 10)
    published = (
        "2026-10-01 00:00:00",
        None,
        None,
        "2026-10-02 00:00:00",
        "2026-09-30 00:00:00",
    )
    result = []
    for index in range(5):
        source = SOURCE_WORKS[index if index < 4 else 0]
        row = {
            key: source[key]
            for key in (
                "title_en",
                "abstract",
                "category_id",
                "department",
                "work_type",
                "academic_year",
                "keywords",
            )
        }
        row.update(
            id=index + 1,
            title_th=WORK_TITLES[index + 1],
            keywords=row["keywords"] + "," + markers[index],
            status=states[index],
            submitted_by_id=owners[index],
            view_count=views[index],
            published_at=published[index],
            advisor_id=6 if index == 2 else 5,
        )
        result.append(row)
    return result
