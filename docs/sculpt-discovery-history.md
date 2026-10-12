# Sculpt discovery and temporal inference

## Rule: observation is not publication
A first-seen timestamp is **not** an artist announcement date, production date, preorder opening, or release date. Store all separately. Even a newly seen kit can be a newly indexed historic item, a migrated page, or a returned edition.

## Daily scan snapshots
For every successfully checked source record:
- source ID, canonical URL, artist ID, upstream product ID where available
- scan started/completed at (UTC), scan success state, HTTP metadata and parser version
- raw source hash, extracted text hash, source content/evidence reference
- listing identifier and presence within the **successfully enumerated** collection
- title, sculpt ID (after review), parsed lifecycle, explicit dates, image URLs, stock and retailer offer data

Track scan run completeness: a missing listing in an incomplete scrape is NOT proof of absence. Require comparable, complete snapshots for disappearance or newly-seen interpretation.

## Historical events
Append-only events on meaningful change:
- first_observed_on_source
- artist_announced (only with sourced explicit evidence)
- preorder_opened, preorder_closed, manufacturing_started, delayed, shipping_started
- available_at_retailer, unavailable_at_retailer, sold_out_at_retailer
- next_run_announced
Each event stores observed_at, effective_at (nullable), source URL, evidence snapshot, confidence and extraction method (artist explicit / retailer explicit / inferred).

## Inference policy
1. If artist explicitly supplies date, use it as the appropriate typed event date, with provenance.
2. If newly discovered in a fully comparable consecutive scan and prior scan saw the relevant area without it, infer an *appearance window* (previous successful scan, current scan], NOT an exact public announcement date.
3. A discovery window may support the label 'Newly discovered' and an observed year. Only use 'Announced in YEAR' when the announcement year is actually verified.
4. If status changes from announced to preorder open in complete snapshots, record 'preorder observed open between T1 and T2', unless a precise date is published.
5. A product page first seen today can be old, reissued, or restored. Never infer release year from first_seen alone.
6. Cross-check artist site, social announcement, retailer launch listings, structured metadata, publication dates, and archived sources. Do not trust server file modification times or arbitrary image names as release evidence.
7. Distinguish editions / runs: reopening a preorder could be a second production run. Preserve per-run identity and lifecycle.
8. Changes in currency, pricing or retailer stock are per-offer observations, not changes to the sculpt's creative lifecycle.

## Display policy
- Artist cards: '2026 · Release' only if a release year is supported.
- Otherwise 'First seen on Reborn · 2026' may be shown *only* where useful, never replacing release year.
- Calendar event date must be an explicitly supported day/month; otherwise place it in undated/upcoming collection, not a made-up month.
- Chronological sort: verified effective dates first; then dated source observations / production sequence separately, using labeled fallback and deterministic name ordering only as final tie-break.
- Unknown statuses remain unknown internally; do not publicly assert 'sold out' from absence.

## Candidate relational model
scan_runs(id,source_id,started_at,completed_at,success,coverage,parser_version)
source_snapshots(id,scan_run_id,url,canonical_upstream_id,content_hash,evidence_uri,present)
sculpt_observations(id,sculpt_id,source_snapshot_id,observed_at,parsed_fields,confidence)
sculpt_events(id,sculpt_id,run_id?,event_type,observed_at,effective_at?,effective_end_at?,evidence_uri,confidence,method)
sculpt_runs(id,sculpt_id,artist_run_identifier?,edition_size?,launch_at?,preorder_window?)
retailer_offer_observations(id,offer_id,observed_at,status,currency,price,deposit,balance,evidence_uri)

## Test cases
- Product newly indexed after catalogue pagination changes: do not claim newly announced.
- Failed scrape followed by successful scan: no inference from failure.
- Preorder briefly closes and reopens: distinct state changes with provenance.
- Product disappears temporarily: no sellout assumption.
- Older sculpt returning for a second edition: retain historic original release, make new production-run record.
- Retailer sold out while artist still accepts preorder: separate retailer status and artist lifecycle.
