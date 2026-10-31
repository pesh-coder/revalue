import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_posts_format" AS ENUM('Blog', 'Guide');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_format" AS ENUM('Blog', 'Guide');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_stage" AS ENUM('Concept', 'In development', 'Testing', 'Pilot', 'Completed', 'Published research');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_stage" AS ENUM('Concept', 'In development', 'Testing', 'Pilot', 'Completed', 'Published research');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_solutions_availability" AS ENUM('Available', 'In development', 'Exploring');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_version_availability" AS ENUM('Available', 'In development', 'Exploring');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_topics_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__topics_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tools_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tools_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('Waste discovery or assessment', 'Partnership or recovery', 'Funding or research', 'Media', 'General');
  CREATE TYPE "public"."enum_enquiries_delivery_state" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_content_updates_state" AS ENUM('pending', 'complete', 'failed');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "role" "enum_users_role" DEFAULT 'editor' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "reset_password_requested_at" timestamp(3) with time zone,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "media" (
    "id" serial PRIMARY KEY NOT NULL,
    "alt" varchar NOT NULL,
    "caption" varchar,
    "credit" varchar,
    "public_approved" boolean DEFAULT false,
    "permission_note" varchar,
    "prefix" varchar DEFAULT 'media',
    "_objectkey" varchar,
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
    "sizes_card_url" varchar,
    "sizes_card_width" numeric,
    "sizes_card_height" numeric,
    "sizes_card_mime_type" varchar,
    "sizes_card_filesize" numeric,
    "sizes_card_filename" varchar
  );

  CREATE TABLE "files" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "public_approved" boolean DEFAULT false,
    "prefix" varchar DEFAULT 'files',
    "_objectkey" varchar,
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
    "focal_y" numeric
  );

  CREATE TABLE "posts" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "excerpt" varchar,
    "primary_topic" varchar,
    "primary_topic_slug" varchar DEFAULT 'waste-audits',
    "format" "enum_posts_format" DEFAULT 'Blog',
    "author_name" varchar,
    "cover_id" integer,
    "body" jsonb,
    "published_at" timestamp(3) with time zone,
    "reviewed_at" timestamp(3) with time zone,
    "meta_title" varchar,
    "meta_description" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_posts_status" DEFAULT 'draft'
  );

  CREATE TABLE "_posts_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_excerpt" varchar,
    "version_primary_topic" varchar,
    "version_primary_topic_slug" varchar DEFAULT 'waste-audits',
    "version_format" "enum__posts_v_version_format" DEFAULT 'Blog',
    "version_author_name" varchar,
    "version_cover_id" integer,
    "version_body" jsonb,
    "version_published_at" timestamp(3) with time zone,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__posts_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "projects_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar
  );

  CREATE TABLE "projects" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "excerpt" varchar,
    "stage" "enum_projects_stage" DEFAULT 'Concept',
    "image_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_projects_status" DEFAULT 'draft'
  );

  CREATE TABLE "_projects_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_projects_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_excerpt" varchar,
    "version_stage" "enum__projects_v_version_stage" DEFAULT 'Concept',
    "version_image_id" integer,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__projects_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "solutions_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar
  );

  CREATE TABLE "solutions" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "excerpt" varchar,
    "availability" "enum_solutions_availability" DEFAULT 'Exploring',
    "audience" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_solutions_status" DEFAULT 'draft'
  );

  CREATE TABLE "_solutions_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_solutions_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_excerpt" varchar,
    "version_availability" "enum__solutions_v_version_availability" DEFAULT 'Exploring',
    "version_audience" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "topics" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "introduction" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_topics_status" DEFAULT 'draft'
  );

  CREATE TABLE "_topics_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_introduction" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__topics_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "tools_instructions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "step" varchar
  );

  CREATE TABLE "tools" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "excerpt" varchar,
    "audience" varchar,
    "format" varchar,
    "public_release_approved" boolean DEFAULT false,
    "file_id" integer,
    "version_date" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_tools_status" DEFAULT 'draft'
  );

  CREATE TABLE "_tools_v_version_instructions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "step" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_tools_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_excerpt" varchar,
    "version_audience" varchar,
    "version_format" varchar,
    "version_public_release_approved" boolean DEFAULT false,
    "version_file_id" integer,
    "version_version_date" timestamp(3) with time zone,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__tools_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "pages_principles" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "pages_people" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" varchar,
    "initials" varchar
  );

  CREATE TABLE "pages_audiences" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "pages_pricing_rows" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "offering" varchar,
    "factors" varchar
  );

  CREATE TABLE "pages_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar
  );

  CREATE TABLE "pages" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "introduction" varchar,
    "body" jsonb,
    "image_id" integer,
    "principles_heading" varchar,
    "team_heading" varchar,
    "team_introduction" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "_pages_v_version_principles" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_people" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" varchar,
    "initials" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_audiences" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_pricing_rows" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "offering" varchar,
    "factors" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_pages_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_introduction" varchar,
    "version_body" jsonb,
    "version_image_id" integer,
    "version_principles_heading" varchar,
    "version_team_heading" varchar,
    "version_team_introduction" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__pages_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "enquiries" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "organisation" varchar NOT NULL,
    "email" varchar NOT NULL,
    "phone" varchar,
    "type" "enum_enquiries_type" NOT NULL,
    "message" varchar NOT NULL,
    "submission_id" varchar NOT NULL,
    "message_hash" varchar NOT NULL,
    "delivery_state" "enum_enquiries_delivery_state" DEFAULT 'pending',
    "delivery_attempts" numeric DEFAULT 0,
    "last_attempt_at" timestamp(3) with time zone,
    "provider_reference" varchar,
    "delivery_error" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "enquiry_attempts" (
    "id" serial PRIMARY KEY NOT NULL,
    "ip_hash" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "content_updates" (
    "id" serial PRIMARY KEY NOT NULL,
    "source" varchar NOT NULL,
    "state" "enum_content_updates_state" DEFAULT 'pending' NOT NULL,
    "error" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "media_id" integer,
    "files_id" integer,
    "posts_id" integer,
    "projects_id" integer,
    "solutions_id" integer,
    "topics_id" integer,
    "tools_id" integer,
    "pages_id" integer,
    "enquiries_id" integer,
    "enquiry_attempts_id" integer,
    "content_updates_id" integer
  );

  CREATE TABLE "payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );

  CREATE TABLE "payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "homepage_copy_audiences" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar,
    "href" varchar
  );

  CREATE TABLE "homepage_copy_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "homepage" (
    "id" serial PRIMARY KEY NOT NULL,
    "hero_image_id" integer,
    "featured_project_id" integer,
    "copy_hero_title" varchar DEFAULT 'Waste has value.',
    "copy_hero_text" varchar DEFAULT 'Revalue helps organisations see what they throw away, separate it better, and find out what can be recovered.',
    "copy_hero_action" varchar DEFAULT 'Talk to us about your waste',
    "copy_hero_secondary" varchar DEFAULT 'Read how we work',
    "copy_latest_heading" varchar DEFAULT 'Latest from Revalue',
    "copy_empty_heading" varchar DEFAULT 'Explore Revalue',
    "copy_articles_label" varchar DEFAULT 'All articles',
    "copy_focus_label" varchar DEFAULT 'Our focus',
    "copy_focus_title" varchar DEFAULT 'Keeping value in circulation.',
    "copy_focus_text" varchar DEFAULT 'We focus on how waste is understood, separated and connected to recovery opportunities in Uganda.',
    "copy_focus_link" varchar DEFAULT 'Explore our work',
    "copy_audience_heading" varchar DEFAULT 'Where to start',
    "copy_how_heading" varchar DEFAULT 'How we work',
    "copy_contact_heading" varchar DEFAULT 'Have a waste problem you want to understand?',
    "copy_contact_label" varchar DEFAULT 'Talk to us',
    "copy_project_label" varchar DEFAULT 'Featured project',
    "copy_project_link" varchar DEFAULT 'Read the project',
    "copy_project_stage" varchar DEFAULT 'The prototype is being tested as we prepare for a field pilot.',
    "show_featured_project" boolean DEFAULT false,
    "_status" "enum_homepage_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "homepage_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "posts_id" integer
  );

  CREATE TABLE "_homepage_v_version_copy_audiences" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "description" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_homepage_v_version_copy_steps" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_homepage_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_hero_image_id" integer,
    "version_featured_project_id" integer,
    "version_copy_hero_title" varchar DEFAULT 'Waste has value.',
    "version_copy_hero_text" varchar DEFAULT 'Revalue helps organisations see what they throw away, separate it better, and find out what can be recovered.',
    "version_copy_hero_action" varchar DEFAULT 'Talk to us about your waste',
    "version_copy_hero_secondary" varchar DEFAULT 'Read how we work',
    "version_copy_latest_heading" varchar DEFAULT 'Latest from Revalue',
    "version_copy_empty_heading" varchar DEFAULT 'Explore Revalue',
    "version_copy_articles_label" varchar DEFAULT 'All articles',
    "version_copy_focus_label" varchar DEFAULT 'Our focus',
    "version_copy_focus_title" varchar DEFAULT 'Keeping value in circulation.',
    "version_copy_focus_text" varchar DEFAULT 'We focus on how waste is understood, separated and connected to recovery opportunities in Uganda.',
    "version_copy_focus_link" varchar DEFAULT 'Explore our work',
    "version_copy_audience_heading" varchar DEFAULT 'Where to start',
    "version_copy_how_heading" varchar DEFAULT 'How we work',
    "version_copy_contact_heading" varchar DEFAULT 'Have a waste problem you want to understand?',
    "version_copy_contact_label" varchar DEFAULT 'Talk to us',
    "version_copy_project_label" varchar DEFAULT 'Featured project',
    "version_copy_project_link" varchar DEFAULT 'Read the project',
    "version_copy_project_stage" varchar DEFAULT 'The prototype is being tested as we prepare for a field pilot.',
    "version_show_featured_project" boolean DEFAULT false,
    "version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "_homepage_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "posts_id" integer
  );

  CREATE TABLE "site_settings_navigation_children" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "site_settings_navigation" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "site_settings_footer_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar
  );

  CREATE TABLE "site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "tagline" varchar,
    "operator" varchar,
    "contact_label" varchar,
    "contact_email" varchar,
    "_status" "enum_site_settings_status" DEFAULT 'draft',
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_site_settings_v_version_navigation_children" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_navigation" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v_version_footer_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "href" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_site_settings_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "version_tagline" varchar,
    "version_operator" varchar,
    "version_contact_label" varchar,
    "version_contact_email" varchar,
    "version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_sections" ADD CONSTRAINT "projects_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_sections" ADD CONSTRAINT "_projects_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_sections" ADD CONSTRAINT "solutions_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_sections" ADD CONSTRAINT "_solutions_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_topics_v" ADD CONSTRAINT "_topics_v_parent_id_topics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tools_instructions" ADD CONSTRAINT "tools_instructions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools" ADD CONSTRAINT "tools_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tools_v_version_instructions" ADD CONSTRAINT "_tools_v_version_instructions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v" ADD CONSTRAINT "_tools_v_parent_id_tools_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tools_v" ADD CONSTRAINT "_tools_v_version_file_id_files_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_principles" ADD CONSTRAINT "pages_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_people" ADD CONSTRAINT "pages_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_audiences" ADD CONSTRAINT "pages_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pricing_rows" ADD CONSTRAINT "pages_pricing_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_principles" ADD CONSTRAINT "_pages_v_version_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_people" ADD CONSTRAINT "_pages_v_version_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_audiences" ADD CONSTRAINT "_pages_v_version_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_pricing_rows" ADD CONSTRAINT "_pages_v_version_pricing_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiry_attempts_fk" FOREIGN KEY ("enquiry_attempts_id") REFERENCES "public"."enquiry_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_updates_fk" FOREIGN KEY ("content_updates_id") REFERENCES "public"."content_updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_copy_audiences" ADD CONSTRAINT "homepage_copy_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_copy_steps" ADD CONSTRAINT "homepage_copy_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_featured_project_id_projects_id_fk" FOREIGN KEY ("featured_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_copy_audiences" ADD CONSTRAINT "_homepage_v_version_copy_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_copy_steps" ADD CONSTRAINT "_homepage_v_version_copy_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_featured_project_id_projects_id_fk" FOREIGN KEY ("version_featured_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation_children" ADD CONSTRAINT "site_settings_navigation_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_navigation_children" ADD CONSTRAINT "_site_settings_v_version_navigation_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_navigation" ADD CONSTRAINT "_site_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_links" ADD CONSTRAINT "_site_settings_v_version_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "projects_sections_order_idx" ON "projects_sections" USING btree ("_order");
  CREATE INDEX "projects_sections_parent_id_idx" ON "projects_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_sections_order_idx" ON "_projects_v_version_sections" USING btree ("_order");
  CREATE INDEX "_projects_v_version_sections_parent_id_idx" ON "_projects_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "solutions_sections_order_idx" ON "solutions_sections" USING btree ("_order");
  CREATE INDEX "solutions_sections_parent_id_idx" ON "solutions_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE INDEX "_solutions_v_version_sections_order_idx" ON "_solutions_v_version_sections" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_sections_parent_id_idx" ON "_solutions_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_version_slug_idx" ON "_solutions_v" USING btree ("version_slug");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");
  CREATE INDEX "topics_updated_at_idx" ON "topics" USING btree ("updated_at");
  CREATE INDEX "topics_created_at_idx" ON "topics" USING btree ("created_at");
  CREATE INDEX "topics__status_idx" ON "topics" USING btree ("_status");
  CREATE INDEX "_topics_v_parent_idx" ON "_topics_v" USING btree ("parent_id");
  CREATE INDEX "_topics_v_version_version_slug_idx" ON "_topics_v" USING btree ("version_slug");
  CREATE INDEX "_topics_v_version_version_updated_at_idx" ON "_topics_v" USING btree ("version_updated_at");
  CREATE INDEX "_topics_v_version_version_created_at_idx" ON "_topics_v" USING btree ("version_created_at");
  CREATE INDEX "_topics_v_version_version__status_idx" ON "_topics_v" USING btree ("version__status");
  CREATE INDEX "_topics_v_created_at_idx" ON "_topics_v" USING btree ("created_at");
  CREATE INDEX "_topics_v_updated_at_idx" ON "_topics_v" USING btree ("updated_at");
  CREATE INDEX "_topics_v_latest_idx" ON "_topics_v" USING btree ("latest");
  CREATE INDEX "tools_instructions_order_idx" ON "tools_instructions" USING btree ("_order");
  CREATE INDEX "tools_instructions_parent_id_idx" ON "tools_instructions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tools_slug_idx" ON "tools" USING btree ("slug");
  CREATE INDEX "tools_file_idx" ON "tools" USING btree ("file_id");
  CREATE INDEX "tools_updated_at_idx" ON "tools" USING btree ("updated_at");
  CREATE INDEX "tools_created_at_idx" ON "tools" USING btree ("created_at");
  CREATE INDEX "tools__status_idx" ON "tools" USING btree ("_status");
  CREATE INDEX "_tools_v_version_instructions_order_idx" ON "_tools_v_version_instructions" USING btree ("_order");
  CREATE INDEX "_tools_v_version_instructions_parent_id_idx" ON "_tools_v_version_instructions" USING btree ("_parent_id");
  CREATE INDEX "_tools_v_parent_idx" ON "_tools_v" USING btree ("parent_id");
  CREATE INDEX "_tools_v_version_version_slug_idx" ON "_tools_v" USING btree ("version_slug");
  CREATE INDEX "_tools_v_version_version_file_idx" ON "_tools_v" USING btree ("version_file_id");
  CREATE INDEX "_tools_v_version_version_updated_at_idx" ON "_tools_v" USING btree ("version_updated_at");
  CREATE INDEX "_tools_v_version_version_created_at_idx" ON "_tools_v" USING btree ("version_created_at");
  CREATE INDEX "_tools_v_version_version__status_idx" ON "_tools_v" USING btree ("version__status");
  CREATE INDEX "_tools_v_created_at_idx" ON "_tools_v" USING btree ("created_at");
  CREATE INDEX "_tools_v_updated_at_idx" ON "_tools_v" USING btree ("updated_at");
  CREATE INDEX "_tools_v_latest_idx" ON "_tools_v" USING btree ("latest");
  CREATE INDEX "pages_principles_order_idx" ON "pages_principles" USING btree ("_order");
  CREATE INDEX "pages_principles_parent_id_idx" ON "pages_principles" USING btree ("_parent_id");
  CREATE INDEX "pages_people_order_idx" ON "pages_people" USING btree ("_order");
  CREATE INDEX "pages_people_parent_id_idx" ON "pages_people" USING btree ("_parent_id");
  CREATE INDEX "pages_audiences_order_idx" ON "pages_audiences" USING btree ("_order");
  CREATE INDEX "pages_audiences_parent_id_idx" ON "pages_audiences" USING btree ("_parent_id");
  CREATE INDEX "pages_pricing_rows_order_idx" ON "pages_pricing_rows" USING btree ("_order");
  CREATE INDEX "pages_pricing_rows_parent_id_idx" ON "pages_pricing_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_image_idx" ON "pages" USING btree ("image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_principles_order_idx" ON "_pages_v_version_principles" USING btree ("_order");
  CREATE INDEX "_pages_v_version_principles_parent_id_idx" ON "_pages_v_version_principles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_people_order_idx" ON "_pages_v_version_people" USING btree ("_order");
  CREATE INDEX "_pages_v_version_people_parent_id_idx" ON "_pages_v_version_people" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_audiences_order_idx" ON "_pages_v_version_audiences" USING btree ("_order");
  CREATE INDEX "_pages_v_version_audiences_parent_id_idx" ON "_pages_v_version_audiences" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_pricing_rows_order_idx" ON "_pages_v_version_pricing_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_version_pricing_rows_parent_id_idx" ON "_pages_v_version_pricing_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_order_idx" ON "_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_parent_id_idx" ON "_pages_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_image_idx" ON "_pages_v" USING btree ("version_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "enquiries_submission_id_idx" ON "enquiries" USING btree ("submission_id");
  CREATE INDEX "enquiries_message_hash_idx" ON "enquiries" USING btree ("message_hash");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "enquiry_attempts_ip_hash_idx" ON "enquiry_attempts" USING btree ("ip_hash");
  CREATE INDEX "enquiry_attempts_updated_at_idx" ON "enquiry_attempts" USING btree ("updated_at");
  CREATE INDEX "enquiry_attempts_created_at_idx" ON "enquiry_attempts" USING btree ("created_at");
  CREATE INDEX "content_updates_updated_at_idx" ON "content_updates" USING btree ("updated_at");
  CREATE INDEX "content_updates_created_at_idx" ON "content_updates" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("topics_id");
  CREATE INDEX "payload_locked_documents_rels_tools_id_idx" ON "payload_locked_documents_rels" USING btree ("tools_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_enquiry_attempts_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiry_attempts_id");
  CREATE INDEX "payload_locked_documents_rels_content_updates_id_idx" ON "payload_locked_documents_rels" USING btree ("content_updates_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_copy_audiences_order_idx" ON "homepage_copy_audiences" USING btree ("_order");
  CREATE INDEX "homepage_copy_audiences_parent_id_idx" ON "homepage_copy_audiences" USING btree ("_parent_id");
  CREATE INDEX "homepage_copy_steps_order_idx" ON "homepage_copy_steps" USING btree ("_order");
  CREATE INDEX "homepage_copy_steps_parent_id_idx" ON "homepage_copy_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_featured_project_idx" ON "homepage" USING btree ("featured_project_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "homepage_rels" USING btree ("posts_id");
  CREATE INDEX "_homepage_v_version_copy_audiences_order_idx" ON "_homepage_v_version_copy_audiences" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_copy_audiences_parent_id_idx" ON "_homepage_v_version_copy_audiences" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_copy_steps_order_idx" ON "_homepage_v_version_copy_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_copy_steps_parent_id_idx" ON "_homepage_v_version_copy_steps" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_version_hero_image_idx" ON "_homepage_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_homepage_v_version_version_featured_project_idx" ON "_homepage_v" USING btree ("version_featured_project_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_posts_id_idx" ON "_homepage_v_rels" USING btree ("posts_id");
  CREATE INDEX "site_settings_navigation_children_order_idx" ON "site_settings_navigation_children" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_children_parent_id_idx" ON "site_settings_navigation_children" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_navigation_children_order_idx" ON "_site_settings_v_version_navigation_children" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_children_parent_id_idx" ON "_site_settings_v_version_navigation_children" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_navigation_order_idx" ON "_site_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_parent_id_idx" ON "_site_settings_v_version_navigation" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_links_order_idx" ON "_site_settings_v_version_footer_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_links_parent_id_idx" ON "_site_settings_v_version_footer_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "projects_sections" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v_version_sections" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "solutions_sections" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "_solutions_v_version_sections" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "topics" CASCADE;
  DROP TABLE "_topics_v" CASCADE;
  DROP TABLE "tools_instructions" CASCADE;
  DROP TABLE "tools" CASCADE;
  DROP TABLE "_tools_v_version_instructions" CASCADE;
  DROP TABLE "_tools_v" CASCADE;
  DROP TABLE "pages_principles" CASCADE;
  DROP TABLE "pages_people" CASCADE;
  DROP TABLE "pages_audiences" CASCADE;
  DROP TABLE "pages_pricing_rows" CASCADE;
  DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_version_principles" CASCADE;
  DROP TABLE "_pages_v_version_people" CASCADE;
  DROP TABLE "_pages_v_version_audiences" CASCADE;
  DROP TABLE "_pages_v_version_pricing_rows" CASCADE;
  DROP TABLE "_pages_v_version_sections" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "enquiry_attempts" CASCADE;
  DROP TABLE "content_updates" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_copy_audiences" CASCADE;
  DROP TABLE "homepage_copy_steps" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_version_copy_audiences" CASCADE;
  DROP TABLE "_homepage_v_version_copy_steps" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "site_settings_navigation_children" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings_footer_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_navigation_children" CASCADE;
  DROP TABLE "_site_settings_v_version_navigation" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_links" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_posts_format";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_format";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_projects_stage";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_stage";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_solutions_availability";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_version_availability";
  DROP TYPE "public"."enum__solutions_v_version_status";
  DROP TYPE "public"."enum_topics_status";
  DROP TYPE "public"."enum__topics_v_version_status";
  DROP TYPE "public"."enum_tools_status";
  DROP TYPE "public"."enum__tools_v_version_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_enquiries_type";
  DROP TYPE "public"."enum_enquiries_delivery_state";
  DROP TYPE "public"."enum_content_updates_state";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";`)
}
