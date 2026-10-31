import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalog, dateLabel } from '@/lib/content'
import { Photo } from './photo'
import { BodyContent, Breadcrumbs, ContactCallout, editorialLink } from './content-ui'
import { ShareArticle } from './share-article'
import type { Article } from '@/lib/content-types'
export async function ArticlePage({
  slug,
  format = 'Blog',
  articleOverride,
}: {
  slug: string
  format?: 'Blog' | 'Guide'
  articleOverride?: Article
}) {
  const catalog = await getCatalog()
  const article =
    articleOverride || catalog.articles.find((a) => a.slug === slug && a.format === format)
  if (!article) notFound()
  const related = catalog.articles.filter(
    (a) => a.slug !== slug && a.topicSlug === article.topicSlug,
  )
  return (
    <main id="main">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: format, href: format === 'Blog' ? '/resources/blog' : '/resources/guides' },
          { label: article.title },
        ]}
      />
      <article className="site-container pb-10">
        <header className="max-w-4xl pt-3 pb-6">
          <Link
            href={`/resources/${article.topicSlug}`}
            className="kicker inline-flex min-h-11 items-center text-forest"
          >
            {article.topic}
          </Link>
          <h1 className="max-w-[24ch] font-serif text-display-xl text-deep">{article.title}</h1>
          <p className="mt-4 max-w-prose text-body-lg text-muted">{article.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div>
              <p className="font-semibold text-deep">
                By{' '}
                <Link href="/about#team" className="text-forest underline underline-offset-4">
                  {article.author}
                </Link>
              </p>
              <p className="text-body-sm text-muted">
                Published{' '}
                <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>
                {article.reviewedAt && (
                  <>
                    {' '}
                    | Reviewed{' '}
                    <time dateTime={article.reviewedAt}>{dateLabel(article.reviewedAt)}</time>
                  </>
                )}
              </p>
            </div>
            <ShareArticle />
          </div>
        </header>
        {article.image && (
          <figure className="mb-8">
            <Photo
              unoptimized={Boolean(articleOverride)}
              src={article.image}
              alt={article.imageAlt || article.title}
              sizes="(min-width:1200px) 1152px, 100vw"
              className="aspect-16/7 rounded-none max-md:aspect-3/2"
              priority
            />
            <figcaption className="mt-2 text-body-sm text-muted">{article.imageCaption}</figcaption>
          </figure>
        )}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,680px)_minmax(240px,1fr)] lg:gap-12">
          <div>
            <BodyContent body={article.body} />
            <div className="mt-8">
              <p className="kicker text-muted">Explore this topic</p>
              <Link className={editorialLink} href={`/resources/${article.topicSlug}`}>
                {article.topic}
              </Link>
            </div>
          </div>
          <aside className="flex flex-col gap-6">
            <ContactCallout title="Want to know what this looks like at your site?" />
            {related.length > 0 && (
              <section>
                <h2 className="font-serif text-headline-md text-deep">Related articles</h2>
                {related.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/resources/${a.format === 'Blog' ? 'blog' : 'guides'}/${a.slug}`}
                    className={`${editorialLink} mt-2`}
                  >
                    {a.title}
                  </Link>
                ))}
              </section>
            )}
            <section>
              <h2 className="font-serif text-headline-md text-deep">Put it into practice</h2>
              <Link href="/resources/tools/waste-audit-toolkit" className={editorialLink}>
                Waste audit toolkit
              </Link>
              <Link href="/solutions/waste-discovery-review" className={editorialLink}>
                Waste Discovery Review
              </Link>
            </section>
          </aside>
        </div>
      </article>
    </main>
  )
}
