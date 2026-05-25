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

// ── NEGATION WORDS ──────────────────────────────────────────────
const NEGATIONS = [
  "not", "no", "never", "neither", "nor", "wasn't", "weren't",
  "isn't", "aren't", "hasn't", "haven't", "hadn't", "doesn't",
  "don't", "didn't", "won't", "wouldn't", "can't", "couldn't",
  "shouldn't", "mustn't", "barely", "hardly", "scarcely",
  "di", "hindi", "wala", "walang", "ayaw", "hindi ko", "di ko",
  "dapat hindi", "dapat ayaw", "ayaw ko", "without", "lack",
];

// ── POSITIVE WORD LIST (word → weight) ────────────────────────────
const POSITIVE_WORDS = [
  // HIGH-INTENSITY PHRASES
  { w: "couldn't be better", v: 0.95 }, { w: "on top of the world", v: 0.96 },
  { w: "over the moon", v: 0.94 }, { w: "thrilled to pieces", v: 0.93 },
  { w: "over the top happy", v: 0.92 }, { w: "bouncing off walls", v: 0.91 },
  { w: "walking on air", v: 0.93 }, { w: "on cloud nine", v: 0.94 },
  { w: "can't stop smiling", v: 0.92 }, { w: "life is good", v: 0.84 },
  { w: "feeling fantastic", v: 0.87 }, { w: "best day ever", v: 0.90 },
  { w: "absolutely amazing", v: 0.92 }, { w: "pure joy", v: 0.91 },
  { w: "so grateful", v: 0.86 }, { w: "very grateful", v: 0.85 },
  { w: "so blessed", v: 0.87 }, { w: "deeply blessed", v: 0.88 },
  { w: "truly blessed", v: 0.87 }, { w: "beyond happy", v: 0.89 },
  
  // MODERATE-INTENSITY PHRASES
  { w: "so excited", v: 0.88 }, { w: "super excited", v: 0.89 },
  { w: "really happy", v: 0.84 }, { w: "very happy", v: 0.83 },
  { w: "so happy", v: 0.85 }, { w: "extremely happy", v: 0.87 },
  { w: "feeling great", v: 0.81 }, { w: "feeling good", v: 0.75 },
  { w: "feel great", v: 0.79 }, { w: "feel good", v: 0.74 },
  { w: "doing well", v: 0.70 }, { w: "going well", v: 0.73 },
  { w: "love this", v: 0.88 }, { w: "love it", v: 0.87 },
  { w: "absolutely love", v: 0.89 }, { w: "so good", v: 0.81 },
  { w: "very good", v: 0.82 }, { w: "incredibly good", v: 0.85 },
  { w: "best day", v: 0.88 }, { w: "great day", v: 0.82 },
  { w: "good day", v: 0.73 }, { w: "wonderful day", v: 0.85 },
  { w: "finished early", v: 0.83 }, { w: "did well", v: 0.76 },
  { w: "went well", v: 0.75 }, { w: "no complaints", v: 0.68 },
  { w: "all good", v: 0.65 }, { w: "everything's fine", v: 0.62 },
  
  // HIGH-VALUE SINGLE WORDS
  { w: "ecstatic", v: 0.94 }, { w: "euphoric", v: 0.93 },
  { w: "exhilarated", v: 0.91 }, { w: "elated", v: 0.91 },
  { w: "overjoyed", v: 0.92 }, { w: "thrilled", v: 0.86 },
  { w: "delighted", v: 0.85 }, { w: "enchanted", v: 0.88 },
  { w: "blissful", v: 0.90 }, { w: "glorious", v: 0.87 },
  { w: "magnificent", v: 0.86 }, { w: "phenomenal", v: 0.87 },
  { w: "spectacular", v: 0.86 }, { w: "sublime", v: 0.89 },
  { w: "exceptional", v: 0.85 }, { w: "exquisite", v: 0.87 },
  { w: "extraordinary", v: 0.86 }, { w: "superb", v: 0.84 },
  { w: "outstanding", v: 0.86 }, { w: "brilliant", v: 0.84 },
  { w: "splendid", v: 0.84 }, { w: "marvelous", v: 0.85 },
  { w: "fabulous", v: 0.83 }, { w: "gorgeous", v: 0.84 },
  { w: "sensational", v: 0.86 }, { w: "radiant", v: 0.85 },
  
  // STANDARD POSITIVE WORDS
  { w: "amazing", v: 0.85 }, { w: "awesome", v: 0.83 },
  { w: "fantastic", v: 0.84 }, { w: "wonderful", v: 0.82 },
  { w: "excellent", v: 0.84 }, { w: "perfect", v: 0.85 },
  { w: "great", v: 0.75 }, { w: "good", v: 0.64 },
  { w: "nice", v: 0.59 }, { w: "fine", v: 0.46 },
  { w: "okay", v: 0.48 }, { w: "happy", v: 0.73 },
  { w: "glad", v: 0.69 }, { w: "proud", v: 0.74 },
  { w: "grateful", v: 0.76 }, { w: "thankful", v: 0.75 },
  { w: "content", v: 0.62 }, { w: "peaceful", v: 0.72 },
  { w: "calm", v: 0.60 }, { w: "relaxed", v: 0.64 },
  { w: "refreshed", v: 0.68 }, { w: "energized", v: 0.77 },
  { w: "motivated", v: 0.77 }, { w: "inspired", v: 0.79 },
  { w: "encouraged", v: 0.74 }, { w: "determined", v: 0.73 },
  { w: "confident", v: 0.75 }, { w: "hopeful", v: 0.68 },
  { w: "optimistic", v: 0.73 }, { w: "joyful", v: 0.82 },
  { w: "joy", v: 0.77 }, { w: "love", v: 0.75 },
  { w: "blessed", v: 0.79 }, { w: "cherish", v: 0.80 },
  { w: "adore", v: 0.81 }, { w: "appreciate", v: 0.71 },
  { w: "celebrate", v: 0.81 }, { w: "victory", v: 0.83 },
  { w: "success", v: 0.79 }, { w: "winning", v: 0.80 },
  { w: "accomplished", v: 0.80 }, { w: "achieved", v: 0.77 },
  { w: "completed", v: 0.69 }, { w: "finished", v: 0.63 },
  { w: "progress", v: 0.69 }, { w: "improving", v: 0.68 },
  { w: "supported", v: 0.70 }, { w: "valued", v: 0.74 },
  { w: "appreciated", v: 0.74 }, { w: "respected", v: 0.75 },
  { w: "comfortable", v: 0.63 }, { w: "satisfied", v: 0.69 },
  { w: "excited", v: 0.80 }, { w: "keen", v: 0.72 },
  { w: "enthusiastic", v: 0.79 }, { w: "fun", v: 0.68 },
  { w: "entertaining", v: 0.72 }, { w: "laugh", v: 0.67 },
  { w: "laughter", v: 0.71 }, { w: "smile", v: 0.66 },
  { w: "smiling", v: 0.69 }, { w: "cheery", v: 0.76 },
  { w: "bright", v: 0.70 }, { w: "positive", v: 0.65 },
  { w: "better", v: 0.59 }, { w: "improved", v: 0.66 },
  { w: "relief", v: 0.65 }, { w: "relieved", v: 0.67 },
  { w: "rested", v: 0.66 }, { w: "nourished", v: 0.70 },
  { w: "healthy", v: 0.71 }, { w: "well", v: 0.44 },
  { w: "coped", v: 0.69 }, { w: "walked", v: 0.61 },
  { w: "helped", v: 0.65 }, { w: "enjoyed", v: 0.72 },
  { w: "enjoy", v: 0.70 }, { w: "thrilling", v: 0.86 },
  { w: "delightful", v: 0.85 }, { w: "cheerful", v: 0.78 },
  { w: "buoyant", v: 0.81 }, { w: "vivacious", v: 0.83 },
  { w: "energetic", v: 0.76 }, { w: "vibrant", v: 0.82 },
  { w: "lively", v: 0.78 }, { w: "spirited", v: 0.77 },
  
  // INTENSIFIERS + POSITIVE
  { w: "extremely good", v: 0.88 }, { w: "incredibly amazing", v: 0.90 },
  { w: "unbelievably great", v: 0.89 }, { w: "absolutely fantastic", v: 0.91 },
  { w: "purely positive", v: 0.84 }, { w: "deeply grateful", v: 0.87 },
  
  // TAGLISH / TAGALOG
  { w: "sobrang saya", v: 0.92 }, { w: "masayang masaya", v: 0.88 },
  { w: "masaya ako", v: 0.79 }, { w: "masaya na masaya", v: 0.87 },
  { w: "ang saya saya", v: 0.85 }, { w: "proud ako", v: 0.77 },
  { w: "ang galing", v: 0.79 }, { w: "ang saya", v: 0.77 },
  { w: "kaya ko", v: 0.75 }, { w: "maraming salamat", v: 0.75 },
  { w: "masaya", v: 0.79 }, { w: "maganda", v: 0.73 },
  { w: "galing", v: 0.75 }, { w: "saya", v: 0.72 },
  { w: "salamat", v: 0.68 }, { w: "mabuti", v: 0.62 },
  { w: "magaling", v: 0.73 }, { w: "tiwala", v: 0.70 },
  { w: "kakaiba", v: 0.74 }, { w: "napakaganda", v: 0.82 },
  { w: "napakagaling", v: 0.81 }, { w: "napakasaya", v: 0.90 },
  { w: "ayos na", v: 0.56 }, { w: "ok naman", v: 0.50 },
  { w: "okay naman", v: 0.50 }, { w: "ayos naman", v: 0.55 },
  { w: "haha", v: 0.63 }, { w: "hahaha", v: 0.68 },
  { w: "hehe", v: 0.61 }, { w: "nakamangha", v: 0.80 },
  { w: "kahanga-hanga", v: 0.82 }, { w: "napaka-saya", v: 0.91 },
  
  // TYPOS/SLANG
  { w: "hapy", v: 0.70 }, { w: "happpy", v: 0.72 },
  { w: "awsome", v: 0.81 }, { w: "amzing", v: 0.82 },
  { w: "luv", v: 0.72 }, { w: "thankfull", v: 0.74 },
  { w: "thnk you", v: 0.65 }, { w: "ur amazing", v: 0.80 },
  { w: "ur great", v: 0.73 }, { w: "u rock", v: 0.74 },
];

// ── NEGATIVE WORD LIST (word → weight) ────────────────────────────
const NEGATIVE_WORDS = [
  // EXTREME INTENSITY
  { w: "want to die", v: 0.98 }, { w: "dying inside", v: 0.96 },
  { w: "suicidal thoughts", v: 0.99 }, { w: "hopeless forever", v: 0.97 },
  { w: "unbearable pain", v: 0.96 }, { w: "breaking point", v: 0.94 },
  { w: "complete breakdown", v: 0.95 }, { w: "utterly devastated", v: 0.96 },
  { w: "absolutely miserable", v: 0.95 }, { w: "total disaster", v: 0.94 },
  
  // HIGH INTENSITY PHRASES
  { w: "not okay", v: 0.80 }, { w: "not ok", v: 0.79 },
  { w: "not fine", v: 0.76 }, { w: "not good", v: 0.73 },
  { w: "not happy", v: 0.76 }, { w: "not well", v: 0.74 },
  { w: "so stressed", v: 0.91 }, { w: "very stressed", v: 0.88 },
  { w: "super stressed", v: 0.91 }, { w: "extremely stressed", v: 0.92 },
  { w: "so tired", v: 0.83 }, { w: "very tired", v: 0.85 },
  { w: "really stressed", v: 0.86 }, { w: "really tired", v: 0.82 },
  { w: "really bad", v: 0.81 }, { w: "absolutely terrible", v: 0.91 },
  { w: "feeling bad", v: 0.76 }, { w: "feel bad", v: 0.74 },
  { w: "feeling down", v: 0.78 }, { w: "feeling low", v: 0.76 },
  { w: "feeling lost", v: 0.79 }, { w: "feeling empty", v: 0.81 },
  { w: "feeling numb", v: 0.78 }, { w: "give up", v: 0.89 },
  { w: "giving up", v: 0.88 }, { w: "want to quit", v: 0.90 },
  { w: "no motivation", v: 0.83 }, { w: "no energy", v: 0.80 },
  { w: "no hope", v: 0.88 }, { w: "losing hope", v: 0.86 },
  { w: "lost hope", v: 0.87 }, { w: "burnt out", v: 0.89 },
  { w: "burned out", v: 0.88 }, { w: "breaking down", v: 0.90 },
  { w: "falling apart", v: 0.89 }, { w: "worst day", v: 0.91 },
  { w: "bad day", v: 0.75 }, { w: "rough day", v: 0.73 },
  { w: "tough day", v: 0.71 }, { w: "horrible day", v: 0.87 },
  { w: "terrible day", v: 0.88 }, { w: "dreadful day", v: 0.87 },
  { w: "too much pressure", v: 0.88 }, { w: "so much pressure", v: 0.86 },
  { w: "overwhelming pressure", v: 0.89 }, { w: "at my limit", v: 0.86 },
  { w: "can't focus", v: 0.76 }, { w: "couldn't focus", v: 0.76 },
  { w: "didn't sleep", v: 0.74 }, { w: "couldn't sleep", v: 0.75 },
  { w: "kept blanking", v: 0.80 }, { w: "piling up", v: 0.74 },
  { w: "cant do this", v: 0.88 }, { w: "cannot do this", v: 0.88 },
  { w: "can't handle this", v: 0.89 }, { w: "can't cope", v: 0.87 },
  { w: "bleeding heart", v: 0.84 }, { w: "heartbroken", v: 0.86 },
  { w: "suicidal", v: 0.97 }, { w: "suicide", v: 0.96 },
  
  // EXTREME SINGLE WORDS
  { w: "hopeless", v: 0.93 }, { w: "depressed", v: 0.94 },
  { w: "suicidal", v: 0.97 }, { w: "dying", v: 0.94 },
  { w: "devastated", v: 0.88 }, { w: "destroyed", v: 0.88 },
  { w: "ruined", v: 0.86 }, { w: "shattered", v: 0.87 },
  { w: "crushed", v: 0.86 }, { w: "broken", v: 0.87 },
  { w: "tortured", v: 0.90 }, { w: "tormented", v: 0.90 },
  { w: "anguished", v: 0.89 }, { w: "agony", v: 0.91 },
  { w: "insufferable", v: 0.92 }, { w: "unbearable", v: 0.91 },
  
  // HIGH INTENSITY WORDS
  { w: "terrible", v: 0.90 }, { w: "horrible", v: 0.89 },
  { w: "awful", v: 0.88 }, { w: "dreadful", v: 0.87 },
  { w: "atrocious", v: 0.89 }, { w: "abysmal", v: 0.88 },
  { w: "miserable", v: 0.89 }, { w: "wretched", v: 0.88 },
  { w: "pathetic", v: 0.85 }, { w: "contemptible", v: 0.84 },
  { w: "despicable", v: 0.85 }, { w: "vile", v: 0.86 },
  { w: "disgusting", v: 0.87 }, { w: "repulsive", v: 0.86 },
  { w: "nauseating", v: 0.86 }, { w: "sickening", v: 0.86 },
  { w: "abhorrent", v: 0.87 }, { w: "detestable", v: 0.86 },
  { w: "hate", v: 0.86 }, { w: "hatred", v: 0.87 },
  { w: "despise", v: 0.85 }, { w: "detest", v: 0.85 },
  
  // MODERATE-HIGH INTENSITY
  { w: "overwhelmed", v: 0.85 }, { w: "exhausted", v: 0.81 },
  { w: "burnout", v: 0.88 }, { w: "frustrated", v: 0.83 },
  { w: "anxious", v: 0.80 }, { w: "worried", v: 0.76 },
  { w: "struggling", v: 0.79 }, { w: "empty", v: 0.78 },
  { w: "lonely", v: 0.77 }, { w: "lost", v: 0.69 },
  { w: "scared", v: 0.75 }, { w: "afraid", v: 0.74 },
  { w: "terrified", v: 0.87 }, { w: "petrified", v: 0.88 },
  { w: "horrified", v: 0.86 }, { w: "appalled", v: 0.84 },
  { w: "shocked", v: 0.76 }, { w: "stunned", v: 0.75 },
  { w: "stuck", v: 0.70 }, { w: "trapped", v: 0.82 },
  { w: "helpless", v: 0.84 }, { w: "powerless", v: 0.83 },
  { w: "drained", v: 0.80 }, { w: "upset", v: 0.76 },
  { w: "disappointed", v: 0.75 }, { w: "let down", v: 0.73 },
  { w: "sad", v: 0.73 }, { w: "gloomy", v: 0.79 },
  { w: "sullen", v: 0.77 }, { w: "melancholic", v: 0.78 },
  { w: "somber", v: 0.76 }, { w: "forlorn", v: 0.82 },
  { w: "despondent", v: 0.84 }, { w: "crestfallen", v: 0.81 },
  { w: "jaded", v: 0.75 }, { w: "cynical", v: 0.73 },
  
  // MODERATE INTENSITY
  { w: "stressed", v: 0.78 }, { w: "tired", v: 0.59 },
  { w: "bad", v: 0.63 }, { w: "angry", v: 0.81 },
  { w: "irritated", v: 0.76 }, { w: "annoyed", v: 0.72 },
  { w: "agitated", v: 0.77 }, { w: "indignant", v: 0.79 },
  { w: "furious", v: 0.89 }, { w: "enraged", v: 0.90 },
  { w: "irate", v: 0.88 }, { w: "livid", v: 0.89 },
  { w: "rage", v: 0.88 }, { w: "wrath", v: 0.89 },
  { w: "difficult", v: 0.64 }, { w: "hard", v: 0.56 },
  { w: "pressure", v: 0.69 }, { w: "pain", v: 0.78 },
  { w: "hurt", v: 0.76 }, { w: "ache", v: 0.67 },
  { w: "sore", v: 0.63 }, { w: "tender", v: 0.64 },
  { w: "fail", v: 0.74 }, { w: "failure", v: 0.80 },
  { w: "failed", v: 0.77 }, { w: "flop", v: 0.78 },
  { w: "fiasco", v: 0.81 }, { w: "debacle", v: 0.82 },
  { w: "useless", v: 0.86 }, { w: "worthless", v: 0.89 },
  { w: "incompetent", v: 0.84 }, { w: "inept", v: 0.82 },
  { w: "inadequate", v: 0.78 }, { w: "insufficient", v: 0.72 },
  { w: "weak", v: 0.71 }, { w: "vulnerable", v: 0.73 },
  { w: "fragile", v: 0.70 }, { w: "feeble", v: 0.71 },
  { w: "impotent", v: 0.81 }, { w: "frail", v: 0.68 },
  { w: "regret", v: 0.76 }, { w: "regretful", v: 0.77 },
  { w: "remorse", v: 0.78 }, { w: "ashamed", v: 0.80 },
  { w: "embarrassed", v: 0.74 }, { w: "humiliated", v: 0.83 },
  { w: "mortified", v: 0.84 }, { w: "degraded", v: 0.83 },
  { w: "guilty", v: 0.76 }, { w: "shame", v: 0.79 },
  { w: "disgraced", v: 0.82 }, { w: "tainted", v: 0.78 },
  { w: "mistake", v: 0.69 }, { w: "error", v: 0.66 },
  { w: "blunder", v: 0.72 }, { w: "confusion", v: 0.66 },
  { w: "confused", v: 0.66 }, { w: "bewildered", v: 0.70 },
  { w: "perplexed", v: 0.68 }, { w: "insecure", v: 0.76 },
  { w: "uncertain", v: 0.67 }, { w: "doubtful", v: 0.71 },
  { w: "ignored", v: 0.76 }, { w: "dismissed", v: 0.74 },
  { w: "rejected", v: 0.77 }, { w: "abandoned", v: 0.84 },
  { w: "isolated", v: 0.79 }, { w: "excluded", v: 0.75 },
  { w: "ostracized", v: 0.82 }, { w: "alienated", v: 0.79 },
  { w: "unmotivated", v: 0.78 }, { w: "apathetic", v: 0.75 },
  { w: "lethargic", v: 0.74 }, { w: "sluggish", v: 0.68 },
  { w: "discouraged", v: 0.78 }, { w: "disheartened", v: 0.80 },
  { w: "demoralized", v: 0.81 }, { w: "unfair", v: 0.73 },
  { w: "unjust", v: 0.74 }, { w: "inequity", v: 0.71 },
  { w: "discrimination", v: 0.80 }, { w: "injustice", v: 0.78 },
  { w: "toxic", v: 0.84 }, { w: "poisonous", v: 0.83 },
  { w: "conflict", v: 0.74 }, { w: "confrontation", v: 0.75 },
  { w: "argument", v: 0.75 }, { w: "quarrel", v: 0.73 },
  { w: "dispute", v: 0.72 }, { w: "feud", v: 0.77 },
  { w: "tension", v: 0.72 }, { w: "strain", v: 0.70 },
  { w: "worry", v: 0.73 }, { w: "fear", v: 0.75 },
  { w: "dread", v: 0.81 }, { w: "foreboding", v: 0.80 },
  { w: "apprehension", v: 0.77 }, { w: "trepidation", v: 0.79 },
  { w: "nervous", v: 0.71 }, { w: "jittery", v: 0.72 },
  { w: "on edge", v: 0.73 }, { w: "uneasy", v: 0.72 },
  { w: "panic", v: 0.83 }, { w: "panic attack", v: 0.84 },
  { w: "hysteria", v: 0.85 }, { w: "meltdown", v: 0.84 },
  { w: "overwhelm", v: 0.82 }, { w: "swamped", v: 0.79 },
  { w: "inundated", v: 0.80 }, { w: "buried", v: 0.77 },
  { w: "deadlines", v: 0.71 }, { w: "deadline", v: 0.69 },
  { w: "overloaded", v: 0.81 }, { w: "overburdened", v: 0.82 },
  { w: "overtaxed", v: 0.81 }, { w: "numb", v: 0.78 },
  { w: "listless", v: 0.73 }, { w: "catatonic", v: 0.86 },
  { w: "unresponsive", v: 0.77 }, { w: "dissociated", v: 0.81 },
  { w: "cryptic", v: 0.65 }, { w: "crying", v: 0.80 },
  { w: "cried", v: 0.77 }, { w: "tears", v: 0.78 },
  { w: "sobbing", v: 0.82 }, { w: "weeping", v: 0.81 },
  { w: "bored", v: 0.57 }, { w: "tedious", v: 0.65 },
  { w: "monotonous", v: 0.66 }, { w: "dull", v: 0.62 },
  { w: "dreary", v: 0.75 }, { w: "bleak", v: 0.77 },
  { w: "draining", v: 0.78 }, { w: "drain", v: 0.72 },
  { w: "heavy", v: 0.67 }, { w: "weighty", v: 0.69 },
  { w: "burdensome", v: 0.80 }, { w: "oppressive", v: 0.83 },
  { w: "stifling", v: 0.82 }, { w: "suffocating", v: 0.84 },
  { w: "restless", v: 0.66 }, { w: "antsy", v: 0.65 },
  { w: "fidgety", v: 0.64 }, { w: "unsettled", v: 0.70 },
  { w: "turbulent", v: 0.73 }, { w: "chaotic", v: 0.78 },
  
  // TAGLISH / TAGALOG
  { w: "hindi masaya", v: 0.83 }, { w: "di masaya", v: 0.83 },
  { w: "ayaw ko na", v: 0.90 }, { w: "hindi ko kaya", v: 0.87 },
  { w: "suko na", v: 0.86 }, { w: "walang motivation", v: 0.81 },
  { w: "walang gana", v: 0.78 }, { w: "sobrang lungkot", v: 0.93 },
  { w: "sobrang hirap", v: 0.90 }, { w: "pagod na pagod", v: 0.88 },
  { w: "malungkot ako", v: 0.80 }, { w: "galit ako", v: 0.79 },
  { w: "naiinis ako", v: 0.76 }, { w: "nahihirapan ako", v: 0.80 },
  { w: "malungkot", v: 0.80 }, { w: "lungkot", v: 0.76 },
  { w: "pagod", v: 0.69 }, { w: "naiinis", v: 0.76 },
  { w: "galit", v: 0.81 }, { w: "nalulungkot", v: 0.79 },
  { w: "hirap", v: 0.71 }, { w: "takot", v: 0.74 },
  { w: "takot na takot", v: 0.86 }, { w: "sakit", v: 0.75 },
  { w: "problema", v: 0.66 }, { w: "naiiyak", v: 0.80 },
  { w: "iyak", v: 0.75 }, { w: "suko", v: 0.81 },
  { w: "bigo", v: 0.78 }, { w: "nabigo", v: 0.79 },
  { w: "badtrip", v: 0.78 }, { w: "bad trip", v: 0.77 },
  { w: "stressed out", v: 0.87 }, { w: "stressed na stressed", v: 0.89 },
  { w: "napakahirap", v: 0.88 }, { w: "napakadamot", v: 0.82 },
  { w: "napakasama", v: 0.87 }, { w: "napakagaling", v: 0.73 },
  { w: "walang lasa", v: 0.71 }, { w: "walang saya", v: 0.82 },
  
  // TYPOS/SLANG
  { w: "sadd", v: 0.75 }, { w: "tierd", v: 0.57 },
  { w: "stresed", v: 0.76 }, { w: "anxous", v: 0.77 },
  { w: "overwelmed", v: 0.83 }, { w: "exausted", v: 0.79 },
  { w: "frustarted", v: 0.81 }, { w: "deppressed", v: 0.92 },
  { w: "depresed", v: 0.91 }, { w: "hatefull", v: 0.85 },
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
      "failing","failed","blanking","recitation","research","fail grade",
      "flunk","gpa","board exam","midterm","finals","orals",
    ],
  },
  {
    label: "Sleep deprivation",
    keywords: [
      "didn't sleep","didn't rest","no sleep","couldn't sleep","can't sleep",
      "sleep deprived","insomnia","sleepy","sleepless","stayed up",
      "all nighter","up all night","lack of sleep","slept badly",
      "restless night","exhausted","fatigue","insomniac","sleepwalking",
    ],
  },
  {
    label: "Work/career stress",
    keywords: [
      "work","job","boss","manager","office","meeting","meetings","workload",
      "overtime","client","clients","task","tasks","performance","review",
      "promotion","fired","resign","coworker","colleague","colleagues",
      "layoff","downsizing","restructure","corporate","nine-to-five",
    ],
  },
  {
    label: "Relationship conflict",
    keywords: [
      "argument","argue","argued","fight","fighting","fought","conflict",
      "relationship","boyfriend","girlfriend","partner","friend","friends",
      "family","parent","parents","mom","dad","sibling","brother","sister",
      "broke up","breakup","ghosted","ignored","rejected","misunderstood",
      "toxic relationship","abusive","controlling",
    ],
  },
  {
    label: "Financial stress",
    keywords: [
      "money","broke","debt","bills","rent","tuition","fee","fees",
      "budget","expensive","afford","loan","payment","savings","financial",
      "cost","salary","income","bonus","paycheck","bankrupt","foreclosure",
      "credit card","interest rate","mortgage",
    ],
  },
  {
    label: "Health concerns",
    keywords: [
      "sick","ill","pain","ache","headache","migraine","dizzy","nauseous",
      "hospital","doctor","medicine","medication","symptoms","fever",
      "anxiety","panic attack","mental health","therapy","therapist",
      "depression","bipolar","disease","disorder","diagnosis",
    ],
  },
  {
    label: "Burnout/overload",
    keywords: [
      "burnout","burnt out","burned out","overloaded","overwhelmed",
      "too much","so much","can't cope","breaking down","falling apart",
      "no energy","no motivation","unmotivated","walang gana",
      "fatigue","exhaustion","drain","drained",
    ],
  },
  {
    label: "Loneliness/isolation",
    keywords: [
      "lonely","alone","isolated","no one","nobody","empty","invisible",
      "left out","excluded","ignored","friendless","disconnected",
      "missing","miss","homesick","malungkot","lungkot",
      "remote work","social distancing","quarantine",
    ],
  },
  {
    label: "Self-worth issues",
    keywords: [
      "worthless","useless","incompetent","failure","inadequate",
      "not good enough","self-esteem","insecure","impostor","fraud",
      "undeserving","unworthy","pathetic","contemptible",
    ],
  },
];

// ── PERSONALIZED INSIGHT GENERATOR ──────────────────────────────────
function generateMindbloomInsight(text, tone, stressors, tags, negativePercent, positivePercent) {
  const lower = text.toLowerCase();

  // POSITIVE TONE INSIGHTS
  if (tone === "Positive") {
    // Check for achievements
    if (tags.includes("Achievement")) {
      return "You've accomplished something meaningful today — that's worth celebrating. Keep channeling this momentum forward.";
    }
    // Check for gratitude
    if (tags.includes("Gratitude")) {
      return "Gratitude is a powerful anchor for happiness. You're recognizing the good in your life, and that's beautiful.";
    }
    // Check for conflict noted (positive with conflict)
    if (tags.includes("Conflict noted")) {
      return "Even with conflict, you're finding positivity — that shows real emotional strength. Keep that balance going.";
    }
    // Default positive
    return "You're radiating positive energy today. Keep nurturing what makes you feel this good.";
  }

  // NEGATIVE TONE INSIGHTS
  if (tone === "Negative") {
    // Extreme negativity - academic
    if (stressors.includes("Academic pressure") && negativePercent > 80) {
      return "School feels heavy right now. Remember: this semester is temporary, but your effort is permanent. One task at a time.";
    }
    // Extreme negativity - burnout
    if (stressors.includes("Burnout/overload") && negativePercent > 80) {
      return "You're running on empty and that's a sign to rest — not to push harder. Your worth isn't measured by productivity.";
    }
    // Extreme negativity - relationships
    if (stressors.includes("Relationship conflict") && negativePercent > 80) {
      return "Conflict hurts, especially with people you care about. But pain means you care — that's not weakness, it's humanity.";
    }
    // Extreme negativity - loneliness
    if (stressors.includes("Loneliness/isolation") && negativePercent > 80) {
      return "Loneliness amplifies pain, but you reaching out through journaling shows you're looking for connection. Keep reaching.";
    }
    // Extreme negativity - self-worth
    if (stressors.includes("Self-worth issues") && negativePercent > 80) {
      return "You're doubting yourself right now. But doubt and struggle don't define your worth — your effort does.";
    }
    // Coping activity with stress
    if (tags.includes("Coping activity found") && tags.includes("Stress detected")) {
      return "Even in the stress, you're using healthy coping tools — that's how you build resilience. Keep going.";
    }
    // Multiple stressors
    if (stressors.length > 2) {
      return `You're juggling ${stressors.length} big challenges right now. Focus on just one small thing you can control today.`;
    }
    // Sleep deprivation
    if (stressors.includes("Sleep deprivation")) {
      return "Exhaustion makes everything feel worse than it is. Your primary mission today: rest. Everything else can wait.";
    }
    // General negative
    return "This weight you're feeling is real, but it's temporary. You've gotten through hard days before — you'll get through this.";
  }

  // NEUTRAL TONE INSIGHTS
  if (tone === "Neutral") {
    // Check for coping
    if (tags.includes("Coping activity found")) {
      return "You're taking care of yourself in small ways — that consistency is what builds emotional resilience over time.";
    }
    // Check for conflict without extreme emotion
    if (tags.includes("Conflict noted")) {
      return "You experienced friction today, but you're reflecting on it. That awareness is the first step to understanding.";
    }
    // Stable with stressors
    if (stressors.length > 0) {
      return `Despite the ${stressors[0]?.toLowerCase()}, you're keeping steady. That's strength you might not be recognizing.`;
    }
    // Default neutral
    return "You're in a balanced place today. This stability is valuable — use it to recharge for what's ahead.";
  }

  // Fallback
  return "Keep reflecting on what you're feeling. Awareness is the first step toward growth.";
}

// ── NEGATION HANDLER ────────────────────────────────────────────
function invertSentimentForNegation(text, positiveHits, negativeHits) {
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]/);
  
  let invertedPositive = [...positiveHits];
  let invertedNegative = [...negativeHits];
  
  // Track which words we've already inverted to avoid double-processing
  const invertedWords = new Set();

  for (const sentence of sentences) {
    const sentLower = sentence.toLowerCase().trim();
    if (sentLower.length === 0) continue;

    // Sort negations by length (longest first) to catch "not bad" before "not"
    const sortedNegations = [...NEGATIONS].sort((a, b) => b.length - a.length);
    const hasNegation = sortedNegations.some(neg => sentLower.includes(neg));
    
    if (hasNegation) {
      // Process NEGATIVE words first (double negatives = positive)
      const sortedNegWords = [...NEGATIVE_WORDS].sort((a, b) => b.w.length - a.w.length);
      for (const negWord of sortedNegWords) {
        if (sentLower.includes(negWord.w) && !invertedWords.has(`neg-${negWord.w}`)) {
          // Find all negation positions
          const negPositions = sortedNegations
            .filter(n => sentLower.includes(n))
            .map(n => sentLower.indexOf(n));
          
          const wordPos = sentLower.indexOf(negWord.w);
          
          // Check if negation comes before the word (within 15 chars)
          for (const negPos of negPositions) {
            if (wordPos > negPos && wordPos - negPos < 15) {
              // Double negative = positive (invert it)
              invertedNegative = invertedNegative.filter(v => v !== negWord.v);
              invertedPositive.push(negWord.v * 0.85);
              invertedWords.add(`neg-${negWord.w}`);
              break;
            }
          }
        }
      }
      
      // Process POSITIVE words (negation + positive = negative)
      const sortedPosWords = [...POSITIVE_WORDS].sort((a, b) => b.w.length - a.w.length);
      for (const posWord of sortedPosWords) {
        if (sentLower.includes(posWord.w) && !invertedWords.has(`pos-${posWord.w}`)) {
          const negPositions = sortedNegations
            .filter(n => sentLower.includes(n))
            .map(n => sentLower.indexOf(n));
          
          const posPos = sentLower.indexOf(posWord.w);
          
          // Check if negation comes before the word (within 15 chars)
          for (const negPos of negPositions) {
            if (posPos > negPos && posPos - negPos < 15) {
              // Negation + positive = negative (invert it)
              invertedPositive = invertedPositive.filter(v => v !== posWord.v);
              invertedNegative.push(posWord.v * 0.85);
              invertedWords.add(`pos-${posWord.w}`);
              break;
            }
          }
        }
      }
    }
  }

  return { positiveHits: invertedPositive, negativeHits: invertedNegative };
}

// ── WEIGHTED SCORING ENGINE ───────────────────────────────────────
function getWeightedHits(wordList, lowerText) {
  const matched = [];
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

  let positiveHits = getWeightedHits(POSITIVE_WORDS, lower);
  let negativeHits = getWeightedHits(NEGATIVE_WORDS, lower);

  const { positiveHits: adjPositive, negativeHits: adjNegative } =
    invertSentimentForNegation(text, positiveHits, negativeHits);

  positiveHits = adjPositive;
  negativeHits = adjNegative;

  const avgPos =
    positiveHits.length > 0
      ? positiveHits.reduce((a, b) => a + b, 0) / positiveHits.length
      : 0;
  const avgNeg =
    negativeHits.length > 0
      ? negativeHits.reduce((a, b) => a + b, 0) / negativeHits.length
      : 0;

  const posStrength = avgPos * Math.sqrt(positiveHits.length);
  const negStrength = avgNeg * Math.sqrt(negativeHits.length);

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

  const totalStrength = posStrength + negStrength || 1;
  let positive =
    posStrength === 0 && negStrength === 0
      ? 25
      : Math.round((posStrength / totalStrength) * 100);
  let negative =
    posStrength === 0 && negStrength === 0
      ? 20
      : Math.round((negStrength / totalStrength) * 100);
  let neutral = 100 - positive - negative;

  // Normalize to exactly 100 (only adjust if there's rounding error)
  const sum = positive + negative + neutral;
  if (sum !== 100) {
    positive = Math.round((positive / sum) * 100);
    negative = Math.round((negative / sum) * 100);
    neutral = 100 - positive - negative;
  }

  const stressScore = Math.min(
    100,
    Math.round(negStrength * 80 + (negative > 50 ? 10 : 0))
  );

  let tone;
  if      (polarity >  0.20) tone = "Positive";
  else if (polarity < -0.20) tone = "Negative";
  else                        tone = "Neutral";

  const stressors = detectStressors(text);

  const tags = [];
  if (negative > 35 || stressors.length > 0) tags.push("Stress detected");
  if (positive > 45) tags.push("Positive mood");
  if (
    ["walk","walked","breathe","rest","rested","helped","talked",
     "exercise","meditate","slept","coped","journal","journaling",
     "yoga","stretch","ran","jogged",
    ]
      .some((kw) => lower.includes(kw))
  ) tags.push("Coping activity found");
  if (
    ["argument","fight","conflict","angry","anger","tension","argue"]
      .some((kw) => lower.includes(kw))
  ) tags.push("Conflict noted");
  if (
    ["grateful","gratitude","thankful","appreciate","blessed","salamat",
     "thankful","maraming salamat",
    ]
      .some((kw) => lower.includes(kw))
  ) tags.push("Gratitude");
  if (
    ["accomplished","finished","completed","achieved","proud","success",
     "passed","promotion","milestone",
    ]
      .some((kw) => lower.includes(kw))
  ) tags.push("Achievement");
  if (tags.length === 0) tags.push("Stable mood");

  const mindbloom = generateMindbloomInsight(text, tone, stressors, tags, negative, positive);

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
    tone === "Positive"
      ? "positive"
      : tone === "Negative"
      ? "negative"
      : "neutral";
  return <span className={`tone-chip ${cls}`}>{tone}</span>;
}