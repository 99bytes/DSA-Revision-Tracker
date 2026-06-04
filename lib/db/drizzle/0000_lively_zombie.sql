CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"platform" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"approach" text DEFAULT '' NOT NULL,
	"time_complexity" text DEFAULT '' NOT NULL,
	"confidence" integer DEFAULT 3 NOT NULL,
	"last_revised" timestamp with time zone NOT NULL,
	"mistake_notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"question_id" uuid NOT NULL,
	"previous_confidence" integer NOT NULL,
	"new_confidence" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;