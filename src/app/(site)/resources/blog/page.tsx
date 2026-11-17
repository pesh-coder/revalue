import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCatalog, slugify } from '@/lib/content'
import { QueryFilterLinks, QueryList } from '@/components/site/query-list'
import { PageIntro } from '@/components/site/editorial'
import {
  ArticleCard,
  EmptyState,
  ContactCallout,
  editorialLink,
} from '@/components/site/content-ui'
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explanations, field lessons and practical advice.',
}
// Static page: the ?topic= filter and ?page= paging are applied in the browser by QueryList.
export default async function Blog() {
  const c = await getCatalog()
  const { articles, topics } = c
  const posts = articles.filter((a) => a.format === 'Blog')
  const copy = indexCopy(c, 'resources-blog')
  return (
    <main id="main">
      <PageIntro label="Resources" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        <QueryFilterLinks
          basePath="/resources/blog"
          param="topic"
          label="Filter articles by topic"
          options={[
            { label: 'All topics', value: '' },
            ...topics.map((t) => ({ label: t.title, value: t.slug })),
            { label: 'Segregation', value: slugify('waste-segregation') },
            { label: 'Resource recovery', value: 'resource-recovery' },
          ]}
        />
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          <section aria-label="Blog articles">
            <QueryList
              basePath="/resources/blog"
              param="topic"
              pageSize={12}
              className="grid gap-8"
              empty={
                <EmptyState
                  title="No articles on this topic yet."
                  href="/resources/blog"
                  label="See all articles"
                />
              }
              items={posts.map((article) => ({
                key: article.slug,
                value: article.topicSlug,
                node: <ArticleCard article={article} featured />,
              }))}
            />
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
