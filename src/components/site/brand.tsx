import Link from 'next/link'
import { brand } from '@/lib/brand'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-7 shrink-0', className)}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M37 24A13 13 0 1 1 24 11"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="36.4" cy="11.6" r="4.5" fill="currentColor" />
    </svg>
  )
}

export function Brand() {
  return (
    <Link
      href="/"
      aria-label={`${brand.name}, home`}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 text-deep"
    >
      <BrandMark />
      <span className="font-serif text-2xl leading-none font-semibold tracking-tight">
        {brand.name}
      </span>
    </Link>
  )
}
