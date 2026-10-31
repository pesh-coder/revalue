import { getPayload } from 'payload'
import config from '@payload-config'
const cell = (v: unknown) =>
  `"${String(v ?? '')
    .replace(/^(?:\s*[=+@-]|[\t\r])/, "'$&")
    .replaceAll('"', '""')}"`
export async function GET(request: Request) {
  const p = await getPayload({ config })
  const { user } = await p.auth({ headers: request.headers })
  if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })
  const rows = await p.find({
    collection: 'enquiries',
    overrideAccess: true,
    pagination: false,
    depth: 0,
    sort: '-createdAt',
  })
  const fields = [
    'name',
    'organisation',
    'email',
    'phone',
    'type',
    'message',
    'deliveryState',
    'createdAt',
  ] as const
  const csv = [
    fields.join(','),
    ...rows.docs.map((row) => fields.map((f) => cell(row[f])).join(',')),
  ].join('\r\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="revalue-enquiries.csv"',
      'Cache-Control': 'private, no-store',
    },
  })
}
