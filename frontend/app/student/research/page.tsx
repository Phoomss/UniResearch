import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getMyResearch } from "@/src/features/research/api";
import { StudentResearchList } from "@/src/features/research/student-research-list";
import { hasSession } from "@/src/lib/api/session";
import Link from "next/link";

export default async function StudentSubmissionsPage() {
  if (!await hasSession()) {
    redirect(`/login?next=${encodeURIComponent("/student/research")}`);
  }

  const myResearch = await getMyResearch();

  if (!myResearch.ok && myResearch.error.status === 401) {
    redirect(`/login?next=${encodeURIComponent("/student/research")}`);
  }

  return (
    <DashboardShell active="01">
      <main className="dash-main">
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #cdc3d030", paddingBottom: "12px" }}>
          <Link href="/account/saved" style={{ color: "var(--muted)", paddingBottom: "12px" }}>
            รายการโปรดที่บันทึกไว้ (Favorites)
          </Link>
          <Link href="/student/research" style={{ fontWeight: "bold", borderBottom: "2px solid var(--mulberry)", paddingBottom: "12px", marginBottom: "-14px", color: "var(--mulberry)" }}>
            ผลงานวิจัยของฉัน (My Submissions)
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <p className="eyebrow">[ คลังผลงานส่วนตัว ]</p>
            <h1 className="title" style={{ margin: 0 }}>ผลงานวิจัยของฉัน</h1>
            <p className="muted" style={{ marginTop: "4px" }}>
              แสดงรายการผลงานวิจัยทั้งหมดที่คุณส่งหรือมีส่วนร่วมอัปโหลดขึ้นระบบในทุกสถานะการประเมิน
            </p>
          </div>
          <Link className="btn btn-primary" href="/student/research/new">
            + ส่งผลงานวิจัยใหม่
          </Link>
        </div>

        {!myResearch.ok ? (
          <StatePanel
            kind="error"
            title="ไม่สามารถแสดงผลงานวิจัยของคุณได้"
            detail={`${myResearch.error.message} [${myResearch.error.code}]`}
          />
        ) : myResearch.data.length === 0 ? (
          <StatePanel
            kind="empty"
            title="ไม่มีผลงานวิจัยของคุณในระบบ"
            detail="คุณยังไม่ได้ยื่นส่งหรือมีส่วนร่วมในผลงานวิจัยใด ๆ ในระบบ"
          />
        ) : (
          <StudentResearchList initialItems={myResearch.data} />
        )}
      </main>
    </DashboardShell>
  );
}
