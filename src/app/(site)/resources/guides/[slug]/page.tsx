import type { Metadata } from 'next'
import { getCatalog } from '@/lib/content'
import { ArticlePage } from '@/components/site/article-page'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { articles } = await getCatalog()
  const a = articles.find((a) => a.slug === slug && a.format === 'Guide')
  return {
    title: a?.metaTitle || a?.title || 'Article not found',
    description: a?.metaDescription || a?.excerpt,
    openGraph: a
      ? {
          title: a.metaTitle || a.title,
          description: a.metaDescription || a.excerpt,
          type: 'article',
          publishedTime: a.publishedAt,
          images: a.socialImage || a.image ? [{ url: a.socialImage || a.image! }] : [],
        }
      : undefined,
  }
}
export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ArticlePage slug={slug} format="Guide" />
}
