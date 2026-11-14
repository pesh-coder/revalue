import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import { pageNames, publicPath } from '@/lib/site-paths'
import { Operations } from './operations'

const day = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

type SiteRow = { name: string; detail?: string; where: string; view?: string; edit: string; action: string }

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { req, permissions } = initPageResult
  const { payload, user } = req
  const admin = payload.config.routes.admin
  const scope = { user, overrideAccess: false } as const
  const list = (slug: string) => `${admin}/collections/${slug}`

  const [publishedPosts, draftPosts, images, recentEnquiries, pages, drafts, enquiries] =
    await Promise.all([
      payload.count({ collection: 'posts', where: { _status: { equals: 'published' } }, ...scope }),
      payload.count({ collection: 'posts', where: { _status: { equals: 'draft' } }, ...scope }),
      payload.count({ collection: 'media', ...scope }),
      payload.count({
        collection: 'enquiries',
        where: { createdAt: { greater_than: daysAgo(7) } },
        ...scope,
      }),
      payload.find({
        collection: 'pages',
        limit: 50,
        depth: 0,
        draft: true,
        select: { title: true, slug: true },
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

  const pageOrder = Object.keys(pageNames)
  const pageRows: SiteRow[] = [...pages.docs]
    .sort((a, b) => pageOrder.indexOf(a.slug) - pageOrder.indexOf(b.slug))
    .map((page) => {
      const path = publicPath('pages', page)
      return {
        name: pageNames[page.slug] || page.title,
        detail: `Heading: “${page.title}”`,
        where: path,
        view: path,
        edit: `${list('pages')}/${page.id}`,
        action: 'Edit',
      }
    })

  const rows: SiteRow[] = [
    {
      name: 'Homepage',
      detail: 'Banner, featured posts and homepage text',
      where: '/',
      view: '/',
      edit: `${admin}/globals/homepage`,
      action: 'Edit',
    },
    {
      name: 'Main menu & footer',
      detail: 'Links at the top and bottom of every page, contact email',
      where: 'Every page',
      edit: `${admin}/globals/site-settings`,
      action: 'Edit',
    },
    ...pageRows,
    {
      name: 'Blog posts & guides',
      detail: 'Each post is its own page',
      where: '/resources/blog/…',
      view: '/resources/blog',
      edit: list('posts'),
      action: 'Manage',
    },
    {
      name: 'Topics',
      detail: 'Category pages that group posts',
      where: '/resources/…',
      view: '/resources',
      edit: list('topics'),
      action: 'Manage',
    },
    {
      name: 'Projects',
      where: '/projects/…',
      view: '/projects',
      edit: list('projects'),
      action: 'Manage',
    },
    {
      name: 'Solutions',
      where: '/solutions/…',
      view: '/solutions',
      edit: list('solutions'),
      action: 'Manage',
    },
    {
      name: 'Tools & downloads',
      where: '/resources/tools/…',
      view: '/resources/tools',
      edit: list('tools'),
      action: 'Manage',
    },
  ]

  const glance = [
    { label: 'Published posts', value: publishedPosts.totalDocs, href: list('posts') },
    { label: 'Draft posts', value: draftPosts.totalDocs, href: list('posts') },
    { label: 'Images', value: images.totalDocs, href: list('media') },
    { label: 'Enquiries this week', value: recentEnquiries.totalDocs, href: list('enquiries') },
  ]

  return (
    <Gutter className="revalue-dashboard">
      <h1 className="revalue-dashboard__title">Dashboard</h1>
      <p className="revalue-dashboard__intro">
        Everything you can change on the website is listed below. Choose <strong>Edit</strong> to
        change it, or <strong>View</strong> to see the live page.
      </p>

      <div className="revalue-dashboard__grid">
        <section className="revalue-box revalue-box--site" aria-labelledby="site-heading">
          <h2 id="site-heading">Your website</h2>
          <table className="revalue-site-table">
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">Where on the site</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td>
                    <Link href={row.edit} className="revalue-site-table__name">
                      {row.name}
                    </Link>
                    {row.detail && <span className="revalue-site-table__detail">{row.detail}</span>}
                  </td>
                  <td className="revalue-site-table__where">{row.where}</td>
                  <td className="revalue-site-table__actions">
                    <Link href={row.edit}>{row.action}</Link>
                    {row.view && (
                      <a href={row.view} target="_blank" rel="noreferrer">
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="revalue-dashboard__side">
          <section className="revalue-box" aria-labelledby="glance-heading">
            <h2 id="glance-heading">At a glance</h2>
            <ul className="revalue-glance">
              {glance.map((g) => (
                <li key={g.label}>
                  <Link href={g.href}>
                    <strong>{g.value}</strong> {g.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="revalue-box__actions">
              <Link href={`${list('posts')}/create`} className="revalue-button">
                Write a new post
              </Link>
              <Link href={`${list('media')}/create`}>Upload an image</Link>
            </p>
          </section>

          <section className="revalue-box" aria-labelledby="drafts-heading">
            <h2 id="drafts-heading">Drafts</h2>
            {drafts.docs.length ? (
              <ul className="revalue-list">
                {drafts.docs.map((d) => (
                  <li key={d.id}>
                    <Link href={`${list('posts')}/${d.id}`}>{d.title || 'Untitled'}</Link>
                    <span>{day(d.updatedAt)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="revalue-empty">No unpublished drafts.</p>
            )}
          </section>

          <section className="revalue-box" aria-labelledby="enquiries-heading">
            <h2 id="enquiries-heading">Latest enquiries</h2>
            {enquiries.docs.length ? (
              <ul className="revalue-list">
                {enquiries.docs.map((e) => (
                  <li key={e.id}>
                    <Link href={`${list('enquiries')}/${e.id}`}>
                      {e.name}, {e.organisation}
                    </Link>
                    <span>{day(e.createdAt)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="revalue-empty">No enquiries yet.</p>
            )}
          </section>
        </div>
      </div>

      {permissions?.collections?.['content-updates']?.read && (
        <section className="revalue-box revalue-box--maintenance">
          <Operations />
        </section>
      )}
    </Gutter>
  )
}
