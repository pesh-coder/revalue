// Uploads the website's stock photographs into the Payload media library.
// Dry run by default. Images are uploaded NOT approved for public use: an admin must
// confirm each licence and tick "Approved for public use" in the admin.
// The prototype photo is excluded until the hardware lead approves its publication.
//
//   pnpm cms:photos                      list what would be uploaded
//   pnpm cms:photos --confirm-upload     upload (requires S3_* storage settings)
import { existsSync } from 'node:fs'
if (existsSync('.env.local')) process.loadEnvFile('.env.local')

const photos: { file: string; alt: string }[] = [
  { file: 'stock-hero-hills.jpg', alt: 'Green hills and cultivated land.' },
  { file: 'stock-compost-bays.jpg', alt: 'Separated organic material in compost bays.' },
  {
    file: 'stock-open-water.jpg',
    alt: 'Calm open water under a blue sky, a far shoreline on the horizon.',
  },
  { file: 'stock-cardboard-recovery.jpg', alt: 'Cardboard materials collected for recovery.' },
  { file: 'stock-sorted-bottles.jpg', alt: 'Sorted plastic bottles ready for material recovery.' },
  { file: 'stock-bins-three.jpg', alt: 'Waste bins arranged for separating materials.' },
  {
    file: 'stock-bins-four.jpg',
    alt: 'Yellow, blue, red and green wheelie bins lined up against a grey wall.',
  },
  {
    file: 'stock-hands-compost.jpg',
    alt: 'Two people sorting dry organic material by hand in a wooden trough.',
  },
  {
    file: 'stock-wheelie-bin.jpg',
    alt: 'A large street bin overflowing with flattened cardboard against a pale wall.',
  },
]

const confirmed = process.argv.includes('--confirm-upload')
const target = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'not set'
console.log(`Database host: ${target}`)
console.log(`File storage: ${process.env.S3_BUCKET ? `bucket "${process.env.S3_BUCKET}"` : 'NOT configured'}`)
for (const p of photos) console.log(`  ${p.file}  —  ${p.alt}`)

if (!confirmed) {
  console.log('\nDry run. Nothing was uploaded. Re-run with --confirm-upload to upload.')
  process.exit(0)
}
if (!process.env.S3_BUCKET)
  throw new Error(
    'Refusing to upload: S3_BUCKET and the other S3_* settings are not set, so files would not reach R2.',
  )

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  for (const p of photos) {
    const existing = await payload.find({
      collection: 'media',
      overrideAccess: true,
      limit: 1,
      where: { filename: { equals: p.file } },
    })
    if (existing.docs[0]) {
      console.log(`skip    ${p.file} (already in the media library)`)
      continue
    }
    await payload.create({
      collection: 'media',
      overrideAccess: true,
      filePath: `public/images/${p.file}`,
      data: {
        alt: p.alt,
        publicApproved: false,
        permissionNote:
          'Stock photograph from the design reference set. Confirm the licence before approving for public use.',
      },
    })
    console.log(`upload  ${p.file}`)
  }
} finally {
  await payload.destroy()
}
process.exit(process.exitCode || 0)
