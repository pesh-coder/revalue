export function hasSameOrigin(request: Request, configuredOrigin?: string) {
  const origin = request.headers.get('origin')
  if (!origin || origin === 'null') return false
  try {
    const expected = configuredOrigin
      ? new URL(configuredOrigin).origin
      : `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`
    return new URL(origin).origin === expected
  } catch {
    return false
  }
}
export function secureCookiesForOrigin(origin?: string) {
  return Boolean(origin && new URL(origin).protocol === 'https:')
}
