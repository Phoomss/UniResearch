"""Offline evaluation of exported workflows against independently reviewed labels.
Usage: python -m app.services.research_flow.evaluation /path/to/reviewed-cases.json
No provider calls. Missing labels are unknown, never assumed correct.
"""

import argparse
import json
from datetime import datetime
from statistics import mean


def ratio(numerator, denominator):
    return numerator / denominator if denominator else None


def evaluate_case(workflow, labels):
    citations = workflow.get("citations", [])
    judged = {
        (x["sentence_index"], x["source_id"]): x["correct"]
        for x in labels.get("citations", [])
    }
    keys = {(c["sentence_index"], c["source_id"]) for c in citations}
    reviewed = keys & judged.keys()
    correct = sum(judged[key] for key in reviewed)
    factual = set(labels.get("factual_sentence_indices", []))
    supported = set()
    unknown_sentences = set()
    for idx in factual:
        cited = {key for key in keys if key[0] == idx}
        if cited and not cited <= judged.keys():
            unknown_sentences.add(idx)
        elif cited and all(judged[key] for key in cited):
            supported.add(idx)
    evaluable_facts = factual - unknown_sentences
    required_claims = set(labels.get("required_claim_ids", []))
    verified_claims = {c["id"] for c in workflow.get("claims", []) if c.get("verified")}
    relevance = labels.get("source_relevance", {})
    source_ids = {s["id"] for s in workflow.get("sources", [])}
    reviewed_sources = source_ids & relevance.keys()
    expected_conflicts = {
        tuple(pair) for pair in labels.get("contradicting_claim_source_pairs", [])
    }
    detected_conflicts = {
        (e["claim_id"], e["source_id"])
        for e in workflow.get("evidence", [])
        if e["relation"] == "contradicting" and e.get("support_verified")
    }
    completed_events = [
        e for e in workflow.get("events", []) if e["event_type"] == "workflow.completed"
    ]
    duration = None
    if workflow.get("started_at") and completed_events:
        duration = (
            datetime.fromisoformat(completed_events[-1]["created_at"])
            - datetime.fromisoformat(workflow["started_at"])
        ).total_seconds()
    return {
        "citation_correctness": ratio(correct, len(reviewed)),
        "citation_label_coverage": ratio(len(reviewed), len(keys)),
        "citation_completeness": ratio(len(supported), len(factual))
        if not unknown_sentences
        else None,
        "evidence_coverage": ratio(
            len(required_claims & verified_claims), len(required_claims)
        ),
        "source_relevance": ratio(
            sum(relevance[sid] for sid in reviewed_sources), len(reviewed_sources)
        ),
        "source_label_coverage": ratio(len(reviewed_sources), len(source_ids)),
        "contradiction_detection_recall": ratio(
            len(expected_conflicts & detected_conflicts), len(expected_conflicts)
        ),
        "contradiction_detection_precision": ratio(
            len(expected_conflicts & detected_conflicts), len(detected_conflicts)
        ),
        "unsupported_claim_rate": ratio(
            len(evaluable_facts - supported), len(evaluable_facts)
        ),
        "unjudged_factual_sentences": len(unknown_sentences),
        "workflow_success": int(workflow.get("status") == "COMPLETED"),
        "research_iterations": sum(
            t["agent_type"] == "search" and t["status"] == "COMPLETED"
            for t in workflow.get("tasks", [])
        ),
        "workflow_duration_seconds": duration,
    }


def evaluate(cases):
    results = [
        evaluate_case(case["workflow"], case.get("labels", {})) for case in cases
    ]
    averages = {
        key: mean([r[key] for r in results if r[key] is not None])
        if any(r[key] is not None for r in results)
        else None
        for key in (results[0] if results else {})
    }
    return {"cases": results, "averages": averages, "case_count": len(results)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="JSON object with reviewed cases list")
    args = parser.parse_args()
    with open(args.input, encoding="utf-8") as handle:
        data = json.load(handle)
    print(json.dumps(evaluate(data["cases"]), indent=2))


if __name__ == "__main__":
    main()
