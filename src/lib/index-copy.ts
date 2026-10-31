import type { CompanyPage, Catalog } from './content-types'
export const indexPages: CompanyPage[] = [
  {
    slug: 'resources',
    title: 'Understand waste. Discover its value.',
    introduction:
      'Practical knowledge, tools and ideas for better waste management and resource recovery.',
  },
  {
    slug: 'resources-blog',
    title: 'Blog',
    introduction: 'Explanations, field lessons and practical advice.',
  },
  { slug: 'resources-guides', title: 'Guides', introduction: 'Step-by-step learning resources.' },
  {
    slug: 'resources-tools',
    title: 'Tools and templates',
    introduction: 'Practical resources for site and facility teams.',
  },
  {
    slug: 'projects-index',
    title: 'Projects',
    introduction:
      'Work and lessons, labelled by status. Tools and plans we use are not the same as finished projects, and we keep them separate.',
  },
  {
    slug: 'solutions-index',
    title: 'What we are building and offering',
    introduction:
      'Practical approaches to understanding waste, improving separation and exploring recovery.',
  },
]
export function indexCopy(c: Catalog, slug: string) {
  const page = c.pages.find((p) => p.slug === slug)
  if (!page) throw new Error('Publish the index page copy in the CMS.')
  return page
}
