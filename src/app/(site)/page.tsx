import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { buttonVariants } from '@/components/ui/button'
import { Photo } from '@/components/site/photo'
import { getHomeContent, type HomeArticle } from '@/lib/home-content'
import { SectionHeading } from '@/components/site/editorial'

const textLink =
  'inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4 hover:text-forest-hover'
const heading = 'font-serif text-headline-feature text-deep'

function Byline({ article }: { article: HomeArticle }) {
  return (
    <p className="text-body-sm text-muted">
      By {article.author} · Published{' '}
      {new Date(`${article.publishedAt}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })}
    </p>
  )
}

export default async function Home() {
  const { articles, showFeaturedProject, copy, heroImage, featuredProject } = await getHomeContent()
  const [lead, ...supporting] = articles
  return (
    <main id="main">
      <section
        aria-labelledby="hero-heading"
        className="relative flex min-h-150 items-end overflow-hidden bg-deep text-surface"
      >
        {heroImage && (
          <Photo
            src={heroImage}
            alt=""
            sizes="100vw"
            priority
            className="absolute! inset-0 rounded-none"
            position="object-[center_60%]"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-deep/62" />
        <div className="site-container relative flex flex-col items-start gap-5 pt-30 pb-12">
          <h1 id="hero-heading" className="max-w-[12ch] font-serif text-display-xl">
            {copy.heroTitle}
          </h1>
          <p className="max-w-[36ch] text-body-lg">{copy.heroText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
            <Link href="/contact" className={buttonVariants({ variant: 'onDark' })}>
              {copy.heroAction}
            </Link>
            <Link
              href="#how"
              className="dark-focus inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              {copy.heroSecondary}
            </Link>
          </div>
        </div>
      </section>

      <div className="site-container py-6 md:py-8">
        <SectionHeading
          id="latest-heading"
          href={lead ? '/resources/blog' : undefined}
          linkLabel={copy.articlesLabel}
        >
          {lead ? copy.latestHeading : copy.emptyHeading}
        </SectionHeading>
        <section
          aria-labelledby="latest-heading"
          className="grid items-start gap-x-7 gap-y-8 md:grid-cols-2 lg:grid-cols-12"
        >
          {lead && (
            <div className="min-w-0 lg:col-span-6">
              <article>
                {lead.image && (
                  <Link href={`/resources/blog/${lead.slug}`} aria-hidden="true" tabIndex={-1}>
                    <Photo
                      src={lead.image}
                      alt=""
                      sizes="(min-width: 1200px) 552px, (min-width: 768px) 48vw, 100vw"
                      className="aspect-3/2 rounded-none"
                    />
                  </Link>
                )}
                <div className="mt-4 flex flex-col items-start gap-2">
                  <p className="kicker text-forest">{lead.topic}</p>
                  <h3 className={heading}>
                    <Link
                      href={`/resources/blog/${lead.slug}`}
                      className="hover:underline hover:underline-offset-4"
                    >
                      {lead.title}
                    </Link>
                  </h3>
                  <p className="text-body-md">{lead.excerpt}</p>
                  <Byline article={lead} />
                </div>
              </article>
              {supporting.length > 0 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {supporting.slice(0, 3).map((article) => (
                    <article key={article.slug} className="flex flex-col gap-2">
                      <p className="kicker text-forest">{article.topic}</p>
                      <h3 className="font-serif text-headline-md text-deep">
                        <Link href={`/resources/blog/${article.slug}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </h3>
                      <Byline article={article} />
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {showFeaturedProject && featuredProject && (
            <article
              aria-labelledby="project-heading"
              className={`grid min-w-0 grid-cols-[112px_minmax(0,1fr)] items-start gap-4 md:block ${lead ? 'lg:col-span-3' : 'lg:col-span-8'}`}
            >
              <Link href={`/projects/${featuredProject.slug}`} aria-hidden="true" tabIndex={-1}>
                {featuredProject.image && (
                  <Photo
                    src={featuredProject.image}
                    alt=""
                    sizes="(min-width: 1200px) 265px, (min-width: 1024px) 23vw, (min-width: 768px) 45vw, 112px"
                    className="aspect-3/4 rounded-none"
                    position="object-[center_40%]"
                  />
                )}
              </Link>
              <div className="flex flex-col items-start gap-2 md:mt-4">
                <p className="kicker text-forest">{copy.projectLabel}</p>
                <h3 id="project-heading" className="font-serif text-headline-md text-deep">
                  <Link
                    href={`/projects/${featuredProject.slug}`}
                    className="hover:underline hover:underline-offset-4"
                  >
                    {featuredProject.title}
                  </Link>
                </h3>
                <p className="hidden md:block">{featuredProject.excerpt}</p>
                <p className="text-body-sm text-muted">{copy.projectStage}</p>
                <Link
                  href={`/projects/${featuredProject.slug}`}
                  className={`${textLink} text-body-sm`}
                >
                  {copy.projectLink}
                </Link>
              </div>
            </article>
          )}

          <aside
            aria-label="Explore Revalue"
            className={`flex min-w-0 flex-col gap-6 md:col-span-2 md:grid md:grid-cols-2 ${lead && showFeaturedProject ? 'lg:col-span-3 lg:flex' : lead ? 'lg:col-span-6' : showFeaturedProject ? 'lg:col-span-4 lg:flex' : 'lg:col-span-12'}`}
          >
            <section aria-labelledby="focus-heading">
              <p className="kicker mb-2 text-forest">{copy.focusLabel}</p>
              <h2 id="focus-heading" className="mb-2 font-serif text-headline-md text-deep">
                {copy.focusTitle}
              </h2>
              <p className="text-body-sm">{copy.focusText}</p>
              <Link href="/projects" className={`${textLink} mt-1 text-body-sm`}>
                {copy.focusLink} <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </Link>
            </section>
            <section aria-labelledby="audience-heading">
              <h2 id="audience-heading" className="mb-3 font-serif text-headline-md text-deep">
                {copy.audienceHeading}
              </h2>
              <ul className="flex flex-col gap-3">
                {copy.audiences.map(({ title, description, href }) => (
                  <li key={href}>
                    <Link href={href} className="group block min-h-11">
                      <span className="block font-semibold text-deep group-hover:text-forest group-hover:underline">
                        {title}
                      </span>
                      <span className="mt-1 block text-body-sm text-muted">{description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </section>

        <div className="mt-8 grid items-start gap-6 md:mt-10 lg:grid-cols-12 lg:gap-7">
          <section id="how" aria-labelledby="how-heading" className="lg:col-span-8">
            <SectionHeading id="how-heading">{copy.howHeading}</SectionHeading>
            <ol className="grid gap-4 sm:grid-cols-3">
              {copy.steps.map(({ text: step }, index) => (
                <li key={step} className="flex gap-3">
                  <span aria-hidden="true" className="font-serif text-headline-md text-forest">
                    {index + 1}.
                  </span>
                  <p className="pt-0.5 font-semibold text-deep">{step}</p>
                </li>
              ))}
            </ol>
          </section>
          <section
            aria-labelledby="contact-heading"
            className="bg-deep p-6 text-surface lg:col-span-4"
          >
            <h2 id="contact-heading" className="font-serif text-headline-md">
              {copy.contactHeading}
            </h2>
            <Link
              href="/contact"
              className={buttonVariants({ variant: 'onDark', className: 'mt-4' })}
            >
              {copy.contactLabel}
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
