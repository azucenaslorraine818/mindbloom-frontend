import { NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

/* ── Icons ────────────────────────────────────────────────────── */
const HomeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const WriteIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3"/>
    <path d="M3.05 11a9 9 0 1 0 .5-3"/>
    <path d="M3 4v4h4"/>
  </svg>
);
const TrendsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);
const ProfileIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const NotifIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const SupportIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const SignOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── Nav definitions ──────────────────────────────────────────── */
const PRIMARY_NAV = [
  { to: "/app",         end: true,  Icon: HomeIcon,    label: "Home"    },
  { to: "/app/write",   end: false, Icon: WriteIcon,   label: "Write"   },
  { to: "/app/history", end: false, Icon: HistoryIcon, label: "History" },
  { to: "/app/trends",  end: false, Icon: TrendsIcon,  label: "Trends"  },
  { to: "/app/profile", end: false, Icon: ProfileIcon, label: "Profile" },
];
const UTILITY_NAV = [
  { to: "/app/notifications", end: false, Icon: NotifIcon,    label: "Notifications"  },
  { to: "/app/settings",      end: false, Icon: SettingsIcon, label: "Settings"       },
  { to: "/app/support",       end: false, Icon: SupportIcon,  label: "Help & Support" },
];

/* ── Component ────────────────────────────────────────────────── */
export default function Sidebar({ handleLogout, open, onClose }) {
  return (
    <aside id="sidebar" className={open ? "sb-open" : ""}>

      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-brand-row">
          <img src="/mblogo.png" alt="MindBloom" className="sb-logo-img" />
          <span className="sb-brand-name">MindBloom</span>
          {/* Close button — visible on mobile when sidebar is open */}
          <button className="sb-close-btn" onClick={onClose} aria-label="Close sidebar">
            <CloseIcon />
          </button>
        </div>
        <span className="sb-brand-sub">Your Daily Stress Journal</span>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {PRIMARY_NAV.map(({ to, end, Icon, label }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={onClose}
            className={({ isActive }) => "sb-item" + (isActive ? " sb-active" : "")}
          >
            <span className="sb-icon"><Icon /></span>
            <span className="sb-label">{label}</span>
          </NavLink>
        ))}

        <div className="sb-sep" />

        {UTILITY_NAV.map(({ to, end, Icon, label }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={onClose}
            className={({ isActive }) => "sb-item" + (isActive ? " sb-active" : "")}
          >
            <span className="sb-icon"><Icon /></span>
            <span className="sb-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sb-footer">
        <div className="sb-dark-row">
          <span className="sb-dark-label">Dark mode</span>
          <DarkModeToggle />
        </div>
        <button className="sb-logout" onClick={handleLogout}>
          <SignOutIcon />
          Sign out
        </button>
      </div>

    </aside>
  );
}