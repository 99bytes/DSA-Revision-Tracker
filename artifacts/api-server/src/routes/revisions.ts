import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { revisionsTable } from "@workspace/db/schema";
import type { DbRevision } from "@workspace/db/schema";
import {
  ListRevisionsResponse,
  ListRevisionsResponseItem,
  CreateRevisionBody,
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

function toApiRevision(r: DbRevision) {
  return {
    id: r.id,
    questionId: r.questionId,
    previousConfidence: r.previousConfidence,
    newConfidence: r.newConfidence,
    createdAt: r.createdAt instanceof Date
      ? r.createdAt.toISOString()
      : String(r.createdAt),
  };
}

router.get("/revisions", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;
  const rows = await db
    .select()
    .from(revisionsTable)
    .where(eq(revisionsTable.userId, userId))
    .orderBy(revisionsTable.createdAt);
  const mapped = rows.map(toApiRevision);
  res.json(ListRevisionsResponse.parse(mapped));
});

router.post("/revisions", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as Request & { userId: string }).userId;
  const parsed = CreateRevisionBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid create revision body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(revisionsTable)
    .values({
      ...parsed.data,
      userId,
    })
    .returning();

  res.status(201).json(ListRevisionsResponseItem.parse(toApiRevision(row)));
});

export default router;
