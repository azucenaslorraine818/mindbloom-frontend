import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export default function Topbar({ onMenuClick, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [latestNotifs, setLatestNotifs] = useState([]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" :
    hour < 17 ? "Good Afternoon" :
                "Good Evening";

  const isHome = location.pathname === "/app";
  const showBackButton = !isHome;

  // ── FETCH NOTIFICATIONS ──
  const fetchNotifications = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setUnreadCount(count || 0);

    const { data: notifs } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setLatestNotifs(notifs || []);
  };

  // ── SETUP NOTIFICATIONS WITH POLLING ──
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const handleViewAll = () => {
    navigate("/app/notifications");
    setShowNotifDropdown(false);
  };

  return (
    <>
      <style>{`
        @keyframes topbarGradient {
          0% {
            background: linear-gradient(90deg, #fff8fa 0%, #f5e6ff 50%, #fff8fa 100%);
            box-shadow: 0 2px 8px rgba(232, 96, 122, 0.08);
          }
          50% {
            background: linear-gradient(90deg, #f5e6ff 0%, #fff8fa 50%, #e6f7ff 100%);
            box-shadow: 0 2px 8px rgba(109, 191, 138, 0.08);
          }
          100% {
            background: linear-gradient(90deg, #fff8fa 0%, #f5e6ff 50%, #fff8fa 100%);
            box-shadow: 0 2px 8px rgba(232, 96, 122, 0.08);
          }
        }

        #topbar {
          animation: topbarGradient 12s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .topbar-greeting {
          animation: fadeInScale 0.6s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .topbar-notif-btn {
          position: relative;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .topbar-notif-btn:hover {
          transform: scale(1.1);
          color: #e8607a;
        }

        .topbar-notif-btn:active {
          transform: scale(0.95);
        }

        .topbar-notif-badge {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(232, 96, 122, 0.7);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(232, 96, 122, 0);
          }
        }

        .topbar-notif-dropdown {
          animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .topbar-notif-item {
          transition: all 0.2s ease;
        }

        .topbar-notif-item:hover {
          background: rgba(232, 96, 122, 0.05);
        }

        .topbar-notif-dot {
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>

      <header id="topbar">
        <div className="topbar-left">
          {showBackButton && (
            <button 
              className="topbar-back-btn" 
              onClick={() => navigate("/app")}
              aria-label="Go back to dashboard home"
              title="Back to dashboard"
            >
              <BackIcon />
            </button>
          )}

          <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
            <MenuIcon />
          </button>
        </div>

        <div className="topbar-right">
          <div className="topbar-greeting">
            <h2 className="topbar-greeting-text">{greeting}</h2>
            <p className="topbar-date-text">{today}</p>
          </div>

          {/* Notification Bell */}
          <div className="topbar-notif-container">
            <button
              className="topbar-notif-btn"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="Notifications"
              aria-label="Open notifications"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="topbar-notif-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifDropdown && (
              <div className="topbar-notif-dropdown">
                <div className="topbar-notif-header">
                  <h3>Notifications</h3>
                  <button
                    className="topbar-notif-view-all"
                    onClick={handleViewAll}
                  >
                    View all →
                  </button>
                </div>

                {latestNotifs.length === 0 ? (
                  <div className="topbar-notif-empty">
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="topbar-notif-list">
                    {latestNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`topbar-notif-item ${notif.read ? "read" : "unread"}`}
                        onClick={() => !notif.read && markAsRead(notif.id)}
                      >
                        <div className="topbar-notif-content">
                          {notif.title && (
                            <p className="topbar-notif-title">{notif.title}</p>
                          )}
                          <p className="topbar-notif-message">{notif.message}</p>
                          <span className="topbar-notif-time">
                            {formatTime(notif.created_at)}
                          </span>
                        </div>
                        {!notif.read && <span className="topbar-notif-dot" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function formatTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}