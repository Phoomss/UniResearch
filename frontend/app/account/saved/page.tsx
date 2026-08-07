import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getMyResearch } from "@/src/features/research/api";
import { SavedResearchList } from "@/src/features/research/saved-research-list";
import { hasSession } from "@/src/lib/api/session";

export default async function SavedResearchPage() {
  if (!await hasSession()) redirect(`/login?next=${encodeURIComponent("/account/saved")}`);

  const myResearch = await getMyResearch();

  if (!myResearch.ok && myResearch.error.status === 401) redirect(`/login?next=${encodeURIComponent("/account/saved")}`);

  return (
    <DashboardShell>
      <main className="dash-main">
        <p className="eyebrow">[ คลังผลงานส่วนตัว ]</p>
        <h1 className="title">ผลงานวิจัยของฉัน</h1>
        <p className="muted">รายการผลงานวิจัยที่คุณเป็นผู้สร้างหรือผู้ส่งเข้าระบบในทุกสถานะการดำเนินงาน</p>
        {!myResearch.ok ? (
          <StatePanel kind="error" title="ไม่สามารถแสดงผลงานวิจัยของคุณได้" detail={`${myResearch.error.message} [${myResearch.error.code}]`} />
        ) : myResearch.data.length === 0 ? (
          <StatePanel kind="empty" title="ไม่มีผลงานวิจัยของคุณในระบบ" detail="คุณยังไม่ได้ยื่นส่งผลงานวิจัยใดๆ ในระบบ" />
        ) : (
          <SavedResearchList items={myResearch.data} />
        )}
      </main>
    </DashboardShell>
  );
}
