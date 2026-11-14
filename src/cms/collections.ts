import type { Access, CollectionConfig, GlobalConfig } from 'payload'
import { queueContentChange, queueContentDelete, queueGlobalChange } from './updates'
import { defaultHomeCopy } from '@/lib/home-copy'
import { validateUpload, validateCloudUpload } from './upload-validation'
import { freezePublishedURL, recordPublication, recordDeletion } from './publication'
import { secureCookiesForOrigin } from '@/lib/request-origin'
import { siteLocation } from './admin-fields'

const homeCopyLabels: Record<string, string> = {
  heroTitle: 'Banner heading',
  heroText: 'Banner text',
  heroAction: 'Banner main button',
  heroSecondary: 'Banner second button',
  latestHeading: '"Latest" section heading',
  emptyHeading: 'Heading when there are no posts',
  articlesLabel: '"All articles" link text',
  focusLabel: 'Focus section label',
  focusTitle: 'Focus section heading',
  focusText: 'Focus section text',
  focusLink: 'Focus section link text',
  audienceHeading: '"Where to start" heading',
  howHeading: '"How we work" heading',
  contactHeading: 'Contact section heading',
  contactLabel: 'Contact button text',
  projectLabel: 'Featured project label',
  projectLink: 'Featured project link text',
  projectStage: 'Featured project status line',
}

const team: Access = ({ req }) => Boolean(req.user)
const admin: Access = ({ req }) => req.user?.role === 'admin'
const published: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { cookies: { sameSite: 'Lax', secure: secureCookiesForOrigin(process.env.SITE_URL) } },
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    defaultColumns: ['name', 'email', 'role'],
    description:
      'People who can sign in to this admin. Admins can do everything; editors can write and edit.',
  },
  access: {
    create: admin,
    read: ({ req }) =>
      req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) =>
      req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    delete: admin,
  },
  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin (full access)', value: 'admin' },
        { label: 'Editor (write and edit content)', value: 'editor' },
      ],
      admin: { position: 'sidebar', description: 'Only admins can change roles.' },
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    group: 'Media Library',
    defaultColumns: ['filename', 'alt', 'publicApproved', 'updatedAt'],
    description:
      'Photos used on the website. JPG, PNG or WebP, up to 15 MB. An image only appears publicly once an admin approves it.',
  },
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
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what is in the image for people using screen readers, e.g. "Sorted plastic bottles in a sack".',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the image on the website.' },
    },
    {
      name: 'credit',
      label: 'Photo credit',
      type: 'text',
      admin: { description: 'Optional. Who took the photo, e.g. "Photo: Revalue".' },
    },
    {
      name: 'publicApproved',
      label: 'Approved for public use',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Admins only. Leave unticked until you have permission to publish this image. Unapproved images never appear on the website.',
      },
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'permissionNote',
      label: 'Permission note',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Admins only. Who gave permission to use this image, and when.',
      },
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
  labels: { singular: 'Post', plural: 'Blog posts & guides' },
  admin: {
    useAsTitle: 'title',
    group: 'Posts',
    defaultColumns: ['title', 'format', 'authorName', '_status', 'updatedAt'],
    description:
      'Articles for the Resources section. Save a draft at any time; press Publish when it is ready to go live.',
    preview: (doc) => `/preview?slug=${encodeURIComponent(String(doc.slug || ''))}`,
  },
  access: { read: published, create: team, update: team, delete: admin },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    siteLocation,
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: { placeholder: 'Add title' },
    },
    {
      name: 'slug',
      label: 'Web address (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        'Use lowercase words separated by hyphens.',
      admin: {
        description:
          'The end of the page address, e.g. how-to-run-a-waste-audit. Lowercase words joined by hyphens. It cannot be changed after the post is published.',
      },
    },
    {
      name: 'excerpt',
      label: 'Summary',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences shown on article cards and in search results.' },
    },
    { name: 'body', label: 'Content', type: 'richText', required: true },
    {
      type: 'collapsible',
      label: 'SEO (Google search and social sharing)',
      admin: {
        initCollapsed: true,
        description: 'Optional. If left empty, the title and summary are used.',
      },
      fields: [
        { name: 'metaTitle', label: 'Search title', type: 'text' },
        { name: 'metaDescription', label: 'Search description', type: 'textarea' },
        {
          name: 'socialImage',
          label: 'Social sharing image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Shown when the post is shared on WhatsApp, LinkedIn or X.' },
        },
        {
          name: 'searchPreview',
          type: 'ui',
          admin: { components: { Field: './components/admin/seo-preview#SEOPreview' } },
        },
      ],
    },
    {
      name: 'format',
      label: 'Post type',
      type: 'select',
      options: [
        { label: 'Blog post', value: 'Blog' },
        { label: 'Guide', value: 'Guide' },
      ],
      required: true,
      defaultValue: 'Blog',
      admin: {
        position: 'sidebar',
        description: 'Blog posts appear under Resources › Blog; guides under Resources › Guides.',
      },
    },
    {
      name: 'cover',
      label: 'Featured image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      label: 'Author',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'primaryTopic',
      label: 'Topic name',
      type: 'text',
      required: true,
      admin: { position: 'sidebar', description: 'Shown as the category label, e.g. Waste audits.' },
    },
    {
      name: 'primaryTopicSlug',
      label: 'Topic web address',
      type: 'text',
      required: true,
      defaultValue: 'waste-audits',
      admin: {
        position: 'sidebar',
        description: 'Must match the web address of a topic under Posts › Topics.',
      },
    },
    {
      name: 'publishedAt',
      label: 'Published on',
      type: 'date',
      admin: { position: 'sidebar', description: 'Filled in automatically when you first publish.' },
    },
    {
      name: 'reviewedAt',
      label: 'Last reviewed on',
      type: 'date',
      admin: { position: 'sidebar', description: 'Optional. When the facts were last checked.' },
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
  admin: {
    group: 'Website pages',
    description: 'The front page of the website. Save a draft to try changes, then Publish.',
  },
  access: { read: team, update: team },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Images and featured items',
          fields: [
            {
              name: 'heroImage',
              label: 'Main banner image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'The large photo at the top of the homepage.' },
            },
            {
              name: 'featuredArticles',
              label: 'Featured posts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              maxRows: 4,
              admin: { description: 'Choose up to 4 posts for the "Latest from Revalue" section.' },
            },
            {
              name: 'featuredProject',
              label: 'Featured project',
              type: 'relationship',
              relationTo: 'projects',
            },
            {
              name: 'showFeaturedProject',
              label: 'Show approved featured project',
              type: 'checkbox',
              defaultValue: false,
              access: { update: ({ req }) => req.user?.role === 'admin' },
              admin: {
                description: 'Admins only. Tick to show the featured project on the homepage.',
              },
            },
          ],
        },
        {
          label: 'Homepage text',
          fields: [
            {
              name: 'copy',
              label: false,
              type: 'group',
              fields: [
                ...Object.entries(defaultHomeCopy)
                  .filter(([, v]) => typeof v === 'string')
                  .map(([name, value]) => ({
                    name,
                    label: homeCopyLabels[name] || name,
                    type: 'textarea' as const,
                    required: true,
                    defaultValue: value,
                  })),
                {
                  name: 'audiences',
                  label: '"Where to start" boxes',
                  labels: { singular: 'Box', plural: 'Boxes' },
                  type: 'array',
                  fields: [
                    { name: 'title', label: 'Heading', type: 'text', required: true },
                    { name: 'description', label: 'Text', type: 'textarea', required: true },
                    {
                      name: 'href',
                      label: 'Links to',
                      type: 'text',
                      required: true,
                      admin: { description: 'A page on this site, e.g. /solutions' },
                    },
                  ],
                },
                {
                  name: 'steps',
                  label: '"How we work" steps',
                  labels: { singular: 'Step', plural: 'Steps' },
                  type: 'array',
                  fields: [{ name: 'text', label: 'Step', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [queueGlobalChange],
  },
}
