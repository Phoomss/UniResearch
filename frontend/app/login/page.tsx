import { AuthShell } from "@/src/components/shells";
import { LoginForm } from "@/src/features/auth/auth-form";

function safeNext(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account/saved";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; registered?: string }>;
}) {
  const query = await searchParams;

  return (
    <AuthShell variant="login">
      <p className="eyebrow">● Authentication</p>
      <h1 className="title">
        ยินดีต้อนรับกลับสู่
        <br />
        <em className="latin" style={{ color: "var(--mulberry)", fontWeight: 500 }}>
          UniResearch
        </em>
      </h1>
      <p className="muted">เข้าสู่ระบบเพื่อส่งผลงานและดำเนินการที่ต้องยืนยันตัวตน </p>
      {query.registered === "1" && <p className="status-message success" role="status">สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ</p>}
      <LoginForm nextPath={safeNext(query.next)} />
    </AuthShell>
  );
}
