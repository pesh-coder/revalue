import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { PageIntro, SectionHeading } from '@/components/site/editorial'
import { ArticleCard, EmptyState, Pagination, editorialLink } from '@/components/site/content-ui'
import { getCatalog, first, pageNumber } from '@/lib/content'
import { searchResources } from '@/lib/search'
import { buttonVariants } from '@/components/ui/button'
export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Practical knowledge, tools and ideas for better waste management and resource recovery.',
}
export default async function Resources({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = first(params.q).trim().slice(0, 200)
  const topic = first(params.topic)
  const format = first(params.format)
  const page = pageNumber(first(params.page))
  const catalog = await getCatalog()
  const isSearching = Boolean(q || topic || format)
  const results = isSearching
    ? await searchResources({ q, topic, format, page })
    : { entries: [], total: 0 }
  const shown = results.entries
  const pageHref = (n: number) => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (topic) p.set('topic', topic)
    if (format) p.set('format', format)
    if (n > 1) p.set('page', String(n))
    return `/resources?${p}`
  }
  const copy = indexCopy(catalog, 'resources')
  return (
    <main id="main">
      <PageIntro label="Knowledge & resources" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        <form
          action="/resources"
          className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]"
        >
          <div>
            <label htmlFor="resource-search" className="mb-2 block font-semibold">
              Search resources
            </label>
            <div className="relative">
              <MagnifyingGlass
                size={20}
                aria-hidden="true"
                className="absolute top-3.5 left-3 text-muted"
              />
              <input
                id="resource-search"
                name="q"
                defaultValue={q}
                maxLength={200}
                placeholder="Search articles, guides and tools"
                className="min-h-12 w-full rounded-control border border-input-border py-3 pr-3 pl-10 text-body-md"
              />
            </div>
          </div>
          <div>
            <label htmlFor="format" className="mb-2 block font-semibold">
              Format
            </label>
            <select
              id="format"
              name="format"
              defaultValue={format}
              className="min-h-12 w-full rounded-control border border-input-border px-3"
            >
              {['', 'Blog', 'Guide', 'Tools', 'Projects', 'Solutions'].map((f) => (
                <option value={f} key={f}>
                  {f || 'All formats'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="topic" className="mb-2 block font-semibold">
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              defaultValue={topic}
              className="min-h-12 w-full rounded-control border border-input-border px-3"
            >
              <option value="">All topics</option>
              {catalog.topics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <button className={buttonVariants()} type="submit">
            Search
          </button>
        </form>
        {isSearching ? (
          <section className="mt-8" aria-labelledby="results-heading">
            <SectionHeading id="results-heading">
              {q ? `Results for "${q}"` : 'Filtered resources'}
            </SectionHeading>
            {shown.length ? (
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((e) => (
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
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
            <section aria-label="Featured reading">
              {catalog.articles[0] ? (
                <ArticleCard article={catalog.articles[0]} featured />
              ) : (
                <EmptyState title="New resources will appear here when they are published." />
              )}
            </section>
            <aside className="flex flex-col gap-6">
              <section>
                <h2 className="mb-2 font-serif text-headline-md text-deep">Explore by format</h2>
                {[
                  ['Blog', '/resources/blog'],
                  ['Guides', '/resources/guides'],
                  ['Tools and templates', '/resources/tools'],
                  ['Projects', '/projects'],
                ].map(([label, href]) => (
                  <Link key={href} className={`${editorialLink} flex`} href={href}>
                    {label}
                  </Link>
                ))}
              </section>
              <section>
                <h2 className="mb-2 font-serif text-headline-md text-deep">Browse by topic</h2>
                {catalog.topics.map((t) => (
                  <Link
                    className={`${editorialLink} flex`}
                    key={t.slug}
                    href={`/resources/${t.slug}`}
                  >
                    {t.title}
                  </Link>
                ))}
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
