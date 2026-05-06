// ── MindBloom SVG Logo ────────────────────────────────────────────
const PINK = "#E8607A";
const PINK_MID = "#F4C0CF";

export function Logo({ size = 60 }) {
  const scale = size / 60;

  return (
    <svg width={60 * scale} height={72 * scale} viewBox="0 0 60 72" fill="none">
      <ellipse cx="30" cy="56" rx="14" ry="5" fill="#FDE8ED" />
      <rect x="28" y="40" width="4" height="20" rx="2" fill={PINK} />
      <ellipse cx="22" cy="38" rx="10" ry="13" fill={PINK_MID} />
      <ellipse cx="38" cy="38" rx="10" ry="13" fill={PINK_MID} />
      <ellipse cx="30" cy="30" rx="12" ry="16" fill={PINK} />
      <ellipse cx="30" cy="24" rx="8" ry="10" fill="#F8A0B8" />
      <path d="M22 36 Q30 20 38 36" fill={PINK} />
      <ellipse cx="30" cy="20" rx="5" ry="7" fill={PINK_MID} />
    </svg>
  );
}

// ── WORD LISTS ─────────────────────────────────────────────────────
const POSITIVE_WORDS = [
  "good","great","happy","love","excellent","wonderful","amazing","fantastic",
  "joy","excited","pleased","glad","thankful","grateful","blessed","fun","nice",
  "beautiful","awesome","win","winning","helped","calm","peaceful","motivated",
  "productive","relaxed","better","improved","progress"
];

const NEGATIVE_WORDS = [
  "bad","sad","stress","anxious","overwhelmed","tired","exhausted","angry",
  "frustrated","upset","worried","fear","hate","terrible","awful","horrible",
  "drain","draining","argument","deadlines","difficult","hard","struggle",
  "bored","couldn't","didn't","lonely","nervous","confused","lost"
];

const COPING_WORDS = [
  "walk","walked","breathe","rest","sleep","helped","talk","journal","meditate"
];

// ── SIMPLE SENTIMENT ENGINE ────────────────────────────────────────
export function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);

  let pos = 0;
  let neg = 0;

  words.forEach((w) => {
    if (POSITIVE_WORDS.includes(w)) pos++;
    if (NEGATIVE_WORDS.includes(w)) neg++;
  });

  const coping = words.some(w => COPING_WORDS.includes(w));

  // prevent divide by zero
  const total = pos + neg || 1;

  let positive = Math.round((pos / total) * 100);
  let negative = Math.round((neg / total) * 100);

  // neutral is remainder
  let neutral = Math.max(0, 100 - positive - negative);

  // FIX rounding issues (force 100%)
  const fix = positive + neutral + negative;
  if (fix !== 100) {
    neutral += 100 - fix;
  }

  // ── TONE DECISION ──
  let tone = "Neutral";

  if (positive >= 60) tone = "Positive";
  else if (negative >= 60) tone = "Negative";
  else tone = "Neutral";

  // ── TAGS ──
  const tags = [];

  if (negative > 30) tags.push("Stress detected");
  if (positive > 30) tags.push("Positive mood");
  if (coping) tags.push("Coping activity found");

  if (tags.length === 0) tags.push("Stable mood");

  // ── INSIGHT ──
  const mindbloom =
    tone === "Positive"
      ? "You're doing well emotionally today. Keep building on what makes you feel good."
      : tone === "Negative"
      ? "You seem overwhelmed. Try slowing down and giving yourself rest."
      : "Your emotions feel balanced today. Keep checking in with yourself.";

  return { tone, positive, neutral, negative, tags, mindbloom };
}

// ── ToneChip ──────────────────────────────────────────────────────
export function ToneChip({ tone }) {
  const cls =
    tone === "Positive"
      ? "positive"
      : tone === "Negative"
      ? "negative"
      : "neutral";

  return <span className={`tone-chip ${cls}`}>{tone}</span>;
}

// ── MOCK DATA ─────────────────────────────────────────────────────
export const WEEK_DATA = [
  { day: "Sun", positive: 55, neutral: 20, negative: 25 },
  { day: "Mon", positive: 30, neutral: 25, negative: 45 },
  { day: "Tue", positive: 70, neutral: 20, negative: 10 },
  { day: "Wed", positive: 40, neutral: 30, negative: 30 },
  { day: "Thu", positive: 25, neutral: 30, negative: 45 },
  { day: "Fri", positive: 28, neutral: 30, negative: 42 },
  { day: "Sat", positive: 50, neutral: 28, negative: 22 },
];

export const SEED_ENTRIES = [
  {
    id: 1,
    date: "May 1, 2026",
    text: "Today was draining but I went for a walk and felt better.",
    tone: "Negative",
    positive: 28,
    neutral: 30,
    negative: 42,
    tags: ["Stress detected", "Coping activity found"],
    mindbloom: "You experienced stress but used a healthy coping method like walking.",
  },
];