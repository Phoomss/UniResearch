"use client";

import Link from "next/link";
import { Eye, FilePenLine, Filter, Search, Trash2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/src/components/ui/Toast";
import type { AdminResearchRecord } from "./admin-data";

const statusLabels = {
  pending: "รอตรวจ (Pending)",
  approved: "ตีพิมพ์แล้ว (Published)",
  rejected: "ถูกปฏิเสธ (Rejected)",
  revision_needed: "ต้องแก้ไข (Revision)",
} as const;

export function AdminResearchManager({ records, reviewBasePath = "/admin/reviews", editBasePath = "/student/research/edit", allowReview = true, allowManage = false }: { records: AdminResearchRecord[]; reviewBasePath?: string; editBasePath?: string; allowReview?: boolean; allowManage?: boolean }) {
  const [items, setItems] = useState(records);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const { success, error } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categories = [...new Set(items.map((item) => item.category))];
  const years = [...new Set(items.map((item) => item.year))];
  
  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("th");
    return items.filter((item) => {
      const matchesQuery = !keyword || [item.title, item.titleEn, item.author, item.ref]
        .join(" ").toLocaleLowerCase("th").includes(keyword);
      return matchesQuery && (status === "all" || item.status === status) &&
        (category === "all" || item.category === category) &&
        (year === "all" || item.year === year);
    });
  }, [category, items, query, status, year]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, status, category, year]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, currentPage, pageSize]);

  async function removeResearch(id: number) {
    if (!window.confirm("ยืนยันการลบผลงานนี้อย่างถาวรหรือไม่")) return;
    try {
      const response = await fetch(`/api/research/${id}`, { method: "DELETE" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) { error(body.error?.message ?? "ไม่สามารถลบผลงานได้"); return; }
      setItems((current) => current.filter((item) => item.id !== id));
      success("ลบผลงานเรียบร้อยแล้ว");
    } catch { error("ไม่สามารถเชื่อมต่อบริการลบผลงานได้"); }
  }

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
        {paginatedItems.length ? paginatedItems.map((item) => (
          <article className="admin-research-table admin-table-row" key={item.id}>
            <div className="admin-research-title-cell"><span className={`admin-document-mark status-${item.status}`}>{item.ref.slice(0, 2)}</span><div><Link href={`/research/${item.id}`}>{item.title}</Link><small>{item.author}</small><small className="mono">[อ้างอิง: {item.ref}]</small></div></div>
            <div><span className="admin-category-tag">{item.category}</span><small>ปี {item.year}</small></div>
            <div><span className={`admin-status status-${item.status}`}>{statusLabels[item.status]}</span></div>
            <div><small>{item.updated}</small></div>
            <div className="admin-row-actions"><Link href={`/research/${item.id}`} aria-label={`ดู ${item.title}`}><Eye size={17} /></Link>{allowReview && <Link href={`${reviewBasePath}/${item.id}`} aria-label={`ตรวจ ${item.title}`}><FilePenLine size={17} /></Link>}{allowReview && item.status === "pending" && <Link className="admin-review-link" href={`${reviewBasePath}/${item.id}`}>ตรวจ</Link>}{allowManage && <Link href={`${editBasePath}/${item.id}`} aria-label={`แก้ไข ${item.title}`}><FilePenLine size={17} /></Link>}{allowManage && <button type="button" className="admin-delete-row-action" onClick={() => removeResearch(item.id)} aria-label={`ลบ ${item.title}`}><Trash2 size={17} /></button>}</div>
          </article>
        )) : <div className="admin-empty-row">ไม่พบผลงานที่ตรงกับตัวกรอง</div>}
        
        <footer className="admin-table-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
          <span>
            แสดง <strong>{filtered.length ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(filtered.length, currentPage * pageSize)}</strong> จากทั้งหมด <strong>{filtered.length}</strong> รายการ
          </span>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button 
              type="button" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{ width: "auto", minWidth: "75px", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(205, 195, 208, 0.4)", background: "#ffffff", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, fontSize: "13px", fontWeight: 500 }}
            >
              ก่อนหน้า
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: pageNum === currentPage ? "none" : "1px solid rgba(205, 195, 208, 0.4)",
                    background: pageNum === currentPage ? "var(--primary)" : "#ffffff",
                    color: pageNum === currentPage ? "#ffffff" : "var(--muted)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px"
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              type="button" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{ width: "auto", minWidth: "75px", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(205, 195, 208, 0.4)", background: "#ffffff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, fontSize: "13px", fontWeight: 500 }}
            >
              ถัดไป
            </button>
          </div>
        </footer>
      </section>
    </>
  );
}
