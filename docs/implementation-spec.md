# Revalue prototype implementation spec

Implementation baseline 0.2, 31 October 2026. This makes the existing plan concrete; new numeric limits and operational choices below are proposals until reviewed. Implementation starts with the scaffold/shared components/Home checkpoint authorised on 31 October; hosted verification is not claimed.

## Scope and source hierarchy

The prototype proves a teammate can publish an article through Payload and a visitor can discover it and submit an enquiry that is stored and notified by email. Preserve the prototype/Phase 1 distinction in `revalue-prd.md`. Use the route mapping and conflict register in `design-reconciliation.md`. Exact public wording comes from `design-brief.md`; new error wording below is draft copy. The export supplies visual guidance, not backend architecture. Patience approved the compact white Home and authorised the rest of the page build. Blog layouts take editorial structure from Forbes; company-page composition draws on Coca-Cola, Patagonia and IKEA without borrowing claims or assets.

## User flows

| Journey | Steps | Failure/empty behaviour | Completion |
|---|---|---|---|
| Institution discovers Revalue | Article → topic hub/tool → solution → contact | Hide absent related items; unavailable tool shows the supplied notice; solution availability remains visible | Stored enquiry confirmation |
| Recovery partner | Home → Partners → contact with partnership selected | Missing contact facts are omitted, never replaced with invented values | Stored enquiry confirmation |
| Reader searches | Resources → query and filters → result → article/project/solution | Empty query browses published content; no results and unavailable use supplied copy | Reach relevant published item |
| Teammate publishes | Login → create draft → image/alt text → preview → publish → check public page/search | Validation keeps draft; expired preview requires login; failed upload does not publish a broken reference | Public content and discovery pages refresh within 60 seconds |
| Teammate updates/unpublishes | Edit published item as draft → preview → publish, or explicitly unpublish | Draft edits must not replace the last published version; unpublished item disappears from all discovery surfaces | Public visibility matches saved publication state |
| Team handles enquiry | CMS inbox → view record → inspect email status → Admin retries/exports/deletes | Notification failure stays visible; public success means stored, not necessarily emailed | Team can read durable record and delivery status |
| Mobile visitor | Open menu → child panel → back or navigate | Escape closes; focus returns to trigger; route selection closes menu; reduced motion removes slide | Reach same destinations as desktop |

## Roles and content access

Proposed permissions, enforced server-side across API, admin and preview. Hiding an admin control is insufficient.

| Capability | Visitor | Editor | Admin |
|---|---|---|---|
| Read approved published public content | Yes | Yes | Yes |
| Read drafts and authenticated previews | No | Yes | Yes |
| Create/edit/preview/publish editorial content | No | Yes | Yes |
| Change project status, asset-release approval or consent records | No | No | Yes |
| Upload editorial media and set alt text | No | Yes | Yes |
| Read enquiries | No | Yes | Yes |
| Export/delete enquiries, retry notification | No | No | Yes |
| Manage users/roles and deployment secrets | No | No | Admin manages users; secrets remain outside CMS |

No public signup. Bootstrap the first Admin through a controlled setup step before sharing a preview. Editors cannot change their role through a crafted API request. Password reset uses expiring, single-use tokens and generic responses that do not disclose whether an account exists. Prove the chosen CMS configuration rather than assuming defaults satisfy this matrix.

Preview requires an authenticated authorised team session, validates the target and uses an allowlisted internal route. Draft content is never put in shared public caches, public search, sitemap or public APIs. Preview exit restores the public published view.

## Content and publication

The CMS must provide a real `/admin` portal for non-developers: login, article editing, image/file uploads, drafts, preview, publishing and version restore. Home, other page copy, navigation, footer and featured selections must use editable structured CMS fields. Initial seed copy follows the supplied brief word for word; team edits later use the same templates. This is structured content editing, not an unrestricted drag-and-drop theme builder.

Use the PRD collections and fields. Prototype includes one sample post, hub, project, solution detail and a test download; samples are review fixtures until approved. Globals cover homepage selections, contact details and navigation/footer. No unpublished guide is shown merely to fill a slot.

Publication validation checks required fields, primary topic, slug uniqueness/reserved words, image alt text and relevant approval/consent. Preserve `publishedAt` after first publish; set `reviewedAt` only through an explicit editorial action. Publishing a draft revision must preserve the current public version until the publish action commits.

Freeze public slugs in the prototype. The later Phase 1 rename workflow must atomically pair a change with a redirect. Unpublishing removes discoverability and serves 410 for a previously published URL, unless an explicit valid replacement redirect exists. Never expose a draft as the replacement.

Persist an invalidation work item with a content change, then invalidate the detail route, indexes, linked hub/related listings, homepage selections, search and sitemap as appropriate. Work items survive a process restart. Failed invalidation is visible to Admin and retryable; do not report a hosted freshness pass until publish, edit and unpublish are checked independently. Cached published pages are measured during database unavailability; uncached pages return a controlled failure and never fabricated content.

For simultaneous edits, verify Payload's actual locking/version behaviour. If stale overwrites are possible, require a version check on save and a recoverable conflict notice. Do not silently overwrite a newer teammate revision.

## Search

Index only published eligible posts, guides, approved tools, projects and solutions. Sync title, excerpt, route, content type and primary topic. Server-side Postgres full-text queries use parameterised inputs and return public fields only. Prototype filters cover topic and format; audience/material filters remain later scope. Proposed page size: 12; cap query length at 200 characters. Search uses `?q=`, `topic`, `format` and `page` so back/forward and shared links preserve state.

Prove the SQL approach through the application using real articles. Publish/update/unpublish must update results within 60 seconds; an old index entry is never sufficient to bypass current publication/approval checks. Ten test queries must have their expected results fixed before scoring. The existing 10/10 SQL fixture score is not an application pass.

## Enquiry handling

Name, organisation, email, type and message are required; phone is optional. Validate the fixed type list on the server. Proposed limits: name/organisation 120 characters, email 254, phone 40 and message 5,000. Escape rendered content and keep user input out of email headers. Provide the missing organisation error as draft copy: "Enter your organisation." Preserve all supplied field/error wording otherwise.

Sequence: validate → honeypot/rate-limit check → durable insert or duplicate lookup → enqueue notification → return acceptance. Notification work is recorded in the same transaction as the enquiry. Database failure returns a server error and retains entered text; no success before storage. A honeypot hit returns the ordinary confirmation without storing/sending.

For a lost response, retry the same submission ID. Add a unique idempotency key and an atomic duplicate guard for normalised email plus trimmed message within 10 minutes. Concurrent requests must produce one accepted enquiry. A bounded transactional lookup/lock is needed for the time window; a simple time-bucket hash alone misses duplicates across bucket boundaries. Duplicate responses do not disclose another person's message.

Proposed rate limit: five valid attempts per 15 minutes per trusted proxy-derived IP; use persistent storage and an atomic counter, never process memory. Store a rotating salted digest, not raw IP, for this counter; expire it after the window. If the limiter cannot verify a request, return a retryable error. Proposed throttling copy: "Too many attempts. Please wait and try again." Do not log message bodies, contact fields or raw search terms.

Track notification as pending/sent/failed with attempt count, last attempt and provider reference. Reuse one provider idempotency key per enquiry. Retry on an Admin action in the prototype; no scheduler is assumed. Reconcile ambiguous provider responses before retrying outside the provider's verified deduplication window. Admin sees stored-but-unsent enquiries. Test a forced email failure and a lost provider response; a resend must not create another enquiry.

Sending makes fields read-only, prevents repeated activation and exposes busy state. Validation focuses a linked error summary. Confirmation replaces the form and receives focus. Connection/server failure preserves in-memory text. Proposed default: no localStorage persistence of personal messages. If cross-session drafts are later chosen, first update the Privacy copy and define consent, expiry and shared-device behaviour.

## Media, privacy and operations

Blob credentials and upload authorisation stay server-side. Direct uploads require authenticated team access and server-enforced size/type policy. Proposed image limit: 15 MB, JPEG/PNG/WebP only; test a real photo above 4.5 MB. Block SVG/HTML uploads from public rendering. Validate actual file type as well as extension. Tool downloads need separate file validation and Admin release approval. Do not treat public Blob URLs as private: confidential drafts must use private delivery or remain unuploaded; prove access before using sensitive material.

Optimise delivered images and subset fonts; article first load stays under the PRD's 500 KB budget, including above-fold images, scripts, styles and fonts. Keep the large editorial treatment through composition rather than unnecessarily large downloads. Load below-fold images lazily. Verify dark-surface focus visibility and text-over-photo contrast against actual images.

Prototype uses synthetic enquiry data until the Privacy review and processing prerequisites are settled. Private access requires real access control; robots/noindex alone are insufficient. Exact free hosting/protection entitlement is an unresolved hosted gate, not a guarantee. No paid service or public release is authorised by this spec.

Retention remains a proposed 24 months. Before collecting real enquiries, assign an owner and deletion process covering database, exports, inbox and backup expiry; revise the Privacy page to match actual providers, counter metadata and retry records. Patience approved the existing Resend account with a separate Revalue API key. Optional tracking stays off; privacy is presented through a footer link and contact-form notice. Prototype analytics stays off until configured and disclosed. At launch, track aggregate page views, enquiry types and zero-result counts without enquiry details or raw free-text search terms.

Keep dev, hosted spike and launch data/secrets separate. Commit migrations; disable schema push in hosted environments. Before a hosted schema change, take a restorable snapshot/export, test migration on a copy, and document roll-forward/restore. A code rollback alone may not undo a schema change. Test restoration of both database and media before launch. Monitor failed submissions, notification backlog, invalidation failures and quota alerts with redacted logs.

## Readiness

The build sequence and complete PRD verification matrix are in `build-plan.md` and `acceptance-matrix.md`. Deployment, provider capabilities, live mail and mobile measurements remain unverified. This spec records intended behaviour, not proof that any vendor implements it by default.

## Implementation status

The spec and ordered build sequence are written. The public page layer, Payload collection configuration, authenticated article-preview route, enquiry handler and Resend notification/retry code are implemented. Local review content is explicitly separated from CMS mode.

The local database is connected, with committed migrations and explicit baseline/review seeds. Public pages now read real CMS data. Navigation/footer, Home copy and featured selections, company sections/team/principles/pricing, contact details and index introductions have CMS fields. Search uses parameterised PostgreSQL full-text queries with published-row and release-approval checks. Rich-text tables, article metadata/social-image fields and a search-result preview are implemented. Public asset URLs use the same-origin, access-controlled file endpoint.

Durable public-refresh records, short-lived public caching, removed-publication 410 responses, Admin enquiry CSV export, retention preview/cleanup and controlled notification reconciliation are implemented. Local API/browser/backup evidence is recorded in `local-backend-checkpoint.md`. The earlier 100-item application-search limitation is removed.

Live Resend delivery, actual private R2 uploads/redeployment, hosted cache freshness, Kampala mobile performance and unaided teammate publishing remain hosted/human acceptance gates. Legal copy, asset rights and operational retention ownership still need review before public collection. Scheduled publishing and URL-renaming redirects remain the explicitly deferred scope; published URLs stay frozen.
