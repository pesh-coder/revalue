import type { CollectionConfig } from 'payload'
import { enquiryTypes } from '@/lib/content-types'
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Enquiries',
    defaultColumns: ['name', 'organisation', 'type', 'deliveryState', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'organisation', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'type', type: 'select', required: true, options: [...enquiryTypes] },
    { name: 'message', type: 'textarea', required: true },
    { name: 'submissionId', type: 'text', required: true, unique: true, admin: { readOnly: true } },
    { name: 'messageHash', type: 'text', required: true, index: true, admin: { readOnly: true } },
    {
      name: 'deliveryState',
      type: 'select',
      options: ['pending', 'sent', 'failed'],
      defaultValue: 'pending',
      admin: { readOnly: true },
    },
    { name: 'deliveryAttempts', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'lastAttemptAt', type: 'date', admin: { readOnly: true } },
    { name: 'firstAttemptAt', type: 'date', admin: { readOnly: true } },
    { name: 'providerReference', type: 'text', admin: { readOnly: true } },
    { name: 'deliveryError', type: 'text', admin: { readOnly: true } },
    {
      name: 'retryNotification',
      type: 'ui',
      admin: { components: { Field: './components/admin/retry-enquiry#RetryEnquiry' } },
    },
  ],
}
export const EnquiryAttempts: CollectionConfig = {
  slug: 'enquiry-attempts',
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'ipHash', type: 'text', required: true, index: true }],
}
