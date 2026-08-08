import { getStats, getCategories } from "@/src/features/research/api";
import { getSessionToken } from "@/src/lib/api/session";
import { apiRequest } from "@/src/lib/api/client";
import type { ResearchWorkResponse } from "@/src/lib/api/types";
import { AdminAnalyticsDashboard } from "@/src/features/admin/admin-analytics-dashboard";

export default async function AdminAnalyticsPage() {
  const statsResult = await getStats();
  const categoriesResult = await getCategories();
  const token = await getSessionToken();
  
  // Fetch all research works on the server side
  const researchResult = await apiRequest<ResearchWorkResponse[]>("/research/search", { token });
  
  const stats = statsResult.ok 
    ? statsResult.data 
    : { total_users: 0, total_research_works: 0, total_views: 0, total_downloads: 0 };
    
  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const allResearch = researchResult.ok ? researchResult.data : [];

  return (
    <main className="admin-main">
      <AdminAnalyticsDashboard 
        initialStats={stats}
        initialCategories={categories}
        initialResearch={allResearch}
      />
    </main>
  );
}
