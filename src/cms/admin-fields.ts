import type { Field } from 'payload'

// Display-only: shows where the document appears on the public website. Stores nothing.
export const siteLocation: Field = {
  name: 'siteLocation',
  type: 'ui',
  label: 'Where on the site',
  admin: {
    position: 'sidebar',
    components: {
      Field: './components/admin/site-location#SiteLocationField',
      Cell: './components/admin/site-location#SiteLocationCell',
    },
  },
}
