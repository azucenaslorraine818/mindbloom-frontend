import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/app", end: true, icon: "🏠", label: "Home" },
  { to: "/app/write", end: false, icon: "✍️", label: "Write" },
  { to: "/app/history", end: false, icon: "📖", label: "History" },
  { to: "/app/trends", end: false, icon: "📈", label: "Trends" },
  { to: "/app/profile", end: false, icon: "👤", label: "Profile" },
];

export default function Sidebar({ handleLogout }) {
  return (
    <aside id="sidebar">

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <img src="/mblogo.png" alt="MindBloom" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <h1>MindBloom</h1>
        </div>
        <p>Your Daily Stress Journal</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, end, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>

    </aside>
  );
}