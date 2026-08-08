import { StatePanel } from "@/src/components/ui";
import { CategoryForm } from "@/src/features/admin/category-form";
import { CategoryTable } from "@/src/features/admin/category-table";
import { getCategories } from "@/src/features/research/api";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
      <main className="dash-main admin-categories-page">
        <p className="eyebrow">[ การดูแลระบบที่รองรับ ]</p>
        <h1 className="title">หมวดหมู่งานวิจัย</h1>
        <p className="muted">ระบบส่วนหลัง (Backend) รองรับการแสดงรายการและสร้างหมวดหมู่เท่านั้น ไม่รองรับการแก้ไข การลบ สลัก (slug) หรือรายละเอียดหมวดหมู่ สิทธิ์ในการสร้างจะถูกควบคุมโดยส่วนหลัง</p>
        <div className="dashboard-grid category-workspace">
          <section className="panel">
            <h2 className="section-title">หมวดหมู่ในปัจจุบัน</h2>
            {!categories.ok ? <StatePanel kind="error" title="ไม่สามารถโหลดข้อมูลหมวดหมู่ได้" detail={`${categories.error.message} [${categories.error.code}]`} /> : categories.data.length === 0 ? <StatePanel kind="empty" title="ไม่มีหมวดหมู่" detail="ผู้ดูแลระบบสามารถสร้างหมวดหมู่แรกได้โดยใช้ฟอร์มในหน้านี้" /> : <CategoryTable categories={categories.data} />}
          </section>
          <CategoryForm />
        </div>
      </main>
  );
}
