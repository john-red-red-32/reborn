# Artist gallery enrichment and identity rules

## Live artist enrichment (Cassie pilot)

The public Cassie collection now combines the editorial archive list with a dated source-evidence file `lib/artist-gallery-data.ts`. Source: official `https://www.cassielove.co.uk/vinyl-doll-kits` captured 2026-10-12.

- 50 artist-authored gallery cards, each with source name, image reference, size and edition text.
- 48 exact name matches in the existing editorial archive are eligible for display of **size and edition label only**.
- `Romily` / `Romilly` and `Sienna Rae` / `Sienna` remain unresolved. Do not treat approximate matches as established identities.
- 13 previously accepted archive names were not present in this specific gallery. Keep them; absence is not deletion or proof of sell-out.
- 95 clay photographs are source evidence, not all named kits; 243 photos of finished reborn dolls must remain out of original kit photos.
- Historical `Limited Edition` only indicates edition category. It does not establish edition quantity, numbered certificates, re-release or stock. No first-seen date is a release date.
- Image URLs are stored as evidence, not approval to mirror, display or redistribute. Do not automatically add new unlicensed photos to published cards.

## Reusable matching for future artists

A future artist may be registered by adding a manifest under `config/artist-sources/<artist-slug>.json` with fields:
```json
{
  "version": 1,
  "artist_id": "another-sculptor",
  "allowed_hosts": ["www.example.com"],
  "accepted_names": ["Sculpt A", "Sculpt B"],
  "approved_aliases": {}
}
```
The name list should derive from separately reviewed artist source records, with stable IDs added as the relational catalogue is implemented. `approved_aliases` maps source name to canonical name **only after human review**.

`scripts/match_artist_catalogue.py` resolves only exact case/punctuation matches or explicit approved aliases for the same artist. Similar names and aliases remain review candidates. Host must match the registered manifest; unknown sites produce an unregistered report rather than attaching records to the wrong sculptor.

GitHub Actions tests those rules, produces `artist-identity-matches.json` and keeps the resulting reports versioned in `scrape-results`. The TypeScript application applies the same no-unapproved-alias policy through `lib/artist-catalogue.ts`.

## Next gates

Review the two Cassie spelling/extended-name cases with artist-authored supporting references. Build a rights-approved media flow for curated original kit images. Add one more artist with a different platform and their own manifest to test cross-platform matching. Replace the static evidence map with relational artist/sculpt/run/variant and observation tables after the pilot.
