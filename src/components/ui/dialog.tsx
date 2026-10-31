'use client'
import * as React from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// shadcn Dialog structure retains Radix focus management and scroll locking.
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-deep/60" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn('fixed inset-0 z-50 bg-surface text-charcoal outline-none', className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-control border border-input-border">
            <X size={22} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
