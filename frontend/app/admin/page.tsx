import Link from "next/link";
import { AlertTriangle as AlertSquare, BookOpen, Download, Eye, FileClock, Users } from "lucide-react";
import { adminResearchSamples } from "@/src/features/admin/admin-data";
import { getStats } from "@/src/features/research/api";

export default async function AdminOverview() {
  const statsResult = await getStats();
  const stats = statsResult.ok ? statsResult.data : { total_users: 0, total_research_works: 0, total_views: 0, total_downloads: 0 };
  const cards = [
    { label: "ผลงานทั้งหมด", value: stats.total_research_works, detail: "Total Publications", icon: BookOpen },
    { label: "รอตรวจสอบ", value: adminResearchSamples.filter((item) => item.status === "pending").length, detail: "Pending Review", icon: FileClock, featured: true },
    { label: "ผู้ใช้งานทั้งหมด", value: stats.total_users, detail: "Active Researchers", icon: Users },
    { label: "การเข้าชมทั้งหมด", value: stats.total_views, detail: "Archive Views", icon: Eye },
    { label: "การดาวน์โหลดทั้งหมด", value: stats.total_downloads, detail: "Full-text Downloads", icon: Download, wide: true },
  ];

  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-dashboard-heading"><p><span /> Administrative Overview</p><h1>ภาพรวมระบบ</h1><div className="admin-heading-rule"><span>Monitoring research archival activity, user engagement, and pending reviews across the academic repository.</span></div></header>
      <section className="admin-metric-grid">{cards.map(({ label, value, detail, icon: Icon, featured, wide }) => <article className={`${featured ? "featured" : ""} ${wide ? "wide" : ""}`} key={label}><div><span>{label}</span><Icon size={18} /></div><strong>{value.toLocaleString()}</strong><small>[ {detail} ]</small></article>)}</section>
      <div className="admin-dashboard-columns">
        <section className="admin-attention"><header><h2><AlertSquare size={22} /> งานที่ต้องดำเนินการ</h2><span>[ Attention Required ]</span></header>{adminResearchSamples.filter((item) => item.status === "pending").slice(0, 3).map((item) => <article key={item.id}><div><p><span>Pending Review</span> [Ref: {item.ref}]</p><h3>{item.title}</h3><small>Submitted by: {item.author} • {item.updated}</small></div><Link href={`/admin/reviews/${item.id}`}>Review</Link></article>)}<Link className="admin-view-all" href="/admin/reviews">View all pending items →</Link></section>
        <aside className="admin-dashboard-insights"><section><h3>Status Distribution</h3><div className="admin-donut"><strong>94%</strong><span>Published</span></div><ul><li><i className="published" />Published <strong>{Math.max(stats.total_research_works - 2, 0).toLocaleString()}</strong></li><li><i className="pending" />Pending Review <strong>2</strong></li><li><i className="draft" />Drafts <strong>4</strong></li></ul></section><section><h3>Research by Academic Year</h3><div className="admin-mini-bars">{[35, 48, 42, 62, 74, 88].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div></section><section><h3>Popular Searches [ 30d ]</h3><div className="admin-keywords"><span>Machine Learning</span><span>การศึกษาปฐมวัย</span><span>Sustainability</span><span>Data Science</span><span>AI</span><span>Public Health</span></div></section></aside>
      </div>
    </main>
  );
}
