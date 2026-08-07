"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Status } from "@/src/components/ui";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

export function SubmittedResearchList({ idsString }: { idsString: string }) {
  const [items, setItems] = useState<ResearchWorkResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idsString) return;
    const ids = idsString.split(",").map(Number).filter(Boolean);
    if (ids.length === 0) return;

    setLoading(true);
    Promise.all(
      ids.map(id =>
        fetch(`/api/research/${id}`)
          .then(res => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    )
      .then(results => {
        const valid = results.filter(Boolean) as ResearchWorkResponse[];
        // Sort descending by id to show latest submissions first
        valid.sort((a, b) => b.id - a.id);
        setItems(valid);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idsString]);

  if (!idsString) return null;

  return (
    <div className="submitted-section" style={{ marginTop: "32px", borderTop: "1px dashed #cdc3d050", paddingTop: "32px" }}>
      <h2 className="section-title" style={{ fontSize: "20px", marginBottom: "8px" }}>ผลงานวิจัยของคุณ (My Submissions)</h2>
      <p className="muted" style={{ marginBottom: "20px" }}>รายการผลงานวิจัยที่คุณส่งเข้าระบบจากเบราว์เซอร์นี้ เพื่อติดตามความคืบหน้าและสถานะการตรวจสอบ</p>
      
      {loading ? (
        <div className="state state-loading">
          <div className="skeleton" />
        </div>
      ) : items.length === 0 ? (
        <p className="muted">ไม่พบข้อมูลผลงานวิจัยที่คุณส่ง</p>
      ) : (
        <div className="saved-list">
          {items.map(item => {
            const tone = item.status === "approved" ? "approved" : item.status === "rejected" ? "error" : "review";
            return (
              <article className="saved-row" key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--mulberry)" }}>[ ผลงานวิจัยของฉัน ]</span>
                  <h2 style={{ fontSize: "16px", marginTop: "4px" }}>
                    <Link prefetch={false} href={`/research/${item.id}`}>
                      {item.title_th || item.title_en}
                    </Link>
                  </h2>
                  <div className="saved-meta" style={{ marginTop: "8px" }}>
                    <span className="mono">ID {item.id}</span>
                    <span>ประเภท: {item.work_type || "ไม่ระบุ"}</span>
                  </div>
                </div>
                <div style={{ marginLeft: "16px" }}>
                  <Status tone={tone}>{item.status}</Status>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
