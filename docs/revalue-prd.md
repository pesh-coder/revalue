# Revalue Website: Product Requirements Document

Version 0.1, draft for review. Date: 30 October 2026. Owner: Patience Sitati.
Sources: `Website_Build.md`, the two brand playbooks, `DESIGN.md`, the handover brief of 30 October 2026.
Stack decisions and evidence are in `docs/revalue-plan.md`.

Labels: **[BRIEF]** comes from your documents. **[DRAFT]** is my proposal and can change. **[OPEN]** needs your answer.

## 1. Summary

Revalue needs a public website and a content management system (CMS) so the team can publish blogs and resources without a developer. The site explains what Revalue is doing, shows real work with honest status labels, and gives institutions and partners a clear way to start a conversation. [BRIEF]

The first release is a working prototype. It proves the full path from writing an article in the CMS to a visitor reading it and sending an enquiry. It is not the finished site. [Your instruction, 30 October]

## 2. Goals

| ID | Goal | How we will know |
|---|---|---|
| G1 | "A credible website that can publish content and generate conversations." [BRIEF] | A non-developer publishes an article, and a test enquiry reaches the team inbox |
| G2 | Earn trust through honesty about stage | No page implies a live pilot, operating service or verified result that does not exist |
| G3 | Build toward a useful knowledge library | Content model supports all formats in `Website_Build.md` without a rebuild of the model |
| G4 | Be found in search | Pages are indexable, with metadata, sitemap and structured data from day one |

Numeric targets for enquiries and traffic: **[OPEN]**, see section 13.

## 3. Non-goals

- Payments, online ordering, customer accounts or portals.
- Calculators, digital audit forms, live dashboards, partner directories (Phase 3). [BRIEF]
- Podcasts, webinars and a Data tab until there is real material (Phase 2). [BRIEF]
- Published package prices. [BRIEF]
- A public link to the bin's live data. There is no live pilot.
- Newsletter pop-ups. [BRIEF]
- Languages other than English at launch. [DRAFT]

## 4. Audiences

Hypotheses from the playbooks, to be tested. [BRIEF]

| Priority | Audience | What they need from the site | Main action |
|---|---|---|---|
| 1 | Institutions in Greater Kampala: hotels, restaurants, schools, offices, apartments, facility managers | Understand their waste problem and what a first step looks like | Enquire |
| 2 | Recovery partners: BSF farms, recyclers, paper and scrap buyers, collectors | Know what Revalue is looking for and how to work together | Partner enquiry |
| 3 | Funders and public or development partners | See evidence, method and credible progress | Read projects, contact |
| 4 | Households and communities | Plain guidance on sorting and handling waste | Read and share |

Decision-makers and daily waste handlers can be different people, so content must speak to both. [BRIEF]

## 5. Stage and truth rules

These apply to every page and are not optional. [BRIEF, handover brief section 8]

1. Revalue is preparing a pilot. There is no live pilot, signed off-taker, or revenue yet.
2. Solutions describe what is available, in development or being explored, each with a visible label.
3. Project pages show only verified work. Status labels are required.
4. No impact numbers without a stated source, method and date. Estimates are marked as estimates.
5. Working documents are not proof of completed customer work.
6. Technology is explained with its limits. No claim that AI solves waste.
7. The prototype page reflects the actual hardware: three compartments today, not four. Accuracy figures appear only after confirmation.
8. People, photos and site names appear only with permission.

## 6. Release scope

| Capability | Prototype | Phase 1 launch | Phase 2 | Phase 3 |
|---|---|---|---|---|
| CMS with login, drafts, preview, publish | Yes | Yes | | |
| Home | Yes | Yes | | |
| Blog index and article template | Yes | Yes | | |
| Topic hub template | 1 hub | Hubs with real content | All 11 | |
| Project template | 1 project | Yes | More | |
| Solutions overview and detail | 1 detail page | Yes | | |
| Contact and enquiry form | Yes | Yes | | |
| Site search | Yes | Yes | Add filters by audience and material | |
| Partners, Pricing, About | Basic | Complete | | |
| Tools and templates downloads | 1 test file | Cleared assets only | More | |
| Terms and Privacy pages | Draft text | Reviewed text | | |
| SEO, sitemap, analytics | Yes | Yes | | |
| Guides | Model only | If content exists | Yes | |
| Data and reports, podcasts, webinars | No | No | Yes | |
| Calculators, dashboards, portals | No | No | No | If validated |

## 7. Information architecture

**Main navigation** (six links plus logo): Solutions, Resources, Projects, Partners, Pricing, Contact us (button). About sits in the footer and on its own page. [BRIEF]

A separate Data tab is held back until there is enough material. Data and reports live under Resources until then. [BRIEF]

```
/                                  Home
/solutions/                        Overview
/solutions/[slug]/                 Solution detail
/resources/                        Hub: search, formats, topics, featured
/resources/blog/                   Blog index
/resources/blog/[slug]/            Article
/resources/guides/                 Guides index
/resources/guides/[slug]/          Guide
/resources/tools/                  Tools and templates index
/resources/tools/[slug]/           Tool or template
/resources/[topic]/                Topic hub (11 proposed)
/projects/                         Portfolio
/projects/[slug]/                  Project
/partners/                         Partner information and enquiry
/pricing/                          How pricing works and enquiry
/about/                            Mission, beliefs, team, journey
/contact/                          Contact routes and enquiry form
/terms/  /privacy/                 Legal pages
/admin/                            CMS (not public, not indexed)
```

Topic slugs are the hub URLs listed in `Website_Build.md` section 4. A reserved-word check keeps a topic from colliding with `blog`, `guides` or `tools`. [DRAFT]

## 8. Functional requirements

### Public site

| ID | Requirement | Release |
|---|---|---|
| F1 | Home presents the "Waste has value" message, what Revalue does, audience pathways, featured work and one route to enquire | Prototype |
| F2 | Article page shows title, author, publish date, primary topic, breadcrumbs, body, related content and a relevant next step | Prototype |
| F3 | Blog index lists articles with pagination and filter by topic | Prototype |
| F4 | Topic hub shows an introduction, a recommended starting article, related articles, tools and adjacent topics | Prototype |
| F5 | Project page follows the eight-part structure in `Website_Build.md` section 5, with a required status label | Prototype |
| F6 | Solution page shows scope, who it is for and an availability label | Prototype |
| F7 | Site search covers published articles, guides, tools, projects and solutions | Prototype |
| F8 | Tool page shows who it is for, how to use it, a preview, version date and a download | Phase 1 |
| F9 | Pricing page explains cost factors for each offering, with no invented prices, and leads to an enquiry | Phase 1 |
| F10 | Mobile navigation works without hover and keeps the contact action visible | Prototype |
| F11 | Custom 404 page that links to search and Resources | Prototype |

### Enquiries

| ID | Requirement | Release |
|---|---|---|
| F12 | Enquiry form captures name, organisation, email, phone (optional), enquiry type and message | Prototype |
| F13 | Enquiry types: Waste discovery or assessment, Partnership or recovery, Funding or research, Media, General | Prototype |
| F14 | Each submission is stored in the CMS and emailed to the team | Prototype |
| F15 | The sender sees a clear confirmation, and a clear fix when validation fails | Prototype |
| F16 | The form has spam protection that does not add a puzzle for real users, such as a honeypot and rate limit | Prototype |
| F17 | The form explains why data is collected and links to the Privacy page | Prototype |

### CMS

| ID | Requirement | Release |
|---|---|---|
| C-1 | Team members log in with email and password. Roles are Admin and Editor | Prototype |
| C-2 | Editors write in a rich text editor with headings, links, images, quotes and tables | Prototype |
| C-3 | Content moves through Draft and Published. Earlier versions can be restored | Prototype |
| C-4 | Editors preview a draft before publishing | Prototype |
| C-5 | Publishing updates the live site without a developer or a full redeploy | Prototype |
| C-6 | Images are uploaded in the CMS with required alt text | Prototype |
| C-7 | Editors can set meta title, description and social image, with a search-result preview | Prototype |
| C-8 | Editors can manage navigation, footer and featured content | Phase 1 |
| C-9 | Editors can add redirects when a URL changes | Phase 1 |
| C-10 | Editors can view enquiries inside the CMS. Admin can export and delete them | Prototype |
| C-11 | Scheduled publishing | Phase 2 |

### Content model

| Type | Key fields |
|---|---|
| Post | Title, slug, excerpt, body, author, primary topic, cover image, published date, reviewed date, related content, SEO |
| Guide | As Post, plus step order and series |
| Topic | Name, slug, introduction, starting article, adjacent topics, SEO |
| Project | Title, slug, status, overview, problem, approach, work completed, evidence, lessons, related resources, enquiry prompt |
| Solution | Title, slug, availability, audience, description, what affects cost, SEO |
| Tool | Title, slug, format, file, version date, audience, instructions, preview, public release approved (yes or no) |
| Person | Name, role, photo, bio, public consent recorded (yes or no) |
| Media | File, alt text, caption, credit, permission note |
| Enquiry | Form data, type, created date, status |
| Site settings | Navigation, footer, contact details, social links |

Fixed lists: Project status: Concept, In development, Testing, Pilot, Completed, Published research. [BRIEF] Solution availability: Available, In development, Exploring. [DRAFT]

## 9. Non-functional requirements

All targets are [DRAFT] until the spike measures them.

| ID | Area | Requirement |
|---|---|---|
| N1 | Speed | Published public pages reach Largest Contentful Paint under 2.5 s at the 75th percentile on a mid-range phone on a Kampala mobile connection |
| N2 | Weight | Article pages load under 500 KB on first visit, excluding images below the fold |
| N3 | Freshness | A published change is live within 60 seconds |
| N4 | Availability | Public pages keep working if the database is asleep or briefly unavailable, because they are served from cache |
| N5 | Accessibility | WCAG 2.2 AA: contrast, keyboard use, focus states, form labels, 44px touch targets |
| N6 | Devices | Mobile first, tested at 360px, 390px and 1280px on browsers supported by Next.js |
| N7 | Security | HTTPS, secure cookies, admin routes not indexed, secrets kept out of git, least-privilege roles |
| N8 | Backups | Database and media can be restored. Restore is tested once before launch |
| N9 | Privacy | Compliance with the Data Protection and Privacy Act 2019, including PDPO registration before public launch |
| N10 | Cost | Prototype costs nothing to run where permitted. Launch cost is stated in the plan |
| N11 | Portability | Content can be exported, and the app can move host without a rewrite |

## 10. SEO and analytics

Each page has a unique title and description, canonical URL, one H1, logical headings, descriptive alt text and readable URL. The site includes an XML sitemap, robots.txt, breadcrumbs, and Article and BreadcrumbList structured data where valid. Thin or duplicate category pages are not indexed. Google Search Console is connected at launch. [BRIEF]

Analytics tracks page views, top content, search terms with no results, and enquiry submissions by type. Enquiry conversion is the primary measure, not traffic. [BRIEF]

## 11. Dependencies before public launch

| Item | Owner | Blocks |
|---|---|---|
| PDPO registration status of the data controller checked | Patience | Public enquiry form |
| Terms and Privacy text reviewed | Patience | Launch |
| Permission to use UNDP's name or logo, from the agreement | Patience | Any UNDP mention |
| Daisy's consent for name, images and prototype footage | Patience, Daisy | Prototype project page |
| Audit toolkit rebranded and cleared | Daisy | Tools page |
| Confirmed prototype facts: streams, accuracy | Patience, Daisy | Prototype project page |
| Domain | Patience | Launch, email sending |
| Logo and final name spelling | Patience | Design |

## 12. Success measures

| Measure | Prototype | First 90 days after launch |
|---|---|---|
| Non-developer publishes an article unaided | Yes | Ongoing |
| Enquiry reaches the inbox end to end | Yes | Yes |
| Articles published | 1 real article | [OPEN] |
| Qualified enquiries | Not measured | [OPEN] |

A qualified enquiry names an organisation and a real waste, partnership or funding need. [DRAFT]

## 13. Open questions

| # | Question | Default if unanswered |
|---|---|---|
| 1 | Is there a deadline for the prototype or launch? | Spike first, then set dates from its results |
| 2 | Is a domain owned? | Use the host's preview URL for the prototype |
| 3 | Who writes and publishes, and how often? | Patience and Daisy as Editors |
| 4 | What is a good result in the first 90 days? | Set after launch data |
| 5 | Is there a Revalue logo? | Text wordmark in the prototype |
| 6 | "ReValue" or "Revalue"? | "Revalue", matching your recent writing |
| 7 | Does the site explain the EcoSort rename? | One line on the About page |
| 8 | Is the household audience a parallel track or later? | Resources serve them, with no separate pathway |
