import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, getCurrentUser, searchResearch } from "@/src/features/research/api";

export default async function AdvisorAdviseesPage() {
  const [researchResult, categoryResult, userResult] = await Promise.all([searchResearch({}), getCategories(), getCurrentUser()]);
  const all = researchResult.ok ? researchResult.data : [];
  const userId = userResult.ok ? userResult.data.id : -1;
  const advised = all.filter((item) => item.advisors?.some((advisor) => advisor.user_id === userId));
  const categories = categoryResult.ok ? categoryResult.data : [];
  return <main className="admin-main"><header className="admin-page-heading"><p>พื้นที่ให้คำปรึกษา <span>กรองจากความสัมพันธ์ advisor ของผลงาน</span></p><h1>งานในความดูแล</h1></header><p className="muted">รายการนี้แสดงผลงานที่บัญชีของคุณถูกระบุเป็นอาจารย์ที่ปรึกษา การเป็นที่ปรึกษาไม่ให้สิทธิ์แก้ไขหรือลบผลงานโดยอัตโนมัติ</p><AdminResearchManager records={toAdvisorResearchRecords(advised, categories)} reviewBasePath="/advisor/reviews" /></main>;
}
