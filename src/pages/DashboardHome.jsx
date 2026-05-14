import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ToneChip({ tone }) {
  const cls =
    tone === "Positive" ? "positive" :
    tone === "Negative" ? "negative" : "neutral";
  return <span className={`tone-chip ${cls}`}>{tone}</span>;
}

function getToneStyle(tone) {
  const t = (tone || "").toLowerCase();
  if (t === "positive") return { background: "#f0fff4", border: "1px solid #b7ebc6", borderLeft: "6px solid #6DBF8A" };
  if (t === "negative") return { background: "#fff1f0", border: "1px solid #ffccc7", borderLeft: "6px solid #E8607A" };
  return { background: "#f5f5f5", border: "1px solid #e5e5e5", borderLeft: "6px solid #A0AEC0" };
}

// SVG icons for quick action cards (no emojis)
const ActionIcons = {
  write: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  history: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  trends: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  ),
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setLoading(false); return; }

      const { data: profileData, error } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      if (error) console.log("Profile fetch error:", error.message);
      setProfile(profileData || null);

      const { data: entryData } = await supabase
        .from("entries").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(3);
      setEntries(entryData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ── Name: first_name → name → full_name → "there"
  const firstName =
    profile?.first_name ||
    profile?.name?.split(" ")[0] ||
    profile?.full_name?.split(" ")[0] ||
    "there";

  // ── Simple "Hello" — time greeting lives in the Topbar, not here
  const helloGreeting = `Hello, ${firstName}!`;

  const quickActions = [
    {
      icon: "write",
      iconColor: "#e8607a",
      bg: "#fff0f5",
      title: "Write today's entry",
      desc: "Express how you're feeling right now.",
      to: "/app/write",
    },
    {
      icon: "history",
      iconColor: "#3b82f6",
      bg: "#eef4ff",
      title: "Past entries",
      desc: "Revisit your previous reflections.",
      to: "/app/history",
    },
    {
      icon: "trends",
      iconColor: "#7c3aed",
      bg: "#f3eeff",
      title: "My patterns",
      desc: "Visualize your emotional trends.",
      to: "/app/trends",
    },
  ];

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Manila",
    });

  return (
    <div className="home-v2">

      {/* ── HERO ── */}
      <section className="hero-v2">
        <div className="hero-v2-text">
          <h1 className="hero-v2-greeting">{helloGreeting}</h1>
          <p className="hero-v2-sub">
            Take a moment to reflect on how you feel. MindBloom uses AI to understand
            your emotions and reveal patterns over time.
          </p>
        </div>
        <div className="hero-v2-logo">
          <img
            src="/mblogo.png"
            alt="MindBloom"
            style={{ width: 90, height: 90, objectFit: "contain" }}
          />
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <div className="home-v2-actions">
        {quickActions.map((a) => (
          <div className="action-card" key={a.title} onClick={() => navigate(a.to)}>
            <div
              className="action-icon"
              style={{ background: a.bg, color: a.iconColor }}
            >
              {ActionIcons[a.icon]}
            </div>
            <h3 className="action-title">{a.title}</h3>
            <p className="action-desc">{a.desc}</p>
          </div>
        ))}
      </div>

      {/* ── RECENT ENTRIES ── */}
      <section className="home-v2-recent">
        <h2 className="home-v2-section-title">Recent Entries</h2>

        {loading ? (
          <p style={{ color: "#8a6672", fontSize: 14 }}>Loading…</p>
        ) : entries.length === 0 ? (
          <div className="home-empty">
            <p>No entries yet.</p>
            <button
              className="save-btn"
              style={{ marginTop: 12, padding: "12px 28px" }}
              onClick={() => navigate("/app/write")}
            >
              Write your first entry
            </button>
          </div>
        ) : (
          <div className="recent-list">
            {entries.map((e) => {
              const tone = e.tone || e.mood || "Neutral";
              return (
                <div
                  className="recent-entry"
                  key={e.id}
                  onClick={() => navigate("/app/history")}
                  style={getToneStyle(tone)}
                >
                  <div className="recent-entry-top">
                    <span className="recent-entry-date">{formatDate(e.created_at)}</span>
                    <ToneChip tone={tone} />
                  </div>
                  <p className="recent-entry-text">
                    "{e.note?.length > 120 ? e.note.slice(0, 120) + "…" : e.note}"
                  </p>
                  <span className="recent-entry-arrow">›</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}