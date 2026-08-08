import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, getReviewHistory } from "@/src/features/research/api";

export default async function AdvisorReviewHistoryPage() {
  const [historyResult, categoryResult] = await Promise.all([getReviewHistory(), getCategories()]);
  const reviewed = historyResult.ok ? historyResult.data : [];
  const categories = categoryResult.ok ? categoryResult.data : [];
  
  return (
    <main className="admin-main">
      <header className="admin-page-heading">
        <p>ประวัติการดำเนินการ <span>ข้อมูลประวัติความเห็นและผลการประเมินจากระบบ</span></p>
        <h1>ประวัติการตรวจของฉัน</h1>
      </header>
      <AdminResearchManager 
        records={toAdvisorResearchRecords(reviewed, categories)} 
        reviewBasePath="/advisor/reviews" 
      />
    </main>
  );
}
