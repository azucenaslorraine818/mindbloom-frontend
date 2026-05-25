import { useState } from "react";
import { supabase } from "../lib/supabase";

const FAQS = [
  {
    q: "How does MindBloom analyze my emotions?",
    a: "MindBloom uses AI to read your journal entries and detect the emotional tone — positive, neutral, or negative. Over time, it builds a picture of your emotional patterns so you can spot trends.",
  },
  {
    q: "Is my journal data private?",
    a: "Yes. Your entries are stored securely and are only visible to you. We never share your personal data with third parties.",
  },
  {
    q: "Can I delete my entries?",
    a: "Yes! Head to the History page, open any entry, and you'll find a delete option. Deleted entries are permanently removed.",
  },
  {
    q: "How do I change my password?",
    a: "Go to Settings → Change Password, enter your new password, confirm it, and hit Update Password.",
  },
  {
    q: "Why is my tone analysis showing 'Neutral'?",
    a: "The AI needs enough text to accurately detect emotion. Try writing a few more sentences in your entry — more detail helps the model understand how you're really feeling.",
  },
  {
    q: "Can I use MindBloom on my phone?",
    a: "Absolutely. MindBloom is fully responsive and works great on mobile browsers. A dedicated app may be coming in the future!",
  },
  {
    q: "How do I turn off daily reminders?",
    a: "Go to Settings → Notifications and toggle off 'Daily Reminders'. Changes are saved immediately.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`faq-item ${open ? "open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-chevron">{open ? "−" : "+"}</span>
      </div>

      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

export default function Support() {
  const [showContact, setShowContact] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSending(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      // Insert contact message into a contact_messages table
      const { error: insertError } = await supabase
        .from("contact_messages")
        .insert([
          {
            user_id: user?.id || null,
            name,
            email,
            message,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        setError("Failed to send message. Please try again.");
        console.error("Contact form error:", insertError);
        setSending(false);
        return;
      }

      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }

    setSending(false);
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <h1 className="support-title">Help & Support</h1>
        <p className="support-subtitle">A calm space for common questions</p>
      </div>

      {/* FAQs */}
      <section className="support-section">
        <div className="support-section-label">
          <span className="support-section-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          Frequently Asked Questions
        </div>

        <div className="faq-list">
          {FAQS.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="support-section" style={{ marginTop: "40px" }}>
        <div className="support-section-label">
          <span className="support-section-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          Contact Us
        </div>

        <div
          style={{
            background: "#f9f9f9",
            padding: "30px",
            borderRadius: "12px",
            marginTop: "20px",
          }}
        >
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Didn't find what you're looking for? Send us a message and we'll get back to you soon.
          </p>

          {sent && (
            <div
              style={{
                background: "#e8f5e9",
                color: "#2e7d32",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ✅ Thank you! We've received your message.
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows="5"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              style={{
                background: "#e8607a",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.6 : 1,
              }}
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}