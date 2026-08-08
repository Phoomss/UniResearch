import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getCurrentUser, getOptions } from "@/src/features/research/api";
import { ProfileForm } from "@/src/features/advisor/profile-form";
import { hasSession } from "@/src/lib/api/session";
import { getLanguage } from "@/src/lib/i18n";
import Link from "next/link";

export default async function StudentProfilePage() {
  if (!await hasSession()) {
    redirect(`/login?next=${encodeURIComponent("/student/profile")}`);
  }

  const [userResult, optionsResult] = await Promise.all([getCurrentUser(), getOptions()]);

  if (!userResult.ok) {
    if (userResult.error.status === 401) {
      redirect(`/login?next=${encodeURIComponent("/student/profile")}`);
    }
    return (
      <DashboardShell active="01">
        <main className="dash-main">
          <StatePanel kind="error" title="ไม่สามารถเข้าถึงข้อมูลโปรไฟล์ได้" detail={userResult.error.message} />
        </main>
      </DashboardShell>
    );
  }

  const user = userResult.data;
  const departments = optionsResult.ok ? optionsResult.data.departments : [];
  const lang = await getLanguage();
  const isEn = lang === "en";

  const t = {
    favorites: isEn ? "Favorites" : "รายการโปรดที่บันทึกไว้ (Favorites)",
    mySubmissions: isEn ? "My Submissions" : "ผลงานวิจัยของฉัน (My Submissions)",
    profile: isEn ? "Profile" : "ข้อมูลส่วนตัว (Profile)",
    personalSpace: isEn ? "My Space" : "พื้นที่ของฉัน",
    profileTitle: isEn ? "Personal Profile" : "ข้อมูลส่วนตัว"
  };

  return (
    <DashboardShell active="01">
      <main className="dash-main">
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #cdc3d030", paddingBottom: "12px" }}>
          <Link href="/account/saved" style={{ color: "var(--muted)", paddingBottom: "12px" }}>
            {t.favorites}
          </Link>
          <Link href="/student/research" style={{ color: "var(--muted)", paddingBottom: "12px" }}>
            {t.mySubmissions}
          </Link>
          <Link href="/student/profile" style={{ fontWeight: "bold", borderBottom: "2px solid var(--mulberry)", paddingBottom: "12px", marginBottom: "-14px", color: "var(--mulberry)" }}>
            {t.profile}
          </Link>
        </div>

        {/* Page Heading */}
        <header className="admin-page-heading" style={{ marginBottom: "24px" }}>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
            <UserRound size={16} />
            <span>{t.personalSpace}</span>
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>{t.profileTitle}</h1>
        </header>

        <section style={{ background: "white", padding: "32px", borderRadius: "16px", border: "1px solid rgba(0, 0, 0, 0.05)", boxShadow: "0 2px 10px rgba(0,0,0,0.01)", marginTop: "24px" }}>
          <ProfileForm initialUser={user} departments={departments} />
        </section>
      </main>
    </DashboardShell>
  );
}
