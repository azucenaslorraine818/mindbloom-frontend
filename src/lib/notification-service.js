import { supabase } from "./supabase";

const ICONS = {
  welcome: "🌸",
  streak: "🎉",
  milestone: "🏆",
  negativeTrend: "📌",
  highStress: "🚨",
  positiveProgress: "🌟",
  coping: "💪",
  sleep: "😴",
  kindness: "💝",
  conflict: "💬",
  breakthrough: "✨",
  gratitude: "🙏",
  movement: "🚶",
  breathing: "🧘",
  connection: "🤝",
  journaling: "📝",
  media: "⏱️",
  crisis: "🆘",
};

export const NOTIFICATION_TYPES = {
  WELCOME: "welcome",
  STREAK: "milestone",
  NEGATIVE_TREND: "alert",
  HIGH_STRESS: "alert",
  POSITIVE_PROGRESS: "milestone",
  COPING_REMINDER: "tip",
  SELF_CARE_TIP: "tip",
  SENTIMENT_INSIGHT: "insight",
  BREAKTHROUGH: "milestone",
  SLEEP_WARNING: "alert",
  SOCIAL_REMINDER: "reminder",
  CELEBRATION: "milestone",
  CRISIS: "alert",
};

export async function createNotification(userId, type, title, message) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        type,
        title,
        message,
        read: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Notification creation error:", error);
    return null;
  }

  return data?.[0] || null;
}

export function detectSuicidalIntent(text) {
  if (!text) return false;

  const suicidalKeywords = [
    /suicide|suicidal/i,
    /kill\s+(myself|me|us)/i,
    /want\s+to\s+die|wanna\s+die/i,
    /end\s+(it|my\s+life)/i,
    /can't\s+go\s+on|can't\s+live/i,
    /harm\s+myself/i,
    /self\s+harm/i,
    /no\s+reason\s+to\s+live/i,
    /better\s+off\s+dead/i,
    /hurt\s+myself/i,
  ];

  return suicidalKeywords.some((pattern) => pattern.test(text));
}

export async function createCrisisAlert(userId) {
  const contactsMessage = `
CRISIS RESOURCES — PLEASE REACH OUT IMMEDIATELY:

🇵🇭 Philippines:
• National Center for Mental Health Crisis Hotline: 1553 (landline/mobile)
• Globe/TM: 0966-351-4518 / 0917-899-8727
• Smart/Sun/TNT: 0908-639-2672

• In Touch Crisis Line:
(02) 8893-7603
0917-800-1123
0922-893-8944

• Emergency: 911

You do not have to go through this alone.

You are not alone. Your life has value.
Please reach out to someone today.`;

  await createNotification(
    userId,
    NOTIFICATION_TYPES.CRISIS,
    `${ICONS.crisis} CRISIS ALERT - Get Help Now`,
    contactsMessage
  );
}

export async function checkAndCreateNotifications(userId, entry) {
  if (!userId || !entry) return;

  const stressScore = entry.stressScore || entry.stressscore || 0;

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentEntries } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false });

    const entries = recentEntries || [];

    if (entries.length === 1) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.WELCOME,
        `${ICONS.welcome} Welcome to MindBloom!`,
        "You've made your first entry. Starting your mental health journey is a big step!"
      );
    }

    if (entries.length === 7) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.STREAK,
        `${ICONS.streak} Week One Complete!`,
        "You've journaled for 7 days straight. Consistency is key to understanding yourself."
      );
    }

    if (entries.length === 30) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.STREAK,
        `${ICONS.milestone} One Month Milestone!`,
        "30 days of reflection. You're building a powerful habit of self-awareness."
      );
    }

    if (entries.length >= 3) {
      const recentThree = entries.slice(0, 3);
      const negativeCount = recentThree.filter(
        (e) => e.tone === "Negative" || e.tone === "Slightly Negative"
      ).length;

      if (negativeCount === 3) {
        await createNotification(
          userId,
          NOTIFICATION_TYPES.NEGATIVE_TREND,
          `${ICONS.negativeTrend} We've noticed a pattern`,
          "Your last 3 entries show negative sentiment. It might help to talk to someone or try a coping activity."
        );
      }
    }

    if (stressScore > 75) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.HIGH_STRESS,
        `${ICONS.highStress} High Stress Detected`,
        `Your stress level is at ${stressScore}%. Try taking a break, going for a walk, or reaching out to someone.`
      );
    }

    if (entries.length >= 3) {
      const recentThree = entries.slice(0, 3);
      const positiveCount = recentThree.filter(
        (e) => e.tone === "Positive" || e.tone === "Slightly Positive"
      ).length;

      if (entry.tone === "Positive" && positiveCount >= 2) {
        await createNotification(
          userId,
          NOTIFICATION_TYPES.POSITIVE_PROGRESS,
          `${ICONS.positiveProgress} You're in a positive place`,
          "Your recent entries show an upward trend. Keep building on this positive momentum!"
        );
      }
    }

    if (entry.tags && Array.isArray(entry.tags) && entry.tags.includes("Coping activity found")) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.COPING_REMINDER,
        `${ICONS.coping} Great coping strategy!`,
        "Using healthy coping mechanisms like walking or meditation shows real self-awareness."
      );
    }

    if (entry.stressors && Array.isArray(entry.stressors) && entry.stressors.includes("Sleep deprivation")) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.SLEEP_WARNING,
        `${ICONS.sleep} Sleep is crucial`,
        "Your entry mentions sleep issues. Prioritize rest this week—your mental health depends on it."
      );
    }

    if (entry.stressors && Array.isArray(entry.stressors) && entry.stressors.includes("Self-worth issues")) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.COPING_REMINDER,
        `${ICONS.kindness} You deserve kindness`,
        "Remember: your worth is not determined by productivity or others' opinions. Be gentle with yourself."
      );
    }

    if (
      entry.stressors &&
      Array.isArray(entry.stressors) &&
      entry.stressors.includes("Relationship conflict") &&
      entry.tags &&
      Array.isArray(entry.tags) &&
      entry.tags.includes("Conflict noted")
    ) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.SOCIAL_REMINDER,
        `${ICONS.conflict} Conflict takes energy`,
        "When you're ready, consider reaching out to talk it through or taking space to reflect."
      );
    }

    if (
      entry.positive > 70 &&
      entry.tags &&
      Array.isArray(entry.tags) &&
      entry.tags.includes("Achievement")
    ) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.BREAKTHROUGH,
        `${ICONS.breakthrough} You just had a breakthrough!`,
        "That achievement combined with this positive mood? You're making real progress."
      );
    }

    if (entry.tags && Array.isArray(entry.tags) && entry.tags.includes("Gratitude")) {
      await createNotification(
        userId,
        NOTIFICATION_TYPES.SENTIMENT_INSIGHT,
        `${ICONS.gratitude} Gratitude shifts perspective`,
        "Research shows gratitude practices reduce anxiety and increase overall wellbeing. You're on the right track."
      );
    }

    const tips = [
      {
        title: `${ICONS.movement} Movement helps`,
        message: "Even a 10-minute walk can lower stress and improve mood. Try it tomorrow!",
      },
      {
        title: `${ICONS.breathing} Breathing exercises work`,
        message: "Try box breathing: 4 seconds in, hold 4, out 4, hold 4. Repeat 5 times.",
      },
      {
        title: `${ICONS.sleep} Sleep is medicine`,
        message: "Consistent sleep schedules help regulate mood and stress response.",
      },
      {
        title: `${ICONS.connection} Connection matters`,
        message: "Spending time with supportive people boosts mental health significantly.",
      },
      {
        title: `${ICONS.journaling} Journaling helps`,
        message: "You're already doing this! Keep it up—clarity comes with consistency.",
      },
      {
        title: `${ICONS.media} Limit social media`,
        message: "Reducing doom-scrolling can improve mood and anxiety levels.",
      },
    ];

    if (entries.length % 5 === 0 && entries.length > 0) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      await createNotification(
        userId,
        NOTIFICATION_TYPES.SELF_CARE_TIP,
        randomTip.title,
        randomTip.message
      );
    }
  } catch (error) {
    console.error("Error checking notifications:", error);
  }
}

export async function cleanupOldNotifications(userId) {
  if (!userId) return;

  try {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId)
      .lt("created_at", thirtyDaysAgo)
      .eq("read", true);
  } catch (error) {
    console.error("Error cleaning notifications:", error);
  }
}