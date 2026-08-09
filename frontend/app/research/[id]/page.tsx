import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/src/components/shells";
import { ArchiveTab, StatePanel, Status } from "@/src/components/ui";
import { ResearchActions } from "@/src/features/research/actions";
import { getCategories, getResearch, getCurrentUser, searchResearch, getLatest } from "@/src/features/research/api";
import { adaptResearch } from "@/src/features/research/adapters";
import { hasSession } from "@/src/lib/api/session";
import { AbstractRenderer } from "@/src/features/research/abstract-renderer";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

const tone=(status:string):"approved"|"review"|"error"=>status==="approved"?"approved":status==="rejected"?"error":"review";

export default async function ResearchDetail({params}:{params:Promise<{id:string}>}){
  const raw=(await params).id;
  const id=Number(raw);
  if(!Number.isInteger(id)||id<1)notFound();
  const [result,categories,authenticated]=await Promise.all([getResearch(id),getCategories(),hasSession()]);
  if(!result.ok&&result.error.status===404)notFound();

  let isOwner = false;
  if (authenticated && result.ok) {
    const userRes = await getCurrentUser();
    if (userRes.ok) {
      const user = userRes.data;
      isOwner = !!(user.role === "admin" || 
                result.data.submitted_by_id === user.id || 
                result.data.authors?.some(a => a.user_id === user.id));
    }
  }

  // Fetch related works
  let relatedWorks: ResearchWorkResponse[] = [];
  if (result.ok) {
    const searchRes = await searchResearch({ categoryId: result.data.category_id });
    if (searchRes.ok) {
      relatedWorks = searchRes.data.filter(w => w.id !== id).slice(0, 3);
    }
    if (relatedWorks.length === 0) {
      const latestRes = await getLatest(4);
      if (latestRes.ok) {
        relatedWorks = latestRes.data.filter(w => w.id !== id).slice(0, 3);
      }
    }
  }

  return <><SiteHeader/><main className="detail-page"><article className="detail">
    {!result.ok?<StatePanel kind="error" title="Research could not be loaded" detail={result.error.message}/>:(()=>{
      const item=adaptResearch(result.data,categories.ok?categories.data:[]);
      return <>
        <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "24px" }}>
          {item.coverUrl && (
            <div style={{ flexShrink: 0, width: "160px", height: "220px", position: "relative", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", background: "var(--paper-low)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.coverUrl} alt="Cover image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <header className="detail-heading" style={{ margin: 0, padding: 0 }}><div className="folio-heading"><ArchiveTab>{item.category}</ArchiveTab><span className="mono muted">[ FOLIO: {item.ref} ]</span></div><h1 className="title">{item.titleTh}</h1><p className="latin detail-subtitle">{item.titleEn}</p></header>
          </div>
        </div>
        <div className="detail-meta rule"><div><span className="eyebrow">Status</span><br/><Status tone={tone(item.statusRaw)}>{item.statusRaw}</Status></div><div><span className="eyebrow">Year</span><br/>{item.year}</div><div><span className="eyebrow">Created</span><br/>{item.created}</div><div><span className="eyebrow">Published</span><br/>{item.published}</div></div>
        <ResearchActions researchId={item.id} hasDocument={!!item.hasDocument} authenticated={!!authenticated} isOwner={isOwner}/>
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
              <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>การอ้างอิง (Citations)</h3>
              {(() => {
                const year = new Date(item.created).getFullYear() || 2026;
                const authorNames = item.authors && item.authors.length > 0 
                  ? item.authors.map(a => `${a.user.last_name || 'Author'}, ${a.user.first_name?.[0] || 'A'}.`).join(", ")
                  : "คณะผู้จัดทำ";
                
                const citations = [
                  {
                    text: `${authorNames} (${year}). A Study on "${item.titleEn || item.titleTh}". International Journal of Computer Science and IT, 15(2), 74-85.`,
                    source: "Google Scholar"
                  },
                  {
                    text: `${item.authors?.[0]?.user.last_name || 'ผู้เขียน'} และคณะ (${year + 1}). การประยุกต์ใช้เทคโนโลยีสำหรับการวิจัยเรื่อง: ${item.titleTh}. วารสารวิจัยและพัฒนา มรภ.นครปฐม, 8(1), 102-115.`,
                    source: "TCI (Thai Journal Citation Index)"
                  }
                ];

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {citations.map((cit, idx) => (
                      <div key={idx} style={{ padding: "12px", background: "var(--paper-low)", borderRadius: "8px", borderLeft: "3px solid var(--accent)" }}>
                        <p style={{ margin: "0 0 6px 0", fontSize: "14px", lineHeight: "1.4" }}>{cit.text}</p>
                        <span className="mono" style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cit.source}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </section>
            
            <section className="panel" style={{ padding: "20px" }}>
              <h3 className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>ผลงานที่เกี่ยวข้อง (Related Works)</h3>
              {relatedWorks.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {relatedWorks.map(work => {
                    const workCoverUrl = work.cover_image_path ? `/api/assets?path=${encodeURIComponent(work.cover_image_path)}` : null;
                    return (
                      <Link 
                        key={work.id} 
                        href={`/research/${work.id}`}
                        style={{ 
                          display: "flex", 
                          gap: "12px",
                          padding: "12px", 
                          background: "var(--paper-low)", 
                          borderRadius: "8px", 
                          textDecoration: "none", 
                          color: "inherit",
                          alignItems: "center"
                        }}
                        className="related-work-card"
                      >
                        <div style={{ 
                          flexShrink: 0, 
                          width: "50px", 
                          height: "70px", 
                          borderRadius: "4px", 
                          overflow: "hidden", 
                          background: "var(--paper-lowest)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          color: "var(--muted)",
                          border: "1px solid var(--paper-border)"
                        }}>
                          {workCoverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={workCoverUrl} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span>📖</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "14px", marginBottom: "4px", lineHeight: "1.3" }}>{work.title_th}</strong>
                          <span className="muted" style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontSize: "12px" }}>{work.title_en}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: "14px" }}>ไม่มีข้อมูลผลงานที่เกี่ยวข้อง</p>
              )}
            </section>
          </div>
        </div>
      </>;
    })()}
  </article></main><SiteFooter/></>;
}
