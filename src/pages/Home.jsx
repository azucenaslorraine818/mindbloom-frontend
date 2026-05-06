import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // 🧠 Prevent recalculating on every render
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 🌸";
    if (hour < 17) return "Good Afternoon 🌸";
    return "Good Evening 🌸";
  }, []);

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-card">
        <h1>{greeting}</h1>
        <p>
          Your thoughts matter. Take a moment to reflect and breathe.
        </p>
        <span className="hero-date">{today}</span>
      </section>

      {/* QUICK ACTIONS */}
      <section className="home-section">
        <h2>Quick Actions</h2>

        <div className="home-grid">

          <div
            className="feature-card"
            onClick={() => navigate("/app/write")}
          >
            <div className="feature-icon pink">✍️</div>
            <h3>Write Entry</h3>
            <p>Journal your feelings and daily experiences.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => navigate("/app/history")}
          >
            <div className="feature-icon purple">📖</div>
            <h3>Past Entries</h3>
            <p>Revisit your reflections and emotional journey.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => navigate("/app/trends")}
          >
            <div className="feature-icon blue">📈</div>
            <h3>Trends</h3>
            <p>Track emotional patterns and stress over time.</p>
          </div>

        </div>
      </section>

    </div>
  );
}