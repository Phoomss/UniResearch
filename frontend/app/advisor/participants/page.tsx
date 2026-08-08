import { UsersRound, GraduationCap, UserCheck } from "lucide-react";
import { ParticipantDirectory } from "@/src/features/advisor/participant-directory";
import { getResearchParticipants } from "@/src/features/research/api";

export default async function AdvisorParticipantsPage() {
  const result = await getResearchParticipants();
  const data = result.ok ? result.data : { authors: [], advisors: [] };
  
  return (
    <main className="admin-main">
      {/* Page Heading */}
      <header className="admin-page-heading" style={{ marginBottom: "20px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
          <UsersRound size={16} />
          <span>ข้อมูลผู้เกี่ยวข้อง</span>
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>นักศึกษาและอาจารย์ที่ปรึกษา</h1>
      </header>

      {/* Stats Summary Widgets */}
      <section className="adv-stats-grid advisor-directory-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "24px" }}>
        {/* Student Count Card */}
        <div className="adv-stat-card flex-row blue-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-blue-light" style={{ width: "42px", height: "42px" }}>
            <GraduationCap size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>นักศึกษา</span>
            <strong className="adv-card-value" style={{ fontSize: "24px" }}>{data.authors.length}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>บัญชีที่เปิดใช้งานในระบบ</span>
          </div>
        </div>

        {/* Advisor Count Card */}
        <div className="adv-stat-card flex-row purple-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-purple-light" style={{ width: "42px", height: "42px" }}>
            <UserCheck size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>อาจารย์ที่ปรึกษา</span>
            <strong className="adv-card-value" style={{ fontSize: "24px" }}>{data.advisors.length}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>บัญชีที่เปิดใช้งานในระบบ</span>
          </div>
        </div>
      </section>

      <p className="muted" style={{ fontSize: "13.5px", marginBottom: "20px", color: "#6b7280" }}>
        หน้านี้เป็นรายชื่อสำหรับอ้างอิงรายชื่อและเลือกผู้เกี่ยวข้องในโครงการวิจัยเท่านั้น 
        บัญชีผู้ใช้จะได้รับการจัดการโดยผู้ดูแลระบบของคณะ/สถาบัน
      </p>

      {/* Directory Component */}
      <ParticipantDirectory authors={data.authors} advisors={data.advisors} />
    </main>
  );
}
