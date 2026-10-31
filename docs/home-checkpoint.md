# Home review checkpoint

31 October 2026. Stop here for Patience's Home review before implementing additional public pages.

## Implemented

- Next.js 16.4.3, TypeScript and Tailwind 4 scaffold with the supplied tokens, Newsreader and Source Sans 3.
- Restyled shadcn Button/Dialog primitives, Phosphor icons, header, mobile menu and child panels, footer, status tag, Photo and Notice.
- Home sections translated from the visual reference into reusable Tailwind components. Original resource URLs preserved.
- Explicit local review content mode with one supplied sample article. Supporting editorial ideas and the unwritten guide are not published as filler.
- Payload `/admin` and API route foundation, generated import map/types, user roles, media/posts collections and homepage global. Database-backed portal use has not been tested or represented as complete.

## Evidence

| Check | Result |
|---|---|
| Production `next build` | PASS. Home prerenders; admin and API routes remain dynamic. |
| TypeScript | PASS, including the production build type check. |
| ESLint | PASS, no warnings/errors in final run. |
| Widths 360, 390, 1280 | No horizontal overflow in the collaborative browser. |
| Home 390/1280 screenshots | Captured and visually inspected; copies in `artifacts/home-390.png` and `artifacts/home-1280.png`. |
| Supplied Home reference | Rendered at 390px and visually compared. Reference `support.js` is absent; its missing request is an export issue, not an application dependency. |
| Mobile menu | Opens with focus inside; Resources panel shows original resource routes and focuses back control; Escape closes and returns focus to trigger. Body scroll is locked. |
| Fonts and imagery | Intended fonts loaded; all three Home images loaded, including the below-fold unchanged prototype photo. |
| axe-core 4.10.3 WCAG A/AA tags | Zero detected violations at 390px (25 rule passes) and 1280px (24 rule passes). Colour-over-photo checks remain incomplete and need manual verification. This is not a full WCAG certification or Lighthouse score. |
| Hosted deployment/CMS publishing/email/mobile performance | UNRESOLVED. No provider/account configuration or hosted pass claimed. |

## Differences and limits for review

The sparse-content desktop state places the single article image beside its text; it does not invent three supporting posts. Supplied stock imagery and provisional operator/photo content remain local review fixtures. Full content editing, preview, publication approval, migrations/private media and remaining collections are subsequent CMS work.

Public copy follows the brief/export. Filled copy gaps are accessibility/control labels and CMS administration messages, listed in `../PROVISIONAL.md`. No new marketing claims or statistics were introduced. No email provider is selected or integrated; ask Patience before contact implementation.

Only Home exists as a public page at this checkpoint. Links to planned pages intentionally retain their final destinations; those pages are not built yet. Do not interpret successful Home rendering as a complete website.

## Review

The production preview is `http://localhost:3000`. A local comparison at `http://localhost:3101/home-review.html` embeds that same Home at 390px and 1280px. It is a review aid, not a website route. Screenshot capture initially failed but recovered; screenshots are now available.

## Editorial revision after client review

Patience rejected the prominent development badge and requested established environmental/editorial sites as references. Home's stage strip and status pills were removed. A two-column purpose introduction now reads ?Keeping value in circulation.? Project-stage information is expressed in the featured project's description.

References reviewed: Forbes (https://www.forbes.com/) for article/category/byline structure; Ellen MacArthur Foundation (https://www.ellenmacarthurfoundation.org/) for purpose-first presentation and work priorities; The Nature Conservancy (https://www.nature.org/en-us/) for mission/work/stories; Veolia (https://www.veolia.com/en) for activity and audience pathways. EMF was also inspected in the collaborative browser. These inform hierarchy and presentation; they are not sources of Revalue claims or borrowed copy.

Updated Home checked at 390px and 1280px with no horizontal overflow; TypeScript and changed-page ESLint pass. The earlier production-build and axe results above belong to the initial checkpoint and were not rerun for this presentational revision. Updated screenshots: `artifacts/home-editorial-390.png` and `artifacts/home-editorial-1280.png`. New public copy is recorded in PROVISIONAL.md and both design briefs; the earlier verbatim-only direction is superseded for these user-requested Home changes.

## Compact white layout revision

Patience requested pure white backgrounds, removal of section rules, less empty space and a Forbes-inspired arrangement beneath the hero. Home now groups the lead article, project and focus/audience sidebar in one 6/3/3 desktop grid. On mobile, the lead article is followed by a compact project thumbnail/text row. Approach/contact content and the shared footer are smaller. The hero remains unchanged.

The desktop page measures approximately 1,812px tall at 1280px width, compared with roughly 3,963px for the earlier Home. Mobile measures 2,478px tall at 390px width. Both widths have no horizontal overflow; axe WCAG A/AA checks detect zero violations, with image-background contrast still requiring manual review. Updated screenshots are `artifacts/home-white-390.png` and `artifacts/home-white-1280.png`.

The shared white surface/background tokens, tighter `section-space`, compact footer, `SectionHeading` and `PageIntro` are implemented. Other public pages are still subsequent work; their intended arrangements are documented in `editorial-layout.md`. TypeScript and lint checks cover this revision; a fresh production build has not been run for it.
