"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Eye, Trash2, Sparkles, ClipboardList, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "@/src/features/research/notification-api-client";
import { useToast } from "@/src/components/ui/Toast";

export function NotificationBellDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const toast = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.ok) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await markAsRead(id);
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        toast.success("ทำเครื่องหมายว่าอ่านแล้ว");
      }
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await markAllAsRead();
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success("ทำเครื่องหมายว่าอ่านแล้วทั้งหมด");
      }
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return !n.is_read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check size={14} style={{ color: "#10b981" }} />;
      case "warning":
        return <AlertTriangle size={14} style={{ color: "#f59e0b" }} />;
      case "alert":
        return <AlertCircle size={14} style={{ color: "#ef4444" }} />;
      case "review":
        return <ClipboardList size={14} style={{ color: "#3b82f6" }} />;
      case "ai_match":
        return <Sparkles size={14} style={{ color: "#8b5cf6" }} />;
      default:
        return <Info size={14} style={{ color: "#64748b" }} />;
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: "8px",
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(72,39,106,0.06)"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
        aria-label="การแจ้งเตือน"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            background: "#ef4444",
            color: "white",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 2px var(--paper, #fff)"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop layer to close dropdown */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />

          <div style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            width: "360px",
            background: "var(--paper, #fff)",
            border: "1px solid rgba(72, 39, 106, 0.15)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            zIndex: 1000,
            overflow: "hidden",
            color: "var(--ink)"
          }}>
            {/* Header */}
            <header style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(72, 39, 106, 0.08)",
              background: "rgba(72, 39, 106, 0.02)"
            }}>
              <strong style={{ fontSize: "14px", fontWeight: 700 }}>การแจ้งเตือน</strong>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#48276a",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  อ่านทั้งหมด
                </button>
              )}
            </header>

            {/* Filter Tabs */}
            <div style={{
              display: "flex",
              gap: "4px",
              padding: "8px 12px",
              borderBottom: "1px solid rgba(72, 39, 106, 0.04)"
            }}>
              <button
                onClick={() => setActiveTab("all")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "all" ? "rgba(72, 39, 106, 0.08)" : "transparent",
                  color: activeTab === "all" ? "#48276a" : "var(--muted)"
                }}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "unread" ? "rgba(72, 39, 106, 0.08)" : "transparent",
                  color: activeTab === "unread" ? "#48276a" : "var(--muted)"
                }}
              >
                ยังไม่อ่าน ({unreadCount})
              </button>
            </div>

            {/* List */}
            <div style={{
              maxHeight: "320px",
              overflowY: "auto",
              padding: "4px 0"
            }}>
              {filteredNotifications.length === 0 ? (
                <div style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--muted)"
                }}>
                  <p style={{ margin: 0, fontSize: "13px" }}>ไม่มีการแจ้งเตือนในขณะนี้</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                      background: notification.is_read ? "transparent" : "rgba(72, 39, 106, 0.02)",
                      transition: "background-color 0.2s",
                      position: "relative"
                    }}
                  >
                    {/* Icon container */}
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                    }}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <h4 style={{ margin: "0 0 3px 0", fontSize: "13px", fontWeight: notification.is_read ? 600 : 700, lineHeight: 1.4 }}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#48276a",
                              cursor: "pointer",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "4px",
                              flexShrink: 0
                            }}
                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                        {notification.message}
                      </p>
                      <span style={{ fontSize: "10px", color: "var(--muted)" }}>
                        {new Date(notification.created_at).toLocaleDateString("th-TH")} {new Date(notification.created_at).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
