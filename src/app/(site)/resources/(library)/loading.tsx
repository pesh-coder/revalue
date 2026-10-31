export default function Loading() {
  return (
    <main id="main" className="site-container py-8" aria-busy="true" aria-label="Loading resources">
      <p className="sr-only" role="status">
        Loading resources
      </p>
      <div className="h-10 w-2/3 bg-border/50" />
      <div className="mt-6 h-12 w-full bg-border/30" />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="aspect-3/2 bg-border/40" />
        <div className="aspect-3/2 bg-border/20" />
      </div>
    </main>
  )
}
