'use client'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
export default function ErrorPage() {
  return (
    <main id="main" className="site-container py-10">
      <h1 className="font-serif text-headline-lg text-deep">
        This page is temporarily unavailable
      </h1>
      <p className="mt-4">Please try again in a moment.</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button className={buttonVariants()} onClick={() => location.reload()}>
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Go to Home
        </Link>
      </div>
    </main>
  )
}
