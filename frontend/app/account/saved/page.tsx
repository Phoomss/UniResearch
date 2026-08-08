import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { listFavorites } from "@/src/features/research/api";
import { SavedResearchList } from "@/src/features/research/saved-research-list";
import { hasSession } from "@/src/lib/api/session";

import Link from "next/link";

export default async function SavedResearchPage() {
  if (!await hasSession()) redirect(`/login?next=${encodeURIComponent("/account/saved")}`);

  const favorites = await listFavorites();

  if (!favorites.ok && favorites.error.status === 401) redirect(`/login?next=${encodeURIComponent("/account/saved")}`);

  return (
    <DashboardShell>
      <main className="dash-main">
        <p className="eyebrow">[ คลังผลงานส่วนตัว ]</p>
        <h1 className="title">ผลงานวิจัยที่บันทึกไว้</h1>
        <p className="muted">รายการโปรดสามารถใช้งานได้สำหรับทุกบัญชีผู้ใช้งานที่เปิดใช้งาน ระบบหลังบ้านจะส่งคืนเฉพาะไอดีผลงานวิจัยและวันที่บันทึกเท่านั้น ดัชนีนี้จึงไม่ได้สร้างชื่อเรื่องหรือข้อมูลเมทาดาตาขึ้นมาเอง</p>
        
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #cdc3d030", paddingBottom: "12px" }}>
          <Link href="/account/saved" style={{ fontWeight: "bold", borderBottom: "2px solid var(--mulberry)", paddingBottom: "12px", marginBottom: "-14px", color: "var(--mulberry)" }}>
            รายการโปรดที่บันทึกไว้ (Favorites)
          </Link>
          <Link href="/student/research" style={{ color: "var(--muted)", paddingBottom: "12px" }}>
            ผลงานวิจัยของฉัน (My Submissions)
          </Link>
        </div>
        {!favorites.ok ? (
          <StatePanel kind="error" title="ไม่สามารถแสดงผลงานวิจัยที่บันทึกไว้ได้" detail={`${favorites.error.message} [${favorites.error.code}]`} />
        ) : favorites.data.length === 0 ? (
          <StatePanel kind="empty" title="ไม่มีผลงานวิจัยที่บันทึกไว้" detail="เปิดดูหน้ารายละเอียดผลงานวิจัยแล้วเลือก 'บันทึกผลงาน' เพื่อเพิ่มลงในรายการนี้" />
        ) : (
          <SavedResearchList items={favorites.data} />
        )}
      </main>
    </DashboardShell>
  );
}
