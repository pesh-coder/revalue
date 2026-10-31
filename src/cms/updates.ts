import type {
  CollectionConfig,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from 'payload'
import { after } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
export const ContentUpdates: CollectionConfig = {
  slug: 'content-updates',
  admin: {
    group: 'Administration',
    useAsTitle: 'source',
    defaultColumns: ['source', 'state', 'createdAt', 'error'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'source', type: 'text', required: true },
    {
      name: 'state',
      type: 'select',
      options: ['pending', 'complete', 'failed'],
      defaultValue: 'pending',
      required: true,
    },
    { name: 'error', type: 'text' },
  ],
}
export async function flushContentUpdates(payload: Payload) {
  const lock = await payload.db.pool.connect()
  try {
    await lock.query('BEGIN')
    const held = await lock.query('SELECT pg_try_advisory_xact_lock(hashtext($1)) AS held', [
      'revalue-content-updates',
    ])
    if (!held.rows[0].held) return { processed: 0 }
    const pending = await payload.find({
      collection: 'content-updates',
      overrideAccess: true,
      limit: 100,
      where: { state: { in: ['pending', 'failed'] } },
    })
    if (!pending.docs.length) return { processed: 0 }
    revalidateTag('revalue-public', { expire: 0 })
    revalidatePath('/', 'layout')
    for (const doc of pending.docs)
      await payload.update({
        collection: 'content-updates',
        id: doc.id,
        overrideAccess: true,
        data: { state: 'complete', error: null },
      })
    return { processed: pending.docs.length }
  } finally {
    await lock.query('ROLLBACK').catch(() => {})
    lock.release()
  }
}
async function enqueue(source: string, req: Parameters<CollectionAfterChangeHook>[0]['req']) {
  if (req.context.skipContentUpdates) return
  await req.payload.create({
    collection: 'content-updates',
    overrideAccess: true,
    req,
    data: { source, state: 'pending' },
  })
  try {
    after(async () => {
      try {
        await flushContentUpdates(req.payload)
      } catch {
        req.payload.logger.error('Public refresh pending; retry from maintenance endpoint.')
      }
    })
  } catch {
    /* CLI callers flush through the maintenance endpoint after their transaction commits. */
  }
}
export const queueContentChange: CollectionAfterChangeHook = async ({ doc, req, collection }) => {
  await enqueue(`${collection.slug}:${doc.id}`, req)
  return doc
}
export const queueContentDelete: CollectionAfterDeleteHook = async ({ doc, req, collection }) => {
  await enqueue(`${collection.slug}:${doc.id}:deleted`, req)
  return doc
}
export const queueGlobalChange: GlobalAfterChangeHook = async ({ doc, req, global }) => {
  await enqueue(global.slug, req)
  return doc
}
