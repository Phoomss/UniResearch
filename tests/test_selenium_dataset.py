"""Contract checks between the executable dataset, real sources and reviewed docs."""

import csv
import hashlib
import json
import re
from pathlib import Path

from tests.selenium.dataset import (
    ACCOUNT_EMAILS,
    CATEGORIES,
    EXTRA_EMAILS,
    IDENTITY_FIELDS,
    SCRIPTS,
    SOURCE_WORKS,
    WORK_TITLES,
    fixture_accounts,
    fixture_works,
    identity,
)

REPO = Path(__file__).resolve().parents[1]


def test_csv_identities_are_exact_and_do_not_import_credentials():
    originals = {}
    for filename in ("student.csv", "advisors.csv"):
        with (SCRIPTS / filename).open(encoding="utf-8-sig", newline="") as handle:
            for row in csv.DictReader(handle):
                originals[row["email"]] = row
    for email in set(ACCOUNT_EMAILS.values()) | set(EXTRA_EMAILS.values()):
        if email not in {ACCOUNT_EMAILS["A1"], ACCOUNT_EMAILS["G1"]}:
            actual = identity(email)
            assert set(actual) == set(IDENTITY_FIELDS)
            for field in ("email", "role", "first_name", "last_name", "department"):
                assert actual[field] == originals[email][field].strip()
            assert not any("password" in key for key in actual)
    assert [
        identity(ACCOUNT_EMAILS[key])["student_id"][:2] for key in ("S1", "S2", "S3")
    ] == ["67", "67", "64"]


def test_private_overrides_leave_source_data_unchanged():
    before = {
        p.name: hashlib.sha256(p.read_bytes()).digest() for p in SCRIPTS.glob("*.csv")
    }
    accounts = fixture_accounts()
    inactive = next(row for row in accounts if row["key"] == "U2")
    assert inactive["is_active"] is False
    assert identity(ACCOUNT_EMAILS["U2"])["is_active"] is True
    accounts[1]["first_name"] = "changed only in private fixture"
    assert fixture_accounts()[1]["first_name"] != accounts[1]["first_name"]
    assert before == {
        p.name: hashlib.sha256(p.read_bytes()).digest() for p in SCRIPTS.glob("*.csv")
    }


def test_migration_metadata_and_titles_match_documented_dataset():
    document = (REPO / "docs/system-audit/TEST-RESEARCH-DATA.md").read_text()
    for row in fixture_works():
        assert row["title_th"] in document
        source = SOURCE_WORKS[row["id"] - 1 if row["id"] < 5 else 0]
        for field in (
            "title_en",
            "abstract",
            "category_id",
            "department",
            "academic_year",
            "work_type",
        ):
            assert row[field] == source[field]
        assert CATEGORIES[row["category_id"] - 1]["category_name"] in document
    assert len(set(WORK_TITLES.values())) == 5


def test_all_48_executable_case_titles_match_reviewed_specification():
    document = (REPO / "docs/system-audit/TEST-CASES.md").read_text()
    headings = dict(re.findall(r"^#### (TC-\d{3}) — (.+)$", document, re.MULTILINE))
    catalog = json.loads((REPO / "tests/selenium/cases.json").read_text())
    assert {row["case"] for row in catalog} == {f"TC-{i:03}" for i in range(1, 49)}
    assert len(catalog) == 48
    assert len(headings) == 48
    for row in catalog:
        assert row["title"] == headings[row["case"]]
        block = document.split(f"#### {row['case']} — ", 1)[1].split("\n#### TC-", 1)[0]
        expected = block.split("**ผลที่คาดหวังและจุดตรวจ:**", 1)[1].split(
            "**จุดตรวจเสริม", 1
        )[0]
        assert row["expected_result"] == "; ".join(
            re.findall(r"^- (.+)", expected, re.MULTILINE)
        )
