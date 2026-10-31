import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCatalog, first, pageNumber, slugify } from '@/lib/content'
import { PageIntro } from '@/components/site/editorial'
import {
  ArticleCard,
  FilterLinks,
  Pagination,
  EmptyState,
  ContactCallout,
  editorialLink,
} from '@/components/site/content-ui'
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explanations, field lessons and practical advice.',
}
export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const topic = first(params.topic)
  const current = pageNumber(first(params.page))
  const c = await getCatalog()
  const { articles, topics } = c
  const posts = articles.filter((a) => a.format === 'Blog' && (!topic || a.topicSlug === topic))
  const total = Math.ceil(posts.length / 12)
  const shown = posts.slice((current - 1) * 12, current * 12)
  const href = (p: number, t = topic) => {
    const q = new URLSearchParams()
    if (t) q.set('topic', t)
    if (p > 1) q.set('page', String(p))
    return `/resources/blog${q.size ? '?' + q : ''}`
  }
  const copy = indexCopy(c, 'resources-blog')
  return (
    <main id="main">
      <PageIntro label="Resources" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        <FilterLinks
          label="Filter articles by topic"
          selected={topic}
          options={[
            { label: 'All topics', value: '' },
            ...topics.map((t) => ({ label: t.title, value: t.slug })),
            { label: 'Segregation', value: slugify('waste-segregation') },
            { label: 'Resource recovery', value: 'resource-recovery' },
          ]}
          href={(value) => href(1, value)}
        />
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          <section aria-label="Blog articles">
            {shown.length ? (
              <div className="grid gap-8">
                {shown.map((article) => (
                  <ArticleCard key={article.slug} article={article} featured />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No articles on this topic yet."
                href="/resources/blog"
                label="See all articles"
              />
            )}
            <Pagination current={current} total={total} href={href} />
          </section>
          <aside className="flex flex-col gap-6">
            <div>
              <h2 className="font-serif text-headline-md text-deep">Explore by topic</h2>
              {topics.map((t) => (
                <Link
                  className={`${editorialLink} block py-3`}
                  key={t.slug}
                  href={`/resources/${t.slug}`}
                >
                  {t.title}
                </Link>
              ))}
              <Link className={editorialLink} href="/resources">
                All resources
              </Link>
            </div>
            <ContactCallout title="Want to know what this looks like at your site?" />
          </aside>
        </div>
      </div>
    </main>
  )
}
