import type { Access, CollectionConfig, Field } from 'payload'
import { queueContentChange, queueContentDelete } from './updates'
import { validateUpload, validateCloudUpload } from './upload-validation'
import { freezePublishedURL, recordPublication, recordDeletion } from './publication'
const team: Access = ({ req }) => Boolean(req.user)
const admin: Access = ({ req }) => req.user?.role === 'admin'
const published: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })
const baseFields: Field[] = [
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
]
const sections: Field = {
  name: 'sections',
  type: 'array',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
  ],
}
const editorial = (slug: string, fields: Field[]): CollectionConfig => ({
  slug,
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: published, create: team, update: team, delete: admin },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [...baseFields, ...fields],
  hooks: {
    beforeChange: [
      ({ data, collection }) => {
        if (collection.slug === 'topics' && ['blog', 'guides', 'tools'].includes(data.slug))
          throw new Error('That URL is reserved. Use a different topic slug.')
        if (
          collection.slug === 'pages' &&
          data.slug &&
          ![
            'about',
            'partners',
            'pricing',
            'contact',
            'privacy',
            'terms',
            'resources',
            'resources-blog',
            'resources-guides',
            'resources-tools',
            'projects-index',
            'solutions-index',
          ].includes(data.slug)
        )
          throw new Error(
            'Use one of the supported website page slugs. New article and project URLs belong in their own collections.',
          )
        return data
      },
      freezePublishedURL,
    ],
    afterChange: [recordPublication, queueContentChange],
    afterDelete: [recordDeletion, queueContentDelete],
  },
})
export const Projects = editorial('projects', [
  { name: 'excerpt', type: 'textarea', required: true },
  {
    name: 'stage',
    label: 'Project stage',
    type: 'select',
    required: true,
    options: ['Concept', 'In development', 'Testing', 'Pilot', 'Completed', 'Published research'],
    defaultValue: 'Concept',
    access: {
      create: ({ req }) => req.user?.role === 'admin',
      update: ({ req }) => req.user?.role === 'admin',
    },
  },
  { name: 'image', type: 'upload', relationTo: 'media' },
  sections,
])
export const Solutions = editorial('solutions', [
  { name: 'excerpt', type: 'textarea', required: true },
  {
    name: 'availability',
    type: 'select',
    required: true,
    options: ['Available', 'In development', 'Exploring'],
    defaultValue: 'Exploring',
    access: {
      create: ({ req }) => req.user?.role === 'admin',
      update: ({ req }) => req.user?.role === 'admin',
    },
  },
  { name: 'audience', type: 'textarea', required: true },
  sections,
])
export const Topics = editorial('topics', [
  { name: 'introduction', type: 'textarea', required: true },
])
export const Tools = editorial('tools', [
  { name: 'excerpt', type: 'textarea', required: true },
  { name: 'audience', type: 'text', required: true },
  { name: 'format', type: 'text', required: true },
  {
    name: 'publicReleaseApproved',
    type: 'checkbox',
    defaultValue: false,
    access: {
      create: ({ req }) => req.user?.role === 'admin',
      update: ({ req }) => req.user?.role === 'admin',
    },
  },
  { name: 'file', type: 'upload', relationTo: 'files' },
  { name: 'versionDate', type: 'date' },
  {
    name: 'instructions',
    type: 'array',
    fields: [{ name: 'step', type: 'text', required: true }],
  },
])
Tools.access = {
  ...Tools.access,
  read: ({ req }) =>
    req.user ? true : { _status: { equals: 'published' }, publicReleaseApproved: { equals: true } },
}
export const Pages = editorial('pages', [
  { name: 'introduction', type: 'textarea' },
  { name: 'body', type: 'richText' },
  { name: 'image', type: 'upload', relationTo: 'media' },
  { name: 'principlesHeading', type: 'text' },
  { name: 'principles', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
  { name: 'teamHeading', type: 'text' },
  { name: 'teamIntroduction', type: 'textarea' },
  {
    name: 'people',
    type: 'array',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'role', type: 'text', required: true },
      { name: 'initials', type: 'text', required: true },
    ],
  },
  { name: 'audiences', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
  {
    name: 'pricingRows',
    type: 'array',
    fields: [
      { name: 'offering', type: 'text', required: true },
      { name: 'factors', type: 'textarea', required: true },
    ],
  },
  sections,
])
export const Files: CollectionConfig = {
  slug: 'files',
  admin: { useAsTitle: 'title', group: 'Content' },
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
    staticDir: process.env.FILES_DIRECTORY || 'files',
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'publicApproved',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
