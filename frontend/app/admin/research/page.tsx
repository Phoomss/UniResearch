import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { adminResearchSamples, type AdminResearchRecord } from "@/src/features/admin/admin-data";
import { getCategories, searchResearch } from "@/src/features/research/api";

export default async function AdminResearchPage() {
  const [researchResult, categoryResult] = await Promise.all([searchResearch({}), getCategories()]);
  const categories = categoryResult.ok ? categoryResult.data : [];
  const supportedStatus = (status: string): AdminResearchRecord["status"] =>
    (["pending", "approved", "rejected", "revision_needed"] as string[]).includes(status)
      ? status as AdminResearchRecord["status"] : "pending";
  const records: AdminResearchRecord[] = researchResult.ok && researchResult.data.length
    ? researchResult.data.map((item) => ({ id: item.id, ref: `RES-${String(item.id).padStart(4, "0")}`, title: item.title_th, titleEn: item.title_en, author: `ผู้ส่งผลงาน #${item.submitted_by_id}`, advisor: item.department ?? "ไม่ระบุ", category: categories.find((category) => category.id === item.category_id)?.category_name ?? `หมวดหมู่ #${item.category_id}`, year: item.academic_year?.toString() ?? "ไม่ระบุ", status: supportedStatus(item.status), updated: new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.updated_at)), abstract: item.abstract ?? "ไม่มีบทคัดย่อ", views: item.view_count, downloads: item.download_count }))
    : adminResearchSamples;
  return <main className="admin-main"><header className="admin-page-heading admin-heading-actions"><div><p>คลังผลงานวิจัย <span>ระบบจัดการข้อมูล</span></p><h1>จัดการผลงานวิจัย</h1></div><div><Link className="admin-primary-action" href="/student/research/new"><Plus size={17} />เพิ่มผลงานวิจัยใหม่</Link><button className="admin-secondary-action" type="button" disabled title="ระบบส่วนหลังยังไม่มีระบบส่งออกข้อมูล"><Download size={17} />ส่งออกข้อมูล</button></div></header><AdminResearchManager records={records} /></main>;
}
