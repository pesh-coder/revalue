'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useConfig } from '@payloadcms/ui'

export function NavLinks() {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  const active = pathname === admin || pathname === `${admin}/`
  return (
    <div className="revalue-nav-top">
      <Link
        href={admin}
        className={`revalue-nav-top__link${active ? ' revalue-nav-top__link--active' : ''}`}
        aria-current={active ? 'page' : undefined}
      >
        Dashboard
      </Link>
      <a className="revalue-nav-top__link" href="/" target="_blank" rel="noreferrer">
        View website ↗
      </a>
    </div>
  )
}
