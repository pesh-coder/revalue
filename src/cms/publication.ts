import type {
  CollectionConfig,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
} from 'payload'
import { APIError } from 'payload'
export const PublicationRecords: CollectionConfig = {
  slug: 'publication-records',
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'source', type: 'text', required: true, unique: true },
    { name: 'path', type: 'text', required: true, unique: true },
    { name: 'gone', type: 'checkbox', defaultValue: false, required: true },
  ],
}
const indexRoutes: Record<string, string> = {
  'resources-blog': '/resources/blog',
  'resources-guides': '/resources/guides',
  'resources-tools': '/resources/tools',
  'projects-index': '/projects',
  'solutions-index': '/solutions',
}
const route = (collection: string, doc: { slug: string; format?: string }) =>
  collection === 'posts'
    ? `/resources/${doc.format === 'Guide' ? 'guides' : 'blog'}/${doc.slug}`
    : collection === 'topics'
      ? `/resources/${doc.slug}`
      : collection === 'tools'
        ? `/resources/tools/${doc.slug}`
        : collection === 'pages'
          ? indexRoutes[doc.slug] || `/${doc.slug}`
          : `/${collection}/${doc.slug}`
export const freezePublishedURL: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  collection,
  req,
}) => {
  if (!originalDoc?.id) return data
  if (data.updatedAt && req.payloadAPI === 'REST' && !req.url?.includes('/versions/')) {
    const latest = await req.payload.findByID({
      collection: collection.slug as 'posts',
      id: originalDoc.id,
      overrideAccess: true,
      req,
      draft: true,
      depth: 0,
    })
    if (new Date(data.updatedAt).getTime() !== new Date(latest.updatedAt).getTime())
      throw new APIError(
        'A newer revision was saved. Reload the page and copy your changes before saving again.',
        409,
      )
  }
  const rows = await req.payload.find({
    collection: 'publication-records',
    overrideAccess: true,
    req,
    limit: 1,
    where: { source: { equals: `${collection.slug}:${originalDoc.id}` } },
  })
  if (rows.docs[0] && route(collection.slug, { ...originalDoc, ...data }) !== rows.docs[0].path)
    throw new Error('Published URLs are frozen. Keep the slug and content format unchanged.')
  return data
}
export const recordPublication: CollectionAfterChangeHook = async ({ doc, collection, req }) => {
  const internalReq = { ...req, context: { ...req.context, isRestoringVersion: false } }
  const source = `${collection.slug}:${doc.id}`
  const current = await req.payload.findByID({
    collection: collection.slug as
      'posts' | 'projects' | 'solutions' | 'topics' | 'tools' | 'pages',
    id: doc.id,
    overrideAccess: true,
    req,
    draft: false,
    depth: 0,
  })
  const rows = await req.payload.find({
    collection: 'publication-records',
    overrideAccess: true,
    req,
    limit: 1,
    where: { source: { equals: source } },
  })
  if (current._status === 'published') {
    if (rows.docs[0])
      await req.payload.update({
        collection: 'publication-records',
        id: rows.docs[0].id,
        overrideAccess: true,
        req: internalReq,
        data: { gone: false },
      })
    else
      await req.payload.create({
        collection: 'publication-records',
        overrideAccess: true,
        req: internalReq,
        data: { source, path: route(collection.slug, current), gone: false },
      })
  } else if (rows.docs[0])
    await req.payload.update({
      collection: 'publication-records',
      id: rows.docs[0].id,
      overrideAccess: true,
      req: internalReq,
      data: { gone: true },
    })
  return doc
}
export const recordDeletion: CollectionAfterDeleteHook = async ({ doc, collection, req }) => {
  const rows = await req.payload.find({
    collection: 'publication-records',
    overrideAccess: true,
    req,
    limit: 1,
    where: { source: { equals: `${collection.slug}:${doc.id}` } },
  })
  if (rows.docs[0])
    await req.payload.update({
      collection: 'publication-records',
      id: rows.docs[0].id,
      overrideAccess: true,
      req,
      data: { gone: true },
    })
  return doc
}
