export type MailInput = {
  id: string | number
  name: string
  organisation: string
  email: string
  phone?: string | null
  type: string
  message: string
}
export async function sendResendNotification(
  input: MailInput,
  settings: { apiKey: string; from: string; to: string },
  fetcher: typeof fetch = fetch,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!settings.apiKey || !settings.from || !settings.to)
    return { ok: false, error: 'Email delivery is not configured.' }
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `revalue-enquiry-${input.id}`,
      },
      body: JSON.stringify({
        from: settings.from,
        to: settings.to
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        reply_to: input.email,
        subject: `Revalue enquiry: ${input.type}`,
        text: [
          `Name: ${input.name}`,
          `Organisation: ${input.organisation}`,
          `Email: ${input.email}`,
          `Phone: ${input.phone || 'Not supplied'}`,
          `Type: ${input.type}`,
          '',
          input.message,
        ].join('\n'),
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok)
      return { ok: false, error: `Email provider returned status ${response.status}.` }
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null && 'id' in data && typeof data.id === 'string')
      return { ok: true, id: data.id }
    return { ok: false, error: 'Email provider response needs reconciliation.' }
  } catch {
    return {
      ok: false,
      error: 'Email delivery outcome is unknown. Retry with the same provider key.',
    }
  }
}
