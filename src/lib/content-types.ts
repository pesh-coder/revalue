import type { Post } from '@/payload-types'
export type Body = Post['body']
export type Section = { title: string; text: string }
export type Article = {
  slug: string
  title: string
  excerpt: string
  topic: string
  topicSlug: string
  author: string
  publishedAt: string
  reviewedAt?: string
  image?: string
  imageAlt?: string
  imageCaption?: string
  body: Body
  format: 'Blog' | 'Guide'
  metaTitle?: string
  metaDescription?: string
  socialImage?: string
}
export type Project = {
  slug: string
  title: string
  excerpt: string
  status: string
  image?: string
  sections: Section[]
}
export type Solution = {
  slug: string
  title: string
  excerpt: string
  availability: string
  audience: string
  sections: Section[]
}
export type Topic = { slug: string; title: string; introduction: string }
export type Tool = {
  slug: string
  title: string
  excerpt: string
  audience: string
  format: string
  approved: boolean
  fileUrl?: string
  versionDate?: string
  instructions: string[]
}
export type CompanyPage = {
  slug: string
  title: string
  introduction: string
  body?: Body
  image?: string
  imageAlt?: string
  imageCaption?: string
  principlesHeading?: string
  principles?: { text: string }[]
  teamHeading?: string
  teamIntroduction?: string
  people?: { name: string; role: string; initials: string }[]
  audiences?: { text: string }[]
  pricingRows?: { offering: string; factors: string }[]
  sections?: Section[]
}
export type Catalog = {
  articles: Article[]
  projects: Project[]
  solutions: Solution[]
  topics: Topic[]
  tools: Tool[]
  pages: CompanyPage[]
}
export const projectStatuses = [
  'Concept',
  'In development',
  'Testing',
  'Pilot',
  'Completed',
  'Published research',
] as const
export const enquiryTypes = [
  'Waste discovery or assessment',
  'Partnership or recovery',
  'Funding or research',
  'Media',
  'General',
] as const
export function paragraphs(texts: string[]): Body {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: texts.map((text) => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          { type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
        ],
      })),
    },
  }
}
