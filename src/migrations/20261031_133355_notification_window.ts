import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" ADD COLUMN "first_attempt_at" timestamp(3) with time zone;
   INSERT INTO publication_records(source,path,gone)
   SELECT 'posts:' || id, '/resources/' || CASE WHEN format='Guide' THEN 'guides' ELSE 'blog' END || '/' || slug,false FROM posts WHERE _status='published'
   ON CONFLICT(source) DO NOTHING;
   INSERT INTO publication_records(source,path,gone)
   SELECT 'projects:' || id, '/projects/' || slug,false FROM projects WHERE _status='published' ON CONFLICT(source) DO NOTHING;
   INSERT INTO publication_records(source,path,gone)
   SELECT 'solutions:' || id, '/solutions/' || slug,false FROM solutions WHERE _status='published' ON CONFLICT(source) DO NOTHING;
   INSERT INTO publication_records(source,path,gone)
   SELECT 'topics:' || id, '/resources/' || slug,false FROM topics WHERE _status='published' ON CONFLICT(source) DO NOTHING;
   INSERT INTO publication_records(source,path,gone)
   SELECT 'tools:' || id, '/resources/tools/' || slug,false FROM tools WHERE _status='published' AND public_release_approved=true ON CONFLICT(source) DO NOTHING;
   INSERT INTO publication_records(source,path,gone)
   SELECT 'pages:' || id, CASE slug WHEN 'resources-blog' THEN '/resources/blog' WHEN 'resources-guides' THEN '/resources/guides' WHEN 'resources-tools' THEN '/resources/tools' WHEN 'projects-index' THEN '/projects' WHEN 'solutions-index' THEN '/solutions' ELSE '/' || slug END,false FROM pages WHERE _status='published' ON CONFLICT(source) DO NOTHING;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" DROP COLUMN "first_attempt_at";`)
}
