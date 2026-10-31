import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import type { CollectionSlug, TypedCollectionSelect } from 'payload'
if (existsSync('.env.local')) process.loadEnvFile('.env.local')
if (
  !process.env.DATABASE_URL ||
  !['127.0.0.1', 'localhost'].includes(new URL(process.env.DATABASE_URL).hostname)
)
  throw new Error('This review seed runs only against a local database.')
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const { reviewCatalog } = await import('../src/lib/review-content')
const { companyCopy } = await import('../src/lib/company-copy')
const { indexPages } = await import('../src/lib/index-copy')
const { defaultSiteSettings } = await import('../src/lib/site-settings')
const { defaultHomeCopy } = await import('../src/lib/home-copy')
const p = await getPayload({ config })
const context = { skipContentUpdates: true }
async function create<T extends CollectionSlug>(
  args: Parameters<typeof p.create<T, TypedCollectionSelect[T]>>[0],
) {
  const data = args.data as { slug?: string; alt?: string }
  const key = data.slug ? 'slug' : data.alt ? 'alt' : undefined
  if (key) {
    const existing = await p.find({
      collection: args.collection,
      overrideAccess: true,
      limit: 1,
      where: { [key]: { equals: data[key] } },
    })
    if (existing.docs[0]) return existing.docs[0]
  }
  return p.create<T, TypedCollectionSelect[T]>(args)
}
try {
  const users = await p.count({ collection: 'users', overrideAccess: true })
  if (!users.totalDocs) {
    const password = randomBytes(24).toString('base64url')
    await p.create({
      collection: 'users',
      overrideAccess: true,
      data: { email: 'admin@revalue.local', password, name: 'Local Administrator', role: 'admin' },
    })
    mkdirSync('.local', { recursive: true })
    writeFileSync(
      '.local/admin-credentials.json',
      JSON.stringify(
        {
          url: 'http://localhost:3000/admin',
          email: 'admin@revalue.local',
          password,
          localOnly: true,
        },
        null,
        2,
      ),
    )
  }
  async function image(filename: string, alt: string) {
    return create({
      collection: 'media',
      overrideAccess: true,
      context,
      filePath: `public/images/${filename}`,
      data: {
        alt,
        publicApproved: true,
        permissionNote: 'Local review only. Publication rights must be cleared before deployment.',
      },
    })
  }
  const [hero, cover, projectImage, aboutImage, partnerImage] = await Promise.all([
    image('stock-hero-hills.jpg', 'Green hills and cultivated land.'),
    image('stock-compost-bays.jpg', 'Separated organic material in compost bays.'),
    image('prototype-bin.jpg', 'Revalue sorting prototype.'),
    image(
      'stock-open-water.jpg',
      'Calm open water under a blue sky, a far shoreline on the horizon.',
    ),
    image('stock-cardboard-recovery.jpg', 'Cardboard materials collected for recovery.'),
  ])
  const posts = []
  for (const a of reviewCatalog.articles)
    posts.push(
      await create({
        collection: 'posts',
        overrideAccess: true,
        context,
        data: {
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          primaryTopic: a.topic,
          primaryTopicSlug: a.topicSlug,
          authorName: a.author,
          publishedAt: a.publishedAt,
          format: a.format,
          body: a.body,
          cover: cover.id,
          _status: 'published',
        },
      }),
    )
  const projects = []
  for (const a of reviewCatalog.projects)
    projects.push(
      await create({
        collection: 'projects',
        overrideAccess: true,
        context,
        data: {
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          stage: a.status as 'Testing',
          image: projectImage.id,
          sections: a.sections,
          _status: 'published',
        },
      }),
    )
  for (const a of reviewCatalog.solutions)
    await create({
      collection: 'solutions',
      overrideAccess: true,
      context,
      data: { ...a, availability: a.availability as 'In development', _status: 'published' },
    })
  for (const a of reviewCatalog.topics)
    await create({
      collection: 'topics',
      overrideAccess: true,
      context,
      data: { ...a, _status: 'published' },
    })
  for (const a of reviewCatalog.tools)
    await create({
      collection: 'tools',
      overrideAccess: true,
      context,
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        audience: a.audience,
        format: a.format,
        publicReleaseApproved: false,
        instructions: a.instructions.map((step) => ({ step })),
        _status: 'published',
      },
    })
  for (const a of [...reviewCatalog.pages, ...indexPages])
    await create({
      collection: 'pages',
      overrideAccess: true,
      context,
      data: {
        ...a,
        ...companyCopy[a.slug],
        image:
          a.slug === 'about' ? aboutImage.id : a.slug === 'partners' ? partnerImage.id : undefined,
        _status: 'published',
      },
    })
  await p.updateGlobal({
    slug: 'homepage',
    overrideAccess: true,
    context,
    data: {
      copy: defaultHomeCopy,
      heroImage: hero.id,
      featuredProject: projects[0]?.id,
      featuredArticles: posts.map((a) => a.id),
      showFeaturedProject: true,
      _status: 'published',
    },
  })
  await p.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    context,
    data: { ...defaultSiteSettings, _status: 'published' },
  })
  console.log(
    'Local review content seeded. Admin credentials are in ignored .local/admin-credentials.json. No live email was sent.',
  )
} finally {
  await p.destroy()
}

process.exit(process.exitCode || 0)
