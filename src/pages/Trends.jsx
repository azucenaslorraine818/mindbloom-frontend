import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Stress-relief suggestions shown when trend is mostly negative ──
const STRESS_RELIEF_TIPS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: "Take a warm break",
    desc: "Step away and make yourself a warm drink. Even 5 minutes of stillness can reset your nervous system.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: "Talk to someone you trust",
    desc: "You don't have to carry this alone. Reach out to a friend, family member, or counselor today.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l2 2"/>
      </svg>
    ),
    title: "Try box breathing",
    desc: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times. It activates your calm response.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: "Call a crisis line if needed",
    desc: "If you're feeling overwhelmed beyond coping, please reach out. NCMH Crisis Hotline: 1553 (PH, 24/7).",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "Do something kind for yourself",
    desc: "Rest, a short walk, your favorite meal — small acts of self-care add up and genuinely shift your mood.",
  },
];

function getWeekData(entries) {
  const week = DAYS.map((day) => ({ day, positive: 0, neutral: 0, negative: 0, count: 0 }));
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  entries.forEach((entry) => {
    const date = new Date(entry.created_at);
    if (date >= startOfWeek) {
      const dayIndex = date.getDay();
      week[dayIndex].positive += entry.positive ?? 0;
      week[dayIndex].neutral  += entry.neutral  ?? 0;
      week[dayIndex].negative += entry.negative ?? 0;
      week[dayIndex].count    += 1;
    }
  });

  return week.map((d) => ({
    day:      d.day,
    positive: d.count ? Math.round(d.positive / d.count) : 0,
    neutral:  d.count ? Math.round(d.neutral  / d.count) : 0,
    negative: d.count ? Math.round(d.negative / d.count) : 0,
  }));
}

function getStreak(entries) {
  if (!entries.length) return 0;
  const dates = [
    ...new Set(
      entries.map((e) =>
        new Date(e.created_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })
      )
    ),
  ].sort((a, b) => new Date(b) - new Date(a));
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getMostNegativeDay(entries) {
  const totals = Array(7).fill(0);
  const counts = Array(7).fill(0);
  entries.forEach((e) => {
    const day = new Date(e.created_at).getDay();
    totals[day] += e.negative ?? 0;
    counts[day]++;
  });
  const averages = totals.map((t, i) => (counts[i] ? t / counts[i] : 0));
  return DAYS[averages.indexOf(Math.max(...averages))];
}

function getWeeklyAverage(entries, startDaysAgo, endDaysAgo) {
  const now = new Date();
  const filtered = entries.filter((e) => {
    const diff = (now - new Date(e.created_at)) / (1000 * 60 * 60 * 24);
    return diff >= startDaysAgo && diff < endDaysAgo;
  });
  if (!filtered.length) return 0;
  return filtered.reduce((s, e) => s + (e.positive ?? 0), 0) / filtered.length;
}

function getInsight(entries, streak) {
  if (!entries.length) return null;
  const avgPos = Math.round(entries.reduce((s, e) => s + (e.positive ?? 0), 0) / entries.length);
  const avgNeg = Math.round(entries.reduce((s, e) => s + (e.negative ?? 0), 0) / entries.length);
  const avgNeu = Math.round(entries.reduce((s, e) => s + (e.neutral  ?? 0), 0) / entries.length);
  const posCount = entries.filter((e) => e.tone === "Positive").length;
  const negCount = entries.filter((e) => e.tone === "Negative").length;
  const latestTone = entries[0]?.tone;

  if (streak >= 7)
    return `You've maintained a ${streak}-day journaling streak. Your consistency is helping build stronger emotional awareness and healthier reflection habits.`;

  const stressfulDay = getMostNegativeDay(entries);
  if (avgNeg >= 45)
    return `Your mood tends to dip more on ${stressfulDay}s. Consider checking what routines, workload, or situations usually happen on those days.`;

  const thisWeek = getWeeklyAverage(entries, 0, 7);
  const lastWeek = getWeeklyAverage(entries, 7, 14);
  if (thisWeek > lastWeek + 10)
    return "Your emotional trend improved compared to last week. Your recent entries show more positive emotional patterns and better emotional balance.";
  if (lastWeek > thisWeek + 10)
    return "Your recent mood appears lower compared to last week. Try paying attention to changes in stress, sleep, workload, or daily habits that may be affecting you.";

  if (avgNeg >= 65)
    return "Your recent entries show consistently high stress or emotional exhaustion. Consider slowing down, getting proper rest, and talking to someone you trust about what's been weighing on you.";
  if (avgPos >= 70)
    return "Your emotional trend has been strongly positive lately. Your entries suggest improved motivation, stability, and overall emotional balance.";
  if (avgNeu >= 60)
    return "Your recent moods have been mostly steady and neutral. Reflecting deeper in your journal may help uncover smaller emotional changes over time.";
  if (negCount > posCount && avgNeg >= 45)
    return "Negative emotions have appeared more frequently in your recent entries. Identifying recurring triggers or stressful situations may help improve your emotional balance.";
  if (posCount > negCount && avgPos >= 50)
    return "Positive emotions have been appearing more consistently in your journal. Your recent patterns suggest healthier emotional responses and improved mood stability.";
  if (latestTone === "Negative")
    return "Your latest entry reflects a difficult emotional moment. Remember that emotions can fluctuate daily, and journaling regularly can help you process these feelings more clearly.";
  if (latestTone === "Positive")
    return "Your latest entry reflects a positive emotional state. Continue engaging in activities and habits that support your current mindset.";
  return "Your emotional patterns appear relatively balanced overall. Continuing to journal consistently can help you recognize emotional shifts and long-term mood patterns more effectively.";
}

// ── Determines if user's trend is mostly negative ─────────────────
function isMostlyNegative(entries) {
  if (entries.length < 2) return false;
  const recent = entries.slice(0, Math.min(entries.length, 7));
  const negCount = recent.filter(
    (e) => e.tone === "Negative" || e.tone === "Slightly Negative"
  ).length;
  const avgNeg = recent.reduce((s, e) => s + (e.negative ?? 0), 0) / recent.length;
  return negCount >= Math.ceil(recent.length * 0.5) || avgNeg >= 50;
}

// ── Stress Alert Banner ────────────────────────────────────────────
function StressAlertBanner({ onDismiss }) {
  const [tipIndex] = useState(() => Math.floor(Math.random() * STRESS_RELIEF_TIPS.length));
  const tip = STRESS_RELIEF_TIPS[tipIndex];

  return (
    <div className="stress-alert-banner">
      <div className="stress-alert-top">
        <div className="stress-alert-icon-wrap">
          {/* Heart-pulse icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div className="stress-alert-heading">
          <p className="stress-alert-title">Your mood has been low lately</p>
          <p className="stress-alert-sub">
            We noticed a pattern of negative emotions in your recent entries. You're not alone — here's something that may help.
          </p>
        </div>
        <button className="stress-alert-dismiss" onClick={onDismiss} aria-label="Dismiss">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="stress-alert-tip">
        <div className="stress-alert-tip-icon">{tip.icon}</div>
        <div>
          <p className="stress-alert-tip-title">{tip.title}</p>
          <p className="stress-alert-tip-desc">{tip.desc}</p>
        </div>
      </div>

      <div className="stress-alert-resources">
        <span className="stress-alert-resources-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4,verticalAlign:"middle"}}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Crisis resources:
        </span>
        <span className="stress-alert-resource-item">🇵🇭 NCMH Hotline: <strong>1553</strong></span>
        <span className="stress-alert-resource-item">In Touch: <strong>(02) 8893-7603</strong></span>
        <span className="stress-alert-resource-item">International: <strong>befrienders.org</strong></span>
      </div>
    </div>
  );
}

export default function Trends() {
  const [entries, setEntries]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [alertDismissed, setAlertDismissed] = useState(false);

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
          <h1>Your Patterns</h1>
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="trends-page">
        <div className="trends-header">
          <h1>Your Patterns</h1>
          <p>No entries yet. Start journaling to see your trends!</p>
        </div>
      </div>
    );
  }

  const weekData        = getWeekData(entries);
  const streak          = getStreak(entries);
  const insight         = getInsight(entries, streak);
  const showStressAlert = isMostlyNegative(entries) && !alertDismissed;

  const posCount = entries.filter((e) => e.tone === "Positive").length;
  const negCount = entries.filter((e) => e.tone === "Negative").length;
  const neuCount = entries.filter((e) => e.tone === "Neutral").length;

  const mostCommonTone =
    posCount >= negCount && posCount >= neuCount ? "Positive"
    : negCount >= posCount && negCount >= neuCount ? "Negative"
    : "Neutral";

  const mostCommonCount = { Positive: posCount, Negative: negCount, Neutral: neuCount }[mostCommonTone];

  const breakdown = [
    { label: "Positive days", count: posCount, color: "#6DBF8A" },
    { label: "Neutral days",  count: neuCount, color: "#A0AEC0" },
    { label: "Negative days", count: negCount, color: "#E8607A" },
  ];

  const maxBarVal = Math.max(...weekData.map((d) => d.positive + d.neutral + d.negative), 1);

  return (
    <div className="trends-page">

      <div className="trends-header">
        <h1>Your Patterns</h1>
        <p>Track your emotional trends and discover what affects your mood.</p>
      </div>

      {/* ── STRESS ALERT BANNER ── */}
      {showStressAlert && (
        <StressAlertBanner onDismiss={() => setAlertDismissed(true)} />
      )}

      {/* ── WEEKLY BAR CHART ── */}
      <div className="trends-card">
        <p className="trends-card-title">Weekly Mood Statistics</p>
        <div className="bar-chart">
          {weekData.map((d) => (
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
          ))}
        </div>
        <div className="chart-legend">
          {[["#6DBF8A", "Positive"], ["#E8607A", "Negative"], ["#A0AEC0", "Neutral"]].map(([c, l]) => (
            <div key={l} className="legend-item">
              <div className="legend-dot" style={{ background: c }} />
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STAT CARDS ── */}
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

      {/* ── INSIGHT ── */}
      {insight && <div className="trends-insight">{insight}</div>}

      {/* ── ENTRY BREAKDOWN ── */}
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
