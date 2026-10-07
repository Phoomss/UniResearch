# ResearchFlow evaluation

Automated orchestration tests use MockProvider and approved test-only repository
records. They verify routing/integrity/recovery, not research accuracy. Production
source/model quality must be evaluated using an independently reviewed corpus.

Offline harness: `app/services/research_flow/evaluation.py`.
```sh
cd backend
python -m app.services.research_flow.evaluation reviewed-cases.json
```
Input shape is `{ "cases": [{ "workflow": <owner snapshot>, "labels": {...} }] }`.
Labels are independently assigned, not derived from the workflow's own verifier:
```json
{
  "citations": [{"sentence_index":0,"source_id":"actual-source-id","correct":true}],
  "factual_sentence_indices": [0,1],
  "required_claim_ids": ["actual-claim-id"],
  "source_relevance": {"actual-source-id":true},
  "contradicting_claim_source_pairs": [["actual-claim-id","actual-source-id"]]
}
```
Review each factual clause in each sentence. A citation is correct only if its source
exists, the retained locator/quote matches and the source supports all factual clauses
in the sentence. Mark irrelevant, contradictory or exaggerated citations false. Factual
sentence labels include missing-citation sentences, preventing inflated completeness.
Label multiple claims/clauses separately in the review protocol even though the current
writer API stores a report sentence as the citation-validation unit.

| Metric | Measurement |
|---|---|
| Citation correctness | Correct independently reviewed citation pairs / reviewed emitted pairs |
| Citation completeness | Factual sentences fully supported by all their citations / labeled factual sentences; unknown if any emitted pair lacks review |
| Evidence coverage | Required labeled claim IDs with verified evidence / required labeled claim IDs |
| Source relevance | Relevant retrieved sources / reviewed retrieved sources |
| Contradiction detection | Precision and recall against labeled claim/source contradicting pairs |
| Unsupported claim rate | Unsupported factual sentences / evaluable labeled factual sentences; unjudged sentences reported separately |
| Workflow success rate | COMPLETED workflows / evaluated workflows, including failed/paused cases |
| Average research iterations | Mean completed search rounds (including initial round and human-granted cycles) |
| Average workflow duration | Mean start-to-completion wall seconds for completed workflows; paused/failed durations null, report their counts separately |

Harness reports per-case and macro-average metrics, review-label coverage, unknown
factual sentences and case count. Missing labels return null, not automatic correctness.
Evidence coverage uses IDs in the exported snapshot; evaluation of missing perspectives
requires reviewers to maintain a richer question/subquestion gold map outside this
initial harness. Evaluation tests cover incomplete citations, unknown labels, conflicts,
source relevance and duration arithmetic.

## Recommended review protocol

Use an approved corpus with known relevant, irrelevant and contradictory excerpts,
ambiguous questions, source injection attempts, empty retrieval and deliberately
unsupported drafts. Run multiple question depths/model mappings; hold out questions
from prompt tuning. Export owner snapshots, label independently with two researchers,
and adjudicate disagreements. Track sample size, exact model/configuration/date,
review coverage, abstention rate and costs alongside the metrics. Keep private exports
out of version control. No paid-model benchmark or production accuracy score is claimed
by this implementation. The confidence heuristic is documented in ARCHITECTURE.md;
it is separate from independently measured correctness.

## Reproducible checks

`backend/tests/fixtures/research_flow_evaluation.json` is an explicitly synthetic
arithmetic fixture, not a research result. Running the CLI against it produces
`evidence/evaluation-fixture-result.json` (completeness/evidence coverage 0.5 because
one labeled factual sentence/claim lacks support). No research accuracy is inferred.

PostgreSQL integration is opt-in with RESEARCH_FLOW_TEST_POSTGRES_URL pointing only
to a disposable local database at port 55437 named flowtest. It exercises fresh
bootstrap/migration, simultaneous quota checks, simultaneous lease claims and a
mock-provider completed workflow. Normal CI skips it without that variable.

Frontend: build first, install Playwright Chromium, then `pnpm test:research-flow`.
Tests use explicitly labeled interface fixtures and a disposable local Next server;
backend authorization and provider behavior are tested separately. The existing
Playwright suite skips these fixtures unless RESEARCH_FLOW_UI_TEST=1 is set.
