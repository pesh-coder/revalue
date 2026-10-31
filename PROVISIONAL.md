# Content and implementation review register

31 October 2026. Home is the first review checkpoint. This is a local visual prototype, not a public launch.

- `REVALUE_CONTENT_MODE=review` explicitly enables sample content. CMS mode must never silently fall back to these fixtures after a database failure.
- Only the supplied sample article is used. Its byline/date remain review content; proposed supporting titles and the unwritten guide are omitted.
- All `stock-*` images are review stand-ins. The prototype photo is unchanged and still needs Daisy's consent before public use.
- Project/solution status, operator identity, name spelling, UNDP recognition, Daisy's profile and claims need the approvals listed in the design brief.
- Home’s one-article state uses an image/text split on desktop instead of an empty supporting column. No invented stories fill it.
- Candidate B is used for the visual review; name remains a central constant.
- Email provider is undecided pending Patience's explicit choice. No email service has been integrated.
- Desktop layout is an interpretation of the supplied mobile references. Review Home at 390px and 1280px before other pages.
- The initial CMS foundation covers users, media, posts and a homepage global. Remaining collections, approval gates, private-media delivery, migrations, preview, retry workflows and hosted tests are subsequent work, not completed features.

## Copy gaps filled

- Accessibility labels: “Skip to content”, “Open menu”, “Close menu”, “Main navigation”, “Menu” and “Footer”.
- Resource child-navigation labels come from the PRD: “Blog”, “Guides”, “Tools and templates”.
- CMS labels, validation and configuration messages are administrative copy, not marketing claims.
- No new public marketing paragraphs, statistics or article titles have been invented.

## Home editorial revision, 31 October

Patience requested a professional alternative to the development badge. Home no longer has a stage strip or status pills. Project-stage information remains in the featured project description; backend status values are unchanged.

New review copy: ?Our focus?, ?Keeping value in circulation.?, ?We focus on how waste is understood, separated and connected to recovery opportunities in Uganda.?, ?Explore our work?, ?The prototype is being tested as we prepare for a field pilot.? and ?Smart segregation prototype, Revalue.? These replace the earlier stage-strip treatment and caption. They state focus/current activity without inventing customers or verified recovery results.

## White editorial layout revision

Patience requested white backgrounds and a compact Forbes-inspired layout below the hero. Content was regrouped without adding article titles or marketing claims. ?Latest from Revalue? is now a section heading; the introduction and audience pathways share a desktop sidebar. The mobile project uses a small thumbnail; its longer description remains visible on wider screens and the stage sentence remains on mobile. ?Explore Revalue? is the heading when there are no articles. Other page layouts follow docs/editorial-layout.md.

## Remaining pages and approved email/privacy decisions

- Patience approved the compact white Home and authorised the remaining pages with Forbes-inspired blog structure and major-brand company-page references.
- Resend in the existing account is approved. Use a separate sending-only key. No credentials or verified sender were supplied in this session.
- No automatic cookie/privacy pop-up: optional tracking stays off, with a Privacy link in the footer and a notice at the form.
- New copy fills missing empty states, short solution introductions, tool instructions, company transitions, form configuration/error messages and policy review context. The sample article body remains the supplied four paragraphs. No supporting article ideas are presented as published articles.
- Unverified performance numbers, UNDP recognition, Daisy's public profile and the project-origin line are omitted. The original prototype photograph remains a local review asset pending permission for public use.
- The toolkit remains unavailable for download until a cleared file exists. No fake workbook or speculative guide is generated.
- Privacy copy omits the original aggregate-analytics claim because tracking is not enabled. It explicitly identifies the current local review and pending operational policy review.
- UI and provider-unit checks do not establish a working database, production search relevance, live delivery, retention cleanup or a completed compliance review.

## About page correction

Patience explicitly requested Daisy Nyaburu's inclusion as Hardware Lead. This replaces the earlier omission of her profile. The About page now shows her name and role with initials, alongside Patience; no biography or photograph has been invented. The six supplied principles retain their exact wording and order in a numbered list. The page background stays white, with a deep-green principles panel drawn from the About design reference.

## Local CMS completion

Added operational wording for the Admin dashboard, search-result preview, structured table captions, stale-edit recovery, password-reset availability, notification reconciliation and the HTTP 410 page. These are interface messages, not new marketing claims. Initial index introductions reuse the existing page copy. Baseline seeding publishes initial page text/globals only and creates no example projects/articles or uploads. The local review seed is restricted to a loopback database; its sample images and claims still require clearance before public launch. Current verification and remaining launch gates are in `docs/local-backend-checkpoint.md`.
