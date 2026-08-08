import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { StatePanel, Status } from "@/src/components/ui";
import { ResearchActions } from "@/src/features/research/actions";
import { adaptResearch } from "@/src/features/research/adapters";
import { getCategories, getResearch } from "@/src/features/research/api";
import { ReviewForm } from "@/src/features/review/review-form";
import { AbstractRenderer } from "@/src/features/research/abstract-renderer";

export default async function ReviewWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const raw = (await params).id;
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) notFound();

  const [research, categories] = await Promise.all([getResearch(id), getCategories()]);
  if (!research.ok && research.error.status === 404) notFound();

  return (
    <main className="admin-main admin-review-workspace">
      {!research.ok ? <StatePanel kind="error" title="ไม่สามารถเข้าถึงข้อมูลของชิ้นงานวิจัยได้" detail={research.error.message} /> : (() => {
        const rawItem = research.data;
        const item = adaptResearch(rawItem, categories.ok ? categories.data : []);
        return <>
          <header className="admin-review-document-heading">
            <div><p><span>{item.category}</span><code>ID: {item.ref}</code><Status tone={item.status === "approved" ? "approved" : item.status === "rejected" ? "error" : "review"}>{item.statusRaw}</Status></p><h1>{item.titleTh}</h1><h2>{item.titleEn}</h2></div>
            <dl><div><dt>วันที่ส่งผลงาน</dt><dd>{item.created}</dd></div><div><dt>ปีการศึกษา</dt><dd>{item.year}</dd></div></dl>
          </header>

          <div className="admin-review-layout">
            <div className="admin-review-content">
              <section className="admin-abstract"><h3>บทคัดย่อ (Abstract)</h3><AbstractRenderer abstract={item.abstract} /></section>
              <section className="admin-team">
                <header><h3>ผู้เกี่ยวข้องกับผลงาน</h3><span>[ ผู้เขียน {rawItem.authors?.length || 0} • ที่ปรึกษา {rawItem.advisors?.length || 0} ]</span></header>
                <div>
                  {rawItem.authors?.map((author) => <article key={`author-${author.id}`}><span>AU</span><div><strong>{`${author.user.first_name || ""} ${author.user.last_name || ""}`.trim() || author.user.email}</strong><small>{author.role_in_work === "primary" ? "ผู้วิจัยหลัก" : "ผู้วิจัยร่วม"}</small></div></article>)}
                  {rawItem.advisors?.map((advisor) => <article key={`advisor-${advisor.id}`}><span>AD</span><div><strong>{`${advisor.user.first_name || ""} ${advisor.user.last_name || ""}`.trim() || advisor.user.email}</strong><small>อาจารย์ที่ปรึกษา</small></div></article>)}
                  {!rawItem.authors?.length && !rawItem.advisors?.length && <p className="muted">ไม่พบข้อมูลผู้เกี่ยวข้อง</p>}
                </div>
              </section>
              <section className="admin-manuscript"><header><div><h3>ไฟล์ต้นฉบับ</h3><p>{item.hasDocument ? `เอกสารผลงาน ${item.ref}` : "ผลงานนี้ไม่มีไฟล์เอกสาร"}</p></div><ResearchActions researchId={item.id} hasDocument={item.hasDocument} authenticated /></header><div className="admin-document-preview"><FileText size={42} /><i /><i /><i /><span>{item.hasDocument ? "ใช้ปุ่มดาวน์โหลดเพื่อตรวจเอกสารฉบับเต็ม" : "ไม่มีไฟล์สำหรับตรวจสอบ"}</span></div></section>
            </div>
            <aside className="admin-review-sidebar">
              <ReviewForm researchId={item.id} />
              <section className="admin-review-history"><h3>ประวัติการตรวจสอบ</h3>{rawItem.reviews?.length ? [...rawItem.reviews].reverse().map((review) => <article key={review.id}><i /><strong>{review.status_result}</strong><small>{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(review.created_at))}</small><p>{review.comment_text}</p></article>) : <p className="muted">ยังไม่มีประวัติการตรวจประเมิน</p>}</section>
            </aside>
          </div>
        </>;
      })()}
    </main>
  );
}
