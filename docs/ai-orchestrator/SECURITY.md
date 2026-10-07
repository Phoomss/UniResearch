# ResearchFlow security boundaries

External source text and user input are untrusted data. Role policies live in system
instructions; source text is JSON-encoded in an untrusted_data payload. Agents never
receive tool callbacks, shell/filesystem/network credentials or unrestricted state.
Writer receives only verified claims/evidence. Citation receives the draft and
verified evidence. Exact quote membership, known IDs and complete output coverage
are enforced by code independently of the model.

Prompt isolation reduces prompt-injection risk but cannot prove immunity. A malicious
abstract can still influence a model's judgment; unsupported/mismatched references
and incomplete checks fail closed. Model-based semantic checks remain fallible, so
independent human label-based evaluation is required. No system prompts or private
chain-of-thought are persisted or exposed. Explicit paper fields are verbatim quotes;
interpretation is separately labeled. Report factual sentences require citations.

## Source and document controls

Only the code-owned LocalSearchProvider accesses approved ResearchWork entries using
the existing search service. LLMs cannot inject new papers/URLs. Source document ID
and URL must match /research/{id}, provider must be uniresearch, duplicates removed.
No source URL is fetched, preventing SSRF at this boundary. DOI/publication fields
are not inferred. Source content is bounded; oversized agent contexts pause explicitly.
ResearchFlow introduces no upload API. Existing upload MIME/suffix/signature/size
validation applies (25MB documents, 5MB covers by default). Full-text parsing and
external adapters need their own MIME, redirect/DNS/private-IP, timeout and size guards
before introduction; those are not implemented under a claim of external support.

## Authorization, rate limits and resource exhaustion

JWT plus active-account dependency is reused. Every workflow/state/control route is
owner-scoped, including task IDs supplied to retry. Admin status does not grant access
to another researcher's workflow. Approved corpus entries are the only search inputs;
private/pending works do not enter workflows. Research snapshots remain private to
workflow owners; original record deletion preserves the owner's provenance snapshot.

Creation limits: 10/hour/user, 2 active-or-paused workflows/user, 20 globally.
PostgreSQL transactional advisory lock serializes quota checks across replicas; a
user row lock serializes that owner's creation. Completed/failed workflows release
slots. Source/iteration/search/retry/context/time/token caps bound each execution.
Explicit human actions can start new bounded cycles but cannot reset cumulative
LLM/token usage. Authenticated read/action traffic still needs deployment-level request
rate limiting and retention policies; creation quota is not a general HTTP rate limiter.

The Next proxy uses an endpoint allowlist and UUID validation, caps request JSON,
rejects malformed JSON/cursors and cross-site POST origins. It never exposes JWTs to
browser JavaScript. Existing session cookie secure=false remains an inherited deployment
risk; HTTPS/secure cookies, secret rotation, existing default SECRET_KEY and database
TLS settings must be handled at deployment scope.

## Concurrency, logs and storage

Leases with fencing tokens prevent a stale worker committing after stop/reclaim.
State changes use short transactions, with savepoints for invalid output rollback.
Provider operations have timeouts and reservations; crashes consume retry/cost budgets.
Structured logs contain workflow/task IDs, role/status/duration/retry/model/usage/error
class. Raw exception messages, source content, research questions, API keys and prompts
are excluded. SQL echo was disabled because it could log state values. API request
access logs may contain workflow IDs only. Protect database backups and source snapshots
with existing infrastructure controls; add retention/deletion policy before large-scale use.
