import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/app",         end: true,  icon: "🏠", label: "Home"    },
  { to: "/app/write",   end: false, icon: "✍️", label: "Write"   },
  { to: "/app/history", end: false, icon: "📖", label: "History" },
  { to: "/app/trends",  end: false, icon: "📈", label: "Trends"  },
];

export default function BottomNav() {
  return (
    <nav id="bottom-nav">
      {TABS.map(({ to, end, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => isActive ? "bottom-link active" : "bottom-link"}
        >
          <span>{icon}</span>
          <p>{label}</p>
        </NavLink>
      ))}
    </nav>
  );
}