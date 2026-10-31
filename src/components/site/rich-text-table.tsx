import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
type Table = {
  caption: string
  columns: { label: string }[]
  rows: { cells: { text: string }[] }[]
}
export const richTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    'data-table': ({ node }: { node: { fields: unknown } }) => {
      const table = node.fields as unknown as Table
      return (
        <div className="my-6 overflow-x-auto" role="region" aria-label={table.caption} tabIndex={0}>
          <table className="w-full text-left text-body-md">
            <caption className="mb-3 text-left font-semibold text-deep">{table.caption}</caption>
            <thead>
              <tr>
                {(table.columns || []).map((column, i) => (
                  <th key={i} scope="col" className="bg-border/30 px-3 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(table.rows || []).map((row, i) => (
                <tr key={i}>
                  {(table.columns || []).map((_, j) => (
                    <td key={j} className="border-b border-border px-3 py-3 align-top">
                      {row.cells?.[j]?.text || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  },
})
