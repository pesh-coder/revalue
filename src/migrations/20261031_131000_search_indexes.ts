import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`
    CREATE INDEX posts_public_search ON posts USING GIN (to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,''))) WHERE _status='published';
    CREATE INDEX projects_public_search ON projects USING GIN (to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,''))) WHERE _status='published';
    CREATE INDEX solutions_public_search ON solutions USING GIN (to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,''))) WHERE _status='published';
    CREATE INDEX tools_public_search ON tools USING GIN (to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,''))) WHERE _status='published' AND public_release_approved=true;
  `)
}
export async function down({ db }: MigrateDownArgs) {
  await db.execute(
    sql`DROP INDEX IF EXISTS posts_public_search; DROP INDEX IF EXISTS projects_public_search; DROP INDEX IF EXISTS solutions_public_search; DROP INDEX IF EXISTS tools_public_search;`,
  )
}
