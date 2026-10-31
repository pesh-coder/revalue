# Revalue

Next.js App Router, TypeScript, Tailwind v4 and Payload CMS. The public UI follows `docs/design-brief.md` and `design-reference/screens/`; content/backend requirements follow the reconciled PRD.

## Local visual review

Use Node 24.22.2 (or the engine-compatible runtime) and pnpm 10.30.2:

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

`REVALUE_CONTENT_MODE=review` uses explicitly labelled local fixtures so the website pages can be reviewed without hosted accounts. It is not the final publishing mechanism. The page is noindex; do not deploy it publicly as-is.

## CMS

The real portal is `/admin`. The local database is now connected and the site runs in CMS mode. It includes Admin/Editor roles, image/file uploads, rich-text posts and structured tables, drafts/preview/version restore, company pages, homepage copy/selections, navigation/footer/contact settings and an enquiry inbox. Local-only login credentials are in ignored `.local/admin-credentials.json`; never commit that file.

Local verification is recorded in `docs/local-backend-checkpoint.md`. Read `docs/deployment.md` before connecting a hosted database or bucket. Resend remains selected but no live sender/key has been configured.

## Review checkpoint

Home, resources/search, blog index/article, topic hub, tools, guides, projects, solutions, company pages, contact, legal drafts and custom 404 are now implemented. See docs/pages-checkpoint.md for verification and remaining infrastructure work.

See `docs/implementation-spec.md`, `docs/build-plan.md`, `docs/acceptance-matrix.md`, `docs/design-reconciliation.md` and `PROVISIONAL.md`. Stock imagery, sample content, unresolved claims and approvals are tracked in `PROVISIONAL.md` and block public launch.

## CMS setup

1. Configure a dedicated PostgreSQL database using `DATABASE_URL` and a strong `PAYLOAD_SECRET`.
2. Run `pnpm db:migrate`. Schema push is disabled. Initial migrations are committed.
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (at least 14 characters), then run `pnpm cms:bootstrap` to create the first Admin. This refuses existing users.
4. Run `pnpm cms:seed:baseline` for initial page text and globals. It preserves existing content and creates no sample articles, projects, uploads or users. Run this before the first CMS-backed build.
5. Set `REVALUE_CONTENT_MODE=cms`, run `pnpm build`, and sign in at `/admin`. Publish approved content through the portal. Draft preview requires a team login.

`pnpm cms:seed:local` installs the visual-review sample and temporary local Admin only on a loopback database. It resumes missing collection items but resets review globals; do not use it to preserve editorial changes. `pnpm test:backend` requires an isolated loopback `DATABASE_TEST_URL` ending in `_test` and uses only synthetic records. `python scripts/verify-http.py` exercises the running local production server with temporary records and restores its navigation changes. `python scripts/backup-local.py --verify-restore` verifies a local database/media restore into the dedicated `_restore` database.

## Resend and contact

Use the existing Resend account with a separate sending-only API key. Put `RESEND_API_KEY`, `EMAIL_FROM` (verified sender) and `EMAIL_TO` (team inbox) in the environment. Configure the actual `SITE_URL` for each hosted environment. Never put these credentials in client code or chat.

Leave `ENQUIRIES_ENABLED=false` until the database, migrations and delivery tests pass. When enabling on a host, set `CONTACT_TRUSTED_IP_HEADER` only to a header the trusted reverse proxy overwrites with the real client IP. Never trust a client-controlled IP header. The handler fails closed when this cannot be established. Local development uses one shared local-preview counter.

The endpoint validates server-side, stores first and notifies through Resend. Persistent enquiry records supply idempotency and ten-minute duplicate checks; PostgreSQL advisory locks serialize concurrent submissions. A persistent counter caps accepted attempts at five per fifteen minutes per IP digest. Local concurrency and retention checks pass; live provider delivery and hosted behavior remain unverified. Admins can retry through the enquiry's Retry notification button. Older uncertain outcomes require checking the provider log first.

No optional analytics or advertising trackers are installed. The footer Privacy link and contact notice are present. Before public collection, revise and approve the policy for actual retention, technical counter metadata, exports, backups and provider settings. Do not assume the draft legal copy is a completed compliance review.

## Checks

`pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`. `python scripts/check-routes.py --cms` exercises the running local preview with synthetic data and writes its results under `artifacts/`.
