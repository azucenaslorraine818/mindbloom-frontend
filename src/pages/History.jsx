import { useEffect, useState } from "react";
import { ToneChip } from "../lib/mindbloom";
import { supabase } from "../lib/supabase";

// 🇵🇭 PH TIME FORMAT HELPER
const formatPHDate = (dateString) => {
  if (!dateString) return "No date";

  // Force UTC parsing by appending Z
  const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
  const date = new Date(utcString);

  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// 🎨 TONE COLOR SYSTEM (PASTEL)
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

function EntryModal({ entry, onClose, onDelete }) {
  const safe = {
    positive: entry.positive ?? 33,
    neutral: entry.neutral ?? 34,
    negative: entry.negative ?? 33,
  };

  const bars = [
    { label: "Positive", pct: safe.positive, color: "#6DBF8A" },
    { label: "Neutral", pct: safe.neutral, color: "#A0AEC0" },
    { label: "Negative", pct: safe.negative, color: "#E8607A" },
  ];

  const handleDeleteClick = async () => {
    await onDelete(entry.id);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(45,27,34,0.35)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff8fa",
          borderRadius: 28,
          padding: "28px 24px",
          maxWidth: 480,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(232,96,122,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#8a6672" }}>
            {formatPHDate(entry.created_at)}
          </span>
          <ToneChip tone={entry.tone || "Neutral"} />
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#5f4650" }}>
          {entry.note}
        </p>

        <div style={{ marginTop: 16 }}>
          {bars.map(({ label, pct, color }) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#eee", borderRadius: 10 }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: color,
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <p style={{ fontWeight: 600 }}>MindBloom says:</p>
          <p>{entry.mindbloom || "No insight available."}</p>
        </div>

        <button
          onClick={handleDeleteClick}
          style={{
            marginTop: 14,
            width: "100%",
            border: "none",
            background: "#E8607A",
            color: "#fff",
            padding: "13px",
            borderRadius: 50,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Delete Entry
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            width: "100%",
            border: "none",
            background: "linear-gradient(135deg,#e8607a,#f08ca2)",
            color: "#fff",
            padding: "13px",
            borderRadius: 50,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function History() {
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH ENTRIES
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error.message);
        setEntries([]);
      } else {
        setEntries(data || []);
      }

      setLoading(false);
    };

    fetchEntries();
  }, []);

  // DELETE ENTRY
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this entry?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="history-page">

      <div className="history-header">
        <h1>Journal History 📖</h1>
        <p>Revisit your thoughts, emotions, and reflections over time.</p>
      </div>

      {loading ? (
        <div className="history-empty">
          <p>Loading entries...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="history-empty">
          <p>No entries yet. Write your first one! ✍️</p>
        </div>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="entry-card"
              onClick={() => setSelected(entry)}
              style={getToneStyle(entry.tone || entry.mood)}
            >
              <div className="entry-top">
                <span className="entry-date">
                  {formatPHDate(entry.created_at)}
                </span>
                <ToneChip tone={entry.tone || "Neutral"} />
              </div>

              <p className="entry-text">"{entry.note}"</p>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <EntryModal
          entry={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}