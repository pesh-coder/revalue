import type { Payload } from 'payload'
import { sendResendNotification } from '@/lib/resend-mail'
export async function notifyEnquiry(payload: Payload, id: number, confirmedUndelivered = false) {
  const client = await payload.db.pool.connect()
  try {
    await client.query('BEGIN')
    await client.query("SET LOCAL lock_timeout = '5s'")
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`notify:${id}`])
    const enquiry = await payload.findByID({ collection: 'enquiries', id, overrideAccess: true })
    if (enquiry.deliveryState === 'sent')
      return { ok: true as const, id: enquiry.providerReference || '' }
    // Beyond the provider's deduplication window, reconcile before a manual resend.
    if (
      enquiry.firstAttemptAt &&
      Date.now() - new Date(enquiry.firstAttemptAt).getTime() > 23 * 60 * 60 * 1000 &&
      !confirmedUndelivered
    )
      return {
        ok: false as const,
        error: 'Check the provider delivery log before retrying this older notification.',
      }
    await payload.update({
      collection: 'enquiries',
      id,
      overrideAccess: true,
      data: {
        deliveryState: 'pending',
        deliveryAttempts: (enquiry.deliveryAttempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        ...(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.EMAIL_TO
          ? {
              firstAttemptAt: confirmedUndelivered
                ? new Date().toISOString()
                : enquiry.firstAttemptAt || new Date().toISOString(),
            }
          : {}),
      },
    })
    const result = await sendResendNotification(
      { ...enquiry, id },
      {
        apiKey: process.env.RESEND_API_KEY || '',
        from: process.env.EMAIL_FROM || '',
        to: process.env.EMAIL_TO || '',
      },
    )
    await payload.update({
      collection: 'enquiries',
      id,
      overrideAccess: true,
      data: result.ok
        ? { deliveryState: 'sent', providerReference: result.id, deliveryError: null }
        : { deliveryState: 'failed', deliveryError: result.error },
    })
    return result
  } finally {
    await client.query('ROLLBACK').catch(() => {})
    client.release()
  }
}
