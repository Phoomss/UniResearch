import { UserRound } from "lucide-react";
import { StatePanel } from "@/src/components/ui";
import { getCurrentUser, getOptions } from "@/src/features/research/api";
import { ProfileForm } from "@/src/features/advisor/profile-form";

export default async function AdminProfilePage() {
  const [userResult, optionsResult] = await Promise.all([getCurrentUser(), getOptions()]);

  if (!userResult.ok) {
    return (
      <main className="admin-main">
        <StatePanel kind="error" title="ไม่สามารถเข้าถึงข้อมูลโปรไฟล์ได้" detail={userResult.error.message} />
      </main>
    );
  }

  const user = userResult.data;
  const departments = optionsResult.ok ? optionsResult.data.departments : [];

  return (
    <main className="admin-main">
      {/* Page Heading */}
      <header className="admin-page-heading" style={{ marginBottom: "24px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
          <UserRound size={16} />
          <span>พื้นที่ของฉัน</span>
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>ข้อมูลส่วนตัว</h1>
      </header>

      <section className="admin-profile-card" style={{ background: "white", padding: "32px", borderRadius: "16px", border: "1px solid rgba(0, 0, 0, 0.05)", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
        <ProfileForm initialUser={user} departments={departments} />
      </section>
    </main>
  );
}
