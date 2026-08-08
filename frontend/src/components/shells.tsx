import Link from "next/link";
import { Brand, ButtonLink, LanguageSwitch } from "./ui";
import { hasSession } from "@/src/lib/api/session";
import { LogoutButton } from "@/src/features/auth/session-controls";

export async function SiteHeader(
    { variant = "default" }: { variant?: "default" | "home" } = {},
) {
    const authenticated = await hasSession();
    const usesHomeDesign = variant === "home" || !authenticated;

    return (
        <header className={`site-header ${usesHomeDesign ? "home-header" : ""}`}>
            <div className="container site-header-inner">
                <Brand />
                <nav className="nav" aria-label="เมนูหลัก">
                    <Link href="/research">ค้นหาผลงาน</Link>
                    <Link href="/#categories">สำรวจหมวดหมู่</Link>
                    <Link href="/#about">เกี่ยวกับระบบ</Link>
                </nav>
                <div className="header-actions">
                    <LanguageSwitch />
                    {authenticated ? <LogoutButton /> : <ButtonLink href="/login" variant="secondary">เข้าสู่ระบบ</ButtonLink>}
                    <ButtonLink href="/dashboard/student/submit">ส่งผลงานวิจัย</ButtonLink>
                    {usesHomeDesign ? (
                        <details className="mobile-nav">
                            <summary aria-label="เปิดเมนูหลัก">
                                <span aria-hidden="true">☰</span>
                            </summary>
                            <nav className="mobile-nav-menu" aria-label="เมนูหลักบนมือถือ">
                                <Link href="/research">ค้นหาผลงาน</Link>
                                <Link href="/#categories">สำรวจหมวดหมู่</Link>
                                <Link href="/#about">เกี่ยวกับระบบ</Link>
                                <LanguageSwitch />
                                {authenticated ? (
                                    <LogoutButton />
                                ) : (
                                    <ButtonLink href="/login" variant="secondary">
                                        เข้าสู่ระบบ
                                    </ButtonLink>
                                )}
                                <ButtonLink href="/dashboard/student/submit">
                                    ส่งผลงานวิจัย
                                </ButtonLink>
                            </nav>
                        </details>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

export function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <div><Brand /><p>คลังรวบรวมและเผยแพร่ผลงานวิจัยระดับอุดมศึกษา เพื่อสร้างสรรค์สังคมแห่งการเรียนรู้ที่ยั่งยืน</p></div>
                <div><h3>QUICK LINKS</h3><p><Link href="/research">ค้นหาผลงาน</Link></p><p><Link href="/#categories">หมวดหมู่</Link></p><p><Link href="/dashboard/student/submit">ขั้นตอนการส่ง</Link></p></div>
                <div><h3>SUPPORT</h3><p>support@uniresearch.ac.th</p><p>02–123–4567</p></div>
                <div><LanguageSwitch /><p className="latin">© 2026 University Research Index.<br />Edit by SE67</p></div>
            </div>
        </footer>
    );
}

export function AuthShell({
    children,
    variant = "default",
}: {
    children: React.ReactNode;
    variant?: "default" | "login";
}) {
    return (
        <>
            <div className="auth-site-header"><SiteHeader variant="home" /></div>
            <div className={`auth-shell ${variant === "login" ? "login-auth-shell" : ""}`}><aside className="auth-brand-panel paper-grid"><div><p className="eyebrow">▥ Institutional Portal</p><h1 className="display" style={{ color: "var(--mulberry)" }}>เข้าถึงองค์ความรู้<br />ระดับอุดมศึกษา</h1><p className="muted">เครือข่ายการวิจัยที่เชื่อมโยงนักวิจัย นักศึกษา และสถาบันการศึกษาเข้าด้วยกัน</p></div><div className="rule" style={{ display: "flex", gap: 90, paddingTop: 32 }}><div><strong className="section-title latin">50k+</strong><small style={{ display: "block" }}>ผลงานตีพิมพ์</small></div><div><strong className="section-title latin">120+</strong><small style={{ display: "block" }}>สถาบันเครือข่าย</small></div></div></aside><main className="auth-main"><div className="auth-card">{children}<footer className="auth-footer"><span>นโยบายความเป็นส่วนตัว</span><span>ข้อกำหนดการใช้งาน</span><span>ช่วยเหลือ</span></footer></div></main></div>
        </>
    );
}

import { getCurrentUser } from "@/src/features/research/api";

export function ResearchRail({ active = "01", role = "guest" }: { active?: string; role?: string }) {
    let dashboardUrl = "/account/saved";
    if (role === "advisor" || role === "reviewer") {
        dashboardUrl = "/dashboard/reviewer";
    } else if (role === "admin") {
        dashboardUrl = "/admin";
    } else if (role === "guest") {
        dashboardUrl = "/login";
    }

    const submitUrl = role === "guest" ? "/login" : "/student/research/new";

    return (
        <aside className="rail">
            <span className="rail-year">2026</span>
            <nav aria-label="ดัชนีงานวิจัย">
                <Link className={active === "01" ? "active" : ""} href={dashboardUrl} title="แดชบอร์ด">01</Link>
                <Link className={active === "02" ? "active" : ""} href="/research" title="ค้นหางานวิจัย">02</Link>
                <Link className={active === "03" ? "active" : ""} href={submitUrl} title="ส่งผลงานวิจัย">03</Link>
            </nav>
            <span className="rail-label">INDEX RAIL</span>
        </aside>
    );
}

export async function DashboardShell({ children, active = "01" }: { children: React.ReactNode; active?: string }) {
    const authenticated = await hasSession();
    let role = "guest";
    let userName = "";
    if (authenticated) {
        const userResult = await getCurrentUser();
        if (userResult.ok) {
            role = userResult.data.role;
            userName = `${userResult.data.first_name || ""} ${userResult.data.last_name || ""}`.trim() || userResult.data.email;
        }
    }

    return (
        <div className="dashboard">
            <ResearchRail active={active} role={role} />
            <header className="dashboard-header">
                <Brand />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    {authenticated && userName && (
                        <span className="user-profile-badge" style={{ fontSize: "14px", color: "var(--mulberry)", fontWeight: "500" }}>
                            👤 {userName} ({role.toUpperCase()})
                        </span>
                    )}
                    <Link className="icon-btn" href="/research" aria-label="ค้นหา">⌕</Link>
                    {authenticated ? <LogoutButton /> : <ButtonLink href="/login" variant="secondary">เข้าสู่ระบบ</ButtonLink>}
                </div>
            </header>
            {children}
        </div>
    );
}

