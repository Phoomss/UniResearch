"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, Trash2, ExternalLink, X, FileText, Download, Bookmark } from "lucide-react";

export function ResearchActions({ researchId, hasDocument, authenticated, isOwner }: { researchId: number; hasDocument: boolean; authenticated?: boolean | null; isOwner?: boolean }) {
  const [pending, setPending] = useState<"favorite" | "download" | "preview" | "delete" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  async function previewFile() {
    setPending("preview");
    try {
      const response = await fetch(`/api/research/${researchId}/download`);
      if (response.status === 401) { window.location.assign(loginHref); return; }
      if (response.status === 403) { warning("Your account is not permitted to view this file."); return; }
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        error(body.error?.message ?? "The document could not be loaded.");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch {
      error("The preview service is unavailable.");
    } finally {
      setPending(null);
    }
  }

  async function deleteResearch() {
    if (!window.confirm("คุณต้องการลบผลงานวิจัยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้")) return;
    setPending("delete");
    try {
      const response = await fetch(`/api/research/${researchId}`, { method: "DELETE" });
      if (response.ok) {
        success("ลบผลงานวิจัยเรียบร้อยแล้ว");
        window.location.assign("/account/saved");
      } else {
        const body = await response.json().catch(() => ({}));
        error(body.error?.message ?? "ไม่สามารถลบผลงานวิจัยได้");
      }
    } catch {
      error("ไม่สามารถเชื่อมต่อบริการลบผลงานวิจัยได้");
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <section className="research-actions" aria-label="Research actions">
        <div className="action-buttons">
          <Button type="button" onClick={previewFile} disabled={!hasDocument || pending !== null} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} />
            {pending === "preview" ? "Loading preview…" : "Preview PDF"}
          </Button>
          <Button type="button" variant="secondary" onClick={downloadFile} disabled={!hasDocument || pending !== null} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Download size={16} />
            {pending === "download" ? "Preparing…" : "Download PDF"}
          </Button>
          <Button type="button" variant="ghost" onClick={toggleFavorite} disabled={pending !== null} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Bookmark size={16} />
            {pending === "favorite" ? "Saving…" : "Save research"}
          </Button>
          {isOwner && (
            <>
              <ButtonLink href={`/student/research/edit/${researchId}`} variant="secondary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Edit2 size={16} />
                  แก้ไขผลงาน (Edit)
                </span>
              </ButtonLink>
              <Button type="button" variant="ghost" onClick={deleteResearch} disabled={pending !== null} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--red, #ef4444)" }}>
                <Trash2 size={16} />
                {pending === "delete" ? "กำลังลบ…" : "ลบผลงาน (Delete)"}
              </Button>
            </>
          )}
        </div>
        {!hasDocument && <p className="muted" role="status">No document file is available for this record.</p>}
      </section>

      <AnimatePresence>
        {previewUrl && (
          <div className="pdf-preview-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="pdf-preview-container"
            >
              <div className="pdf-preview-header">
                <span className="pdf-preview-title">Document Preview (Research #{researchId})</span>
                <div className="pdf-preview-actions">
                  <a href={previewUrl} className="btn btn-ghost mono" style={{ display: "flex", alignItems: "center", gap: 8 }} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} /> Open in New Tab
                  </a>
                  <Button type="button" variant="ghost" onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                    <X size={20} />
                  </Button>
                </div>
              </div>
              <div className="pdf-preview-body">
                <iframe src={previewUrl} className="pdf-preview-iframe" title="PDF Document Preview" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


