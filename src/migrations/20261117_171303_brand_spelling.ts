import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ALTER COLUMN "copy_hero_text" SET DEFAULT 'ReValue helps organisations see what they throw away, separate it better, and find out what can be recovered.';
  ALTER TABLE "homepage" ALTER COLUMN "copy_latest_heading" SET DEFAULT 'Latest from ReValue';
  ALTER TABLE "homepage" ALTER COLUMN "copy_empty_heading" SET DEFAULT 'Explore ReValue';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_copy_hero_text" SET DEFAULT 'ReValue helps organisations see what they throw away, separate it better, and find out what can be recovered.';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_copy_latest_heading" SET DEFAULT 'Latest from ReValue';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_copy_empty_heading" SET DEFAULT 'Explore ReValue';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ALTER COLUMN "copy_hero_text" SET DEFAULT 'Revalue helps organisations see what they throw away, separate it better, and find out what can be recovered.';
  ALTER TABLE "homepage" ALTER COLUMN "copy_latest_heading" SET DEFAULT 'Latest from Revalue';
  ALTER TABLE "homepage" ALTER COLUMN "copy_empty_heading" SET DEFAULT 'Explore Revalue';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_copy_hero_text" SET DEFAULT 'Revalue helps organisations see what they throw away, separate it better, and find out what can be recovered.';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_copy_latest_heading" SET DEFAULT 'Latest from Revalue';
  ALTER TABLE "_homepage_v" ALTER COLUMN "version_copy_empty_heading" SET DEFAULT 'Explore Revalue';`)
}
