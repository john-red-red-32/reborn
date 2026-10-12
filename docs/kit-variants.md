# Reborna kit configurations and retailer-specific variant offers

One original sculpt remains one sculpt; a kit configuration is a purchasable **variant** of a particular production run, not a different original sculpt. Examples: with/without belly plate, full/half belly plate, matching back plate, cloth body included, limb/body packaging, vinyl colour and manufacturer-supported options. Only record variants actually evidenced by official artist or retailer listings.

## Canonical schema
- kit_variants: variant_id, sculpt_id, run_id (nullable), public_label, option_values JSON (e.g. belly_plate: included / excluded), included_parts, image_ids, official_source, observed_at, review_state.
- retailer_variant_offers: offer_id, retailer_id, variant_id, seller_sku, seller_variant_url, total_price_native, currency, deposit (preorder only), balance, status, observed_at, source_snapshot_id.
- media: per sculpt (shared), per run, or per variant as needed. The selected variant can override the primary image or add photos showing included parts.

## Distinct prices / From rules
- For a specific merchant and native currency, deduplicate *full purchase prices* (not deposits or balances). Multiple identical prices => one price. At least two documented different variant totals => From [minimum total] on comparison/summary, and selected variant exact full total on detail.
- A second merchant offering the same kit price does not create a range.
- If one merchant has different prices but some variants lack reliable totals, disclose that uncertainty; do not assert the complete minimum.
- Price comparison across different currencies needs consistent dated FX conversion and currency disclosure; never silently mix values or assume variants match across retailers.
- Different retailer prices can legitimately differ, but that is a retailer price comparison, not automatically a kit variation.
- Existing data has no verified per-variant records, so no current kit page should invent variation options or From pricing.

## Crawl/parser extensions to follow discovery v1
Extract ecommerce variation selectors, labelled option values, native variant/SKU IDs, selected variant price, price changes, images associated with variant selection, stock status and the evidence behind each. Some storefronts require structured data/network access adapters; do not automatically infer an option's inclusion from product description alone. Scraper should produce unreviewed candidates, not overwrite curated products.

## Current implementation
Optional `VerifiedKit.variants` with per-variant photos and option values; optional `RetailOffer.variantPrices` with seller price and availability for that configuration; kit details render a configuration selector and priced offers **only when verified variants exist**. Otherwise legacy kit pages are unchanged.

Next: confirm real variants from seller sources, add ingestion persistence, and connect selected-option photos to the larger approved gallery once implemented.
