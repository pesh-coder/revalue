// Runs database migrations as part of Vercel production builds, before the new code goes live.
// If a migration fails, the build fails and the previous deployment keeps serving the site.
// Preview and local builds skip this, so a branch can never change the production database.
import { spawnSync } from 'node:child_process'

if (process.env.VERCEL_ENV !== 'production') {
  console.log('Skipping database migrations: not a Vercel production build.')
  process.exit(0)
}
console.log('Applying database migrations before the production build...')
const result = spawnSync(process.execPath, ['scripts/migrate.mjs'], { stdio: 'inherit' })
process.exit(result.status ?? 1)
