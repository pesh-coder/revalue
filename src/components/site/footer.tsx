import Link from 'next/link'
import { BrandMark } from './brand'
import type { SiteSettings } from '@/lib/site-settings'

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-deep text-surface">
      <div className="site-container grid items-start gap-5 py-8 md:grid-cols-[auto_1fr_auto] md:gap-x-8">
        <BrandMark className="size-9" />
        <p className="font-serif text-headline-md">{settings.tagline}</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6">
            {settings.footerLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="dark-focus inline-flex min-h-11 items-center underline underline-offset-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-body-sm md:col-span-3">{settings.operator}</p>
      </div>
    </footer>
  )
}
