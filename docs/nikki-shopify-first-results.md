# Nikki's Seaside Babies — first Shopify catalogue audit (2026-10-12)

Source: https://nikkisseasidebabies.co.uk/ ; reference snapshot: `scrape-results/snapshots/nikkisseasidebabies.co.uk/runs/38318244738/shopify-kit-candidates.json`.

## Verified discovery metrics
- Shopify public product index: 29 products; errors: 0; coverage: index enumerated.
- Candidate original blank sculpt kits: 15 separate seller product records.
- Completed/prototype reborn dolls excluded: 7, including artworks using other sculptors' blank kits.
- Non-kit products (tutorials, rooting classes, gift card, standalone belly-plate components): 7 after classification refinement.
- Original-kit-associated **image references**: 368 in the bounded report; URLs are evidence only, **not image rights or photo publication approval**.
- 29 full-purchase *single kit* variation records before manual price anomaly review, plus separate deposit/accessory/bundle types.
- Nikki's gallery contains product-specific historical edition sizes and specifications, including 12.5/13.5/14.5-inch head measurements in some listings. Values are artist-authored claims, not third-party independently verified measurements.

## Kit names identified from official storefront
Mabel, Christopher, Pickle, Delilah, Vincent, Trouble, Lexi, Isabella, Evie, Princess Charlotte, Robin Awake, Robin Asleep, Kiara, Posy, and Jack.

These 15 names are review candidates pending approved artist identity manifest entries. Similar names from another artist must remain separate identities.

## Price interpretation learned from actual Shopify variants
- Mabel: `NO Belly Plate` £99; `WITH Belly Plate` £115. Standalone plate-only option £16 **does not count as a kit**.
- Christopher: same 99/115 variant structure, plus a distinct £16 standalone plate-only option.
- Delilah: £95 without, £119 with belly plate.
- Pickle: £119 single kit price in the captured product JSON.
- Robin Asleep: £89 without, £104 with belly plate; bundle choices for *both twins* (£168/£198) are a separate bundle, not a price variation of one kit.
- Trouble: unusual £20 vs £104 options; lower amount must be reviewed rather than published as `From £20`. A conservative anomaly flag was added in the next extractor revision.
- Mabel's artist description advertises an optional plate for £15 whereas its captured Shopify variant difference/plate-only SKU was £16. Record these as separate observations, not forced agreement or an assumed discount.

All of these are snapshot seller observations. A sold-out Shopify item is a historical product record, not an invitation to buy. The site explicitly distinguishes preorders; generic `InStock` metadata does not override advertised preorder status.

## Data import gates
No third-party photos mirrored to Cloudflare and no unreviewed products added to the public Reborna marketplace. Before publishing: verify sculptor identity, variant prices and ambiguous payment options; review usage rights; explicitly distinguish original sculpt kits from Nikki's finished dolls and third-party prototypes; avoid turning Shopify product creation timestamps into release dates.
