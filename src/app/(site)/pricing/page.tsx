import type { Metadata } from 'next'
import { CompanyPage } from '@/components/site/company-page'
export const metadata: Metadata = { title: 'How pricing works' }
export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <CompanyPage slug="pricing" searchParams={searchParams} />
}
