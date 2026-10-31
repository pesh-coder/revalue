import { existsSync } from 'node:fs'
if (existsSync('.env.local')) process.loadEnvFile('.env.local')
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
if (!process.env.DATABASE_URL || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
  throw new Error(
    'Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD in your local environment first.',
  )
if (process.env.ADMIN_PASSWORD.length < 14)
  throw new Error('Use an administrator password of at least 14 characters.')
const payload = await getPayload({ config })
try {
  const existing = await payload.count({ collection: 'users', overrideAccess: true })
  if (existing.totalDocs)
    throw new Error('Users already exist. Use the existing administrator account.')
  await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME || 'Administrator',
      role: 'admin',
    },
  })
  console.log('Administrator created. Sign in at /admin.')
} finally {
  await payload.destroy()
}

process.exit(process.exitCode || 0)
