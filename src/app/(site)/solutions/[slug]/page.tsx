import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalog } from '@/lib/content'
import { Breadcrumbs, ContactCallout, editorialLink } from '@/components/site/content-ui'
import { Photo } from '@/components/site/photo'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { solutions } = await getCatalog()
  const s = solutions.find((s) => s.slug === slug)
  return { title: s?.title || 'Solution not found', description: s?.excerpt }
}
export default async function Solution({ params }: Props) {
  const { slug } = await params
  const c = await getCatalog()
  const s = c.solutions.find((s) => s.slug === slug)
  if (!s) notFound()
  return (
    <main id="main">
      <Breadcrumbs items={[{ label: 'Solutions', href: '/solutions' }, { label: s.title }]} />
      <div className="site-container grid items-start gap-8 pt-4 pb-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)] lg:gap-12">
        <article>
          <p className="kicker text-forest">Solutions</p>
          <h1 className="mt-3 font-serif text-headline-lg text-deep">{s.title}</h1>
          <p className="mt-4 text-body-lg text-muted">{s.excerpt}</p>
          <p className="mt-4 text-body-sm text-muted">Current stage: {s.availability}</p>
          <section className="mt-6">
            <h2 className="font-serif text-headline-md text-deep">Who it is for</h2>
            <p className="mt-2">{s.audience}</p>
          </section>
          <div className="mt-6 flex flex-col gap-6">
            {s.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-headline-md text-deep">{section.title}</h2>
                <p className="mt-2 leading-relaxed">{section.text}</p>
              </section>
            ))}
          </div>
          <Link className={`${editorialLink} mt-4`} href="/pricing">
            How pricing works
          </Link>
        </article>
        <aside className="flex flex-col gap-6">
          <figure>
            <Photo
              src={
                slug === 'technology-and-monitoring'
                  ? '/images/prototype-bin.jpg'
                  : '/images/stock-bins-three.jpg'
              }
              alt={
                slug === 'technology-and-monitoring'
                  ? 'The Revalue sorting prototype.'
                  : 'Bins arranged for separating waste materials.'
              }
              className="aspect-4/3 rounded-none"
              sizes="(min-width:1024px) 40vw, 100vw"
              priority
            />
            <figcaption className="mt-2 text-body-sm text-muted">
              {slug === 'technology-and-monitoring'
                ? 'Smart segregation prototype, Revalue.'
                : 'Illustrative photograph.'}
            </figcaption>
          </figure>
          <ContactCallout
            title={
              s.availability === 'Exploring'
                ? 'Tell us if this interests you'
                : 'Start with a conversation'
            }
            label={
              s.availability === 'Exploring'
                ? 'Tell us if this interests you'
                : 'Ask about a review'
            }
            type="Waste discovery or assessment"
          />
        </aside>
      </div>
    </main>
  )
}
