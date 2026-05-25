import { useState } from "react";
import { supabase } from "../lib/supabase";
import { analyzeSentiment } from "../lib/mindbloom";
import { buildEmailTemplate } from "../lib/email-templates";
import { 
  checkAndCreateNotifications, 
  cleanupOldNotifications,
  detectSuicidalIntent,
  createCrisisAlert,
} from "../lib/notification-service";

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

  const handlePrompt = (p) => {
    if (result || analyzing) return;
    setText((prev) => (prev ? prev + " " + p : p));
  };

  const handleAnalyze = async () => {
    if (!text.trim() || wordCount < 3 || analyzing) return;

    setAnalyzing(true);
    setSaved(false);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error("Not authenticated");

      const analysis = analyzeSentiment(text);
      if (!analysis) throw new Error("No analysis returned");

      const safeAnalysis = {
        tone: analysis.tone || "Unknown",
        tags: analysis.tags || [],
        positive: analysis.positive ?? 33,
        neutral: analysis.neutral ?? 34,
        negative: analysis.negative ?? 33,
        stressscore: analysis.stressScore || 0,
        stressors: analysis.stressors || [],
        polarity: analysis.polarity || 0,
        mindbloom: analysis.mindbloom || "",
      };

      setResult(safeAnalysis);

      const { data: savedEntry, error } = await supabase.from("entries").insert([
        {
          user_id: user.id,
          note: text,
          tone: safeAnalysis.tone,
          positive: safeAnalysis.positive,
          neutral: safeAnalysis.neutral,
          negative: safeAnalysis.negative,
          stressscore: safeAnalysis.stressscore,
          stressors: safeAnalysis.stressors,
          tags: safeAnalysis.tags,
          polarity: safeAnalysis.polarity,
          mindbloom: safeAnalysis.mindbloom,
        },
      ]).select();

      if (!error) {
        setSaved(true);

        // ──── TRIGGER NOTIFICATIONS ────
        if (savedEntry && savedEntry[0]) {
          const newEntry = {
            ...savedEntry[0],
            stressScore: safeAnalysis.stressscore,
          };
          await checkAndCreateNotifications(user.id, newEntry);
          await cleanupOldNotifications(user.id);
        }
      } else {
        console.error("Save error:", error);
      }

      // ──── SUICIDE DETECTION ────
      const isSuicidal = detectSuicidalIntent(text);
      
      if (isSuicidal) {
        console.warn("🚨 Suicidal intent detected");
        
        // Create crisis notification
        await createCrisisAlert(user.id);
        
        // Send emergency email to emergency contact
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("emergency_contact_email, emergency_contact_name, first_name")
            .eq("id", user.id)
            .single();

          if (profile?.emergency_contact_email) {
            const emailTemplate = buildEmailTemplate("suicide_detection", {
              emergency_contact_name: profile.emergency_contact_name,
              user_name: profile.first_name || "Your friend",
              entry_text: text,
            });

            await supabase.functions.invoke("send-email", {
              body: {
                email: profile.emergency_contact_email,
                subject: emailTemplate.subject,
                htmlContent: emailTemplate.htmlContent,
                email_type: "suicide_detection",
              },
            });

            console.log("✅ Suicide detection email sent");
          }
        } catch (emailErr) {
          console.error("⚠️ Suicide email send failed:", emailErr);
        }
      }

      // ──── HIGH STRESS ALERT (if not suicidal) ────
      const isCritical =
        safeAnalysis.negative >= 85 ||
        (safeAnalysis.tone === "Negative" && safeAnalysis.negative >= 70);

      const lastAlert = localStorage.getItem("last_emergency_alert");
      const now = Date.now();
      const canSend = !lastAlert || now - lastAlert > 6 * 60 * 60 * 1000;

      if (isCritical && canSend && !isSuicidal) {
        console.warn("⚠️ High stress detected");
        localStorage.setItem("last_emergency_alert", now);

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("emergency_contact_email, emergency_contact_name, first_name")
            .eq("id", user.id)
            .single();

          if (profile?.emergency_contact_email) {
            const emailTemplate = buildEmailTemplate("high_stress", {
              emergency_contact_name: profile.emergency_contact_name,
              user_name: profile.first_name || "Your friend",
              entry_text: text,
            });

            await supabase.functions.invoke("send-email", {
              body: {
                email: profile.emergency_contact_email,
                subject: emailTemplate.subject,
                htmlContent: emailTemplate.htmlContent,
                email_type: "high_stress",
              },
            });

            console.log("✅ High stress email sent");
          }
        } catch (emailErr) {
          console.error("⚠️ High stress email send failed:", emailErr);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setResult({
        tone: "Error",
        tags: ["system"],
        positive: 33,
        neutral: 34,
        negative: 33,
        mindbloom: "Failed to analyze. Try again.",
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
            <p className="write-tips-title">Writing tips</p>
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