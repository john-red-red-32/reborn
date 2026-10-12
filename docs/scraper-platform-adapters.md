# Source platform adapters and durable evidence

## GitHub snapshots
The `Discover artist site` Action now tries to publish its resulting discovery and extraction JSON to the independent `scrape-results` branch using `GITHUB_TOKEN` with repository contents-write permission. Scans are stored as:
- `snapshots/<source-host>/latest-run.json`
- `snapshots/<source-host>/latest-source-discovery.json`
- `snapshots/<source-host>/latest-extraction-candidates.json`
- `snapshots/<source-host>/runs/<run-id>/source-discovery.json`
- `snapshots/<source-host>/runs/<run-id>/extraction-candidates.json`

The branch deliberately does not deploy the website or trigger additional scrape runs; workflow is scoped to `main`. This is an initial Git-based archive suitable for modest pilots, not a production database or unlimited snapshot retention. If Actions token cannot push, check Settings > Actions > General > Workflow permissions, or branch policies. Until branch creation and report access are confirmed, rely on existing Actions artifacts.

## Common ingestion interface
1. Take an artist-approved official starting URL and platform identifier.
2. Discover source URLs using site navigation and public sitemaps with permissions and crawl delays.
3. Extract candidate artist/sculpt/kit/run/configuration/retailer/media assertions, recording evidence URL, scan time, parser version, uncertainty and explicit seller lifecycle wording.
4. Reconcile candidate identity against stable IDs and previously accepted records. Review before publication.
5. Save append-only observations and distinguish explicit preorder wording from generic structured availability flags.
6. Preserve versioned source evidence; only compare complete, comparable scans to detect newly appeared/disappeared listings.

## Platform status
- **Wix:** Detection and sitemap discovery implemented. Structured Product JSON-LD extraction works on Cassie's live product pages; JavaScript gallery/archive extraction is still a separate required adapter.
- **Shopify:** Detection and sitemap discovery implemented. Product JSON-LD is covered when present; Shopify product JSON and selected-variant endpoints need an explicit vetted adapter.
- **WooCommerce:** Detected separately from WordPress and discovers public sitemaps. Variations and WooCommerce REST/storefront extraction not yet built.
- **WordPress:** Detection and sitemap discovery implemented. Posts/custom post types and galleries require adapter.
- **GoDaddy Website Builder:** Detection and sitemap discovery implemented. Dynamic catalog/gallery extraction needs adapter.
All sources must honor site permissions, rights and rate limits; no hidden authenticated endpoints or image mirroring by default.

## Lifecycle precedence
An explicitly stated pre-order in an artist-authored product description/title is evidence of **preorder_advertised** even when an Offer's generic JSON-LD availability is `InStock`. Retain both facts with their source. This is not by itself evidence of precise opening/closing dates.

## Acceptance
After the first successful run using this workflow revision, verify that `scrape-results` exists, the two latest JSON files can be fetched directly and the saved run ID matches the completed Action. Then build a Wix archive/gallery adapter using reviewed Cassie-source observations.
