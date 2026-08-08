import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, searchResearch } from "@/src/features/research/api";

export default async function AdvisorResearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim();
  const [researchResult, categoryResult] = await Promise.all([searchResearch({ q: query }), getCategories()]);
  const categories = categoryResult.ok ? categoryResult.data : [];
  const records = toAdvisorResearchRecords(researchResult.ok ? researchResult.data : [], categories);
  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-heading-actions"><div><p>คลังผลงานวิจัย <span>มองเห็นทุกสถานะตามสิทธิ์ Advisor</span></p><h1>ผลงานวิจัยทั้งหมด</h1></div><div><Link className="admin-primary-action" href="/advisor/new"><FilePlus2 size={17} />ส่งผลงานใหม่</Link></div></header>
      {query && <p className="muted">ผลการค้นหาสำหรับ “{query}” จำนวน {records.length} รายการ</p>}
      <AdminResearchManager records={records} reviewBasePath="/advisor/reviews" />
    </main>
  );
}
