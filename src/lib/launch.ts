// Launch switches, set as environment variables in Vercel. Both stay off until launch day:
// SITE_INDEXING=true      lets search engines index the site and publishes the sitemap
// ANALYTICS_ENABLED=true  turns on Vercel Web Analytics (update the Privacy page first)
// Changing either needs a redeploy, because public pages are built ahead of time.
export const siteIndexing = process.env.SITE_INDEXING === 'true'
export const analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true'
export const siteURL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
