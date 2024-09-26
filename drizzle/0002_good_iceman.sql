CREATE TABLE IF NOT EXISTS "better-cv_embeddings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"resource_id" varchar(191),
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "better-cv_resources" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "better-cv_post";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_embeddings" ADD CONSTRAINT "better-cv_embeddings_resource_id_better-cv_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."better-cv_resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "better-cv_embeddings" USING hnsw ("embedding" vector_cosine_ops);