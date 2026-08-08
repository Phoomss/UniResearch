"use client";

import Link from "next/link";
import { Eye, FilePenLine, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AdminResearchRecord } from "./admin-data";

const statusLabels = {
  pending: "รอตรวจ (Pending)",
  approved: "ตีพิมพ์แล้ว (Published)",
  rejected: "ถูกปฏิเสธ (Rejected)",
  revision_needed: "ต้องแก้ไข (Revision)",
} as const;

export function AdminResearchManager({ records }: { records: AdminResearchRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const categories = [...new Set(records.map((item) => item.category))];
  const years = [...new Set(records.map((item) => item.year))];
  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("th");
    return records.filter((item) => {
      const matchesQuery = !keyword || [item.title, item.titleEn, item.author, item.ref]
        .join(" ").toLocaleLowerCase("th").includes(keyword);
      return matchesQuery && (status === "all" || item.status === status) &&
        (category === "all" || item.category === category) &&
        (year === "all" || item.year === year);
    });
  }, [category, query, records, status, year]);

  return (
    <>
      <section className="admin-filter-panel" aria-label="ตัวกรองผลงานวิจัย">
        <div className="admin-filter-title"><Filter size={18} /><strong>ตัวกรองข้อมูล</strong></div>
        <div className="admin-filter-grid">
          <label className="admin-search-field"><Search size={18} /><span className="sr-only">ค้นหาผลงาน</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่องานวิจัย, ผู้เขียน หรือรหัส" /></label>
          <select aria-label="สถานะ" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">ทุกสถานะ</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
          <select aria-label="หมวดหมู่" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">ทุกหมวดหมู่</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="ปีการศึกษา" value={year} onChange={(event) => setYear(event.target.value)}><option value="all">ปีการศึกษา</option>{years.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        {(query || status !== "all" || category !== "all" || year !== "all") && <button className="admin-clear-filter" type="button" onClick={() => { setQuery(""); setStatus("all"); setCategory("all"); setYear("all"); }}>ล้างตัวกรองทั้งหมด</button>}
      </section>

      <section className="admin-table-card">
        <div className="admin-research-table admin-table-head"><span>รายละเอียดผลงาน</span><span>หมวดหมู่ &amp; ปีการศึกษา</span><span>สถานะ</span><span>ปรับปรุงเมื่อ</span><span>ดำเนินการ</span></div>
        {filtered.length ? filtered.map((item) => (
          <article className="admin-research-table admin-table-row" key={item.id}>
            <div className="admin-research-title-cell"><span className={`admin-document-mark status-${item.status}`}>{item.ref.slice(0, 2)}</span><div><Link href={`/research/${item.id}`}>{item.title}</Link><small>{item.author}</small><small className="mono">[อ้างอิง: {item.ref}]</small></div></div>
            <div><span className="admin-category-tag">{item.category}</span><small>ปี {item.year}</small></div>
            <div><span className={`admin-status status-${item.status}`}>{statusLabels[item.status]}</span></div>
            <div><small>{item.updated}</small></div>
            <div className="admin-row-actions"><Link href={`/research/${item.id}`} aria-label={`ดู ${item.title}`}><Eye size={17} /></Link><Link href={`/admin/reviews/${item.id}`} aria-label={`ตรวจ ${item.title}`}><FilePenLine size={17} /></Link>{item.status === "pending" && <Link className="admin-review-link" href={`/admin/reviews/${item.id}`}>ตรวจ</Link>}</div>
          </article>
        )) : <div className="admin-empty-row">ไม่พบผลงานที่ตรงกับตัวกรอง</div>}
        <footer className="admin-table-footer"><span>แสดง {filtered.length} จาก {records.length} รายการผลงานวิจัย</span><div><button disabled>‹</button><button className="active">1</button><button disabled={filtered.length < 4}>2</button><button disabled>›</button></div></footer>
      </section>
    </>
  );
}
