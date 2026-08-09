"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/Toast";

export function AdminReviewDecision({ researchId, currentStatus }: { researchId: number; currentStatus: string }) {
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { success, error, warning } = useToast();

  async function decide(decision: "approved" | "rejected" | "needs_revision", label: string) {
    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      error("กรุณากรอกความคิดเห็นก่อนบันทึกการประเมิน");
      return;
    }

    try {
      setPending(true);
      const response = await fetch(`/api/research/${researchId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: trimmedComment, status_result: decision }),
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent(`/admin/reviews/${researchId}`)}`);
        return;
      }
      if (response.status === 403) {
        warning("บัญชีของคุณไม่มีสิทธิ์ในการตรวจประเมินผลงานวิจัยนี้");
        return;
      }
      if (!response.ok) {
        error(body.error?.message ?? "ไม่สามารถบันทึกผลการประเมินได้ในขณะนี้");
        return;
      }

      success(`บันทึกผลการประเมินผลงานสำเร็จ: ${label}`);
      setComment("");
      router.refresh();
    } catch {
      error("ไม่สามารถเชื่อมต่อระบบประเมินได้ในขณะนี้");
    } finally {
      setPending(false);
    }
  }

  const statusLabel = 
    currentStatus === "approved" ? "อนุมัติแล้ว (Approved)" :
    currentStatus === "rejected" ? "ไม่อนุมัติ (Rejected)" :
    currentStatus === "needs_revision" ? "ส่งกลับแก้ไข (Needs Revision)" : "รอตรวจสอบ (Pending)";

  return (
    <section className="admin-review-decision">
      <div className="admin-current-status"><span>สถานะปัจจุบัน</span><strong>{statusLabel}</strong></div>
      <label htmlFor="admin-review-comment">ความคิดเห็นสำหรับผู้จัดทำ (Review Comments)</label>
      <textarea id="admin-review-comment" value={comment} onChange={(event) => { setComment(event.target.value); }} placeholder="พิมพ์ข้อเสนอแนะ แนวทางปรับปรุง หรือเหตุผลประกอบการตัดสินใจที่นี่…" disabled={pending} />
      <div className="admin-decision-actions">
        <button className="approve" type="button" disabled={pending} onClick={() => decide("approved", "อนุมัติ") }><CheckCircle2 size={17} />อนุมัติ</button>
        <button type="button" disabled={pending} onClick={() => decide("needs_revision", "ส่งกลับให้แก้ไข")}><RotateCcw size={17} />ส่งกลับให้แก้ไข</button>
        <button className="reject" type="button" disabled={pending} onClick={() => decide("rejected", "ไม่อนุมัติ")}><XCircle size={17} />ไม่อนุมัติ</button>
      </div>
    </section>
  );
}
