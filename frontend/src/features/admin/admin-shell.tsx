"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Shapes,
  UserRound,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { LogoutButton } from "@/src/features/auth/session-controls";

type AdminNavGroup = {
  label: string;
  items: Array<{ href: string; label: string; icon: LucideIcon }>;
};

const groups: AdminNavGroup[] = [
  {
    label: "",
    items: [{ href: "/admin", label: "แดชบอร์ด", icon: LayoutDashboard }],
  },
  {
    label: "ผลงานวิจัย",
    items: [
      { href: "/admin/research", label: "ผลงานวิจัยทั้งหมด", icon: BookOpen },
      { href: "/admin/reviews", label: "รายการรอตรวจสอบ", icon: ClipboardList },
    ],
  },
  {
    label: "การจัดการ",
    items: [
      { href: "/admin/users", label: "ผู้ใช้งาน", icon: Users },
      { href: "/admin/categories", label: "หมวดหมู่", icon: Shapes },
      { href: "/admin/options", label: "ภาควิชาและประเภทผลงาน", icon: Settings },
      { href: "/admin/research?documents=1", label: "เอกสาร", icon: FileText },
    ],
  },
  {
    label: "ข้อมูลเชิงลึก",
    items: [{ href: "/admin/analytics", label: "การวิเคราะห์", icon: BarChart3 }],
  },
];

function isActive(pathname: string, href: string) {
  if (href.includes("?documents=1")) return false;
  const path = href.split("?")[0];
  if (path === "/admin") return pathname === path;
  if (path === "/admin/reviews") return pathname.startsWith(path);
  return pathname === path;
}

function AdminNavigation({ pathname }: { pathname: string }) {
  return (
    <nav className="admin-navigation" aria-label="เมนูผู้ดูแลระบบ">
      {groups.map((group) => (
        <div className="admin-nav-group" key={group.label || "overview"}>
          {group.label && <p>{group.label}</p>}
          {group.items.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                className={active ? "active" : undefined}
                href={href}
                aria-current={active ? "page" : undefined}
                key={href}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function AdminBrand() {
  return (
    <Link className="admin-brand" href="/admin">
      <Image
        src="/uniresearch-icon-logo.png"
        width={36}
        height={36}
        alt=""
      />
      <strong>UniResearch</strong>
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentItem = groups
    .flatMap((group) => group.items)
    .find((item) => isActive(pathname, item.href));

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <AdminBrand />
        <AdminNavigation pathname={pathname} />
        <div className="admin-sidebar-footer">
          <Link href="/admin/profile" className="admin-profile" style={{ display: "flex", gap: "12px", alignItems: "center", textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            <span><UserRound size={17} /></span>
            <div><strong>โปรไฟล์ผู้ดูแลระบบ</strong><small>หัวหน้ามหาวิทยาลัย</small></div>
          </Link>
          <Link href="/"><ExternalLink size={15} /> <span>เว็บไซต์หลัก</span></Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>ผู้ดูแลระบบ</span><ChevronRight size={15} /><strong>{currentItem?.label ?? "พื้นที่ทำงาน"}</strong>
          </div>
          <form className="admin-global-search" action="/admin/research">
            <Search aria-hidden="true" size={18} />
            <input name="q" type="search" placeholder="ค้นหาคลังข้อมูล [ / ]" />
          </form>
          <Link href="/admin/profile" className="admin-avatar" aria-label="บัญชีผู้ดูแลระบบ" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "inherit" }}><UserRound size={18} /></Link>
          <details className="admin-mobile-menu">
            <summary aria-label="เปิดเมนูผู้ดูแลระบบ"><Menu size={22} /></summary>
            <div>
              <AdminBrand />
              <AdminNavigation pathname={pathname} />
            </div>
          </details>
        </header>
        {children}
      </div>
    </div>
  );
}
