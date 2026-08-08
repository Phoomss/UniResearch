"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FilePlus2,
  Files,
  LayoutDashboard,
  Menu,
  Search,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { LogoutButton } from "@/src/features/auth/session-controls";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  { label: "", items: [{ href: "/advisor", label: "แดชบอร์ด", icon: LayoutDashboard }] },
  {
    label: "การตรวจประเมิน",
    items: [
      { href: "/advisor/reviews", label: "คิวรอตรวจประเมิน", icon: ClipboardCheck },
      { href: "/advisor/history", label: "ประวัติการตรวจของฉัน", icon: Files },
      { href: "/advisor/research", label: "ผลงานวิจัยทั้งหมด", icon: BookOpen },
      { href: "/advisor/advisees", label: "งานในความดูแล", icon: UsersRound },
    ],
  },
  {
    label: "พื้นที่ของฉัน",
    items: [
      { href: "/advisor/submissions", label: "ผลงานที่ฉันส่ง", icon: Files },
      { href: "/advisor/participants", label: "ผู้เกี่ยวข้อง", icon: UsersRound },
      { href: "/advisor/new", label: "ส่งผลงานใหม่", icon: FilePlus2 },
      { href: "/advisor/profile", label: "ข้อมูลส่วนตัว", icon: UserRound },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/advisor") return pathname === href;
  if (href === "/advisor/reviews") return pathname.startsWith(href);
  return pathname === href;
}

function AdvisorBrand() {
  return (
    <Link className="admin-brand" href="/advisor">
      <Image src="/uniresearchwhite-icon-logo.png" width={70} height={70} alt="" />
      <strong>UniResearch</strong>
    </Link>
  );
}

function AdvisorNavigation({ pathname }: { pathname: string }) {
  return (
    <nav className="admin-navigation" aria-label="เมนูอาจารย์ที่ปรึกษา">
      {groups.map((group) => (
        <div className="admin-nav-group" key={group.label || "overview"}>
          {group.label && <p>{group.label}</p>}
          {group.items.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link className={active ? "active" : undefined} href={href} aria-current={active ? "page" : undefined} key={href}>
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

export function AdvisorShell({ children, name, department }: { children: React.ReactNode; name: string; department?: string | null }) {
  const pathname = usePathname();
  const currentItem = groups.flatMap((group) => group.items).find((item) => isActive(pathname, item.href));

  return (
    <div className="admin-app advisor-app">
      <aside className="admin-sidebar">
        <AdvisorBrand />
        <AdvisorNavigation pathname={pathname} />
        <div className="admin-sidebar-footer">
          <div className="admin-profile">
            <span><UserRound size={17} /></span>
            <div><strong>{name}</strong><small>{department || "อาจารย์ที่ปรึกษา"}</small></div>
          </div>
          <Link href="/"><ExternalLink size={15} /> <span>เว็บไซต์หลัก</span></Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>อาจารย์ที่ปรึกษา</span><ChevronRight size={15} /><strong>{currentItem?.label ?? "พื้นที่ตรวจประเมิน"}</strong></div>
          <form className="admin-global-search" action="/advisor/research">
            <Search aria-hidden="true" size={18} />
            <input name="q" type="search" placeholder="ค้นหาผลงานวิจัย [ / ]" />
          </form>
          <span className="admin-avatar" aria-label={`บัญชี ${name}`}><UserRound size={18} /></span>
          <details className="admin-mobile-menu">
            <summary aria-label="เปิดเมนูอาจารย์ที่ปรึกษา"><Menu size={22} /></summary>
            <div><AdvisorBrand /><AdvisorNavigation pathname={pathname} /></div>
          </details>
        </header>
        {children}
      </div>
    </div>
  );
}
