# Reborna media ingestion and image gallery contract

## Artist profile media
Artist has one-to-many media with stable media_id; roles portrait, square avatar, banner, studio, behind_the_scenes. Each includes original source URL, canonical asset ID, credit, alt, crop focus, dimensions, captured_at, rights_status, moderation status, and an artist-approved replacement or removal process. Directory cards prefer a verified square portrait, otherwise crop the portrait image. Profiles prefer portrait/banner. Never guess identities from images.

## Sculpt galleries (target: up to 20 approved images per sculpt page)
Use one-to-many sculpt_media keyed to stable sculpt ID, optionally production run and variant. Store media roles: primary, angle, detail, clay, prototype, blank_kit, painted_example, packaging, certificate. Keep original source URL, source page, photographer/artist credit, licensing/permission and rights scope, source alt text, original size, crop recommendations, display order, content hash, perceptual hash, last access check, storage key (if permitted), ingestion state, and a meaningful duplicate group ID.

## Ingestion process
1. Extract candidate images from the verified artist's sculpt page, then optionally retailer pages. Track page provenance and upstream image IDs.
2. Verify that each candidate belongs to the *original sculpt*, not another artist's interpretation or a similarly named doll. Distinguish unpainted prototype from finished painted example in captions.
3. Deduplicate exact files with cryptographic hash, then near-duplicates by perceptual similarity (but keep genuinely useful alternate viewpoints).
4. Assess quality and relevance, prioritise primary front, profiles, alternate angles, details and kit contents.
5. Verify right to display/cache/transform each image; retain links/metadata only when republication rights are unknown. Do not assume retailer or buyer uploads may be copied.
6. Where permission is granted, store a durable original and optimised derivatives (thumbnail, square, portrait, full-size) through image storage/CDN; generate responsive formats.
7. Curate up to 20 images on the product page initially, ranked rather than indiscriminately copying all images; additional images can remain in source observations for editorial review.
8. Record retractions, takedowns, artist-controlled media replacements and version history.
9. Fall back to a source URL only if hotlink permission and reliability are appropriate; otherwise show a branded placeholder.

## Suggested tables
media_assets(id, original_url, source_page, content_hash, perceptual_hash, width, height, MIME, credit, licence, rights_verified_at, storage_key, status)
artist_media(artist_id, media_id, role, position, focal_point)
sculpt_media(sculpt_id, run_id?, variant_id?, media_id, role, position, original_or_finished_label)
media_source_observations(media_id, source_id, scan_id, observed_at, upstream_asset_id)
media_rights_events(media_id, claimed_by, evidence, scope, updated_at)

## Launch caveat
Current images reference external sites and have not been batch copied to owned storage. The repository now has a central portrait link for Cassie, but live rendering still needs a browser check. This document defines the eventual production pipeline, not a finished scraper.
