import Link from 'next/link'
// Filter and pagination links. Kept free of server-only imports so both server pages and
// the browser-side list components (query-list.tsx) can use them.
export const editorialLink =
  'inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4 hover:text-forest-hover'
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
