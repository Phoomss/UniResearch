import { ParticipantDirectory } from "@/src/features/advisor/participant-directory";
import { getResearchParticipants } from "@/src/features/research/api";

export default async function AdvisorParticipantsPage() {
  const result = await getResearchParticipants();
  const data = result.ok ? result.data : { authors: [], advisors: [] };
  return (
    <main className="admin-main">
      <header className="admin-page-heading"><p>ข้อมูลผู้เกี่ยวข้อง <span>ใช้ประกอบการส่งและตรวจผลงาน</span></p><h1>นักศึกษาและอาจารย์ที่ปรึกษา</h1></header>
      <section className="advisor-directory-metrics admin-metric-grid">
        <article><div><span>นักศึกษา</span></div><strong>{data.authors.length}</strong><small>[ บัญชีที่เปิดใช้งาน ]</small></article>
        <article><div><span>อาจารย์ที่ปรึกษา</span></div><strong>{data.advisors.length}</strong><small>[ บัญชีที่เปิดใช้งาน ]</small></article>
      </section>
      <p className="muted">หน้านี้เป็นรายชื่อสำหรับอ้างอิงและเลือกผู้เกี่ยวข้องเท่านั้น Advisor ไม่มีสิทธิ์สร้าง แก้ไข หรือปิดบัญชีผู้ใช้</p>
      <ParticipantDirectory authors={data.authors} advisors={data.advisors} />
    </main>
  );
}
