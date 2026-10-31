import { getCatalog } from './content'
export async function searchResources(input: {
  q: string
  topic: string
  format: string
  page: number
}) {
  if (process.env.REVALUE_CONTENT_MODE !== 'review') {
    const { searchPublished } = await import('@/cms/search')
    return searchPublished(input)
  }
  const c = await getCatalog()
  const entries = [
    ...c.articles.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      format: a.format,
      topic: a.topicSlug,
      href: `/resources/${a.format === 'Guide' ? 'guides' : 'blog'}/${a.slug}`,
    })),
    ...c.projects.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      format: 'Projects',
      topic: '',
      href: `/projects/${a.slug}`,
    })),
    ...c.solutions.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      format: 'Solutions',
      topic: '',
      href: `/solutions/${a.slug}`,
    })),
    ...c.tools
      .filter((t) => t.approved)
      .map((a) => ({
        title: a.title,
        excerpt: a.excerpt,
        format: 'Tools',
        topic: '',
        href: `/resources/tools/${a.slug}`,
      })),
  ]
  const words = input.q.toLowerCase().split(/\s+/).filter(Boolean)
  const filtered = entries.filter(
    (e) =>
      (!input.topic || e.topic === input.topic) &&
      (!input.format || e.format === input.format) &&
      words.every((w) => `${e.title} ${e.excerpt}`.toLowerCase().includes(w)),
  )
  return { entries: filtered.slice((input.page - 1) * 12, input.page * 12), total: filtered.length }
}
