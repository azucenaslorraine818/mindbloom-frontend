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

// ── POSITIVE WORD LIST (word → weight) ────────────────────────────
const POSITIVE_WORDS = [
  // Phrases (checked first — longest to shortest)
  { w: "couldn't be better", v: 0.91 }, { w: "on top of the world", v: 0.93 },
  { w: "over the moon", v: 0.92 }, { w: "so excited", v: 0.86 },
  { w: "super excited", v: 0.88 }, { w: "really happy", v: 0.86 },
  { w: "very happy", v: 0.85 }, { w: "so happy", v: 0.88 },
  { w: "feeling great", v: 0.79 }, { w: "feeling good", v: 0.74 },
  { w: "feel great", v: 0.77 }, { w: "feel good", v: 0.72 },
  { w: "doing well", v: 0.68 }, { w: "going well", v: 0.71 },
  { w: "so grateful", v: 0.84 }, { w: "very grateful", v: 0.82 },
  { w: "so blessed", v: 0.84 }, { w: "very blessed", v: 0.83 },
  { w: "best day", v: 0.87 }, { w: "great day", v: 0.81 },
  { w: "good day", v: 0.72 }, { w: "finished early", v: 0.82 },
  { w: "did well", v: 0.75 }, { w: "went well", v: 0.73 },
  { w: "no complaints", v: 0.67 }, { w: "all good", v: 0.64 },
  { w: "love this", v: 0.87 }, { w: "love it", v: 0.86 },
  { w: "so good", v: 0.79 }, { w: "very good", v: 0.81 },
  // English single words
  { w: "amazing", v: 0.84 }, { w: "awesome", v: 0.82 },
  { w: "fantastic", v: 0.83 }, { w: "wonderful", v: 0.81 },
  { w: "excellent", v: 0.83 }, { w: "outstanding", v: 0.85 },
  { w: "brilliant", v: 0.83 }, { w: "thrilled", v: 0.84 },
  { w: "delighted", v: 0.83 }, { w: "ecstatic", v: 0.92 },
  { w: "elated", v: 0.89 }, { w: "excited", v: 0.79 },
  { w: "happy", v: 0.72 }, { w: "glad", v: 0.68 },
  { w: "great", v: 0.74 }, { w: "good", v: 0.63 },
  { w: "proud", v: 0.73 }, { w: "grateful", v: 0.75 },
  { w: "hopeful", v: 0.67 }, { w: "confident", v: 0.74 },
  { w: "relieved", v: 0.66 }, { w: "cheerful", v: 0.77 },
  { w: "optimistic", v: 0.72 }, { w: "content", v: 0.61 },
  { w: "blessed", v: 0.78 }, { w: "love", v: 0.74 },
  { w: "joyful", v: 0.81 }, { w: "joy", v: 0.76 },
  { w: "peaceful", v: 0.71 }, { w: "calm", v: 0.59 },
  { w: "relaxed", v: 0.63 }, { w: "refreshed", v: 0.67 },
  { w: "energized", v: 0.76 }, { w: "inspired", v: 0.78 },
  { w: "encouraged", v: 0.73 }, { w: "determined", v: 0.72 },
  { w: "focused", v: 0.67 }, { w: "productive", v: 0.72 },
  { w: "accomplished", v: 0.79 }, { w: "achieved", v: 0.76 },
  { w: "success", v: 0.78 }, { w: "winning", v: 0.79 },
  { w: "progress", v: 0.68 }, { w: "improving", v: 0.67 },
  { w: "supported", v: 0.69 }, { w: "appreciated", v: 0.73 },
  { w: "motivated", v: 0.76 }, { w: "comfortable", v: 0.62 },
  { w: "satisfied", v: 0.68 }, { w: "fun", v: 0.67 },
  { w: "laugh", v: 0.66 }, { w: "smile", v: 0.65 },
  { w: "positive", v: 0.64 }, { w: "nice", v: 0.58 },
  { w: "thankful", v: 0.73 }, { w: "rested", v: 0.65 },
  { w: "coped", v: 0.68 }, { w: "walked", v: 0.60 },
  { w: "helped", v: 0.64 }, { w: "finished", v: 0.62 },
  { w: "better", v: 0.58 }, { w: "okay", v: 0.47 },
  { w: "fine", v: 0.45 }, { w: "well", v: 0.43 },
  { w: "enjoyed", v: 0.71 }, { w: "enjoy", v: 0.69 },
  // Filipino / Taglish
  { w: "sobrang saya", v: 0.91 }, { w: "masayang masaya", v: 0.87 },
  { w: "ok naman", v: 0.49 }, { w: "okay naman", v: 0.49 },
  { w: "ayos naman", v: 0.54 }, { w: "masaya ako", v: 0.78 },
  { w: "proud ako", v: 0.76 }, { w: "ang galing", v: 0.78 },
  { w: "ang saya", v: 0.76 }, { w: "kaya ko", v: 0.74 },
  { w: "maraming salamat", v: 0.74 }, { w: "masaya", v: 0.78 },
  { w: "maganda", v: 0.72 }, { w: "ayos", v: 0.54 },
  { w: "galing", v: 0.74 }, { w: "saya", v: 0.71 },
  { w: "salamat", v: 0.67 }, { w: "mabuti", v: 0.61 },
  { w: "magaling", v: 0.72 }, { w: "tiwala", v: 0.69 },
  { w: "haha", v: 0.62 }, { w: "hahaha", v: 0.67 },
  // Typos
  { w: "hapy", v: 0.69 }, { w: "happpy", v: 0.71 },
  { w: "awsome", v: 0.80 }, { w: "amzing", v: 0.81 },
  { w: "luv", v: 0.71 }, { w: "thankfull", v: 0.73 },
];

// ── NEGATIVE WORD LIST (word → weight) ────────────────────────────
const NEGATIVE_WORDS = [
  // Phrases (checked first)
  { w: "not okay", v: 0.78 }, { w: "not ok", v: 0.77 },
  { w: "not fine", v: 0.74 }, { w: "not good", v: 0.71 },
  { w: "not happy", v: 0.74 }, { w: "not well", v: 0.72 },
  { w: "so stressed", v: 0.89 }, { w: "very stressed", v: 0.86 },
  { w: "super stressed", v: 0.89 }, { w: "so tired", v: 0.81 },
  { w: "very tired", v: 0.83 }, { w: "really stressed", v: 0.84 },
  { w: "really tired", v: 0.80 }, { w: "really bad", v: 0.79 },
  { w: "feeling bad", v: 0.74 }, { w: "feel bad", v: 0.72 },
  { w: "feeling down", v: 0.76 }, { w: "feeling low", v: 0.74 },
  { w: "feeling lost", v: 0.77 }, { w: "feeling empty", v: 0.79 },
  { w: "give up", v: 0.87 }, { w: "giving up", v: 0.86 },
  { w: "want to quit", v: 0.88 }, { w: "no motivation", v: 0.81 },
  { w: "no energy", v: 0.78 }, { w: "no hope", v: 0.86 },
  { w: "losing hope", v: 0.84 }, { w: "lost hope", v: 0.85 },
  { w: "burnt out", v: 0.87 }, { w: "burned out", v: 0.86 },
  { w: "breaking down", v: 0.88 }, { w: "falling apart", v: 0.87 },
  { w: "worst day", v: 0.89 }, { w: "bad day", v: 0.73 },
  { w: "rough day", v: 0.71 }, { w: "tough day", v: 0.69 },
  { w: "too much pressure", v: 0.86 }, { w: "so much pressure", v: 0.84 },
  { w: "at my limit", v: 0.84 }, { w: "can't focus", v: 0.74 },
  { w: "couldn't focus", v: 0.74 }, { w: "didn't sleep", v: 0.72 },
  { w: "kept blanking", v: 0.78 }, { w: "piling up", v: 0.72 },
  { w: "cant do this", v: 0.86 }, { w: "cannot do this", v: 0.86 },
  // English single words
  { w: "hopeless", v: 0.91 }, { w: "depressed", v: 0.92 },
  { w: "terrible", v: 0.88 }, { w: "hate", v: 0.84 },
  { w: "miserable", v: 0.87 }, { w: "overwhelmed", v: 0.83 },
  { w: "exhausted", v: 0.79 }, { w: "burnout", v: 0.86 },
  { w: "frustrated", v: 0.81 }, { w: "anxious", v: 0.78 },
  { w: "worried", v: 0.74 }, { w: "struggling", v: 0.77 },
  { w: "broken", v: 0.85 }, { w: "empty", v: 0.76 },
  { w: "lonely", v: 0.75 }, { w: "lost", v: 0.67 },
  { w: "scared", v: 0.73 }, { w: "afraid", v: 0.72 },
  { w: "stuck", v: 0.68 }, { w: "helpless", v: 0.82 },
  { w: "drained", v: 0.78 }, { w: "upset", v: 0.74 },
  { w: "disappointed", v: 0.73 }, { w: "sad", v: 0.71 },
  { w: "stressed", v: 0.76 }, { w: "tired", v: 0.57 },
  { w: "bad", v: 0.61 }, { w: "angry", v: 0.79 },
  { w: "difficult", v: 0.62 }, { w: "hard", v: 0.54 },
  { w: "pressure", v: 0.67 }, { w: "pain", v: 0.76 },
  { w: "hurt", v: 0.74 }, { w: "fail", v: 0.72 },
  { w: "failure", v: 0.78 }, { w: "useless", v: 0.84 },
  { w: "worthless", v: 0.87 }, { w: "weak", v: 0.69 },
  { w: "regret", v: 0.74 }, { w: "mistake", v: 0.67 },
  { w: "confused", v: 0.64 }, { w: "insecure", v: 0.74 },
  { w: "ignored", v: 0.74 }, { w: "isolated", v: 0.77 },
  { w: "unmotivated", v: 0.76 }, { w: "discouraged", v: 0.76 },
  { w: "unfair", v: 0.71 }, { w: "toxic", v: 0.82 },
  { w: "conflict", v: 0.72 }, { w: "argument", v: 0.73 },
  { w: "worry", v: 0.71 }, { w: "fear", v: 0.73 },
  { w: "nervous", v: 0.69 }, { w: "panic", v: 0.81 },
  { w: "overwhelm", v: 0.80 }, { w: "deadlines", v: 0.69 },
  { w: "deadline", v: 0.67 }, { w: "overloaded", v: 0.79 },
  { w: "numb", v: 0.76 }, { w: "trapped", v: 0.80 },
  { w: "ashamed", v: 0.78 }, { w: "embarrassed", v: 0.72 },
  { w: "guilty", v: 0.74 }, { w: "shame", v: 0.77 },
  { w: "crying", v: 0.78 }, { w: "cried", v: 0.75 },
  { w: "bored", v: 0.55 }, { w: "irritated", v: 0.74 },
  { w: "draining", v: 0.76 }, { w: "drain", v: 0.70 },
  { w: "heavy", v: 0.65 }, { w: "restless", v: 0.64 },
  // Filipino / Taglish
  { w: "hindi masaya", v: 0.81 }, { w: "di masaya", v: 0.81 },
  { w: "ayaw ko na", v: 0.88 }, { w: "hindi ko kaya", v: 0.85 },
  { w: "suko na", v: 0.84 }, { w: "walang motivation", v: 0.79 },
  { w: "walang gana", v: 0.76 }, { w: "sobrang lungkot", v: 0.91 },
  { w: "sobrang hirap", v: 0.88 }, { w: "pagod na pagod", v: 0.86 },
  { w: "malungkot ako", v: 0.78 }, { w: "galit ako", v: 0.77 },
  { w: "naiinis ako", v: 0.74 }, { w: "nahihirapan ako", v: 0.78 },
  { w: "malungkot", v: 0.78 }, { w: "lungkot", v: 0.74 },
  { w: "pagod", v: 0.67 }, { w: "naiinis", v: 0.74 },
  { w: "galit", v: 0.79 }, { w: "nalulungkot", v: 0.77 },
  { w: "hirap", v: 0.69 }, { w: "takot", v: 0.72 },
  { w: "sakit", v: 0.73 }, { w: "problema", v: 0.64 },
  { w: "naiiyak", v: 0.78 }, { w: "iyak", v: 0.73 },
  { w: "suko", v: 0.79 }, { w: "bigo", v: 0.76 },
  { w: "badtrip", v: 0.76 }, { w: "bad trip", v: 0.75 },
  // Typos
  { w: "sadd", v: 0.73 }, { w: "tierd", v: 0.55 },
  { w: "stresed", v: 0.74 }, { w: "anxous", v: 0.75 },
  { w: "overwelmed", v: 0.81 }, { w: "exausted", v: 0.77 },
  { w: "frustarted", v: 0.79 }, { w: "deppressed", v: 0.90 },
];

// ── STRESSOR CATEGORIES ───────────────────────────────────────────
const STRESSOR_PATTERNS = [
  {
    label: "Academic pressure",
    keywords: [
      "exam","exams","quiz","quizzes","test","assignment","assignments",
      "deadline","deadlines","submission","project","thesis","report",
      "grade","grades","professor","teacher","class","classes","school",
      "university","college","study","studying","homework","presentation",
      "failing","failed","blanking","recitation","research",
    ],
  },
  {
    label: "Sleep deprivation",
    keywords: [
      "didn't sleep","didn't rest","no sleep","couldn't sleep","can't sleep",
      "sleep deprived","insomnia","sleepy","sleepless","stayed up",
      "all nighter","up all night","lack of sleep","slept badly",
      "restless night","exhausted","fatigue",
    ],
  },
  {
    label: "Work/career stress",
    keywords: [
      "work","job","boss","manager","office","meeting","meetings","workload",
      "overtime","client","clients","task","tasks","performance","review",
      "promotion","fired","resign","coworker","colleague","colleagues",
    ],
  },
  {
    label: "Relationship conflict",
    keywords: [
      "argument","argue","argued","fight","fighting","fought","conflict",
      "relationship","boyfriend","girlfriend","partner","friend","friends",
      "family","parent","parents","mom","dad","sibling","brother","sister",
      "broke up","breakup","ghosted","ignored","rejected","misunderstood",
    ],
  },
  {
    label: "Financial stress",
    keywords: [
      "money","broke","debt","bills","rent","tuition","fee","fees",
      "budget","expensive","afford","loan","payment","savings","financial",
      "cost","salary","income",
    ],
  },
  {
    label: "Health concerns",
    keywords: [
      "sick","ill","pain","ache","headache","migraine","dizzy","nauseous",
      "hospital","doctor","medicine","medication","symptoms","fever",
      "anxiety","panic attack","mental health","therapy","therapist",
    ],
  },
  {
    label: "Burnout/overload",
    keywords: [
      "burnout","burnt out","burned out","overloaded","overwhelmed",
      "too much","so much","can't cope","breaking down","falling apart",
      "no energy","no motivation","unmotivated","walang gana",
    ],
  },
  {
    label: "Loneliness/isolation",
    keywords: [
      "lonely","alone","isolated","no one","nobody","empty","invisible",
      "left out","excluded","ignored","friendless","disconnected",
      "missing","miss","homesick","malungkot","lungkot",
    ],
  },
];

// ── WEIGHTED SCORING ENGINE ───────────────────────────────────────
function getWeightedHits(wordList, lowerText) {
  const matched = [];
  // Sort longest phrase first so "not okay" is caught before "okay"
  const sorted = [...wordList].sort((a, b) => b.w.length - a.w.length);
  let remaining = lowerText;
  for (const item of sorted) {
    if (remaining.includes(item.w)) {
      matched.push(item.v);
      remaining = remaining.replace(item.w, "");
    }
  }
  return matched;
}

// ── STRESSOR DETECTOR ─────────────────────────────────────────────
function detectStressors(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const category of STRESSOR_PATTERNS) {
    if (category.keywords.some((kw) => lower.includes(kw))) {
      found.push(category.label);
    }
  }
  return found;
}

// ── MAIN SENTIMENT ANALYZER ───────────────────────────────────────
export function analyzeSentiment(text) {
  const lower = text.toLowerCase();

  const positiveHits = getWeightedHits(POSITIVE_WORDS, lower);
  const negativeHits = getWeightedHits(NEGATIVE_WORDS, lower);

  const avgPos =
    positiveHits.length > 0
      ? positiveHits.reduce((a, b) => a + b, 0) / positiveHits.length
      : 0;
  const avgNeg =
    negativeHits.length > 0
      ? negativeHits.reduce((a, b) => a + b, 0) / negativeHits.length
      : 0;

  // Strength = avg weight × √count (rewards both intensity and volume)
  const posStrength = avgPos * Math.sqrt(positiveHits.length);
  const negStrength = avgNeg * Math.sqrt(negativeHits.length);

  // Polarity score −1 to +1
  let polarity;
  if (posStrength > negStrength && posStrength > 0.3) {
    const reduction = negativeHits.length > 0 ? negStrength * 0.25 : 0;
    polarity = Math.min(posStrength - reduction, 0.97);
  } else if (negStrength > posStrength && negStrength > 0.3) {
    const reduction = positiveHits.length > 0 ? posStrength * 0.25 : 0;
    polarity = -Math.min(negStrength - reduction, 0.97);
  } else {
    polarity = (posStrength - negStrength) * 0.3;
  }
  polarity = parseFloat(polarity.toFixed(2));

  // Convert to percentages
  const totalStrength = posStrength + negStrength || 1;
  let positive =
    posStrength === 0 && negStrength === 0
      ? 25
      : Math.round((posStrength / totalStrength) * 100);
  let negative =
    posStrength === 0 && negStrength === 0
      ? 20
      : Math.round((negStrength / totalStrength) * 100);
  let neutral = Math.max(5, 100 - positive - negative);

  // Normalize to exactly 100
  const sum = positive + negative + neutral;
  positive = Math.round((positive / sum) * 100);
  negative = Math.round((negative / sum) * 100);
  neutral = 100 - positive - negative;

  // Stress score 0–100
  const stressScore = Math.min(
    100,
    Math.round(negStrength * 80 + (negative > 50 ? 10 : 0))
  );

  // Tone label
  let tone;
  if      (polarity >  0.55) tone = "Positive";
  else if (polarity >  0.20) tone = "Slightly Positive";
  else if (polarity < -0.55) tone = "Negative";
  else if (polarity < -0.20) tone = "Slightly Negative";
  else                        tone = "Neutral";

  // Stressors
  const stressors = detectStressors(text);

  // Tags
  const tags = [];
  if (negative > 35 || stressors.length > 0) tags.push("Stress detected");
  if (positive > 45) tags.push("Positive mood");
  if (
    ["walk","walked","breathe","rest","rested","helped","talked",
     "exercise","meditate","slept","coped","journal","journaling"]
      .some((kw) => lower.includes(kw))
  ) tags.push("Coping activity found");
  if (
    ["argument","fight","conflict","angry","anger","tension","argue"]
      .some((kw) => lower.includes(kw))
  ) tags.push("Conflict noted");
  if (
    ["grateful","gratitude","thankful","appreciate","blessed","salamat"]
      .some((kw) => lower.includes(kw))
  ) tags.push("Gratitude");
  if (
    ["accomplished","finished","completed","achieved","proud","success"]
      .some((kw) => lower.includes(kw))
  ) tags.push("Achievement");
  if (tags.length === 0) tags.push("Stable mood");

  // Fallback mindbloom insight (overridden by Claude in ai.js)
  const mindbloom =
    stressors.length > 0
      ? `It looks like ${stressors[0].toLowerCase()} is weighing on you. Try taking it one step at a time — you're doing better than you think.`
      : tone === "Positive" || tone === "Slightly Positive"
      ? "You're doing well emotionally today. Keep building on what makes you feel good."
      : tone === "Negative" || tone === "Slightly Negative"
      ? "You seem overwhelmed. Try slowing down and giving yourself some rest."
      : "Your emotions feel balanced today. Keep checking in with yourself.";

  return {
    tone,
    positive,
    neutral,
    negative,
    polarity,
    stressScore,
    stressors,
    tags,
    mindbloom,
  };
}

// ── ToneChip ──────────────────────────────────────────────────────
export function ToneChip({ tone }) {
  const cls =
    tone === "Positive" || tone === "Slightly Positive"
      ? "positive"
      : tone === "Negative" || tone === "Slightly Negative"
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
    tone: "Slightly Negative",
    positive: 28,
    neutral: 30,
    negative: 42,
    polarity: -0.28,
    stressScore: 38,
    stressors: ["Burnout/overload"],
    tags: ["Stress detected", "Coping activity found"],
    mindbloom:
      "You experienced stress but used a healthy coping method — walking is genuinely effective. Keep noticing what helps you and lean into it.",
  },
];