'use client'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
export default function ResourceError() {
  return (
    <main id="main" className="site-container py-10">
      <h1 className="font-serif text-headline-lg text-deep">
        Resources are temporarily unavailable
      </h1>
      <p className="mt-4">Search is not working right now. Browse by topic instead.</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button className={buttonVariants()} onClick={() => location.reload()}>
          Try again
        </button>
        <Link className={buttonVariants({ variant: 'outline' })} href="/">
          Go to Home
        </Link>
      </div>
    </main>
  )
}
