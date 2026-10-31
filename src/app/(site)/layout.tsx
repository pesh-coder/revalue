import type { Metadata } from 'next'
import { Newsreader, Source_Sans_3 } from 'next/font/google'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import './globals.css'
import { getSiteSettings } from '@/lib/site-settings'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-newsreader',
  display: 'swap',
})
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: { default: 'Revalue: Waste has value', template: '%s | Revalue' },
  description:
    'Revalue helps organisations see what they throw away, separate it better, and find out what can be recovered.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <html lang="en" className={`${newsreader.variable} ${sourceSans.variable}`}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-32 rounded-control bg-surface px-6 py-4 font-semibold text-deep focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader settings={settings} />
        {children}
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
