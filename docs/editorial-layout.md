# Compact editorial layout

31 October 2026. Patience requested white backgrounds, removal of prominent section rules and a Forbes-inspired arrangement below Home's hero. This supersedes the original cream palette, ruled-section treatment and 96px desktop spacing. The supplied reference HTML remains useful for content and individual states, not for the superseded page rhythm.

## Shared rules

- Pure white page and surface tokens. Retain green actions and the dark green/charcoal type palette.
- Use heading hierarchy, imagery and alignment to separate content. No decorative lines spanning each section. Borders may still identify inputs, table cells and navigation boundaries.
- Content groups: 24px on mobile, 32–40px on desktop. Inside groups: 8–16px; columns: 24–28px. Preserve comfortable line spacing and touch targets.
- Home hero remains as supplied. Below it, a lead story, secondary feature and contextual sidebar share the same desktop row. The short introduction belongs in the sidebar instead of a wide empty block.
- Secondary mobile features use small thumbnails beside their text. Do not make every image a large standalone section.
- Collapse absent items. A one-article prototype is not permission to invent bylines, additional articles or empty filler columns.
- `SectionHeading` and `PageIntro` in `src/components/site/editorial.tsx` provide compact headings and introductions without decorative rules. Global `section-space` has the new spacing. Footer and background changes apply site-wide.

## Arrangement for subsequent pages

| Template | Arrangement |
|---|---|
| Resources / Blog | Compact title/search/filter area, lead story plus smaller stories; supporting topic navigation in a sidebar. Single-column reading order on mobile. |
| Article / Guide | Title, topic and byline close together; readable 680px body; related content alongside on desktop and after the body on mobile. No arbitrary full-screen gaps. |
| Topic hub | Short introduction followed immediately by the starting article and relevant resources; adjacent topics in a small sidebar. |
| Projects | Concise intro, strongest real project first, compact summaries and stage context. Do not fill a portfolio with speculative projects. |
| Project detail | Overview and authentic media together; method, completed work, evidence and limitations grouped under clear headings. Stage is contextual information. |
| Solutions | Clear overview and compact offering summaries. Detail pages put scope next to relevant facts/contact action. Keep availability accurate. |
| Tool | Instructions alongside preview/download metadata. Missing files use the specified unavailable state, not an empty display box. |
| Partners / About / Pricing | Short introduction, clearly grouped information and one relevant next action. Avoid repetitive image-and-text blocks separated by oversized gaps. |
| Contact | Form and contact/context column side by side; error and confirmation states remain accessible. Email-provider choice still requires Patience's decision. |
| Legal | A compact page introduction and a comfortable prose column. Content review is still required. |

These are template decisions for the remaining build; only Home and the shared site components have been implemented. Existing CMS, route, truth, approval and privacy requirements stay in force.

## Reference

[Forbes](https://www.forbes.com/) supplies the editorial hierarchy reference: lead coverage, smaller supporting stories, subject groupings and bylines. The page content was retrieved; a direct browser opening timed out in this revision. This is an adaptation of the layout approach, not a verified pixel-for-pixel reproduction or borrowed content.
