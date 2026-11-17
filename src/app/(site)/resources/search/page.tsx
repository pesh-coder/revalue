import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro, SectionHeading } from '@/components/site/editorial'
import { EmptyState, Pagination, editorialLink } from '@/components/site/content-ui'
import { ResourceSearchForm } from '@/components/site/resource-search'
import { getCatalog, first, pageNumber } from '@/lib/content'
import { searchResources } from '@/lib/search'
export const metadata: Metadata = {
  title: 'Search resources',
  robots: { index: false, follow: true },
}
// The only Resources page rendered per request: each search runs its own query.
export default async function ResourceSearch({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = first(params.q).trim().slice(0, 200)
  const topic = first(params.topic)
  const format = first(params.format)
  const page = pageNumber(first(params.page))
  const [catalog, results] = await Promise.all([
    getCatalog(),
    q || topic || format
      ? searchResources({ q, topic, format, page })
      : Promise.resolve({ entries: [], total: 0 }),
  ])
  const pageHref = (n: number) => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (topic) p.set('topic', topic)
    if (format) p.set('format', format)
    if (n > 1) p.set('page', String(n))
    return `/resources/search?${p}`
  }
  return (
    <main id="main">
      <PageIntro label="Knowledge & resources" title="Search resources" />
      <div className="site-container pb-10">
        <ResourceSearchForm topics={catalog.topics} q={q} topic={topic} format={format} />
        <section className="mt-8" aria-labelledby="results-heading">
          <SectionHeading id="results-heading">
            {q ? `Results for "${q}"` : 'Filtered resources'}
          </SectionHeading>
          {results.entries.length ? (
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              {results.entries.map((e) => (
                <article key={e.href}>
                  <p className="kicker text-forest">{e.format}</p>
                  <h2 className="mt-2 font-serif text-headline-md text-deep">
                    <Link href={e.href} className="hover:underline">
                      {e.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-muted">{e.excerpt}</p>
                  <Link className={editorialLink} href={e.href}>
                    Read more
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nothing found for this search. Try fewer words, or browse by topic."
              href="/resources"
              label="Browse all resources"
            />
          )}
          <Pagination current={page} total={Math.ceil(results.total / 12)} href={pageHref} />
        </section>
      </div>
    </main>
  )
}
