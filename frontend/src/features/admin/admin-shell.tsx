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
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Research",
    items: [
      { href: "/admin/research", label: "All Research", icon: BookOpen },
      { href: "/admin/reviews", label: "Review Queue", icon: ClipboardList },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/categories", label: "Categories", icon: Shapes },
      { href: "/admin/research?documents=1", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Insights",
    items: [{ href: "/admin/analytics", label: "Analytics", icon: BarChart3 }],
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
          <div className="admin-profile">
            <span><UserRound size={17} /></span>
            <div><strong>Admin Profile</strong><small>University Head</small></div>
          </div>
          <Link href="/"><ExternalLink size={15} /> <span>Main Site</span></Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>Admin</span><ChevronRight size={15} /><strong>{currentItem?.label ?? "Workspace"}</strong>
          </div>
          <form className="admin-global-search" action="/admin/research">
            <Search aria-hidden="true" size={18} />
            <input name="q" type="search" placeholder="Search Archive [ / ]" />
          </form>
          <span className="admin-avatar" aria-label="บัญชีผู้ดูแลระบบ"><UserRound size={18} /></span>
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
