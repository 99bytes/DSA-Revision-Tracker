export type Platform = "LeetCode" | "GFG" | "Codeforces" | "Other";

export type Question = {
  id: string;
  name: string;
  platform: Platform;
  tags: string[];
  approach: string;
  timeComplexity: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  lastRevised: string;
  mistakeNotes: string;
};

export const PLATFORMS: Platform[] = ["LeetCode", "GFG", "Codeforces", "Other"];

export const CONFIDENCE_LABELS = {
  1: "Needs Help",
  2: "Shaky",
  3: "Moderate",
  4: "Good",
  5: "Mastered"
} as const;
