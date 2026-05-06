import { useState } from "react";
import { analyzeJournal } from "../lib/ai";
import { supabase } from "../lib/supabase";

const PROMPTS = [
  "Today I felt…",
  "The hardest part…",
  "Something that helped…",
  "Grateful for…",
  "I am worried…",
  "What I need is…",
];

const TIPS = [
  "Describe what happened today and how it made you feel.",
  "Mention any stress triggers you noticed.",
  "Did anything help you feel better or cope?",
  "Even a few honest sentences work great.",
  "This is private — be completely honest.",
];

function ResultView({ result, onReset }) {
  const safeResult = {
    tone: result?.tone || "Unknown",
    tags: Array.isArray(result?.tags) ? result.tags : [],
    positive: result?.positive ?? 33,
    neutral: result?.neutral ?? 34,
    negative: result?.negative ?? 33,
    mindbloom: result?.mindbloom || "",
  };

  const bars = [
    { label: "Positive", pct: safeResult.positive, color: "#6DBF8A" },
    { label: "Neutral", pct: safeResult.neutral, color: "#A0AEC0" },
    { label: "Negative", pct: safeResult.negative, color: "#E8607A" },
  ];

  const tagClass = (i) =>
    i === 0 ? "result-tag yellow" :
    i === 1 ? "result-tag green" :
    "result-tag neutral";

  return (
    <div className="result-card">
      <p className="result-label">Overall Tone</p>
      <h2 className="result-tone">{safeResult.tone}</h2>

      <div className="result-tags">
        {safeResult.tags.map((t, i) => (
          <span key={i} className={tagClass(i)}>{t}</span>
        ))}
      </div>

      <div className="sentiment-bars">
        {bars.map(({ label, pct, color }) => (
          <div className="sentiment-row" key={label}>
            <div className="sentiment-row-label">
              <span>{label}</span>
              <span>{pct}%</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mindbloom-insight">
        <p className="mindbloom-insight-label">MindBloom says:</p>
        <p>{safeResult.mindbloom}</p>
      </div>

      <div className="result-actions">
        <button className="result-btn-outline" onClick={onReset}>
          Write another
        </button>
      </div>
    </div>
  );
}

export default function Write() {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePrompt = (p) => {
    if (result || analyzing) return;
    setText((prev) => (prev ? prev + " " + p : p));
  };

  const handleAnalyze = async () => {
    if (!text.trim() || wordCount < 3 || analyzing) return;

    setAnalyzing(true);
    setSaved(false);

    try {
      const analysis = await analyzeJournal(text);

      if (!analysis) throw new Error("No AI response");

      setResult({
        tone: analysis.tone,
        tags: analysis.tags || [],
        positive: analysis.positive,
        neutral: analysis.neutral,
        negative: analysis.negative,
        mindbloom: analysis.mindbloom,
      });

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (user) {
        const { error } = await supabase.from("entries").insert([
          {
            user_id: user.id,
            note: text,
            tone: analysis.tone,
            positive: analysis.positive,
            neutral: analysis.neutral,
            negative: analysis.negative,
            mindbloom: analysis.mindbloom,
            tags: analysis.tags,
          },
        ]);

        if (!error) setSaved(true);
        else console.error("Save error:", error.message);
      }
    } catch (err) {
      console.error("AI error:", err);

      setResult({
        tone: "Error",
        tags: ["system"],
        positive: 33,
        neutral: 34,
        negative: 33,
        mindbloom: "AI failed to analyze this entry.",
      });
    }

    setAnalyzing(false);
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setSaved(false);
  };

  return (
    <div className="write-page-v2">

      <div className="write-header">
        <h1>How are you today?</h1>
      </div>

      <div className="write-columns">

        <div className="write-main">

          <textarea
            placeholder="Write freely about how you're feeling today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="journal-input-v2"
            disabled={!!result || analyzing}
          />

          <div className="write-footer-v2">
            <span className="word-count">
              {wordCount} words · min. 5 recommended
            </span>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!text.trim() || analyzing || !!result}
            >
              {analyzing ? "Analyzing…" : "✨ Analyze with AI"}
            </button>
          </div>

          {saved && (
            <p style={{ marginTop: 10, color: "#6DBF8A" }}>
              Saved to Supabase ✔
            </p>
          )}

          {result && (
            <ResultView result={result} onReset={handleReset} />
          )}
        </div>

        <div className="write-sidebar">

          <div className="write-tips-card">
            <p className="write-tips-title">💡 Writing tips</p>
            <ul className="write-tips-list">
              {TIPS.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div className="write-tips-card">
            <p className="write-tips-title">✨ PROMPT IDEAS</p>
            <div className="prompt-chips">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  className="prompt-chip"
                  onClick={() => handlePrompt(p)}
                  disabled={!!result || analyzing}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}