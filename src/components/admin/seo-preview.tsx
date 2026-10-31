'use client'
import { useFormFields } from '@payloadcms/ui'
export function SEOPreview() {
  const title = useFormFields(([fields]) =>
    String(fields.metaTitle?.value || fields.title?.value || 'Article title'),
  )
  const description = useFormFields(([fields]) =>
    String(fields.metaDescription?.value || fields.excerpt?.value || 'Add a useful summary.'),
  )
  const slug = useFormFields(([fields]) => String(fields.slug?.value || 'article-url'))
  const format = useFormFields(([fields]) => (fields.format?.value === 'Guide' ? 'guides' : 'blog'))
  return (
    <section className="revalue-seo-preview" aria-label="Search result preview">
      <p>Search result preview</p>
      <p>
        /resources/{format}/{slug}
      </p>
      <h3>{title}</h3>
      <p>{description}</p>
      <small>Search engines may choose different wording.</small>
    </section>
  )
}
