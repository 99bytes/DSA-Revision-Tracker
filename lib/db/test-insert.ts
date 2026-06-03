import { db, questionsTable } from "./src/index";

async function main() {
  try {
    const res = await db.insert(questionsTable).values({
      userId: "user_test",
      name: "Test Q",
      platform: "LeetCode",
      tags: ["Array"],
      approach: "Simple",
      timeComplexity: "O(1)",
      confidence: 3,
      lastRevised: "2026-06-03T16:06:34.733Z" as any,
      mistakeNotes: "None"
    }).returning();
    console.log("Success:", res);
  } catch(e) {
    console.error("Error:", e);
  }
}
main();
