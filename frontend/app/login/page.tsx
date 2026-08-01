import { AuthShell } from "@/src/components/shells";
import { LoginForm } from "@/src/features/auth/auth-form";

export default function LoginPage(){ return <AuthShell><p className="eyebrow">● Authentication</p><h1 className="title">ยินดีต้อนรับกลับสู่<br/><em className="latin" style={{color:"var(--mulberry)",fontWeight:500}}>UniResearch</em></h1><p className="muted">เข้าสู่ระบบเพื่อส่งผลงานและดำเนินการที่ต้องยืนยันตัวตน ไม่มี Google OAuth หรือการกู้รหัสผ่านในระบบหลังบ้านปัจจุบัน</p><LoginForm/></AuthShell>; }
