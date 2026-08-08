import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, getCurrentUser, searchResearch } from "@/src/features/research/api";

export default async function AdvisorReviewHistoryPage() {
  const [researchResult, categoryResult, userResult] = await Promise.all([searchResearch({}), getCategories(), getCurrentUser()]);
  const all = researchResult.ok ? researchResult.data : [];
  const userId = userResult.ok ? userResult.data.id : -1;
  const reviewed = all.filter((item) => item.reviews?.some((review) => review.reviewer_id === userId));
  const categories = categoryResult.ok ? categoryResult.data : [];
  return <main className="admin-main"><header className="admin-page-heading"><p>ประวัติการดำเนินการ <span>อ้างอิงจากความคิดเห็นที่บันทึกโดยบัญชีนี้</span></p><h1>ประวัติการตรวจของฉัน</h1></header><p className="muted">ระบบยังไม่มี endpoint ประวัติแยกเฉพาะ จึงคำนวณรายการนี้จาก review history ที่มากับข้อมูลผลงาน</p><AdminResearchManager records={toAdvisorResearchRecords(reviewed, categories)} reviewBasePath="/advisor/reviews" /></main>;
}
