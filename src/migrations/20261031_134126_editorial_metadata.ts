import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "social_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_social_image_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_social_image_id_media_id_fk" FOREIGN KEY ("version_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_social_image_idx" ON "posts" USING btree ("social_image_id");
  CREATE INDEX "_posts_v_version_version_social_image_idx" ON "_posts_v" USING btree ("version_social_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP CONSTRAINT "posts_social_image_id_media_id_fk";

  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_social_image_id_media_id_fk";

  DROP INDEX "posts_social_image_idx";
  DROP INDEX "_posts_v_version_version_social_image_idx";
  ALTER TABLE "posts" DROP COLUMN "social_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_social_image_id";`)
}
