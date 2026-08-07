import Link from "next/link";
import type { FavoriteResponse } from "@/src/lib/api/types";

export function SavedResearchList({ items }: { items: FavoriteResponse[] }) {
  return (
    <div className="saved-list">
      {items.map(item => (
        <article className="saved-row" key={item.id}>
          <div><span className="eyebrow">[ ผลงานวิจัยที่บันทึกไว้ ]</span><h2><Link prefetch={false} href={`/research/${item.research_id}`}>ผลงานวิจัย #{item.research_id}</Link></h2></div>
          <div className="saved-meta"><span className="mono">ID {item.research_id}</span><span>บันทึกเมื่อ {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.saved_at))}</span></div>
        </article>
      ))}
    </div>
  );
}
