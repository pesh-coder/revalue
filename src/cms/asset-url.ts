export function assetURL(value?: string | null) {
  if (!value) return ''
  if (value.startsWith('/')) return value
  const url = new URL(value)
  const origin = new URL(process.env.SITE_URL || 'http://localhost:3000').origin
  if (url.origin !== origin)
    throw new Error('Media must be served through the website access-controlled endpoint.')
  return `${url.pathname}${url.search}`
}
