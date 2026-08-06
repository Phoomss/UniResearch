"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/src/components/ui";

type ActionState = { kind: "success" | "error" | "forbidden"; message: string } | null;

export function ResearchActions({ researchId, hasDocument, authenticated }: { researchId: number; hasDocument: boolean; authenticated: boolean }) {
  const [favorite, setFavorite] = useState<ActionState>(null);
  const [download, setDownload] = useState<ActionState>(null);
  const [pending, setPending] = useState<"favorite" | "download" | null>(null);
  const loginHref = `/login?next=${encodeURIComponent(`/research/${researchId}`)}`;

  if (!authenticated) return <section className="auth-action-panel" aria-label="Authenticated research actions"><p>Sign in to save or download this research.</p><ButtonLink href={loginHref}>Sign in to continue</ButtonLink></section>;

  async function toggleFavorite() {
    setPending("favorite");
    setFavorite(null);
    try {
      const response = await fetch(`/api/research/${researchId}/favorite`, { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) { window.location.assign(loginHref); return; }
      if (response.status === 403) { setFavorite({ kind: "forbidden", message: "Your account is not permitted to save this research." }); return; }
      if (!response.ok) { setFavorite({ kind: "error", message: body.error?.message ?? "The saved state could not be changed." }); return; }
      setFavorite({ kind: "success", message: body.detail ? "Removed from saved research." : "Saved to your research list." });
    } catch { setFavorite({ kind: "error", message: "The save service is unavailable." }); }
    finally { setPending(null); }
  }

  async function downloadFile(){
    setPending("download");setDownload(null);
    try{
      const response=await fetch(`/api/research/${researchId}/download`);
      if(response.status===401){window.location.assign(loginHref);return;}
      if(response.status===403){setDownload({kind:"forbidden",message:"Your account is not permitted to download this file."});return;}
      if(!response.ok){const body=await response.json().catch(()=>({}));setDownload({kind:"error",message:body.error?.message??"The document could not be downloaded."});return;}
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download=`research-${researchId}.pdf`;anchor.click();URL.revokeObjectURL(url);
      setDownload({kind:"success",message:"The document download has started."});
    }catch{setDownload({kind:"error",message:"The download service is unavailable."});}
    finally{setPending(null);}
  }

  return <section className="research-actions" aria-label="Research actions">
    <div className="action-buttons"><Button type="button" onClick={downloadFile} disabled={!hasDocument||pending!==null}>{pending==="download"?"Preparing…":"Download document"}</Button><Button type="button" variant="secondary" onClick={toggleFavorite} disabled={pending!==null}>{pending==="favorite"?"Saving…":"Save research"}</Button></div>
    {!hasDocument&&<p className="muted" role="status">No document file is available for this record.</p>}
    {download&&<p className={`status-message ${download.kind}`} role={download.kind==="success"?"status":"alert"}>{download.message}</p>}
    {favorite&&<p className={`status-message ${favorite.kind}`} role={favorite.kind==="success"?"status":"alert"}>{favorite.message}</p>}
  </section>;
}
