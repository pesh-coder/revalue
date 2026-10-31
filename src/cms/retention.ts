import type { Payload, Where } from 'payload'
export async function cleanupRecords(p: Payload, apply = false, now = new Date()) {
  const oldAttempts = new Date(now.getTime() - 15 * 60 * 1000).toISOString()
  const oldUpdates = new Date(now.getTime() - 30 * 86400000).toISOString()
  const months = Number(process.env.ENQUIRY_RETENTION_MONTHS || 24)
  if (!Number.isInteger(months) || months < 1 || months > 120)
    throw new Error('Invalid retention months.')
  const enquiryCutoff = new Date(now)
  enquiryCutoff.setUTCMonth(enquiryCutoff.getUTCMonth() - months)
  const attempts = { createdAt: { less_than: oldAttempts } }
  const enquiries = { createdAt: { less_than: enquiryCutoff.toISOString() } }
  const updates: Where = {
    and: [{ state: { equals: 'complete' } }, { createdAt: { less_than: oldUpdates } }],
  }
  const counts = await Promise.all([
    p.count({ collection: 'enquiry-attempts', overrideAccess: true, where: attempts }),
    p.count({ collection: 'enquiries', overrideAccess: true, where: enquiries }),
    p.count({ collection: 'content-updates', overrideAccess: true, where: updates }),
  ])
  if (apply) {
    await p.delete({ collection: 'enquiry-attempts', overrideAccess: true, where: attempts })
    await p.delete({ collection: 'enquiries', overrideAccess: true, where: enquiries })
    await p.delete({ collection: 'content-updates', overrideAccess: true, where: updates })
  }
  return {
    applied: apply,
    attempts: counts[0].totalDocs,
    enquiries: counts[1].totalDocs,
    updates: counts[2].totalDocs,
    retentionMonths: months,
  }
}
