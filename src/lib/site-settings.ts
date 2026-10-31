import { cache } from 'react'
import { brand, navigation } from './brand'
import { publicCache } from './public-cache'
export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }
export type SiteSettings = {
  navigation: NavItem[]
  footerLinks: { label: string; href: string }[]
  tagline: string
  operator: string
  contactLabel: string
  contactEmail: string
}
export const defaultSiteSettings: SiteSettings = {
  navigation: navigation.map((item) => ({
    ...item,
    children:
      item.label === 'Resources'
        ? [
            { label: 'Resources', href: '/resources' },
            { label: 'Blog', href: '/resources/blog' },
            { label: 'Guides', href: '/resources/guides' },
            { label: 'Tools and templates', href: '/resources/tools' },
          ]
        : item.label === 'Solutions'
          ? [
              { label: 'Solutions', href: '/solutions' },
              { label: 'Waste Discovery Review', href: '/solutions/waste-discovery-review' },
            ]
          : [],
  })),
  footerLinks: ['About', 'Contact', 'Terms', 'Privacy'].map((label) => ({
    label,
    href: `/${label.toLowerCase()}`,
  })),
  tagline: brand.tagline,
  operator: brand.operator,
  contactLabel: 'Contact us',
  contactEmail: '',
}
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (process.env.REVALUE_CONTENT_MODE === 'review') return defaultSiteSettings
  return cachedSettings()
})
const cachedSettings = publicCache('settings', async (): Promise<SiteSettings> => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const p = await getPayload({ config })
  const s = await p.findGlobal({ slug: 'site-settings', overrideAccess: true, draft: false })
  if (s._status !== 'published') throw new Error('Publish the site settings before using CMS mode.')
  return {
    navigation: (s.navigation || []).map((n) => ({ ...n, children: n.children || [] })),
    footerLinks: s.footerLinks || [],
    tagline: s.tagline,
    operator: s.operator,
    contactLabel: s.contactLabel,
    contactEmail: s.contactEmail || '',
  }
})
