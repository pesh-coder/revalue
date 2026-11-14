// Where each piece of CMS content appears on the public website.
// Shared by the publication hooks (server) and the admin "Where on the site" labels (browser).

export const pageRoutes: Record<string, string> = {
  'resources-blog': '/resources/blog',
  'resources-guides': '/resources/guides',
  'resources-tools': '/resources/tools',
  'projects-index': '/projects',
  'solutions-index': '/solutions',
}

export const pageNames: Record<string, string> = {
  about: 'About page',
  partners: 'Partners page',
  pricing: 'Pricing page',
  contact: 'Contact page',
  privacy: 'Privacy policy',
  terms: 'Terms of use',
  resources: 'Resources page',
  'resources-blog': 'Blog page',
  'resources-guides': 'Guides page',
  'resources-tools': 'Tools page',
  'projects-index': 'Projects page',
  'solutions-index': 'Solutions page',
}

export const publicPath = (collection: string, doc: { slug: string; format?: string | null }) =>
  collection === 'posts'
    ? `/resources/${doc.format === 'Guide' ? 'guides' : 'blog'}/${doc.slug}`
    : collection === 'topics'
      ? `/resources/${doc.slug}`
      : collection === 'tools'
        ? `/resources/tools/${doc.slug}`
        : collection === 'pages'
          ? pageRoutes[doc.slug] || `/${doc.slug}`
          : `/${collection}/${doc.slug}`
