import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalog, first } from '@/lib/content'
import { PageIntro } from './editorial'
import { BodyContent, ContactCallout, editorialLink } from './content-ui'
import { ContactForm } from './contact-form'
import { Photo } from './photo'
import { getSiteSettings } from '@/lib/site-settings'
import { buttonVariants } from '@/components/ui/button'

export async function CompanyPage({
  slug,
  searchParams,
}: {
  slug: string
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const [c, settings] = await Promise.all([getCatalog(), getSiteSettings()])
  const page = c.pages.find((p) => p.slug === slug)
  if (!page) notFound()
  if (slug === 'terms' || slug === 'privacy')
    return (
      <main id="main">
        <PageIntro label="Revalue" title={page.title} />
        <div className="site-container pb-10">
          <div className="max-w-prose">
            <p className="mb-5 text-body-sm text-muted">
              Draft policy for review before public launch.
            </p>
            {page.body && <BodyContent body={page.body} />}
            <Link href="/contact" className={editorialLink}>
              Contact Revalue
            </Link>
          </div>
        </div>
      </main>
    )
  if (slug === 'contact') {
    const params = searchParams ? await searchParams : {}
    return (
      <main id="main">
        <PageIntro label="Contact Revalue" title={page.title}>
          {page.introduction}
        </PageIntro>
        <div className="site-container grid items-start gap-8 pb-10 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] lg:gap-12">
          <ContactForm
            initialType={first(params.type)}
            enabled={process.env.ENQUIRIES_ENABLED === 'true' && Boolean(process.env.DATABASE_URL)}
          />
          <aside>
            {page.sections?.map((section) => (
              <section key={section.title} className="mb-5">
                <h2 className="font-serif text-headline-md text-deep">{section.title}</h2>
                <p className="mt-3">{section.text}</p>
              </section>
            ))}
            {settings.contactEmail && (
              <a
                className={`${editorialLink} mt-4 break-all`}
                href={`mailto:${settings.contactEmail}`}
              >
                {settings.contactEmail}
              </a>
            )}
            <Link className={`${editorialLink} mt-4 flex`} href="/privacy">
              How we handle your information
            </Link>
          </aside>
        </div>
      </main>
    )
  }
  if (slug === 'pricing')
    return (
      <main id="main">
        <PageIntro label="Working together" title={page.title}>
          {page.introduction}
        </PageIntro>
        <div className="site-container grid items-start gap-8 pb-10 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          {page.body ? (
            <BodyContent body={page.body} />
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <caption className="sr-only">Offerings and the factors that affect cost</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="pb-4 pr-6 font-semibold">
                        Offering
                      </th>
                      <th scope="col" className="pb-4 font-semibold">
                        What affects the cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.pricingRows?.map(({ offering: name, factors }) => (
                      <tr key={name}>
                        <th scope="row" className="py-4 pr-5 align-top font-semibold text-deep">
                          {name}
                        </th>
                        <td className="py-4 align-top">{factors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link className={`${editorialLink} mt-3`} href="/solutions">
                View current solution stages
              </Link>
            </div>
          )}
          <ContactCallout
            title="Discuss what your site needs"
            label="Ask for a quote"
            type="Waste discovery or assessment"
          />
        </div>
      </main>
    )
  const isAbout = slug === 'about'
  const image =
    page.image ||
    (process.env.REVALUE_CONTENT_MODE === 'review'
      ? isAbout
        ? '/images/stock-open-water.jpg'
        : '/images/stock-cardboard-recovery.jpg'
      : '')
  return (
    <main id="main">
      <div className="site-container grid items-center gap-7 pt-8 pb-8 lg:grid-cols-2">
        <header>
          <p className="kicker text-forest">{isAbout ? 'About Revalue' : 'Partnerships'}</p>
          <h1 className="mt-3 font-serif text-headline-lg text-deep">{page.title}</h1>
          <p className="mt-4 max-w-prose text-body-lg text-muted">{page.introduction}</p>
          <Link
            className={buttonVariants({ className: 'mt-5' })}
            href={isAbout ? '/projects' : '/contact?type=Partnership%20or%20recovery'}
          >
            {isAbout ? 'Explore our work' : 'Become a partner'}
          </Link>
        </header>
        {image && (
          <figure>
            <Photo
              src={image}
              alt={
                page.imageAlt ||
                (isAbout
                  ? 'Calm open water under a blue sky, a far shoreline on the horizon.'
                  : 'Cardboard materials collected for recovery.')
              }
              className="aspect-16/10 rounded-none"
              position={isAbout ? 'object-[center_75%]' : undefined}
              sizes="(min-width:1024px) 48vw, 100vw"
              priority
            />
            {(page.imageCaption || process.env.REVALUE_CONTENT_MODE === 'review') && (
              <figcaption className="mt-2 text-body-sm text-muted">
                {page.imageCaption || 'Illustrative photograph.'}
              </figcaption>
            )}
          </figure>
        )}
      </div>
      <div className="site-container pb-10">
        {page.body && (
          <div className="max-w-prose">
            <BodyContent body={page.body} />
          </div>
        )}
        {isAbout ? (
          <>
            <section
              aria-labelledby="beliefs-heading"
              className="bg-deep px-6 py-7 text-on-forest sm:px-8 sm:py-8"
            >
              <h2 id="beliefs-heading" className="font-serif text-headline-lg">
                {page.principlesHeading}
              </h2>
              <ol className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
                {page.principles?.map(({ text: belief }, index) => (
                  <li key={belief} className="flex items-baseline gap-4">
                    <span aria-hidden="true" className="w-5 shrink-0 font-serif text-headline-md">
                      {index + 1}
                    </span>
                    <p className="font-serif text-headline-md">{belief}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section id="team" aria-labelledby="team-heading" className="mt-8 sm:mt-10">
              <h2 id="team-heading" className="font-serif text-headline-lg text-deep">
                {page.teamHeading}
              </h2>
              <p className="mt-3 max-w-prose text-muted">{page.teamIntroduction}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {page.people?.map((person) => (
                  <li key={person.name} className="flex items-center gap-4 bg-border/20 p-5 sm:p-6">
                    <span
                      aria-hidden="true"
                      className="flex size-14 shrink-0 items-center justify-center rounded-full bg-deep font-serif text-headline-md text-on-forest"
                    >
                      {person.initials}
                    </span>
                    <div>
                      <h3 className="font-serif text-headline-md text-deep">{person.name}</h3>
                      <p className="mt-1 text-muted">{person.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className="mt-8 max-w-prose">
              <h2 className="font-serif text-headline-md text-deep">{page.sections?.[0]?.title}</h2>
              <p className="mt-3">{page.sections?.[0]?.text}</p>
              <Link className={editorialLink} href="/projects/smart-segregation-prototype">
                Read the prototype story
              </Link>
            </section>
          </>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <section>
              <h2 className="font-serif text-headline-md text-deep">{page.sections?.[0]?.title}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {page.audiences?.map(({ text: p }) => (
                  <li key={p} className="font-semibold text-deep">
                    {p}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-serif text-headline-md text-deep">{page.sections?.[1]?.title}</h2>
              <p className="mt-3">{page.sections?.[1]?.text}</p>

              <Link className={editorialLink} href="/contact?type=Partnership%20or%20recovery">
                Become a partner
              </Link>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
