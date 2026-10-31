import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd(), false)

// Neon pooling is for application traffic; schema work uses a direct connection.
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
if (!connectionString) {
  console.error('Set DATABASE_URL_UNPOOLED (Neon) or DATABASE_URL (local) before migrating.')
  process.exit(1)
}

const cli = fileURLToPath(new URL('../bin.js', import.meta.resolve('payload')))
const result = spawnSync(process.execPath, [cli, 'migrate', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: connectionString },
})
if (result.error) console.error('Could not start the Payload migration command.')
process.exit(result.status ?? 1)
