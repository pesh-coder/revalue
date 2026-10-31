import type { Access, CollectionConfig, GlobalConfig } from 'payload'
import { queueContentChange, queueContentDelete, queueGlobalChange } from './updates'
import { defaultHomeCopy } from '@/lib/home-copy'
import { validateUpload, validateCloudUpload } from './upload-validation'
import { freezePublishedURL, recordPublication, recordDeletion } from './publication'
import { secureCookiesForOrigin } from '@/lib/request-origin'

const team: Access = ({ req }) => Boolean(req.user)
const admin: Access = ({ req }) => req.user?.role === 'admin'
const published: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { cookies: { sameSite: 'Lax', secure: secureCookiesForOrigin(process.env.SITE_URL) } },
  admin: { useAsTitle: 'email', group: 'Administration' },
  access: {
    create: admin,
    read: ({ req }) =>
      req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) =>
      req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    delete: admin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ['admin', 'editor'],
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: ({ req }) => (req.user ? true : { publicApproved: { equals: true } }),
    create: team,
    update: team,
    delete: admin,
  },
  hooks: {
    beforeOperation: [validateUpload],
    beforeChange: [validateCloudUpload],
    afterChange: [queueContentChange],
    afterDelete: [queueContentDelete],
  },
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      return headers
    },
    staticDir: process.env.MEDIA_DIRECTORY || 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    imageSizes: [{ name: 'card', width: 800, height: 600, position: 'centre' }],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
    {
      name: 'publicApproved',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'permissionNote',
      type: 'textarea',
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        read: ({ req }) => Boolean(req.user),
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', '_status', 'updatedAt'],
    preview: (doc) => `/preview?slug=${encodeURIComponent(String(doc.slug || ''))}`,
  },
  access: { read: published, create: team, update: team, delete: admin },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        'Use lowercase words separated by hyphens.',
    },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'primaryTopic', type: 'text', required: true },
    { name: 'primaryTopicSlug', type: 'text', required: true, defaultValue: 'waste-audits' },
    {
      name: 'format',
      type: 'select',
      options: ['Blog', 'Guide'],
      required: true,
      defaultValue: 'Blog',
    },
    { name: 'authorName', type: 'text', required: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'reviewedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'socialImage', type: 'upload', relationTo: 'media' },
    {
      name: 'searchPreview',
      type: 'ui',
      admin: { components: { Field: './components/admin/seo-preview#SEOPreview' } },
    },
  ],
  hooks: {
    beforeChange: [
      freezePublishedURL,
      ({ data, originalDoc }) => {
        if (originalDoc?.publishedAt && data.slug && data.slug !== originalDoc.slug)
          throw new Error('Published URLs are frozen in this prototype.')
        if (data._status === 'published' && !originalDoc?.publishedAt)
          data.publishedAt ||= new Date().toISOString()
        if (originalDoc?.publishedAt) data.publishedAt = originalDoc.publishedAt
        return data
      },
    ],
    afterChange: [recordPublication, queueContentChange],
    afterDelete: [recordDeletion, queueContentDelete],
  },
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: { read: team, update: team },
  versions: { drafts: true, max: 20 },
  fields: [
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'featuredProject', type: 'relationship', relationTo: 'projects' },
    {
      name: 'featuredArticles',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 4,
    },
    {
      name: 'copy',
      type: 'group',
      fields: [
        ...Object.entries(defaultHomeCopy)
          .filter(([, v]) => typeof v === 'string')
          .map(([name, value]) => ({
            name,
            type: 'textarea' as const,
            required: true,
            defaultValue: value,
          })),
        {
          name: 'audiences',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
        { name: 'steps', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
      ],
    },
    {
      name: 'showFeaturedProject',
      label: 'Show approved featured project',
      type: 'checkbox',
      defaultValue: false,
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
  hooks: {
    afterChange: [queueGlobalChange],
  },
}
