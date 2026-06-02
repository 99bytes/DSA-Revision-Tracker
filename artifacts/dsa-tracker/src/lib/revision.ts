import { Question } from "./types";
import { addDays, isBefore, startOfDay } from "date-fns";

export function calculateNextRevision(lastRevised: string, confidence: 1 | 2 | 3 | 4 | 5): string {
  const date = new Date(lastRevised);
  let daysToAdd = 2;
  if (confidence === 2) daysToAdd = 3;
  if (confidence === 3) daysToAdd = 5;
  if (confidence === 4) daysToAdd = 7;
  if (confidence === 5) daysToAdd = 10;
  return addDays(date, daysToAdd).toISOString();
}

export function isOverdue(question: Question): boolean {
  const nextRev = new Date(calculateNextRevision(question.lastRevised, question.confidence));
  return isBefore(startOfDay(nextRev), startOfDay(addDays(new Date(), 1))); // today or before
}

export function getDashboardStats(questions: Question[]) {
  const total = questions.length;
  const weak = questions.filter(q => q.confidence <= 2).length;
  const strong = questions.filter(q => q.confidence >= 4).length;
  
  const weakTags = questions.filter(q => q.confidence <= 2).flatMap(q => q.tags);
  const tagCounts = weakTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let mostFrequentWeakTopic = "None";
  let maxCount = 0;
  for (const [tag, count] of Object.entries(tagCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentWeakTopic = tag;
    }
  }

  return { total, weak, strong, mostFrequentWeakTopic };
}
