import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/site/editorial'
import { getCatalog } from '@/lib/content'
import { editorialLink, EmptyState } from '@/components/site/content-ui'
export const metadata: Metadata = { title: 'Tools and templates' }
export default async function Tools() {
  const c = await getCatalog()
  const { tools } = c
  const copy = indexCopy(c, 'resources-tools')
  return (
    <main id="main">
      <PageIntro label="Resources" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        {tools.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((t) => (
              <article key={t.slug} className="max-w-prose">
                <p className="kicker text-forest">{t.format}</p>
                <h2 className="mt-2 font-serif text-headline-md text-deep">
                  <Link href={`/resources/tools/${t.slug}`}>{t.title}</Link>
                </h2>
                <p className="mt-3">{t.excerpt}</p>
                <Link href={`/resources/tools/${t.slug}`} className={editorialLink}>
                  View the toolkit
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Tools will appear here once cleared for public release." />
        )}
      </div>
    </main>
  )
}
