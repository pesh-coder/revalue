import { NextResponse, type NextRequest } from 'next/server'
export async function proxy(request: NextRequest) {
  if (process.env.REVALUE_CONTENT_MODE === 'review' || !process.env.DATABASE_URL)
    return NextResponse.next()
  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('./payload.config')
    const p = await getPayload({ config })
    const query = p.db.pool.query('SELECT gone FROM publication_records WHERE path=$1 LIMIT 1', [
      request.nextUrl.pathname.replace(/\/$/, ''),
    ])
    let timeout: ReturnType<typeof setTimeout> | undefined
    const record = await Promise.race([
      query.catch(() => null),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), 1500)
      }),
    ]).finally(() => clearTimeout(timeout))
    if (record?.rows[0]?.gone)
      return new Response(
        `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page unavailable | Revalue</title><link rel="stylesheet" href="/gone.css"></head><body><header><a href="/">Revalue</a></header><main><p>Page unavailable</p><h1>This page is no longer available.</h1><p>Browse our latest resources or contact the Revalue team.</p><nav aria-label="Next steps"><a href="/resources">Browse resources</a><a href="/contact">Contact us</a></nav></main></body></html>`,
        {
          status: 410,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
        },
      )
  } catch {
    /* A temporary database outage must not discard a warm published page. */
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/resources/:path*',
    '/projects/:path*',
    '/solutions/:path*',
    '/about',
    '/partners',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
  ],
}
