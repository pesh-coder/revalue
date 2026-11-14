'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { useNav, useWindowInfo } from '@payloadcms/ui'

// Payload starts the sidebar closed on screens up to 1440px wide, which covers most laptops.
// WordPress keeps its menu visible down to about 960px, so open it once on load for those screens.
export function OpenMenu({ children }: { children?: ReactNode }) {
  const { hydrated, setNavOpen } = useNav()
  const {
    breakpoints: { l: largeBreak },
  } = useWindowInfo()
  const done = useRef(false)
  useEffect(() => {
    if (!hydrated || !largeBreak || done.current) return
    done.current = true
    // Wait for Payload's own breakpoint handler, which closes the menu, to finish first.
    const timer = setTimeout(() => {
      if (window.matchMedia('(min-width: 961px)').matches) setNavOpen(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [hydrated, largeBreak, setNavOpen])
  return <>{children}</>
}
