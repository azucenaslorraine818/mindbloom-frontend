import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/* ── CONSENT MODAL ─────────────────────────────────────────── */
function ConsentModal({ onAccept, onDecline }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="modal-overlay" onClick={onDecline}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🌸</div>
        <h2 className="modal-title">Before you bloom</h2>
        <p className="modal-subtitle">
          MindBloom uses AI to analyze your journal entries and detect emotional
          patterns. Please read and agree before continuing.
        </p>
        <div className="modal-points">
          {[
            ["🔒", "Your entries are private and securely stored. Only you can access them."],
            ["🤖", "AI analysis detects stress and emotional patterns in your writing."],
            ["📊", "Anonymized data may be used to improve the app experience."],
            ["❤️", "MindBloom is a journaling tool — not a substitute for professional care."],
          ].map(([icon, text]) => (
            <div className="modal-point" key={text}>
              <span className="modal-point-icon">{icon}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <label className="modal-check-row">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="modal-checkbox" />
          <span>I understand and agree to MindBloom's data usage and terms.</span>
        </label>
        <button className="auth-button" style={{ width: "100%", marginTop: 16, opacity: checked ? 1 : 0.5 }} disabled={!checked} onClick={onAccept}>
          I Agree — Let's Bloom 🌸
        </button>
        <button className="modal-decline" onClick={onDecline}>Cancel</button>
      </div>
    </div>
  );
}

/* ── AUTH PANEL ─────────────────────────────────────────────── */
function AuthPanel({ tab, setTab }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const switchTab = (t) => { setTab(t); setError(""); };

  const handleLogin = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) navigate("/app");
    setLoading(false);
  };

  const handleSignupRequest = (e) => {
    e.preventDefault(); setError("");
    if (!email || !password || !firstName || !lastName) return setError("Please complete all fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setShowConsent(true);
  };

  const handleSignupConfirm = async () => {
    setShowConsent(false); setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert([{ id: data.user.id, first_name: firstName, last_name: lastName, age: age ? Number(age) : null, sex: sex || "Prefer not to say" }]);
      navigate("/app");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="lp-auth-panel" id="get-started">
        <div className="lp-auth-panel-inner">
          <div className="lp-auth-logo-row">
            <img src="/mblogo.png" alt="MindBloom" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <span className="lp-auth-brand">MindBloom</span>
          </div>

          <div className="lp-tabs">
            <button className={tab === "login" ? "lp-tab active" : "lp-tab"} onClick={() => switchTab("login")}>Log In</button>
            <button className={tab === "signup" ? "lp-tab active" : "lp-tab"} onClick={() => switchTab("signup")}>Sign Up</button>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="lp-auth-form">
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="lp-input" required />
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="lp-input" required />
              {error && <p className="lp-error">{error}</p>}
              <button className="lp-submit-btn" disabled={loading}>{loading ? "Logging in…" : "Log In"}</button>
            </form>
          ) : (
            <form onSubmit={handleSignupRequest} className="lp-auth-form">
              <div className="lp-input-row">
                <input placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} className="lp-input" required />
                <input placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} className="lp-input" required />
              </div>
              <div className="lp-input-row">
                <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} className="lp-input" min="10" max="120" />
                <select onChange={(e) => setSex(e.target.value)} className="lp-input lp-select">
                  <option value="">Sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="lp-input" required />
              <input type="password" placeholder="Password (min 6 chars)" onChange={(e) => setPassword(e.target.value)} className="lp-input" required />
              {error && <p className="lp-error">{error}</p>}
              <button className="lp-submit-btn" disabled={loading}>{loading ? "Creating account…" : "Sign up"}</button>
            </form>
          )}
        </div>
      </div>
      {showConsent && <ConsentModal onAccept={handleSignupConfirm} onDecline={() => setShowConsent(false)} />}
    </>
  );
}

/* ── ILLUSTRATION ───────────────────────────────────────────── */
function Illustration() {
  return (
    <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="lp-illustration">
      <ellipse cx="260" cy="200" rx="160" ry="160" fill="#fde8ed" opacity="0.6" />
      <ellipse cx="300" cy="230" rx="110" ry="100" fill="#fde8ed" opacity="0.5" />
      <rect x="60" y="280" width="300" height="14" rx="7" fill="#f4c0cf" />
      <rect x="100" y="294" width="14" height="50" rx="7" fill="#f4c0cf" />
      <rect x="306" y="294" width="14" height="50" rx="7" fill="#f4c0cf" />
      <rect x="130" y="210" width="110" height="75" rx="10" fill="#e8607a" />
      <rect x="135" y="215" width="100" height="65" rx="8" fill="#f08ca2" />
      <rect x="178" y="210" width="8" height="75" rx="4" fill="#e8607a" />
      <rect x="148" y="232" width="56" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="148" y="244" width="44" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="148" y="256" width="50" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="210" y="210" width="10" height="28" rx="2" fill="#fff0f5" />
      <polygon points="210,238 220,238 215,246" fill="#fff0f5" />
      <rect x="248" y="220" width="8" height="60" rx="4" fill="#2d1b22" transform="rotate(-20 248 220)" />
      <polygon points="248,280 256,280 252,292" fill="#e8607a" transform="rotate(-20 252 280)" />
      <rect x="249" y="221" width="6" height="10" rx="2" fill="#f5c842" transform="rotate(-20 249 221)" />
      <ellipse cx="95" cy="268" rx="22" ry="10" fill="#f4c0cf" />
      <rect x="80" y="258" width="30" height="22" rx="6" fill="#f4c0cf" />
      <rect x="87" y="248" width="6" height="18" rx="3" fill="#6dbf8a" />
      <ellipse cx="90" cy="242" rx="12" ry="10" fill="#6dbf8a" />
      <ellipse cx="82" cy="248" rx="8" ry="7" fill="#6dbf8a" />
      <ellipse cx="98" cy="248" rx="8" ry="7" fill="#6dbf8a" />
      <ellipse cx="345" cy="272" rx="18" ry="8" fill="#f4c0cf" />
      <rect x="332" y="264" width="26" height="18" rx="5" fill="#f4c0cf" />
      <rect x="343" y="250" width="5" height="22" rx="2.5" fill="#6dbf8a" />
      <ellipse cx="345" cy="244" rx="10" ry="9" fill="#6dbf8a" />
      <ellipse cx="338" cy="250" rx="7" ry="6" fill="#6dbf8a" />
      <ellipse cx="352" cy="250" rx="7" ry="6" fill="#6dbf8a" />
      <rect x="30" y="130" width="90" height="30" rx="15" fill="white" filter="url(#shadow)" />
      <text x="48" y="150" fontSize="13" fill="#2a7d46" fontWeight="600">😊 Positive</text>
      <rect x="290" y="80" width="100" height="30" rx="15" fill="white" filter="url(#shadow)" />
      <text x="306" y="100" fontSize="13" fill="#e8607a" fontWeight="600">🌸 Bloom</text>
      <rect x="50" y="185" width="80" height="28" rx="14" fill="#d4f0dc" />
      <text x="65" y="204" fontSize="12" fill="#2a7d46" fontWeight="600">Calm 72%</text>
      <rect x="310" y="155" width="90" height="28" rx="14" fill="#fbdce2" />
      <text x="325" y="174" fontSize="12" fill="#a33050" fontWeight="600">Stress 28%</text>
      <text x="170" y="90" fontSize="22">✨</text>
      <text x="55" y="90" fontSize="16">🌸</text>
      <text x="350" y="200" fontSize="18">💫</text>
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#e8607a" floodOpacity="0.12" />
        </filter>
      </defs>
    </svg>
  );
}

/* ── FEATURES SECTION ───────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    { icon: "✍️", color: "#fff0f5", title: "Daily Journaling",        desc: "Write freely about your day with no judgment. Honest words lead to real insights." },
    { icon: "🤖", color: "#f0e8ff", title: "AI Emotion Detection",    desc: "AI reads your entries and detects positive, neutral, or negative emotional tones instantly." },
    { icon: "📊", color: "#e7f4ff", title: "Stress Pattern Tracking", desc: "See your weekly emotional averages and high-stress days visualized in clear, simple charts." },
    { icon: "🔒", color: "#d4f0dc", title: "Private & Secure",        desc: "Your journal is yours alone. Entries are securely stored and never shared without consent." },
  ];
  return (
    <section className="lp-features-section" id="features">
      <div className="lp-section-inner">
        <div className="lp-section-label">Features</div>
        <h2 className="lp-section-heading">Everything you need to understand your mind</h2>
        <div className="lp-features-grid">
          {features.map((f) => (
            <div className="lp-feature-card" key={f.title}>
              <div className="lp-feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT SECTION ──────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="lp-about-section" id="about">
      <div className="lp-section-inner lp-about-grid">
        <div>
          <div className="lp-section-label">About Us</div>
          <h2 className="lp-section-heading" style={{ textAlign: "left" }}>
            Built for the overwhelmed, the burnt out, the quietly struggling.
          </h2>
          <p className="lp-about-body">
            Stress and burnout are common problems especially among students and young adults.
            Many feel overwhelmed by school, work, and social expectations — yet can't clearly
            identify what triggers these emotions.
          </p>
          <p className="lp-about-body">
            MindBloom bridges that gap by combining daily journaling with AI-driven sentiment
            analysis, helping users move from "I feel bad" to "I understand why."
          </p>
          <div className="lp-sdg-badge">SDG 3 — Good Health and Well-being</div>
        </div>
        <div className="lp-about-card">
          <div className="lp-about-quote">"</div>
          <p className="lp-about-quote-text">
            Without awareness, stress can build up over time and affect mental health and daily life.
            MindBloom makes stress awareness simple, objective, and accessible.
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: 16, marginTop: 16 }}>
            <p style={{ fontSize: 12, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Target Users</p>
            {["· Students", "· Young Individuals", "· Anyone seeking non-clinical wellness support"].map((t) => (
              <p key={t} style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, padding: "4px 0" }}>{t}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── MAIN ───────────────────────────────────────────────────── */
export default function Landing() {
  const [tab, setTab] = useState("login");

  return (
    <div className="lp-root">

      {/* NAVBAR */}
      <nav className="lp-navbar">
        <div className="lp-navbar-brand">
          <img src="/mblogo.png" alt="MindBloom" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span>MindBloom</span>
        </div>
        <div className="lp-navbar-links">
          <button onClick={() => scrollTo("features")}>Features</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("get-started")}>Get Started</button>
        </div>
      </nav>

      {/* HERO SPLIT */}
      <div className="lp-split">

        {/* LEFT */}
        <div className="lp-hero">
          <div className="lp-hero-badge">AI-Powered Mental Wellness</div>
          <h1 className="lp-hero-title">
            Your mind<br />
            <span className="lp-hero-accent">deserves to</span><br />
            bloom.
          </h1>
          <p className="lp-hero-body">
            Write freely. Let AI understand your emotions.
            Discover your stress patterns and grow — one journal entry at a time.
          </p>
          <div className="lp-hero-trust">
            <span>🔒 Private</span>
            <span>🤖 AI-powered</span>
            <span>📊 Visual insights</span>
          </div>
        </div>

        {/* RIGHT — ILLUSTRATION + AUTH */}
        <div className="lp-right">
          <div className="lp-illustration-wrap">
            <Illustration />
          </div>
          <AuthPanel tab={tab} setTab={setTab} />
        </div>

      </div>

      {/* FEATURES */}
      <FeaturesSection />

      {/* ABOUT */}
      <AboutSection />

      {/* STATS STRIP */}
      <div className="lp-about-strip">
        <div className="lp-about-strip-inner">
          <div className="lp-about-stat"><strong>SDG 3</strong><span>Good Health & Well-being</span></div>
          <div className="lp-about-div" />
          <div className="lp-about-stat"><strong>AI</strong><span>Sentiment analysis</span></div>
          <div className="lp-about-div" />
          <div className="lp-about-stat"><strong>Students</strong><span>Primary target users</span></div>
          <div className="lp-about-div" />
          <div className="lp-about-stat"><strong>Free</strong><span>Always & forever</span></div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <img src="/mblogo.png" alt="MindBloom" style={{ width: 18, height: 18, objectFit: "contain" }} />
          <span>MindBloom</span>
        </div>
        <p>© 2026 MindBloom. All rights reserved.</p>
      </footer>

    </div>
  );
}