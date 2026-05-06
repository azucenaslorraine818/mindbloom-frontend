import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ToneChip({ tone }) {
  const cls =
    tone === "Positive"
      ? "positive"
      : tone === "Negative"
      ? "negative"
      : "neutral";

  return <span className={`tone-chip ${cls}`}>{tone}</span>;
}

function getToneStyle(tone) {
  const t = (tone || "").toLowerCase();

  if (t === "positive") {
    return {
      background: "#f0fff4",
      border: "1px solid #b7ebc6",
      borderLeft: "6px solid #6DBF8A",
    };
  }

  if (t === "negative") {
    return {
      background: "#fff1f0",
      border: "1px solid #ffccc7",
      borderLeft: "6px solid #E8607A",
    };
  }

  return {
    background: "#f5f5f5",
    border: "1px solid #e5e5e5",
    borderLeft: "6px solid #A0AEC0",
  };
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();

  const timeGreeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Profile fetch error:", error.message);
      }

      setProfile(profileData || null);

      const { data: entryData } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setEntries(entryData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const firstName =
    (profile?.name || profile?.full_name || "there").split(" ")[0];

  const helloGreeting = `Hello, ${firstName}!`;

  const quickActions = [
    {
      icon: "✏️",
      bg: "#fff0f5",
      title: "Write today's entry",
      desc: "Express how you're feeling right now.",
      to: "/app/write",
    },
    {
      icon: "📖",
      bg: "#eef4ff",
      title: "Past entries",
      desc: "Revisit your previous reflections.",
      to: "/app/history",
    },
    {
      icon: "📊",
      bg: "#f3eeff",
      title: "My patterns",
      desc: "Visualize your emotional trends.",
      to: "/app/trends",
    },
  ];

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Manila",
    });

  return (
    <div className="home-v2">

      {/* HERO */}
      <section className="hero-v2">
        <div className="hero-v2-text">
          <h1 className="hero-v2-greeting">
            {helloGreeting}
          </h1>
          <p className="hero-v2-sub" style={{ marginTop: 10 }}>
            Take a moment to reflect on how you feel. MindBloom uses AI to understand
            your emotions and reveal patterns over time.
          </p>
        </div>

        <div className="hero-v2-logo">
          <img src="/mblogo.png" alt="MindBloom" style={{ width: 90, height: 90, objectFit: "contain" }} />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <div className="home-v2-actions">
        {quickActions.map((a) => (
          <div
            className="action-card"
            key={a.title}
            onClick={() => navigate(a.to)}
          >
            <div className="action-icon" style={{ background: a.bg }}>
              <span>{a.icon}</span>
            </div>
            <h3 className="action-title">{a.title}</h3>
            <p className="action-desc">{a.desc}</p>
          </div>
        ))}
      </div>

      {/* RECENT ENTRIES */}
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
              Write your first entry ✍️
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
                    <span className="recent-entry-date">
                      {formatDate(e.created_at)}
                    </span>
                    <ToneChip tone={tone} />
                  </div>

                  <p className="recent-entry-text">
                    "{e.note?.length > 120
                      ? e.note.slice(0, 120) + "…"
                      : e.note}"
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