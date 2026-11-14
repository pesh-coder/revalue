import type { Field, GlobalConfig } from 'payload'
import { queueGlobalChange } from './updates'
export const internalLink: Field = {
  name: 'href',
  label: 'Links to',
  type: 'text',
  required: true,
  validate: (v: unknown) =>
    (typeof v === 'string' && /^\/(?!\/)[^\\\s]*$/.test(v)) ||
    'Use an internal path beginning with one /.',
  admin: { description: 'A page on this site, starting with /, e.g. /about' },
}
const linkFields: Field[] = [
  { name: 'label', label: 'Menu text', type: 'text', required: true },
  internalLink,
]
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Menus, footer & contact',
  admin: {
    group: 'Settings',
    description:
      'The main menu at the top of every page, the footer links, and the contact details. Save a draft, then Publish.',
  },
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main menu',
          fields: [
            {
              name: 'navigation',
              label: 'Menu items',
              labels: { singular: 'Menu item', plural: 'Menu items' },
              type: 'array',
              maxRows: 7,
              admin: { description: 'Up to 7 items. Drag to reorder.' },
              fields: [
                ...linkFields,
                {
                  name: 'children',
                  label: 'Drop-down items',
                  labels: { singular: 'Drop-down item', plural: 'Drop-down items' },
                  type: 'array',
                  fields: linkFields,
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerLinks',
              label: 'Footer links',
              labels: { singular: 'Link', plural: 'Links' },
              type: 'array',
              fields: linkFields,
            },
            { name: 'tagline', label: 'Tagline', type: 'text', required: true },
            {
              name: 'operator',
              label: 'Operated by',
              type: 'text',
              required: true,
              admin: { description: 'The company line shown in the footer.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactLabel', label: 'Contact link text', type: 'text', required: true },
            { name: 'contactEmail', label: 'Contact email', type: 'email' },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [queueGlobalChange] },
}
