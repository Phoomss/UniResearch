"use client";

import { Button } from "@/src/components/ui";

export default function AdvisorError({ reset }: { error: Error; reset: () => void }) {
  return <main className="admin-main"><div className="panel"><p className="eyebrow">[ Advisor workspace error ]</p><h1 className="section-title">ไม่สามารถเปิดพื้นที่อาจารย์ที่ปรึกษาได้</h1><p className="muted">กรุณาตรวจสอบการเชื่อมต่อ Backend หรือเข้าสู่ระบบใหม่</p><Button type="button" onClick={reset}>ลองอีกครั้ง</Button></div></main>;
}
