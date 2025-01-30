CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"storeId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"basePrice" integer NOT NULL,
	"featuredImage" text,
	"images" json DEFAULT '[]'::json,
	"category" text,
	"tags" json DEFAULT '[]'::json,
	"available" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uniqueProductName" UNIQUE("storeId","name"),
	CONSTRAINT "uniqueProductSlug" UNIQUE("storeId","slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"tagline" text,
	"bio" text,
	"logo" text,
	"social_links" json DEFAULT '[]'::json,
	"features" json DEFAULT '{}'::json,
	"createdAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stores_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "websites" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"subdomain" text NOT NULL,
	"custom_domain" text,
	"title" text,
	"description" text,
	"cover_image" text,
	"favicon" text,
	"template" text NOT NULL,
	"configuration" json,
	"createdAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "websites_store_id_unique" UNIQUE("store_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_storeId_stores_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "websites" ADD CONSTRAINT "websites_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_user_idx" ON "stores" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subdomain_unique_idx" ON "websites" USING btree ("subdomain");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "custom_domain_unique_idx" ON "websites" USING btree ("custom_domain");