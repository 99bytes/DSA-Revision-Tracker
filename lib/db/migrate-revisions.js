import pkg from 'pg';
const { Client } = pkg;

async function migrate() {
  const client = new Client({
    connectionString: "postgresql://postgres:AyushSinha5619@db.ysoxztitpokxlrifkemi.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase.");

    const sql = `
      CREATE TABLE IF NOT EXISTS "revisions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "question_id" uuid NOT NULL,
        "previous_confidence" integer NOT NULL,
        "new_confidence" integer NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    await client.query(sql);
    console.log("Revisions table created or already exists.");

    // Check if foreign key exists before adding it
    const checkFkSql = `
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'revisions' AND constraint_type = 'FOREIGN KEY';
    `;
    const res = await client.query(checkFkSql);
    
    if (res.rows.length === 0) {
      const addFkSql = `
        ALTER TABLE "revisions" ADD CONSTRAINT "revisions_question_id_questions_id_fk" 
        FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
      `;
      await client.query(addFkSql);
      console.log("Foreign key constraint added.");
    } else {
      console.log("Foreign key already exists.");
    }

    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
