import { analyzeSentiment } from "./mindbloom";

export async function analyzeJournal(text) {
  try {
    const result = analyzeSentiment(text);
    return result;
  } catch (err) {
    console.error("Analysis error:", err);
    return {
      tone: "Neutral",
      tags: ["error"],
      positive: 33,
      neutral: 34,
      negative: 33,
      mindbloom: "Failed to analyze this entry.",
    };
  }
}