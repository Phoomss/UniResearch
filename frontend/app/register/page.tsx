import { AuthShell } from "@/src/components/shells";
import { RegisterForm } from "@/src/features/auth/auth-form";

export default function RegisterPage() {
  return (
    <AuthShell>
      <p className="eyebrow">[ Research Archive • Student Access ]</p>
      <h1 className="title">
        สร้างบัญชี
        <br />
        <span className="latin">UniResearch</span>
      </h1>
      <p className="muted">การสมัครผ่านหน้านี้สร้างบัญชีนักศึกษาเท่านั้น สิทธิ์จริงยังยึดตามระบบหลังบ้าน</p>
      <RegisterForm />
    </AuthShell>
  );
}
