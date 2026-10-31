import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalog, dateLabel } from '@/lib/content'
import { PageIntro } from '@/components/site/editorial'
import { Breadcrumbs, editorialLink } from '@/components/site/content-ui'
import { buttonVariants } from '@/components/ui/button'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getCatalog()
  const t = c.tools.find((t) => t.slug === slug)
  return { title: t?.title || 'Tool not found', description: t?.excerpt }
}
export default async function Tool({ params }: Props) {
  const { slug } = await params
  const { tools } = await getCatalog()
  const t = tools.find((t) => t.slug === slug)
  if (!t) notFound()
  return (
    <main id="main">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: 'Tools and templates', href: '/resources/tools' },
          { label: t.title },
        ]}
      />
      <PageIntro label="Tools and templates" title={t.title}>
        {t.excerpt}
      </PageIntro>
      <div className="site-container grid items-start gap-8 pb-10 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
        <section>
          <h2 className="font-serif text-headline-md text-deep">How to use it</h2>
          <ol className="mt-5 flex flex-col gap-4">
            {t.instructions.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-serif text-headline-md text-forest" aria-hidden="true">
                  {i + 1}.
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-prose text-body-sm text-muted">
            Follow your site&apos;s safety rules. Do not handle clinical or hazardous waste without
            the right controls.
          </p>
          <Link className={`${editorialLink} mt-3`} href="/resources/blog/what-is-a-waste-audit">
            Read: What is a waste audit?
          </Link>
        </section>
        <aside className="bg-border/25 p-6">
          <h2 className="font-serif text-headline-md text-deep">Toolkit details</h2>
          <dl className="mt-4 flex flex-col gap-4">
            <div>
              <dt className="text-body-sm text-muted">Format</dt>
              <dd>{t.format}</dd>
            </div>
            <div>
              <dt className="text-body-sm text-muted">For</dt>
              <dd>{t.audience}</dd>
            </div>
            {t.versionDate && (
              <div>
                <dt className="text-body-sm text-muted">Version</dt>
                <dd>{dateLabel(t.versionDate)}</dd>
              </div>
            )}
          </dl>
          {t.approved && t.fileUrl ? (
            <a href={t.fileUrl} download className={buttonVariants({ className: 'mt-6' })}>
              Download the toolkit
            </a>
          ) : (
            <>
              <p className="mt-6">
                This file is not available right now. Contact us and we will send it.
              </p>
              <Link href="/contact" className={`${editorialLink} mt-2`}>
                Ask about the toolkit
              </Link>
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
