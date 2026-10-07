# ResearchFlow API

FastAPI prefix /research-flow; JSON, JWT Bearer, active user required everywhere.
Next.js proxy prefix /api/research-flow uses the existing HTTP-only session cookie.
Every ID route scopes the workflow to the owner, including admins (404 for another
owner). All roles with active authenticated accounts may create workflows.

| Method | Path | Behavior |
|---|---|---|
| POST | /research-flow | Create question/depth and pending planner; 201 |
| GET | /research-flow | Owner's latest 50 workflow summaries |
| GET | /research-flow/{id} | Shared state snapshot |
| POST | /research-flow/{id}/start | Queue once; 409 if already started |
| POST | /research-flow/{id}/continue | Human command while paused |
| POST | /research-flow/{id}/stop | Cancel and fence in-flight output |
| GET | /research-flow/{id}/tasks | Task/dependency/retry history |
| GET | /research-flow/{id}/sources | Source provenance snapshots |
| GET | /research-flow/{id}/papers | Abstract summaries/interpretation |
| GET | /research-flow/{id}/claims | Claims and verification/strength |
| GET | /research-flow/{id}/evidence | Supporting/contradicting exact quotes |
| GET | /research-flow/{id}/citations | Validated sentence/source/evidence links |
| GET | /research-flow/{id}/report | Completed report/metrics/limitations; otherwise 409 |
| GET | /research-flow/{id}/events?after=0 | Up to 200 ordered safe events after cursor |

Create example:
```json
{"research_question":"How does retrieval reduce factual errors in university question answering?","depth":"STANDARD"}
```
Question length is 12–2000 characters; whitespace-only questions are rejected. Depth
is QUICK/STANDARD/DEEP. Start/stop accept an empty body. Continue example:
```json
{"action":"SEARCH_MORE"}
```
Other actions: CONTINUE, ACCEPT_CURRENT, MODIFY_QUESTION (requires research_question),
RETRY_AGENT (requires task_id of a failed/blocked task). Unknown fields are rejected.

Responses follow existing FastAPI HTTPException detail conventions; the Next proxy
normalizes errors through toRouteResponse. 401: missing/invalid authentication;
404: absent/not-owned; 409: invalid lifecycle/no report/no verified evidence;
422: invalid schema; 429: workflow creation/concurrency budget; 503: disabled feature.
Agent/provider errors become task error categories and safe progress events.

Snapshots expose tasks, sources, papers, claims, evidence, citations, events, plan,
critic feedback, counters, metrics and limitations. Draft is empty until completed;
writer task output is withheld, with final text available through validated report.
No prompts, lease tokens or private reasoning are returned. The UI persists workflow
selection in a URL query parameter, polls every 2s while active and stops polling on
completion/pause/failure. Refresh restores saved selection.
