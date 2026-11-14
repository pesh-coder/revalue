import type { ServerProps } from 'payload'
import { NavHamburger, NavWrapper } from '@payloadcms/next/client'
import { AdminMenu, type MenuSection } from './admin-menu'

// WordPress-style admin menu. Each section is shown only to users who can read it.
export function AdminNav({ payload, permissions, visibleEntities }: ServerProps) {
  const admin = payload.config.routes.admin
  const canRead = (type: 'collections' | 'globals', slug: string) =>
    Boolean(
      permissions?.[type]?.[slug]?.read &&
        (visibleEntities?.[type] as string[] | undefined)?.includes(slug),
    )
  const list = (slug: string) => `${admin}/collections/${slug}`
  const globalPage = (slug: string) => `${admin}/globals/${slug}`

  const sections: MenuSection[] = [
    { label: 'Dashboard', icon: 'dashboard', href: admin, exact: true, show: true },
    {
      label: 'Posts',
      icon: 'posts',
      href: list('posts'),
      show: canRead('collections', 'posts'),
      children: [
        { label: 'All posts', href: list('posts'), exact: true },
        { label: 'Add new post', href: `${list('posts')}/create` },
        { label: 'Topics', href: list('topics'), show: canRead('collections', 'topics') },
      ],
    },
    {
      label: 'Media',
      icon: 'media',
      href: list('media'),
      show: canRead('collections', 'media'),
      children: [
        { label: 'Images', href: list('media'), exact: true },
        { label: 'Upload image', href: `${list('media')}/create` },
        { label: 'Documents', href: list('files'), show: canRead('collections', 'files') },
      ],
    },
    {
      label: 'Pages',
      icon: 'pages',
      href: list('pages'),
      show: canRead('collections', 'pages'),
      children: [
        { label: 'All pages', href: list('pages'), exact: true },
        { label: 'Homepage', href: globalPage('homepage'), show: canRead('globals', 'homepage') },
      ],
    },
    { label: 'Projects', icon: 'projects', href: list('projects'), show: canRead('collections', 'projects') },
    { label: 'Solutions', icon: 'solutions', href: list('solutions'), show: canRead('collections', 'solutions') },
    { label: 'Tools', icon: 'tools', href: list('tools'), show: canRead('collections', 'tools') },
    { label: 'Enquiries', icon: 'enquiries', href: list('enquiries'), show: canRead('collections', 'enquiries') },
    {
      label: 'Appearance',
      icon: 'appearance',
      href: globalPage('site-settings'),
      show: canRead('globals', 'site-settings'),
      children: [{ label: 'Menus & footer', href: globalPage('site-settings') }],
    },
    {
      label: 'Users',
      icon: 'users',
      href: list('users'),
      show: canRead('collections', 'users'),
      children: [
        { label: 'All users', href: list('users'), exact: true },
        { label: 'Your profile', href: `${admin}/account` },
      ],
    },
    {
      label: 'Settings',
      icon: 'settings',
      href: list('content-updates'),
      show: canRead('collections', 'content-updates'),
      children: [{ label: 'Site refresh log', href: list('content-updates') }],
    },
  ]

  return (
    <NavWrapper baseClass="nav">
      <nav className="nav__wrap revalue-menu" aria-label="Admin menu">
        <AdminMenu sections={sections.filter((s) => s.show)} />
        <div className="nav__controls">
          <a className="revalue-menu__site" href="/" target="_blank" rel="noreferrer">
            View website ↗
          </a>
          <a className="revalue-menu__site" href={`${admin}${payload.config.admin.routes.logout}`}>
            Log out
          </a>
        </div>
      </nav>
      <div className="nav__header">
        <div className="nav__header-content">
          <NavHamburger baseClass="nav" />
        </div>
      </div>
    </NavWrapper>
  )
}
