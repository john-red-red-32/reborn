# Reborna catalogue ingestion data contract

Architecture specification — this is not yet an operational database or crawler.

## Core rules
- Immutable stable IDs for artist, sculpt, run, offer, and image; names and URLs can change.
- Provenance per extracted value: source URL, timestamp, content hash, parser version, confidence, reviewer, native language and currency.
- Append-only source observations, tracked changes, and correction histories.
- A sculpt, its production runs, retailer offers, and individual physical kits are different entities.
- Only original sculpts belong in this marketplace; painter-finished dolls must not be mistaken for the original sculpt.
- Missing information means unknown, not sold out or unavailable everywhere.

## Artists
Stable ID, display name, previous names and aliases, verified website, public social profiles, artist country (only where relevant and publicly disclosed), native language and supported languages, biography, artist photo with source/credit/licence, claim/verification status, and reviewed/published status. Avoid collecting private home addresses or personal contact details indiscriminately.

## Sculpts and variants
Artist ID, aliases, upstream identifiers, original sculpt name, original medium, vinyl/silicone distinctions, measured kit size and limb configuration, inclusions, optional body, variants (awake/asleep), launch evidence, earliest observation, explicit announcement date, separate preorder and release dates, historical sequence and source citations.

## Production runs / editions
Run ID, sculpt ID, first/subsequent run, edition type, total quantity where substantiated, numbered certificates and COA scheme, artist-announced run size, preorder opening/closing, delay and production stages, shipping start, cancellations, re-release provenance, specific images and manufacturing differences.

## Retailers and offers
Verified seller ID, original seller URL, country, shipping regions, shipping origin, taxes and shipping policy, supported checkout currencies; an offer per seller, run and variant with original currency, full price, preorder deposit, remaining balance, optional layaway as separate concept, stock availability, observation time, retail status and source evidence. FX is display-only and cannot overwrite checkout currency.

## Image assets
Each image records sculpt ID / run / variant and image role (sculpt clay, blank vinyl kit, prototype, finished example, alternate view), original source URL, source page, alt, credit, permission/licensing, duplicate hash, ordering, dimensions, last checked and hotlink viability. Only store mirrored assets with suitable rights.

## Source and history
Source registry with robots/terms policy, crawl scope, pagination completeness, scan-run success, full snapshot and hashes, parsed claims with source timestamps, first seen and last seen, status-change history, confidence, review queue. A failed or incomplete scrape cannot establish absence. First observed is not release year.

## Localisation and trust
Independent currency, language, country and shipping destination; ISO currency codes, FX rate source and timestamp, reviewed translations and original text. Artist account verification, permissions, rights challenges, corrections and opt-outs. Keep code-issuance and certificate verification data separated from public cataloguing.

## Recommended relational tables
artists; artist_aliases; artist_profiles; artist_images; sculpts; sculpt_aliases; sculpt_variants; production_runs; lifecycle_events; retailers; retailer_shipping_regions; retailer_offers; offer_observations; images; image_rights; source_sites; scan_runs; source_snapshots; extracted_claims; moderation_reviews; translations; change_history; artist_claims; certificate_batches; certificate_verification_events.

## Launch gates
Test multiple distinct artist sites before scaling, cross-check identities and image rights, deduplicate, validate date distinctions and pricing, check actual image loading, monitor freshness, respect legal crawling limits, and gate the staging site with access control rather than relying on noindex alone.