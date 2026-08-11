"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LanguageSwitch() {
  const router = useRouter();
  const [lang, setLang] = useState<"th" | "en">("th");

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*lang\s*=\s*([^;]+)/);
    const initialLang = match && match[2] === "en" ? "en" : "th";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(initialLang);
  }, []);

  const switchLanguage = (newLang: "th" | "en") => {
    if (newLang === lang) return;
    
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `lang=${newLang};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
    
    setLang(newLang);
    router.refresh();
  };

  return (
    <span className="lang-switch" aria-label="Language" style={{ cursor: "pointer" }}>
      <span 
        className={lang === "th" ? "active" : ""} 
        onClick={() => switchLanguage("th")}
      >
        TH
      </span>
      <span 
        className={lang === "en" ? "active" : ""} 
        onClick={() => switchLanguage("en")}
      >
        EN
      </span>
    </span>
  );
}
