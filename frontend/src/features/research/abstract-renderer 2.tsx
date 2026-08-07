import React from "react";

export function AbstractRenderer({ abstract }: { abstract: string }) {
  if (!abstract) return null;
  
  const htmlContent = abstract
    .split("\n")
    .map((line) => {
      let parsed = line;
      if (parsed.startsWith("## ")) {
        return `<h3>${parsed.substring(3)}</h3>`;
      } else if (parsed.startsWith("# ")) {
        return `<h2>${parsed.substring(2)}</h2>`;
      }
      parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");
      return `<p>${parsed || "&nbsp;"}</p>`;
    })
    .join("");

  return (
    <div 
      className="abstract-preview-content" 
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
}
