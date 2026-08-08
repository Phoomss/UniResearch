import type { CategoryResponse } from "@/src/lib/api/types";

export function CategoryTable({ categories }: { categories: CategoryResponse[] }) {
  return (
    <div className="table-wrap" role="region" aria-label="หมวดหมู่งานวิจัยในปัจจุบัน" tabIndex={0}>
      <table className="admin-table"><caption className="sr-only">หมวดหมู่งานวิจัยในปัจจุบัน</caption><thead><tr><th scope="col">รหัส (ID)</th><th scope="col">ชื่อหมวดหมู่</th><th scope="col">คำอธิบาย</th></tr></thead><tbody>{categories.map(category => <tr key={category.id}><td className="mono">{category.id}</td><td>{category.category_name}</td><td>{category.description ?? "ไม่ได้ระบุ"}</td></tr>)}</tbody></table>
    </div>
  );
}
