"""Write current-session UI results; historical passes are never imported."""

import json
import os
import re
from pathlib import Path

STATUS = {
    "passed": "PASS",
    "failed": "FAIL",
    "blocked": "BLOCKED",
    "skipped": "BLOCKED",
    "not_run": "NOT RUN",
}


def write_ui_report(config, summary, repo, categories):
    records = []
    for record in summary["cases"]:
        if record["case"] not in categories:
            continue
        ui_tested = bool(record.get("steps"))
        records.append(
            {
                **record,
                "ui_supported": True,
                "ui_tested": ui_tested,
                "execution_status": STATUS[record["status"]],
                "duration_seconds": round(record.get("duration_seconds", 0), 3),
                "steps": record.get("steps", []),
                "screenshot_paths": record.get("screenshot_paths", []),
                "errors": record.get("errors", []),
            }
        )
    executed = [r for r in records if r["ui_tested"]]
    counts = {
        "scoped_test_cases": len(categories),
        "ui_automatable_test_cases": len(categories),
        "executed_browser_tests": len(executed),
        "passed_browser_tests": sum(r["execution_status"] == "PASS" for r in executed),
        "failed_browser_tests": sum(r["execution_status"] == "FAIL" for r in executed),
        "blocked_browser_tests": sum(
            r["execution_status"] == "BLOCKED" for r in records
        ),
        "api_only_test_cases": 0,
        "ui_automation_coverage_percent": round(
            100 * len(executed) / len(categories), 2
        ),
    }
    data = {
        **summary,
        "mode": "headless" if config.browser_settings.headless else "headed",
        "summary": counts,
        "cases": records,
    }
    directory = repo / "tests/selenium/reports" / config.artifact_dir.name
    directory.mkdir(parents=True, exist_ok=True)
    structured = directory / "ui-results.json"
    structured.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    if config.option.collectonly:
        return
    destination = repo / "docs/testing/narongsak/UI-TEST-EXECUTION.md"
    destination.parent.mkdir(parents=True, exist_ok=True)

    def link(path, label):
        return (
            f"[{label}]({Path(os.path.relpath(path, destination.parent)).as_posix()})"
        )

    lines = [
        "# รายงานการรันทดสอบ UI — Narongsak",
        "",
        f"เวลารัน UTC: {summary['generated_at']}",
        f"โหมด: **{data['mode']}**; Browser: {config.browser_settings.browser}; commit: `{summary['commit']}` (รวม working tree)",
        "",
        "ผลจาก session นี้เท่านั้น ไม่ใช้ PASS ในเอกสารประวัติ; ใช้ Chrome/Chromium จริงกับ Next.js และ FastAPI บน localhost ข้อมูลและไฟล์อยู่ในฐานทดสอบชั่วคราว AI ใช้ deterministic provider mock",
        "",
        f"- Test Cases ในขอบเขต: {counts['scoped_test_cases']}",
        f"- UI-automatable: {counts['ui_automatable_test_cases']}",
        f"- รัน browser tests: {counts['executed_browser_tests']}",
        f"- PASS: {counts['passed_browser_tests']}; FAIL: {counts['failed_browser_tests']}; BLOCKED: {counts['blocked_browser_tests']}",
        f"- API-only Test Cases: {counts['api_only_test_cases']}",
        f"- UI automation coverage ใน session นี้: {counts['ui_automation_coverage_percent']}%",
        "",
        "Coverage หมายถึงจำนวนเคสที่รันขั้นตอน UI จริง ไม่ใช่การยืนยันว่าทุก invariant ตรวจได้ผ่าน UI อย่างเดียว ความสัมพันธ์ในฐานข้อมูล การเก็บ revision สิทธิ์ API และ counters มี assertions เสริมแยกจาก browser evidence ทั้งสี่ AI endpoints มี UI จึงไม่มี API-only case ใน 18 เคสนี้",
        "",
        "| TC ID | Category | UI Tested | Status | Evidence |",
        "|---|---|---|---|---|",
    ]
    for r in records:
        evidence = " / ".join(
            link(p, "Screenshot " + str(i + 1))
            for i, p in enumerate(r["screenshot_paths"][-1:])
        )
        if r["errors"]:
            evidence += " / " + link(config.artifact_dir / "errors.log", "error log")
        lines.append(
            f"| {r['case']} | {r['category'].upper()} | {'Yes' if r['ui_tested'] else 'No'} | {r['execution_status']} | {evidence or 'ยังไม่มี browser evidence'} |"
        )
    lines += [
        "",
        "## ขั้นตอนและผลที่ตรวจ",
        "",
        link(structured, "Structured execution report (JSON)"),
        "",
    ]
    for r in records:
        lines += [
            f"### {r['case']} — {r['title']}",
            "",
            f"Browser: {r.get('browser_name', config.browser_settings.browser)} {r.get('browser', 'ยังไม่เริ่ม browser')}; ระยะเวลา {r['duration_seconds']} วินาที",
            f"ผลที่คาดหวัง: {r['expected_result']}",
            f"ผลจริง: {r['actual_result']} ({r['execution_status']})",
            "",
        ]
        for i, step in enumerate(r["steps"], 1):
            lines.append(
                f"{i}. {step['action']}: {step['target']} — {step.get('status', 'NOT RUN')}"
            )
        for error in r["errors"]:
            lines += [
                "",
                f"ข้อผิดพลาด: {error['message'].replace('|', '/').replace(chr(10), ' ')}",
            ]
        lines.append("")
    lines += [
        "ฐานข้อมูลเป็น SQLite และใช้ text retrieval fallback ผลนี้ไม่ยืนยัน PostgreSQL/pgvector หรือคุณภาพของ live AI provider",
        "",
        "Browser profiles, HTTP clients, services และข้อมูลทดสอบชั่วคราวถูก cleanup ผ่าน fixtures ไม่มีการเขียนข้อมูลไป production",
        "",
    ]
    content = "\n".join(lines)
    destination.write_text(content)
    archived = re.sub(
        r"\]\(([^)]+)\)",
        lambda match: (
            "]("
            + Path(
                os.path.relpath(
                    (destination.parent / match.group(1)).resolve(), directory
                )
            ).as_posix()
            + ")"
        ),
        content,
    )
    (directory / "UI-TEST-EXECUTION.md").write_text(archived)
