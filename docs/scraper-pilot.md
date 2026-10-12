# Reborna artist-site discovery v1

## Purpose
Read-only URL-fed source discovery, designed to evolve into a recurring historical monitor. It deliberately does **not** update the production catalogue or mirror images.

## How to run
Open GitHub -> Actions -> **Discover artist site** -> Run workflow.
- Source URL: `https://www.cassielove.co.uk/` (or a narrower official sculpt index)
- Max pages: 30, then assess coverage.
- After completion, download the `artist-discovery` workflow artifact. It contains `source-discovery.json` and expires in 30 days.

Local invocation:
```bash
python3 scripts/discover_artist_site.py --url https://www.cassielove.co.uk/ --max-pages 30 --out artifacts/cassie.json
```

## Captured today
For every successful HTML page: canonical fetched URL, observation timestamp, HTML SHA-256, title, meta tags, JSON-LD blocks, candidate image URLs and alt text, discovered internal links, parse status. At scan level: source, parser version, success counts, page cap, remaining queue and errors.

No binary images are copied, no personal data is intentionally extracted beyond publicly visible page metadata, no dates are assigned merely from discovery. Respect robots.txt, throttle requests, limit request size and keep the crawl on the input host. A `complete` flag false indicates the source cannot be used for reliable absence/new-listing comparisons.

## Data architecture assessment
The current TypeScript site records are hand-curated **seed records**, not the future ingestion database.
Recommended additional normalized keys, beyond existing spec:
- artist: `artist_id`, `identity_confidence`, `aliases`, `portrait_media_id`, `square_media_id`, `banner_media_id`, `artist_claim_status`, `source_site_ids`
- sculpt: `sculpt_id`, `upstream_sku`, `catalogue_visibility`, `material`, `length_cm`, `head_circumference_cm`, `eye_size_mm`, `limb_configuration`, `includes_body`, `variant_parent_id`, `production_sequence`
- edition/run: `run_id`, `edition_kind`, `edition_size`, `signed_or_numbered`, `coa_type`, `manufacturer`, `production_status`, `estimated_ship_window`, `announcement_date_source`
- retailer offer: `seller_sku`, `seller_region`, `native_currency`, `total_price`, `deposit_amount`, `balance_amount`, `layaway_terms`, `stock_confidence`, `shipping_regions`, `last_observed_at`
- image: `media_id`, `artist_or_sculpt_id`, `source_page`, `credit`, `rights_evidence`, `original_filename`, `perceptual_hash`, `image_role`, `focal_point`, `run_id`, `variant_id`
- provenance: `scan_run_id`, `source_snapshot_id`, `source_site_adapter`, `parser_version`, `observed_at`, `valid_from`, `first_seen_at`, `explicit_effective_at`, `confidence`, `human_review_state`

Capture optional fields only when sources actually substantiate them. Distinguish unknown from absent, and announced/preorder/released from *first observed*.

## Known limitations before scheduling
1. This v1 discovers only HTML linked from the seed page; it does not read XML sitemaps, execute JavaScript, handle paginated JS-only catalogues, or inspect social network posts. Wix artist galleries may need a dedicated extraction adapter.
2. No persistent historical database exists yet. GitHub workflow artifacts expire, so the first scheduled checker must write durable snapshots to storage/database and diff only comparable complete crawls.
3. No artist/run/entity matching is automatic; candidate data needs identity validation and source-of-truth reconciliation.
4. Downloading and republishing images requires a documented right to do so, even if discovered in the crawl.
5. Only crawl sites where automated access is permitted by applicable policies and website terms. Avoid authenticated pages and excessive request rates.

## Acceptance gate for Cassie rescan
Review returned source URLs, page coverage, image matches and authoritative sculpt names. Compare to the existing 60+ manually curated archive and record missing pages; do **not** overwrite records from a partial scan.
