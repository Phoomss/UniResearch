"use client";

import { Filter, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { adminUsers } from "./admin-data";

export function AdminUserManager() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const filtered = useMemo(() => adminUsers.filter((user) => {
    const text = `${user.name} ${user.email} ${user.id} ${user.department}`.toLocaleLowerCase("th");
    return (!query.trim() || text.includes(query.trim().toLocaleLowerCase("th"))) && (role === "all" || user.role === role);
  }), [query, role]);

  return (
    <>
      <section className="admin-user-filters">
        <label><Search size={19} /><span className="sr-only">ค้นหาผู้ใช้</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อ อีเมล หรือรหัส" /></label>
        {[["all", "ทั้งหมด [All]"], ["admin", "แอดมิน [Admin]"], ["reviewer", "ผู้ตรวจสอบ [Reviewer]"], ["student", "นักศึกษา [Student]"], ["guest", "บุคคลทั่วไป [Guest]"]].map(([value, label]) => <button className={role === value ? "active" : undefined} type="button" onClick={() => setRole(value)} key={value}>{label}</button>)}
        <button type="button" aria-label="ตัวกรองเพิ่มเติม"><Filter size={18} /></button>
      </section>
      <section className="admin-table-card admin-users-card">
        <div className="admin-users-grid admin-table-head"><span>User</span><span>Email Contact</span><span>ID Num [รหัส]</span><span>Department</span><span>Role / Access</span></div>
        {filtered.map((user) => <article className="admin-users-grid admin-user-row" key={user.email}>
          <div className="admin-user-identity"><span><UserRound size={18} /></span><div><strong>{user.name}</strong><small>{user.subtitle}</small></div></div>
          <code>{user.email}</code><span>{user.id}</span><strong>{user.department}</strong><span className={`admin-role role-${user.role}`}>{user.role}</span>
        </article>)}
        {!filtered.length && <div className="admin-empty-row">ไม่พบผู้ใช้งาน</div>}
      </section>
      <div className="admin-pagination"><span>Showing [ 1 - {filtered.length} ] of {adminUsers.length} records</span><div><button disabled>‹</button><button className="active">1</button><button>2</button><button>3</button><span>…</span><button>125</button><button>›</button></div></div>
    </>
  );
}
