import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  tags: text("tags").array().notNull().default([]),
  approach: text("approach").notNull().default(""),
  timeComplexity: text("time_complexity").notNull().default(""),
  confidence: integer("confidence").notNull().default(3),
  lastRevised: timestamp("last_revised", { withTimezone: true }).notNull(),
  mistakeNotes: text("mistake_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuestionSchema = createInsertSchema(questionsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type DbQuestion = typeof questionsTable.$inferSelect;
