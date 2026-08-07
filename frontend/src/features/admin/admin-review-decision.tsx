"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

export function AdminReviewDecision() {
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  function decide(label: string) {
    setMessage(comment.trim() ? `${label} — บันทึกในโหมดตัวอย่าง Frontend แล้ว` : "กรุณากรอกความคิดเห็นก่อนเลือกผลการตรวจ");
  }
  return (
    <section className="admin-review-decision">
      <div className="admin-current-status"><span>Current Status</span><strong>รอตรวจสอบ (Pending Review)</strong></div>
      <label htmlFor="admin-review-comment">ความคิดเห็นสำหรับผู้จัดทำ (Review Comments)</label>
      <textarea id="admin-review-comment" value={comment} onChange={(event) => { setComment(event.target.value); setMessage(""); }} placeholder="พิมพ์ข้อเสนอแนะ แนวทางปรับปรุง หรือเหตุผลประกอบการตัดสินใจที่นี่…" />
      <div className="admin-decision-actions"><button className="approve" type="button" onClick={() => decide("อนุมัติ") }><CheckCircle2 size={17} />อนุมัติ</button><button type="button" onClick={() => decide("ส่งกลับให้แก้ไข")}><RotateCcw size={17} />ส่งกลับให้แก้ไข</button><button className="reject" type="button" onClick={() => decide("ไม่อนุมัติ")}><XCircle size={17} />ไม่อนุมัติ</button></div>
      {message && <p className="admin-review-message" role="status">{message}</p>}
      <small>หมายเหตุ: การตัดสินใจหน้านี้เป็น Frontend preview และยังไม่ส่งไป Backend</small>
    </section>
  );
}
