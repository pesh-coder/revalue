import { getPayload } from 'payload'
import config from '@payload-config'
import { notifyEnquiry } from '@/cms/notify-enquiry'
import { hasSameOrigin } from '@/lib/request-origin'
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSameOrigin(request, process.env.SITE_URL))
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  if (!process.env.DATABASE_URL) return Response.json({ error: 'Not configured' }, { status: 503 })
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })
  const id = Number((await params).id)
  if (!Number.isSafeInteger(id) || id < 1)
    return Response.json({ error: 'Invalid record' }, { status: 400 })
  try {
    const body = await request.json().catch(() => ({}))
    const sent = await notifyEnquiry(payload, id, body.confirmedUndelivered === true)
    return Response.json(sent, {
      status: sent.ok ? 200 : 409,
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch {
    return Response.json({ error: 'Retry could not be completed.' }, { status: 503 })
  }
}
