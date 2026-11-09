# The Edit — editorial launch and publishing playbook

**Established:** 9 November 2026 · **Editor/persona:** Felix Frost (fictional) · **Source of truth:** `lib/edit-*.ts` and the commit-controlled release manifest.

## Evidence, not invented keyword volumes

Google Search Console through connected Windsor.ai, 1–7 November 2026, page-level totals: `/events/` **4 clicks, 33 impressions**; `/events/the-doll-show-basildon-2026/` **41 impressions**; Yophi **14 impressions**; Weißenfels **5 impressions**; MUVAL **5 impressions**. Original-kit and sculptor opportunities: Willow by Joanna Kazmierczak **60 impressions**; Nikki Johnston artist page **25**; Ilea by Olga Auer **17**; Yuna by Olga Auer **13**. Search volumes and expected ranking increases have not been estimated.

## Release calendar: 5 live on 9 November, 15 scheduled within 35 days

| Publication date (UTC) | Slug | Initial state |
|---|---|---|
| 2026-11-09 | `basildon-doll-show-2026-collector-field-notes` | Live at launch |
| 2026-11-09 | `nikki-johnston-sculptor-collector-spotlight` | Live at launch |
| 2026-11-09 | `weissenfels-reborn-event-2027-art-behind-the-baby` | Live at launch |
| 2026-11-09 | `willow-joanna-kazmierczak-original-sculpt-guide` | Live at launch |
| 2026-11-09 | `yophi-orlando-2026-artistry-beyond-showroom` | Live at launch |
| 2026-11-12 | `west-coast-doll-show-2027-bonnie-brown-ontario` | Queued |
| 2026-11-14 | `kansas-doll-show-2027-ten-years-of-making` | Queued |
| 2026-11-16 | `ilea-olga-auer-sculpt-reference-not-stock-alert` | Queued |
| 2026-11-18 | `first-reborn-doll-show-collector-game-plan` | Queued |
| 2026-11-20 | `yuna-olga-auer-reborn-kit-provenance` | Queued |
| 2026-11-22 | `reborn-kit-release-calendar-how-to-read-updates` | Queued |
| 2026-11-24 | `joanna-kazmierczak-sculptor-archive-through-the-works` | Queued |
| 2026-11-26 | `certificate-of-authenticity-reborn-kits-limits` | Queued |
| 2026-11-28 | `vinyl-vs-silicone-reborn-dolls-materials-guide` | Queued |
| 2026-11-30 | `rooted-mohair-painted-hair-reborn-artistry` | Queued |
| 2026-12-02 | `muval-valencia-2026-mixed-doll-show-format` | Queued |
| 2026-12-05 | `bonnie-brown-sculpt-credit-artist-behind-the-name` | Queued |
| 2026-12-08 | `photographing-reborn-art-at-doll-shows-etiquette` | Queued |
| 2026-12-11 | `reborn-artist-portfolio-vs-marketplace-what-to-show` | Queued |
| 2026-12-14 | `reborn-art-materials-beginners-paint-rooting` | Queued |

## Publishing system

- `lib/edit-events.ts`, `lib/edit-sculpts.ts`, `lib/edit-collecting.ts`, `lib/edit-community.ts` contain twenty fully drafted source-aware features. Existing four stories remain untouched.
- `lib/edit-schedule.json` is the canonical release calendar; `lib/edit-release.json` is the only published-slug allowlist. Article routes, related stories, The Edit index and `sitemap.xml` import the published allowlist through `lib/the-edit.ts`.
- `scripts/publish-the-edit.mjs` validates the plan, adds only due dates to the manifest and is safe to rerun. Daily scheduled GitHub Actions at 09:17 UTC performs the date check, runs a build only when changes are due, commits the release manifest to `main` and mirrors it to production `cloudflare-pages`. GITHUB_TOKEN-triggered commits do not automatically rerun dependent GitHub workflows, so the job explicitly updates the production branch.
- `node scripts/publish-the-edit.mjs --check --date=2026-11-09` audits the schedule. `node scripts/publish-the-edit.mjs --dry-run` shows what is currently due. A manual workflow dispatch provides recovery if GitHub's cron is delayed.
- Article and BreadcrumbList JSON-LD, canonical metadata, social previews, source links and related recommendations are created at build time. Existing event-detail pages retain factual Event JSON-LD and now add breadcrumbs and companion editorial links.
- No third-party photography has been imported; existing original kit photographs are reused only through their pre-existing source-attributed catalogue displays.

## Official event research and editorial boundaries

- Basildon: https://www.thedollshow.co.uk/event-details/basildon-22nd-november-2026 and https://www.thedollshow.co.uk/basildon-holiday-inn. **Discrepancy:** the booking event says 16:30 close but the venue guide says 16:00; flag this and reconfirm.
- Yophi: https://www.yophidollshow.com/faq and https://www.yophidollshow.com/showfloor-entrace and https://www.yophidollshow.com/schedule. Show dates and hours sourced; schedule labelled preliminary by organiser.
- Weißenfels: https://www.weissenfels.de/Kurzmen%C3%BC/4-REBORN-EVENT.php?FID=3720.260314.1&La=1&ModID=11&NavID=3678.7&object=tx%2C3678.4.1 . The municipal organiser confirms the two March 2027 dates and separate daily hours.
- West Coast: https://www.westcoastdollshow.com/attendees and https://www.westcoastdollshow.com/honored-guest. Bonnie Brown is an announced honoured guest; no unverified appearance timetable, signatures or exclusive release.
- Kansas: https://www.kansasdollshow.com/ and https://www.kansasdollshow.com/admission. **Important:** some other subpages still describe 2026; never transfer those details to 2027.
- MUVAL (completed 1 November 2026): https://www.muval.art/index.html and https://www.muval.art/faq.html. The editorial piece is an analysis of the organiser's advertised mixed-show concept, not a post-event retrospective. No evidence-backed post-event attendance or exhibitor results were found.

## Editorial standards

- Treat original sculptor, manufactured kit, completed reborn artwork and seller as distinct entities. Do not infer current stock, edition numbers or vendor participation.
- Images only with publication permission and attribution. Opinion can be sly; factual claims need primary-source URLs and dated verification.
- Factual event directory pages remain authoritative for logistics. The Edit offers craft analysis, collector questions, cultural context and deep links, avoiding duplicated intent.
- Change an upcoming event's published facts in the event directory if the organiser changes them; amend and date-stamp dependent editorial rather than silently editing history.

## Analytics follow-up

Compare Google Search Console impressions, clicks, CTR and query-to-page pairings for event-detail pages and `/the-edit/` articles at +14 and +35 days. Watch for page cannibalisation and adjust editorial links/titles if event factual queries shift away from the authoritative event page. Track account conversions and wishlist saves only if consented GA4 events exist—do not invent conversion counts.
