import { getCategories } from "@/src/features/research/api";
import { getSessionToken } from "@/src/lib/api/session";
import { apiRequest } from "@/src/lib/api/client";
import type { ResearchWorkResponse } from "@/src/lib/api/types";
import { AdminReviewQueueDashboard } from "@/src/features/admin/admin-review-queue-dashboard";

export default async function AdminReviewQueuePage() {
  const categoriesResult = await getCategories();
  const token = await getSessionToken();
  
  // Fetch all research works on the server side to filter them into categories
  const allResearchResult = await apiRequest<ResearchWorkResponse[]>("/research/search", { token });

  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const allResearch = allResearchResult.ok ? allResearchResult.data : [];

  return (
    <main className="admin-main">
      <AdminReviewQueueDashboard 
        initialResearch={allResearch}
        categories={categories}
      />
    </main>
  );
}
