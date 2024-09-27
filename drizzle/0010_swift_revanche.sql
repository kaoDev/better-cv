DO $$ BEGIN
 CREATE TYPE "public"."contact_type" AS ENUM('phone', 'email', 'linkedin', 'github', 'twitter', 'website', 'threads', 'pinterest', 'instagram', 'facebook', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "better-cv_contact_detail" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"type" "contact_type" NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "better-cv_education" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"institute" text NOT NULL,
	"title" text NOT NULL,
	"time_frame" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "better-cv_language" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"proficiency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "better-cv_reference" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"company" text NOT NULL,
	"contact" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_contact_detail" ADD CONSTRAINT "better-cv_contact_detail_user_id_better-cv_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_contact_detail" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_education" ADD CONSTRAINT "better-cv_education_user_id_better-cv_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_education" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_language" ADD CONSTRAINT "better-cv_language_user_id_better-cv_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_language" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_reference" ADD CONSTRAINT "better-cv_reference_user_id_better-cv_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "better-cv_reference" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."better-cv_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
