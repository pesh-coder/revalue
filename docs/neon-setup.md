# Neon setup and verification

## Target and configuration

The existing project `old-bread-60972090` in organisation `org-rapid-block-69421865` is linked to its existing `production` branch (`br-delicate-art-b79vo1c2`). No second project was created. `neon deploy` and a subsequent `neon config plan` both reported that the branch already matched the Postgres-only policy.

Payload retains its PostgreSQL adapter and authentication. Pooled `DATABASE_URL` serves normal app requests; direct `DATABASE_URL_UNPOOLED` serves migrations. Neon stores content, administrator accounts, draft versions and enquiries. The planned Cloudflare R2 bucket serves a separate purpose: uploaded media. R2 is not connected or verified by this database setup.

## Every change made

- Installed global `neon@8.15.1` with `npm i -g neon@latest`.
- Ran the requested `neon init -y --org-id org-rapid-block-69421865 --project-id old-bread-60972090 --branch production --services postgres`.
- Completed CLI OAuth authentication in the browser with the owner's participation; the CLI saved its DEFAULT profile in the user's credential store.
- The CLI installed user-level Neon plugins for Claude Code, Codex, Cursor and VS Code. For Gemini CLI and GitHub Copilot CLI it installed skills and Neon MCP configuration. Copilot itself was not on PATH, so the CLI used the skills/MCP fallback. These are shared user integrations, not copies inside the repository.
- The Codex plugin is enabled and includes the HTTP MCP server `https://mcp.neon.tech/mcp`. Its manifest contains no credential fields. MCP tools are not exposed in the current running agent session, so setup verification uses the authenticated CLI; a new session and separate MCP OAuth sign-in may be required to use those tools.
- Fetched the exact requested skill from `https://neon.com/.well-known/agent-skills/neon/SKILL.md` into ignored `.local/neon-setup/requested-SKILL.md`. Its contents match the installed skill after newline normalization. Read it and the Neon Postgres skill. `neon skills status --global` reported all nine skills current: neon, neon-postgres, neon-postgres-branches, neon-postgres-egress-optimizer, neon-auth, neon-functions, neon-object-storage, neon-ai-gateway and neon-realtime. No duplicate project integration was installed during the subsequent audit.
- Created ignored `.neon` project context and added `.neon` to `.gitignore`.
- Created `neon.ts`, retaining the generated Postgres-only policy, disabled Neon Auth, and generated branch policy. No existing remote settings changed.
- Added the CLI-generated `@neon/config` 1.10.0 and `@neon/env` 1.6.8 dependencies and their pnpm lockfile entries.
- Backed up the original local environment to ignored `.local/neon-setup/env.local.before-neon`. After browser authentication, `neon deploy` updated only `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and `NEON_BRANCH` in `.env.local`; comparison confirmed all previous non-Neon settings were preserved.
- Added `scripts/migrate.mjs` and updated `db:migrate` to select the direct URL for migrations, falling back to `DATABASE_URL` for local PostgreSQL. Updated `.env.example` and the deployment guide.
- Applied all five committed Payload migrations to the initially empty database. Created the first administrator with the owner's supplied email and a generated password stored only in ignored `.local/neon-setup/admin-credentials.json`.
- Initialized 12 published pages, published homepage settings and published navigation/footer settings. No sample articles, projects or uploaded media were seeded.
- Fixed `scripts/seed-baseline.ts`: Payload supplies a default draft status for nonexistent globals, so initialization must check for a persisted ID. Existing saved settings are preserved.
- Added `REVALUE_VERIFY_CREDENTIALS` support to `scripts/verify-http.py`, allowing the HTTP checks to use the new account without replacing the old local credentials file.
- Increased the bounded publication lookup from 1.5 to 3 seconds. Immediate requests after unpublishing/deleting sometimes fell through to 404 on the cloud connection while subsequent requests correctly returned 410. The fallback remains bounded for cached pages during a database outage.
- Moved the previous Next build cache into ignored `.local/neon-setup/next-cache-before-neon`, so the verification build reads the new database rather than previous local cached content.
- Prepared ignored `.local/neon-setup/vercel-production.env` containing the Neon URLs and existing Payload secret, with the production site origin and enquiries disabled. No Vercel environment settings have been changed by this setup.

## Verification

Direct and pooled TLS connections passed. A fresh pooled connection confirmed five migration records, one user, 12 published pages, one published homepage and one published site-settings record.

`npm run build` passed with an empty Next data cache against Neon: compilation and TypeScript succeeded, and all 18 static pages generated. The earlier cache-backed build had exited successfully while logging missing-global revalidation errors; it was not used as clean evidence. The corrected, fresh build had no missing-global errors.

`npm start` started Next.js 16.4.3 at `http://localhost:3000`, reporting `Ready in 3.6s`. Home, About, the blog index, Contact and the administrator login all returned HTTP 200. `npm test` passed all 10 tests; the full lint check and targeted lint of the added/changed setup code passed.

After the publication lookup adjustment, `npm run build` passed again (18/18 pages), followed by `npm start` (`Ready in 232ms`). With `REVALUE_VERIFY_CREDENTIALS=.local/neon-setup/admin-credentials.json`, `python scripts/verify-http.py` exited 0 and printed:

```text
{"checked": 28, "failed": 0}
```

These checks exercise the running Next.js app against Neon: administrator sign-in, public navigation refresh, article creation/publishing, private draft revision and preview, stale-save conflict detection, unpublish/delete HTTP 410, search visibility, local image upload and metadata/approval, private bytes and Next image optimisation, anonymous access denial, administrator CSV export and maintenance. Media bytes in this run used local disk; this is not an R2 persistence test. No live email was sent.

A fresh independent Neon connection after verification confirmed zero synthetic test posts, zero synthetic test media records, one administrator and 12 published pages. The script restored the original navigation. Redacted results are in ignored `artifacts/http-checks.json`; earlier failing evidence was preserved in ignored `.local/neon-setup/http-checks-before-timeout-fix.json`.

## Issues and remaining connections

The first baseline run skipped nonexistent globals; this was found by checking the actual database, corrected, and rerun. The PostgreSQL driver prints a nonfatal notice about how future major versions will interpret `sslmode=require`; the provider-supplied TLS configuration was preserved. The CLI's dependency install used the system Node 22.17.1 and printed an engine warning; app commands use the compatible portable Node 24.22.2.

Two earlier HTTP runs each passed 26 checks and failed the two immediate removed-URL checks with HTTP 404. Subsequent requests returned 410 and the database's removed markers were correct. The 1.5-second publication lookup cutoff was increased to 3 seconds; the rebuilt app passed all 28 checks, including the original immediate 410 assertions. The outage fallback remains bounded, but a hosted outage test is still required.

The web fetch tool could not open the requested skill URL; a direct HTTPS download succeeded. No failed download was treated as a successful read.

Vercel still needs the private production environment values and a redeploy. Import only the prepared production file, not the development `.env.local`, whose origin is localhost. Hosted R2 persistence and live Resend delivery remain separate checks. Password reset and contact delivery stay disabled until email is configured. Legal copy, cleared assets and final content remain owner review items.
