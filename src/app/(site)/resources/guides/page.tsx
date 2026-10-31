import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import { getCatalog } from '@/lib/content'
import { PageIntro } from '@/components/site/editorial'
import { ArticleCard, EmptyState } from '@/components/site/content-ui'
export const metadata: Metadata = { title: 'Guides' }
export default async function Guides() {
  const c = await getCatalog()
  const { articles } = c
  const guides = articles.filter((a) => a.format === 'Guide')
  const copy = indexCopy(c, 'resources-guides')
  return (
    <main id="main">
      <PageIntro label="Resources" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        {guides.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {guides.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Guides will appear here when they are ready."
            href="/resources/blog"
            label="Read the blog"
          />
        )}
      </div>
    </main>
  )
}
