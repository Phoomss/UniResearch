# Orchestration and recovery

A created workflow has a PENDING planner task and no ready_at. Start sets deadline,
ready_at and workflow.started. The worker claims a lease, checks dependencies and
budgets, marks RUNNING and reserves an attempt. Agents do not control transitions.

| Agent | Workflow state | Successful next route |
|---|---|---|
| planner | PLANNING | search, or WAITING_FOR_HUMAN for ambiguity |
| search | SEARCHING | paper; no sources → bounded search repeat |
| paper | READING | next unread paper batch, then evidence |
| evidence | EXTRACTING_EVIDENCE | verifier |
| verifier | VERIFYING | critic |
| critic | CRITIQUING | writer, search, paper, evidence, or human review |
| writer | WRITING | citation |
| citation | VALIDATING_CITATIONS | COMPLETED only at full coverage; otherwise evidence |

Critic SEARCH_MORE → search, READ_MORE → paper, RECHECK_EVIDENCE → evidence.
REWRITE / RECHECK_CITATIONS during pre-draft critique go through evidence again;
no draft can bypass successful review. REQUEST_HUMAN_REVIEW pauses. Empty claims,
unsupported claims, or fewer than 2/3/5 supporting documents require another search
regardless of an ACCEPT response. Strong contradictions require human review.

Each feedback loop increments iteration. Reaching research/search/time/cost/context
limits pauses explicitly. Provider/schema/provenance failures retry the same task
with backoff of min(2^retryCount, 30) seconds. Retry exhaustion records FAILED task
and WAITING_FOR_HUMAN workflow. Database failures leave the lease to expire for
recovery. No provider error is silently accepted. Stop marks workflow FAILED and
unfinished tasks FAILED/cancelled, clears draft/readiness/lease; stale work cannot commit.

Task statuses: PENDING, RUNNING, COMPLETED, RETRYING, FAILED, BLOCKED. Every next task
has a dependency on the completed task that routed it. Human intervention creates a
fresh PENDING task and supersedes unfinished tasks with BLOCKED.

## Human commands

Only the owner of a WAITING_FOR_HUMAN workflow may continue it.
- CONTINUE resumes the paused role; an accepted ambiguous plan resumes search.
- SEARCH_MORE explicitly selects search.
- ACCEPT_CURRENT uses existing verified claims for writing, records an adequacy
  override limitation, and still requires citation validation.
- MODIFY_QUESTION replaces question and clears current source/evidence/report entities,
  retaining task/event audit history and cumulative cost counters.
- RETRY_AGENT requires a failed/blocked task ID belonging to the workflow.
- Stop is a separate endpoint and does not require a waiting state.

An explicit human continuation grants a fresh bounded research/time/search cycle;
cumulative token/LLM caps remain. A workflow at its cumulative budget immediately
pauses again; creating a new workflow is subject to creation quotas. No endpoint
can mark an unsupported report complete. Non-completed drafts are withheld from
workflow lists, snapshots and task outputs. Report endpoint returns 409 until complete.

Events are durable safe summaries: workflow.created/started/continued/stopped/completed,
agent.started/completed/failed, source.found, paper.analyzed, evidence.updated,
contradiction.detected, draft.generated, citation.validated, human_review.required.
The frontend polls snapshots; /events supports an after cursor, not SSE.
