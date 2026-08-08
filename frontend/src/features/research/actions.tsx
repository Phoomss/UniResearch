"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";

export function ResearchActions({ researchId, hasDocument, authenticated }: { researchId: number; hasDocument: boolean; authenticated: boolean }) {
  const [pending, setPending] = useState<"favorite" | "download" | null>(null);
  const { success, error, warning } = useToast();
  const loginHref = `/login?next=${encodeURIComponent(`/research/${researchId}`)}`;

  if (!authenticated) return <section className="auth-action-panel" aria-label="Authenticated research actions"><p>Sign in to save or download this research.</p><ButtonLink href={loginHref}>Sign in to continue</ButtonLink></section>;

  async function toggleFavorite() {
    setPending("favorite");
    try {
      const response = await fetch(`/api/research/${researchId}/favorite`, { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) { window.location.assign(loginHref); return; }
      if (response.status === 403) { warning("Your account is not permitted to save this research."); return; }
      if (!response.ok) { error(body.error?.message ?? "The saved state could not be changed."); return; }
      success(body.detail ? "Removed from saved research." : "Saved to your research list.");
    } catch { error("The save service is unavailable."); }
    finally { setPending(null); }
  }

  async function downloadFile(){
    setPending("download");
    try{
      const response=await fetch(`/api/research/${researchId}/download`);
      if(response.status===401){window.location.assign(loginHref);return;}
      if(response.status===403){warning("Your account is not permitted to download this file.");return;}
      if(!response.ok){const body=await response.json().catch(()=>({}));error(body.error?.message??"The document could not be downloaded.");return;}
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download=`research-${researchId}.pdf`;anchor.click();URL.revokeObjectURL(url);
      success("The document download has started.");
    }catch{error("The download service is unavailable.");}
    finally{setPending(null);}
  }

  return <section className="research-actions" aria-label="Research actions">
    <div className="action-buttons"><Button type="button" onClick={downloadFile} disabled={!hasDocument||pending!==null}>{pending==="download"?"Preparing…":"Download document"}</Button><Button type="button" variant="secondary" onClick={toggleFavorite} disabled={pending!==null}>{pending==="favorite"?"Saving…":"Save research"}</Button></div>
    {!hasDocument&&<p className="muted" role="status">No document file is available for this record.</p>}
  </section>;
}

