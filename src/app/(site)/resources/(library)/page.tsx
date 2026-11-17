import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/site/editorial'
import { ArticleCard, EmptyState, editorialLink } from '@/components/site/content-ui'
import { ResourceSearchForm } from '@/components/site/resource-search'
import { getCatalog } from '@/lib/content'
export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Practical knowledge, tools and ideas for better waste management and resource recovery.',
}
// Static page. Searching goes to /resources/search, which runs a query per search.
export default async function Resources() {
  const catalog = await getCatalog()
  const copy = indexCopy(catalog, 'resources')
  return (
    <main id="main">
      <PageIntro label="Knowledge & resources" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        <ResourceSearchForm topics={catalog.topics} />
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
      </div>
    </main>
  )
}
