"use client";

import { Search, UserRound, UsersRound } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import type { ResearchParticipant } from "@/src/lib/api/types";

export function ParticipantDirectory({ authors, advisors }: { authors: ResearchParticipant[]; advisors: ResearchParticipant[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | "student" | "advisor">("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const people = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("th");
    return [...advisors, ...authors].filter((person) => {
      const matchesRole = role === "all" || person.role === role;
      const searchable = [person.first_name, person.last_name, person.email, person.student_id, person.department].filter(Boolean).join(" ").toLocaleLowerCase("th");
      return matchesRole && (!keyword || searchable.includes(keyword));
    });
  }, [advisors, authors, query, role]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [query, role]);

  const totalPages = Math.ceil(people.length / pageSize) || 1;
  const paginatedPeople = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return people.slice(startIndex, startIndex + pageSize);
  }, [people, currentPage, pageSize]);

  return (
    <>
      <section className="admin-filter-panel" aria-label="ค้นหาผู้เกี่ยวข้อง">
        <div className="admin-filter-title"><UsersRound size={18} /><strong>ตัวกรองรายชื่อ</strong></div>
        <div className="admin-filter-grid advisor-participant-filter">
          <label className="admin-search-field"><Search size={18} /><span className="sr-only">ค้นหารายชื่อ</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อ อีเมล รหัสนักศึกษา หรือภาควิชา" /></label>
          <select aria-label="ประเภทผู้ใช้" value={role} onChange={(event) => setRole(event.target.value as typeof role)}><option value="all">ผู้เกี่ยวข้องทั้งหมด</option><option value="advisor">อาจารย์ที่ปรึกษา</option><option value="student">นักศึกษา</option></select>
        </div>
      </section>

      <section className="admin-table-card">
        <div className="advisor-participant-table admin-table-head"><span>ชื่อและบัญชี</span><span>ประเภท</span><span>รหัสผู้ใช้</span><span>ภาควิชา</span></div>
        {paginatedPeople.length ? paginatedPeople.map((person) => {
          const name = `${person.first_name || ""} ${person.last_name || ""}`.trim() || "ไม่ระบุชื่อ";
          return (
            <article className="advisor-participant-table admin-table-row" key={`${person.role}-${person.id}`}>
              <div className="admin-research-title-cell"><span className="advisor-person-mark"><UserRound size={20} /></span><div><strong>{name}</strong><small>{person.email}</small></div></div>
              <div><span className={`admin-status ${person.role === "advisor" ? "status-approved" : "status-pending"}`}>{person.role === "advisor" ? "Advisor" : "Student"}</span></div>
              <div><code>{person.student_id || `USER-${person.id}`}</code></div>
              <div><small>{person.department || "ไม่ระบุ"}</small></div>
            </article>
          );
        }) : <div className="admin-empty-row">ไม่พบรายชื่อที่ตรงกับตัวกรอง</div>}
        
        <footer className="admin-table-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
          <span>
            แสดง <strong>{people.length ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(people.length, currentPage * pageSize)}</strong> จากทั้งหมด <strong>{people.length}</strong> รายการ
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
