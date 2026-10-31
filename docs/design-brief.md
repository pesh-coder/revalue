# Revalue website: design brief

Version 0.1. Date: 30 October 2026. Source of truth for all copy, colours, type and bans.

**Layout revision, 31 October 2026:** Patience requested a pure white page background, removal of prominent horizontal section rules, and a compact Forbes-inspired layout below the hero. This overrides cream colours, wide empty introductions and the 96px section-spacing rule throughout this brief. Home groups its lead article, smaller project feature and useful navigation in one editorial grid. Apply the same hierarchy to the remaining page templates with spacing appropriate to their content.

**Home direction update, 31 October 2026:** Patience asked for a more professional presentation using established environmental and editorial sites as references. Brand documents guide the design; they do not require prominent project-stage badges. Home leads with purpose and work. Specific project stages remain accurate in project descriptions and detail-page metadata. This supersedes the original Home stage strip and status pills.

**PROVISIONAL** means the value depends on an unfinished decision or experiment. Style it, keep the wording, and do not remove the label from the handoff notes.

## 1. What the product is

Revalue is the public website of a young Ugandan waste and resource-recovery venture, tagline "Waste has value." It helps hotels, schools, offices and facility managers in Greater Kampala understand their waste and start a conversation, and it helps recyclers and other recovery businesses find a way to work with the team. It also publishes practical articles, guides and tools. Revalue is preparing a pilot: it has a working prototype bin and no live pilot, no signed buyers and no revenue. The site takes no payments and publishes no prices. It deliberately has no customer accounts, no shop, no live dashboard, no newsletter pop-ups and no impact counters.

## 2. The design idea

**A serious environmental publication with a practical company behind it.** It should feel like Forbes covering land, soil, water and materials: confident serif headlines, a clear editorial hierarchy, large photography of real places, and the calm authority of a premium consulting firm. It must clearly read as an environmental brand at first glance, and it must look designed by a professional studio, not generated.

- **The environment is the setting.** Deep greens, warm earth tones and real photography of landscape, soil, water, plants and materials carry the theme.
- **Editorial structure.** Pages are laid out like a magazine front page: one lead story, compact secondary stories, strong captions and bylines.
- **Green means "you can act".** Forest green is reserved for buttons, links and focus. Deep green carries large dark bands.
- **Clay means "labelled".** Clay appears only on status tags and small marks that say how far along something is. Honesty stays visible, but as a quiet detail, like a magazine's section label.
- **Small labels** identify topics, dates and sources. Avoid decorative horizontal rules between sections.

**Adjacent to avoid:** the eco clip-art poster, the NGO impact report, the smart-city tech look, and a generic SaaS landing page.

**Rules that keep it from looking AI-generated:**

- Do not centre everything. Use asymmetric, editorial compositions with a clear lead element.
- No hero with a pill badge above a centred headline and two buttons.
- No row of three equal cards with an icon, heading and sentence. Use compact lists or a lead item with supporting items.
- Use a clear lead story, smaller supporting stories and useful sidebars. No identical repeated blocks.
- Icons are rare. Typography and photography do the work.
- Very few cards. Use aligned columns and modest gaps to group related information.
- Captions on photographs, with place and date where known.

**Photography.** Images are the main driver of this look, and Revalue has only one real photo so far. Design with generous photo slots. Each slot needs a neutral placeholder labelled with its subject, for example "Photo: sorted organic material at a site in Kampala". **PROVISIONAL:** real photos replace them before launch. Never present a placeholder or generated image as Revalue's fieldwork.

Photo subjects to plan for: Kampala hillsides and wetlands, Lake Victoria shoreline, market produce, compost and soil, sorted plastic, paper and metal, the prototype, and people at work with their consent.

## 3. Tokens

### Colour

Light theme only for this release. **PROVISIONAL:** dark theme is not requested. Brand colours come from the playbook. `surface`, `muted`, `clay-text`, `clay-tint`, `input-border` and the semantic colours are added here to pass contrast.

| Token | Hex | oklch | Role | Contrast |
|---|---|---|---|---|
| `neutral` | #FFFFFF | oklch(1 0 0) | Page background | base |
| `surface` | #FFFFFF | oklch(1 0 0) | Surface | 1:1 vs neutral |
| `charcoal` | #2B372F | oklch(0.323 0.021 155.8) | Body text | 12.42:1 on neutral, 12.42:1 on surface |
| `deep` | #173B2E | oklch(0.321 0.048 167.1) | Headings, dark bands | 12.34:1 on neutral |
| `forest` | #1F5D42 | oklch(0.430 0.078 161.4) | Buttons, links, focus ring | 7.77:1 on neutral |
| `forest-hover` | #184B35 | oklch(0.372 0.067 161.7) | Button and link hover | 10.02:1 with surface text |
| `on-forest` | #FFFFFF | oklch(1 0 0) | Text on forest | 7.77:1 |
| `muted` | #5A665E | oklch(0.497 0.019 156.4) | Metadata, helper text | 6.01:1 on neutral |
| `clay` | #B46A3C | oklch(0.598 0.113 51.0) | Tag marker, rule, small mark. Never text | 4.14:1 on neutral, non-text only |
| `clay-text` | #8F4E27 | oklch(0.494 0.102 49.5) | Words inside tags | 6.39:1 on neutral, 5.14:1 on clay-tint |
| `clay-tint` | #F3E4D8 | oklch(0.928 0.023 61.2) | Tag fill | base for clay-text |
| `border` | #E5E5E5 | oklch(0.92 0 0) | Subtle functional boundaries | Decorative only |
| `input-border` | #7D8379 | oklch(0.602 0.016 132.6) | Input and control boundaries | 3.89:1 on neutral |
| `error` | #A3392A | oklch(0.494 0.143 30.8) | Validation only | 6.61:1 on neutral |
| `success` | #2E6B4F | oklch(0.479 0.079 161.4) | Confirmation only | 6.30:1 on surface |
| `warning` | #8A5A12 | oklch(0.509 0.103 70.8) | Warnings only | 5.91:1 on surface |

Rules: white (#FFFFFF) is the page background. Keep the dark green/charcoal text palette. The final token sheet gives all colours in oklch. Material names are never shown by colour alone, so always pair colour with a word.

### Type

Free fonts from Google Fonts. Two families and two weights only (400 and 600).

| Role | Font | Size | Line height | Tracking |
|---|---|---|---|---|
| display-xl | Newsreader 600 | 40px mobile to 72px desktop, fluid | 1.05 | -0.02em |
| headline-lg | Newsreader 600 | 30px to 44px, fluid | 1.12 | -0.015em |
| headline-md | Newsreader 600 | 22px to 28px, fluid | 1.2 | -0.01em |
| headline-sm | Source Sans 3, 600 | 18px | 1.35 | 0 |
| body-lg, for articles | Source Sans 3, 400 | 18px | 1.65 | 0 |
| body-md | Source Sans 3, 400 | 16px | 1.6 | 0 |
| body-sm, metadata only | Source Sans 3, 400 | 14px | 1.55 | 0 |
| label-md | Source Sans 3, 600 | 14px | 1.2 | 0 |
| label-sm, for tags | Source Sans 3, 600 | 12px | 1.2 | 0.04em |

The serif headline is the main source of authority, so set it large. Article headlines and lead stories may run to three lines. Other headlines stay within two. No text below 12px. Form inputs are 16px or larger on mobile.

### Shape, space and motion

- **Radius:** restrained, for an editorial feel. 4px buttons and inputs, 8px images and the few cards used, 9999px tags. Full-bleed photos and dark bands have no radius.
- **Boundaries:** no prominent horizontal section rules. Use subtle boundaries only where they clarify controls, tables or navigation.
- **Photo overlays:** text over photographs needs a `deep` overlay of at least 60%, and must meet AA at every point it covers.
- **Spacing scale:** 4, 8, 16, 24, 32, 48, 64, 96px. Use 24px between mobile content groups and 32?40px on desktop; 16?28px column gaps. Keep larger spaces only where the content needs them. Container is 1200px with 24px gutters, and 16px gutters on mobile. Article text column is about 680px.
- **Touch targets:** 44px minimum on every pointer.
- **Shadow:** resting cards have none. Raised: `0 1px 3px rgb(0 0 0 / 0.06), 0 4px 12px rgb(0 0 0 / 0.05)`. Overlay: `0 8px 30px rgb(0 0 0 / 0.12)`.
- **Motion:** 150ms hover and focus, 250ms overlays. Transform and opacity only. Nothing moves at rest, with no marquees or scroll effects. Respect reduced motion. Signature motion: a status tag settles gently into place when a card enters view, once only.
- **Icons:** Phosphor, regular weight.
- **Base components:** shadcn/ui, restyled only through tokens. The mobile menu is a full-screen overlay with slide-in panels for child pages, not accordions.

## 4. Logo direction

**Recommendation: a mark plus a wordmark.** The mark has to work alone on a bin, a social avatar and a favicon, and the name needs to be read because it is new. A mascot would undercut the evidence-led tone. A monogram alone says too little, and a single "R" is crowded among existing brands.

Concept: **the value loop.** An original symbol from one or two simple forms that suggests material moving from discarded to useful, such as a rounded R-shaped path or two linked shapes. Do not use a recycling triangle, a generic leaf, or a smile or arrow resembling an e-commerce logo.

Requirements: bold in one colour, works in black and white, recognisable without the wordmark. Provide horizontal, stacked and mono lock-ups.

**Deliver 3 candidates, each shown at 16px, 32px and 128px.** Name each one's main risk of resembling an existing waste, logistics or technology brand. **PROVISIONAL:** final spelling is "Revalue" or "ReValue". Show both on the chosen mark.

## 5. Screens

Global elements on every page:

- **Top bar:** logo, then Solutions, Resources, Projects, Partners, Pricing, and the button "Contact us". Mobile keeps the logo, the button and a menu trigger.
- **Footer:** "Waste has value." About, Contact, Terms, Privacy. Line: "Revalue is operated by Simuverse Limited, Kampala, Uganda." **PROVISIONAL**
- **Status tag (the key component):** a small, quiet pill with a clay mark and words in `clay-text` on `clay-tint`.

### Screen 1. Home
Story step: a visitor understands Revalue and discovers its work.

- Keep the supplied photo hero, ?Waste has value.? headline and existing actions.
- Begin the white content area 24?32px below the hero. ?Latest from Revalue? is a real heading, without a line across the page.
- Desktop: a 12-column grid containing the lead article (6 columns), smaller prototype feature (3), and a useful sidebar (3). The sidebar holds ?Our focus? and the audience pathways. Do not reserve empty columns for missing content.
- Lead article: image, topic, serif headline, excerpt and byline. Render actual supplied content only.
- Mobile: lead article first; the secondary project uses a small thumbnail beside its title and concise stage description. Stack the remaining content in reading order.
- Our focus: ?Keeping value in circulation.?, the existing focus paragraph and ?Explore our work? link. This is sidebar content, not a large full-width section.
- Featured project: ?Smart segregation prototype?, existing description on wider screens, and ?The prototype is being tested as we prepare for a field pilot.? No Home status pill.
- Follow with a compact ?How we work? area and contact prompt side by side on desktop, stacked on mobile. No large numbered dark band.
- Compact footer. The pure white background, compact introductions and clear heading hierarchy also guide the other pages.

States: missing project is omitted; no article ideas are invented to fill columns; empty editorial slots collapse.

### Screen 2. Solutions overview
Story step: "what could you do for us?"

- Title: "What we are building and offering". Lead: "Every item below says how far along it is. We will not sell you something that does not exist yet."
- Ruled list with tags, **PROVISIONAL** until the team confirms each label:
  - Waste Discovery Review, `In development`: "A bounded visit to map your waste, see how it is separated, and give you a short action plan."
  - Segregation systems, `In development`: "Practical ways to keep materials separate where waste is created."
  - Technology and monitoring, `In development`: "A smart bin prototype and reporting tools, tested before they are offered."
  - Resource recovery, `Exploring`: "Finding credible next steps for separated materials."
  - Institutional waste management, `Exploring`: "Support for sites that need a working routine, not just new bins."

### Screen 3. Solution detail: Waste Discovery Review
Story step: a facility manager checks scope.

- Title and tag `In development`. "Who it is for: hotels, schools, offices and other sites in Greater Kampala that want a clear picture of their waste."
- "What we would do": "Walk the process with your team. Identify the main waste streams. Observe separation and contamination. Record collection arrangements and costs where available. Give you a short action plan."
- "What we will not do": "We will not guarantee savings or recovery before we have measured anything. If a recovery partner is not confirmed, we will say so."
- "What affects the cost": "Site size, number of waste streams, depth of assessment, travel and reporting needs."
- Button: "Ask about a review"

State: a solution tagged `Exploring` replaces the button text with "Tell us if this interests you".

### Screen 4. Resources hub
Story step: a reader looks for help.

- Title: "Understand waste. Discover its value." Sub: "Practical knowledge, tools and ideas for better waste management and resource recovery."
- Search field placeholder: "Search articles, guides and tools"
- Formats: Blog, Guides, Tools and templates, Projects
- Featured guide: "The Practical Guide to Understanding Your Waste". Text: "A starting point for organisations that want to understand their waste streams, current practices and improvement opportunities." **PROVISIONAL:** not yet written.
- Topics: Understanding waste, Waste audits, Segregation, Resource recovery, Business waste, Technology, Waste economics, Uganda and Africa

States: search results, search with no results ("Nothing found for this search. Try fewer words, or browse by topic."), search unavailable ("Search is not working right now. Browse by topic instead."), loading skeleton.

### Screen 5. Blog index
- Title: "Blog". Sub: "Explanations, field lessons and practical advice."
- Topic filter, article list, pagination.
- Empty: "No articles on this topic yet." Button: "See all articles"

### Screen 6. Article
Story step: a reader gets an answer, then a next step.

- Breadcrumbs, primary topic, title, author, "Published 30 October 2026", body at 680px, related articles, next-step card: "Want to know what this looks like at your site?" Button: "Talk to us"
- Reviewed state: adds "Reviewed 12 December 2026".
- Show the sample article in section 6.

### Screen 7. Topic hub: Waste audits
- Title: "Waste audits and data". Intro: "How to measure what you throw away, and what to do with the result."
- "Start here" card, related articles, tools, adjacent topics.
- Thin state: one article only, no empty grid.

### Screen 8. Tool page: Waste audit toolkit
Story step: a reader gets something useful. **PROVISIONAL:** release is pending a rebrand and sign-off.

- Title: "Waste audit toolkit". Sub: "A spreadsheet and field guide for recording what a site generates, how it is handled and what it costs."
- Metadata block: Format Excel workbook. Version date: **PROVISIONAL**. For: site and facility teams.
- "How to use it", a preview image, button "Download the toolkit".
- Safety note: "Follow your site's safety rules. Do not handle clinical or hazardous waste without the right controls."

States: file unavailable ("This file is not available right now. Contact us and we will send it.").

### Screen 9. Projects index
- Title: "Projects". Sub: "Work and lessons, labelled by status. Tools and plans we use are not the same as finished projects, and we keep them separate."
- Filter by status. One card to start. Empty filter: "No projects with this status yet."

### Screen 10. Project: Smart segregation prototype (moment of truth for trust)
Story step: a sceptical reader decides whether to believe us. Uses the eight-part structure.

- Title: "Smart segregation prototype". Tag `Testing`. Metadata block: Started as a final-year project at Kyambogo University. **PROVISIONAL**, needs Daisy's consent.
- Overview: "A prototype bin that uses a camera and sensors to sort waste into separate compartments."
- Problem: "Mixed waste loses value. We wanted to test whether sorting at the bin could keep materials separate with less effort."
- Approach: "A camera and classifier on a Raspberry Pi work with an Arduino, which reads the sensors and turns a sorting disc."
- Work completed: "Built a working prototype. It sorts into three compartments: metal, organic and plastic. Software logs each sorting event to a small dashboard."
- Evidence: "≈ 90% classification accuracy across 60 test items, at a build cost of ≈ USD 485." **PROVISIONAL**, shown only after the team confirms it.
- What we learned: "Sorting alone does not change why materials get mixed. The next questions are about people, collection and buyers, not just the machine."
- Not yet done: "No field pilot yet. No paper compartment yet. No load cell to weigh materials yet."
- Related resources, then enquiry: "Want to host a test or challenge our method?" Button: "Get in touch"

Use the attached real photo at full honesty. Do not retouch or replace it with a render.

### Screen 11. Partners
- Title: "Work with us". Lead: "Separated material only has value if someone can use it. We want to learn what you need."
- "Who we want to hear from": BSF farms and composters, plastic recyclers, paper buyers, scrap and metal buyers, collectors, women- and youth-led enterprises.
- "What helps us": "Materials you accept. Quality limits. Minimum quantities. Who handles transport. What you pay."
- Line: "We do not have named partners to list yet." Button: "Become a partner"

### Screen 12. Pricing
- Title: "How pricing works". Lead: "We do not publish fixed prices yet, because we are still testing what each service involves."
- Table: offering, status, what affects the cost. Rows: Waste assessment, Waste improvement work, Reporting or monitoring, Technology or equipment, Custom work.
- Button: "Ask for a quote". No tiers, no "Most Popular".

### Screen 13. About
- Title: "Why Revalue exists". Text: "Most waste is mixed long before anyone asks what it could become. We want to make the next useful step clearer, without promising value that has not been shown."
- Beliefs: Measure before promising. Design for real behaviour. Respect the whole system. Use technology where it helps. Learn openly. Connect segregation to recovery.
- Team: Patience Sitati, Co-founder, software and business. Daisy Mary Nyaburu, Co-founder, hardware. **PROVISIONAL**, Daisy's consent needed. Use avatars with initials if no photos.
- Name line: "Revalue was previously called EcoSort." **PROVISIONAL**
- Recognition: "Selected as one of four national winners of the UNDP Uganda Innovation Challenge on circular economy and waste management." **PROVISIONAL**. Do not use any UNDP logo.

### Screen 14. Contact (moment of truth for conversion)
Story step: a visitor sends an enquiry.

- Title: "Talk to us". Lead: "Tell us what is happening with your waste, or what you can do with separated material. We read every message."
- Fields: Name, Organisation, Email, Phone (optional), "What is this about?" (Waste discovery or assessment, Partnership or recovery, Funding or research, Media, General), Message.
- Privacy line: "We use your details only to reply. See our Privacy Policy." Button: "Send enquiry"
- Other routes: email and phone, **PROVISIONAL**.

States:
- Sending: button shows a spinner with the label "Sending".
- Success: "Thanks. We have your message and will reply by email."
- Validation: "Enter your name." "Enter an email address like name@example.com." "Choose what this is about." "Tell us a little about your enquiry."
- Lost connection: "We could not send your message. Check your connection and try again. Your text has been kept."
- Server failure: "Something went wrong on our side. Try again, or email us."

### Screen 15. Not found
- Title: "We could not find that page." Text: "It may have moved. Try searching, or go back to Resources." Button: "Go to Resources"

### Screen 16. Terms
Real content. "This website is operated by Simuverse Limited, Kampala, Uganda. Content is for general information and is not professional, legal or safety advice. Status labels show our position on the date shown and may change. Tools are provided as they are, so check they suit your site before relying on them. Articles remain our work unless stated otherwise. These terms are governed by the laws of Uganda." **PROVISIONAL**, needs review.

### Screen 17. Privacy
Real content, stating what is stored and nothing else. **PROVISIONAL**, needs review.

"What we collect: your name, organisation, email, phone number if you give it, the subject you choose and your message. We also count page visits in aggregate. Why: to reply to you. Where: in our website system and our team's email. How long: 24 months, then deleted. Who sees it: the Revalue team and the service providers that run the website and email. We do not sell it. Your rights: ask us to see, correct or delete your data. Questions or complaints: contact us, or the Personal Data Protection Office of Uganda."

## 6. Real content

**Sample article: "What is a waste audit?"** By Patience Sitati, topic Waste audits.

"A waste audit is a planned look at what a site throws away. You weigh or estimate each type of waste, note how much is mixed, and follow where it goes after collection.

It starts with a simple question: what happens to your waste from the moment it is created until it leaves the site? Then you agree the boundaries, choose the dates, and brief the people who handle waste every day. They usually know where the process breaks down.

A useful audit gives you a baseline: what you generate, what it costs, and which materials might have somewhere better to go. It does not tell you that every material has a buyer. That needs checking separately.

Do not handle clinical or hazardous waste without the right controls."

**Sample article titles.** These are proposed ideas, not published work:
- Why labels and bins alone are not enough
- Recyclable versus actually recycled
- What happens after waste collection?
- Waste management for hotels
- Smart bins and fill-level monitoring

**Status values.** Project: Concept, In development, Testing, Pilot, Completed, Published research. Solution: Available, In development, Exploring. No page may show `Pilot` or `Available` today.

**Numbers.** Use only those in Screen 10, with `≈`. No other statistics may be invented.

**Photo:** `ecosort_gl.jpeg`, the prototype with its cardboard housing and exposed wiring. **PROVISIONAL**, needs Daisy's consent.

## 7. Inspiration

1. **Forbes.** Take the authoritative serif headlines, lead story with ruled secondary stories, bylines and the overall sense of a serious publication.
2. **Three Dribbble shots chosen by the client:** [Environmental Website Design](https://dribbble.com/shots/25288146-Environmental-Website-Design), [Premium Consulting Landing Page](https://dribbble.com/shots/27461502-Premium-Consulting-Executive-Search-Landing-Page-UI), [Eco-Friendly Website Design](https://dribbble.com/shots/23551295-Eco-Friendly-Website-design). Take the environmental mood from the first and third, and the premium, confident restraint from the second. **PROVISIONAL:** the author of this brief could not open them, so follow any screenshots attached.
3. **Ahrefs blog and resource library.** Take the content structure and topic organisation.
4. **Our World in Data.** Take the habit of showing source, date and method beside every number.
5. **GOV.UK.** Take the plain wording, clear status tags, accessible forms and error messages.
6. **Printed environmental and geographic magazines.** Take the large photography, captions and generous margins.

**Do not copy:** any reference's exact layouts, colours, logos or imagery. Forbes and Ahrefs are lessons in structure, and the result must look like Revalue.

## 8. Hard bans

```
SYSTEM CONFIGURATION & NEGATIVE UI PATTERNS
CRITICAL: Bypass the default 2025/2026 AI SaaS landing page aesthetic. Forbid:
1. COLOUR & LIGHTING: pure black (#000000) with neon purple accents; radial orbs, ambient glows, light streaks;
   rainbow or neon text in headers; harsh saturated gradients on text or containers.
2. COMPONENTS & ICONS: bento grids or uneven rounded cards for simple lists; Lucide/sparkle icons for abstract
   ideas; 3-tier pricing with a "Most Popular" badge; floating detached navbars with backdrop-filter blur;
   checkmark or emoji bullets.
3. COPY: abstract headlines ("Revolutionize…", "Supercharge…", "powered by AI"); the words delve, tapestry,
   testify, revolutionize, beacon, nestled, elevate; subheadings without concrete data.
4. STRUCTURE: abstract shapes instead of real product screens; border-only selection or scale-only hover; fake
   testimonials and stock photos; missing viewport meta, semantic headers, Terms of Service or Privacy Policy.
DESIGN GOAL: an opinionated design system, purposeful whitespace, strict typographic hierarchy, direct copy that
says exactly what the product does, genuine interface elements.
```

Product-specific bans:

- No recycling triangles, clip-art globes, hands holding seedlings or decorative leaf graphics. Real nature photography is welcome.
- Photo slots are labelled placeholders, as described in section 2. This does not relax the ban on stock photos in the final site.
- No impact counters, no "tonnes diverted", no invented numbers or partner logos.
- No wording that implies a live pilot, active customers, confirmed buyers or a finished product.
- No "smart bin company" positioning. The bin is one project.
- No "AI-powered" in headlines. No "eco-friendly", "zero waste", "save the planet", "green solution" or "trash to cash".
- No guilt, fear or shame. No images that use waste workers or poor communities as props.
- No em dashes in any copy.
- No clay on buttons, large fills or body text.
- No accordions in mobile navigation. No pop-ups. No dark mode toggle.
- No imitation of other brands' marks, and no UNDP logo.

## 9. Fix-list from samples

No earlier designs exist. There is nothing to keep or fix. The attached prototype photo is reference for real content only, not a style sample.

## 10. Field answers

**Screens:** Home, Solutions, Solution detail, Resources hub, Blog index, Article, Topic hub, Tool page, Projects, Project detail, Partners, Pricing, About, Contact with all form states, Not found, Terms, Privacy. Design at 390px and 1280px.

**Accent colour:** Forest green #1F5D42 for buttons, links and focus. Deep green #173B2E for large bands. Clay #B46A3C only as a small mark on status tags, never on buttons or text. Tag words use #8F4E27 on #F3E4D8. Page background #FFFFFF, body text #2B372F.

**Typefaces:** Newsreader 600 serif for headlines at 22px and above, set large, in the style of a serious publication. Source Sans 3 at 400 and 600 for everything else. Both are on Google Fonts. No other fonts.

**Product name:** Revalue. Tagline: Waste has value. The spelling is provisional, so show the logo as both Revalue and ReValue.

**Integrations:** None to name on screen. Built later with Next.js, Tailwind v4, shadcn/ui and Phosphor icons. Do not show partner, payment, wallet or social-login logos.

## 11. Deliverables

1. Token sheet in oklch, with the contrast table.
2. Three logo candidates at 16px, 32px and 128px.
3. All screens at 390px and 1280px.
4. Every state of the status tag: all project and solution values, on neutral, on surface, on `deep`, in a card, in a table, and at 200% text size.
5. Every state of the enquiry form, and the search empty and failure states.
6. Static semantic HTML and CSS using Tailwind v4, ready to port.
