# Shopify original kit pilot — Nikki Johnston

Pilot source: https://nikkisseasidebabies.co.uk/ (Nikki's Seaside Babies).
This is a separate artist/site from Cassie Ann Love. It is not licensed image mirroring and must not be confused with the seller's completed reborn-doll catalogue.

## Automatic workflow
`.github/workflows/discover-nikki-shopify.yml` runs on Shopify adapter/workflow changes and manually with a public HTTPS starting URL. It uses the common public HTML sitemap crawler, reads the public Shopify product JSON index when robots policies allow it, then falls back to product-specific public JSON for known linked product handles. No login, Admin API, private tokens, or checkout access.

The tool writes run reports to the distinct `scrape-results` directory:
`snapshots/nikkisseasidebabies.co.uk/latest-shopify-kit-candidates.json`
and dated/run-ID copies under `runs/<id>/`.

The artist identity manifest is `config/artist-sources/nikki-johnston.json`.
Initially its accepted name set is empty: new names from discovery require review; they are not automatically attached to Cassie or accepted as valid originals.

## Essential separation
1. **Original blank vinyl kits**: seller explicitly describes sculpted kit. Candidate for sculpt/kit catalogue.
2. **Finished reborn / prototype dolls**: often reborn by Nikki **from somebody else's sculpt**. These are excluded from the original sculpt catalogue even when listed on the same Shopify shop.
3. **Components**: standalone belly plates, bodies or heads sold separately are not kits. A belly plate *included as an option in a kit* is a kit variation.
4. **Classes, tutorials, gift cards**: not kits.
5. **Uncertain records**: remain for manual review.

## Variant interpretation
Capture stable Shopify product and variant IDs, option titles and values (belly plate: yes/no, payment: deposit/full), per-variant image IDs, variant availability, SKU and price in native cents converted to GBP for this confirmed GBP pilot store.
- A **deposit** is a payment option, never a starting kit price.
- **From** is shown only if the same product has at least two distinct full-purchase prices, such as with and without a belly plate.
- Equivalent full prices do not produce a range.
- Inventory flags cannot override an explicit pre-order/sold-out claim. Conflicting seller evidence is preserved for review.
- If a retailer sells only standalone belly plates, they remain a distinct component SKU, not inferred kit bundle pricing.

## Source facts
Where published, extract edition size, approximate kit length, head circumference, included cloth body, COA, manufacturer and optional belly plate. Publication and product creation timestamps are evidence about Shopify records, **not** release dates.

## Launch safety
All scraped items and referenced third-party photographs remain unpublished pending correct identity/usage-rights review. URLs, timestamps, hashes and source product descriptions are retained for auditing. Never infer stock, announcement years or editions from missing source pages.
