import * as React from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn Button structure with Revalue tokens and dimensions.
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-semibold disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-forest text-on-forest hover:bg-forest-hover',
        onDark: 'dark-focus bg-surface text-deep hover:bg-neutral',
        outline: 'border border-input-border bg-transparent text-deep hover:bg-surface',
      },
      size: {
        default: 'min-h-12 px-5 py-3 text-body-md',
        sm: 'min-h-11 px-3.5 py-2 text-body-sm',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot.Root : 'button'
  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
