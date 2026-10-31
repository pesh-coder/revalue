import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCatalog } from '@/lib/content'
import { PageIntro } from '@/components/site/editorial'
import {
  Breadcrumbs,
  ArticleCard,
  EmptyState,
  ContactCallout,
  editorialLink,
} from '@/components/site/content-ui'
type Props = { params: Promise<{ topic: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params
  const c = await getCatalog()
  const t = c.topics.find((t) => t.slug === topic)
  return { title: t?.title || 'Topic not found', description: t?.introduction }
}
export default async function Topic({ params }: Props) {
  const { topic } = await params
  const c = await getCatalog()
  const t = c.topics.find((t) => t.slug === topic)
  if (!t) notFound()
  const articles = c.articles.filter((a) => a.topicSlug === topic)
  return (
    <main id="main">
      <Breadcrumbs items={[{ label: 'Resources', href: '/resources' }, { label: t.title }]} />
      <PageIntro label="Topic guide" title={t.title}>
        {t.introduction}
      </PageIntro>
      <div className="site-container grid items-start gap-8 pb-10 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
        <section aria-label="Topic articles">
          {articles[0] && <p className="kicker mb-4 text-forest">Start here</p>}
          {articles.length ? (
            <div className="grid gap-8">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} featured />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No articles on this topic yet."
              href="/resources/blog"
              label="See all articles"
            />
          )}
        </section>
        <aside className="flex flex-col gap-6">
          <section>
            <h2 className="font-serif text-headline-md text-deep">Tools and resources</h2>
            {c.tools.map((tool) => (
              <Link
                className={`${editorialLink} flex`}
                href={`/resources/tools/${tool.slug}`}
                key={tool.slug}
              >
                {tool.title}
              </Link>
            ))}
          </section>
          {c.topics.some((other) => other.slug !== topic) && (
            <section>
              <h2 className="font-serif text-headline-md text-deep">Related topics</h2>
              {c.topics
                .filter((other) => other.slug !== topic)
                .map((other) => (
                  <Link
                    className={editorialLink}
                    key={other.slug}
                    href={`/resources/${other.slug}`}
                  >
                    {other.title}
                  </Link>
                ))}
            </section>
          )}
          <ContactCallout />
        </aside>
      </div>
    </main>
  )
}
