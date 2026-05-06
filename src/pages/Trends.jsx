import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekData(entries) {
  // Initialize all 7 days
  const week = DAYS.map((day) => ({
    day,
    positive: 0,
    neutral: 0,
    negative: 0,
    count: 0,
  }));

  // Get start of current week (Sunday)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  entries.forEach((entry) => {
    const date = new Date(entry.created_at);
    if (date >= startOfWeek) {
      const dayIndex = date.getDay();
      week[dayIndex].positive += entry.positive ?? 0;
      week[dayIndex].neutral += entry.neutral ?? 0;
      week[dayIndex].negative += entry.negative ?? 0;
      week[dayIndex].count += 1;
    }
  });

  // Average if multiple entries in a day
  return week.map((d) => ({
    day: d.day,
    positive: d.count ? Math.round(d.positive / d.count) : 0,
    neutral: d.count ? Math.round(d.neutral / d.count) : 0,
    negative: d.count ? Math.round(d.negative / d.count) : 0,
  }));
}

function getStreak(entries) {
  if (!entries.length) return 0;

  // Get unique dates (PH time), sorted descending
  const dates = [
    ...new Set(
      entries.map((e) =>
        new Date(e.created_at).toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
        })
      )
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    const diff = (curr - next) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

function getInsight(entries) {
  if (!entries.length) return null;

  const avgPos = Math.round(entries.reduce((s, e) => s + (e.positive ?? 0), 0) / entries.length);
  const avgNeg = Math.round(entries.reduce((s, e) => s + (e.negative ?? 0), 0) / entries.length);

  if (avgNeg > 50) return "You've been under significant stress lately. Try to identify your triggers and give yourself more rest.";
  if (avgPos > 60) return "You've been in a great emotional space! Keep doing what's working for you.";
  return "Your mood has been relatively balanced. Journaling consistently helps you spot patterns early.";
}

export default function Trends() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setEntries(data || []);
      setLoading(false);
    };
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="trends-page">
        <div className="trends-header">
          <h1>Your Patterns 📈</h1>
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="trends-page">
        <div className="trends-header">
          <h1>Your Patterns 📈</h1>
          <p>No entries yet. Start journaling to see your trends!</p>
        </div>
      </div>
    );
  }

  const weekData = getWeekData(entries);
  const streak = getStreak(entries);
  const insight = getInsight(entries);

  const posCount = entries.filter((e) => e.tone === "Positive").length;
  const negCount = entries.filter((e) => e.tone === "Negative").length;
  const neuCount = entries.filter((e) => e.tone === "Neutral").length;

  const mostCommonTone = posCount >= negCount && posCount >= neuCount
    ? "Positive"
    : negCount >= posCount && negCount >= neuCount
    ? "Negative"
    : "Neutral";

  const mostCommonCount = { Positive: posCount, Negative: negCount, Neutral: neuCount }[mostCommonTone];

  const breakdown = [
    { label: "Positive days", count: posCount, color: "#6DBF8A" },
    { label: "Neutral days",  count: neuCount,  color: "#A0AEC0" },
    { label: "Negative days", count: negCount,  color: "#E8607A" },
  ];

  const maxBarVal = Math.max(...weekData.map((d) => d.positive + d.neutral + d.negative), 1);

  return (
    <div className="trends-page">

      <div className="trends-header">
        <h1>Your Patterns 📈</h1>
        <p>Track your emotional trends and discover what affects your mood.</p>
      </div>

      {/* WEEKLY BAR CHART */}
      <div className="trends-card">
        <p className="trends-card-title">Weekly Mood Statistics</p>
        <div className="bar-chart">
          {weekData.map((d) => {
            const total = d.positive + d.neutral + d.negative || 1;
            return (
              <div key={d.day} className="bar-col">
                <div className="bar-col-bars">
                  {d.positive + d.neutral + d.negative === 0 ? (
                    <div style={{ height: "4px", background: "#eee", borderRadius: 4 }} />
                  ) : (
                    <>
                      <div style={{ height: `${(d.positive / maxBarVal) * 100}%`, background: "#6DBF8A", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                      <div style={{ height: `${(d.neutral  / maxBarVal) * 100}%`, background: "#A0AEC0", minHeight: 3 }} />
                      <div style={{ height: `${(d.negative / maxBarVal) * 100}%`, background: "#E8607A", borderRadius: "0 0 4px 4px", minHeight: 3 }} />
                    </>
                  )}
                </div>
                <span className="bar-col-label">{d.day}</span>
              </div>
            );
          })}
        </div>

        <div className="chart-legend">
          {[["#6DBF8A","Positive"],["#E8607A","Negative"],["#A0AEC0","Neutral"]].map(([c,l]) => (
            <div key={l} className="legend-item">
              <div className="legend-dot" style={{ background: c }} />
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="trends-stats">
        <div className="stat-card">
          <p className="stat-label">Streak</p>
          <p className="stat-value">{streak}</p>
          <p className="stat-sub">day{streak !== 1 ? "s" : ""} in a row</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Most Common</p>
          <p className="stat-value pink">{mostCommonTone}</p>
          <p className="stat-sub">{mostCommonCount} of {entries.length} entries</p>
        </div>
      </div>

      {/* INSIGHT */}
      {insight && (
        <div className="trends-insight">{insight}</div>
      )}

      {/* ENTRY BREAKDOWN */}
      <div className="trends-card">
        <p className="trends-card-title">Entry Breakdown</p>
        {breakdown.map(({ label, count, color }) => (
          <div className="breakdown-row" key={label}>
            <div className="sentiment-row-label">
              <span style={{ fontSize: 13, color: "#8a6672" }}>{label}</span>
              <span style={{ fontSize: 13, color: "#2d1b22", fontWeight: 600 }}>{count}</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: entries.length ? `${(count / entries.length) * 100}%` : "0%",
                  background: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}