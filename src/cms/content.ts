import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post, Media } from '@/payload-types'
import type { Article, Catalog } from '@/lib/content-types'
import { slugify } from '@/lib/content'
import { assetURL } from './asset-url'
export function mapPost(post: Post): Article {
  const media = typeof post.cover === 'object' ? (post.cover as Media | null) : null
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    topic: post.primaryTopic,
    topicSlug: post.primaryTopicSlug || slugify(post.primaryTopic),
    author: post.authorName,
    publishedAt: post.publishedAt || post.createdAt,
    reviewedAt: post.reviewedAt || undefined,
    image: assetURL(media?.url) || undefined,
    imageAlt: media?.alt || undefined,
    imageCaption: media?.caption || undefined,
    body: post.body,
    format: post.format || 'Blog',
    metaTitle: post.metaTitle || undefined,
    metaDescription: post.metaDescription || undefined,
    socialImage:
      typeof post.socialImage === 'object'
        ? assetURL(post.socialImage?.url) || undefined
        : undefined,
  }
}
export async function getCMSCatalog(): Promise<Catalog> {
  const p = await getPayload({ config })
  const options = {
    depth: 1,
    pagination: false,
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
  } as const
  const [posts, projects, solutions, topics, tools, pages] = await Promise.all([
    p.find({ ...options, collection: 'posts', sort: '-publishedAt' }),
    p.find({ ...options, collection: 'projects' }),
    p.find({ ...options, collection: 'solutions' }),
    p.find({ ...options, collection: 'topics' }),
    p.find({ ...options, collection: 'tools' }),
    p.find({ ...options, collection: 'pages' }),
  ])
  return {
    articles: posts.docs.map(mapPost),
    projects: projects.docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      status: d.stage,
      image: typeof d.image === 'object' ? assetURL(d.image?.url) || undefined : undefined,
      sections: d.sections?.map((s) => ({ title: s.title, text: s.text })) || [],
    })),
    solutions: solutions.docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      availability: d.availability,
      audience: d.audience,
      sections: d.sections?.map((s) => ({ title: s.title, text: s.text })) || [],
    })),
    topics: topics.docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      introduction: d.introduction,
    })),
    tools: tools.docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      audience: d.audience,
      format: d.format,
      approved: Boolean(d.publicReleaseApproved),
      fileUrl:
        typeof d.file === 'object' && d.file?.publicApproved ? d.file.url || undefined : undefined,
      versionDate: d.versionDate || undefined,
      instructions: d.instructions?.map((s) => s.step) || [],
    })),
    pages: pages.docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      introduction: d.introduction || '',
      body: d.body || undefined,
      image: typeof d.image === 'object' ? assetURL(d.image?.url) || undefined : undefined,
      imageAlt: typeof d.image === 'object' ? d.image?.alt : undefined,
      imageCaption:
        typeof d.image === 'object'
          ? d.image?.caption ||
            (d.image?.filename?.startsWith('stock-') ? 'Illustrative photograph.' : undefined)
          : undefined,
      principlesHeading: d.principlesHeading || undefined,
      principles: d.principles || [],
      teamHeading: d.teamHeading || undefined,
      teamIntroduction: d.teamIntroduction || undefined,
      people: d.people || [],
      audiences: d.audiences || [],
      pricingRows: d.pricingRows || [],
      sections: d.sections || [],
    })),
  }
}
