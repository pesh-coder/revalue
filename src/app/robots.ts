import type { MetadataRoute } from 'next'
import { siteIndexing, siteURL } from '@/lib/launch'

// Before launch every crawler is turned away; see lib/launch.ts.
export default function robots(): MetadataRoute.Robots {
  if (!siteIndexing) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/preview', '/resources/search'],
    },
    sitemap: `${siteURL}/sitemap.xml`,
  }
}
