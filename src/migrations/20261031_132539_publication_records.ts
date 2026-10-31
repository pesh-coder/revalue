import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "publication_records" (
    "id" serial PRIMARY KEY NOT NULL,
    "source" varchar NOT NULL,
    "path" varchar NOT NULL,
    "gone" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "publication_records_id" integer;
  CREATE UNIQUE INDEX "publication_records_source_idx" ON "publication_records" USING btree ("source");
  CREATE UNIQUE INDEX "publication_records_path_idx" ON "publication_records" USING btree ("path");
  CREATE INDEX "publication_records_updated_at_idx" ON "publication_records" USING btree ("updated_at");
  CREATE INDEX "publication_records_created_at_idx" ON "publication_records" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publication_records_fk" FOREIGN KEY ("publication_records_id") REFERENCES "public"."publication_records"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_publication_records_id_idx" ON "payload_locked_documents_rels" USING btree ("publication_records_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "publication_records" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "publication_records" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_publication_records_fk";

  DROP INDEX "payload_locked_documents_rels_publication_records_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "publication_records_id";`)
}
