"use client";

import Link from "next/link";
import { useState } from "react";
import { Status, Button } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";
import type { ResearchWorkResponse } from "@/src/lib/api/types";
import { Edit2, Trash2, Eye } from "lucide-react";

export function StudentResearchList({ initialItems }: { initialItems: ResearchWorkResponse[] }) {
  const [items, setItems] = useState<ResearchWorkResponse[]>(initialItems);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { success, error } = useToast();

  async function handleDelete(id: number) {
    if (!window.confirm("คุณต้องการลบผลงานวิจัยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/research/${id}`, { method: "DELETE" });
      if (response.ok) {
        success("ลบผลงานวิจัยเรียบร้อยแล้ว");
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        const body = await response.json().catch(() => ({}));
        error(body.error?.message ?? "ไม่สามารถลบผลงานวิจัยได้");
      }
    } catch {
      error("ไม่สามารถเชื่อมต่อบริการลบผลงานวิจัยได้");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="saved-list">
      {items.map(item => {
        const tone = item.status === "approved" ? "approved" : item.status === "rejected" ? "error" : "review";
        return (
          <article className="saved-row" key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "var(--paper-low)", borderRadius: "8px", marginBottom: "16px" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--mulberry)" }}>[ ผลงานวิจัยของฉัน ]</span>
              <h2 style={{ fontSize: "18px", marginTop: "4px", fontWeight: "600" }}>
                <Link prefetch={false} href={`/research/${item.id}`}>
                  {item.title_th || item.title_en}
                </Link>
              </h2>
              <p className="latin detail-subtitle" style={{ fontSize: "14px", marginTop: "2px", color: "var(--muted)" }}>{item.title_en}</p>
              <div className="saved-meta" style={{ marginTop: "12px", display: "flex", gap: "16px", fontSize: "13px" }}>
                <span className="mono">ID: {item.id}</span>
                {item.work_type && <span>ประเภท: {item.work_type}</span>}
                {item.academic_year && <span>ปีการศึกษา: {item.academic_year}</span>}
                <span>ส่งเมื่อ: {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.created_at))}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Status tone={tone}>{item.status}</Status>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link className="btn btn-ghost" href={`/research/${item.id}`} title="ดูรายละเอียด" style={{ padding: "8px" }}>
                  <Eye size={16} />
                </Link>
                <Link className="btn btn-secondary" href={`/student/research/edit/${item.id}`} title="แก้ไข" style={{ padding: "8px" }}>
                  <Edit2 size={16} />
                </Link>
                <Button variant="ghost" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} title="ลบ" style={{ padding: "8px", color: "var(--red, #ef4444)" }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
