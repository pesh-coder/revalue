import Link from 'next/link'
import { PageIntro } from '@/components/site/editorial'
import { buttonVariants } from '@/components/ui/button'
export default function NotFound() {
  return (
    <main id="main">
      <PageIntro label="Page not found" title="We could not find that page.">
        It may have moved. Try searching, or go back to Resources.
      </PageIntro>
      <div className="site-container pb-10">
        <Link href="/resources" className={buttonVariants()}>
          Go to Resources
        </Link>
      </div>
    </main>
  )
}
