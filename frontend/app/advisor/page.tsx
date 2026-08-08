import Link from "next/link";
import { BookOpen, CheckCircle2, ClipboardClock, Eye, FilePlus2, RotateCcw } from "lucide-react";
import { getCategories, getCurrentUser, getMyResearch, getPendingResearch, searchResearch } from "@/src/features/research/api";

export default async function AdvisorOverview() {
  const [allResult, pendingResult, mineResult, categoriesResult, userResult] = await Promise.all([
    searchResearch({}),
    getPendingResearch(),
    getMyResearch(),
    getCategories(),
    getCurrentUser(),
  ]);
  const all = allResult.ok ? allResult.data : [];
  const pending = pendingResult.ok ? pendingResult.data : [];
  const mine = mineResult.ok ? mineResult.data : [];
  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const userId = userResult.ok ? userResult.data.id : -1;
  const reviewed = all.filter((item) => item.reviews?.some((review) => review.reviewer_id === userId));
  const revision = all.filter((item) => item.status === "needs_revision" || item.status === "revision_needed");
  const cards = [
    { label: "งานรอตรวจ", value: pending.length, detail: "รายการในคิวส่วนกลาง", icon: ClipboardClock, featured: true },
    { label: "ตรวจแล้วโดยฉัน", value: reviewed.length, detail: "ผลงานที่มีความคิดเห็นของคุณ", icon: CheckCircle2 },
    { label: "ส่งกลับแก้ไข", value: revision.length, detail: "ผลงานที่รอการปรับปรุง", icon: RotateCcw },
    { label: "ผลงานที่ฉันส่ง", value: mine.length, detail: "ส่งหรือเป็นผู้เขียน", icon: BookOpen },
  ];

  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-heading-actions">
        <div><p>พื้นที่อาจารย์ที่ปรึกษา <span>ภาพรวมการตรวจประเมิน</span></p><h1>แดชบอร์ด Advisor</h1></div>
        <div><Link className="admin-primary-action" href="/advisor/reviews"><Eye size={17} />เปิดคิวตรวจ</Link><Link className="admin-secondary-action" href="/advisor/new"><FilePlus2 size={17} />ส่งผลงานใหม่</Link></div>
      </header>

      <section className="admin-metric-grid advisor-metric-grid">
        {cards.map(({ label, value, detail, icon: Icon, featured }) => (
          <article className={featured ? "featured" : ""} key={label}><div><span>{label}</span><Icon size={18} /></div><strong>{value.toLocaleString()}</strong><small>[ {detail} ]</small></article>
        ))}
      </section>

      <div className="admin-dashboard-columns">
        <section className="admin-attention">
          <header><h2><ClipboardClock size={22} /> งานที่ต้องตรวจประเมิน</h2><span>[ {pending.length} รายการ ]</span></header>
          {pending.length === 0 ? <div className="admin-empty-row">ไม่มีผลงานรอตรวจประเมิน</div> : pending.slice(0, 5).map((item) => (
            <article key={item.id}><div><p><span>รอตรวจสอบ</span> [ID: {item.id}]</p><h3>{item.title_th || item.title_en}</h3><small>{categories.find((category) => category.id === item.category_id)?.category_name || "ไม่ระบุหมวดหมู่"} • อัปเดต {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.updated_at))}</small></div><Link href={`/advisor/reviews/${item.id}`}>ตรวจประเมิน</Link></article>
          ))}
          <Link className="admin-view-all" href="/advisor/reviews">ดูคิวตรวจทั้งหมด →</Link>
        </section>

        <aside className="admin-dashboard-insights">
          <section><h3>ภาพรวมสถานะผลงาน</h3><ul>
            <li><i className="published" />อนุมัติแล้ว <strong>{all.filter((item) => item.status === "approved").length}</strong></li>
            <li><i className="pending" />รอตรวจสอบ <strong>{pending.length}</strong></li>
            <li><i className="draft" />ส่งกลับแก้ไข <strong>{revision.length}</strong></li>
            <li><i />ไม่อนุมัติ <strong>{all.filter((item) => item.status === "rejected").length}</strong></li>
          </ul></section>
          <section><h3>ขอบเขตสิทธิ์ปัจจุบัน</h3><p className="muted" style={{ lineHeight: 1.7, margin: 0 }}>คิวนี้เป็นคิวส่วนกลาง Advisor สามารถตรวจผลงานทุกชิ้นในระบบได้ และยังไม่มีระบบมอบหมายผู้ตรวจรายบุคคล</p></section>
        </aside>
      </div>
    </main>
  );
}
