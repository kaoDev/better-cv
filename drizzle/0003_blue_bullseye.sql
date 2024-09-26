CREATE TABLE IF NOT EXISTS "better-cv_work_experience" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" json NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"company" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"bullet_points" text[] NOT NULL,
	"skills" text[] NOT NULL,
	"location" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "better-cv_embeddings";--> statement-breakpoint
DROP TABLE "better-cv_resources";