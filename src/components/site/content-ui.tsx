import Link from 'next/link'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Photo } from './photo'
import { dateLabel } from '@/lib/content'
import type { Article, Body } from '@/lib/content-types'
import { buttonVariants } from '@/components/ui/button'
import { richTextConverters } from './rich-text-table'

export const editorialLink =
  'inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4 hover:text-forest-hover'
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="site-container pt-4">
      <ol className="flex flex-wrap items-center gap-x-2 text-body-sm text-muted">
        <li>
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-forest">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <CaretRight size={12} aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center hover:text-forest"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
export function BodyContent({ body }: { body: Body }) {
  return <RichText data={body} converters={richTextConverters} className="article-body" />
}
export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article
  featured?: boolean
}) {
  const href = `/resources/${article.format === 'Guide' ? 'guides' : 'blog'}/${article.slug}`
  return (
    <article className="min-w-0">
      {article.image && (
        <Link href={href} aria-hidden="true" tabIndex={-1}>
          <Photo
            src={article.image}
            alt=""
            className="aspect-3/2 rounded-none"
            sizes={
              featured
                ? '(min-width: 1024px) 65vw, 100vw'
                : '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
            }
          />
        </Link>
      )}
      <div className="mt-4 flex flex-col items-start gap-2">
        <Link
          href={`/resources/${article.topicSlug}`}
          className="kicker inline-flex min-h-11 items-center text-forest"
        >
          {article.topic}
        </Link>
        <h2
          className={`font-serif text-deep ${featured ? 'text-headline-feature' : 'text-headline-md'}`}
        >
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {article.title}
          </Link>
        </h2>
        <p>{article.excerpt}</p>
        <p className="text-body-sm text-muted">
          By {article.author} | {dateLabel(article.publishedAt)}
        </p>
      </div>
    </article>
  )
}
export function FilterLinks({
  label,
  options,
  selected,
  href,
}: {
  label: string
  options: { label: string; value: string }[]
  selected: string
  href: (value: string) => string
}) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Link
          key={option.value}
          href={href(option.value)}
          aria-current={selected === option.value ? 'page' : undefined}
          className={`inline-flex min-h-11 items-center rounded-control px-3 py-2 text-body-sm font-semibold ${selected === option.value ? 'bg-deep text-surface' : 'bg-transparent text-muted hover:bg-border/40 hover:text-deep'}`}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  )
}
export function Pagination({
  current,
  total,
  href,
}: {
  current: number
  total: number
  href: (page: number) => string
}) {
  if (total <= 1) return null
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const pages = Array.from({ length: Math.min(5, total) }, (_, i) => start + i)
  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center gap-2">
      {current > 1 && (
        <Link className={editorialLink} href={href(current - 1)}>
          Previous
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === current ? 'page' : undefined}
          className={`inline-flex size-11 items-center justify-center rounded-control ${p === current ? 'bg-deep text-surface' : 'text-forest hover:bg-border/40'}`}
        >
          {p}
        </Link>
      ))}
      {current < total && (
        <Link className={editorialLink} href={href(current + 1)}>
          Next
        </Link>
      )}
    </nav>
  )
}
export function ContactCallout({
  title = 'Have a waste problem you want to understand?',
  label = 'Talk to us',
  type,
}: {
  title?: string
  label?: string
  type?: string
}) {
  return (
    <aside className="bg-deep p-6 text-surface">
      <h2 className="font-serif text-headline-md">{title}</h2>
      <Link
        href={type ? `/contact?type=${encodeURIComponent(type)}` : '/contact'}
        className={buttonVariants({ variant: 'onDark', className: 'mt-4' })}
      >
        {label}
      </Link>
    </aside>
  )
}
export function EmptyState({
  title,
  href,
  label,
}: {
  title: string
  href?: string
  label?: string
}) {
  return (
    <div className="py-8">
      <p className="font-serif text-headline-md text-deep">{title}</p>
      {href && label && (
        <Link className={`${editorialLink} mt-3`} href={href}>
          {label}
        </Link>
      )}
    </div>
  )
}
