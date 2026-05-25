import { useEffect, useState } from "react";
import { ToneChip } from "../lib/mindbloom";
import { supabase } from "../lib/supabase";

const formatPHDate = (dateString) => {
  if (!dateString) return "No date";
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

function getToneStyle(tone) {
  const t = (tone || "").toLowerCase();
  if (t === "positive") return {
    background: "#f0fff4",
    border: "1px solid #b7ebc6",
    borderLeft: "6px solid #6DBF8A",
  };
  if (t === "negative") return {
    background: "#fff1f0",
    border: "1px solid #ffccc7",
    borderLeft: "6px solid #E8607A",
  };
  return {
    background: "#f5f5f5",
    border: "1px solid #e5e5e5",
    borderLeft: "6px solid #A0AEC0",
  };
}

// ── Trash icon ────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}>
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

function EntryModal({ entry, onClose, onDelete }) {
  const safe = {
    positive: entry.positive ?? 33,
    neutral:  entry.neutral  ?? 34,
    negative: entry.negative ?? 33,
  };
  const bars = [
    { label: "Positive", pct: safe.positive, color: "#6DBF8A" },
    { label: "Neutral",  pct: safe.neutral,  color: "#A0AEC0" },
    { label: "Negative", pct: safe.negative, color: "#E8607A" },
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(45,27,34,0.35)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2000, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff8fa", borderRadius: 28, padding: "28px 24px",
          maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(232,96,122,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#8a6672" }}>{formatPHDate(entry.created_at)}</span>
          <ToneChip tone={entry.tone || "Neutral"} />
        </div>

        {/* Entry text */}
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#5f4650" }}>{entry.note}</p>

        {/* Sentiment bars */}
        <div style={{ marginTop: 16 }}>
          {bars.map(({ label, pct, color }) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#2d1b22", marginBottom: 4 }}>
                <span>{label}</span><span style={{ color: "#8a6672", fontWeight: 600 }}>{pct}%</span>
              </div>
              <div style={{ height: 7, background: "#f5eef0", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 10, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* MindBloom insight */}
        <div style={{
          marginTop: 16, background: "#fde8ed", border: "1px solid #f4c0cf",
          borderRadius: 14, padding: "14px 16px",
        }}>
          <p style={{ fontWeight: 700, fontSize: 13, color: "#c0475f", marginBottom: 6 }}>
            MindBloom says:
          </p>
          <p style={{ fontSize: 13, color: "#8a6672", lineHeight: 1.6 }}>
            {entry.mindbloom || "No insight available."}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Close — primary pink */}
          <button
            onClick={onClose}
            style={{
              width: "100%", border: "none",
              background: "linear-gradient(135deg, #e8607a, #f08ca2)",
              color: "#fff", padding: "13px", borderRadius: 50,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(232,96,122,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Close
          </button>

          {/* Delete — rose-red, MindBloom palette */}
          <button
            onClick={async () => { await onDelete(entry.id); onClose(); }}
            style={{
              width: "100%", border: "1.5px solid #f4c0cf",
              background: "#fff0f4",
              color: "#c0475f",
              padding: "12px", borderRadius: 50,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              transition: "background 0.18s, color 0.18s, border-color 0.18s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#fde8ed";
              e.currentTarget.style.borderColor = "#e8607a";
              e.currentTarget.style.color = "#a0334a";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#fff0f4";
              e.currentTarget.style.borderColor = "#f4c0cf";
              e.currentTarget.style.color = "#c0475f";
            }}
          >
            <TrashIcon /> Delete Entry
          </button>

        </div>
      </div>
    </div>
  );
}

const FILTERS = ["All", "Positive", "Neutral", "Negative"];

export default function History() {
  const [entries, setEntries]       = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("All");
  const [selectMode, setSelectMode] = useState(false);
  const [checked, setChecked]       = useState(new Set());
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setEntries([]); setLoading(false); return; }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setEntries(error ? [] : data || []);
      setLoading(false);
    };
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this entry?");
    if (!confirmDelete) return;
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleCheck = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (checked.size === 0) return;
    const confirmDelete = window.confirm(
      `Delete ${checked.size} selected entr${checked.size === 1 ? "y" : "ies"}?`
    );
    if (!confirmDelete) return;
    setDeleting(true);
    const ids = Array.from(checked);
    const { error } = await supabase.from("entries").delete().in("id", ids);
    if (!error) {
      setEntries((prev) => prev.filter((e) => !ids.includes(e.id)));
      setChecked(new Set());
      setSelectMode(false);
    }
    setDeleting(false);
  };

  const cancelSelect = () => {
    setSelectMode(false);
    setChecked(new Set());
  };

  const selectAll = () => {
    const visibleIds = filtered.map((e) => e.id);
    if (checked.size === visibleIds.length) {
      setChecked(new Set());
    } else {
      setChecked(new Set(visibleIds));
    }
  };

  const filtered = filter === "All"
    ? entries
    : entries.filter((e) => (e.tone || "Neutral").toLowerCase() === filter.toLowerCase());

  return (
    <div className="history-page">

      {/* HEADER */}
      <div className="history-header">
        <h1>Journal History</h1>
        <p>Revisit your thoughts, emotions, and reflections over time.</p>
      </div>

      {/* FILTERS + ACTIONS BAR */}
      <div className="history-toolbar">
        <div className="history-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`history-filter-btn ${filter === f ? "active" : ""} ${f.toLowerCase()}`}
              onClick={() => { setFilter(f); cancelSelect(); }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="history-select-controls">
          {!selectMode ? (
            <button className="history-select-btn" onClick={() => setSelectMode(true)}>
              Select
            </button>
          ) : (
            <>
              <button className="history-select-btn" onClick={selectAll}>
                {checked.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
              </button>
              {checked.size > 0 && (
                <button
                  className="history-delete-btn"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : `Delete (${checked.size})`}
                </button>
              )}
              <button className="history-cancel-btn" onClick={cancelSelect}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* ENTRY COUNT */}
      {!loading && entries.length > 0 && (
        <p className="history-count">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          {filter !== "All" ? ` · ${filter}` : ""}
        </p>
      )}

      {/* LIST */}
      {loading ? (
        <div className="history-empty"><p>Loading entries...</p></div>
      ) : filtered.length === 0 ? (
        <div className="history-empty">
          <p>
            {entries.length === 0
              ? "No entries yet. Write your first one!"
              : `No ${filter.toLowerCase()} entries.`}
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map((entry) => {
            const isChecked = checked.has(entry.id);
            const sentiment = (entry.tone || entry.mood || "Neutral").toLowerCase();
            return (
              <div
                key={entry.id}
                className={`entry-card ${selectMode && isChecked ? "entry-card-selected" : ""}`}
                data-sentiment={sentiment}
                style={getToneStyle(entry.tone || entry.mood)}
                onClick={() => {
                  if (selectMode) { toggleCheck(entry.id); }
                  else { setSelected(entry); }
                }}
              >
                {selectMode && (
                  <div className="entry-checkbox-wrap">
                    <div className={`entry-checkbox ${isChecked ? "checked" : ""}`}>
                      {isChecked && <span>✓</span>}
                    </div>
                  </div>
                )}
                <div className="entry-top">
                  <span className="entry-date">{formatPHDate(entry.created_at)}</span>
                  <ToneChip tone={entry.tone || "Neutral"} />
                </div>
                <p className="entry-text">"{entry.note}"</p>
              </div>
            );
          })}
        </div>
      )}

      {selected && !selectMode && (
        <EntryModal
          entry={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}