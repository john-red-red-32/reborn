# Reborn catalogue architecture

## Current prototype (October 2026)
- `lib/real-catalogue.ts`: artists and selected individually documented kits.
- `lib/cassie-profile.ts`: Cassie's public biographical text and historical list of sculpt names.
- `lib/cassie-images.ts`: official-source image references matched to individual named sculpts, without downloading or copying the source images.
- `components/UnifiedSculptCollection.tsx`: joins those records by case-normalised sculpt name, sorts and progressively renders them.
- There is no persistent production database, artist account or automated crawler yet.

## Target production model
`artists`: id, slug, display_name, approved_profile, website, source_evidence
`sculpts`: id, artist_id, slug, name, edition_size, announced_at, preorder_opens_at, released_at, lifecycle_state, verification_state
`sculpt_images`: id, sculpt_id, source_url, storage_url (if licensed), source_page, image_role (primary/alternate/gallery), rank, rights_status, review_status, last_checked
`retailers`: id, name, official_url, country
`offers`: id, sculpt_id, retailer_id, item_url, currency, total_price, availability, checked_at, evidence_url
`source_observations`: id, source_url, observed_at, parsed_field, parsed_value, confidence, reviewer
`artist_claims`: id, artist_id, account_id, review_state, reviewed_at
`certificate_issues`: separate from catalogue with immutable issuance, encrypted print exports, keyed code hashes, verification event logging.

## Invariants
- A sculpt is not a finished doll painted by another reborn artist.
- Availability lives primarily on a retailer offer, not the historical sculpt itself. A kit can be sold out at one retailer and available at another.
- “Pre-order”, “announced”, “released”, “sold out” are different lifecycle and stock concepts; do not infer one from the other.
- Preserve release dates as separate typed fields. A preorder-opening date is not the release date.
- Never label stock or edition size as verified unless supported by an up-to-date source observation.
- Images must have verified identity and source, and licence/republication status before they are mirrored into owned storage.
- Duplicate artist or sculpt names can exist; use stable IDs for production joins rather than names.
- Never assume a successfully parsed remote URL means the image is accessible in a deployed browser.
- Image loading must fall back gracefully; resolve external image access and rights issues before launch.

## Scale plan
1. Import candidate sculpts with source provenance and deduplication.
2. Human review or artist verification approves identity, edition and imagery.
3. Maintain separated edition metadata, retailer offers and observation freshness.
4. Crawl with rate limits and robots/terms consideration; recheck availability frequently.
5. Add relational database and managed image processing once assets may lawfully be stored.
6. Keep the front end artist-neutral: one shared collection component, no source-specific logic beyond ingestion adapters.

## Known limitations
- Current archive sorting has no comprehensive historical release-date dataset: undated records sort last in release-date modes.
- A one-time source image index is not an automated sync.
- Current image manifest is Cassie-specific and should become generic `sculpt_images` before multi-artist scaling.
- No CI build/browser image validation was run from this connector.
