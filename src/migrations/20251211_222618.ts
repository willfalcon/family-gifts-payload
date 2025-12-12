import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'user', 'super-admin');
  CREATE TYPE "public"."enum_invite_event_response" AS ENUM('declined', 'maybe', 'accepted');
  CREATE TYPE "public"."enum_item_priority" AS ENUM('low', 'medium', 'high');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_users_roles",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"birthday" timestamp(3) with time zone,
  	"bio" jsonb,
  	"avatar_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "family" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"allow_invites" boolean DEFAULT false,
  	"created_by_id" uuid,
  	"invite_link_token" varchar,
  	"invite_link_expiry" timestamp(3) with time zone,
  	"require_approval" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "family_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "event" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"time" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"end_time" timestamp(3) with time zone,
  	"location" varchar,
  	"info" jsonb,
  	"family_id" uuid,
  	"creator_id" uuid NOT NULL,
  	"secret_santa_budget" varchar,
  	"secret_santa_notifications_sent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"invite_id" uuid
  );
  
  CREATE TABLE "invite" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"email" varchar,
  	"token" varchar NOT NULL,
  	"token_expiry" timestamp(3) with time zone NOT NULL,
  	"event_response" "enum_invite_event_response",
  	"needs_approval" boolean DEFAULT false,
  	"approval_rejected" boolean DEFAULT false,
  	"family_id" uuid,
  	"event_id" uuid,
  	"user_id" uuid,
  	"inviter_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "list" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"user_id" uuid NOT NULL,
  	"public" boolean DEFAULT false,
  	"share_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "list_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"item_id" uuid,
  	"family_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "item" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"link" varchar,
  	"notes" jsonb,
  	"priority" "enum_item_priority",
  	"price" varchar,
  	"image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "item_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "assignment" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"event_id" uuid NOT NULL,
  	"giver_id" uuid NOT NULL,
  	"receiver_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exclusion" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"event_id" uuid,
  	"from_id" uuid,
  	"to_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "favorite" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"user_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "favorite_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"family_id" uuid,
  	"event_id" uuid,
  	"list_id" uuid
  );
  
  CREATE TABLE "message" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"content" varchar NOT NULL,
  	"sender_id" uuid NOT NULL,
  	"family_id" uuid,
  	"event_id" uuid,
  	"recipient_id" uuid,
  	"assignment_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"media_id" uuid,
  	"family_id" uuid,
  	"event_id" uuid,
  	"invite_id" uuid,
  	"list_id" uuid,
  	"item_id" uuid,
  	"assignment_id" uuid,
  	"exclusion_id" uuid,
  	"favorite_id" uuid,
  	"message_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family" ADD CONSTRAINT "family_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "family_rels" ADD CONSTRAINT "family_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "family_rels" ADD CONSTRAINT "family_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event" ADD CONSTRAINT "event_family_id_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event" ADD CONSTRAINT "event_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_rels" ADD CONSTRAINT "event_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_rels" ADD CONSTRAINT "event_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_rels" ADD CONSTRAINT "event_rels_invite_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."invite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invite" ADD CONSTRAINT "invite_family_id_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invite" ADD CONSTRAINT "invite_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invite" ADD CONSTRAINT "invite_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invite" ADD CONSTRAINT "invite_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "list" ADD CONSTRAINT "list_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "list_rels" ADD CONSTRAINT "list_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "list_rels" ADD CONSTRAINT "list_rels_item_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "list_rels" ADD CONSTRAINT "list_rels_family_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "list_rels" ADD CONSTRAINT "list_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "item" ADD CONSTRAINT "item_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "item_rels" ADD CONSTRAINT "item_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "item_rels" ADD CONSTRAINT "item_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assignment" ADD CONSTRAINT "assignment_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assignment" ADD CONSTRAINT "assignment_giver_id_invite_id_fk" FOREIGN KEY ("giver_id") REFERENCES "public"."invite"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assignment" ADD CONSTRAINT "assignment_receiver_id_invite_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."invite"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exclusion" ADD CONSTRAINT "exclusion_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exclusion" ADD CONSTRAINT "exclusion_from_id_invite_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."invite"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exclusion" ADD CONSTRAINT "exclusion_to_id_invite_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."invite"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "favorite_rels" ADD CONSTRAINT "favorite_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."favorite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorite_rels" ADD CONSTRAINT "favorite_rels_family_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorite_rels" ADD CONSTRAINT "favorite_rels_event_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "favorite_rels" ADD CONSTRAINT "favorite_rels_list_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "message" ADD CONSTRAINT "message_family_id_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "message" ADD CONSTRAINT "message_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "message" ADD CONSTRAINT "message_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "message" ADD CONSTRAINT "message_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_family_fk" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invite_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."invite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_list_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_item_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assignment_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exclusion_fk" FOREIGN KEY ("exclusion_id") REFERENCES "public"."exclusion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_favorite_fk" FOREIGN KEY ("favorite_id") REFERENCES "public"."favorite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_message_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "family_created_by_idx" ON "family" USING btree ("created_by_id");
  CREATE INDEX "family_updated_at_idx" ON "family" USING btree ("updated_at");
  CREATE INDEX "family_created_at_idx" ON "family" USING btree ("created_at");
  CREATE INDEX "createdBy_idx" ON "family" USING btree ("created_by_id");
  CREATE INDEX "family_rels_order_idx" ON "family_rels" USING btree ("order");
  CREATE INDEX "family_rels_parent_idx" ON "family_rels" USING btree ("parent_id");
  CREATE INDEX "family_rels_path_idx" ON "family_rels" USING btree ("path");
  CREATE INDEX "family_rels_users_id_idx" ON "family_rels" USING btree ("users_id");
  CREATE INDEX "event_family_idx" ON "event" USING btree ("family_id");
  CREATE INDEX "event_creator_idx" ON "event" USING btree ("creator_id");
  CREATE INDEX "event_updated_at_idx" ON "event" USING btree ("updated_at");
  CREATE INDEX "event_created_at_idx" ON "event" USING btree ("created_at");
  CREATE INDEX "creator_idx" ON "event" USING btree ("creator_id");
  CREATE INDEX "family_idx" ON "event" USING btree ("family_id");
  CREATE INDEX "event_rels_order_idx" ON "event_rels" USING btree ("order");
  CREATE INDEX "event_rels_parent_idx" ON "event_rels" USING btree ("parent_id");
  CREATE INDEX "event_rels_path_idx" ON "event_rels" USING btree ("path");
  CREATE INDEX "event_rels_users_id_idx" ON "event_rels" USING btree ("users_id");
  CREATE INDEX "event_rels_invite_id_idx" ON "event_rels" USING btree ("invite_id");
  CREATE INDEX "invite_family_idx" ON "invite" USING btree ("family_id");
  CREATE INDEX "invite_event_idx" ON "invite" USING btree ("event_id");
  CREATE INDEX "invite_user_idx" ON "invite" USING btree ("user_id");
  CREATE INDEX "invite_inviter_idx" ON "invite" USING btree ("inviter_id");
  CREATE INDEX "invite_updated_at_idx" ON "invite" USING btree ("updated_at");
  CREATE INDEX "invite_created_at_idx" ON "invite" USING btree ("created_at");
  CREATE INDEX "user_idx" ON "invite" USING btree ("user_id");
  CREATE INDEX "event_idx" ON "invite" USING btree ("event_id");
  CREATE INDEX "family_1_idx" ON "invite" USING btree ("family_id");
  CREATE INDEX "token_idx" ON "invite" USING btree ("token");
  CREATE INDEX "user_event_idx" ON "invite" USING btree ("user_id","event_id");
  CREATE INDEX "list_user_idx" ON "list" USING btree ("user_id");
  CREATE INDEX "list_updated_at_idx" ON "list" USING btree ("updated_at");
  CREATE INDEX "list_created_at_idx" ON "list" USING btree ("created_at");
  CREATE INDEX "user_1_idx" ON "list" USING btree ("user_id");
  CREATE INDEX "public_idx" ON "list" USING btree ("public");
  CREATE INDEX "list_rels_order_idx" ON "list_rels" USING btree ("order");
  CREATE INDEX "list_rels_parent_idx" ON "list_rels" USING btree ("parent_id");
  CREATE INDEX "list_rels_path_idx" ON "list_rels" USING btree ("path");
  CREATE INDEX "list_rels_item_id_idx" ON "list_rels" USING btree ("item_id");
  CREATE INDEX "list_rels_family_id_idx" ON "list_rels" USING btree ("family_id");
  CREATE INDEX "list_rels_users_id_idx" ON "list_rels" USING btree ("users_id");
  CREATE INDEX "item_image_idx" ON "item" USING btree ("image_id");
  CREATE INDEX "item_updated_at_idx" ON "item" USING btree ("updated_at");
  CREATE INDEX "item_created_at_idx" ON "item" USING btree ("created_at");
  CREATE INDEX "priority_idx" ON "item" USING btree ("priority");
  CREATE INDEX "item_rels_order_idx" ON "item_rels" USING btree ("order");
  CREATE INDEX "item_rels_parent_idx" ON "item_rels" USING btree ("parent_id");
  CREATE INDEX "item_rels_path_idx" ON "item_rels" USING btree ("path");
  CREATE INDEX "item_rels_users_id_idx" ON "item_rels" USING btree ("users_id");
  CREATE INDEX "assignment_event_idx" ON "assignment" USING btree ("event_id");
  CREATE INDEX "assignment_giver_idx" ON "assignment" USING btree ("giver_id");
  CREATE INDEX "assignment_receiver_idx" ON "assignment" USING btree ("receiver_id");
  CREATE INDEX "assignment_updated_at_idx" ON "assignment" USING btree ("updated_at");
  CREATE INDEX "assignment_created_at_idx" ON "assignment" USING btree ("created_at");
  CREATE INDEX "event_1_idx" ON "assignment" USING btree ("event_id");
  CREATE INDEX "giver_idx" ON "assignment" USING btree ("giver_id");
  CREATE INDEX "receiver_idx" ON "assignment" USING btree ("receiver_id");
  CREATE INDEX "exclusion_event_idx" ON "exclusion" USING btree ("event_id");
  CREATE INDEX "exclusion_from_idx" ON "exclusion" USING btree ("from_id");
  CREATE INDEX "exclusion_to_idx" ON "exclusion" USING btree ("to_id");
  CREATE INDEX "exclusion_updated_at_idx" ON "exclusion" USING btree ("updated_at");
  CREATE INDEX "exclusion_created_at_idx" ON "exclusion" USING btree ("created_at");
  CREATE INDEX "favorite_user_idx" ON "favorite" USING btree ("user_id");
  CREATE INDEX "favorite_updated_at_idx" ON "favorite" USING btree ("updated_at");
  CREATE INDEX "favorite_created_at_idx" ON "favorite" USING btree ("created_at");
  CREATE INDEX "favorite_rels_order_idx" ON "favorite_rels" USING btree ("order");
  CREATE INDEX "favorite_rels_parent_idx" ON "favorite_rels" USING btree ("parent_id");
  CREATE INDEX "favorite_rels_path_idx" ON "favorite_rels" USING btree ("path");
  CREATE INDEX "favorite_rels_family_id_idx" ON "favorite_rels" USING btree ("family_id");
  CREATE INDEX "favorite_rels_event_id_idx" ON "favorite_rels" USING btree ("event_id");
  CREATE INDEX "favorite_rels_list_id_idx" ON "favorite_rels" USING btree ("list_id");
  CREATE INDEX "message_sender_idx" ON "message" USING btree ("sender_id");
  CREATE INDEX "message_family_idx" ON "message" USING btree ("family_id");
  CREATE INDEX "message_event_idx" ON "message" USING btree ("event_id");
  CREATE INDEX "message_recipient_idx" ON "message" USING btree ("recipient_id");
  CREATE INDEX "message_assignment_idx" ON "message" USING btree ("assignment_id");
  CREATE INDEX "message_updated_at_idx" ON "message" USING btree ("updated_at");
  CREATE INDEX "message_created_at_idx" ON "message" USING btree ("created_at");
  CREATE INDEX "family_2_idx" ON "message" USING btree ("family_id");
  CREATE INDEX "event_2_idx" ON "message" USING btree ("event_id");
  CREATE INDEX "sender_idx" ON "message" USING btree ("sender_id");
  CREATE INDEX "recipient_idx" ON "message" USING btree ("recipient_id");
  CREATE INDEX "assignment_idx" ON "message" USING btree ("assignment_id");
  CREATE INDEX "createdAt_idx" ON "message" USING btree ("created_at");
  CREATE INDEX "family_createdAt_idx" ON "message" USING btree ("family_id","created_at");
  CREATE INDEX "event_createdAt_idx" ON "message" USING btree ("event_id","created_at");
  CREATE INDEX "sender_recipient_idx" ON "message" USING btree ("sender_id","recipient_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_family_id_idx" ON "payload_locked_documents_rels" USING btree ("family_id");
  CREATE INDEX "payload_locked_documents_rels_event_id_idx" ON "payload_locked_documents_rels" USING btree ("event_id");
  CREATE INDEX "payload_locked_documents_rels_invite_id_idx" ON "payload_locked_documents_rels" USING btree ("invite_id");
  CREATE INDEX "payload_locked_documents_rels_list_id_idx" ON "payload_locked_documents_rels" USING btree ("list_id");
  CREATE INDEX "payload_locked_documents_rels_item_id_idx" ON "payload_locked_documents_rels" USING btree ("item_id");
  CREATE INDEX "payload_locked_documents_rels_assignment_id_idx" ON "payload_locked_documents_rels" USING btree ("assignment_id");
  CREATE INDEX "payload_locked_documents_rels_exclusion_id_idx" ON "payload_locked_documents_rels" USING btree ("exclusion_id");
  CREATE INDEX "payload_locked_documents_rels_favorite_id_idx" ON "payload_locked_documents_rels" USING btree ("favorite_id");
  CREATE INDEX "payload_locked_documents_rels_message_id_idx" ON "payload_locked_documents_rels" USING btree ("message_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "family" CASCADE;
  DROP TABLE "family_rels" CASCADE;
  DROP TABLE "event" CASCADE;
  DROP TABLE "event_rels" CASCADE;
  DROP TABLE "invite" CASCADE;
  DROP TABLE "list" CASCADE;
  DROP TABLE "list_rels" CASCADE;
  DROP TABLE "item" CASCADE;
  DROP TABLE "item_rels" CASCADE;
  DROP TABLE "assignment" CASCADE;
  DROP TABLE "exclusion" CASCADE;
  DROP TABLE "favorite" CASCADE;
  DROP TABLE "favorite_rels" CASCADE;
  DROP TABLE "message" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_invite_event_response";
  DROP TYPE "public"."enum_item_priority";`)
}
