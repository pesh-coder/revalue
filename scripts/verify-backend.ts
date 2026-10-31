import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { randomUUID, randomBytes } from 'node:crypto'
import assert from 'node:assert/strict'
if (existsSync('.env.local')) process.loadEnvFile('.env.local')
const testURL = process.env.DATABASE_TEST_URL
if (
  !testURL ||
  !['127.0.0.1', 'localhost'].includes(new URL(testURL).hostname) ||
  !new URL(testURL).pathname.endsWith('_test')
)
  throw new Error('An isolated local DATABASE_TEST_URL ending in _test is required.')
process.env.DATABASE_URL = testURL
process.env.REVALUE_CONTENT_MODE = 'cms'
process.env.MEDIA_DIRECTORY = '.local/test-uploads/media'
process.env.FILES_DIRECTORY = '.local/test-uploads/files'
process.env.ENQUIRIES_ENABLED = 'true'
process.env.CONTACT_TRUSTED_IP_HEADER = 'x-revalue-test-ip'
process.env.SITE_URL = 'http://localhost:3000'
delete process.env.RESEND_API_KEY
delete process.env.EMAIL_FROM
delete process.env.EMAIL_TO
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const { paragraphs } = await import('../src/lib/content-types')
const { searchPublished } = await import('../src/cms/search')
const { notifyEnquiry } = await import('../src/cms/notify-enquiry')
const { cleanupRecords } = await import('../src/cms/retention')
const { POST } = await import('../src/app/(site)/api/contact/route')
const p = await getPayload({ config })
const results: { name: string; pass: boolean; error?: string }[] = []
async function check(name: string, run: () => Promise<void>) {
  try {
    await run()
    results.push({ name, pass: true })
    console.log('PASS', name)
  } catch (e) {
    results.push({ name, pass: false, error: e instanceof Error ? e.message : String(e) })
    console.error('FAIL', name, e)
  }
}
const tag = randomUUID().slice(0, 8)
const context = { skipContentUpdates: true }
try {
  await p.db.migrate()
  const admin = await p.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name: 'Synthetic Admin',
      email: `admin-${tag}@example.test`,
      password: randomBytes(24).toString('hex'),
      role: 'admin',
    },
  })
  const editor = await p.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name: 'Synthetic Editor',
      email: `editor-${tag}@example.test`,
      password: randomBytes(24).toString('hex'),
      role: 'editor',
    },
  })
  await check('Visitors cannot create accounts or editorial content', async () => {
    await assert.rejects(() =>
      p.create({
        collection: 'users',
        overrideAccess: false,
        data: {
          email: `visitor-${tag}@example.test`,
          password: 'synthetic-password',
          name: 'Visitor',
          role: 'admin',
        },
      }),
    )
    await assert.rejects(() =>
      p.create({
        collection: 'posts',
        overrideAccess: false,
        data: {
          title: 'No',
          slug: `no-${tag}`,
          excerpt: 'No',
          primaryTopic: 'Waste',
          format: 'Blog',
          primaryTopicSlug: 'waste',
          authorName: 'Test',
          body: paragraphs(['No']),
        },
      }),
    )
  })
  await check('Editors cannot elevate roles or change project stages', async () => {
    await p.update({
      collection: 'users',
      id: editor.id,
      user: editor,
      overrideAccess: false,
      data: { role: 'admin' },
    })
    assert.equal(
      (await p.findByID({ collection: 'users', id: editor.id, overrideAccess: true })).role,
      'editor',
    )
    const project = await p.create({
      collection: 'projects',
      overrideAccess: true,
      context,
      data: {
        title: 'Synthetic stage test',
        slug: `stage-${tag}`,
        excerpt: 'Test',
        stage: 'Testing',
        _status: 'published',
      },
    })
    await p.update({
      collection: 'projects',
      id: project.id,
      user: editor,
      overrideAccess: false,
      context,
      data: { stage: 'Pilot' },
    })
    assert.equal(
      (await p.findByID({ collection: 'projects', id: project.id, overrideAccess: true })).stage,
      'Testing',
    )
  })
  const post = await p.create({
    collection: 'posts',
    overrideAccess: false,
    user: editor,
    context,
    data: {
      title: `Synthetic waste auditing ${tag}`,
      slug: `audit-${tag}`,
      excerpt: 'Measure waste recovery at a site.',
      primaryTopic: 'Waste audits',
      format: 'Blog',
      primaryTopicSlug: `topic-${tag}`,
      authorName: 'Synthetic Editor',
      body: paragraphs(['Synthetic content.']),
      _status: 'published',
    },
  })
  await check(
    'Draft edits preserve the last published version and stay out of public search',
    async () => {
      await p.update({
        collection: 'posts',
        id: post.id,
        overrideAccess: false,
        user: editor,
        draft: true,
        context,
        data: { title: `Private draft ${tag}`, _status: 'draft' },
      })
      const publicPost = await p.findByID({
        collection: 'posts',
        id: post.id,
        overrideAccess: false,
        draft: false,
      })
      assert.equal(publicPost.title, post.title)
      const privatePost = await p.findByID({
        collection: 'posts',
        id: post.id,
        overrideAccess: false,
        user: editor,
        draft: true,
      })
      assert.equal(privatePost.title, `Private draft ${tag}`)
      assert.equal(
        (await searchPublished({ q: 'private', topic: `topic-${tag}`, format: '', page: 1 })).total,
        0,
      )
      const invisible = await p.create({
        collection: 'posts',
        overrideAccess: true,
        context,
        draft: true,
        data: {
          ...post,
          id: undefined,
          slug: `private-${tag}`,
          title: 'Unpublished synthetic secret',
          _status: 'draft',
        },
      })
      await assert.rejects(() =>
        p.findByID({ collection: 'posts', id: invisible.id, overrideAccess: false, draft: true }),
      )
    },
  )
  await check(
    'Application full-text search passes ten fixed query/filter expectations',
    async () => {
      const cases: [string, string, string, boolean][] = [
        ['waste', `topic-${tag}`, 'Blog', true],
        ['audits', `topic-${tag}`, '', true],
        ['recovering', `topic-${tag}`, '', false],
        ['"waste auditing"', `topic-${tag}`, '', true],
        ['waste -plastic', `topic-${tag}`, '', true],
        ['waste', `topic-${tag}`, 'Guide', false],
        ['waste', 'nonexistent-topic', '', false],
        ['zzzz-no-result', `topic-${tag}`, '', false],
        ["'; DROP TABLE posts; --", `topic-${tag}`, '', false],
        ['', `topic-${tag}`, 'Blog', true],
      ]
      for (const [q, topic, format, expected] of cases)
        assert.equal(
          (await searchPublished({ q, topic, format, page: 1 })).entries.some((a) =>
            a.href.endsWith(post.slug),
          ),
          expected,
          `Query/filter mismatch: ${q}`,
        )
    },
  )
  await check(
    'Publishing and unpublishing update public search; published slugs stay frozen',
    async () => {
      await p.update({
        collection: 'posts',
        id: post.id,
        overrideAccess: false,
        user: editor,
        context,
        data: { title: `Published revision ${tag}`, _status: 'published' },
        draft: false,
      })
      assert.ok(
        (await searchPublished({ q: 'revision', topic: `topic-${tag}`, format: '', page: 1 }))
          .total,
      )
      await assert.rejects(() =>
        p.update({
          collection: 'posts',
          id: post.id,
          user: editor,
          overrideAccess: false,
          context,
          data: { slug: `changed-${tag}` },
        }),
      )
      await p.update({
        collection: 'posts',
        id: post.id,
        user: editor,
        overrideAccess: false,
        context,
        data: { _status: 'draft' },
        draft: false,
      })
      assert.equal(
        (await searchPublished({ q: 'revision', topic: `topic-${tag}`, format: '', page: 1 }))
          .total,
        0,
      )
    },
  )
  await check('An Editor can restore a published version', async () => {
    const versions = await p.findVersions({
      collection: 'posts',
      overrideAccess: false,
      user: editor,
      where: { parent: { equals: post.id } },
      limit: 100,
    })
    const version = versions.docs.find(
      (v) => v.version.title === post.title && v.version._status === 'published',
    )
    assert.ok(version)
    await p.restoreVersion({
      collection: 'posts',
      id: String(version.id),
      draft: false,
      overrideAccess: false,
      user: editor,
      context: { ...context },
    })
    assert.equal(
      (await p.findByID({ collection: 'posts', id: post.id, overrideAccess: false })).title,
      post.title,
    )
  })
  await check('Structured rich-text tables save and render accessible HTML', async () => {
    const body = paragraphs([])
    body.root.children.push({
      type: 'block',
      version: 2,
      format: '',
      fields: {
        id: randomUUID(),
        blockType: 'data-table',
        caption: 'Synthetic material table',
        columns: [{ label: 'Material' }, { label: 'Quantity' }],
        rows: [{ cells: [{ text: 'Paper' }, { text: '12 kg' }] }],
      },
    })
    const doc = await p.create({
      collection: 'posts',
      user: editor,
      overrideAccess: false,
      context,
      data: {
        title: 'Synthetic table',
        slug: `table-${tag}`,
        excerpt: 'Synthetic test.',
        primaryTopic: 'Test',
        primaryTopicSlug: 'test',
        format: 'Blog',
        authorName: 'Synthetic Editor',
        body,
        _status: 'published',
      },
    })
    const { renderToStaticMarkup } = await import('react-dom/server')
    const { createElement } = await import('react')
    const { BodyContent } = await import('../src/components/site/content-ui')
    const html = renderToStaticMarkup(createElement(BodyContent, { body: doc.body }))
    assert.match(html, /<table/)
    assert.match(html, /<caption[^>]*>Synthetic material table/)
    assert.match(html, /scope="col"/)
    assert.match(html, /12 kg/)
  })
  await check(
    'Authenticated upload over 4.5 MB succeeds; visitors, false MIME and public draft access fail',
    async () => {
      const sharp = (await import('sharp')).default
      const buffer = await sharp(randomBytes(1500 * 1500 * 3), {
        raw: { width: 1500, height: 1500, channels: 3 },
      })
        .png()
        .toBuffer()
      assert.ok(buffer.length > 4.5 * 1024 * 1024)
      const file = {
        name: `synthetic-${tag}.png`,
        data: buffer,
        mimetype: 'image/png',
        size: buffer.length,
      }
      await assert.rejects(() =>
        p.create({
          collection: 'media',
          overrideAccess: false,
          file,
          data: { alt: 'Synthetic upload' },
        }),
      )
      const media = await p.create({
        collection: 'media',
        overrideAccess: false,
        user: editor,
        context,
        file,
        data: { alt: 'Synthetic upload' },
      })
      assert.equal(media.publicApproved, false)
      await assert.rejects(() =>
        p.findByID({ collection: 'media', id: media.id, overrideAccess: false }),
      )
      await p.update({
        collection: 'media',
        id: media.id,
        user: editor,
        overrideAccess: false,
        context,
        data: { publicApproved: true },
      })
      assert.equal(
        (await p.findByID({ collection: 'media', id: media.id, overrideAccess: true }))
          .publicApproved,
        false,
      )
      await p.update({
        collection: 'media',
        id: media.id,
        user: admin,
        overrideAccess: false,
        context,
        data: { publicApproved: true },
      })
      assert.equal(
        (await p.findByID({ collection: 'media', id: media.id, overrideAccess: false }))
          .publicApproved,
        true,
      )
      const invalid = Buffer.from('<html><script>alert(1)</script></html>')
      await assert.rejects(() =>
        p.create({
          collection: 'media',
          overrideAccess: false,
          user: editor,
          context,
          file: { ...file, name: `false-${tag}.png`, data: invalid, size: invalid.length },
          data: { alt: 'Invalid' },
        }),
      )
    },
  )
  const ip = `synthetic-${tag}`
  const submission = {
    name: 'Synthetic Person',
    organisation: 'Example',
    email: `test-${tag}@example.test`,
    phone: '',
    type: 'General',
    message: `Synthetic message ${tag}`,
    website: '',
    submissionId: randomUUID(),
  }
  const request = (body: object, testIP = ip) =>
    new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
        'x-revalue-test-ip': testIP,
      },
      body: JSON.stringify(body),
    })
  let enquiryID = 0
  await check(
    'Concurrent form submits store once; accepted storage survives email failure',
    async () => {
      const responses = await Promise.all([POST(request(submission)), POST(request(submission))])
      assert.deepEqual(
        responses.map((r) => r.status),
        [200, 200],
      )
      const docs = await p.find({
        collection: 'enquiries',
        overrideAccess: true,
        where: { submissionId: { equals: submission.submissionId } },
      })
      assert.equal(docs.totalDocs, 1)
      enquiryID = docs.docs[0].id
      assert.equal(docs.docs[0].deliveryState, 'failed')
      assert.equal((await POST(request({ ...submission, submissionId: randomUUID() }))).status, 200)
      assert.equal(
        (
          await p.find({
            collection: 'enquiries',
            overrideAccess: true,
            where: { email: { equals: submission.email } },
          })
        ).totalDocs,
        1,
      )
      await assert.rejects(() =>
        p.findByID({ collection: 'enquiries', id: enquiryID, overrideAccess: false }),
      )
    },
  )
  await check('Persistent limiter rejects the sixth distinct submission', async () => {
    const statuses = []
    for (let i = 0; i < 5; i++)
      statuses.push(
        (
          await POST(
            request({
              ...submission,
              submissionId: randomUUID(),
              message: `Different synthetic message ${tag}-${i}`,
            }),
          )
        ).status,
      )
    assert.deepEqual(statuses, [200, 200, 200, 200, 429])
  })
  await check(
    'Notification retry reuses the provider key and avoids a second send after success',
    async () => {
      const original = globalThis.fetch
      const keys: string[] = []
      process.env.RESEND_API_KEY = 'synthetic-mocked-key'
      process.env.EMAIL_FROM = 'test@example.test'
      process.env.EMAIL_TO = 'inbox@example.test'
      globalThis.fetch = async (input, init) => {
        assert.equal(String(input), 'https://api.resend.com/emails')
        keys.push(new Headers(init?.headers).get('Idempotency-Key') || '')
        return Response.json({ id: 'mocked-message' })
      }
      try {
        assert.equal((await notifyEnquiry(p, enquiryID)).ok, true)
        assert.equal((await notifyEnquiry(p, enquiryID)).ok, true)
        assert.deepEqual(keys, [`revalue-enquiry-${enquiryID}`])
      } finally {
        globalThis.fetch = original
        delete process.env.RESEND_API_KEY
        delete process.env.EMAIL_FROM
        delete process.env.EMAIL_TO
      }
    },
  )
  await check(
    'Old uncertain deliveries require provider reconciliation even after a recent retry',
    async () => {
      const e = await p.create({
        collection: 'enquiries',
        overrideAccess: true,
        data: {
          name: 'Synthetic',
          organisation: 'Example',
          email: 'synthetic@example.test',
          type: 'General',
          message: 'Synthetic reconciliation test',
          submissionId: randomUUID(),
          messageHash: randomUUID(),
          deliveryState: 'failed',
          firstAttemptAt: new Date(Date.now() - 25 * 3600000).toISOString(),
          lastAttemptAt: new Date().toISOString(),
        },
      })
      const original = globalThis.fetch
      let calls = 0
      process.env.RESEND_API_KEY = 'synthetic-mocked-key'
      process.env.EMAIL_FROM = 'test@example.test'
      process.env.EMAIL_TO = 'inbox@example.test'
      globalThis.fetch = async () => {
        calls++
        return Response.json({ id: 'mocked-reconciled' })
      }
      try {
        assert.equal((await notifyEnquiry(p, e.id)).ok, false)
        assert.equal(calls, 0)
        assert.equal((await notifyEnquiry(p, e.id, true)).ok, true)
        assert.equal(calls, 1)
      } finally {
        globalThis.fetch = original
        delete process.env.RESEND_API_KEY
        delete process.env.EMAIL_FROM
        delete process.env.EMAIL_TO
      }
    },
  )
  await check(
    'Retention dry-run and deletion remove expired counters without deleting recent enquiries',
    async () => {
      const old = await p.create({
        collection: 'enquiry-attempts',
        overrideAccess: true,
        data: { ipHash: 'synthetic-old-counter', createdAt: '2020-01-01T00:00:00Z' },
      })
      const report = await cleanupRecords(p, false)
      assert.ok(report.attempts >= 1)
      assert.ok(
        await p.findByID({ collection: 'enquiry-attempts', id: old.id, overrideAccess: true }),
      )
      await cleanupRecords(p, true)
      await assert.rejects(() =>
        p.findByID({ collection: 'enquiry-attempts', id: old.id, overrideAccess: true }),
      )
      assert.ok(await p.findByID({ collection: 'enquiries', id: enquiryID, overrideAccess: true }))
    },
  )
} finally {
  mkdirSync('artifacts', { recursive: true })
  writeFileSync(
    'artifacts/backend-checks.json',
    JSON.stringify(
      {
        date: new Date().toISOString(),
        database: 'isolated local PostgreSQL',
        liveMail: false,
        results,
      },
      null,
      2,
    ),
  )
  await p.destroy()
}
if (results.some((r) => !r.pass)) process.exitCode = 1

process.exit(process.exitCode || 0)
