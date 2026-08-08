import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getMyResearch } from "@/src/features/research/api";
import { StudentResearchList } from "@/src/features/research/student-research-list";
import { hasSession } from "@/src/lib/api/session";
import { getLanguage } from "@/src/lib/i18n";
import Link from "next/link";

export default async function StudentSubmissionsPage() {
  if (!await hasSession()) {
    redirect(`/login?next=${encodeURIComponent("/student/research")}`);
  }

  const lang = await getLanguage();
  const myResearch = await getMyResearch();

  if (!myResearch.ok && myResearch.error.status === 401) {
    redirect(`/login?next=${encodeURIComponent("/student/research")}`);
  }

  const isEn = lang === "en";

  const t = {
    favorites: isEn ? "Favorites" : "รายการโปรดที่บันทึกไว้ (Favorites)",
    mySubmissions: isEn ? "My Submissions" : "ผลงานวิจัยของฉัน (My Submissions)",
    profile: isEn ? "Profile" : "ข้อมูลส่วนตัว (Profile)",
    personalRepo: isEn ? "Personal Repository" : "คลังผลงานส่วนตัว",
    mySubmissionsTitle: isEn ? "My Submissions" : "ผลงานวิจัยของฉัน",
    mySubmissionsSubtitle: isEn 
      ? "Displays all research works you have submitted or uploaded to the system in all review statuses."
      : "แสดงรายการผลงานวิจัยทั้งหมดที่คุณส่งหรือมีส่วนร่วมอัปโหลดขึ้นระบบในทุกสถานะการประเมิน",
    submitNewResearch: isEn ? "+ Submit New Research" : "+ ส่งผลงานวิจัยใหม่",
    errorTitle: isEn ? "Unable to display your research works" : "ไม่สามารถแสดงผลงานวิจัยของคุณได้",
    emptyTitle: isEn ? "No research works found" : "ไม่มีผลงานวิจัยของคุณในระบบ",
    emptyDetail: isEn 
      ? "You have not submitted or participated in any research works in the system."
      : "คุณยังไม่ได้ยื่นส่งหรือมีส่วนร่วมในผลงานวิจัยใด ๆ ในระบบ"
  };

  return (
    <DashboardShell active="01">
      <main className="dash-main">
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #cdc3d030", paddingBottom: "12px" }}>
          <Link href="/account/saved" style={{ color: "var(--muted)", paddingBottom: "12px" }}>
            {t.favorites}
          </Link>
          <Link href="/student/research" style={{ fontWeight: "bold", borderBottom: "2px solid var(--mulberry)", paddingBottom: "12px", marginBottom: "-14px", color: "var(--mulberry)" }}>
            {t.mySubmissions}
          </Link>
          <Link href="/student/profile" style={{ color: "var(--muted)", paddingBottom: "12px" }}>
            {t.profile}
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <p className="eyebrow">[ {t.personalRepo} ]</p>
            <h1 className="title" style={{ margin: 0 }}>{t.mySubmissionsTitle}</h1>
            <p className="muted" style={{ marginTop: "4px" }}>
              {t.mySubmissionsSubtitle}
            </p>
          </div>
          <Link className="btn btn-primary" href="/student/research/new">
            {t.submitNewResearch}
          </Link>
        </div>

        {!myResearch.ok ? (
          <StatePanel
            kind="error"
            title={t.errorTitle}
            detail={`${myResearch.error.message} [${myResearch.error.code}]`}
          />
        ) : myResearch.data.length === 0 ? (
          <StatePanel
            kind="empty"
            title={t.emptyTitle}
            detail={t.emptyDetail}
          />
        ) : (
          <StudentResearchList initialItems={myResearch.data} />
        )}
      </main>
    </DashboardShell>
  );
}
