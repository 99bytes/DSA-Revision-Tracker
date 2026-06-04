export interface RevisionLog {
  questionId: string;
  revisedAt: string;
  previousConfidence: number;
  newConfidence: number;
}

const STORAGE_KEY = "dsa-tracker-revision-history";

export function logRevision(log: RevisionLog) {
  try {
    const history = getRevisionHistory();
    history.push(log);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save revision history to local storage", e);
  }
}

export function getRevisionHistory(): RevisionLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse revision history", e);
    return [];
  }
}

export function getTotalRevisions(): number {
  return getRevisionHistory().length;
}
