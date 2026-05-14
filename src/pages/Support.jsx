import { useState } from "react";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSending(true);

    // Replace with your actual support email / Supabase insert
    await new Promise((r) => setTimeout(r, 1000));

    setSending(false);
    setSent(true);

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <h1 className="support-title">Help & Support</h1>
        <p className="support-subtitle">
          A calm space for common questions
        </p>
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
    </div>
  );
}