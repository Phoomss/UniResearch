"use client";

import Link from "next/link";
import { useState } from "react";
import { Status } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";
import type { ResearchWorkResponse } from "@/src/lib/api/types";
import { Edit2, Trash2, Eye, Search, Calendar, Clock, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function StudentResearchList({ initialItems }: { initialItems: ResearchWorkResponse[] }) {
  const [items, setItems] = useState<ResearchWorkResponse[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { success, error } = useToast();
  const [lang] = useState<"th" | "en">(() => {
    if (typeof document === "undefined") return "th";
    const match = document.cookie.match(/(^|;)\s*lang\s*=\s*([^;]+)/);
    return match && match[2] === "en" ? "en" : "th";
  });

  async function handleDelete(id: number) {
    const confirmMsg = lang === "en"
      ? "Are you sure you want to delete this research? This action cannot be undone."
      : "คุณต้องการลบผลงานวิจัยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้";
      
    if (!window.confirm(confirmMsg)) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/research/${id}`, { method: "DELETE" });
      if (response.ok) {
        success(lang === "en" ? "Research deleted successfully" : "ลบผลงานวิจัยเรียบร้อยแล้ว");
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        const body = await response.json().catch(() => ({}));
        error(body.error?.message ?? (lang === "en" ? "Failed to delete research" : "ไม่สามารถลบผลงานวิจัยได้"));
      }
    } catch {
      error(lang === "en" ? "Failed to connect to delete service" : "ไม่สามารถเชื่อมต่อบริการลบผลงานวิจัยได้");
    } finally {
      setDeletingId(null);
    }
  }

  const getStatusLabel = (status: string) => {
    if (lang === "en") {
      switch (status) {
        case "approved": return "Approved";
        case "pending": return "Pending";
        case "rejected": return "Rejected";
        case "revision_needed": return "Revision Needed";
        default: return status;
      }
    } else {
      switch (status) {
        case "approved": return "เผยแพร่แล้ว";
        case "pending": return "รอตรวจสอบ";
        case "rejected": return "ไม่ผ่านการตรวจสอบ";
        case "revision_needed": return "ต้องแก้ไข";
        default: return status;
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const formattedId = `RES-${String(item.id).padStart(4, "0")}`;
    const rawId = String(item.id);
    const matchesSearch =
      (item.title_th && item.title_th.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.title_en && item.title_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      formattedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rawId.includes(searchQuery);

    const matchesStatus = selectedStatus === null || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Controls: Search and Status Filters */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          backgroundColor: "var(--paper-white)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)"
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search 
            size={18} 
            style={{ 
              position: "absolute", 
              left: "14px", 
              color: "var(--muted)", 
              pointerEvents: "none" 
            }} 
          />
          <input
            type="text"
            placeholder={lang === "en" ? "Search by title or research ID..." : "ค้นหาด้วยชื่อเรื่อง หรือรหัสผลงานวิจัย..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            className="search-input-focus"
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--muted)", marginRight: "8px" }}>
            {lang === "en" ? "Status:" : "สถานะ:"}
          </span>
          <button
            onClick={() => setSelectedStatus(null)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "14px",
              cursor: "pointer",
              border: "1px solid",
              borderColor: selectedStatus === null ? "var(--mulberry)" : "var(--line)",
              backgroundColor: selectedStatus === null ? "var(--mulberry)" : "transparent",
              color: selectedStatus === null ? "white" : "var(--muted)",
              transition: "all 0.2s"
            }}
          >
            {lang === "en" ? "All" : "ทั้งหมด"} ({items.length})
          </button>
          {["pending", "approved", "revision_needed", "rejected"].map((status) => {
            const count = items.filter(i => i.status === status).length;
            if (count === 0) return null;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: selectedStatus === status ? "var(--mulberry)" : "var(--line)",
                  backgroundColor: selectedStatus === status ? "var(--mulberry)" : "transparent",
                  color: selectedStatus === status ? "white" : "var(--muted)",
                  transition: "all 0.2s"
                }}
              >
                {getStatusLabel(status)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
          marginTop: "8px"
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const formattedId = `RES-${String(item.id).padStart(4, "0")}`;
            const tone = 
              item.status === "approved"
                ? "approved"
                : item.status === "rejected"
                  ? "error"
                  : item.status === "revision_needed"
                    ? "revision"
                    : "review";

            const submittedDate = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "th-TH", {
              dateStyle: "medium",
            }).format(new Date(item.created_at));

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "var(--paper-white)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "24px",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "var(--shadow)"
                }}
                className="submission-card"
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <Status tone={tone}>{getStatusLabel(item.status)}</Status>
                    <span 
                      style={{ 
                        fontSize: "12px", 
                        fontFamily: "monospace", 
                        color: "var(--muted)",
                        backgroundColor: "var(--paper-low)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        border: "1px solid var(--line)"
                      }}
                    >
                      {formattedId}
                    </span>
                  </div>

                  {/* Document Title */}
                  <h2 style={{ fontSize: "20px", margin: "0 0 8px 0", lineHeight: 1.4, fontWeight: "bold" }}>
                    <Link 
                      prefetch={false} 
                      href={`/research/${item.id}`}
                      style={{ color: "var(--ink)", transition: "color 0.2s" }}
                      className="card-title-hover"
                    >
                      {item.title_th || item.title_en}
                    </Link>
                  </h2>

                  {item.title_th && item.title_en && (
                    <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--muted)", margin: "0 0 16px 0", lineHeight: 1.3 }}>
                      {item.title_en}
                    </p>
                  )}

                  {/* Metadata block */}
                  <div 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "8px", 
                      fontSize: "13px", 
                      color: "var(--muted)",
                      paddingTop: "12px",
                      borderTop: "1px solid #cdc3d030",
                      marginBottom: "24px"
                    }}
                  >
                    {item.work_type && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Tag size={14} style={{ color: "var(--periwinkle)" }} />
                        <span>{lang === "en" ? "Type:" : "ประเภท:"} {item.work_type}</span>
                      </div>
                    )}
                    {item.academic_year && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={14} style={{ color: "var(--periwinkle)" }} />
                        <span>{lang === "en" ? "Academic Year:" : "ปีการศึกษา:"} {item.academic_year}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Clock size={14} style={{ color: "var(--periwinkle)" }} />
                      <span>{lang === "en" ? "Submitted on:" : "ส่งเมื่อ:"} {submittedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <Link 
                    prefetch={false} 
                    href={`/research/${item.id}`}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                      backgroundColor: "var(--mulberry)",
                      color: "white",
                      transition: "opacity 0.2s"
                    }}
                    className="btn-primary-hover"
                  >
                    <Eye size={15} />
                    <span>{lang === "en" ? "View" : "ดูผลงาน"}</span>
                  </Link>

                  <Link 
                    prefetch={false} 
                    href={`/student/research/edit/${item.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                      backgroundColor: "var(--paper-low)",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                      transition: "background-color 0.2s"
                    }}
                    className="btn-edit-hover"
                  >
                    <Edit2 size={14} />
                    <span>{lang === "en" ? "Edit" : "แก้ไข"}</span>
                  </Link>

                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(186, 26, 26, 0.08)",
                      border: "none",
                      color: "var(--error)",
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    title={lang === "en" ? "Delete" : "ลบ"}
                    className="btn-danger-hover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div 
            style={{ 
              gridColumn: "1 / -1", 
              padding: "48px 24px", 
              textAlign: "center",
              backgroundColor: "var(--paper-white)",
              borderRadius: "12px",
              border: "1px solid var(--line)"
            }}
          >
            <p style={{ margin: 0, color: "var(--muted)" }}>
              {lang === "en" ? "No submissions match your filter." : "ไม่พบผลงานวิจัยที่ตรงกับเงื่อนไขการค้นหา"}
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .search-input-focus:focus {
          border-color: var(--mulberry) !important;
          box-shadow: 0 0 0 2px rgba(72, 39, 106, 0.15) !important;
        }
        .submission-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(38, 36, 52, 0.12) !important;
        }
        .card-title-hover:hover {
          color: var(--mulberry) !important;
        }
        .btn-primary-hover:hover {
          opacity: 0.9;
        }
        .btn-edit-hover:hover {
          background-color: var(--paper-mid) !important;
        }
        .btn-danger-hover:hover {
          background-color: rgba(186, 26, 26, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
