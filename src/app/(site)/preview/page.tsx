import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mapPost } from '@/cms/content'
import { ArticlePage } from '@/components/site/article-page'
import { first } from '@/lib/content'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!process.env.DATABASE_URL)
    return (
      <main id="main" className="site-container py-8">
        <h1 className="font-serif text-headline-lg text-deep">
          Draft preview is not connected yet
        </h1>
        <p className="mt-4">Preview becomes available after the CMS is configured.</p>
      </main>
    )
  const slug = first((await searchParams).slug)
  if (!slug) notFound()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user)
    redirect(
      `/admin/login?redirect=${encodeURIComponent(`/preview?slug=${encodeURIComponent(slug)}`)}`,
    )
  const found = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    draft: true,
    user,
    overrideAccess: false,
    depth: 1,
    limit: 1,
  })
  const post = found.docs[0]
  if (!post) notFound()
  const article = mapPost(post)
  return (
    <>
      <div className="bg-deep px-4 py-3 text-center text-body-sm text-surface">
        Draft preview. Visible only to the team.{' '}
        <Link className="dark-focus inline-flex min-h-11 items-center underline" href="/admin">
          Return to the CMS
        </Link>
      </div>
      <ArticlePage slug={slug} format={article.format} articleOverride={article} />
    </>
  )
}
