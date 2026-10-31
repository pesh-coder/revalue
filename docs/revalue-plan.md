# Revalue Website: Technical Plan

Version 0.1, plan only. Date: 30 October 2026. Requirements are in `docs/revalue-prd.md`.
The product scaffold, shared components and Home implementation were authorised on 31 October; see `build-plan.md` for the current checkpoint. A separate throwaway spike exists at `C:\code\revalue-spike`; its results are in section 10a.

**Continuation, 31 October 2026:** the design export is now in `design-reference/`, `brand/` and `public/images/`. Patience confirmed Payload CMS and the original resource URLs remain; the export is a visual reference. Current behaviour, design conflicts and build gates are in `implementation-spec.md`, `design-reconciliation.md` and `build-plan.md`. Email-provider selection requires Patience?s explicit choice before contact integration; the earlier Resend proposal is not approval. Provider/version claims below record the 30 October research; they have not been reverified in this continuation.

**Classification:** architectural (new project, no existing code). Path: plan, spike, design and user flow, spec, implementation plan, build.

**Hypothesis:** We believe a single Next.js and Payload application can let a non-developer publish articles and receive enquiries so that Revalue has a credible site running at or near zero cost during the prototype, with published pages reaching LCP under 2.5 s on a Kampala mobile connection.

## 1. Recommendation

| Layer | Choice | Version checked | Status |
|---|---|---|---|
| Runtime | Node.js LTS | `^22.23.4` or `>=24.22.1` | [FACT] required |
| Frontend | Next.js App Router, React, TypeScript | next 16.4.3, react 19.3.1 | [DRAFT] |
| Backend and CMS | Payload, inside the same Next.js app | payload 3.92.1 | [EVIDENCE] spike |
| Database | PostgreSQL on Neon, Frankfurt | `@payloadcms/db-postgres` 3.92.1 | [EVIDENCE] spike |
| Media storage | Vercel Blob | `@payloadcms/storage-vercel-blob` 3.92.1 | [EVIDENCE] spike |
| Hosting, prototype | Vercel Hobby, functions in `fra1`, private and not indexed (your decision, 30 October) | Current plans | [FACT] decided |
| Hosting, launch | Vercel Pro, or another host that allows commercial use, decided before going public | Current plans | [DRAFT] |
| Rich text | Lexical | `@payloadcms/richtext-lexical` 3.92.1 | [DRAFT] |
| Search | Payload Search plugin plus Postgres full-text search | `@payloadcms/plugin-search` 3.92.1 | [EVIDENCE] spike |
| Forms | Payload Form Builder plugin | `@payloadcms/plugin-form-builder` 3.92.1 | [DRAFT] |
| SEO, redirects | Payload plugins | `plugin-seo`, `plugin-redirects` 3.92.1 | [DRAFT] |
| Email | Resend | `@payloadcms/email-resend` 3.92.1 | [DRAFT] |
| Styling, UI | Tailwind, shadcn/ui, Phosphor | tailwindcss 4.3.3, shadcn 4.23.0, phosphor 2.1.10 | [DRAFT] |
| Animation | Motion, only if CSS is not enough | motion 14.8.0 | [DRAFT] |
| Validation | Zod | zod 4.6.7 | [DRAFT] |
| Analytics | Vercel Web Analytics | `@vercel/analytics` 2.0.1 | [DRAFT] |

**Why this stack:** Next.js already runs your `ecosort` dashboard, and `DESIGN.md` assumes Next.js, Tailwind and shadcn. Payload adds the CMS, admin screens, database layer and API inside that one app, so there is no second service to host. The plugins cover search, forms and SEO, which you would otherwise build. It is MIT licensed, and the content stays in your own Postgres database.

## 2. Approaches considered

| | A. Payload in Next.js (recommended) | B. Next.js + Sanity (fallback) | C. Next.js + Strapi | D. Git-based CMS (Keystatic) |
|---|---|---|---|---|
| Backend to run | None separate | None, hosted by Sanity | A second server | None |
| Where content lives | Your Postgres | Sanity's Content Lake | Your database | Git repo |
| Licence | MIT | Studio MIT, hosted service paid above free tier | "SEE LICENSE IN LICENSE" | MIT |
| Free tier | Software free, you pay hosting | 20 seats, 10k documents, 250k API requests | Software free, you pay hosting | Software free |
| Search and forms | Plugins included | Build or buy | Build or buy | Build or buy |
| Non-developer publishing | Yes | Yes | Yes | Weak for non-GitHub users |
| Main risk | Migrations, backups, cold starts | Vendor limits and $15 per seat later | Two deployments. Strapi says it does not support "Cloud Native" databases, so Neon is doubtful | Does not meet your "CMS backend" request well |

**Verdict:** A. If the spike fails on speed or publishing, move to B, which is the only other option that needs no server. C and D are rejected.

WordPress and Webflow are options in `Website_Build.md`. I did not research them, because `DESIGN.md` assumes a custom Next.js stack and you can build one. Say so if you want them compared.

## 3. Architecture

```
Editor (browser)                 Visitor (browser)
      |                                |
      v                                v
  /admin (Payload)              Public pages (Next.js, cached)
      |                                |
      +---------- same Next.js app ----+
      |                 |              |
      v                 v              v
   Postgres (Neon)   Vercel Blob    Resend (enquiry email)
      Frankfurt       media files
```

- Public pages are cached and rebuilt on demand. When an editor publishes, a Payload hook clears the affected pages.
- `/admin` and form submissions are the only parts that normally touch the database at visit time.
- The Neon database sleeps after 5 minutes idle, so cached pages matter for visitors. Editors will feel the wake-up delay. The spike measures it.
- Frankfurt is chosen because both Vercel (`fra1`) and Neon (`aws-eu-central-1`) have it. Vercel has Cape Town (`cpt1`), but Neon has no Africa region, and Vercel says functions should sit near the database.

## 4. Confirmed facts

| # | Fact | Source |
|---|---|---|
| 1 | Payload 3.92.1 requires Node `^22.23.4 || >=24.22.1`. Your machine has v22.17.1, so it must be upgraded | [Payload install docs](https://payloadcms.com/docs/getting-started/installation), npm metadata |
| 2 | `@payloadcms/next` 3.92.1 peer range allows Next `>=16.3.3 <17.0.0`. The docs page says 16.2.6 or higher, so npm metadata wins and 16.4.3 fits | npm metadata |
| 3 | Payload can be added to a Next.js app and supports Postgres, MongoDB and SQLite | [Payload install docs](https://payloadcms.com/docs/getting-started/installation) |
| 4 | Payload is MIT licensed. Figma acquired the team in June 2025 and says it stays open source and self-hostable | npm metadata, [Figma announcement](https://www.figma.com/blog/payload-joins-figma/), [Payload announcement](https://payloadcms.com/posts/blog/payload-is-joining-figma) |
| 5 | Uploads on a host without persistent disk need a storage adapter | [Payload deployment docs](https://payloadcms.com/docs/production/deployment) |
| 6 | Drafts, version restore and role-limited publishing are built in. Scheduled publish needs a job runner or it never fires | [Payload drafts docs](https://payloadcms.com/docs/versions/drafts) |
| 7 | Live Preview shows the front end inside the admin as you type | [Payload Live Preview docs](https://payloadcms.com/docs/live-preview/overview) |
| 8 | Search plugin runs on your own database and excludes drafts by default | [Search plugin docs](https://payloadcms.com/docs/plugins/search) |
| 9 | Form Builder stores submissions in the database and can send emails | [Form Builder docs](https://payloadcms.com/docs/plugins/form-builder) |
| 10 | SEO plugin adds meta fields and a search-result preview | [SEO plugin docs](https://payloadcms.com/docs/plugins/seo) |
| 11 | Payload's Vercel template provisions Neon and Blob. Its README warns to turn off schema push against production | [Vercel template](https://vercel.com/templates/next.js/payload-website-starter), [template README](https://github.com/payloadcms/payload/blob/main/templates/with-vercel-website/README.md) |
| 12 | Vercel Hobby is for "non-commercial personal use only". "Advertising the sale of a product or service" counts as commercial | [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines) |
| 13 | Vercel Pro developer seat is $20 per month. Hobby includes 5K image transformations and 1 GB Blob storage | [Vercel pricing](https://vercel.com/pricing) |
| 14 | Hobby cron runs once per day at most, with precision of about an hour | [Vercel cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing) |
| 15 | Vercel has 19 compute regions, including Cape Town and Frankfurt | [Vercel regions](https://vercel.com/docs/regions) |
| 16 | Neon Free gives 100 CU-hours per project and 1 GB per project, and sleeps after 5 minutes. Paid is usage-based | [Neon pricing](https://neon.com/pricing) |
| 17 | Neon lists Frankfurt and has no Africa region | [Neon regions](https://neon.com/docs/introduction/regions) |
| 18 | Sanity Free gives 20 seats, 2 public datasets, 10k documents, 250k API requests. Growth is $15 per seat per month | [Sanity pricing](https://www.sanity.io/pricing) |
| 19 | Strapi needs Node LTS and a supported SQL database, and says it does not support "Cloud Native" databases | [Strapi install docs](https://docs.strapi.io/cms/installation/cli) |
| 20 | Resend Free gives 3,000 emails a month, 100 a day, 3 domains. Pro is $20 per month | [Resend pricing](https://resend.com/pricing) |
| 21 | Pagefind indexes built HTML with no server | [Pagefind docs](https://pagefind.app/docs/) |
| 22 | Next.js defaults include TypeScript, Tailwind, ESLint, App Router and Turbopack. Linting no longer runs during build | [Next.js install docs](https://nextjs.org/docs/app/getting-started/installation) |
| 23 | Organisations that collect personal data in Uganda must register with PDPO. Registration lasts one year, with an annual compliance report | [PDPO](https://pdpo.go.ug/), [PDPO registration guidance](https://pdpo.go.ug/media/2022/01/20102021105143-Registration_Classification_and_Guidance_Notes.pdf), [Data Protection and Privacy Act](https://ulii.org/akn/ug/act/2019/9/eng@2019-05-03/source) |
| 24 | Your machine has npm 11.6.0, pnpm 10.30.2, Docker 28.4.0, PostgreSQL client 18.0 and git 2.47.1. `gh` is not installed, and this folder is not a git repo | Local check |

Package versions were read from the npm registry on 30 October 2026.

## 5. Open assumptions

| # | Assumption | Why it matters | Experiment |
|---|---|---|---|
| A1 | Payload 3.92.1, Next 16.4.3, Tailwind 4 and shadcn work together on Windows | Everything rests on this | S1 |
| A2 | Published pages are fast from Kampala through Frankfurt | Your first audience is local | S3 |
| A3 | Admin is usable after a cold database on a Kampala connection | Editors stop publishing if it is painful | S3 |
| A4 | A non-developer can publish without help | This is the reason for a CMS | S4 |
| A5 | Publishing updates cached pages within 60 seconds | PRD N3 | S4 |
| A6 | Search plugin results are good enough without a paid service | Avoids another vendor | S6 |
| A7 | Vercel Hobby runs the private prototype within its limits | Prototype stays at $0 | S2 and S8. The site stays private and not indexed until a launch host is chosen |
| A8 | Free tiers cover the prototype | Cost promise | S8 |

## 6. Decisions

| Decision | Label |
|---|---|
| Use a compatible project Node before running product tooling. The spike used portable Node 24.22.2 without replacing system Node | [EVIDENCE] S1 |
| Node 24 LTS as the project version, pinned in `.nvmrc` and `engines` | [DRAFT] |
| One repo, one deployable app, in `C:\code\revalue` | [DRAFT] |
| Postgres, because Payload supports it, it is widely portable, and `psql` and Docker are already installed | [DRAFT] |
| Docker Postgres for local development, Neon for hosted environments | [DRAFT] |
| Migrations committed to git. Schema push only on local development | [FACT] from Payload's warning |
| `@payloadcms/db-postgres` over the Vercel-specific adapter, for portability | [DRAFT] |
| Payload Search plugin to sync the index, with Postgres full-text search for queries. Basic `contains` matching scored 6 of 10 and failed. Pagefind is out because it needs a rebuild after each publish | [EVIDENCE] S6, wiring still to prove |
| Scheduled publishing left out of the prototype, because it needs a job runner | [FACT] |
| Frankfurt for compute and database | [EVIDENCE] S3 |
| No public site on Vercel Hobby | [FACT] from the Hobby terms, because the site advertises services |
| pnpm as package manager, preferred by Payload | [DRAFT] |
| Vitest for logic, Playwright for key journeys, Lighthouse for performance and accessibility | [DRAFT] |

**Estimated monthly cost.** Prototype: $0 on Vercel Hobby, kept private. Launch: $20 for Vercel Pro if we stay on Vercel, plus the domain, which is not yet priced. Neon and Resend free tiers are likely enough at first. Usage-based charges depend on traffic.

## 7. Core semantics

| Term | Definition |
|---|---|
| Published | `_status` is `published`. Only this is visible on the public site, in search and in the sitemap |
| Draft | Visible only to logged-in team members, through preview |
| Publish date | Set once on first publish, never changed automatically |
| Reviewed date | Changes only when an editor ticks that the content was genuinely reviewed |
| Slug | Unique within its type and frozen after first publish, unless a redirect is created in the same action |
| Primary topic | Exactly one per article or guide. Secondary links are optional |
| Project status | One value from the fixed list, required before publish, changed only by an Admin |
| Solution availability | One value from the fixed list, required before publish |
| Enquiry | One accepted form submission. Stored first, then emailed |
| Email failure | The enquiry stays stored, is marked unsent, and appears in the CMS. The sender still sees success |
| Duplicate enquiry | Same email and message within 10 minutes counts as one |
| Spam | Honeypot hit is dropped silently. Rate limit is per IP |
| Public asset | A Tool with public release approved set to yes |
| Person shown publicly | Consent recorded set to yes |
| Deleted content | Soft removal through unpublish. A published URL leaves a redirect or returns 410 |
| Enquiry retention | Set in the Privacy page. Proposal: 24 months, then deleted |

## 8. Acceptance criteria

Text in quotes is verbatim from `Website_Build.md`. A documented gap or workaround is not a pass.

| ID | Criterion | How measured | Result |
|---|---|---|---|
| C1 | "A credible website that can publish content and generate conversations." | Non-developer publishes, test enquiry arrives | UNRESOLVED |
| C2 | "Home, Solutions, Resources, Projects, Partners, Pricing, About and Contact." | All pages live with real content | UNRESOLVED |
| C3 | "Blog index and reusable article template." | One template renders every post | UNRESOLVED |
| C4 | "Initial topic hubs and internal links." | Each published hub meets the hub checklist | UNRESOLVED |
| C5 | "Existing tools and templates that are appropriate for public release." | Only approved assets appear | UNRESOLVED |
| C6 | "Basic analytics, SEO setup and enquiry forms." | Events recorded, metadata audited, form tested | UNRESOLVED |
| C7 | "Limit the main navigation to six or seven choices." | Count at 1280px | UNRESOLVED |
| C8 | "Make Resources searchable and filterable instead of showing every article on one page." | Test with sample content | UNRESOLVED |
| C9 | "Use explicit status labels such as Concept, In development, Testing, Pilot, Completed or Published research." | Field required in the CMS | UNRESOLVED |
| C10 | "Offer a clear enquiry route instead of inventing package prices." | Pricing page review | UNRESOLVED |
| C11 | "Avoid automatic pop-ups and intrusive newsletter prompts." | Manual review | UNRESOLVED |
| C12 | "Accessible navigation, contrast, keyboard support and form labels." | axe, keyboard-only pass | UNRESOLVED |
| C13 | "XML sitemap and robots.txt." | Fetch both in production | UNRESOLVED |
| C14 | "Breadcrumbs on articles, guides and projects." | Template check, BreadcrumbList validated | UNRESOLVED |
| C15 | "Do not present proposed dashboard or recovery-linkage capabilities as operational unless verified." | Content review before publish | UNRESOLVED |
| C16 | Blogs managed through a CMS backend (your instruction, 30 October) | Article created without touching code | UNRESOLVED |

## 9. Proposed requirement changes

These were proposed changes. The design handoff subsequently applied R2–R5 without recording individual approval, and omitted the optional workplan. They are current design proposals, not individually confirmed decisions. The 31 October continuation confirms CMS and URLs only. See `design-reconciliation.md`; do not infer approval from this historical table.

| # | Source says | Proposed | Reason |
|---|---|---|---|
| R1 | `Website_Build.md`: publish the 12-week workplan only if appropriate for public release | Leave it out pending clearance | Optional in the source; it conflicts with the six-month plan UNDP accepted |
| R2 | `Website_Build.md`: expandable mobile menu sections | Use the slide-in panels from `DESIGN.md` | The two documents conflict, and `DESIGN.md` says it wins |
| R3 | `Website_Build.md`: one font family | Two families from `DESIGN.md`, with display type on headlines only | Same conflict |
| R4 | Playbook: clay on selected calls to action | Primary green on all buttons, clay on small highlights | `DESIGN.md` bans the accent colour on buttons |
| R5 | `DESIGN.md`: command bar, avatars, Settings page, PWA, Agentation, dark mode toggle in Settings | Remove for this site. Keep tokens, type, spacing, motion, accessibility and metadata rules | They are built for an app, and a public site has no Settings page. Dark mode decision moves to the design stage |

## 10. Spike

**Purpose:** answer the riskiest questions with throwaway code. Code is deleted afterwards, and only the findings are kept.

**Time box:** 2 working days. [DRAFT] Anything unfinished is labelled "UNRESOLVED – follow-up".

**Pinned versions:** next 16.4.3, react 19.3.1, payload and all `@payloadcms/*` 3.92.1, tailwindcss 4.3.3, shadcn 4.23.0. All Payload packages must match exactly.

| Tier | ID | Question | Method | Pass |
|---|---|---|---|---|
| 1 | S1 | Does the stack install and build on Windows? | Fresh app with a Post type and a shadcn button | Dev server and production build succeed |
| 1 | S2 | Does it deploy free with a real migration? | Vercel Hobby `fra1`, Neon Frankfurt, Vercel Blob, Git-triggered deploy | Deployed admin works, migration runs, schema push is off, image upload survives a redeploy |
| 1 | S3 | Is it fast enough from Kampala? | 30 runs each from your phone on mobile data: cached article, admin login after 10 minutes idle | Report p50 and p95. Article LCP under 2.5 s at p75 |
| 1 | S4 | Can a non-developer publish? | Daisy or a teammate writes a post with an image and publishes it, with no help | Done unaided in under 15 minutes, live within 60 s |
| 2 | S5 | Do large images upload? | Upload a phone photo above 4.5 MB | Works with client uploads turned on |
| 2 | S6 | Is search good enough? | 10 sample posts, 10 real queries | Expected result in the top 3 for at least 8 of 10 |
| 2 | S7 | Do enquiries work end to end? | Submit, store, email, then force an email failure | Stored in both cases, email received in the success case |
| 3 | S8 | How much free quota does it burn? | Read the Vercel and Neon usage after the spike | Projected to stay within free limits for the prototype |

If S3 or S4 fails, repeat that test on approach B before changing anything else.

**What you need to provide:**

1. Upgrade Node to 24 LTS, or to at least 22.23.4.
2. GitHub, Vercel, Neon and Resend accounts. Free tiers are fine.
3. One person other than you, for S4.
4. A phone on your normal mobile network, for S3.
5. One real draft article and a few photos you may use.
6. Permission for me to create the throwaway app in `temp/` or a separate folder.

No API keys need to be pasted into chat. They go in `.env.local`.

## 10a. Spike results so far (30 October 2026)

Throwaway code is in `C:\code\revalue-spike`. Local runs used portable Node 24.22.2 and Postgres 18 in Docker, against a production build.

| ID | Result | Evidence |
|---|---|---|
| S1 | **PASS** | Install, typecheck and production build succeed on Windows at the pinned versions. Cold build 398 s, repeat build 72 s. 2 migrations ran |
| S2 | UNRESOLVED – follow-up | Needs accounts |
| S3 | UNRESOLVED – follow-up | Needs the deployed site and your phone |
| S4 | UNRESOLVED – follow-up | Needs the deployed site and a teammate. Publish flow passed through the API only, not by a person in the admin screens |
| S5 | UNRESOLVED – follow-up | Needs Vercel Blob |
| S6 | **FAIL, then fix found** | Plugin `contains` search scored 6 of 10. Postgres full-text search scored 10 of 10 in SQL on the same records, but is not yet wired into the app. Samples were written by me, so repeat with real articles |
| S7 | PARTIAL | Enquiry stored, public cannot read it, team can. Email and the failure case need Resend. The page form itself was not submitted in a browser, only the API |
| S8 | UNRESOLVED – follow-up | Needs the deployed site |

Local end-to-end check: 16 of 16 passed. Drafts stayed hidden from the page, API and search. Publishing went live, and a cached page showed an edit on the first check, 44 ms after saving. These are local timings and say nothing about Kampala speed.

## 11. Checks from the planning prompt

| Check | Status |
|---|---|
| Money or irreversible state | Not applicable, the site takes no payments. Retry and duplicate rules for enquiries are in section 7 |
| Identity without accounts | Visitors have no accounts. Only team members log in |
| Performance | S3 reports p50 and p95. Animation will not be used to hide latency |
| Third-party UX | Email deliverability and Neon wake-up are tested in S3 and S7 |
| Cross-device and multi-session | Two editors on one document: check Payload's behaviour during the build. Phones and desktop tested per PRD N6 |
| Logged-out paths | All public pages work with nothing installed and no login |
| Hosting constraints | No local disk for uploads, cold starts measured, secrets in environment variables, no process-local state |

## 12. Current sequence (updated 31 October 2026)

1. Reconcile the received visual export with the CMS plan. Preserve confirmed CMS and URL decisions.
2. Review user flows and design at mobile and desktop widths. This can proceed while hosted spike tests are outstanding.
3. Complete the hosted spike and record S2–S8 with evidence. Local results are not hosted passes.
4. Finalise `implementation-spec.md` and execute `build-plan.md`. Patience subsequently authorised the local scaffold, shared components and Home before hosted tests. Stop for Home review at 390px and 1280px before other pages.
5. Build foundation and CMS, templates, content entry, SEO and analytics, then verify prototype acceptance and separate public-launch gates.

## 13. Risks

| Risk | Effect | Response |
|---|---|---|
| Payload moves fast, with frequent releases | Upgrades can break things | Pin exact versions and upgrade on purpose |
| Figma changes Payload's direction | Long-term uncertainty | MIT code, standard Postgres data |
| Too little content at launch | Thin pages hurt trust and search | Launch only hubs with real articles |
| Backups forgotten | Data loss | Neon restore window checked, plus a scheduled export |
| PDPO registration not in place | Legal exposure from the form | Check before public launch |
| Status claims drift over time | Trust damage | Required status fields, plus a review step before publishing |
