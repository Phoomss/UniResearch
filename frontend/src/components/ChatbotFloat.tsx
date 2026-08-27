"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, BookOpen } from "lucide-react";
import { askChatbot, type ChatMessage } from "@/src/services/ai";

export function ChatbotFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "สวัสดีค่ะ! ยินดีต้อนรับสู่ UniResearch AI Assistant 🎓 ต้องการค้นหาข้อมูลวิจัยหรือสอบถามหัวข้อไหน ถามมาได้เลยนะคะ"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [relevantWorks, setRelevantWorks] = useState<any[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to state
    const updatedHistory = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      // call API
      const res = await askChatbot({
        message: userMessage,
        history: updatedHistory.slice(-8) // Send latest turns to fit context
      });

      setMessages(prev => [...prev, { role: "assistant" as const, content: res.response }]);
      if (res.relevant_works && res.relevant_works.length > 0) {
        setRelevantWorks(res.relevant_works);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant" as const, 
          content: "ขออภัยด้วยค่ะ ระบบขัดข้องชั่วคราวในการตอบข้อความของคุณ กรุณาลองใหม่อีกครั้งนะคะ" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999 }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c5cbf 0%, #5b4a9e 100%)",
            color: "white",
            border: "none",
            boxShadow: "0 4px 16px rgba(91, 74, 158, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          className="hover:scale-110"
          title="คุยกับผู้ช่วย AI"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: "360px",
            height: "500px",
            background: "var(--paper-white, #fff)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: "1px solid rgba(124, 92, 191, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "var(--font-kanit), sans-serif",
          }}
        >
          {/* Header */}
          <header
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, #7c5cbf 0%, #5b4a9e 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} style={{ color: "#d9c3ff" }} />
              <div>
                <strong style={{ fontSize: "15px", display: "block" }}>UniResearch AI Chatbot</strong>
                <span style={{ fontSize: "11px", opacity: 0.8 }}>RAG Academic Advisor</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "50%",
                display: "flex",
              }}
            >
              <X size={18} />
            </button>
          </header>

          {/* Messages body */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", background: "var(--paper-lowest, #FAF8FC)" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "14px 14px 0 14px" : "14px 14px 14px 0",
                  background: msg.role === "user" ? "#5b4a9e" : "white",
                  color: msg.role === "user" ? "white" : "var(--ink, #1c1a29)",
                  border: msg.role === "user" ? "none" : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "13px" }}>
                <Loader2 className="animate-spin" size={14} />
                <span>กำลังหาข้อมูลจากคลัง...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Relevant References Tab if available */}
          {relevantWorks.length > 0 && (
            <div style={{ padding: "8px 16px", background: "var(--paper-low, #f6f1ff)", borderTop: "1px solid rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, color: "#5b4a9e" }}>
                <BookOpen size={12} />
                <span>งานวิจัยที่อ้างอิง ({relevantWorks.length}):</span>
              </div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                {relevantWorks.map((work) => (
                  <a
                    key={work.id}
                    href={`/research/${work.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      padding: "4px 8px",
                      background: "white",
                      border: "1px solid rgba(124, 92, 191, 0.2)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                      color: "#5b4a9e",
                      textDecoration: "none",
                      maxWidth: "140px",
                      textOverflow: "ellipsis",
                      overflow: "hidden"
                    }}
                    title={work.title_th || work.title_en}
                  >
                    📖 {work.title_th || work.title_en}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid rgba(0,0,0,0.08)", padding: "10px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ถามหัวข้องานวิจัยที่สนใจ..."
              style={{
                flex: 1,
                border: "none",
                padding: "8px 12px",
                fontSize: "14px",
                outline: "none",
                background: "transparent"
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: "transparent",
                border: "none",
                color: input.trim() ? "#5b4a9e" : "#ccc",
                cursor: input.trim() ? "pointer" : "default",
                padding: "8px",
                display: "flex",
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
