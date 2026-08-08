import type { AdminResearchRecord } from "@/src/features/admin/admin-data";
import type { CategoryResponse, ResearchWorkResponse } from "@/src/lib/api/types";

function normalizedStatus(status: string): AdminResearchRecord["status"] {
  if (status === "approved" || status === "rejected" || status === "pending") return status;
  if (status === "needs_revision" || status === "revision_needed") return "revision_needed";
  return "pending";
}

export function toAdvisorResearchRecords(items: ResearchWorkResponse[], categories: CategoryResponse[]): AdminResearchRecord[] {
  return items.map((item) => {
    const primaryAuthor = item.authors?.[0]?.user;
    const authorName = primaryAuthor
      ? `${primaryAuthor.first_name || ""} ${primaryAuthor.last_name || ""}`.trim() || primaryAuthor.email
      : `ผู้ส่งผลงาน #${item.submitted_by_id}`;
    const advisor = item.advisors?.[0]?.user;
    const advisorName = advisor
      ? `${advisor.first_name || ""} ${advisor.last_name || ""}`.trim() || advisor.email
      : "ไม่ระบุ";

    return {
      id: item.id,
      ref: `RES-${String(item.id).padStart(4, "0")}`,
      title: item.title_th,
      titleEn: item.title_en,
      author: authorName,
      advisor: advisorName,
      category: categories.find((category) => category.id === item.category_id)?.category_name ?? `หมวดหมู่ #${item.category_id}`,
      year: item.academic_year?.toString() ?? "ไม่ระบุ",
      status: normalizedStatus(item.status),
      updated: new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(item.updated_at)),
      abstract: item.abstract ?? "ไม่มีบทคัดย่อ",
      views: item.view_count,
      downloads: item.download_count,
    };
  });
}
