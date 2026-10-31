# Hosting connection and first deployment

The local prototype uses real PostgreSQL and Payload. Hosted operations remain a separate verification step. Do not copy the local review database, temporary Admin account, private uploads, backups or `.env.local` into GitHub.

## Accounts to prepare

1. GitHub repository: https://github.com/pesh-coder/revalue
2. Vercel project connected to the repository, with a Node version satisfying `package.json`.
3. A dedicated Neon production database. Keep preview/test data separate.
4. A private Cloudflare R2 Standard bucket, for example `revalue-media`. Leave the public development URL and custom-domain access disabled. Use a bucket-scoped Object Read and Write S3 credential, stored only in environment settings.
5. The existing Resend account, a verified sending domain, a separate sending-only Revalue API key and a receiving team inbox.
6. Website domain and DNS access.

The S3 adapter also supports other private S3-compatible providers. Cloudflare R2's free usage allowance is metered, not unlimited. Check the hosting plan's permitted business use and current provider quotas before public launch.

## Environment

Set `REVALUE_CONTENT_MODE=cms`, `DATABASE_URL`, a strong `PAYLOAD_SECRET` and the correct `SITE_URL`. Use the provider's TLS-enabled database connection string. Set `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION=auto`, `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`. The R2 endpoint is the S3 API endpoint shown in the dashboard, not an `r2.dev` public URL. No storage credentials go in browser code.

For direct browser uploads, configure bucket CORS with only the actual site and private-preview origins. Allow PUT, GET and HEAD; allow Content-Type and If-None-Match headers, and expose ETag. The bucket stays private. Payload checks upload authorisation and file policy; its file endpoint checks release approval before returning bytes. The adapter downloads direct uploads for byte validation before accepting new metadata. Verify this against the actual bucket before relying on hosted uploads.

Set `RESEND_API_KEY`, `EMAIL_FROM` and `EMAIL_TO`. Keep `ENQUIRIES_ENABLED=false` until a synthetic browser enquiry is stored and delivered, then force a failure and verify retry without duplicate storage. Configure `CONTACT_TRUSTED_IP_HEADER` only after proving the deployed proxy overwrites that header with the real client IP. An arbitrary browser-supplied IP header must not be trusted. Password reset also uses the configured Resend adapter.

## Initialise before the first build

The CMS-backed build expects the initial public page text and globals. From a trusted terminal configured for the intended database:

1. Run `pnpm db:migrate`. Schema push is disabled in every environment.
2. Supply `ADMIN_EMAIL`, `ADMIN_PASSWORD` and optionally `ADMIN_NAME`, then run `pnpm cms:bootstrap`. The password must be at least 14 characters. This refuses an existing user database.
3. Run `pnpm cms:seed:baseline`. This installs missing page text and globals. It preserves existing content and creates no users, images, example projects or example articles. Legal/team text still needs owner review.
4. Run `pnpm build` (which regenerates the storage-aware admin import map), then deploy with the same schema and environment. Keep access protection enabled while content and integrations are being checked.
5. Sign in at `/admin`, upload cleared images, add actual articles/projects/solutions and publish. Review homepage selections and team copy. The local review seed is deliberately restricted to loopback databases and must not be used for production.

Migrations are committed under `src/migrations`. Before subsequent schema changes, take a restorable backup and test the migration against an isolated copy. The app does not automatically run migrations on every build.

## Verify on the host

- Admin/Editor login and role restrictions, password reset and expired sessions.
- Image over 4.5 MB; invalid MIME/oversize/anonymous uploads rejected; private image bytes blocked; approved media preserved across redeployment. Next image optimisation must work through Payload's own-origin file endpoint.
- Draft edits remain private; authenticated preview works; publish/edit/unpublish update pages and search within 60 seconds. Formerly public removed URLs return 410.
- Enquiry storage, live delivery, ambiguous-provider outcome and controlled retry. The provider deduplication window is measured from the first provider attempt.
- A warm article and company page during a database outage; controlled failure for uncached database-dependent work.
- Restore both the actual database and bucket into an isolated environment. The local restore helper verifies local disk only; it is not a hosted bucket backup.
- Real Kampala mobile performance and the acceptance matrix. Local browser checks do not establish the required hosted p75 result.

Admin dashboard > Website operations can retry durable public refreshes, preview retention counts and explicitly delete expired records. Enquiry CSV export is Admin-only. Publish hooks enqueue refreshes in the content transaction and process them after the HTTP response; pending records survive a process restart. Run the dashboard check after CLI imports, which do not have a Next request lifecycle. Retention also covers exported files, inbox copies and backup expiry through the owner's operational policy; deleting a CMS record cannot erase those external copies.
