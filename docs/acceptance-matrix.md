# PRD acceptance matrix

31 October 2026. This covers all PRD goal, functional, CMS and non-functional IDs. Results below now distinguish local evidence from hosted/human gates; see `local-backend-checkpoint.md`. Spike results remain in the technical plan; they are not product passes.

| ID | Requirement | Scope | Verification | Result |
|---|---|---|---|---|
| G1 | "A credible website that can publish content and generate conversations." [BRIEF] | Goal | Unaided CMS publishing and delivered browser enquiry; S4/S7 | UNRESOLVED |
| G2 | Earn trust through honesty about stage | Goal | Review all public claims and status/consent gates | UNRESOLVED |
| G3 | Build toward a useful knowledge library | Goal | Review schema against every PRD content format | UNRESOLVED |
| G4 | Be found in search | Goal | Production SEO/indexing audit; private prototype stays noindex | UNRESOLVED |
| F1 | Home presents the "Waste has value" message, what Revalue does, audience pathways, featured work and one route to enquire | Prototype | Home visual and content review at 390/1280px | LOCAL PASS: approved Home; CMS copy/selections wired |
| F2 | Article page shows title, author, publish date, primary topic, breadcrumbs, body, related content and a relevant next step | Prototype | Article template populated from CMS | LOCAL PASS: CMS article rendering and routes |
| F3 | Blog index lists articles with pagination and filter by topic | Prototype | Pagination/filter browser checks with multiple records | LOCAL PARTIAL: filtering/empty states; larger editorial corpus and browser review remain |
| F4 | Topic hub shows an introduction, a recommended starting article, related articles, tools and adjacent topics | Prototype | Hub with one item and full related set | UNRESOLVED |
| F5 | Project page follows the eight-part structure in `Website_Build.md` section 5, with a required status label | Prototype | Project eight-section audit | UNRESOLVED |
| F6 | Solution page shows scope, who it is for and an availability label | Prototype | Solution availability and CTA states | UNRESOLVED |
| F7 | Site search covers published articles, guides, tools, projects and solutions | Prototype | App-level search relevance and draft exclusion; S6 | LOCAL PASS: PostgreSQL application search, ten cases and draft exclusion; hosted gate open |
| F8 | Tool page shows who it is for, how to use it, a preview, version date and a download | Phase 1 | Approved download and unavailable state | UNRESOLVED |
| F9 | Pricing page explains cost factors for each offering, with no invented prices, and leads to an enquiry | Phase 1 | Cost-factor content review; no invented prices | LOCAL PASS: editable factors, no invented prices |
| F10 | Mobile navigation works without hover and keeps the contact action visible | Prototype | Keyboard/mobile overlay, panels, focus restoration | UNRESOLVED |
| F11 | Custom 404 page that links to search and Resources | Prototype | Unknown URL returns 404 with resource/search route | LOCAL PASS: genuine 404 and removed-publication 410 |
| F12 | Enquiry form captures name, organisation, email, phone (optional), enquiry type and message | Prototype | Browser form plus stored record field audit | LOCAL PASS: validation and synthetic stored-field audit |
| F13 | Enquiry types: Waste discovery or assessment, Partnership or recovery, Funding or research, Media, General | Prototype | Server rejects unknown enquiry type | LOCAL PASS: unknown type rejected |
| F14 | Each submission is stored in the CMS and emailed to the team | Prototype | S7 stored-first email/failure/retry | PARTIAL: durable storage/failure/retry pass; live mail not configured |
| F15 | The sender sees a clear confirmation, and a clear fix when validation fails | Prototype | Validation, sending, success, offline/server errors | UNRESOLVED |
| F16 | The form has spam protection that does not add a puzzle for real users, such as a honeypot and rate limit | Prototype | Concurrent duplicate/honeypot/persistent rate-limit tests | LOCAL PASS: honeypot, concurrency, duplicate lookup and limiter |
| F17 | The form explains why data is collected and links to the Privacy page | Prototype | Privacy link and actual-data disclosure review | UNRESOLVED |
| C-1 | Team members log in with email and password. Roles are Admin and Editor | Prototype | API permission matrix and login/reset checks | LOCAL PARTIAL: login/roles pass; live email/reset delivery remains |
| C-2 | Editors write in a rich text editor with headings, links, images, quotes and tables | Prototype | Create all required rich-text formats through admin | LOCAL PARTIAL: rich-text/table save and render pass; unaided editor exercise remains |
| C-3 | Content moves through Draft and Published. Earlier versions can be restored | Prototype | Draft revision isolation, publish, restore and conflict checks | LOCAL PASS: draft isolation, publish, restore and stale HTTP save |
| C-4 | Editors preview a draft before publishing | Prototype | Unauthorised preview denied; authorised preview works | LOCAL PASS: authenticated preview; anonymous denied |
| C-5 | Publishing updates the live site without a developer or a full redeploy | Prototype | S4 publish/edit/unpublish on hosted app within 60s | LOCAL PASS: live process refresh; hosted 60s gate open |
| C-6 | Images are uploaded in the CMS with required alt text | Prototype | Admin upload >4.5MB, alt-text validation, redeploy persistence | LOCAL PASS: large/invalid/private/approved upload checks; hosted persistence open |
| C-7 | Editors can set meta title, description and social image, with a search-result preview | Prototype | CMS SEO fields and rendered metadata | LOCAL PARTIAL: metadata/social-image fields and preview implemented; live content review remains |
| C-8 | Editors can manage navigation, footer and featured content | Phase 1 | Global navigation/footer/featured update refreshes frontend | LOCAL PASS: global navigation update refreshes public page |
| C-9 | Editors can add redirects when a URL changes | Phase 1 | Rename and redirect atomicity; no redirect loops | DEFERRED: published URLs frozen in prototype |
| C-10 | Editors can view enquiries inside the CMS. Admin can export and delete them | Prototype | Editor read; Admin export/delete; public API denied | LOCAL PASS: team read, Admin export, anonymous denied; delivery retry protected |
| C-11 | Scheduled publishing | Phase 2 | Deferred; configured runner required before claiming support | DEFERRED: Phase 2 |
| N1 | Published public pages reach Largest Contentful Paint under 2.5 s at the 75th percentile on a mid-range phone on a Kampala mobile connection | Prototype where applicable; launch operations before public release | S3: 30 Kampala mobile runs, p50/p75/p95 and p75 LCP <2.5s | UNRESOLVED |
| N2 | Article pages load under 500 KB on first visit, excluding images below the fold | Prototype where applicable; launch operations before public release | Cold article transfer <500KB including above-fold assets/fonts | UNRESOLVED |
| N3 | A published change is live within 60 seconds | Prototype where applicable; launch operations before public release | Hosted publish/edit/unpublish propagation <60s | UNRESOLVED |
| N4 | Public pages keep working if the database is asleep or briefly unavailable, because they are served from cache | Prototype where applicable; launch operations before public release | Warm published route during forced DB outage; cold path controlled | LOCAL PASS: three warm pages during stopped DB; hosted gate open |
| N5 | WCAG 2.2 AA: contrast, keyboard use, focus states, form labels, 44px touch targets | Prototype where applicable; launch operations before public release | axe plus manual keyboard/contrast/touch and reduced-motion review | PARTIAL: automated/browser evidence only; full audit open |
| N6 | Mobile first, tested at 360px, 390px and 1280px on browsers supported by Next.js | Prototype where applicable; launch operations before public release | 360/390/1280px and supported browser checks | PARTIAL: recorded viewport checks; supported-device coverage open |
| N7 | HTTPS, secure cookies, admin routes not indexed, secrets kept out of git, least-privilege roles | Prototype where applicable; launch operations before public release | HTTPS/cookie/access/secret and unauthorised API checks | UNRESOLVED |
| N8 | Database and media can be restored. Restore is tested once before launch | Prototype where applicable; launch operations before public release | Restore DB plus media into isolated environment | LOCAL PASS: database/media restore; actual hosted stores open |
| N9 | Compliance with the Data Protection and Privacy Act 2019, including PDPO registration before public launch | Prototype where applicable; launch operations before public release | Owner review and prerequisites before real public collection | UNRESOLVED |
| N10 | Prototype costs nothing to run where permitted. Launch cost is stated in the plan | Prototype where applicable; launch operations before public release | S8 quota projection and recorded authorised hosting choice | UNRESOLVED |
| N11 | Content can be exported, and the app can move host without a rewrite | Prototype where applicable; launch operations before public release | Export sample content/media and document host migration | LOCAL PARTIAL: database/media export and restore; hosted migration open |
