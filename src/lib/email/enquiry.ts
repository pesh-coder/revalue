import {
  emailButton,
  emailColors,
  emailDetailRow,
  emailLayout,
  escapeHTML,
  siteOrigin,
} from './layout'

export type EnquiryEmailInput = {
  id: string | number
  name: string
  organisation: string
  email: string
  phone?: string | null
  type: string
  message: string
  createdAt?: string | null
}

// Shown in the confirmation email. Change here if the team's reply time changes.
export const REPLY_PROMISE = 'We aim to reply within two working days.'

const kampalaTime = (iso?: string | null) =>
  new Date(iso || Date.now()).toLocaleString('en-GB', {
    timeZone: 'Africa/Kampala',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' (Kampala)'

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name

/** Email to the ReValue team for each new website enquiry. */
export function enquiryNotificationEmail(input: EnquiryEmailInput) {
  const name = escapeHTML(input.name)
  const organisation = escapeHTML(input.organisation)
  const email = escapeHTML(input.email)
  const phone = (input.phone || '').trim()
  const dial = phone.replace(/[^\d+]/g, '')
  const received = kampalaTime(input.createdAt)
  const adminURL = `${siteOrigin()}/admin/collections/enquiries/${input.id}`
  const replyURL = `mailto:${input.email}?subject=${encodeURIComponent('Re: your enquiry to ReValue')}`
  const subject = `New enquiry: ${input.type} – ${input.name} (${input.organisation})`
  const c = emailColors

  const body = `
<p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${c.forest};">${escapeHTML(input.type)}</p>
<h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:${c.deep};">New enquiry from ${name}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border-top:1px solid ${c.line};border-bottom:1px solid ${c.line};">
${emailDetailRow('Name', name)}
${emailDetailRow('Organisation', organisation)}
${emailDetailRow('Email', `<a href="mailto:${email}" style="color:${c.forest};">${email}</a>`)}
${emailDetailRow('Phone', phone ? `<a href="tel:${escapeHTML(dial)}" style="color:${c.forest};">${escapeHTML(phone)}</a>` : `<span style="color:${c.muted};">Not given</span>`)}
${emailDetailRow('Received', escapeHTML(received))}
</table>
<p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${c.muted};">Their message</p>
<div style="margin:0 0 24px;padding:16px 18px;background:${c.soft};border-left:3px solid ${c.accent};border-radius:4px;white-space:pre-wrap;">${escapeHTML(input.message)}</div>
<div>
${emailButton(`Reply to ${firstName(input.name)}`, replyURL)}
${dial ? emailButton(`Call ${phone}`, `tel:${dial}`, 'secondary') : ''}
${emailButton('Open in admin', adminURL, 'secondary')}
</div>`

  const text = [
    `New enquiry from the ReValue website`,
    '',
    `Type: ${input.type}`,
    `Name: ${input.name}`,
    `Organisation: ${input.organisation}`,
    `Email: ${input.email}`,
    `Phone: ${phone || 'Not given'}`,
    `Received: ${received}`,
    '',
    'Message:',
    input.message,
    '',
    `Reply: just reply to this email, it goes to ${input.email}.`,
    `Open in admin: ${adminURL}`,
  ].join('\n')

  return {
    subject,
    text,
    html: emailLayout({
      preheader: `${input.name} from ${input.organisation}: ${input.message.slice(0, 90)}`,
      body,
      footerNote:
        'Sent from the contact form on revalue.africa. Replying goes straight to the sender.',
    }),
  }
}

// Visitors' names are only used in the greeting when they look like a name, so the form
// cannot be used to send arbitrary text from ReValue's address.
const safeGreetingName = (name: string) => {
  const words = name.trim().split(/\s+/)
  const plausible =
    name.trim().length <= 60 &&
    words.length <= 4 &&
    words.every((word) => /^[\p{L}][\p{L}'’-]{0,29}$/u.test(word))
  return plausible ? words[0] : ''
}

/** Automatic confirmation to the person who sent the enquiry. Never repeats their message. */
export function enquiryConfirmationEmail(input: Pick<EnquiryEmailInput, 'name' | 'type'>) {
  const greetingName = safeGreetingName(input.name)
  const greeting = greetingName ? `Hello ${greetingName},` : 'Hello,'
  const origin = siteOrigin()
  const c = emailColors
  const subject = 'We have received your enquiry – ReValue'

  const body = `
<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:${c.deep};">Thank you for getting in touch</h1>
<p style="margin:0 0 14px;">${escapeHTML(greeting)}</p>
<p style="margin:0 0 14px;">We have received your enquiry about <strong>${escapeHTML(input.type.toLowerCase())}</strong>. ${escapeHTML(REPLY_PROMISE)}</p>
<p style="margin:0 0 24px;">If you need to add anything, reply to this email and it will reach our team.</p>
<p style="margin:0 0 12px;font-size:14px;font-weight:600;color:${c.muted};">While you wait</p>
<div>
${emailButton('Read our guides', `${origin}/resources`)}
${emailButton('See what we are building', `${origin}/solutions`, 'secondary')}
</div>
<p style="margin:24px 0 0;">The ReValue team</p>`

  const text = [
    greeting,
    '',
    `Thank you for getting in touch. We have received your enquiry about ${input.type.toLowerCase()}. ${REPLY_PROMISE}`,
    '',
    'If you need to add anything, reply to this email and it will reach our team.',
    '',
    `Read our guides: ${origin}/resources`,
    `See what we are building: ${origin}/solutions`,
    '',
    'The ReValue team',
    'ReValue is operated by Simuverse Limited, Kampala, Uganda.',
  ].join('\n')

  return {
    subject,
    text,
    html: emailLayout({
      preheader: `Thanks for contacting ReValue. ${REPLY_PROMISE}`,
      body,
      footerNote: 'You are receiving this because you sent an enquiry on revalue.africa.',
    }),
  }
}
