import { getCategories, getCurrentUser, getMyResearch, getPendingResearch, searchResearch } from "@/src/features/research/api";
import { AdvisorDashboard } from "@/src/features/advisor/advisor-dashboard";
import { StatePanel } from "@/src/components/ui";

export default async function AdvisorOverview() {
  const [allResult, pendingResult, mineResult, categoriesResult, userResult] = await Promise.all([
    searchResearch({}),
    getPendingResearch(),
    getMyResearch(),
    getCategories(),
    getCurrentUser(),
  ]);

  if (!userResult.ok) {
    return (
      <main className="admin-main">
        <StatePanel kind="error" title="ไม่พบข้อมูลผู้ใช้" detail="กรุณาเข้าสู่ระบบใหม่อีกครั้ง" />
      </main>
    );
  }

  const allResearch = allResult.ok ? allResult.data : [];
  const pendingResearch = pendingResult.ok ? pendingResult.data : [];
  const myResearch = mineResult.ok ? mineResult.data : [];
  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const user = userResult.data;

  return (
    <main className="admin-main">
      <AdvisorDashboard
        allResearch={allResearch}
        pendingResearch={pendingResearch}
        myResearch={myResearch}
        categories={categories}
        user={user}
      />
    </main>
  );
}
