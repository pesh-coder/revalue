import nextEnv from '@next/env'

// Match `next build` file precedence, while preserving hosting environment values.
nextEnv.loadEnvConfig(process.cwd(), false)

const mode = process.env.REVALUE_CONTENT_MODE || 'cms'
const problems = []
if (!['cms', 'review'].includes(mode)) {
  problems.push('REVALUE_CONTENT_MODE must be cms or review.')
}
if (mode !== 'review') {
  for (const name of ['PAYLOAD_SECRET', 'DATABASE_URL']) {
    if (!process.env[name]?.trim()) problems.push(`${name} is missing.`)
  }
}
if (process.env.VERCEL && !process.env.SITE_URL?.trim()) {
  problems.push('SITE_URL is missing. Set it to this environment’s public HTTPS origin.')
}

if (problems.length) {
  console.error(
    `Revalue build configuration is incomplete:\n${problems.map((p) => `- ${p}`).join('\n')}`,
  )
  console.error(
    'Set hosting environment variables before redeploying. For the first CMS deployment, also migrate the database, bootstrap an administrator and seed baseline content. See docs/deployment.md.',
  )
  process.exitCode = 1
} else {
  console.log(`Revalue build configuration checked (${mode} mode).`)
}
