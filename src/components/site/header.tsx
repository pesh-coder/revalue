'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X, CaretRight, CaretLeft } from '@phosphor-icons/react'
import { Brand } from './brand'
import type { SiteSettings } from '@/lib/site-settings'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const navigation = settings.navigation
  const children = Object.fromEntries(
    navigation.filter((item) => item.children?.length).map((item) => [item.label, item.children!]),
  )
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<string | null>(null)
  const backButton = useRef<HTMLButtonElement>(null)
  const parentButtons = useRef<Partial<Record<string, HTMLButtonElement | null>>>({})
  useEffect(() => {
    if (open && panel) backButton.current?.focus()
  }, [open, panel])
  const menuRow =
    'flex min-h-16 w-full items-center justify-between gap-4 border-b border-border py-4 text-left font-serif text-headline-md text-deep'
  return (
    <header className="border-b border-border bg-neutral">
      <div className="site-container flex min-h-16 items-center gap-3">
        <div className="mr-auto">
          <Brand />
        </div>
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex gap-7">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center border-b-2 border-transparent hover:text-forest hover:underline hover:underline-offset-4',
                      active && 'border-deep',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <Link href="/contact" className={buttonVariants({ size: 'sm' })}>
          {settings.contactLabel}
        </Link>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            if (!value) setPanel(null)
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-input-border text-deep lg:hidden"
            >
              <List size={22} aria-hidden="true" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="fixed inset-0 flex h-dvh max-h-dvh w-full max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-surface p-0 shadow-none"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">Menu</DialogTitle>
            <div className="flex min-h-16 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
              <DialogClose asChild>
                <Link href="/" aria-label="Revalue, home">
                  <span className="font-serif text-2xl font-semibold text-deep">Revalue</span>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="inline-flex size-11 items-center justify-center rounded-control border border-input-border text-deep"
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </DialogClose>
            </div>
            <div className="relative flex-1 overflow-y-auto px-4 py-6 md:px-6">
              <div
                inert={Boolean(panel)}
                className={cn(
                  'transition-[transform,opacity] duration-overlay ease-out',
                  panel ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100',
                )}
              >
                <nav aria-label="Mobile navigation">
                  <ul>
                    {navigation.map((item) => (
                      <li key={item.href}>
                        {item.children?.length ? (
                          <button
                            type="button"
                            ref={(node) => {
                              parentButtons.current[item.label as string] = node
                            }}
                            className={menuRow}
                            onClick={() => setPanel(item.label as string)}
                          >
                            {item.label}
                            <CaretRight size={24} aria-hidden="true" />
                          </button>
                        ) : (
                          <DialogClose asChild>
                            <Link className={menuRow} href={item.href}>
                              {item.label}
                            </Link>
                          </DialogClose>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div
                inert={!panel}
                className={cn(
                  'absolute inset-x-4 top-6 transition-[transform,opacity] duration-overlay ease-out md:inset-x-6',
                  panel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
                )}
              >
                <button
                  ref={backButton}
                  type="button"
                  onClick={() => {
                    const previous = panel
                    setPanel(null)
                    requestAnimationFrame(() => {
                      if (previous) parentButtons.current[previous]?.focus()
                    })
                  }}
                  className="mb-6 inline-flex min-h-11 items-center gap-2 font-semibold text-forest"
                >
                  <CaretLeft size={20} aria-hidden="true" />
                  Menu
                </button>
                <p className="kicker mb-4">{panel}</p>
                <nav aria-label={String(panel || 'Child navigation')}>
                  <ul>
                    {panel &&
                      children[panel]?.map((item) => (
                        <li key={item.href}>
                          <DialogClose asChild>
                            <Link className={menuRow} href={item.href}>
                              {item.label}
                            </Link>
                          </DialogClose>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-4 border-t border-border p-4 pb-[max(24px,env(safe-area-inset-bottom))] md:p-6">
              <DialogClose asChild>
                <Link href="/contact" className={buttonVariants()}>
                  {settings.contactLabel}
                </Link>
              </DialogClose>
              <div className="flex gap-6">
                {settings.footerLinks.map(({ label, href }) => (
                  <DialogClose asChild key={href}>
                    <Link
                      href={href}
                      className="inline-flex min-h-11 items-center text-forest underline underline-offset-4"
                    >
                      {label}
                    </Link>
                  </DialogClose>
                ))}
              </div>
              <p className="text-body-sm text-muted">{settings.tagline}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
