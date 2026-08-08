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
        <div className="detail-body">
          <section><h2 className="section-title">Abstract</h2><AbstractRenderer abstract={item.abstract}/></section>
          <section>
            <h2 className="eyebrow">Research metadata</h2>
            <dl className="metadata-list">
              <div><dt>Department</dt><dd>{item.department}</dd></div>
              <div><dt>Work type</dt><dd>{item.workType}</dd></div>
              <div><dt>Views</dt><dd>{item.views.toLocaleString()}</dd></div>
              <div><dt>Downloads</dt><dd>{item.downloads.toLocaleString()}</dd></div>
            </dl>
          </section>
          <section>
            <h2 className="eyebrow">Keywords</h2>
            <div className="keyword-list">{item.keywords.length?item.keywords.map(x=><ArchiveTab key={x}>{x}</ArchiveTab>):<span className="muted">No keywords were supplied.</span>}</div>
          </section>

          {/* Authors & Advisors Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "32px" }}>
            <section className="panel" style={{ padding: "20px" }}>
              <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>ผู้จัดทำ (Authors)</h3>
              {item.authors && item.authors.length > 0 ? (
                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                  {item.authors.map(a => (
                    <li key={a.id} style={{ marginBottom: "8px" }}>
                      <strong>{a.user.first_name} {a.user.last_name}</strong>
                      <span className="muted" style={{ fontSize: "13px", display: "block" }}>{a.user.email} {a.user.student_id ? `• รหัสนักศึกษา: ${a.user.student_id}` : ""}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">ไม่พบข้อมูลผู้จัดทำ</p>
              )}
            </section>

            <section className="panel" style={{ padding: "20px" }}>
              <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>อาจารย์ที่ปรึกษา (Advisors)</h3>
              {item.advisors && item.advisors.length > 0 ? (
                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                  {item.advisors.map(adv => (
                    <li key={adv.id} style={{ marginBottom: "8px" }}>
                      <strong>{adv.user.first_name} {adv.user.last_name}</strong>
                      <span className="muted" style={{ fontSize: "13px", display: "block" }}>{adv.user.email} {adv.user.department ? `• ภาควิชา: ${adv.user.department}` : ""}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">ไม่พบข้อมูลอาจารย์ที่ปรึกษา</p>
              )}
            </section>
          </div>

          {/* Review History Section */}
          <section className="panel" style={{ marginTop: "32px", padding: "24px" }}>
            <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "20px" }}>ประวัติการประเมิน (Review History)</h3>
            {item.reviews && item.reviews.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {item.reviews.map(rev => (
                  <div key={rev.id} style={{ padding: "16px", background: "var(--paper-low)", borderRadius: "8px", borderLeft: `4px solid ${rev.status_result === "approved" ? "#10b981" : rev.status_result === "rejected" ? "#ef4444" : "#f59e0b"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                      <strong>{rev.reviewer ? `${rev.reviewer.first_name} ${rev.reviewer.last_name}` : `ผู้ประเมิน #${rev.reviewer_id}`}</strong>
                      <Status tone={tone(rev.status_result)}>{rev.status_result}</Status>
                    </div>
                    <p style={{ margin: "0 0 8px 0", fontSize: "15px" }}>{rev.comment_text}</p>
                    <small className="muted">{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(rev.created_at))}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">ไม่มีประวัติการประเมินผลงานวิจัยนี้</p>
            )}
          </section>

          {/* Citations & Related Works */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "32px" }}>
            <section className="panel" style={{ padding: "20px" }}>
              <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "8px" }}>การอ้างอิง (Citations)</h3>
              <p className="muted" style={{ margin: 0, fontSize: "14px" }}>ไม่มีข้อมูลการอ้างอิง (ระบบอยู่ในระหว่างการพัฒนา)</p>
            </section>
            <section className="panel" style={{ padding: "20px" }}>
              <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "8px" }}>ผลงานที่เกี่ยวข้อง (Related Works)</h3>
              <p className="muted" style={{ margin: 0, fontSize: "14px" }}>ไม่มีข้อมูลผลงานที่เกี่ยวข้อง (ระบบอยู่ในระหว่างการพัฒนา)</p>
            </section>
          </div>
        </div>
      </>;
    })()}
  </article></main><SiteFooter/></>;
}
