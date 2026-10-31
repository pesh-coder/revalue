/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
const payloadPost = REST_POST(config)
export const POST: typeof payloadPost = async (request, args) => {
  const reset = new URL(request.url).pathname === '/api/users/forgot-password'
  if (reset && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM))
    return Response.json(
      { message: 'Password reset is unavailable. Contact your administrator.' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    )
  const response = await payloadPost(request, args)
  // Provider failures and per-account throttling must not reveal which accounts exist.
  if (reset)
    return Response.json(
      {
        message:
          'If an account exists, the request has been received. Contact an administrator if no email arrives.',
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  return response
}
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
