const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
const { pgTable, text, integer, timestamp, uuid } = require("drizzle-orm/pg-core");

const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
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

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:AyushSinha5619@db.ysoxztitpokxlrifkemi.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const db = drizzle(client);

  try {
    const res = await db.insert(questionsTable).values({
      userId: "user_test",
      name: "Test Q",
      platform: "LeetCode",
      tags: ["Array"],
      approach: "Simple",
      timeComplexity: "O(1)",
      confidence: 3,
      lastRevised: new Date("2026-06-03T16:06:34.733Z"),
      mistakeNotes: "None"
    }).returning();
    console.log("Success:", res);
  } catch(e) {
    console.error("Postgres Error:", e);
  } finally {
    await client.end();
  }
}
main();
