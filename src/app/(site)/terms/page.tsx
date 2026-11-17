import type { Metadata } from 'next'
import { CompanyPage } from '@/components/site/company-page'
export const metadata: Metadata = { title: 'Terms' }
export default function Page() {
  return <CompanyPage slug="terms" />
}
