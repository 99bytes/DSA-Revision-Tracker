import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { questionsTable } from "./questions";

export const revisionsTable = pgTable("revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questionsTable.id, { onDelete: "cascade" }),
  previousConfidence: integer("previous_confidence").notNull(),
  newConfidence: integer("new_confidence").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRevisionSchema = createInsertSchema(revisionsTable).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type InsertRevision = z.infer<typeof insertRevisionSchema>;
export type DbRevision = typeof revisionsTable.$inferSelect;
