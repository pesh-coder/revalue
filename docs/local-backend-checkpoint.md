# Local frontend and backend checkpoint

31 October 2026. The prototype now runs locally against PostgreSQL 18 and the actual Payload portal. This supersedes the earlier database-free implementation status. It is not a hosted launch certificate.

## Implemented and checked

- Five committed migrations, schema push disabled, controlled Admin bootstrap, text-only baseline seed and a loopback-only visual-review seed. The normal site now uses CMS data, without silently substituting fixtures.
- Admin/Editor access, rich-text editing with structured tables, drafts, authenticated article preview, publishing and version restoration. A stale HTTP save receives 409 with recovery guidance. Published slugs and formats stay frozen.
- Editable Home copy, hero/featured selections, navigation, footer, contact email, index introductions, company-page sections, About principles/team, partner audiences and pricing factors. Daisy Nyaburu is included as Hardware Lead.
- Parameterised PostgreSQL full-text search over currently published posts/guides/projects/solutions and release-approved tools; indexed title/excerpt terms, topic/format filters and pagination. English stemming is used; this is not semantic synonym search. The old 100-item truncation is removed.
- Same-origin, access-controlled media delivery, required alt text, byte/MIME/size checks, a private S3-compatible adapter and direct-upload validation. Local 6.7 MB image upload and public-release access were verified. Actual R2 direct uploads/redeployment remain unverified.
- Content-refresh records saved with the content transaction, processing after the response, retry from Admin operations, short-lived public caching and transaction-scoped advisory locks compatible with transaction poolers. Removed previously public URLs return 410; unknown URLs remain 404.
- Stored-first enquiries, concurrent duplicate protection, persistent rate limiting with rotating IP digests, notification status and Admin retry. The provider deduplication window starts with the first provider attempt; an older uncertain outcome requires explicit provider-log reconciliation. Resend responses were mocked, with no live mail sent.
- Admin-only CSV export, protected against spreadsheet formula injection; retention dry-run and explicit deletion; a generic password-reset response when email is unavailable. Optional tracking remains off, with Privacy link and contact notice.

## Evidence

| Check | Recorded result |
|---|---|
| Production build, TypeScript and lint | Pass |
| Frozen lockfile installation | Pass |
| Unit/security tests | 10 pass, including installed deepmerge CJS/UMD regression checks |
| Database-backed scenarios | 13 pass; includes ten fixed application search cases, version restore, tables, roles, upload, concurrent enquiry storage, throttling, retry and cleanup |
| Running production HTTP scenarios | 28 pass; includes navigation/article refresh, stale-save 409, draft isolation/preview, removal 410, private media bytes, image optimisation, export and maintenance access |
| CMS public route/API smoke checks | 35 pass; includes missing URLs, hidden unapproved tool, anonymous preview, form validation, disabled delivery, foreign origin and honeypot |
| Local database/media restore | Pass: separate restore database; row counts and all copied media hashes match; five migrations restored |
| Database outage | Warm Home, About and article each return 200 with content while the isolated cluster is stopped; approximately two seconds per request; cluster restarted |
| Browser | Actual Admin login, draft edit, original published copy retained, original copy republished and authenticated preview checked. About at 360px has no axe violations or overflow. Earlier 390/1280px checks remain in page records. The browser disconnected during the final expanded sweep, so the remaining cases were not counted as passes. |

Raw local evidence is under ignored `artifacts/`: `backend-checks.json`, `http-checks.json`, `route-checks.json`, `backup-restore-check.json`, `outage-checks.json` and `dependency-audit.json`. Synthetic test articles/uploads are removed by the HTTP check. The local Admin credential file, databases and backups are ignored and excluded from the repository.

## Dependency audit

The production audit reports zero moderate, high or critical advisories. Patched versions/overrides address file-type, sharp, DOMPurify, happy-dom and esbuild advisories. One low-severity deepmerge advisory remains in registry metadata because there is no upstream patched release. A committed pnpm patch rejects prototype-sensitive keys in both merge operands across the distributed entry points, with regression tests. Keep the patch until an upstream fix is available; the audit still reports the upstream version and must not be described as completely clean.

## Remaining acceptance gates

Actual Vercel/Neon/private R2 integration, upload persistence across redeploy, live Resend delivery and password reset, hosted propagation/outage/restore checks, access protection, a teammate publishing unaided, supported-browser/device coverage and real Kampala performance still require the configured host and human review. Content/photo/tool release approvals, legal review and responsibility for external copies/backups remain launch work. Enquiry delivery is disabled in the local review. Scheduled publishing and URL-renaming redirects remain explicitly deferred; URL changes are prevented in this prototype.

Follow `deployment.md` for first hosted initialisation. Run migrations, create the Admin and seed the initial CMS text before the first CMS-backed build. The build regenerates the Payload import map for the actual storage environment.
