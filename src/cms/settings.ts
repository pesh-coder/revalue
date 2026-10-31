import type { Field, GlobalConfig } from 'payload'
import { queueGlobalChange } from './updates'
export const internalLink: Field = {
  name: 'href',
  type: 'text',
  required: true,
  validate: (v: unknown) =>
    (typeof v === 'string' && /^\/(?!\/)[^\\\s]*$/.test(v)) ||
    'Use an internal path beginning with one /.',
}
const linkFields: Field[] = [{ name: 'label', type: 'text', required: true }, internalLink]
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Navigation, footer and contact',
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      name: 'navigation',
      type: 'array',
      maxRows: 7,
      fields: [...linkFields, { name: 'children', type: 'array', fields: linkFields }],
    },
    { name: 'footerLinks', type: 'array', fields: linkFields },
    { name: 'tagline', type: 'text', required: true },
    { name: 'operator', type: 'text', required: true },
    { name: 'contactLabel', type: 'text', required: true },
    { name: 'contactEmail', type: 'email' },
  ],
  hooks: { afterChange: [queueGlobalChange] },
}
