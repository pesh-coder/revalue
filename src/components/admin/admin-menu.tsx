'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChatCircleText,
  FolderOpen,
  Gauge,
  Gear,
  Images,
  Lightbulb,
  Note,
  PaintBrush,
  PushPin,
  UsersThree,
  Wrench,
  type Icon,
} from '@phosphor-icons/react'

const icons: Record<string, Icon> = {
  dashboard: Gauge,
  posts: PushPin,
  media: Images,
  pages: Note,
  projects: FolderOpen,
  solutions: Lightbulb,
  tools: Wrench,
  enquiries: ChatCircleText,
  appearance: PaintBrush,
  users: UsersThree,
  settings: Gear,
}

type MenuLink = { label: string; href: string; exact?: boolean; show?: boolean }
export type MenuSection = MenuLink & { icon: string; show: boolean; children?: MenuLink[] }

const matches = (pathname: string, link: MenuLink) =>
  link.exact
    ? pathname === link.href
    : pathname === link.href || pathname.startsWith(`${link.href}/`)

export function AdminMenu({ sections }: { sections: MenuSection[] }) {
  const pathname = usePathname()
  return (
    <ul className="revalue-menu__list">
      {sections.map((section) => {
        const children = section.children?.filter((c) => c.show !== false) || []
        const open =
          matches(pathname, { ...section, exact: section.exact }) ||
          children.some((c) => matches(pathname, { ...c, exact: false }))
        const Glyph = icons[section.icon]
        return (
          <li key={section.label} className={`revalue-menu__item${open ? ' is-open' : ''}`}>
            <Link
              href={section.href}
              className="revalue-menu__link"
              aria-current={open && !children.length ? 'page' : undefined}
            >
              {Glyph && <Glyph size={20} weight={open ? 'fill' : 'regular'} aria-hidden="true" />}
              <span>{section.label}</span>
            </Link>
            {open && children.length > 0 && (
              <ul className="revalue-menu__sub">
                {children.map((child) => {
                  const current = matches(pathname, child)
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`revalue-menu__sublink${current ? ' is-current' : ''}`}
                        aria-current={current ? 'page' : undefined}
                      >
                        {child.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
