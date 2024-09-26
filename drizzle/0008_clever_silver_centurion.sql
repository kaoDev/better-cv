DO $$ BEGIN
 CREATE TYPE "public"."job_application_status" AS ENUM('draft', 'applied', 'interviewing', 'offered', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "better-cv_job_application" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"company_name" text NOT NULL,
	"job_title" text NOT NULL,
	"job_description" text NOT NULL,
	"application_status" "job_application_status" DEFAULT 'draft' NOT NULL,
	"applied_date" text,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_job_application" ADD CONSTRAINT "better-cv_job_application_user_id_better-cv_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_job_application" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
