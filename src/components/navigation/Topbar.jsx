const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Topbar({ onMenuClick, user }) {
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

  return (
    <header id="topbar">
      {/* Hamburger — only visible on mobile via CSS */}
      <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <MenuIcon />
      </button>

      <div>
        <h2>{greeting}{user?.email ? `, ${user.email}` : ""}</h2>
        <p>{today}</p>
      </div>
    </header>
  );
}