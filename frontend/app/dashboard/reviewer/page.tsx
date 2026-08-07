import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { KnownResearchIdForm } from "@/src/features/review/known-research-id-form";
import { getPendingResearch } from "@/src/features/research/api";
import { hasSession } from "@/src/lib/api/session";

export default async function ReviewerDashboard() {
  if (!await hasSession()) redirect("/login");

  const pendingResult = await getPendingResearch();

  return (
    <DashboardShell active="02">
      <main className="dash-main">
        <p className="eyebrow">[ พื้นที่ทำงานสำหรับอาจารย์ที่ปรึกษา / ผู้ดูแลระบบ ]</p>
        <h1 className="title">พื้นที่ทำงานตรวจประเมิน</h1>
        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          <KnownResearchIdForm />
          
          <div className="pending-queue-section" style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>รายการรอตรวจประเมิน (Review Queue)</h2>
            <p className="muted" style={{ marginBottom: "16px" }}>รายการผลงานวิจัยทั้งหมดในระบบที่มีสถานะเป็นรอการตรวจสอบ (Pending)</p>
            
            {!pendingResult.ok ? (
              <StatePanel kind="error" title="ไม่สามารถแสดงรายการรอตรวจได้" detail={`${pendingResult.error.message}`} />
            ) : pendingResult.data.length === 0 ? (
              <StatePanel kind="empty" title="ไม่มีผลงานวิจัยที่รอตรวจประเมิน" detail="ผลงานวิจัยทั้งหมดได้รับการประเมินเรียบร้อยแล้ว" />
            ) : (
              <div className="saved-list">
                {pendingResult.data.map(item => (
                  <article className="saved-row" key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="eyebrow" style={{ color: "var(--mulberry)" }}>[ รอตรวจสอบ ]</span>
                      <h2 style={{ fontSize: "16px", marginTop: "4px" }}>
                        <Link prefetch={false} href={`/advisor/reviews/${item.id}`}>
                          {item.title_th || item.title_en}
                        </Link>
                      </h2>
                      <div className="saved-meta" style={{ marginTop: "8px" }}>
                        <span className="mono">ID {item.id}</span>
                        {item.work_type && <span>ประเภท: {item.work_type}</span>}
                        {item.academic_year && <span>ปีการศึกษา: {item.academic_year}</span>}
                        <span>ส่งเมื่อ: {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.created_at))}</span>
                      </div>
                    </div>
                    <div style={{ marginLeft: "16px" }}>
                      <Link 
                        prefetch={false} 
                        href={`/advisor/reviews/${item.id}`} 
                        className="btn-text" 
                        style={{ color: "var(--mulberry)", fontWeight: "500" }}
                      >
                        ตรวจประเมิน →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
