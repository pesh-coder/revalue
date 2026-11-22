import Link from 'next/link'
import { brand } from '@/lib/brand'
import { cn } from '@/lib/utils'
import { SunriseMark } from '@/components/brand-mark'

export function BrandMark({ className, tile }: { className?: string; tile?: boolean }) {
  return <SunriseMark className={cn('size-7 shrink-0', className)} tile={tile} />
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
