import { cache } from 'react'
import type { Catalog } from './content-types'
import { publicCache } from './public-cache'
const cachedCatalog = publicCache('catalog', async () => {
  const { getCMSCatalog } = await import('@/cms/content')
  return getCMSCatalog()
})

export const getCatalog = cache(async (): Promise<Catalog> => {
  if (process.env.REVALUE_CONTENT_MODE === 'review') {
    const { reviewCatalog } = await import('./review-content')
    const { companyCopy } = await import('./company-copy')
    const { indexPages } = await import('./index-copy')
    return {
      ...reviewCatalog,
      pages: [...reviewCatalog.pages.map((p) => ({ ...p, ...companyCopy[p.slug] })), ...indexPages],
    }
  }
  return cachedCatalog()
})
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
export function dateLabel(value: string) {
  return new Date(value.includes('T') ? value : `${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
export function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || ''
}
export function pageNumber(value: string) {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? Math.min(n, 10000) : 1
}
