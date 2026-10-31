import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/site/editorial'
import { getCatalog } from '@/lib/content'
import { Photo } from '@/components/site/photo'
import { editorialLink, ContactCallout } from '@/components/site/content-ui'
export const metadata: Metadata = { title: 'Solutions' }
export default async function Solutions() {
  const c = await getCatalog()
  const copy = indexCopy(c, 'solutions-index')
  return (
    <main id="main">
      <PageIntro label="Our focus" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
          <section className="grid gap-x-7 gap-y-6 sm:grid-cols-2" aria-label="Solutions">
            {c.solutions.map((s) => (
              <article key={s.slug}>
                <h2 className="font-serif text-headline-md text-deep">
                  <Link href={`/solutions/${s.slug}`} className="hover:underline">
                    {s.title}
                  </Link>
                </h2>
                <p className="mt-2">{s.excerpt}</p>
                <p className="mt-3 text-body-sm text-muted">Current stage: {s.availability}</p>
                <Link className={editorialLink} href={`/solutions/${s.slug}`}>
                  Explore {s.title.toLowerCase()}
                </Link>
              </article>
            ))}
          </section>
          <aside className="flex flex-col gap-6">
            <figure>
              <Photo
                src="/images/stock-sorted-bottles.jpg"
                alt="Sorted plastic bottles ready for material recovery."
                className="aspect-4/3 rounded-none"
                sizes="(min-width:1024px) 40vw, 100vw"
              />
              <figcaption className="mt-2 text-body-sm text-muted">
                Illustrative photograph.
              </figcaption>
            </figure>
            <ContactCallout />
          </aside>
        </div>
      </div>
    </main>
  )
}
