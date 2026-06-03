import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, questionsTable } from "@workspace/db";
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

router.get("/questions", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(questionsTable)
    .orderBy(questionsTable.createdAt);
  const mapped = rows.map(toApiQuestion);
  res.json(ListQuestionsResponse.parse(mapped));
});

router.post("/questions", async (req, res): Promise<void> => {
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
      tags: rest.tags ?? [],
      approach: rest.approach ?? "",
      timeComplexity: rest.timeComplexity ?? "",
      mistakeNotes: rest.mistakeNotes ?? "",
      lastRevised: new Date(lastRevised),
    })
    .returning();

  res.status(201).json(ListQuestionsResponseItem.parse(toApiQuestion(row)));
});

router.patch("/questions/:id", async (req, res): Promise<void> => {
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
    .where(eq(questionsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  res.json(ListQuestionsResponseItem.parse(toApiQuestion(row)));
});

router.delete("/questions/:id", async (req, res): Promise<void> => {
  const params = DeleteQuestionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(questionsTable)
    .where(eq(questionsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
