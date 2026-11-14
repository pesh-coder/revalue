import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import { Operations } from './operations'

const day = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { req, permissions } = initPageResult
  const { payload, user } = req
  const admin = payload.config.routes.admin
  const scope = { user, overrideAccess: false } as const
  const weekAgo = daysAgo(7)

  const [publishedPosts, draftPosts, publishedPages, recentEnquiries, drafts, enquiries] =
    await Promise.all([
      payload.count({ collection: 'posts', where: { _status: { equals: 'published' } }, ...scope }),
      payload.count({ collection: 'posts', where: { _status: { equals: 'draft' } }, ...scope }),
      payload.count({ collection: 'pages', where: { _status: { equals: 'published' } }, ...scope }),
      payload.count({
        collection: 'enquiries',
        where: { createdAt: { greater_than: weekAgo } },
        ...scope,
      }),
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'draft' } },
        sort: '-updatedAt',
        limit: 5,
        depth: 0,
        ...scope,
      }),
      payload.find({ collection: 'enquiries', sort: '-createdAt', limit: 5, depth: 0, ...scope }),
    ])

  const posts = `${admin}/collections/posts`
  const glance = [
    {
      label: 'Published posts',
      value: publishedPosts.totalDocs,
      href: `${posts}?where[_status][equals]=published`,
    },
    { label: 'Drafts', value: draftPosts.totalDocs, href: `${posts}?where[_status][equals]=draft` },
    {
      label: 'Published pages',
      value: publishedPages.totalDocs,
      href: `${admin}/collections/pages`,
    },
    {
      label: 'Enquiries this week',
      value: recentEnquiries.totalDocs,
      href: `${admin}/collections/enquiries`,
    },
  ]
  const actions = [
    { label: 'Write a new post', href: `${admin}/collections/posts/create`, primary: true },
    { label: 'Upload images', href: `${admin}/collections/media/create` },
    { label: 'Edit homepage', href: `${admin}/globals/homepage` },
    { label: 'Edit menus & footer', href: `${admin}/globals/site-settings` },
  ]
  const firstName = String(user?.name || '').split(' ')[0]

  return (
    <Gutter className="revalue-dashboard">
      <header className="revalue-welcome">
        <div>
          <h1>Welcome{firstName ? `, ${firstName}` : ''}</h1>
          <p>Manage the Revalue website from here: write posts, update pages and read enquiries.</p>
        </div>
        <a className="revalue-welcome__site" href="/" target="_blank" rel="noreferrer">
          View website ↗
        </a>
      </header>

      <nav className="revalue-actions" aria-label="Quick actions">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`revalue-action${a.primary ? ' revalue-action--primary' : ''}`}
          >
            {a.label}
          </Link>
        ))}
      </nav>

      <div className="revalue-panels">
        <section className="revalue-panel" aria-labelledby="glance-heading">
          <h2 id="glance-heading">At a glance</h2>
          <ul className="revalue-glance">
            {glance.map((g) => (
              <li key={g.label}>
                <Link href={g.href}>
                  <strong>{g.value}</strong>
                  <span>{g.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="revalue-panel" aria-labelledby="drafts-heading">
          <h2 id="drafts-heading">Recent drafts</h2>
          {drafts.docs.length ? (
            <ul className="revalue-list">
              {drafts.docs.map((d) => (
                <li key={d.id}>
                  <Link href={`${admin}/collections/posts/${d.id}`}>{d.title || 'Untitled'}</Link>
                  <span>Last edited {day(d.updatedAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="revalue-empty">No drafts. Everything you have written is published.</p>
          )}
          <Link className="revalue-more" href={posts}>
            All posts →
          </Link>
        </section>

        <section className="revalue-panel" aria-labelledby="enquiries-heading">
          <h2 id="enquiries-heading">Latest enquiries</h2>
          {enquiries.docs.length ? (
            <ul className="revalue-list">
              {enquiries.docs.map((e) => (
                <li key={e.id}>
                  <Link href={`${admin}/collections/enquiries/${e.id}`}>
                    {e.name} · {e.organisation}
                  </Link>
                  <span>
                    {e.type} · {day(e.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="revalue-empty">No enquiries yet.</p>
          )}
          <Link className="revalue-more" href={`${admin}/collections/enquiries`}>
            All enquiries →
          </Link>
        </section>

        {permissions?.collections?.['content-updates']?.read && (
          <section className="revalue-panel revalue-panel--wide">
            <Operations />
          </section>
        )}
      </div>
    </Gutter>
  )
}
