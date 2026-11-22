import test from 'node:test'
import assert from 'node:assert/strict'
import { reviewCatalog } from '../src/lib/review-content'
import { validateEnquiry, type EnquiryInput } from '../src/lib/enquiry-validation'
import { sendEnquiryConfirmation, sendResendNotification } from '../src/lib/resend-mail'
import { enquiryConfirmationEmail, enquiryNotificationEmail } from '../src/lib/email/enquiry'
const valid: EnquiryInput = {
  name: 'Test Person',
  organisation: 'Example Organisation',
  email: 'test@example.com',
  phone: '',
  type: 'General',
  message: 'A synthetic test enquiry.',
  website: '',
  submissionId: '283e5cca-63af-446a-8802-5d476118d9d7',
}
test('review content does not claim a live pilot or available services', () => {
  assert.ok(reviewCatalog.projects.every((p) => p.status !== 'Pilot'))
  assert.ok(reviewCatalog.solutions.every((s) => s.availability !== 'Available'))
  assert.equal(reviewCatalog.articles.length, 1)
  assert.ok(reviewCatalog.tools.every((t) => !t.approved && !t.fileUrl))
})
test('review article has no invented future reviewed date', () => {
  assert.equal(reviewCatalog.articles[0].reviewedAt, undefined)
})
test('form rejects missing required values and unknown enquiry type', () => {
  assert.deepEqual(validateEnquiry(valid), {})
  const invalid = validateEnquiry({
    ...valid,
    name: ' ',
    organisation: '',
    type: 'unknown',
    email: 'bad',
    message: '',
  })
  for (const key of ['name', 'organisation', 'type', 'email', 'message']) assert.ok(key in invalid)
})
test('form rejects header injection and overlong messages', () => {
  assert.ok(
    validateEnquiry({ ...valid, email: 'test@example.com\r\nBcc:secret@example.com' }).email,
  )
  assert.ok(validateEnquiry({ ...valid, message: 'a'.repeat(5001) }).message)
})
test('Resend request uses separate sender, reply-to and stable idempotency key', async () => {
  let observed: RequestInit | undefined
  const fake: typeof fetch = async (_url, init) => {
    observed = init
    return Response.json({ id: 'synthetic-email-id' })
  }
  const result = await sendResendNotification(
    { ...valid, id: 42 },
    { apiKey: 'synthetic-key', from: 'ReValue <test@example.com>', to: 'team@example.com' },
    fake,
  )
  assert.equal(result.ok, true)
  const h = observed?.headers as Record<string, string>
  assert.equal(h['Idempotency-Key'], 'revalue-enquiry-42')
  const body = JSON.parse(observed?.body as string)
  assert.equal(body.reply_to, valid.email)
  assert.equal(body.from, 'ReValue <test@example.com>')
  assert.match(body.html, /New enquiry from Test Person/)
  assert.match(body.text, /A synthetic test enquiry\./)
})
test('sender always shows the ReValue name, whatever EMAIL_FROM says', async () => {
  let observed: RequestInit | undefined
  const fake: typeof fetch = async (_url, init) => {
    observed = init
    return Response.json({ id: 'synthetic-email-id' })
  }
  await sendResendNotification(
    { ...valid, id: 7 },
    { apiKey: 'k', from: 'Revalue <hello@example.com>', to: 'team@example.com' },
    fake,
  )
  assert.equal(JSON.parse(observed?.body as string).from, 'ReValue <hello@example.com>')
})
test('visitor input is escaped in the team notification', () => {
  const email = enquiryNotificationEmail({
    ...valid,
    id: 3,
    name: '<img src=x onerror=alert(1)>',
    message: '<a href="https://spam.example">click</a>',
  })
  assert.ok(!email.html.includes('<img src=x'))
  assert.ok(!email.html.includes('<a href="https://spam.example">'))
  assert.match(email.html, /&lt;a href=&quot;https:\/\/spam\.example&quot;&gt;/)
})
test('confirmation never repeats the message and only greets plausible names', async () => {
  const spam = enquiryConfirmationEmail({
    name: 'Buy cheap pills at spam.example',
    type: 'General',
  })
  assert.ok(!spam.html.includes('spam.example'))
  assert.match(spam.text, /^Hello,/)
  const real = enquiryConfirmationEmail({ name: "Ann-Marie O'Neill", type: 'General' })
  assert.match(real.text, /^Hello Ann-Marie,/)
  let observed: RequestInit | undefined
  const fake: typeof fetch = async (_url, init) => {
    observed = init
    return Response.json({ id: 'confirmation-id' })
  }
  await sendEnquiryConfirmation(
    { ...valid, id: 9 },
    { apiKey: 'k', from: 'ReValue <hello@example.com>' },
    fake,
  )
  const body = JSON.parse(observed?.body as string)
  assert.deepEqual(body.to, [valid.email])
  assert.equal(body.reply_to, 'hello@example.com')
  assert.ok(!body.html.includes(valid.message) && !body.text.includes(valid.message))
  assert.equal(
    (observed?.headers as Record<string, string>)['Idempotency-Key'],
    'revalue-enquiry-confirmation-9',
  )
})
test('provider rejection is a failure, and missing settings never call the network', async () => {
  let called = false
  const fake: typeof fetch = async () => {
    called = true
    return Response.json({}, { status: 429 })
  }
  assert.equal(
    (await sendResendNotification({ ...valid, id: 1 }, { apiKey: '', from: '', to: '' }, fake)).ok,
    false,
  )
  assert.equal(called, false)
  assert.equal(
    (
      await sendResendNotification(
        { ...valid, id: 1 },
        { apiKey: 'synthetic', from: 'test@example.com', to: 'team@example.com' },
        fake,
      )
    ).ok,
    false,
  )
})

test('origin validation handles an internal bind address and rejects other sites', async () => {
  const { hasSameOrigin } = await import('../src/lib/request-origin')
  const request = new Request('http://0.0.0.0:3000/api/contact', {
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
  })
  assert.equal(hasSameOrigin(request), true)
  assert.equal(
    hasSameOrigin(
      new Request('http://0.0.0.0:3000/api/contact', {
        headers: { host: 'localhost:3000', origin: 'https://example.com' },
      }),
    ),
    false,
  )
  assert.equal(hasSameOrigin(request, 'https://revalue.example'), false)
})

import { secureCookiesForOrigin } from '../src/lib/request-origin'
test('HTTPS sites require secure auth cookies while local HTTP remains usable', () => {
  assert.equal(secureCookiesForOrigin('https://revalue.example'), true)
  assert.equal(secureCookiesForOrigin('http://localhost:3000'), false)
  assert.equal(secureCookiesForOrigin(undefined), false)
})
