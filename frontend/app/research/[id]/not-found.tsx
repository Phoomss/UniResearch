import { StatePanel, ButtonLink } from "@/src/components/ui";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "100px 0" }}>
      <StatePanel kind="empty" title="ไม่พบงานวิจัย" detail="รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ" />
      <p style={{ textAlign: "center" }}>
        <ButtonLink href="/research">กลับไปค้นหาผลงาน</ButtonLink>
      </p>
    </main>
  );
}
