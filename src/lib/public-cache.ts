import { unstable_cache } from 'next/cache'
export const publicCache = <T>(key: string, load: () => Promise<T>) =>
  unstable_cache(load, [`revalue-v4:${key}`], { tags: ['revalue-public'], revalidate: 60 })
