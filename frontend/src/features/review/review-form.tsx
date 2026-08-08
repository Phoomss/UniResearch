"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, Field, Select, Textarea } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Decision = "approved" | "rejected" | "needs_revision";

export function ReviewForm({ researchId }: { researchId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [decision, setDecision] = useState<Decision>("approved");
  const { success, error, warning } = useToast();

  function requestConfirmation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setDecision(form.get("status_result") as Decision);
    setIsOpen(true);
  }

  async function confirm() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const comment = String(data.get("comment_text") ?? "").trim();
    if (!comment) {
      setIsOpen(false);
      error("กรุณากรอกความคิดเห็นประกอบการประเมิน");
      return;
    }
    setPending(true);
    setIsOpen(false);
    try {
      const response = await fetch(`/api/research/${researchId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: comment, status_result: decision }),
      });
      const body = await response.json().catch(() => ({}));
      if (response.status===401) { 
        window.location.assign(`/login?next=${encodeURIComponent(`/advisor/reviews/${researchId}`)}`); 
        return; 
      }
      if (response.status===403) { 
        warning("บัญชีของคุณไม่มีสิทธิ์ในการตรวจประเมินผลงานวิจัยนี้"); 
        return; 
      }
      if (!response.ok) { 
        error(body.error?.message ?? "ไม่สามารถบันทึกผลการประเมินได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"); 
        return; 
      }
      
      const statusTh = body.status_result === "approved" ? "อนุมัติ" : body.status_result === "rejected" ? "ไม่อนุมัติ" : "ส่งกลับแก้ไข";
      success(`บันทึกผลการประเมินผลงานสำเร็จ (รหัสอ้างอิงการประเมิน: #${body.id}, สถานะใหม่: ${statusTh})`);
      form.reset();
    } catch {
      error("ไม่สามารถเชื่อมต่อระบบประเมินได้ในขณะนี้ ความคิดเห็นของคุณจะยังคงอยู่ในหน้านี้จนกว่าคุณจะปิดหรือออกจากหน้านี้");
    } finally { 
      setPending(false); 
    }
  }


  return (
    <>
      <form ref={formRef} className="panel review-form" onSubmit={requestConfirmation} aria-describedby="review-contract-note">
        <p className="eyebrow">[ ดำเนินการตรวจประเมินผลงานวิจัย ]</p>
        <h2 className="section-title">บันทึกผลการตรวจประเมิน</h2>
        <Field label="ผลการประเมิน" required>
          <Select name="status_result" required defaultValue="approved">
            <option value="approved">อนุมัติ (Approve)</option>
            <option value="rejected">ไม่อนุมัติ (Reject)</option>
            <option value="needs_revision">ส่งกลับแก้ไข (Request revision)</option>
          </Select>
        </Field>
        <Field label="ความคิดเห็นของผู้ประเมิน" required>
          <Textarea name="comment_text" required minLength={1} disabled={pending} />
        </Field>
        <p id="review-contract-note" className="muted">หมายเหตุ: คะแนน การมอบหมายคิว และประวัติการประเมินย้อนหลัง ยังไม่เปิดใช้งานในระบบหลังบ้าน</p>
        <Button type="submit" disabled={pending}>{pending ? "กำลังบันทึกผลการประเมิน…" : "ยืนยันผลการประเมิน"}</Button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="modal-content"
            >
              <div className={`modal-header-icon ${decision}`}>
                {decision === "approved" && <CheckCircle2 size={32} />}
                {decision === "rejected" && <XCircle size={32} />}
                {decision === "needs_revision" && <AlertTriangle size={32} />}
              </div>
              <h2 className="modal-title">
                {decision === "approved" && "ยืนยันการอนุมัติผลงาน"}
                {decision === "rejected" && "ยืนยันการปฏิเสธผลงาน"}
                {decision === "needs_revision" && "ยืนยันการส่งกลับแก้ไข"}
              </h2>
              <p className="modal-text">
                {decision === "approved" && "การดำเนินการนี้จะอนุมัติผลงานวิจัยในระบบและเผยแพร่ผลงานสู่คลังทันที"}
                {decision === "rejected" && "การดำเนินการนี้จะกำหนดสถานะผลงานวิจัยเป็นไม่อนุมัติในระบบทันที"}
                {decision === "needs_revision" && "การดำเนินการนี้จะส่งผลงานวิจัยนี้กลับคืนสู่นักศึกษาเพื่อให้ดำเนินการแก้ไขทันที"}
              </p>
              <div className="modal-buttons">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>ยกเลิก</Button>
                <Button type="button" onClick={confirm}>ยืนยัน</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
