# Design export reconciliation

31 October 2026. This compares the received export with the PRD and technical plan. Home has now been rendered and visually compared at the first implementation checkpoint; see `home-checkpoint.md`. The other reference screens remain unverified visually.

## Confirmed direction

Patience explicitly chose **Payload CMS and the original URLs**, using the export for visual design only, on 31 October. Next.js, Payload, Postgres and Blob remain the proposed application stack. Patience subsequently requested explicit email-provider selection before contact integration; Resend remains only a candidate. Hosted validation remains outstanding. There are no visitor accounts; team CMS accounts are required.

`docs/design-brief.md` and `design/handoff.md` currently contain the same brief. Treat `docs/design-brief.md` as the current design brief; the older path is retained as a historical handoff. Behaviour comes from the PRD and implementation spec. Visual detail comes from the brief and export. Unresolved visitor-facing differences remain explicit proposals.

## Differences and disposition

| Difference | Disposition |
|---|---|
| Export removes CMS and suggests local content | Superseded by Patience's confirmation. Payload is the source of published content. Seed fixtures are allowed for development only. |
| Export uses `/blog`, `/topics`, `/tools` | Superseded. Map to the original resource routes below; do not create duplicate indexable pages. |
| Export suggests client-only search | Use the existing search spike direction. A browser-only index would not prove CMS publishing/search freshness. |
| Export says email service is undecided | Patience approved the existing Resend account with a separate Revalue sending key. Keep the stored-first enquiry flow; live deliverability is still untested. |
| Export says no accounts | Apply to visitors. Admin and Editor accounts remain required. |
| Article reference names Daisy; brief names Patience | Keep Patience for the sample, as proposed in the export. Actual byline must be confirmed before public publication. The brief calls this a sample, so do not treat it as an approved real article. |
| Export stores contact drafts in localStorage; Privacy omits this | Proposal: keep text in memory after failure; do not persist personal messages across browser sessions. This changes no supplied error wording. Confirm before implementation if cross-session recovery is wanted. |
| Large images versus 500 KB article budget | Keep visual composition; use appropriately sized responsive derivatives. Measure transferred assets, including fonts, JS and the first image. Source image file size is not the delivered budget. |
| R2–R5 were applied without individually recorded agreement | Keep as reviewable design proposals: slide-in menu, two fonts, green buttons/clay labels and removal of app-only features. Do not label them confirmed. |
| Light buttons on dark areas are an export addition | Proposed for contrast, subject to visual review. Verify focus indicators on dark surfaces as well as text contrast. |
| Stock stand-ins and unverified claims look final in references | Review-only fixtures. Public release must omit unapproved claims/assets and unfinished featured content. No future reviewed date is seeded as fact. |
| 390px screens supplied; 1280px not drawn | Desktop layout is an implementation/design review task. Also check 360px, keyboard navigation and reduced motion. |
| `SolutionDetailClassic.dc.html` | Excluded trial, not an alternate route or approved visual direction. |

## Route translation

| Export route/reference | Application route |
|---|---|
| `/blog`, Blog | `/resources/blog` |
| `/blog/[slug]`, Article | `/resources/blog/[slug]` |
| `/topics/[slug]`, TopicHub | `/resources/[topic]` |
| `/tools/[slug]`, Tool | `/resources/tools/[slug]` |
| Guides, future content | `/resources/guides` and `/resources/guides/[slug]` |
| All other public routes | Keep the PRD routes; the corresponding export screen supplies visual layout |
| CMS | `/admin`, authenticated; not part of the public navigation |

Reserve `blog`, `guides`, `tools` and `data-reports` against topic slugs. There is no evidence these shorter export URLs were ever public, so redirects are not needed just for design-file links.

## Design review still required

Render and compare the actual references before implementing layouts. Confirm mobile menu, two-font treatment and on-dark buttons together in a review. Evaluate the home, article, project and contact journey at 390px and 1280px first. Keep desktop work and reference access marked unverified until seen in a browser.
