"use client";
import { type FormEvent } from "react";
import { Button, Field, Input } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";

export function KnownResearchIdForm() {
  const { error } = useToast();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("research_id") ?? "").trim();
    const id = Number(value);
    if (!value || !Number.isInteger(id) || id<1) { 
      error("กรุณาระบุรหัสผลงานวิจัยที่เป็นตัวเลขจำนวนเต็มบวก"); 
      return; 
    }
    window.location.assign(`/advisor/reviews/${id}`);
  }

  return (
    <form className="panel known-id-form" onSubmit={submit}>
      <p className="eyebrow">[ ค้นหาด้วยรหัสชิ้นงาน ]</p>
      <h2 className="section-title">เปิดพื้นที่ตรวจประเมินผลงาน</h2>
      <Field label="รหัสผลงานวิจัย (Research ID)" required hint="กรอกรหัสผลงานวิจัยที่ต้องการตรวจสอบโดยตรงเพื่อเปิดหน้ารีวิว">
        <Input name="research_id" type="number" min="1" step="1" inputMode="numeric" required />
      </Field>
      <Button type="submit">เริ่มการตรวจประเมิน</Button>
    </form>
  );
}

