import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db, questionsTable, userSettingsTable } from "@workspace/db";
import type { DbQuestion } from "@workspace/db";
import {
  ListQuestionsResponse,
  ListQuestionsResponseItem,
  CreateQuestionBody,
  UpdateQuestionBody,
  UpdateQuestionParams,
  DeleteQuestionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { userId: string }).userId = userId;
  next();
}

function toApiQuestion(q: DbQuestion) {
  return {
    id: q.id,
    name: q.name,
    platform: q.platform,
    tags: q.tags ?? [],
    approach: q.approach,
    timeComplexity: q.timeComplexity,
    confidence: q.confidence,
    lastRevised: q.lastRevised instanceof Date
      ? q.lastRevised.toISOString()
      : String(q.lastRevised),
    mistakeNotes: q.mistakeNotes,
  };
}

router.get("/questions", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;

  try {
    const [setting] = await db
      .select()
      .from(userSettingsTable)
      .where(eq(userSettingsTable.userId, userId));

    if (!setting?.hasSeededDummyData) {
      const now = new Date();
      const dummyQuestions = [
        {
          userId,
          name: "Two Sum",
          platform: "LeetCode",
          tags: ["Array", "Hash Table"],
          approach: "Use a hash map to store the complement of each element as we iterate. O(n) time complexity.",
          timeComplexity: "O(n)",
          confidence: 4,
          lastRevised: now,
          mistakeNotes: "Watch out for using the same element twice.",
        },
        {
          userId,
          name: "Reverse Linked List",
          platform: "LeetCode",
          tags: ["Linked List"],
          approach: "Keep track of prev, curr, and next nodes. Iteratively reverse the pointers.",
          timeComplexity: "O(n)",
          confidence: 5,
          lastRevised: now,
          mistakeNotes: "Always remember to save the next node before overwriting curr.next.",
        },
        {
          userId,
          name: "Merge Intervals",
          platform: "LeetCode",
          tags: ["Array", "Sorting"],
          approach: "Sort intervals by start time. Iterate and merge if the current start is <= previous end.",
          timeComplexity: "O(n log n)",
          confidence: 3,
          lastRevised: now,
          mistakeNotes: "Make sure to update the end time to the max of both overlapping intervals.",
        },
        {
          userId,
          name: "LRU Cache",
          platform: "LeetCode",
          tags: ["Hash Table", "Doubly-Linked List", "Design"],
          approach: "Combine a hash map with a doubly linked list to achieve O(1) for both get and put operations.",
          timeComplexity: "O(1)",
          confidence: 2,
          lastRevised: now,
          mistakeNotes: "Updating pointers in the doubly linked list is error-prone. Extract into addNode/removeNode helpers.",
        }
      ];

      await db.insert(questionsTable).values(dummyQuestions);
      await db.insert(userSettingsTable).values({ userId, hasSeededDummyData: true })
        .onConflictDoUpdate({ target: userSettingsTable.userId, set: { hasSeededDummyData: true } });
    }
  } catch (error) {
    req.log.error({ error }, "Failed to seed dummy data");
  }

  const rows = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.userId, userId))
    .orderBy(questionsTable.createdAt);
  const mapped = rows.map(toApiQuestion);
  res.json(ListQuestionsResponse.parse(mapped));
});

router.post("/questions", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;
  const parsed = CreateQuestionBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid create body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { lastRevised, ...rest } = parsed.data;
  const [row] = await db
    .insert(questionsTable)
    .values({
      ...rest,
      userId,
      tags: rest.tags ?? [],
      approach: rest.approach ?? "",
      timeComplexity: rest.timeComplexity ?? "",
      mistakeNotes: rest.mistakeNotes ?? "",
      lastRevised: new Date(lastRevised),
    })
    .returning();

  res.status(201).json(ListQuestionsResponseItem.parse(toApiQuestion(row)));
});

router.patch("/questions/:id", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;
  const params = UpdateQuestionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateQuestionBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid update body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { lastRevised, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = { ...rest };
  if (lastRevised !== undefined) {
    updateData.lastRevised = new Date(lastRevised);
  }

  const [row] = await db
    .update(questionsTable)
    .set(updateData)
    .where(and(eq(questionsTable.id, params.data.id), eq(questionsTable.userId, userId)))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  res.json(ListQuestionsResponseItem.parse(toApiQuestion(row)));
});

router.delete("/questions/:id", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;
  const params = DeleteQuestionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(questionsTable)
    .where(and(eq(questionsTable.id, params.data.id), eq(questionsTable.userId, userId)))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
