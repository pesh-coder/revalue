import type { MetadataRoute } from 'next'
import { getCatalog } from '@/lib/content'
import { publicPath } from '@/lib/site-paths'
import { siteURL } from '@/lib/launch'

// Every public page. Rebuilt with the rest of the site when content is published.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getCatalog()
  const fixed = [
    '/',
    '/about',
    '/solutions',
    '/projects',
    '/resources',
    '/resources/blog',
    '/resources/guides',
    '/resources/tools',
    '/partners',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
  ]
  const entry = (path: string, lastModified?: string) => ({
    url: `${siteURL}${path === '/' ? '' : path}`,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  })
  return [
    ...fixed.map((path) => entry(path)),
    ...c.articles.map((a) =>
      entry(publicPath('posts', a), a.reviewedAt || a.publishedAt || undefined),
    ),
    ...c.topics.map((t) => entry(publicPath('topics', t))),
    ...c.projects.map((p) => entry(publicPath('projects', p))),
    ...c.solutions.map((s) => entry(publicPath('solutions', s))),
    ...c.tools.filter((t) => t.approved).map((t) => entry(publicPath('tools', t))),
  ]
}
