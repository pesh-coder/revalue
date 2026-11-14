import type { CollectionConfig } from 'payload'
import { enquiryTypes } from '@/lib/content-types'
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Contact form messages' },
  admin: {
    useAsTitle: 'name',
    group: 'Enquiries',
    defaultColumns: ['name', 'organisation', 'type', 'deliveryState', 'createdAt'],
    description:
      'Messages sent through the website contact form. They are read-only; reply to the sender by email.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'organisation', label: 'Organisation', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    {
      name: 'type',
      label: 'Enquiry type',
      type: 'select',
      required: true,
      options: [...enquiryTypes],
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    {
      name: 'deliveryState',
      label: 'Email notification',
      type: 'select',
      options: [
        { label: 'Waiting to send', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Whether the team was emailed about this message.',
      },
    },
    {
      name: 'retryNotification',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: './components/admin/retry-enquiry#RetryEnquiry' },
      },
    },
    {
      type: 'collapsible',
      label: 'Technical details',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'submissionId',
          label: 'Submission ID',
          type: 'text',
          required: true,
          unique: true,
          admin: { readOnly: true },
        },
        {
          name: 'messageHash',
          label: 'Message fingerprint',
          type: 'text',
          required: true,
          index: true,
          admin: { readOnly: true },
        },
        {
          name: 'deliveryAttempts',
          label: 'Send attempts',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        { name: 'lastAttemptAt', label: 'Last attempt', type: 'date', admin: { readOnly: true } },
        { name: 'firstAttemptAt', label: 'First attempt', type: 'date', admin: { readOnly: true } },
        {
          name: 'providerReference',
          label: 'Email provider reference',
          type: 'text',
          admin: { readOnly: true },
        },
        { name: 'deliveryError', label: 'Delivery error', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
}
export const EnquiryAttempts: CollectionConfig = {
  slug: 'enquiry-attempts',
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [{ name: 'ipHash', type: 'text', required: true, index: true }],
}
