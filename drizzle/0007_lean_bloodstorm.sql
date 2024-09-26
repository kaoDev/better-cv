ALTER TABLE "better-cv_work_experience" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_work_experience" ADD CONSTRAINT "better-cv_work_experience_user_id_better-cv_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_work_experience" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
