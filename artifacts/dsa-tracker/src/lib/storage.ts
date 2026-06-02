import { Question } from "./types";

const STORAGE_KEY = "dsa-questions";

const SEED_DATA: Question[] = [
  {
    id: crypto.randomUUID(),
    name: "Two Sum",
    platform: "LeetCode",
    tags: ["Array", "Hash Table"],
    approach: "Use a hash map to store complements.",
    timeComplexity: "O(n)",
    confidence: 5,
    lastRevised: new Date().toISOString(),
    mistakeNotes: "Forgot to check if complement exists and is not same index initially."
  },
  {
    id: crypto.randomUUID(),
    name: "Longest Increasing Subsequence",
    platform: "LeetCode",
    tags: ["DP", "Binary Search"],
    approach: "Patience sorting / tails array.",
    timeComplexity: "O(n log n)",
    confidence: 2,
    lastRevised: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mistakeNotes: "Struggled with the binary search condition."
  },
  {
    id: crypto.randomUUID(),
    name: "Course Schedule",
    platform: "LeetCode",
    tags: ["Graph", "Topological Sort"],
    approach: "Kahn's algorithm using indegree array.",
    timeComplexity: "O(V + E)",
    confidence: 4,
    lastRevised: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mistakeNotes: "Remember to check if processed count equals numCourses."
  },
  {
    id: crypto.randomUUID(),
    name: "Minimum Window Substring",
    platform: "LeetCode",
    tags: ["Sliding Window", "Hash Table"],
    approach: "Expand window until valid, then contract to find min.",
    timeComplexity: "O(n + m)",
    confidence: 1,
    lastRevised: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    mistakeNotes: "Always mess up the contraction logic and character counts."
  },
  {
    id: crypto.randomUUID(),
    name: "Edit Distance",
    platform: "LeetCode",
    tags: ["DP", "String"],
    approach: "2D DP array. dp[i][j] stores min ops to convert word1[0..i] to word2[0..j].",
    timeComplexity: "O(m * n)",
    confidence: 3,
    lastRevised: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    mistakeNotes: "Base cases initialization is tricky."
  }
];

export function getQuestions(): Question[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(data);
}

export function saveQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function addQuestion(question: Question) {
  const q = getQuestions();
  saveQuestions([...q, question]);
}

export function updateQuestion(question: Question) {
  const q = getQuestions();
  saveQuestions(q.map(x => x.id === question.id ? question : x));
}

export function deleteQuestion(id: string) {
  const q = getQuestions();
  saveQuestions(q.filter(x => x.id !== id));
}
