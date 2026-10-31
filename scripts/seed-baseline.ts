// Initial CMS text only. Does not upload assets, create users, or publish example articles/projects.
import { existsSync } from 'node:fs'
if (existsSync('.env.local')) process.loadEnvFile('.env.local')
if (!process.env.DATABASE_URL) throw new Error('Set the intended DATABASE_URL first.')
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const { reviewCatalog } = await import('../src/lib/review-content')
const { companyCopy } = await import('../src/lib/company-copy')
const { indexPages } = await import('../src/lib/index-copy')
const { defaultHomeCopy } = await import('../src/lib/home-copy')
const { defaultSiteSettings } = await import('../src/lib/site-settings')
const p = await getPayload({ config })
const context = { skipContentUpdates: true }
try {
  if (!(await p.count({ collection: 'users', overrideAccess: true })).totalDocs)
    throw new Error('Create the first Admin with cms:bootstrap before seeding.')
  for (const page of [...reviewCatalog.pages, ...indexPages]) {
    const found = await p.find({
      collection: 'pages',
      overrideAccess: true,
      limit: 1,
      where: { slug: { equals: page.slug } },
    })
    if (!found.docs.length)
      await p.create({
        collection: 'pages',
        overrideAccess: true,
        context,
        data: { ...page, ...companyCopy[page.slug], image: undefined, _status: 'published' },
      })
  }
  const h = await p.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 0 })
  // Payload applies a default draft status even when no global row exists.
  // Only a persisted ID proves the owner already has settings to preserve.
  if (!h.id)
    await p.updateGlobal({
      slug: 'homepage',
      overrideAccess: true,
      context,
      data: { copy: defaultHomeCopy, showFeaturedProject: false, _status: 'published' },
    })
  const s = await p.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })
  if (!s.id)
    await p.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      context,
      data: { ...defaultSiteSettings, _status: 'published' },
    })
  console.log(
    'Initial CMS text installed. Existing content was preserved; no sample articles, projects, uploads or users were created. Review legal/team copy before launch.',
  )
} finally {
  await p.destroy()
}
// The pinned database adapter retains a reconnect client; finite CLI tasks exit after completed writes.
process.exit(0)
