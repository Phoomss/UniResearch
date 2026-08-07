import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { adminResearchSamples } from "@/src/features/admin/admin-data";

export default function AdminReviewQueuePage() {
  const pending = adminResearchSamples.filter((item) => item.status === "pending");
  return <main className="admin-main"><header className="admin-review-queue-heading"><div><p><ClipboardList size={19} /> Review Queue</p><h1>งานรอตรวจสอบ</h1></div><dl><div><dt>{pending.length}</dt><dd>รอตรวจสอบ</dd></div><div><dt>5</dt><dd>ต้องแก้ไข</dd></div><div><dt>28</dt><dd>อนุมัติแล้ว</dd></div></dl></header><div className="admin-review-tabs"><button className="active">รอตรวจสอบ [ {pending.length} ]</button><button>ต้องแก้ไข [ 5 ]</button><button>อนุมัติแล้ว [ 28 ]</button></div><section className="admin-review-list">{pending.map((item) => <article key={item.id}><span className="admin-review-node" /><div className="admin-review-card-meta"><span className="admin-category-tag">{item.category}</span><code>{item.ref}</code><small>[ Submitted: {item.updated} ]</small></div><h2>{item.title}</h2><p>{item.abstract}</p><footer><span className="admin-author-avatar">{item.author.slice(0, 2)}</span><strong>{item.author}</strong><Link href={`/admin/reviews/${item.id}`}><ClipboardList size={17} />ตรวจสอบผลงาน</Link></footer></article>)}</section></main>;
}
