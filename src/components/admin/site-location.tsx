'use client'
import type { DefaultCellComponentProps } from 'payload'
import Link from 'next/link'
import { useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { pageNames, publicPath } from '@/lib/site-paths'

const describe = (collection: string, slug: string, format?: string | null) => ({
  name: collection === 'pages' ? pageNames[slug] || 'Website page' : undefined,
  path: slug ? publicPath(collection, { slug, format }) : '',
})

// List column: "About page · /about"
// When it is the first column it doubles as the link into the editor, like the default title cell.
export function SiteLocationCell({ rowData, collectionSlug, link, linkURL }: DefaultCellComponentProps) {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  const { name, path } = describe(collectionSlug, String(rowData?.slug || ''), rowData?.format)
  const content = (
    <>
      {name && <strong>{name}</strong>}
      <span>{path}</span>
    </>
  )
  return link ? (
    <Link
      href={linkURL || `${admin}/collections/${collectionSlug}/${rowData.id}`}
      className="revalue-location-cell"
    >
      {content}
    </Link>
  ) : (
    <span className="revalue-location-cell">{content}</span>
  )
}

// Edit screen sidebar box with a link to the live page.
export function SiteLocationField() {
  const { collectionSlug = '', id, initialData } = useDocumentInfo()
  const slug = useFormFields(([fields]) => String(fields.slug?.value || ''))
  const format = useFormFields(([fields]) => fields.format?.value as string | undefined)
  const { name, path } = describe(collectionSlug, slug, format)
  const published = initialData?._status === 'published' || Boolean(initialData?.publishedAt)
  return (
    <div className="revalue-location">
      <p className="revalue-location__label">Where on the website</p>
      {name && <p className="revalue-location__name">{name}</p>}
      <p className="revalue-location__path">{path || 'Add a web address to see where this appears.'}</p>
      {id && path && published ? (
        <a href={path} target="_blank" rel="noreferrer" className="revalue-location__view">
          View on website ↗
        </a>
      ) : (
        id && path && <p className="revalue-location__note">Visible on the website after you publish.</p>
      )}
    </div>
  )
}
