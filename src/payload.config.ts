import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import sharp from 'sharp'
import { Users, Media, Posts, Homepage } from './cms/collections'
import { Projects, Solutions, Topics, Tools, Pages, Files } from './cms/site-content'
import { Enquiries, EnquiryAttempts } from './cms/enquiries'
import { SiteSettings } from './cms/settings'
import { ContentUpdates } from './cms/updates'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { PublicationRecords } from './cms/publication'
import { TableBlock } from './cms/table-block'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Editors never need the developer "API" tab on edit screens.
const withoutAPITab = <T extends CollectionConfig | GlobalConfig>(entities: T[]) =>
  entities.map((entity) => ({ ...entity, admin: { ...entity.admin, hideAPIURL: true } }))

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.SITE_URL || 'http://localhost:3000',
  email:
    process.env.RESEND_API_KEY && process.env.EMAIL_FROM
      ? resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM,
          defaultFromName: 'Revalue',
        })
      : () => ({
          name: 'disabled',
          defaultFromAddress: 'disabled@example.invalid',
          defaultFromName: 'Revalue',
          sendEmail: async () => {
            throw new Error('Email delivery is not configured.')
          },
        }),
  admin: {
    components: {
      graphics: {
        Logo: './components/admin/brand#Logo',
        Icon: './components/admin/brand#Icon',
      },
      Nav: './components/admin/admin-nav#AdminNav',
      providers: ['./components/admin/open-menu#OpenMenu'],
      views: { dashboard: { Component: './components/admin/dashboard#Dashboard' } },
    },
    theme: 'light',
    user: 'users',
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: ' | Revalue Admin',
      robots: { index: false, follow: false },
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
  },
  // The sidebar menu is defined in components/admin/admin-nav.tsx.
  collections: withoutAPITab([
    Posts,
    Topics,
    Pages,
    Projects,
    Solutions,
    Tools,
    Media,
    Files,
    Enquiries,
    Users,
    ContentUpdates,
    EnquiryAttempts,
    PublicationRecords,
  ]),
  globals: withoutAPITab([Homepage, SiteSettings]),
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      bucket: process.env.S3_BUCKET || 'revalue-local-disabled',
      alwaysInsertFields: true,
      config: {
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
      clientUploads: true,
      collections: { media: { prefix: 'media' }, files: { prefix: 'files' } },
    }),
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({ blocks: [TableBlock] }),
    ],
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      connectionTimeoutMillis: 10000,
      query_timeout: 5000,
      max: 10,
    },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
})
