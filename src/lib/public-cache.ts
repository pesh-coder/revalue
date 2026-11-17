import { unstable_cache } from 'next/cache'
// Public pages are rebuilt when content is published in Payload (see cms/updates.ts, which
// revalidates the 'revalue-public' tag). The daily refresh is only a safety net in case an
// on-publish refresh fails; it keeps unchanged pages served from cache instead of per visitor.
export const PUBLIC_REFRESH_SECONDS = 60 * 60 * 24
export const publicCache = <T>(key: string, load: () => Promise<T>) =>
  unstable_cache(load, [`revalue-v5:${key}`], {
    tags: ['revalue-public'],
    revalidate: PUBLIC_REFRESH_SECONDS,
  })
