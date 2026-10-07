from app.services.research_flow.evaluation import evaluate, evaluate_case


def test_evaluation_uses_independent_labels_and_missing_citations():
    workflow = {
        "status": "COMPLETED",
        "citations": [{"sentence_index": 0, "source_id": "source"}],
        "claims": [{"id": "claim", "verified": 1}],
        "sources": [{"id": "source"}],
        "evidence": [
            {
                "claim_id": "claim",
                "source_id": "source",
                "relation": "contradicting",
                "support_verified": 1,
            }
        ],
        "tasks": [{"agent_type": "search", "status": "COMPLETED"}],
        "started_at": "2026-10-07T00:00:00",
        "events": [
            {"event_type": "workflow.completed", "created_at": "2026-10-07T00:00:10"}
        ],
    }
    labels = {
        "citations": [{"sentence_index": 0, "source_id": "source", "correct": True}],
        "factual_sentence_indices": [0, 1],
        "required_claim_ids": ["claim", "missing"],
        "source_relevance": {"source": True},
        "contradicting_claim_source_pairs": [["claim", "source"]],
    }
    result = evaluate_case(workflow, labels)
    assert result["citation_correctness"] == 1
    assert result["citation_completeness"] == 0.5
    assert result["unsupported_claim_rate"] == 0.5
    assert result["evidence_coverage"] == 0.5
    assert result["contradiction_detection_recall"] == 1
    assert result["workflow_duration_seconds"] == 10
    assert (
        evaluate([{"workflow": workflow, "labels": labels}])["averages"][
            "workflow_success"
        ]
        == 1
    )


def test_missing_labels_are_unknown():
    result = evaluate_case(
        {"citations": [{"sentence_index": 0, "source_id": "source"}]},
        {"factual_sentence_indices": [0]},
    )
    assert result["citation_correctness"] is None
    assert result["citation_completeness"] is None
    assert result["unsupported_claim_rate"] is None
    assert result["unjudged_factual_sentences"] == 1
    assert evaluate([])["case_count"] == 0
