import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/src/components/shells";
import { ArchiveTab, StatePanel, Status } from "@/src/components/ui";
import { ResearchActions } from "@/src/features/research/actions";
import { getCategories, getResearch } from "@/src/features/research/api";
import { adaptResearch } from "@/src/features/research/adapters";
import { hasSession } from "@/src/lib/api/session";
import { AbstractRenderer } from "@/src/features/research/abstract-renderer";

const tone=(status:string):"approved"|"review"|"error"=>status==="approved"?"approved":status==="rejected"?"error":"review";

export default async function ResearchDetail({params}:{params:Promise<{id:string}>}){
  const raw=(await params).id;
  const id=Number(raw);
  if(!Number.isInteger(id)||id<1)notFound();
  const [result,categories,authenticated]=await Promise.all([getResearch(id),getCategories(),hasSession()]);
  if(!result.ok&&result.error.status===404)notFound();
  return <><SiteHeader/><main className="detail-page"><article className="detail">
    {!result.ok?<StatePanel kind="error" title="Research could not be loaded" detail={result.error.message}/>:(()=>{
      const item=adaptResearch(result.data,categories.ok?categories.data:[]);
      return <>
        <header className="detail-heading"><div className="folio-heading"><ArchiveTab>{item.category}</ArchiveTab><span className="mono muted">[ FOLIO: {item.ref} ]</span></div><h1 className="title">{item.titleTh}</h1><p className="latin detail-subtitle">{item.titleEn}</p></header>
        <div className="detail-meta rule"><div><span className="eyebrow">Status</span><br/><Status tone={tone(item.statusRaw)}>{item.statusRaw}</Status></div><div><span className="eyebrow">Year</span><br/>{item.year}</div><div><span className="eyebrow">Created</span><br/>{item.created}</div><div><span className="eyebrow">Published</span><br/>{item.published}</div></div>
        <ResearchActions researchId={item.id} hasDocument={item.hasDocument} authenticated={authenticated}/>
        <div className="detail-body"><section><h2 className="section-title">Abstract</h2><AbstractRenderer abstract={item.abstract}/></section><section><h2 className="eyebrow">Research metadata</h2><dl className="metadata-list"><div><dt>Department</dt><dd>{item.department}</dd></div><div><dt>Work type</dt><dd>{item.workType}</dd></div><div><dt>Views</dt><dd>{item.views.toLocaleString()}</dd></div><div><dt>Downloads</dt><dd>{item.downloads.toLocaleString()}</dd></div></dl></section><section><h2 className="eyebrow">Keywords</h2><div className="keyword-list">{item.keywords.length?item.keywords.map(x=><ArchiveTab key={x}>{x}</ArchiveTab>):<span className="muted">No keywords were supplied.</span>}</div></section><section className="state"><p>Author names, advisors, citations, related works, review history, and PDF preview are omitted because the backend detail response does not provide them.</p></section></div>
      </>;
    })()}
  </article></main><SiteFooter/></>;
}
