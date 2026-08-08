"use client";
import { Button } from "@/src/components/ui";
export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return <Button type="button" variant="ghost" onClick={logout}>ออกจากระบบ</Button>;
}
