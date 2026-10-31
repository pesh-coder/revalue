import type { Block } from 'payload'
export const TableBlock: Block = {
  slug: 'data-table',
  interfaceName: 'DataTable',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    { name: 'caption', type: 'text', required: true },
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'cells',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 8,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
  ],
}
