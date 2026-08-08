"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input, Textarea } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";

export function CategoryForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { success, error, warning } = useToast();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    const data = new FormData(form);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: String(data.get("category_name") ?? "").trim(),
          description: String(data.get("description") ?? "").trim() || null
        })
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent("/admin/categories")}`);
        return;
      }
      if (response.status===403) {
        warning("บัญชีนี้ไม่มีสิทธิ์สร้างหมวดหมู่ [forbidden]");
        return;
      }
      if (!response.ok) {
        error(`${body.error?.message ?? "สร้างหมวดหมู่ไม่สำเร็จ"} [${body.error?.code ?? response.status}]`);
        return;
      }
      success(`สร้างหมวดหมู่ “${body.category_name}” แล้ว`);
      form.reset();
      router.refresh();
    } catch {
      error("ไม่สามารถเชื่อมต่อบริการหมวดหมู่ได้ [network]");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="panel category-form" onSubmit={submit} aria-busy={pending}>
      <p className="eyebrow">[ Admin mutation ]</p>
      <h2 className="section-title">สร้างหมวดหมู่</h2>
      <Field label="ชื่อหมวดหมู่" required>
        <Input name="category_name" required disabled={pending} />
      </Field>
      <Field label="คำอธิบาย">
        <Textarea name="description" disabled={pending} />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "กำลังบันทึก…" : "เพิ่มหมวดหมู่"}
      </Button>
    </form>
  );
}

