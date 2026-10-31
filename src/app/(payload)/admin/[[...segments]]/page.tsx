/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  process.env.DATABASE_URL
    ? generatePageMetadata({ config, params, searchParams })
    : Promise.resolve({ title: 'Revalue CMS setup', robots: { index: false, follow: false } })

const Page = ({ params, searchParams }: Args) =>
  process.env.DATABASE_URL ? RootPage({ config, params, searchParams, importMap }) : null

export default Page
