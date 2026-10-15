# Reborna — Search Console and image discovery follow-up (15 October 2026)

This is an operator checklist, not a claim that Google has indexed the catalogue.
Production: https://reborna.co · Search Console Domain property: `sc-domain:reborna.co`.

## Completed in Reborna's repository

- Public static sitemap at `https://reborna.co/sitemap.xml`, linked in `robots.txt`.
- Indexable, canonical public artist and kit pages; private routes remain excluded.
- An indexed, cited editorial guide to Cassie Ann Love's historical sculpt production, linked from her sculptor profile and the original-kit education guide.
- Externally hosted source images remain at the publishers' original URLs; we have not copied, transformed or assigned new rights.
- Lead kit image is prioritised for browser fetching; thumbnails remain lazy loaded.
- Image gallery alt text describes the sculpt/design and separates source photography credit from sculptor authorship.
- The kit schema now includes image URLs and source-provided credit text.
- `python3 scripts/audit-image-discovery.py out --probe` audits generated image sitemap entries, visible HTML discovery and a small sample of independent source hosts; a third-party bot refusal is a manual-review flag, **not** proof an image is unavailable.

## Google Search Console: owner action still required

Windsor.ai has read access to `sc-domain:reborna.co` but does **not** expose an action to submit a sitemap or request URL indexing. An active GA4 connector does not change those permissions.

1. Sign in to [Google Search Console](https://search.google.com/search-console), choose **reborna.co** (Domain property).
2. Go to **Indexing → Sitemaps**, enter `https://reborna.co/sitemap.xml`, and select **Submit** if it is not already listed. Google may need time to fetch and process it.
3. Confirm the submitted sitemap's latest status is **Success**. If not, open the error details and investigate the actual response.
4. Use URL Inspection on the homepage; `/artists/cassie-ann-love/`; `/kits/hattie-cassie-ann-love/`; `/guides/original-reborn-kits/`; and `/guides/cassie-ann-love-sculpt-history/`. Check canonical selection, crawlability, and the live-page test.
5. When Google has populated the reports, review **Page indexing** and **Performance** (Web vs Image). A submitted URL is not an indexed URL; an indexed URL is not a guaranteed ranking.

Search Console's own help describes a sitemap as a discovery signal, not a guaranteed crawl/index operation.

## Image rights, crawl and metrics caveats

- Google Image Sitemaps can include off-domain CDN images, but Google recommends Search Console verification of both domains for diagnostic visibility. Reborna does **not** control original artist/retailer CDNs, so no claim is made that those hosts have been verified.
- If a third-party photo URL fails in the automated audit, check the image in a browser and against the actual publisher before editing or removing it. Publishers may refuse scripted requests while images work in normal browsers.
- Source credits identify the page where a photograph is published; they do not automatically prove who photographed it or grant republication rights.
- Do not invent image captions, alt descriptions, release dates, stock, review scores or publication dates to improve rankings.
- Indexing, Image Search and organic-traffic measurements may take days or weeks to appear, and early data is volatile.

## Sources

- Google Search Central — Sitemaps: https://support.google.com/webmasters/answer/7451001
- Google Search Central — Image sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- Google Search Central — Image SEO: https://developers.google.com/search/docs/appearance/google-images
- Cassie Ann Love — original kit gallery: https://www.cassielove.co.uk/vinyl-doll-kits
- MacPherson interview with Cassie Ann Love: https://macphersoncrafts.com/sculptors/manufacturers/cassie-brace-love?tmpl=component
