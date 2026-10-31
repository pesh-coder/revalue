import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Photo({
  src,
  alt,
  className,
  sizes,
  priority = false,
  position,
  unoptimized = false,
}: {
  src: string
  alt: string
  className?: string
  sizes: string
  priority?: boolean
  position?: string
  unoptimized?: boolean
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-media bg-photo', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={cn('object-cover', position)}
      />
    </div>
  )
}
