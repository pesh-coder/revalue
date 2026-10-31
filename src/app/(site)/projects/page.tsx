import { indexCopy } from '@/lib/index-copy'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/site/editorial'
import { Photo } from '@/components/site/photo'
import { EmptyState, FilterLinks, editorialLink } from '@/components/site/content-ui'
import { getCatalog, first } from '@/lib/content'
import { projectStatuses } from '@/lib/content-types'
export const metadata: Metadata = {
  title: 'Projects',
  description: 'Work and lessons, labelled by stage.',
}
export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const status = first((await searchParams).status)
  const c = await getCatalog()
  const projects = c.projects.filter((p) => !status || p.status === status)
  const copy = indexCopy(c, 'projects-index')
  return (
    <main id="main">
      <PageIntro label="Our work" title={copy.title}>
        {copy.introduction}
      </PageIntro>
      <div className="site-container pb-10">
        <FilterLinks
          label="Filter projects by stage"
          selected={status}
          options={[
            { label: 'All stages', value: '' },
            ...projectStatuses.map((s) => ({ label: s, value: s })),
          ]}
          href={(s) => (s ? `/projects?status=${encodeURIComponent(s)}` : '/projects')}
        />
        <div className="mt-6">
          {projects.length ? (
            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((p) => (
                <article
                  key={p.slug}
                  className="grid items-start gap-5 sm:grid-cols-[160px_minmax(0,1fr)]"
                >
                  {p.image && (
                    <Link href={`/projects/${p.slug}`} aria-hidden="true" tabIndex={-1}>
                      <Photo
                        src={p.image}
                        alt=""
                        className="aspect-3/4 rounded-none"
                        sizes="(min-width:640px) 160px, 100vw"
                      />
                    </Link>
                  )}
                  <div>
                    <p className="kicker text-forest">Project stage: {p.status}</p>
                    <h2 className="mt-2 font-serif text-headline-md text-deep">
                      <Link href={`/projects/${p.slug}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-3">{p.excerpt}</p>
                    <Link href={`/projects/${p.slug}`} className={editorialLink}>
                      Read the project
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects with this status yet."
              href="/projects"
              label="See all projects"
            />
          )}
        </div>
      </div>
    </main>
  )
}
