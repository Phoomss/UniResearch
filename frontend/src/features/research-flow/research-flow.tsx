"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui";
import type { Flow, FlowSource } from "./types";

const terminal = new Set(["COMPLETED", "FAILED", "WAITING_FOR_HUMAN"]);
const agents = ["planner", "search", "paper", "evidence", "verifier", "critic", "writer", "citation"];
const label = (value: string) => value.replaceAll("_", " ");

async function request<T>(path = "", body?: unknown): Promise<T> {
  const response = await fetch(`/api/research-flow${path}`, {
    method: body === undefined ? "GET" : "POST", cache: "no-store",
    ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? "ResearchFlow request failed");
  return data as T;
}

function SourceLink({ source }: { source?: FlowSource }) {
  return source ? <Link href={`/research/${source.document_id}`} target="_blank">{source.title}</Link> : <span>Unavailable source</span>;
}

export function ResearchFlow() {
  const [question, setQuestion] = useState("");
  const [depth, setDepth] = useState("STANDARD");
  const [selected, setSelected] = useState("");
  const [flow, setFlow] = useState<Flow | null>(null);
  const [history, setHistory] = useState<Flow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pollVersion, setPollVersion] = useState(0);

  useEffect(() => {
    let active = true;
    request<Flow[]>().then(data => {
      if (!active) return;
      setHistory(data);
      const saved = new URLSearchParams(window.location.search).get("workflow");
      if (saved && data.some(item => item.id === saved)) setSelected(saved);
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    window.history.replaceState(null, "", `/research-flow?workflow=${encodeURIComponent(selected)}`);
    async function poll() {
      try {
        const next = await request<Flow>(`/${selected}`);
        if (!active) return;
        setFlow(next);
        setError("");
        if (!terminal.has(next.status) && next.started_at) timer = setTimeout(poll, 2000);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Could not refresh workflow");
        timer = setTimeout(poll, 5000);
      }
    }
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [selected, pollVersion]);

  async function create() {
    setBusy(true); setError("");
    try {
      const created = await request<Flow>("", { research_question: question, depth });
      setSelected(created.id); setFlow(created);
      setHistory(await request<Flow[]>());
      const started = await request<Flow>(`/${created.id}/start`, {});
      setFlow(started); setPollVersion(v => v + 1);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not start research"); }
    finally { setBusy(false); }
  }

  async function command(action: string, taskId?: string) {
    if (!flow) return;
    setBusy(true); setError("");
    try {
      const path = action === "STOP" ? "stop" : action === "START" ? "start" : "continue";
      const next = await request<Flow>(`/${flow.id}/${path}`, {
        action, ...(taskId ? { task_id: taskId } : {}),
        ...(action === "MODIFY_QUESTION" ? { research_question: question } : {}),
      });
      setFlow(next); setHistory(await request<Flow[]>()); setPollVersion(v => v + 1);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update workflow"); }
    finally { setBusy(false); }
  }

  return <div className="research-flow">
    <section className="flow-card" aria-labelledby="flow-input-title">
      <h2 id="flow-input-title">Research question</h2>
      <form onSubmit={e => { e.preventDefault(); void create(); }}>
        <label htmlFor="research-question">What would you like to investigate?</label>
        <textarea id="research-question" value={question} onChange={e => setQuestion(e.target.value)}
          minLength={12} maxLength={2000} required rows={4}
          placeholder="Analyze the effectiveness of Retrieval-Augmented Generation for reducing hallucination in university research assistants." />
        <div className="flow-controls">
          <label htmlFor="research-depth">Research depth</label>
          <select id="research-depth" value={depth} onChange={e => setDepth(e.target.value)}>
            <option value="QUICK">Quick · up to 5 sources</option>
            <option value="STANDARD">Standard · up to 10 sources</option>
            <option value="DEEP">Deep · up to 20 sources</option>
          </select>
          <Button disabled={busy}>{busy ? "Working…" : "Start research"}</Button>
        </div>
      </form>
      <p className="muted">Searches approved UniResearch abstracts. Source availability can limit the result. Every report sentence must pass citation validation.</p>
    </section>
    {error && <p role="alert" className="flow-error">{error}</p>}
    {history.length > 0 && <section className="flow-card">
      <label htmlFor="flow-history">Saved workflows</label>
      <select id="flow-history" value={selected} onChange={e => { setSelected(e.target.value); setFlow(null); }}>
        <option value="">Select a workflow</option>
        {history.map(item => <option key={item.id} value={item.id}>{item.research_question.slice(0, 90)} · {label(item.status)}</option>)}
      </select>
    </section>}
    {flow && <>
      <section className="flow-card" aria-labelledby="flow-status-title">
        <div className="flow-heading"><h2 id="flow-status-title">Research team</h2><span role="status">{label(flow.status)}</span></div>
        <p>{flow.research_question}</p>
        <ol className="flow-agents">
          {agents.map(agent => {
            const tasks = flow.tasks.filter(t => t.agent_type === agent);
            const task = tasks.at(-1);
            return <li key={agent} data-status={task?.status ?? "PENDING"}>
              <strong>{agent === "planner" ? "Research orchestrator" : `${agent[0].toUpperCase()}${agent.slice(1)} agent`}</strong>
              <span>{label(task?.status ?? "PENDING")}</span>
              {tasks.length > 1 && <small>{tasks.length} tasks</small>}
            </li>;
          })}
        </ol>
        <p className="muted">{flow.sources.length} sources · {flow.papers.length} abstracts analyzed · {flow.claims.length} claims · {flow.llm_calls} LLM calls · {flow.input_tokens + flow.output_tokens} tokens (actual or reserved estimate)</p>
        <div className="flow-controls">
          {!flow.started_at && !terminal.has(flow.status) && <Button disabled={busy} onClick={() => void command("START")}>Start saved workflow</Button>}
          {flow.status !== "COMPLETED" && flow.status !== "FAILED" && <Button variant="secondary" disabled={busy} onClick={() => void command("STOP")}>Stop workflow</Button>}
        </div>
        <details><summary>Plan and task history</summary>
          <p>{flow.plan.summary}</p>
          <ol>{flow.plan.sub_questions?.map((q, i) => <li key={i}>{q}</li>)}</ol>
          {flow.tasks.map(t => <p key={t.id}><strong>{t.agent_type}</strong> · {label(t.status)} · retries {t.retry_count}
            {t.error && <> · {t.error}</>}
            {flow.status === "WAITING_FOR_HUMAN" && ["FAILED", "BLOCKED"].includes(t.status) && t.error !== "superseded_by_human" &&
              <Button variant="ghost" disabled={busy} onClick={() => void command("RETRY_AGENT", t.id)}>Retry agent</Button>}
          </p>)}
        </details>
        <details><summary>Progress log</summary><ol>{flow.events.map(e => <li key={e.id}>{e.summary}</li>)}</ol></details>
      </section>
      {flow.status === "WAITING_FOR_HUMAN" && <section className="flow-card flow-review">
        <h2>Human review required</h2>
        <p>The team paused. Inspect the evidence and limitations before choosing how to proceed.</p>
        <div className="flow-controls">
          <Button disabled={busy} onClick={() => void command("CONTINUE")}>Continue research</Button>
          <Button variant="secondary" disabled={busy} onClick={() => void command("SEARCH_MORE")}>Search more sources</Button>
          <Button variant="secondary" disabled={busy || !flow.claims.some(c => c.verified)} onClick={() => void command("ACCEPT_CURRENT")}>Accept current evidence</Button>
          <Button variant="secondary" disabled={busy || question.trim().length < 12} onClick={() => void command("MODIFY_QUESTION")}>Use edited question above</Button>
        </div>
        <p className="muted">Accepting evidence still requires writing and citation validation. Cumulative cost limits remain in effect.</p>
      </section>}
      {flow.critic_feedback.issues?.length ? <section className="flow-card"><h2>Critic review</h2>
        {flow.critic_feedback.issues.map((issue, i) => <p key={i}><strong>{label(issue.type)}</strong>: {issue.reason} · {label(issue.recommended_action)}</p>)}
      </section> : null}
      <section className="flow-card"><h2>Evidence explorer</h2>
        {!flow.claims.length && <p className="muted">Evidence will appear as the team analyzes sources.</p>}
        {flow.claims.map(claim => <article className="flow-evidence" key={claim.id} id={`claim-${claim.id}`}>
          <h3>{claim.text}</h3><p>Evidence strength: <strong>{claim.strength}</strong> · {claim.verified ? "Support verified" : "Unsupported"}</p>
          <details><summary>Inspect evidence ({flow.evidence.filter(e => e.claim_id === claim.id).length})</summary>
            {flow.evidence.filter(e => e.claim_id === claim.id).map(e => <div key={e.id}>
              <p><strong>{e.relation}</strong> · {e.support_verified ? "Relation verified" : "Unverified"} · <SourceLink source={flow.sources.find(s => s.id === e.source_id)} /></p>
              <blockquote>{e.quote}</blockquote><small>Locator: {e.locator}</small>
            </div>)}
          </details>
        </article>)}
      </section>
      {flow.status === "COMPLETED" && <section className="flow-card" aria-labelledby="flow-report-title">
        <h2 id="flow-report-title">Final research report</h2>
        <p>Research confidence heuristic: <strong>{Math.round(flow.confidence * 100)}%</strong>. This is a system heuristic, not objective truth.</p>
        <div className="flow-metrics">{["evidence_coverage", "citation_coverage", "source_agreement", "source_quality", "source_independence_proxy"].map(key => <p key={key}>{label(key)} <strong>{Math.round(Number(flow.metrics[key] ?? 0) * 100)}%</strong></p>)}</div>
        {["Executive Summary", "Background", "Key Findings", "Evidence Analysis", "Conflicting Evidence", "Conclusion"].map(section => {
          const sentences = flow.draft.sentences?.filter(s => s.section === section) ?? [];
          return sentences.length ? <div key={section}><h3>{section}</h3>{sentences.map((s, i) => <p key={i}>{s.text} <a href={`#claim-${s.claim_id}`}>[Evidence]</a> {s.source_ids.map(id => <a key={id} href={`#source-${id}`}>[{flow.sources.findIndex(source => source.id === id) + 1}] </a>)}</p>)}</div> : null;
        })}
      </section>}
      <section className="flow-card"><h2>Sources and references</h2>
        <ol>{flow.sources.map(source => <li key={source.id} id={`source-${source.id}`}>
          <SourceLink source={source} /><p className="muted">{source.authors.join(", ") || "Authors unavailable"} · {source.provider} · {source.chunk_ref} · retrieved {new Date(`${source.retrieved_at}Z`).toLocaleString()}</p>
          <details><summary>Source excerpt and analysis</summary><blockquote>{source.content}</blockquote>
            {flow.papers.filter(p => p.source_id === source.id).map(p => <div key={p.id}>
              {["objective", "methodology", "dataset"].map(key => {
                const value = p.summary[key as "objective" | "methodology" | "dataset"];
                return <p key={key}><strong>{key}</strong>: {value?.text ?? "Not explicitly stated in available abstract"}</p>;
              })}
              {p.summary.findings.map((f, i) => <p key={i}>{f.text}<br /><q>{f.quote}</q></p>)}
              <p><strong>AI interpretation</strong>: {p.summary.interpretation || "None"}</p>
            </div>)}
          </details>
        </li>)}</ol>
      </section>
      <section className="flow-card"><h2>Limitations</h2><ul>{flow.limitations.map((item, i) => <li key={i}>{item}</li>)}</ul></section>
    </>}
  </div>;
}
