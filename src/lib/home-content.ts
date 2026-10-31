import { defaultHomeCopy, type HomeCopy } from './home-copy'
import { publicCache } from './public-cache'
const cachedHome = publicCache('home', async () => {
  const { getCMSHomeContent } = await import('@/cms/home')
  return getCMSHomeContent()
})
export type HomeArticle = {
  title: string
  slug: string
  excerpt: string
  topic: string
  author: string
  publishedAt: string
  image: string
}
export type HomeContent = {
  articles: HomeArticle[]
  showFeaturedProject: boolean
  copy: HomeCopy
  heroImage: string
  featuredProject?: { title: string; slug: string; excerpt: string; image: string }
}

// Explicit visual-review fixtures. The CMS adapter replaces these in CMS mode.
export const reviewHomeContent: HomeContent = {
  articles: [
    {
      title: 'What is a waste audit?',
      slug: 'what-is-a-waste-audit',
      excerpt: 'A waste audit is a planned look at what a site throws away.',
      topic: 'Waste audits',
      author: 'Patience Sitati',
      publishedAt: '2026-10-30',
      image: '/images/stock-compost-bays.jpg',
    },
  ],
  showFeaturedProject: true,
  copy: defaultHomeCopy,
  heroImage: '/images/stock-hero-hills.jpg',
  featuredProject: {
    title: 'Smart segregation prototype',
    slug: 'smart-segregation-prototype',
    excerpt:
      'A prototype bin that uses a camera and sensors to sort waste into separate compartments.',
    image: '/images/prototype-bin.jpg',
  },
}

export async function getHomeContent(): Promise<HomeContent> {
  if (process.env.REVALUE_CONTENT_MODE === 'review') return reviewHomeContent
  return cachedHome()
}
