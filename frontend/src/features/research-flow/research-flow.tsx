"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui";
import type { Flow, FlowSource } from "./types";
import { label, translateMessage } from "./thai";

const terminal = new Set(["COMPLETED", "FAILED", "WAITING_FOR_HUMAN"]);
const agents = ["planner", "search", "paper", "evidence", "verifier", "critic", "writer", "citation"];

async function request<T>(path = "", body?: unknown): Promise<T> {
  const response = await fetch(`/api/research-flow${path}`, {
    method: body === undefined ? "GET" : "POST", cache: "no-store",
    ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? "ไม่สามารถดำเนินการคำขอ ResearchFlow ได้");
  return data as T;
}

function SourceLink({ source }: { source?: FlowSource }) {
  return source ? <Link href={`/research/${source.document_id}`} target="_blank">{source.title}</Link> : <span>ไม่พบแหล่งข้อมูล</span>;
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
        setError(e instanceof Error ? e.message : "ไม่สามารถอัปเดตสถานะงานวิจัยได้");
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
    } catch (e) { setError(e instanceof Error ? e.message : "ไม่สามารถเริ่มงานวิจัยได้"); }
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
    } catch (e) { setError(e instanceof Error ? e.message : "ไม่สามารถอัปเดตงานวิจัยได้"); }
    finally { setBusy(false); }
  }

  return <div className="research-flow">
    <section className="flow-card" aria-labelledby="flow-input-title">
      <h2 id="flow-input-title">คำถามวิจัย</h2>
      <form onSubmit={e => { e.preventDefault(); void create(); }}>
        <label htmlFor="research-question">คุณต้องการศึกษาประเด็นใด?</label>
        <textarea id="research-question" value={question} onChange={e => setQuestion(e.target.value)}
          minLength={12} maxLength={2000} required rows={4}
          placeholder="วิเคราะห์ประสิทธิภาพของ Retrieval-Augmented Generation ในการลดการสร้างข้อมูลที่ไม่ถูกต้องของผู้ช่วยวิจัยในมหาวิทยาลัย" />
        <div className="flow-controls">
          <label htmlFor="research-depth">ระดับความละเอียด</label>
          <select id="research-depth" value={depth} onChange={e => setDepth(e.target.value)}>
            <option value="QUICK">รวดเร็ว · สูงสุด 5 แหล่งข้อมูล</option>
            <option value="STANDARD">มาตรฐาน · สูงสุด 10 แหล่งข้อมูล</option>
            <option value="DEEP">เชิงลึก · สูงสุด 20 แหล่งข้อมูล</option>
          </select>
          <Button disabled={busy}>{busy ? "กำลังดำเนินการ…" : "เริ่มการวิจัย"}</Button>
        </div>
      </form>
      <p className="muted">ค้นหาจากบทคัดย่อที่ได้รับอนุมัติใน UniResearch ผลลัพธ์อาจมีข้อจำกัดตามแหล่งข้อมูลที่มี ทุกประโยคในรายงานต้องผ่านการตรวจสอบการอ้างอิง</p>
    </section>
    {error && <p role="alert" className="flow-error">{translateMessage(error)}</p>}
    {history.length > 0 && <section className="flow-card">
      <label htmlFor="flow-history">งานวิจัยที่บันทึกไว้</label>
      <select id="flow-history" value={selected} onChange={e => { setSelected(e.target.value); setFlow(null); }}>
        <option value="">เลือกงานวิจัย</option>
        {history.map(item => <option key={item.id} value={item.id}>{item.research_question.slice(0, 90)} · {label(item.status)}</option>)}
      </select>
    </section>}
    {flow && <>
      <section className="flow-card" aria-labelledby="flow-status-title">
        <div className="flow-heading"><h2 id="flow-status-title">ทีมวิจัย</h2><span role="status">{label(flow.status)}</span></div>
        <p>{flow.research_question}</p>
        <ol className="flow-agents">
          {agents.map(agent => {
            const tasks = flow.tasks.filter(t => t.agent_type === agent);
            const task = tasks.at(-1);
            return <li key={agent} data-status={task?.status ?? "PENDING"}>
              <strong>{label(agent)}</strong>
              <span>{label(task?.status ?? "PENDING")}</span>
              {tasks.length > 1 && <small>{tasks.length} งาน</small>}
            </li>;
          })}
        </ol>
        <p className="muted">{flow.sources.length} แหล่งข้อมูล · {flow.papers.length} บทคัดย่อที่วิเคราะห์แล้ว · {flow.claims.length} ข้อค้นพบ · {flow.llm_calls} ครั้งที่เรียกใช้ LLM · {flow.input_tokens + flow.output_tokens} โทเคน (ยอดใช้จริงหรือยอดประมาณที่สำรองไว้)</p>
        <div className="flow-controls">
          {!flow.started_at && !terminal.has(flow.status) && <Button disabled={busy} onClick={() => void command("START")}>เริ่มงานวิจัยที่บันทึกไว้</Button>}
          {flow.status !== "COMPLETED" && flow.status !== "FAILED" && <Button variant="secondary" disabled={busy} onClick={() => void command("STOP")}>หยุดงานวิจัย</Button>}
        </div>
        <details><summary>แผนและประวัติการทำงาน</summary>
          <p>{flow.plan.summary}</p>
          <ol>{flow.plan.sub_questions?.map((q, i) => <li key={i}>{q}</li>)}</ol>
          {flow.tasks.map(t => <p key={t.id}><strong>{label(t.agent_type)}</strong> · {label(t.status)} · ลองใหม่ {t.retry_count} ครั้ง
            {t.error && <> · {label(t.error)}</>}
            {flow.status === "WAITING_FOR_HUMAN" && ["FAILED", "BLOCKED"].includes(t.status) && t.error !== "superseded_by_human" &&
              <Button variant="ghost" disabled={busy} onClick={() => void command("RETRY_AGENT", t.id)}>ลองทำงานนี้อีกครั้ง</Button>}
          </p>)}
        </details>
        <details><summary>บันทึกความคืบหน้า</summary><ol>{flow.events.map(e => <li key={e.id}>{translateMessage(e.summary)}</li>)}</ol></details>
      </section>
      {flow.status === "WAITING_FOR_HUMAN" && <section className="flow-card flow-review">
        <h2>รอผู้วิจัยตรวจสอบ</h2>
        <p>ทีมวิจัยหยุดรอการตรวจสอบ โปรดพิจารณาหลักฐานและข้อจำกัดก่อนเลือกวิธีดำเนินการต่อ</p>
        <div className="flow-controls">
          <Button disabled={busy} onClick={() => void command("CONTINUE")}>ดำเนินการวิจัยต่อ</Button>
          <Button variant="secondary" disabled={busy} onClick={() => void command("SEARCH_MORE")}>ค้นหาแหล่งข้อมูลเพิ่มเติม</Button>
          <Button variant="secondary" disabled={busy || !flow.claims.some(c => c.verified)} onClick={() => void command("ACCEPT_CURRENT")}>ยอมรับหลักฐานปัจจุบัน</Button>
          <Button variant="secondary" disabled={busy || question.trim().length < 12} onClick={() => void command("MODIFY_QUESTION")}>ใช้คำถามที่แก้ไขด้านบน</Button>
        </div>
        <p className="muted">เมื่อยอมรับหลักฐานแล้ว ระบบยังต้องเขียนรายงานและตรวจสอบการอ้างอิง โดยยังใช้ขีดจำกัดทรัพยากรสะสมเดิม</p>
      </section>}
      {flow.critic_feedback.issues?.length ? <section className="flow-card"><h2>ผลการประเมินงานวิจัย</h2>
        {flow.critic_feedback.issues.map((issue, i) => <p key={i}><strong>{label(issue.type)}</strong>: {issue.reason} · {label(issue.recommended_action)}</p>)}
      </section> : null}
      <section className="flow-card"><h2>สำรวจหลักฐาน</h2>
        {!flow.claims.length && <p className="muted">หลักฐานจะแสดงเมื่อทีมวิจัยวิเคราะห์แหล่งข้อมูล</p>}
        {flow.claims.map(claim => <article className="flow-evidence" key={claim.id} id={`claim-${claim.id}`}>
          <h3>{claim.text}</h3><p>ความหนักแน่นของหลักฐาน: <strong>{label(claim.strength)}</strong> · {claim.verified ? "ตรวจสอบหลักฐานสนับสนุนแล้ว" : "ยังไม่มีหลักฐานรองรับ"}</p>
          <details><summary>ดูหลักฐาน ({flow.evidence.filter(e => e.claim_id === claim.id).length})</summary>
            {flow.evidence.filter(e => e.claim_id === claim.id).map(e => <div key={e.id}>
              <p><strong>{label(e.relation)}</strong> · {e.support_verified ? "ตรวจสอบความสัมพันธ์แล้ว" : "ยังไม่ได้ตรวจสอบ"} · <SourceLink source={flow.sources.find(s => s.id === e.source_id)} /></p>
              <blockquote>{e.quote}</blockquote><small>ตำแหน่งในแหล่งข้อมูล: {label(e.locator)}</small>
            </div>)}
          </details>
        </article>)}
      </section>
      {flow.status === "COMPLETED" && <section className="flow-card" aria-labelledby="flow-report-title">
        <h2 id="flow-report-title">รายงานวิจัยฉบับสมบูรณ์</h2>
        <p>คะแนนความเชื่อมั่นจากเกณฑ์ของระบบ: <strong>{Math.round(flow.confidence * 100)}%</strong>. คะแนนนี้เป็นการประเมินตามเกณฑ์ของระบบ ไม่ใช่ค่าความจริงที่แน่นอน</p>
        <div className="flow-metrics">{["evidence_coverage", "citation_coverage", "source_agreement", "source_quality", "source_independence_proxy"].map(key => <p key={key}>{label(key)} <strong>{Math.round(Number(flow.metrics[key] ?? 0) * 100)}%</strong></p>)}</div>
        {["Executive Summary", "Background", "Key Findings", "Evidence Analysis", "Conflicting Evidence", "Conclusion"].map(section => {
          const sentences = flow.draft.sentences?.filter(s => s.section === section) ?? [];
          return sentences.length ? <div key={section}><h3>{label(section)}</h3>{sentences.map((s, i) => <p key={i}>{s.text} <a href={`#claim-${s.claim_id}`}>[หลักฐาน]</a> {s.source_ids.map(id => <a key={id} href={`#source-${id}`}>[{flow.sources.findIndex(source => source.id === id) + 1}] </a>)}</p>)}</div> : null;
        })}
      </section>}
      <section className="flow-card"><h2>แหล่งข้อมูลและเอกสารอ้างอิง</h2>
        <ol>{flow.sources.map(source => <li key={source.id} id={`source-${source.id}`}>
          <SourceLink source={source} /><p className="muted">{source.authors.join(", ") || "ไม่พบข้อมูลผู้เขียน"} · {source.provider} · {label(source.chunk_ref ?? "")} · สืบค้นเมื่อ {new Date(`${source.retrieved_at}Z`).toLocaleString("th-TH")}</p>
          <details><summary>ข้อความจากแหล่งข้อมูลและผลการวิเคราะห์</summary><blockquote>{source.content}</blockquote>
            {flow.papers.filter(p => p.source_id === source.id).map(p => <div key={p.id}>
              {["objective", "methodology", "dataset"].map(key => {
                const value = p.summary[key as "objective" | "methodology" | "dataset"];
                return <p key={key}><strong>{label(key)}</strong>: {value?.text ?? "ไม่ได้ระบุไว้อย่างชัดเจนในบทคัดย่อ"}</p>;
              })}
              {p.summary.findings.map((f, i) => <p key={i}>{f.text}<br /><q>{f.quote}</q></p>)}
              <p><strong>การตีความโดย AI</strong>: {p.summary.interpretation || "ไม่มี"}</p>
            </div>)}
          </details>
        </li>)}</ol>
      </section>
      <section className="flow-card"><h2>ข้อจำกัด</h2><ul>{flow.limitations.map((item, i) => <li key={i}>{translateMessage(item)}</li>)}</ul></section>
    </>}
  </div>;
}
