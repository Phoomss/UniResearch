"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Trash2, BookOpen, Clock, ArrowRight, Bookmark } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/src/components/ui/Toast";
import type { FavoriteResponse } from "@/src/lib/api/types";

interface ResearchTitleInfo {
  title_th: string;
  title_en?: string;
}

export function SavedResearchList({ items: initialItems }: { items: FavoriteResponse[] }) {
  const [items, setItems] = useState<FavoriteResponse[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [titles, setTitles] = useState<Record<number, ResearchTitleInfo>>({});
  const { success, error } = useToast();

  useEffect(() => {
    items.forEach((item) => {
      if (titles[item.research_id]) return;
      fetch(`/api/research/${item.research_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.title_th) {
            setTitles((prev) => ({
              ...prev,
              [item.research_id]: {
                title_th: data.title_th,
                title_en: data.title_en,
              },
            }));
          }
        })
        .catch(() => {});
    });
  }, [items, titles]);

  const handleRemove = async (researchId: number) => {
    setPendingId(researchId);
    try {
      const response = await fetch(`/api/research/${researchId}/favorite`, {
        method: "POST",
      });
      const body = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        error(body.error?.message ?? "ไม่สามารถลบรายการโปรดได้");
        return;
      }
      
      success("ลบออกจากรายการโปรดเรียบร้อยแล้ว");
      setItems((prev) => prev.filter((item) => item.research_id !== researchId));
    } catch {
      error("บริการไม่พร้อมใช้งานในขณะนี้");
    } finally {
      setPendingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const formattedId = `RES-${String(item.research_id).padStart(4, "0")}`;
    const rawId = String(item.research_id);
    const info = titles[item.research_id];
    const titleMatch = info
      ? info.title_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (info.title_en && info.title_en.toLowerCase().includes(searchQuery.toLowerCase()))
      : false;

    return (
      formattedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rawId.includes(searchQuery) ||
      titleMatch
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Search Header Controls */}
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
            placeholder="ค้นหาด้วยชื่อเรื่อง หรือรหัสผลงานวิจัย..."
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "var(--muted)" }}>
          <span>แสดงรายการที่บันทึกไว้ทั้งหมด <strong>{items.length}</strong> รายการ</span>
          {searchQuery && <span>พบผลการค้นหา <strong>{filteredItems.length}</strong> รายการ</span>}
        </div>
      </div>

      {/* List / Grid of Saved Items */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "8px"
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const formattedId = `RES-${String(item.research_id).padStart(4, "0")}`;
            const savedDateStr = new Intl.DateTimeFormat("th-TH", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(item.saved_at));
            
            const info = titles[item.research_id];
            const displayTitle = info ? info.title_th : `ผลงานวิจัย #${item.research_id}`;
            const displaySub = info ? info.title_en : undefined;

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
                className="saved-card"
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--mulberry)" }}>
                      <Bookmark size={16} fill="var(--lavender)" style={{ color: "var(--mulberry)" }} />
                      <span style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                        รายการโปรดบันทึกไว้
                      </span>
                    </div>
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

                  {/* Document Title / Link */}
                  <h2 style={{ fontSize: "20px", margin: "0 0 16px 0", lineHeight: 1.4, fontWeight: "bold" }}>
                    <Link 
                      prefetch={false} 
                      href={`/research/${item.research_id}`}
                      style={{ color: "var(--ink)", transition: "color 0.2s" }}
                      className="card-title-hover"
                    >
                      {displayTitle}
                    </Link>
                  </h2>

                  {displaySub && (
                    <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--muted)", margin: "-8px 0 16px 0", lineHeight: 1.3 }}>
                      {displaySub}
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <BookOpen size={14} style={{ color: "var(--periwinkle)" }} />
                      <span>หมายเลขงานวิจัย: {item.research_id}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Clock size={14} style={{ color: "var(--periwinkle)" }} />
                      <span>บันทึกเมื่อ: {savedDateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <Link 
                    prefetch={false} 
                    href={`/research/${item.research_id}`}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 600,
                      backgroundColor: "var(--mulberry)",
                      color: "white",
                      transition: "opacity 0.2s"
                    }}
                    className="btn-primary-hover"
                  >
                    <span>เปิดรายละเอียด</span>
                    <ArrowRight size={15} />
                  </Link>

                  <button
                    disabled={pendingId === item.research_id}
                    onClick={() => handleRemove(item.research_id)}
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
                    title="ลบออกจากรายการโปรด"
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
            <p style={{ margin: 0, color: "var(--muted)" }}>ไม่พบรายการโปรดที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .search-input-focus:focus {
          border-color: var(--mulberry) !important;
          box-shadow: 0 0 0 2px rgba(72, 39, 106, 0.15) !important;
        }
        .saved-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(38, 36, 52, 0.12) !important;
        }
        .card-title-hover:hover {
          color: var(--mulberry) !important;
        }
        .btn-primary-hover:hover {
          opacity: 0.9;
        }
        .btn-danger-hover:hover {
          background-color: rgba(186, 26, 26, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
