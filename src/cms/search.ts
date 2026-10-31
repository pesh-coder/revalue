import { getPayload } from 'payload'
import config from '@payload-config'
export type SearchEntry = {
  title: string
  excerpt: string
  format: string
  topic: string
  href: string
}
export async function searchPublished({
  q,
  topic,
  format,
  page,
}: {
  q: string
  topic: string
  format: string
  page: number
}) {
  const p = await getPayload({ config })
  const values = [q.slice(0, 200), topic, format, (page - 1) * 12]
  // Only committed, currently published rows are read. Draft version tables are never searched.
  const result = await p.db.pool.query<SearchEntry & { total: string }>(
    `
    WITH entries AS (
      SELECT title,excerpt,format::text AS format,COALESCE(primary_topic_slug,'') AS topic,
        '/resources/' || CASE WHEN format='Guide' THEN 'guides' ELSE 'blog' END || '/' || slug AS href,
        to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,'')) AS terms
      FROM posts WHERE _status='published'
      UNION ALL SELECT title,excerpt,'Projects','', '/projects/' || slug,
        to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,'')) FROM projects WHERE _status='published'
      UNION ALL SELECT title,excerpt,'Solutions','', '/solutions/' || slug,
        to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,'')) FROM solutions WHERE _status='published'
      UNION ALL SELECT title,excerpt,'Tools','', '/resources/tools/' || slug,
        to_tsvector('english',coalesce(title,'') || ' ' || coalesce(excerpt,'')) FROM tools
        WHERE _status='published' AND public_release_approved=true
    ), matches AS (
      SELECT *,CASE WHEN $1='' THEN 0 ELSE ts_rank(terms,websearch_to_tsquery('english',$1)) END AS rank
      FROM entries WHERE ($1='' OR terms @@ websearch_to_tsquery('english',$1))
        AND ($2='' OR topic=$2) AND ($3='' OR format=$3)
    )
    SELECT title,excerpt,format,topic,href,(SELECT count(*) FROM matches) AS total FROM
      (SELECT * FROM matches ORDER BY rank DESC,title,href LIMIT 12 OFFSET $4) AS page
    RIGHT JOIN (SELECT count(*) AS total_matches FROM matches) AS counts ON true
    ORDER BY rank DESC,title,href
  `,
    values,
  )
  return {
    entries: result.rows.filter((row) => row.href),
    total: Number(result.rows[0]?.total || 0),
  }
}
