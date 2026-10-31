import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalog } from '@/lib/content'
import { Photo } from '@/components/site/photo'
import { Breadcrumbs, ContactCallout, editorialLink } from '@/components/site/content-ui'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { projects } = await getCatalog()
  const p = projects.find((p) => p.slug === slug)
  return { title: p?.title || 'Project not found', description: p?.excerpt }
}
export default async function Project({ params }: Props) {
  const { slug } = await params
  const c = await getCatalog()
  const p = c.projects.find((p) => p.slug === slug)
  if (!p) notFound()
  return (
    <main id="main">
      <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: p.title }]} />
      <div className="site-container grid items-start gap-8 pt-4 pb-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)] lg:gap-12">
        <article>
          <p className="kicker text-forest">Research & development</p>
          <h1 className="mt-3 font-serif text-headline-lg text-deep">{p.title}</h1>
          <p className="mt-3 text-body-lg text-muted">{p.excerpt}</p>
          <p className="mt-4 text-body-sm text-muted">
            Project stage: <span className="font-semibold text-deep">{p.status}</span>
          </p>
          <div className="mt-7 flex flex-col gap-6">
            {p.sections
              .filter((s) => s.title !== 'Project overview')
              .map((s) => (
                <section key={s.title}>
                  <h2 className="font-serif text-headline-md text-deep">{s.title}</h2>
                  <p className="mt-2 leading-relaxed">{s.text}</p>
                </section>
              ))}
            <section>
              <h2 className="font-serif text-headline-md text-deep">Related resources</h2>
              <Link
                className={`${editorialLink} flex`}
                href="/resources/blog/what-is-a-waste-audit"
              >
                What is a waste audit?
              </Link>
              <Link className={editorialLink} href="/resources/tools/waste-audit-toolkit">
                Waste audit toolkit
              </Link>
            </section>
          </div>
        </article>
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
          {p.image && (
            <figure>
              <Photo
                src={p.image}
                alt="The Revalue smart segregation prototype, showing its cardboard housing, screen, sensors, exposed wiring and collection compartments."
                className="aspect-3/4 rounded-none"
                sizes="(min-width:1200px) 440px, (min-width:1024px) 40vw, 100vw"
                priority
              />
              <figcaption className="mt-2 text-body-sm text-muted">
                Smart segregation prototype, Revalue.
              </figcaption>
            </figure>
          )}
          <ContactCallout
            title="Want to host a test or challenge our method?"
            label="Get in touch"
          />
        </aside>
      </div>
    </main>
  )
}
