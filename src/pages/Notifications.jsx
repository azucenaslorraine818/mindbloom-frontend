import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// ── Professional SVG icon set (replaces emojis) ───────────────────
const ICONS = {
  reminder: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  insight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
  milestone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  tip: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  welcome: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  default: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

// Icon background colours per type
const ICON_BG = {
  reminder:  { bg: "#FFF0F4", color: "#E8607A" },
  insight:   { bg: "#FFF8E8", color: "#C9920A" },
  milestone: { bg: "#F0FFF4", color: "#2A7D46" },
  tip:       { bg: "#EBF8FF", color: "#2B6CB0" },
  welcome:   { bg: "#FDE8ED", color: "#C0475F" },
  alert:     { bg: "#FFF5E8", color: "#C96A00" },
  default:   { bg: "#F3F0FF", color: "#6B46C1" },
};

function getIcon(type)  { return ICONS[type]  || ICONS.default; }
function getIconStyle(type) { return ICON_BG[type] || ICON_BG.default; }

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setNotifications(data || []);
    setLoading(false);
  };

  const markAllRead = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotif = async (id) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (iso) => {
    const date = new Date(iso);
    const now   = new Date();
    const diffMs    = now - date;
    const diffMins  = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays  = Math.floor(diffMs / 86400000);
    if (diffMins  <  1) return "Just now";
    if (diffMins  < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays  ===1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="notif-page">

      {/* ── HEADER ── */}
      <div className="notif-header">
        <div>
          <h1 className="notif-title">Notifications</h1>
          {unreadCount > 0 && (
            <p className="notif-subtitle">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading ? (
        <div className="notif-loading">
          <div className="settings-spinner" />
        </div>

      ) : notifications.length === 0 ? (
        /* ── EMPTY ── */
        <div className="notif-empty">
          <div className="notif-empty-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4829a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p className="notif-empty-title">All caught up!</p>
          <p className="notif-empty-desc">No notifications yet. Keep journaling!</p>
        </div>

      ) : (
        /* ── LIST ── */
        <div className="notif-list">
          {notifications.map((n) => {
            const iconStyle = getIconStyle(n.type);
            return (
              <div
                key={n.id}
                className={`notif-item ${n.read ? "read" : "unread"}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                {/* Icon */}
                <div
                  className="notif-icon-wrap"
                  style={{ background: iconStyle.bg, color: iconStyle.color }}
                >
                  {getIcon(n.type)}
                </div>

                {/* Body */}
                <div className="notif-body">
                  {n.title && <p className="notif-item-title">{n.title}</p>}
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">{formatTime(n.created_at)}</span>
                </div>

                {/* Side actions */}
                <div className="notif-side">
                  {!n.read && <span className="notif-dot" />}
                  <button
                    className="notif-delete"
                    onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                    title="Dismiss"
                    aria-label="Dismiss notification"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6"  y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
