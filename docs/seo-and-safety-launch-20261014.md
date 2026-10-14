# Reborna Organic Search & Community Safety Launch — 14 October 2026

**Scope:** Open the public, source-attributed editorial catalogue to search engines without making private account content public. Phase-one SEO implementation and required human follow-ups.

## Verified technical findings

- Cloudflare Pages builds the public Next.js App Router pages with `output: 'export'`. Artist biographies, 252 individual named kits, 28 artist profiles, material ranges and item detail pages are **static HTML available without a server-side database query at viewing time**. The separate account/community API uses Cloudflare Pages Functions and D1; those do not turn public catalogue pages into client-only shells.
- Before this launch, `app/layout.tsx` globally set `noindex`, and additional public artist, kit, material and event routes repeated `noindex`. These must be lifted only on public and substantive pages, preserving exclusion of private tools and illustrative/incomplete features.
- GitHub SEO export test reported **554 unique sitemap entries** after the XML-escape fix, including public editorial sections, 28 sculptor profiles and 252 original-kit pages; static pages and XML are programmatically checked. Counts change as source records change.
- Standard HTML `<a>` links, unique `<title>` elements, one H1, descriptive images, canonicals and factual internal links are preferred over JS-dependent search shells or artificial keyword repetition.
- The XML sitemap has optional image references to externally hosted, source-identified photos; Google may index those images according to source permissions and Google policies. Image indexing and ranking are not guaranteed.
- Schema: **Person** for documented original sculptors; **CreativeWork** for their sculpt designs; **BreadcrumbList** for crawlable hierarchy; **WebSite** for Reborna. No unverified product offers, fake stock, review stars or merchant claims.
- `llms.txt` is an optional text navigation file for AI systems that use it, **not** a Google ranking technique. Google explicitly clarified this in June 2026.
- Google Search can render JavaScript but prerendered HTML reduces crawler dependence on client execution. Browser-only hearts and filters can be hydrated later.

## Keyword-to-page opportunity map (qualitative; no fabricated search volumes)

| Priority | Query family and examples | Destination | Editorial proof to build |
|---|---|---|---|
| P1 | `[sculptor full name] reborn doll kits`, `[sculptor] original sculpts`, `[sculptor name] doll artist` | `/artists/{slug}/` | Sourced biography; actual artworks; aliases where documented; consistent name, H1, source links |
| P1 | `Cassie Ann Love reborn kits`, `Cassie Brace kits` | `/artists/cassie-ann-love/` | Documented former name + historically sourced sculpt names and portfolio links |
| P1 | `[kit name] by [sculptor]`, `[kit name] reborn doll kit`, `original [kit name] kit` | `/kits/{slug}/` | Artist link, original vs completed-doll distinctions, valid size/material if sourced, attributed images, related works |
| P1 | `original reborn doll kits`, `reborn doll sculptors`, `authentic reborn doll kits` | `/real-kits/`, `/artists/`, homepage | Genuine categorized links into dedicated artist and named kit records |
| P2 | `how to identify an original reborn doll kit`, `reborn kit vs recast`, `reborn sculptor copyright` | `/guides/original-reborn-kits/` | Practical, qualified provenance guidance; original examples and source links |
| P2 | `reborn doll paint`, `heat set paints for reborn dolls`, `air dry reborn paints`, `rooting mohair` | `/materials/`, `/materials/{supplier}/`, product pages | Source-specific manufacturer/range title; distinction of paint systems, seller and photo source |
| P3 | `reborn doll show`, `[event name] reborn convention` | `/events/`, `/events/{slug}/` | Real organizer, place, date and primary event source |
| Later | `[technique] reborn doll painting`, community questions | New static guides, or *only approved publicly indexable discussions* | No invented social proof; avoid thin near-duplicate forum/query pages |

**Limitations:** This is search-intent mapping based on Reborna's verified content and actual public results, not an Ahrefs/Keyword Planner or Search Console volume report. We cannot guarantee that Reborna will outrank an original sculptor's official website. Original source citation, independently useful comparison/context, editorial integrity and earned inbound links provide a more credible path to authority.

## SEO release checklist

- [x] Replace global and primary public catalogue `noindex` with indexed static routes.
- [x] Preserve `noindex` for account, dashboard, messages, moderator screens, member/discussion query shells, illustrative release calendar and unfinished artist/certificate features. Never sitemap these.
- [x] Publish `robots.txt` directing all standard crawlers to the public site, excluding the dynamic API only.
- [x] Publish source-derived `sitemap.xml` with public pages, 28 artists, 252 kit routes, real supplier/detail and researched event routes; allow verified, crawlable image references. Do not falsify `lastmod`, stock or offer metadata.
- [x] Publish `llms.txt` as an optional directory (not a ranking promise).
- [x] Introduce canonicals, unique SEO title/description and appropriate structured data for artist, kit and material pages.
- [x] Add normal static artist-name and kit-name links rather than requiring scroll/load-more interactions.
- [x] Improve meaningful hero/gallery photo alt descriptions using existing attributable sculpt and maker fields; decorative secondary thumbnails remain empty-alt intentionally.
- [x] Add original reborn kit research guide linking sculptor directories, original catalogue and safer sourcing.
- [ ] Verify deployment succeeded on Cloudflare and production `sitemap.xml`, `robots.txt`, `llms.txt`, pages and privacy exclusions return the expected HTML.
- [ ] Connect Google Search Console **Domain property** through a DNS TXT verification token. Do not guess Google's unique token; user must provide it or connect an authorised service.
- [ ] Submit `https://reborna.co/sitemap.xml` in Search Console, inspect representative artist/kit pages, and review Page indexing / Image results for errors after crawl.
- [ ] Check CDN image rights, expiry and whether source imagery is indexable; optimise file dimensions, formats and image fetch reliability where authorised.
- [ ] Improve branded social previews with a logo/owned representative social image when a clearly authorised asset is available.
- [ ] Measure page clicks, impressions, queries, indexing coverage and average position *after data becomes available*, segmenting artist, kit, material and guides. Google results can take weeks; no guaranteed timing.

## Current community safety and moderation status (production check)

At audit time production D1 had **1 registered real member, 0 appointed community moderators, 0 open reports, 0 held content items, and 0 private messages**. These counts can change after this check; nothing should be claimed as an operational moderation team yet.

### Implemented in this release
- New unobtrusive Report links for posts, replies, private messages and member profiles (for signed-in users).
- The report API checks targets exist and validates that private-message complainants actually belong to the relevant conversation.
- A minimal operational report alert goes to `hello@reborna.co` using the configured transactional email provider; it includes a report reference, **not private message content**.
- Public Community Guidelines include a clear safety-reporting and appeal route through contact form and email for non-members.
- No fabricated reports, identities, completed complaint statistics or moderation reviews are created.

### Required human decisions and tests — NOT completed by the release
1. **Appoint an actual verified founder/moderator account.** A Reborna member account existing is not the same as a moderator grant; user should confirm the chosen handle and explicitly authorise granting a moderator role before any privileged database change.
2. Test with two controlled accounts: send a private message, report it as recipient, verify the staff alert reaches the inbox, review it in the private moderator queue, and check decisions/appeals and privacy. Also test an uncertain forum submission held for review.
3. Complete and retain **Ofcom user-to-user online-safety scoping**, illegal-content risk assessment and **children's-access assessment** appropriate to the UK Online Safety Act. A general “adults only” sentence without effective age measures is insufficient.
4. Establish actual response procedures, documented moderation contacts, report retention/erasure and urgent illegal-content escalation. Review provider safety risk factors and mechanisms for user reports and DMs.
5. Resolve the actual data-controller identity, privacy data rights workflow, complaint acknowledgements, contact notification retry process and retention schedule. Branding as “Reborna” alone may not meet UK GDPR Article 13 identification requirements; don't represent the existing policies as solicitor-verified.
6. Verify security rate limits, profile and avatar reporting and notification flags after deployment.

**Launch posture:** Public catalogue **can become indexable now** as explicitly requested; widespread promotional community onboarding should wait for these operational and legal blockers. The public website is editorial, not a payment marketplace, and must not pretend otherwise.

## Google and Ofcom source documents
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/updates (June 2026 llms.txt clarification)
- https://www.ofcom.org.uk/online-safety/protecting-children/protection-of-children-duties-under-the-online-safety-act
- https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/illegal-content-duties-under-the-online-safety-act
