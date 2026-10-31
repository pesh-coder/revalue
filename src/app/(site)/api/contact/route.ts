import { createHmac } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validateEnquiry, type EnquiryInput } from '@/lib/enquiry-validation'
import { notifyEnquiry } from '@/cms/notify-enquiry'
import type { Enquiry } from '@/payload-types'
import { hasSameOrigin } from '@/lib/request-origin'
export const runtime = 'nodejs'
function result(body: object, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}
async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Missing body')
  const decoder = new TextDecoder()
  let size = 0
  let raw = ''
  while (true) {
    const part = await reader.read()
    if (part.done) break
    size += part.value.byteLength
    if (size > 20000) {
      await reader.cancel()
      throw new Error('Body too large')
    }
    raw += decoder.decode(part.value, { stream: true })
  }
  raw += decoder.decode()
  return JSON.parse(raw)
}
export async function POST(request: Request) {
  if (!hasSameOrigin(request, process.env.SITE_URL))
    return result({ message: 'Please submit the form from this website.' }, 403)
  if (!request.headers.get('content-type')?.includes('application/json'))
    return result({ message: 'Unsupported submission format.' }, 415)
  let raw: unknown
  try {
    raw = await readBody(request)
  } catch {
    return result({ message: 'We could not read this submission.' }, 400)
  }
  if (!raw || typeof raw !== 'object') return result({ message: 'Invalid submission.' }, 400)
  const source = raw as Record<string, unknown>
  const input = {} as EnquiryInput
  for (const key of [
    'name',
    'organisation',
    'email',
    'phone',
    'type',
    'message',
    'website',
    'submissionId',
  ] as const)
    input[key] = typeof source[key] === 'string' ? source[key].trim() : ''
  const errors = validateEnquiry(input)
  if (Object.keys(errors).length) return result({ errors }, 422)
  if (input.website) return result({ accepted: true })
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      input.submissionId,
    )
  )
    return result({ message: 'Please refresh the page and try again.' }, 400)
  if (process.env.ENQUIRIES_ENABLED !== 'true' || !process.env.DATABASE_URL)
    return result(
      {
        message:
          'Enquiries are not being sent from this preview yet. Please try again once the form is connected.',
      },
      503,
    )
  const ipHeader = process.env.CONTACT_TRUSTED_IP_HEADER
  const ip = ipHeader
    ? request.headers.get(ipHeader)?.split(',')[0]?.trim()
    : process.env.NODE_ENV === 'development'
      ? 'local-preview'
      : undefined
  if (!ip || !process.env.PAYLOAD_SECRET)
    return result({ message: 'The enquiry form is temporarily unavailable.' }, 503)
  const digest = (value: string) =>
    createHmac('sha256', process.env.PAYLOAD_SECRET!).update(value).digest('hex')
  const day = Math.floor(Date.now() / 86400000)
  const ipHash = digest(`ip:${day}:${ip}`)
  const priorIPHash = digest(`ip:${day - 1}:${ip}`)
  const messageHash = digest(`${input.email.toLowerCase()}\n${input.message}`)
  try {
    const payload = await getPayload({ config })
    const lock = await payload.db.pool.connect()
    let id: number | undefined
    try {
      await lock.query('BEGIN')
      await lock.query("SET LOCAL lock_timeout = '5s'")
      for (const key of [
        `ip:${digest(`lock:${ip}`)}`,
        `message:${messageHash}`,
        `submission:${input.submissionId}`,
      ].sort())
        await lock.query('SELECT pg_advisory_xact_lock(hashtext($1))', [key])
      const prior = await payload.find({
        collection: 'enquiries',
        overrideAccess: true,
        limit: 1,
        where: { submissionId: { equals: input.submissionId } },
      })
      if (prior.docs[0])
        return prior.docs[0].messageHash === messageHash
          ? result({ accepted: true })
          : result({ message: 'This submission has changed. Refresh and try again.' }, 409)
      const duplicate = await payload.find({
        collection: 'enquiries',
        overrideAccess: true,
        limit: 1,
        where: {
          and: [
            { messageHash: { equals: messageHash } },
            { createdAt: { greater_than: new Date(Date.now() - 600000).toISOString() } },
          ],
        },
      })
      if (duplicate.docs.length) return result({ accepted: true })
      const attempts = await payload.count({
        collection: 'enquiry-attempts',
        overrideAccess: true,
        where: {
          and: [
            { ipHash: { in: [ipHash, priorIPHash] } },
            { createdAt: { greater_than: new Date(Date.now() - 900000).toISOString() } },
          ],
        },
      })
      if (attempts.totalDocs >= 5)
        return result({ message: 'Too many attempts. Please wait and try again.' }, 429)
      await payload.create({
        collection: 'enquiry-attempts',
        overrideAccess: true,
        data: { ipHash },
      })
      const saved = await payload.create({
        collection: 'enquiries',
        overrideAccess: true,
        data: {
          name: input.name,
          organisation: input.organisation,
          email: input.email.toLowerCase(),
          phone: input.phone,
          type: input.type as Enquiry['type'],
          message: input.message,
          submissionId: input.submissionId,
          messageHash,
          deliveryState: 'pending',
        },
      })
      id = saved.id
    } finally {
      await lock.query('ROLLBACK').catch(() => {})
      lock.release()
    }
    if (id !== undefined) {
      try {
        await notifyEnquiry(payload, id)
      } catch {
        /* Durable pending record remains visible to the team. */
      }
    }
    return result({ accepted: true })
  } catch {
    return result({ message: 'Something went wrong on our side. Try again, or email us.' }, 503)
  }
}
