# Agent contracts and permissions

Code: app/services/research_flow/agents.py, providers.py, search.py and
app/schemas/research_flow.py. All model outputs forbid extra fields and bound lists.

| Role | Inputs/permissions | Output and validation |
|---|---|---|
| Planner / Orchestrator | Question only | Sub-questions, keyword queries, ambiguity flag; persisted plan |
| Search | Plan queries; repository search adapter only | Validated source candidates; only approved records, exact internal URLs, deduplicated document IDs |
| Paper | Selected source text in bounded batches | Objective, methodology, dataset, findings, limitations, conclusions; explicit text must equal an exact source quote; AI interpretation stored separately |
| Evidence | Paper summaries and source snapshots | Claims with supporting/contradicting exact quotes; identifiers and quote membership validated |
| Verifier | Claims, links, original excerpts | Independent support judgment for every link; exact complete identifier coverage required |
| Critic | Question, claims, verified links, metadata | ACCEPT or issues + routing action + targeted queries; adequacy rules override permissive model approval |
| Writer | VERIFIED claims/links and reference metadata only | Structured factual report sentences, each with claim/source IDs; structural citations checked |
| Citation | Draft plus verified evidence | Every sentence checked against its claim and all cited quotes; missing, extra or duplicate check indices rejected |

The model cannot query SQL, read files, fetch URLs or choose arbitrary tools. The
orchestrator exposes no tool callbacks to the model. Role-based context construction
is the permission boundary; providers receive only that role's permitted state.
Model mapping is configurable, allowing different models without microservices.

Quotes and all prior outputs are untrusted data in a JSON user payload. System
instructions reject document instructions, invented identifiers and disclosure of
private reasoning. Prompts are never stored in task inputs or logs. Progress is
produced by deterministic orchestration events. Critic reasons and paper interpretations
are research analysis, not private model deliberation.

Verified claims require at least one semantically verified supporting source. Strength
is weak with one source, moderate with two or more, insufficient without support.
Abstract-only evidence never receives a strong label. Contradictory links stay visible;
equal or greater contradicting document count for a claim forces human review.
