import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { ArchiveTab, StatePanel, Status } from "@/src/components/ui";
import { ResearchActions } from "@/src/features/research/actions";
import { adaptResearch } from "@/src/features/research/adapters";
import { getCategories, getResearch } from "@/src/features/research/api";
import { ReviewForm } from "@/src/features/review/review-form";
import { hasSession } from "@/src/lib/api/session";
import { AbstractRenderer } from "@/src/features/research/abstract-renderer";

export default async function ReviewWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const raw = (await params).id;
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) notFound();
  if (!await hasSession()) redirect(`/login?next=${encodeURIComponent(`/advisor/reviews/${id}`)}`);
  
  const [research, categories] = await Promise.all([getResearch(id), getCategories()]);
  if (!research.ok && research.error.status === 404) notFound();

  return (
    <DashboardShell active="02">
      <main className="dash-main">
        <p className="eyebrow">[ พื้นที่ตรวจประเมินสำหรับอาจารย์ที่ปรึกษา / ผู้ดูแลระบบ ]</p>
        <h1 className="title">ตรวจประเมินผลงานวิจัย</h1>
        {!research.ok ? (
          <StatePanel kind="error" title="ไม่สามารถเข้าถึงข้อมูลของชิ้นงานวิจัยได้" detail={research.error.message} />
        ) : (
          (() => {
            const item = adaptResearch(research.data, categories.ok ? categories.data : []);
            return (
              <div className="review-workspace">
                <article className="panel review-research">
                  <div className="folio-heading">
                    <ArchiveTab>{item.category}</ArchiveTab>
                    <span className="mono muted">{item.ref}</span>
                  </div>
                  <h2 className="section-title">{item.titleTh}</h2>
                  <p className="latin">{item.titleEn}</p>
                  <Status tone={item.status === "approved" ? "approved" : item.status === "rejected" ? "error" : "review"}>
                    {item.statusRaw}
                  </Status>
                  <section>
                    <h3>บทคัดย่อ</h3>
                    <AbstractRenderer abstract={item.abstract} />
                  </section>
                  <dl className="metadata-list">
                    <div>
                      <dt>ภาควิชา / คณะ</dt>
                      <dd>{item.department}</dd>
                    </div>
                    <div>
                      <dt>ปีการศึกษา</dt>
                      <dd>{item.year}</dd>
                    </div>
                  </dl>
                  <ResearchActions researchId={item.id} hasDocument={item.hasDocument} authenticated />
                </article>
                <ReviewForm researchId={item.id} />
              </div>
            );
          })()
        )}
      </main>
    </DashboardShell>
  );
}
