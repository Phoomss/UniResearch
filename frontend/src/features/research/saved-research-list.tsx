import Link from "next/link";
import type { FavoriteResponse } from "@/src/lib/api/types";

export function SavedResearchList({items}:{items:FavoriteResponse[]}){
  return <div className="saved-list">{items.map(item=><article className="saved-row" key={item.id}>
    <div><span className="eyebrow">[ SAVED RESEARCH ]</span><h2><Link prefetch={false} href={`/research/${item.research_id}`}>Research #{item.research_id}</Link></h2></div>
    <div className="saved-meta"><span className="mono">ID {item.research_id}</span><span>Saved {new Intl.DateTimeFormat("en-GB",{dateStyle:"medium"}).format(new Date(item.saved_at))}</span></div>
  </article>)}</div>;
}
