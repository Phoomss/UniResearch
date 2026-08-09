import { Download, Eye, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminReviewDecision } from "@/src/features/admin/admin-review-decision";
import { getCategories, getResearch } from "@/src/features/research/api";
import { adaptResearch } from "@/src/features/research/adapters";
import { hasSession } from "@/src/lib/api/session";

export default async function AdminReviewWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();

  const [result, categories, authenticated] = await Promise.all([
    getResearch(id),
    getCategories(),
    hasSession(),
  ]);

  if (!result.ok) {
    if (result.error.status === 404) notFound();
    return (
      <main className="admin-main">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
          <p className="muted">{result.error.message}</p>
        </div>
      </main>
    );
  }

  const item = adaptResearch(result.data, categories.ok ? categories.data : []);

  // Format dates
  const submitDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(result.data.created_at));
  const dueDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(
    new Date(new Date(result.data.created_at).getTime() + 14 * 24 * 60 * 60 * 1000)
  );

  return (
    <main className="admin-main admin-review-workspace">
      <header className="admin-review-document-heading">
        <div>
          <p>
            <span>{item.category}</span>
            <code>ID: {item.ref}</code>
          </p>
          <h1>{item.titleTh}</h1>
          <h2>{item.titleEn}</h2>
        </div>
        <dl>
          <div>
            <dt>วันที่ส่งผลงาน</dt>
            <dd>[ {submitDate} ]</dd>
          </div>
          <div>
            <dt>วันครบกำหนด</dt>
            <dd className="due">[ {dueDate} ]</dd>
          </div>
        </dl>
      </header>

      <div className="admin-review-layout">
        <div className="admin-review-content">
          <section className="admin-abstract">
            <h3>บทคัดย่อ (Abstract)</h3>
            <p>{item.abstract || "ไม่มีบทคัดย่อ"}</p>
          </section>

          <section className="admin-team">
            <header>
              <h3>ผู้จัดทำและอาจารย์</h3>
              <span>[ สมาชิก {(item.authors?.length || 0) + (item.advisors?.length || 0)} คน ]</span>
            </header>
            <div>
              {item.authors?.map((a, index) => {
                const name = `${a.user.first_name || ""} ${a.user.last_name || ""}`.trim();
                const initial = a.user.first_name ? a.user.first_name.substring(0, 2).toUpperCase() : "U";
                return (
                  <article key={`author-${a.id}`}>
                    <span>{initial}</span>
                    <div>
                      <strong>{name || a.user.email}</strong>
                      <small>{index === 0 ? "ผู้วิจัยหลัก" : "ผู้วิจัยร่วม"}</small>
                    </div>
                  </article>
                );
              })}
              {item.advisors?.map((adv) => {
                const name = `${adv.user.first_name || ""} ${adv.user.last_name || ""}`.trim();
                const initial = adv.user.first_name ? adv.user.first_name.substring(0, 2).toUpperCase() : "AD";
                return (
                  <article key={`advisor-${adv.id}`}>
                    <span>{initial}</span>
                    <div>
                      <strong>{name || adv.user.email}</strong>
                      <small>อาจารย์ที่ปรึกษา</small>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="admin-manuscript">
            <header>
              <div>
                <h3>ไฟล์เอกสารงานวิจัย</h3>
                {item.hasDocument ? (
                  <p>{item.ref}_Manuscript.pdf</p>
                ) : (
                  <p className="muted">ไม่มีไฟล์เอกสารที่แนบมา</p>
                )}
              </div>
              {item.hasDocument && result.data.file_path && (
                <div>
                  <a 
                    href={`/api/assets?path=${encodeURIComponent(result.data.file_path)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", height: "36px", padding: "0 16px", borderRadius: "6px" }}
                  >
                    <Eye size={16} />ดูตัวอย่าง
                  </a>
                  <a 
                    href={`/api/assets?path=${encodeURIComponent(result.data.file_path)}`}
                    download
                    className="btn btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", height: "36px", padding: "0 16px", borderRadius: "6px" }}
                  >
                    <Download size={16} />ดาวน์โหลด
                  </a>
                </div>
              )}
            </header>
            {item.hasDocument && result.data.file_path ? (
              <a 
                href={`/api/assets?path=${encodeURIComponent(result.data.file_path)}`}
                target="_blank"
                rel="noreferrer"
                className="admin-document-preview"
                style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit" }}
              >
                <FileText size={42} /><i /><i /><i />
                <span>คลิกเพื่อขยายดูตัวอย่างหน้าจอ</span>
              </a>
            ) : (
              <div className="admin-document-preview">
                <FileText size={42} style={{ opacity: 0.3 }} />
                <span>ไม่มีเอกสารงานวิจัย</span>
              </div>
            )}
          </section>
        </div>

        <aside className="admin-review-sidebar">
          <AdminReviewDecision researchId={item.id} currentStatus={item.statusRaw} />
          
          <section className="admin-review-history">
            <h3>ประวัติการตรวจสอบ</h3>
            {item.reviews && item.reviews.length > 0 ? (
              [...item.reviews].reverse().map((review) => {
                const statusLabel = 
                  review.status_result === "approved" ? "อนุมัติผลงาน" :
                  review.status_result === "rejected" ? "ปฏิเสธผลงาน" : "ส่งกลับแก้ไข";
                return (
                  <article key={review.id}>
                    <i />
                    <strong>{statusLabel}</strong>
                    <small>{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(review.created_at))}</small>
                    <p>{review.comment_text}</p>
                  </article>
                );
              })
            ) : (
              <p className="muted" style={{ padding: "16px 0", fontSize: "14px" }}>ยังไม่มีประวัติการประเมินหรือตรวจสอบผลงานนี้</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
