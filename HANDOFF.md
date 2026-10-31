# Revalue website: build handoff

This folder holds the Revalue website design export and planning documents. Read `docs/implementation-spec.md` first for application behaviour, then `docs/design-brief.md` and this file for visual implementation.

**Reconciliation, 31 October 2026:** Patience confirmed that Payload CMS and the original resource URLs stay. The local-content, client-only search and undecided email-backend suggestions below are superseded. Use Payload and PostgreSQL search as described in the technical plan. Patience approved Resend in the existing account with a separate Revalue API key. The export supplies visual references; it does not remove the CMS. See `docs/design-reconciliation.md` for the full comparison and route mapping.

**Home presentation update, 31 October:** the client requested a more professional, purpose-led presentation informed by established environmental and editorial sites. The updated brief and Home implementation supersede the original development strip and Home status pills. Keep stage information in relevant project copy; use the brand documents as guidance.

**Compact layout update, 31 October:** pure white backgrounds and a denser editorial grid supersede the cream backgrounds, section rules and 96px gaps in the original export. The hero is retained. Home now groups article/project/sidebar content and uses compact shared SectionHeading/PageIntro components for subsequent templates. See `docs/editorial-layout.md`.

**Precedence when sources disagree:**
1. `docs/design-brief.md` (the brief) for copy, colours, type, bans and screen content.
2. This file, for decisions made during design that the brief left open.
3. `design-reference/screens/*.dc.html` for layout, spacing and visual detail.

If two of these conflict and the conflict changes what a visitor sees, stop and ask. Do not pick one silently.

---

## 1. What is in this folder

| Path | What it is |
|---|---|
| `docs/design-brief.md` | The client brief. Source of truth for copy, tokens, hard bans and every screen's content and states. |
| `design-reference/screens/*.dc.html` | The approved designs, one file per screen, drawn at 390px wide but already fluid. |
| `design-reference/tokens.css` | Tailwind v4 `@theme` block with every token from the brief, in oklch. Start `app/globals.css` from this. |
| `design-reference/canvas.json` | Index of the design canvas. Its `notes` hold the PROVISIONAL list and the gaps filled during design. |
| `public/images/` | Every image used in the designs (see section 8). |
| `brand/` | Logo mark SVGs (recommended candidate B), a favicon, and the two unused candidates for the record. |

### How to read the `.dc.html` reference files

They were made in a design tool, not as production code:
- They open in a browser for a rough look, but template syntax shows literally: `{{status}}`, `<sc-if>`, `<x-dc>`, `<helmet>`, and the `<script type="text/x-dc">` block at the bottom. `<sc-if>` blocks are alternative **states** of the screen: both branches are shown here, but the site renders only one.
- Styles are inline plus a small `<style>` block per file, all with hex values. Translate them to Tailwind classes using the tokens. **Do not copy the inline styles or the class names (`.sf`, `.dxl`, `.kick`, `.ph`) into the app.**
- Links point at other `.dc.html` files. Map them to the routes in section 3.
- `Main.dc.html` is the token sheet, `Tags.dc.html` the status tag spec, `Logos.dc.html` the logo study. They are reference, not pages.
- `SolutionDetailClassic.dc.html` was a trial of a more conventional "WordPress-like" layout. **It is not approved.** Ignore it unless Patience says otherwise.

---

## 2. Stack

- **Next.js** (App Router, TypeScript), statically rendered wherever possible.
- **Tailwind CSS v4**, CSS-first config from `design-reference/tokens.css`. No `tailwind.config.js` theme.
- **shadcn/ui** for base primitives, restyled only through the tokens. No default shadcn colours, radii or shadows may survive.
- **Phosphor icons**, regular weight (`@phosphor-icons/react`). The designs use: List, X, CaretRight, CaretLeft, ArrowRight, MagnifyingGlass, DownloadSimple, Warning, WarningCircle, CheckCircle. Icons are rare. Do not add any.
- **Fonts** via `next/font/google`: `Newsreader` (weights 400 and 600, with the optical-size axis) as `--font-newsreader`, and `Source_Sans_3` (400 and 600) as `--font-source-sans`. No other fonts and no other weights.
- **Content**: Payload CMS with drafts, authenticated preview and publishing. Typed seed data may initialise the prototype; it is not the publishing workflow.
- The site has **no** accounts, shop, payments, live dashboard, newsletter pop-ups, impact counters, partner logos or social logins.

---

## 3. Routes

| Route | Screen | Reference file |
|---|---|---|
| `/` | Home | `Home.dc.html` |
| `/solutions` | Solutions overview | `Solutions.dc.html` |
| `/solutions/[slug]` | Solution detail (first: `waste-discovery-review`) | `SolutionDetail.dc.html` |
| `/resources` | Resources hub, with search | `Resources.dc.html`, `ResourcesStates.dc.html` |
| `/resources/blog` | Blog index (topic filter `?topic=`) | `Blog.dc.html` |
| `/resources/blog/[slug]` | Article (first: `what-is-a-waste-audit`) | `Article.dc.html` |
| `/resources/[topic]` | Topic hub (first: `waste-audits`) | `TopicHub.dc.html` |
| `/resources/tools/[slug]` | Tool page (first: `waste-audit-toolkit`) | `Tool.dc.html` |
| `/projects` | Projects index (status filter `?status=`) | `Projects.dc.html` |
| `/projects/[slug]` | Project (first: `smart-segregation-prototype`) | `Project.dc.html` |
| `/partners` | Partners | `Partners.dc.html` |
| `/pricing` | How pricing works | `Pricing.dc.html` |
| `/about` | About | `About.dc.html` |
| `/contact` | Contact form | `Contact.dc.html`, `ContactStates.dc.html` |
| `/terms`, `/privacy` | Legal | `Terms.dc.html`, `Privacy.dc.html` |
| `not-found.tsx` | 404 | `NotFound.dc.html` |

Global: header and footer on every page; the mobile menu is `Menu.dc.html` and `MenuResources.dc.html`.

Desktop (1280px) was **not drawn**. Build mobile-first from the references, and at wider widths follow the brief's rules: 1200px container with 24px gutters, the article column about 680px, 32?40px between content groups, and a lead story beside compact supporting content. The references already use `auto-fit` grids that go side by side at desktop widths; keep that behaviour. Show Patience the desktop result before polishing it.

---

## 4. Tokens and type

Use `design-reference/tokens.css` as is. The rules that matter most:
- **Forest** (`forest`, `forest-hover`) is only for buttons, links and the focus ring. **Deep** carries headings and large dark bands.
- **Clay** is only the 6px dot in a status tag. Tag words are `clay-text` on `clay-tint`. Never use clay on buttons, fills or body text.
- Use pure white as the page background with the Revalue dark text palette. Light theme only: no dark mode and no toggle.
- **Newsreader 600** for every headline 22px and up (`text-display-xl`, `text-headline-lg`, `text-headline-md` plus `font-serif`, colour `deep`). Everything else is Source Sans 3. Nothing below 12px. Inputs are at least 16px.
- Radius: 4px controls, 8px images and cards, pill tags, 0 on full-bleed photos and bands.
- Spacing: 4, 8, 16, 24, 32, 48, 64, 96. Content groups use 24px on mobile and 32?40px on desktop. Gutters are 16px on mobile, 24px from 768px.
- Every pointer target is at least 44px.

---

## 5. Components

Build these once and reuse them. The reference file in brackets shows each one.

- **SiteHeader** (any screen): a plain bar on `neutral` with a 1px `border` bottom, not floating and with no blur. Mark plus "Revalue" wordmark (Newsreader 600, 24px, tracking -0.02em) on the left. Nav (Solutions, Resources, Projects, Partners, Pricing) shows from 1024px; the current page gets `aria-current` and a 2px underline. Then a small primary button "Contact us", and below 1024px a 44px menu button.
- **MobileMenu** (`Menu`, `MenuResources`): a full-screen overlay on `surface` with `role="dialog"` and a focus trap. Items are 28px serif rows. Items with children (Solutions, Resources) open a **slide-in panel** with a "Menu" back link. Never accordions. Footer area: full-width "Contact us" button, then About, Terms and Privacy links, then "Waste has value." Motion: 250ms transform and opacity, off for reduced motion.
- **SiteFooter**: a `deep` band holding the mark, "Waste has value." (headline-lg), About, Contact, Terms and Privacy links, and the operator line after a faint rule.
- **StatusTag** (`Tags`): a pill on `clay-tint` with a 6px clay dot and the words in `clay-text`, at label-sm. Include visually hidden "Status: " before the value. Typed values:
  - `ProjectStatus = 'Concept' | 'In development' | 'Testing' | 'Pilot' | 'Completed' | 'Published research'`
  - `SolutionStatus = 'Available' | 'In development' | 'Exploring'`
  - **No page may render `Pilot` or `Available` today.** Add a unit test that fails if any content item uses either value.
  - Signature motion: the tag settles 4px upward with a fade, 250ms, **once**, when its card first enters view (IntersectionObserver, then disconnect).
- **Button**: primary is forest with on-forest words, 48px tall and 4px radius, turning `forest-hover` on hover. A small variant is 44px. The **on-dark variant**, used on deep bands and the photo hero, is `surface` with `deep` words. It is a design decision not in the brief: forest disappears on deep.
- **TextLink**: forest, 600, underline with 4px offset. **Kicker**: the `kicker` utility.
- **RuledList / Index rows**: stories and lists are separated by 1px `border` rules, and a section starts with a 2px `deep` rule. Avoid cards; the only cards are the next-step card, the "What we will not do" box, the Start-here card and the partners note.
- **NumberedSteps**: a serif numeral column plus text, separated by rules (Solution detail, Partners, Tool).
- **Photo**: `next/image` with `object-fit: cover`, an 8px radius when inline and 0 when full-bleed, a `photo` fallback colour, and an optional caption in body-sm muted.
- **Hero photo with overlay** (Home): full-bleed image, a `deep` overlay at 62%, and the headline bottom-left. Text must pass AA at every point it covers.
- **Breadcrumbs**, **SearchField** (visible label, magnifier inside the input, Search button), **FilterChips** (`button` + `aria-pressed`, horizontal scroll on mobile, selected = deep fill), **Pagination**, **Notice** (surface box with a 3px top rule in warning, error or success and a matching icon, used for the safety note and the form errors), **Byline** (initials avatar on deep plus name and dates), **MetadataList** (`dl` in rows), **EvidenceStat** (big serif number, label, and a source/date/method line), **PricingTable** (a real `<table>` that stacks into labelled rows below 700px).

---

## 6. Content rules

- **Use the brief's copy word for word.** Do not rewrite, shorten or "improve" it. Fill gaps only where the brief has none, and list every gap you fill in your summary.
- **No em dashes** anywhere in copy. No invented statistics. The only numbers allowed are on the project page, each with `â‰ˆ`.
- Banned words and claims are in brief section 8. Do not imply a live pilot, customers, confirmed buyers or a finished product.
- **Articles**: only one article is real, "What is a waste audit?" by Patience Sitati, published 30 October 2026, with its text in brief section 6. The other titles on the Home, Blog and Topic screens were proposed ideas used only to show the layout. **Do not publish them.** Lists show only real articles. The brief's states apply: fewer than three articles shows what exists with no placeholders, and a topic hub with one article shows no empty grid.
- **Byline conflict to resolve**: on the canvas the Article screen was later edited to read "By Daisy Nyaburu" (the avatar still says PS), while the brief and every other screen say Patience Sitati. Use **Patience Sitati** (per the brief) and flag it to Patience.
- Bracketed text like `[email address]`, `[phone number]`, `[Version date]`, `[test date]`, `[Cost factors to confirm]` and `Last updated: [date]` is a deliberate placeholder for facts nobody has supplied. Keep each one as a clearly marked content field. Never invent a value.
- Dates: Article "Published 30 October 2026", with an optional reviewed state "Reviewed 12 December 2026". Status lines say "as of" a date.

---

## 7. Screen states to implement

From the brief, each shown in the references as `<sc-if>` branches or as a separate states file:

- **Home**: the featured project section is hidden when there is none; fewer than three articles shows what exists.
- **Solution detail**: status `In development` shows the button "Ask about a review"; `Exploring` shows "Tell us if this interests you".
- **Resources search** (`ResourcesStates`): results, no results ("Nothing found for this search. Try fewer words, or browse by topic."), search unavailable ("Search is not working right now. Browse by topic instead."), and a loading skeleton (static, no shimmer). Search can be a client-side index over local content; keep it simple.
- **Blog**: topic filter; the empty state is "No articles on this topic yet." with the button "See all articles".
- **Article**: the optional "Reviewed" date.
- **Topic hub**: the thin state with one article.
- **Tool**: file unavailable is "This file is not available right now. Contact us and we will send it."
- **Projects**: the empty filter is "No projects with this status yet."
- **Contact** (`ContactStates`):
  - Every state, with the exact wording from the brief.
  - Validation shows an error summary at the top that links to each field, plus inline errors (a 4px error bar, a 2px error border, `aria-invalid` and `aria-describedby`).
  - Sending: a spinner plus "Sending", with the fields read-only.
  - Success replaces the form and takes focus.
  - Lost connection: keep the user's text, also saved as a draft in `localStorage` wrapped in try/catch.
  - Server failure, with a link to the email address.
  - "What is this about?" is a radio group, not a select.

**Contact backend**: Payload stores submissions before the chosen provider attempts notification. Resend in the existing account is approved; configure a separate sending-only key. Server-side validation, persistent duplicate protection and email retry behaviour are defined in `docs/implementation-spec.md`. Do not add another form service. Browser draft persistence is still a proposed behaviour, pending alignment with the Privacy text.

---

## 8. Images

| File | Used on | Status |
|---|---|---|
| `prototype-bin.jpg` | Home featured project, Projects card, project page | **Real.** Do not retouch, filter or replace it with a render. Shown on the project page at its natural 3:4 shape. Needs Daisy's consent (PROVISIONAL). |
| `stock-hero-hills.jpg` | Home hero | Unsplash stand-in |
| `stock-compost-bays.jpg` | Home lead article | Unsplash stand-in |
| `stock-hands-compost.jpg` | Resources featured guide | Unsplash stand-in |
| `stock-sorted-bottles.jpg` | Blog lead article | Unsplash stand-in |
| `stock-bins-three.jpg` | Article header | Unsplash stand-in |
| `stock-bins-four.jpg` | Topic hub Start here | Unsplash stand-in |
| `stock-cardboard-recovery.jpg` | Partners | Unsplash stand-in |
| `stock-open-water.jpg` | About | Unsplash stand-in |
| `stock-wheelie-bin.jpg` | Classic trial only (unused) | Unsplash stand-in |

The brief bans stock photos on the live site. The stand-ins are for build and review only. Keep them in `public/images/stock-*` so they are easy to find and replace. The Unsplash photo IDs are in `canvas.json` (note `n3`). The **toolkit preview** slot has no image on purpose: it needs a real screenshot of the workbook. Give every meaningful image proper alt text; links that duplicate a nearby headline get `alt=""`.

---

## 9. Logo

- Use **candidate B, "Value loop"**: an open ring with one dot leaving through the gap, in `brand/mark.svg` (uses `currentColor`), `mark-deep.svg` and `mark-surface.svg`. `mark-16.svg` is the small-size cut with a wider gap. `favicon.svg` is the mark on a deep rounded square.
- The wordmark is live text: Newsreader 600, tracking -0.02em, colour `deep`, or `surface` on dark.
- **Spelling is PROVISIONAL: "Revalue" or "ReValue".** Put the brand name in one constant so it can be switched in one place.
- Never add an arrowhead or a second dot to the mark. Do not use a recycling triangle, a leaf or a UNDP logo.

---

## 10. Accessibility and motion

- Semantic landmarks, one `h1` per page, real `<button>`, `<a href>` and `<label>`. Skip link. Visible 2px forest focus ring with a 2px offset.
- Contrast pairs are in the brief's token table. Do not introduce new text and background pairs without checking them.
- Motion is only 150ms for hover and focus and 250ms for overlays, using transform and opacity only. Nothing moves at rest. Respect `prefers-reduced-motion` (the base layer in `tokens.css` already does).
- No pop-ups, no accordions in navigation, no marquees, no scroll effects.

---

## 11. PROVISIONAL items (keep this list in the README)

These are styled as final but their wording or approval is pending. Track them in a `PROVISIONAL.md`:
- Status labels on every Solutions row, and the status mapping for the Pricing rows.
- Footer line: "Revalue is operated by Simuverse Limited, Kampala, Uganda."
- Logo spelling, Revalue or ReValue.
- Featured guide "The Practical Guide to Understanding Your Waste" (not yet written).
- Waste audit toolkit release and its version date.
- Project page: the Kyambogo origin line, the evidence line (â‰ˆ 90%, 60 items, â‰ˆ USD 485, shown only after the team confirms), and the prototype photo (Daisy's consent).
- About: Daisy's team entry, "Revalue was previously called EcoSort.", and the UNDP recognition line (no UNDP logo).
- Contact email and phone.
- Terms and Privacy text (needs review).
- Every stock photo.

---

## 12. Suggested build order and done criteria

1. Scaffold Next.js, Tailwind v4 with `tokens.css`, fonts, shadcn init, Phosphor.
2. Header, MobileMenu, Footer, StatusTag, Button, Notice, Photo.
3. Content layer with typed statuses, plus the Pilot/Available test.
4. Pages in this order: Home, Project, Contact (all states), Solutions, Solution detail, Resources with search states, Blog, Article, Topic hub, Tool, Projects, Partners, Pricing, About, Terms, Privacy, 404.
5. Check each page at 390px against its reference file, then at 1280px against the brief's rules.

A page is done when:
- The copy matches the brief exactly.
- Every state in section 7 works.
- Keyboard-only use works.
- Lighthouse accessibility is 100 and there are no console errors.
- No text is under 12px and no touch target is under 44px.
- No banned pattern from brief section 8 appears.
