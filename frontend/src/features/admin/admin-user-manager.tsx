"use client";

import { 
  Search, UserRound, UserPlus, Download, Edit2, Trash2, X,
  Users, ShieldAlert, GraduationCap, UserCheck, Building2
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/Toast";
import type { UserResponse } from "@/src/lib/api/types";

interface AdminUserManagerProps {
  initialUsers: UserResponse[];
}

export function AdminUserManager({ initialUsers = [] }: AdminUserManagerProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [users, setUsers] = useState<UserResponse[]>(initialUsers);
  
  // Search & Filter state
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [query, role]);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);
  
  // Form submission state
  const [pending, setPending] = useState(false);

  // Departments List
  const departments = [
    "วิทยาการคอมพิวเตอร์",
    "เทคโนโลยีสารสนเทศ",
    "วิศวกรรมคอมพิวเตอร์",
    "วิศวกรรมซอฟต์แวร์",
    "เทคโนโลยีมัลติมีเดีย",
    "การจัดการเทคโนโลยีสารสนเทศ",
    "ไม่ระบุ"
  ];

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const admins = users.filter(u => u.role === "admin").length;
    const students = users.filter(u => u.role === "student").length;
    return { total, active, admins, students };
  }, [users]);

  // Filtering logic
  const filtered = useMemo(() => {
    return users.filter((user) => {
      const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim().toLowerCase();
      const text = `${name} ${user.email ?? ""} ${user.student_id ?? ""} ${user.department ?? ""}`.toLowerCase();
      const matchesSearch = !query.trim() || text.includes(query.trim().toLowerCase());
      const matchesRole = role === "all" || 
        user.role === role || 
        (role === "advisor" && (user.role === "advisor" || user.role === "reviewer")) ||
        (role === "reviewer" && (user.role === "advisor" || user.role === "reviewer"));
      return matchesSearch && matchesRole;
    });
  }, [query, role, users]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Export CSV Handler
  const handleExportCSV = () => {
    try {
      const headers = ["ID", "Email", "First Name", "Last Name", "Student ID", "Department", "Role", "Active"];
      const rows = filtered.map(u => [
        u.id,
        u.email,
        u.first_name || "",
        u.last_name || "",
        u.student_id || "",
        u.department || "",
        u.role,
        u.is_active ? "Active" : "Inactive"
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(",")].concat(rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success("ส่งออกไฟล์ CSV เรียบร้อยแล้ว");
    } catch {
      error("ไม่สามารถส่งออกไฟล์ CSV ได้");
    }
  };

  // Add User Submission
  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await response.json();
      if (!response.ok) {
        error(body.error?.message || "เพิ่มผู้ใช้ล้มเหลว");
        return;
      }

      success(`เพิ่มผู้ใช้ “${body.email}” สำเร็จ`);
      setIsAddOpen(false);
      
      setUsers((prev) => [...prev, body]);
      router.refresh();
    } catch {
      error("เกิดข้อผิดพลาดในการติดต่อระบบ");
    } finally {
      setPending(false);
    }
  };

  // Edit User Submission
  const handleEditUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!data.password) {
      delete data.password;
    }

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          is_active: data.is_active === "true",
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        error(body.error?.message || "แก้ไขข้อมูลล้มเหลว");
        return;
      }

      success("อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว");
      setEditingUser(null);

      setUsers((prev) => prev.map((u) => (u.id === body.id ? body : u)));
      router.refresh();
    } catch {
      error("เกิดข้อผิดพลาดในการติดต่อระบบ");
    } finally {
      setPending(false);
    }
  };

  // Delete User handler
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setPending(true);

    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        error(body.error?.message || "ลบผู้ใช้ล้มเหลว");
        return;
      }

      success("ลบผู้ใช้งานเรียบร้อยแล้ว");
      const deletedId = deletingUser.id;
      setDeletingUser(null);

      setUsers((prev) => prev.filter((u) => u.id !== deletedId));
      router.refresh();
    } catch {
      error("เกิดข้อผิดพลาดในการติดต่อระบบ");
    } finally {
      setPending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header Section inside Admin Page */}
      <header className="admin-page-heading admin-heading-actions admin-users-heading" style={{ marginBottom: 0 }}>
        <div>
          <p style={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "11px", fontWeight: 700, color: "var(--primary)" }}>การจัดการระบบ / Admin Console</p>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1c1a29", margin: "4px 0" }}>จัดการผู้ใช้งาน</h1>
          <span style={{ fontSize: "14px", color: "var(--muted)" }}>
            จัดการสิทธิ์การเข้าถึงข้อมูลคลังวิจัยดิจิทัล ตรวจสอบสถานะการเชื่อมต่อภาควิชา และข้อมูลสมาชิกในระบบ
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="admin-secondary-action" type="button" onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px", padding: "10px 16px", fontWeight: 600 }}>
            <Download size={17} /> Export CSV
          </button>
          <button className="admin-primary-action" type="button" onClick={() => setIsAddOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px", padding: "10px 16px", fontWeight: 600 }}>
            <UserPlus size={17} /> เพิ่มผู้ใช้ใหม่
          </button>
        </div>
      </header>

      {/* Summary Cards Row */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid rgba(205, 195, 208, 0.4)", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(99, 102, 241, 0.1)", color: "rgb(99, 102, 241)", padding: "12px", borderRadius: "12px" }}>
            <Users size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>ผู้ใช้งานทั้งหมด</h4>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#1c1a29" }}>{stats.total} คน</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid rgba(205, 195, 208, 0.4)", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "rgb(16, 185, 129)", padding: "12px", borderRadius: "12px" }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>เปิดใช้งาน (Active)</h4>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#1c1a29" }}>{stats.active} คน</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid rgba(205, 195, 208, 0.4)", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "rgb(245, 158, 11)", padding: "12px", borderRadius: "12px" }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>ผู้ดูแลระบบ (Admin)</h4>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#1c1a29" }}>{stats.admins} คน</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "1px solid rgba(205, 195, 208, 0.4)", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "rgb(59, 130, 246)", padding: "12px", borderRadius: "12px" }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>นักศึกษา (Student)</h4>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#1c1a29" }}>{stats.students} คน</span>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="admin-user-filters" style={{ padding: "8px 12px", background: "#f8f7f9", borderRadius: "16px", display: "flex", gap: "12px", alignItems: "center", border: "1px solid rgba(205, 195, 208, 0.2)" }}>
        <label style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", background: "#ffffff", borderRadius: "12px", padding: "2px 12px", border: "1px solid rgba(205, 195, 208, 0.5)" }}>
          <Search size={18} style={{ color: "var(--muted)" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาตามชื่อ, อีเมล หรือรหัสประจำตัว..."
            style={{ border: "none", outline: "none", width: "100%", padding: "10px 8px", fontSize: "14px", background: "transparent" }}
          />
        </label>
        
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            ["all", "ทั้งหมด"],
            ["admin", "แอดมิน"],
            ["advisor", "อาจารย์ / ผู้ตรวจ"],
            ["student", "นักศึกษา"],
            ["guest", "ทั่วไป"],
          ].map(([value, label]) => (
            <button
              className={role === value ? "active" : undefined}
              type="button"
              onClick={() => setRole(value)}
              key={value}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: role === value ? "var(--primary)" : "transparent",
                color: role === value ? "#ffffff" : "var(--muted)",
                transition: "all 0.2s"
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Users Table Card */}
      <section className="admin-table-card admin-users-card" style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)", overflowX: "auto", border: "1px solid rgba(205, 195, 208, 0.4)" }}>
        <div style={{ minWidth: "1020px" }}>
        <div
          className="admin-users-grid admin-table-head"
          style={{
            gridTemplateColumns: "1.3fr 1fr 1fr 1fr 100px 90px",
            background: "#fdfcff",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(205, 195, 208, 0.4)",
            fontWeight: 600,
            fontSize: "13px",
            color: "var(--muted)",
            letterSpacing: "0.5px"
          }}
        >
          <span>ข้อมูลชื่อ-สกุล</span>
          <span>อีเมลติดต่อ</span>
          <span>รหัส / สังกัด</span>
          <span>สิทธิ์ / บทบาท</span>
          <span>สถานะ</span>
          <span style={{ textAlign: "right" }}>เครื่องมือ</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {paginatedUsers.map((user) => {
            const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "ไม่ระบุชื่อจริง";
            return (
              <article
                className="admin-users-grid admin-user-row"
                style={{
                  gridTemplateColumns: "1.3fr 1fr 1fr 1fr 100px 90px",
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(205, 195, 208, 0.2)",
                  transition: "background 0.15s ease",
                  background: "#ffffff"
                }}
                key={user.id}
              >
                {/* 1. Name & Identity */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ 
                    width: "36px", 
                    height: "36px", 
                    borderRadius: "50%", 
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))", 
                    color: "var(--primary)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center"
                  }}>
                    <UserRound size={16} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "14px", color: "#1c1a29", fontWeight: 600 }}>{fullName}</strong>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>UID: #{user.id}</span>
                  </div>
                </div>

                {/* 2. Email */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <code style={{ fontSize: "13px", color: "#4b5563", background: "#f3f4f6", padding: "3px 8px", borderRadius: "6px", fontFamily: "monospace" }}>
                    {user.email}
                  </code>
                </div>

                {/* 3. Student ID & Department */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#1c1a29" }}>{user.student_id || "-"}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--muted)" }}>
                    <Building2 size={11} /> {user.department || "ไม่มีภาควิชา"}
                  </div>
                </div>

                {/* 4. Role Badges */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={`admin-role role-${user.role}`} style={{ fontSize: "11px", fontWeight: 600, padding: "4px 8px", borderRadius: "8px", textTransform: "uppercase" }}>
                    {user.role === "admin" ? "🛡️ admin" : user.role === "reviewer" || user.role === "advisor" ? "✍️ reviewer" : user.role === "student" ? "🎓 student" : "👤 guest"}
                  </span>
                </div>

                {/* 5. Active Status Pill */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span 
                    className={`status ${user.is_active ? "approved" : "rejected"}`} 
                    style={{ 
                      fontSize: "11px", 
                      padding: "4px 10px", 
                      borderRadius: "20px", 
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: user.is_active ? "#10b981" : "#ef4444", display: "inline-block" }}></span>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* 6. Action Tools */}
                <div className="admin-user-row-actions" style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                  <button
                    type="button"
                    style={{
                      background: "rgba(99, 102, 241, 0.05)",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--primary)",
                      padding: "8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onClick={() => setEditingUser(user)}
                    aria-label={`แก้ไขข้อมูล ${fullName}`}
                    title="แก้ไขข้อมูลผู้ใช้"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    style={{
                      background: "rgba(239, 68, 68, 0.05)",
                      border: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      padding: "8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onClick={() => setDeletingUser(user)}
                    aria-label={`ลบผู้ใช้ ${fullName}`}
                    title="ลบผู้ใช้งาน"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!filtered.length && (
          <div className="admin-empty-row" style={{ padding: "40px 24px", color: "var(--muted)" }}>
            ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข
          </div>
        )}
        </div>
      </section>

      {/* Pagination Footer */}
      <div className="admin-pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "16px 24px", borderRadius: "16px", border: "1px solid rgba(205, 195, 208, 0.4)" }}>
        <span style={{ fontSize: "14px", color: "var(--muted)" }}>
          แสดง <strong>{filtered.length ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(filtered.length, currentPage * pageSize)}</strong> จากทั้งหมด <strong>{filtered.length}</strong> รายการ
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
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
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: "left", width: "100%", maxWidth: "560px", padding: "28px", display: "block", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(205, 195, 208, 0.2)", paddingBottom: "12px" }}>
              <div>
                <h2 className="modal-title" style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>เพิ่มบัญชีผู้ใช้ใหม่</h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>กรอกข้อมูลเพื่อลงทะเบียนผู้ใช้งานเข้าสู่ระบบคลังวิจัย</p>
              </div>
              <button
                type="button"
                aria-label="ปิดหน้าต่างเพิ่มผู้ใช้"
                style={{ background: "rgba(28, 26, 41, 0.05)", border: "none", cursor: "pointer", padding: "6px", borderRadius: "50%", display: "flex" }}
                onClick={() => setIsAddOpen(false)}
              >
                <X size={18} style={{ color: "var(--muted)" }} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>อีเมลผู้ใช้งาน (Email) *</label>
                <input className="input" type="email" name="email" required placeholder="name@domain.com" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
              </div>
              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>รหัสผ่าน (Password) *</label>
                <input className="input" type="password" name="password" required placeholder="ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
              </div>
              
              <div className="admin-modal-field-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>ชื่อจริง</label>
                  <input className="input" type="text" name="first_name" placeholder="สมชาย" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                </div>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>นามสกุล</label>
                  <input className="input" type="text" name="last_name" placeholder="รักดี" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                </div>
              </div>

              <div className="admin-modal-field-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>บทบาท (Role)</label>
                  <select className="select" name="role" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }}>
                    <option value="guest">Guest (ทั่วไป)</option>
                    <option value="student">Student (นักศึกษา)</option>
                    <option value="reviewer">Reviewer (ผู้ตรวจสอบ)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>รหัสประจำตัวนักศึกษา</label>
                  <input className="input" type="text" name="student_id" placeholder="640xxxxxxx" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                </div>
              </div>

              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>ภาควิชา / สังกัด</label>
                <select className="select" name="department" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }}>
                  {departments.map((dept) => (
                    <option key={dept} value={dept === "ไม่ระบุ" ? "" : dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-modal-actions" style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" type="button" onClick={() => setIsAddOpen(false)} disabled={pending} style={{ borderRadius: "10px", padding: "10px 20px" }}>
                  ยกเลิก
                </button>
                <button className="btn btn-primary" type="submit" disabled={pending} style={{ borderRadius: "10px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {pending ? "กำลังบันทึก..." : "เพิ่มผู้ใช้ใหม่"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: "left", width: "100%", maxWidth: "560px", padding: "28px", display: "block", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(205, 195, 208, 0.2)", paddingBottom: "12px" }}>
              <div>
                <h2 className="modal-title" style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>แก้ไขรายละเอียดข้อมูลผู้ใช้งาน</h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--muted)" }}>ปรับปรุงข้อมูลสิทธิ์การใช้งานและรายละเอียดของบัญชี</p>
              </div>
              <button
                type="button"
                aria-label="ปิดหน้าต่างแก้ไขผู้ใช้"
                style={{ background: "rgba(28, 26, 41, 0.05)", border: "none", cursor: "pointer", padding: "6px", borderRadius: "50%", display: "flex" }}
                onClick={() => setEditingUser(null)}
              >
                <X size={18} style={{ color: "var(--muted)" }} />
              </button>
            </div>
            
            <form onSubmit={handleEditUser} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>อีเมลผู้ใช้งาน *</label>
                <input className="input" type="email" name="email" defaultValue={editingUser.email} required style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
              </div>
              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>รหัสผ่านใหม่ (ปล่อยว่างถ้าไม่ต้องการเปลี่ยน)</label>
                <input className="input" type="password" name="password" placeholder="ป้อนรหัสผ่านใหม่หากต้องการรีเซ็ต" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
              </div>
              
              <div className="admin-modal-field-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>ชื่อจริง</label>
                  <input className="input" type="text" name="first_name" defaultValue={editingUser.first_name || ""} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                </div>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>นามสกุล</label>
                  <input className="input" type="text" name="last_name" defaultValue={editingUser.last_name || ""} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                </div>
              </div>

              <div className="admin-modal-field-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>บทบาท / สิทธิ์</label>
                  <select className="select" name="role" defaultValue={editingUser.role} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }}>
                    <option value="guest">Guest (ทั่วไป)</option>
                    <option value="student">Student (นักศึกษา)</option>
                    <option value="reviewer">Reviewer (ผู้ตรวจสอบ)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
                <div className="field">
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>รหัสประจำตัวนักศึกษา</label>
                  <input className="input" type="text" name="student_id" defaultValue={editingUser.student_id || ""} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                </div>
              </div>

              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>ภาควิชา / สังกัด</label>
                <select className="select" name="department" defaultValue={editingUser.department || ""} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }}>
                  {departments.map((dept) => (
                    <option key={dept} value={dept === "ไม่ระบุ" ? "" : dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px", display: "block" }}>สถานะของบัญชี</label>
                <select className="select" name="is_active" defaultValue={editingUser.is_active ? "true" : "false"} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }}>
                  <option value="true">Active (เปิดการใช้งาน)</option>
                  <option value="false">Inactive (ปิดการใช้งาน)</option>
                </select>
              </div>

              <div className="admin-modal-actions" style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" type="button" onClick={() => setEditingUser(null)} disabled={pending} style={{ borderRadius: "10px", padding: "10px 20px" }}>
                  ยกเลิก
                </button>
                <button className="btn btn-primary" type="submit" disabled={pending} style={{ borderRadius: "10px", padding: "10px 20px" }}>
                  {pending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ borderRadius: "20px", padding: "32px", maxWidth: "440px" }}>
            <div className="modal-header-icon rejected" style={{ marginBottom: "16px" }}>
              <Trash2 size={28} />
            </div>
            <h2 className="modal-title" style={{ fontSize: "18px", fontWeight: 700 }}>ยืนยันลบบัญชีผู้ใช้งาน?</h2>
            <p className="modal-text" style={{ fontSize: "14px", color: "var(--muted)", margin: "8px 0 24px 0", textAlign: "center" }}>
              คุณต้องการลบข้อมูลบัญชีของ <strong>{deletingUser.email}</strong> ออกจากระบบใช่หรือไม่?<br />
              <span style={{ color: "#ef4444", fontWeight: 600 }}>ข้อมูลจะไม่สามารถกู้คืนกลับมาได้อีก</span>
            </p>
            <div className="modal-buttons" style={{ gap: "10px" }}>
              <button className="btn btn-secondary" type="button" onClick={() => setDeletingUser(null)} disabled={pending} style={{ borderRadius: "10px" }}>
                ยกเลิก
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", borderRadius: "10px", color: "#ffffff" }}
                onClick={handleDeleteUser}
                disabled={pending}
              >
                {pending ? "กำลังดำเนินการ..." : "ยืนยันการลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
