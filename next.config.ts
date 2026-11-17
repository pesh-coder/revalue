import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
const config: NextConfig = {
  async headers() {
    return [{ source: '/preview', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] }]
  },
  // Searches used to run on /resources itself; that page is now cached, so send them on.
  async redirects() {
    return ['q', 'topic', 'format', 'page'].map((key) => ({
      source: '/resources',
      has: [{ type: 'query' as const, key }],
      destination: '/resources/search',
      permanent: true,
    }))
  },
  devIndicators: false,
  images: { formats: ['image/avif', 'image/webp'] },
}
export default withPayload(config)
