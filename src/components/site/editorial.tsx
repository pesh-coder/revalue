import Link from 'next/link'
import { cn } from '@/lib/utils'

export function SectionHeading({
  id,
  children,
  href,
  linkLabel,
  className,
}: {
  id: string
  children: React.ReactNode
  href?: string
  linkLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn('mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1', className)}
    >
      <h2 id={id} className="font-serif text-headline-md text-deep">
        {children}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex min-h-11 items-center text-body-sm font-semibold text-forest hover:underline hover:underline-offset-4"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

// Shared for subsequent index/detail pages: compact introduction, no decorative rules.
export function PageIntro({
  label,
  title,
  children,
}: {
  label?: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="site-container pt-6 pb-8 md:pt-8 md:pb-10">
      <div className="max-w-4xl">
        {label && <p className="kicker mb-2 text-forest">{label}</p>}
        <h1 className="font-serif text-headline-lg text-deep">{title}</h1>
        {children && <div className="mt-3 max-w-prose text-body-lg text-muted">{children}</div>}
      </div>
    </div>
  )
}
