ALTER TABLE "users" ALTER COLUMN "email_verified" SET DATA TYPE boolean USING CASE WHEN "email_verified" IS NOT NULL THEN true ELSE false END;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET NOT NULL;
