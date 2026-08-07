import Link from "next/link";
import type { ResearchWorkResponse } from "@/src/lib/api/types";
import { Status } from "@/src/components/ui";

export function SavedResearchList({ items }: { items: ResearchWorkResponse[] }) {
  return (
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
                {item.work_type && <span>ประเภท: {item.work_type}</span>}
                {item.academic_year && <span>ปีการศึกษา: {item.academic_year}</span>}
                <span>ส่งเมื่อ: {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.created_at))}</span>
              </div>
            </div>
            <div style={{ marginLeft: "16px" }}>
              <Status tone={tone}>{item.status}</Status>
            </div>
          </article>
        );
      })}
    </div>
  );
}
