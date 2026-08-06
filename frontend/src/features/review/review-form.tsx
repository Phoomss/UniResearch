"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, Field, Select, Textarea } from "@/src/components/ui";

type Decision = "approved" | "rejected";
type FormStatus = { kind: "success" | "error" | "forbidden"; message: string } | null;

export function ReviewForm({ researchId }: { researchId: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);
  const [decision, setDecision] = useState<Decision>("approved");

  function requestConfirmation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);
    setDecision(form.get("status_result") as Decision);
    dialogRef.current?.showModal();
  }

  async function confirm() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const comment = String(data.get("comment_text") ?? "").trim();
    if (!comment) {
      dialogRef.current?.close();
      setStatus({kind:"error",message:"Please enter a review comment."});
      return;
    }
    setPending(true);
    dialogRef.current?.close();
    try {
      const response = await fetch(`/api/research/${researchId}/review`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({comment_text:comment,status_result:decision}),
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) { window.location.assign(`/login?next=${encodeURIComponent(`/advisor/reviews/${researchId}`)}`); return; }
      if (response.status === 403) { setStatus({ kind: "forbidden", message: "Your account is authenticated but is not permitted to review research." }); return; }
      if (!response.ok) { setStatus({ kind: "error", message: body.error?.message ?? "The review could not be saved. Please try again." }); return; }
      setStatus({ kind: "success", message: `Review #${body.id} was saved with status “${body.status_result}”.` });
      form.reset();
    } catch {
      setStatus({ kind: "error", message: "The review service is unavailable. Your comment remains in this page until you leave." });
    } finally { setPending(false); }
  }

  return (
    <>
    <form ref={formRef} className="panel review-form" onSubmit={requestConfirmation} aria-describedby="review-contract-note">
      <p className="eyebrow">[ Verified review action ]</p>
      <h2 className="section-title">Record a decision</h2>
      <Field label="Decision" required><Select name="status_result" required defaultValue="approved"><option value="approved">Approve</option><option value="rejected">Reject</option></Select></Field>
      <Field label="Reviewer comment" required><Textarea name="comment_text" required minLength={1} disabled={pending} /></Field>
      <p id="review-contract-note" className="muted">Only approval and rejection are exposed. Scoring, revision requests, queue assignment, and review history are not supported by the backend.</p>
      {status && <div className={`status-message ${status.kind}`} role={status.kind === "success" ? "status" : "alert"}>{status.message}</div>}
      <Button type="submit" disabled={pending}>{pending ? "Saving review…" : "Review decision"}</Button>
    </form>
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby="confirm-review-title">
      <h2 id="confirm-review-title" className="section-title">Confirm {decision === "approved" ? "approval" : "rejection"}</h2>
      <p>This immediately changes the backend research status to <strong>{decision}</strong>.</p>
      <div className="dialog-actions"><Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>Cancel</Button><Button type="button" onClick={confirm}>Confirm decision</Button></div>
    </dialog>
    </>
  );
}
