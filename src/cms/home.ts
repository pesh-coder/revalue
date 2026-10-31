import { assetURL } from './asset-url'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { HomeContent } from '@/lib/home-content'
export async function getCMSHomeContent(): Promise<HomeContent> {
  const p = await getPayload({ config })
  const h = await p.findGlobal({ slug: 'homepage', overrideAccess: true, draft: false, depth: 0 })
  if (h._status !== 'published') throw new Error('Publish the homepage before using CMS mode.')
  const ids = (h.featuredArticles || []).map((a) => (typeof a === 'number' ? a : a.id))
  const posts = await p.find({
    collection: 'posts',
    overrideAccess: false,
    draft: false,
    depth: 1,
    limit: 4,
    sort: '-publishedAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { format: { equals: 'Blog' } },
        ...(ids.length ? [{ id: { in: ids } }] : []),
      ],
    },
  })
  const project = h.featuredProject
    ? await p.findByID({
        collection: 'projects',
        id: typeof h.featuredProject === 'number' ? h.featuredProject : h.featuredProject.id,
        overrideAccess: false,
        depth: 1,
        draft: false,
        disableErrors: true,
      })
    : null
  const hero = h.heroImage
    ? await p.findByID({
        collection: 'media',
        id: typeof h.heroImage === 'number' ? h.heroImage : h.heroImage.id,
        overrideAccess: false,
        disableErrors: true,
      })
    : null
  return {
    copy: h.copy as HomeContent['copy'],
    heroImage: assetURL(hero?.url),
    showFeaturedProject: Boolean(h.showFeaturedProject && project?._status === 'published'),
    featuredProject:
      project?._status === 'published'
        ? {
            title: project.title,
            slug: project.slug,
            excerpt: project.excerpt,
            image: typeof project.image === 'object' ? assetURL(project.image?.url) : '',
          }
        : undefined,
    articles: (ids.length
      ? posts.docs.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      : posts.docs
    ).map((a) => ({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      topic: a.primaryTopic,
      author: a.authorName,
      publishedAt: (a.publishedAt || a.createdAt).slice(0, 10),
      image: typeof a.cover === 'object' ? assetURL(a.cover?.url) : '',
    })),
  }
}
