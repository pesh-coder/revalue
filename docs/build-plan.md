# Revalue continuation and build sequence

31 October 2026. Planning and export reconciliation are complete enough for review. Patience subsequently authorised the scaffold, shared components and Home on 31 October. That checkpoint is now implemented and verified as recorded in `home-checkpoint.md`. Patience approved Home and authorised the remaining pages. The next review checkpoint covers blog/article and company-page layouts. The product scaffold was created separately from the throwaway spike.

| Order | Deliverable | Exit evidence |
|---|---|---|
| 1. Reference review | Render supplied home, article, project, menu and contact states; inspect tokens and real assets | Seen at 390px; review a 1280px interpretation. Record any visitor-facing differences before choosing between conflicting sources. |
| 2. Hosted spike | Deploy the isolated existing spike with a migration, persistent media and access control; exercise integrated search/email | S2–S8 recorded with URLs, dates, configuration, measured results and redacted logs. Accounts and provider connections are required. |
| 3. Spec checkpoint | Review permissions, enquiry recovery, privacy/storage choices and remaining visual proposals | New draft choices in implementation-spec are settled. CMS and original URLs are already confirmed. |
| 4. Foundation and CMS | Compatible pinned Node, project scaffold, shadcn init, tokens/fonts, Payload roles, collections, migrations, media and authenticated preview | Production build and explicit API permission/draft-isolation checks pass; hosted migration and media are proven. |
| 5. First complete journey | Header/menu/footer, home, article, project and contact; stored-first enquiry plus notification retry | Keyboard/mobile journey passes. One teammate creates/publishes through admin and one browser enquiry reaches storage and inbox. |
| 6. Discovery and remaining prototype pages | CMS-driven resources/search/hub, indexes, solutions, partners, basic pricing/about, test tool, legal drafts and 404 | Correct routes and states; sparse real content is handled honestly; search passes app-level queries. |
| 7. Prototype verification | Run all prototype rows in acceptance-matrix, record actual evidence | No fixture score substituted for hosted performance, real publishing or browser-form evidence. Document any unresolved item as unresolved. |
| 8. Public launch, separately authorised | Cleared content/photos/toolkit, legal review, domain/mail setup, suitable hosting, restore exercise and analytics | Launch-only rows pass; remove stand-ins/unverified claims; indexing changes only for the authorised public environment. |

Design review and hosted preparation may proceed alongside one another. Do not repeat successful local installation/build checks without a code or configuration change that justifies it. Do not upgrade the pinned packages merely because a newer release exists; check compatibility and advisories when preparing actual installation/deployment.

## Hosted prerequisites and experiment order

Hosted tests may proceed after the locally authorised Home checkpoint; they do not block this visual build. No live provider connection is exposed in this session. Account existence and CLI authentication have not been inferred from absent tools. Never paste secrets into chat.

1. GitHub repository/access, Vercel project, Neon database and Blob store. Configure secrets through provider/environment tooling, verify actual access protection and quota settings, and keep test data synthetic.
2. S2: Git-triggered deployment with committed migrations, schema push off, authenticated admin, upload preserved across redeploy. Record runtime, region and database configuration.
3. S5: authenticated image upload above 4.5 MB; unauthorised upload must fail.
4. S6: wire Postgres full-text queries into the spike, repeat fixed expected-result queries with real content and verify publication visibility.
5. S7: Patience chose the existing Resend account with a separate Revalue key. Configure its verified sending identity and test recipient. Browser submit, stored record, delivered message, forced failure and retry with no duplicate record.
6. S3: 30 mobile runs per scenario from Kampala. Record phone/network/cache conditions and p50/p75/p95. Article p75 LCP <2.5 seconds; proposed admin cold-start target is a separate decision, not an already defined pass threshold.
7. S4: one teammate publishes a real article/image unaided in <15 minutes; public page/search update within 60 seconds. API scripts cannot substitute for the person.
8. S8: observe quota use with an explicit traffic/content-volume assumption and monthly projection. A short idle run cannot establish free-tier capacity.

If speed or publishing fails, diagnose the failing layer before proposing a stack switch. Evaluate the fallback against that same failing test; switching CMS does not automatically solve network or image-weight problems.

## Remaining-pages continuation

The public page layer and additional Payload content models are implemented. The chosen email service is Resend in the existing account, with a separate key. Optional tracking stays off; privacy uses a footer link and contact notice. See `pages-checkpoint.md` for actual test results.

Local PostgreSQL, migrations, CMS editing/uploads, draft isolation/version restore, full-text search, enquiry concurrency/retry, retention operations and database/media restore are now verified locally. See `local-backend-checkpoint.md`. Remaining gates are actual hosted R2/email integration, hosted freshness/redeployment/restore, Kampala mobile performance, unaided teammate publishing and cleared content/assets. Scheduled publishing and URL-renaming redirects remain deferred scope.
