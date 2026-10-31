import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
const config: NextConfig = {
  async headers() {
    return [{ source: '/preview', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] }]
  },
  devIndicators: false,
  images: { formats: ['image/avif', 'image/webp'] },
}
export default withPayload(config)
