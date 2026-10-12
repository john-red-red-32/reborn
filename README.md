# Reborn — independent sculpt kit discovery

Initial Next.js prototype with a marketplace-style catalogue, release calendar, filters, kit detail panels and a locally saved watchlist.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Import the GitHub repository into Vercel as a Next.js project. Keep the prototype private/unindexed during validation; `app/layout.tsx` currently sets robots to noindex.

## What works

- Responsive catalogue design
- Client-side kit search and release status filters
- Release calendar showing deposit, balance and shipping
- Save and unsave kits, preserved in this browser through localStorage
- Kit detail modal

## Not yet implemented

- Live listings, sources, authenticated accounts, email notifications or payments
- Retailer stock monitoring, artist discovery crawlers and verified buying links
- Database, admin publishing, image rights workflows and SEO indexing

**All example kits, artists, prices, dates and retailer counts are fictional.** Replace these with authorised, verified listings before making the site public.

## Next data model

Artists → Sculpt kits → Release events → Retailer offers → Availability observations. Keep source URL, verification timestamp, confidence and permission/image provenance on each imported field. Use explicit artist/retailer verification and rate-limited compliant crawling.

## Technical stack

Next.js, React, TypeScript and vanilla CSS for the prototype. Supabase/Postgres and scheduled collectors can be added when approved data sources are identified. No secrets required for this first version.
