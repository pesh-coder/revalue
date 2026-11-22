import { enquiryConfirmationEmail, enquiryNotificationEmail } from './email/enquiry'

export type MailInput = {
  id: string | number
  name: string
  organisation: string
  email: string
  phone?: string | null
  type: string
  message: string
  createdAt?: string | null
}
type Settings = { apiKey: string; from: string; to: string }
type SendResult = { ok: true; id: string } | { ok: false; error: string }

// Whatever display name EMAIL_FROM carries, emails always come from "ReValue <address>".
export const senderAddress = (from: string) => (from.match(/<([^>]+)>/)?.[1] || from).trim()
const brandedSender = (from: string) => `ReValue <${senderAddress(from)}>`

async function send(
  apiKey: string,
  idempotencyKey: string,
  message: Record<string, unknown>,
  fetcher: typeof fetch,
): Promise<SendResult> {
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(message),
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

/** Notifies the team of a new enquiry. Replying to it goes to the sender. */
export async function sendResendNotification(
  input: MailInput,
  settings: Settings,
  fetcher: typeof fetch = fetch,
): Promise<SendResult> {
  if (!settings.apiKey || !settings.from || !settings.to)
    return { ok: false, error: 'Email delivery is not configured.' }
  const email = enquiryNotificationEmail(input)
  return send(
    settings.apiKey,
    `revalue-enquiry-${input.id}`,
    {
      from: brandedSender(settings.from),
      to: settings.to
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      reply_to: input.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    fetcher,
  )
}

/** Thanks the sender. Replies go to ReValue's sending address, which forwards to the team. */
export async function sendEnquiryConfirmation(
  input: MailInput,
  settings: Pick<Settings, 'apiKey' | 'from'>,
  fetcher: typeof fetch = fetch,
): Promise<SendResult> {
  if (!settings.apiKey || !settings.from)
    return { ok: false, error: 'Email delivery is not configured.' }
  const email = enquiryConfirmationEmail(input)
  return send(
    settings.apiKey,
    `revalue-enquiry-confirmation-${input.id}`,
    {
      from: brandedSender(settings.from),
      to: [input.email],
      reply_to: senderAddress(settings.from),
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    fetcher,
  )
}
