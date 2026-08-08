import { AdminReviewQueueDashboard } from "@/src/features/admin/admin-review-queue-dashboard";
import { getCategories, searchResearch } from "@/src/features/research/api";

export default async function AdvisorReviewQueuePage() {
  const [researchResult, categoriesResult] = await Promise.all([searchResearch({}), getCategories()]);
  return (
    <main className="admin-main">
      <AdminReviewQueueDashboard
        initialResearch={researchResult.ok ? researchResult.data : []}
        categories={categoriesResult.ok ? categoriesResult.data : []}
        reviewBasePath="/advisor/reviews"
        heading="คิวตรวจประเมิน"
        eyebrow="พื้นที่ดำเนินการของอาจารย์ที่ปรึกษา"
      />
    </main>
  );
}
