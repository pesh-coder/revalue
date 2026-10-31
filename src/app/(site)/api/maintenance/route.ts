import { getPayload } from 'payload'
import config from '@payload-config'
import { hasSameOrigin } from '@/lib/request-origin'
import { flushContentUpdates } from '@/cms/updates'
import { cleanupRecords } from '@/cms/retention'
export const runtime = 'nodejs'
export async function POST(request: Request) {
  if (!hasSameOrigin(request, process.env.SITE_URL))
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  const p = await getPayload({ config })
  const { user } = await p.auth({ headers: request.headers })
  if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json().catch(() => ({}))
  const updates = await flushContentUpdates(p)
  const retention = await cleanupRecords(p, body.cleanup === true)
  return Response.json(
    { updates, retention },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
