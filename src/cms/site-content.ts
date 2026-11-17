import type { Access, CollectionConfig, Field, FieldAccess } from 'payload'
import { queueContentChange, queueContentDelete } from './updates'
import { validateUpload, validateCloudUpload } from './upload-validation'
import { freezePublishedURL, recordPublication, recordDeletion } from './publication'
import { siteLocation } from './admin-fields'
const team: Access = ({ req }) => Boolean(req.user)
const admin: Access = ({ req }) => req.user?.role === 'admin'
const published: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })
const adminField: FieldAccess = ({ req }) => req.user?.role === 'admin'
const adminOnly = { create: adminField, update: adminField }
const baseFields = (slugHint: string): Field[] => [
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
    admin: { description: slugHint },
  },
]
const frozenSlug =
  'Lowercase words joined by hyphens. It cannot be changed after the page is published.'
const sections: Field = {
  name: 'sections',
  label: 'Content sections',
  labels: { singular: 'Section', plural: 'Sections' },
  type: 'array',
  admin: { description: 'Each section is a heading with a paragraph of text underneath.' },
  fields: [
    { name: 'title', label: 'Section heading', type: 'text', required: true },
    { name: 'text', label: 'Section text', type: 'textarea', required: true },
  ],
}
const summary: Field = {
  name: 'excerpt',
  label: 'Summary',
  type: 'textarea',
  required: true,
  admin: { description: 'One or two sentences shown on cards and in search results.' },
}
type EditorialOptions = {
  labels: { singular: string; plural: string }
  group: string
  description: string
  slugHint: string
  defaultColumns?: string[]
}
const editorial = (slug: string, options: EditorialOptions, fields: Field[]): CollectionConfig => ({
  slug,
  labels: options.labels,
  admin: {
    useAsTitle: 'title',
    group: options.group,
    description: options.description,
    defaultColumns: options.defaultColumns || ['title', 'slug', '_status', 'updatedAt'],
  },
  access: { read: published, create: team, update: team, delete: admin },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [siteLocation, ...baseFields(options.slugHint), ...fields],
  hooks: {
    beforeChange: [
      ({ data, collection }) => {
        if (
          collection.slug === 'topics' &&
          ['blog', 'guides', 'tools', 'search'].includes(data.slug)
        )
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
export const Projects = editorial(
  'projects',
  {
    labels: { singular: 'Project', plural: 'Projects' },
    group: 'Website pages',
    description: 'Revalue projects shown under /projects. Only admins can change a project stage.',
    slugHint: `The end of the address, e.g. /projects/smart-bin. ${frozenSlug}`,
    defaultColumns: ['title', 'stage', '_status', 'updatedAt'],
  },
  [
    summary,
    {
      name: 'stage',
      label: 'Project stage',
      type: 'select',
      required: true,
      options: ['Concept', 'In development', 'Testing', 'Pilot', 'Completed', 'Published research'],
      defaultValue: 'Concept',
      access: adminOnly,
      admin: {
        position: 'sidebar',
        description: 'Admins only. Never mark a stage the project has not actually reached.',
      },
    },
    {
      name: 'image',
      label: 'Featured image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    sections,
  ],
)
export const Solutions = editorial(
  'solutions',
  {
    labels: { singular: 'Solution', plural: 'Solutions' },
    group: 'Website pages',
    description: 'Services shown under /solutions. Only admins can change availability.',
    slugHint: `The end of the address, e.g. /solutions/waste-audits. ${frozenSlug}`,
    defaultColumns: ['title', 'availability', '_status', 'updatedAt'],
  },
  [
    summary,
    {
      name: 'availability',
      label: 'Availability',
      type: 'select',
      required: true,
      options: ['Available', 'In development', 'Exploring'],
      defaultValue: 'Exploring',
      access: adminOnly,
      admin: { position: 'sidebar', description: 'Admins only.' },
    },
    {
      name: 'audience',
      label: 'Who this is for',
      type: 'textarea',
      required: true,
    },
    sections,
  ],
)
export const Topics = editorial(
  'topics',
  {
    labels: { singular: 'Topic', plural: 'Topics' },
    group: 'Posts',
    description: 'Categories that group posts, guides and tools, e.g. Waste audits.',
    slugHint: `The end of the address, e.g. /resources/waste-audits. "blog", "guides", "tools" and "search" are reserved. ${frozenSlug}`,
  },
  [
    {
      name: 'introduction',
      label: 'Introduction',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown at the top of the topic page.' },
    },
  ],
)
export const Tools = editorial(
  'tools',
  {
    labels: { singular: 'Tool', plural: 'Tools & downloads' },
    group: 'Website pages',
    description:
      'Downloadable tools and templates under /resources/tools. A tool only goes public once an admin approves its release.',
    slugHint: `The end of the address, e.g. /resources/tools/waste-audit-sheet. ${frozenSlug}`,
    defaultColumns: ['title', 'publicReleaseApproved', '_status', 'updatedAt'],
  },
  [
    summary,
    { name: 'audience', label: 'Who this is for', type: 'text', required: true },
    {
      name: 'format',
      label: 'Format',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Spreadsheet, PDF checklist.' },
    },
    {
      name: 'publicReleaseApproved',
      label: 'Approved for public release',
      type: 'checkbox',
      defaultValue: false,
      access: adminOnly,
      admin: {
        position: 'sidebar',
        description: 'Admins only. The tool stays hidden from the website until this is ticked.',
      },
    },
    {
      name: 'file',
      label: 'Download file',
      type: 'upload',
      relationTo: 'files',
      admin: { position: 'sidebar', description: 'Upload it under Media Library › Documents.' },
    },
    {
      name: 'versionDate',
      label: 'Version date',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'instructions',
      label: 'How to use it',
      labels: { singular: 'Step', plural: 'Steps' },
      type: 'array',
      fields: [{ name: 'step', label: 'Step', type: 'text', required: true }],
    },
  ],
)
Tools.access = {
  ...Tools.access,
  read: ({ req }) =>
    req.user ? true : { _status: { equals: 'published' }, publicReleaseApproved: { equals: true } },
}
export const Pages = editorial(
  'pages',
  {
    labels: { singular: 'Page', plural: 'Pages' },
    group: 'Website pages',
    description:
      'Fixed website pages such as About, Partners, Pricing and Contact. Fill in only the boxes the page uses.',
    defaultColumns: ['siteLocation', 'title', '_status', 'updatedAt'],
    slugHint:
      'Must be one of the existing pages: about, partners, pricing, contact, privacy, terms, resources, resources-blog, resources-guides, resources-tools, projects-index or solutions-index.',
  },
  [
    { name: 'introduction', label: 'Introduction', type: 'textarea' },
    { name: 'body', label: 'Content', type: 'richText' },
    {
      name: 'image',
      label: 'Featured image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Principles (About page)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'principlesHeading', label: 'Heading', type: 'text' },
        {
          name: 'principles',
          label: 'Principles',
          labels: { singular: 'Principle', plural: 'Principles' },
          type: 'array',
          fields: [{ name: 'text', label: 'Principle', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Team (About page)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'teamHeading', label: 'Heading', type: 'text' },
        { name: 'teamIntroduction', label: 'Introduction', type: 'textarea' },
        {
          name: 'people',
          label: 'Team members',
          labels: { singular: 'Person', plural: 'People' },
          type: 'array',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'role', label: 'Role', type: 'text', required: true },
            {
              name: 'initials',
              label: 'Initials',
              type: 'text',
              required: true,
              admin: { description: 'Shown in place of a photo, e.g. PS.' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Audiences (Partners page)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'audiences',
          label: 'Audiences',
          labels: { singular: 'Audience', plural: 'Audiences' },
          type: 'array',
          fields: [{ name: 'text', label: 'Audience', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pricing table (Pricing page)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'pricingRows',
          label: 'Pricing rows',
          labels: { singular: 'Row', plural: 'Rows' },
          type: 'array',
          fields: [
            { name: 'offering', label: 'Offering', type: 'text', required: true },
            {
              name: 'factors',
              label: 'What affects the price',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    sections,
  ],
)
export const Files: CollectionConfig = {
  slug: 'files',
  labels: { singular: 'Document', plural: 'Documents' },
  admin: {
    useAsTitle: 'title',
    group: 'Media Library',
    defaultColumns: ['title', 'filename', 'publicApproved', 'updatedAt'],
    description:
      'Downloadable files: PDF, Excel (.xlsx) or CSV, up to 15 MB. A document is only downloadable once an admin approves it.',
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
    staticDir: process.env.FILES_DIRECTORY || 'files',
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    {
      name: 'publicApproved',
      label: 'Approved for public download',
      type: 'checkbox',
      defaultValue: false,
      access: adminOnly,
      admin: {
        position: 'sidebar',
        description: 'Admins only. Unapproved documents cannot be downloaded from the website.',
      },
    },
  ],
}
