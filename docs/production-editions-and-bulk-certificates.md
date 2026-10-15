# Reborna original-sculpt production runs & bulk certificate issuance

**Design and release contract — 15 October 2026.** Read alongside `docs/certificate-code-pilot-20261015.md`.

## What this adds

The free certificate pilot now supports **exact integer quantities from 1 to 5,000 per founder-approved production run**, instead of asking artists to click a 25-code generator repeatedly. The earlier unreviewed `certificate-prepare` / `certificate-issue` endpoints are disabled and respond with 409. Existing certificate lookup, public provenance language and legacy revocation remain supported.

Source-of-truth hierarchy:

- **Private original sculpt**: artist slug, sculpt name, optional original source (can be pre-release), and optionally an *editorially approved* public catalogue kit slug. Self-declared identity never suffices; only independently approved `verified_sculptor_issuers` may create these records.
- **Edition**: named edition and either an explicitly declared limited size (1–50,000) or open production. Never conflate a historical limited-edition promise with the sum of subsequently approved production runs.
- **Production run**: quantity exactly 1–5,000; run number and monotonically increasing certificate serial range (e.g. 1–500, followed by 501–1000). **A new production run is not an automatic second edition**. An artist can instead create a distinct second edition when appropriate.
- **Individual certificate**: independently random, 12-character base32 concealed secret, an issuance hash, serial, verification counters, optional revocation, and a link to its specific run. One code is only proof of issuance through an authorised account, never physical authentication.

An expansion of a limited edition requires an explicit acknowledgement from the sculptor **and a founder review**. The originally declared size is retained permanently alongside any new approved total; public collector lookups show this disclosure instead of silently rewriting history.

## Original identity and source safeguards

Verified sculptors submit new private sculpts before their own website has published a listing. They can later enter a new official source URL or correct spelling. Existing code secrets and production serial ranges must remain unchanged. Changes to issued identity are **review requests** with old and new values in `production_audit`; editors approve or reject.

Reborna's static source-backed kit catalogue, which includes scraper discoveries when accepted into source data, is passed into the private dashboard. Where an accepted kit belongs to the same sculptor, the artist can **propose** a match; the founder reviews matching evidence separately. Only then does the collector lookup display the matching original kit link. No silently merged names, unauthorised photographs or automatic profile transfer. An email notification triggered by individual scraper matches is **not yet implemented**; suggestions update as the catalogue expands.

## Reviewed issuance and defensive design

1. Only one production request may be pending, approved or generating per issuer. The sculptor must affirm that this is a **new physical production run** and not a request to reprint already-issued certificate codes.
2. Founder queue includes original edition promises, new quantity, source URL, and warning if production expands a previously declared maximum.
3. Founder approves/rejects with an audit note. This **does not issue any code**.
4. Sculptor requests an **eight-digit, 10-minute** emailed approval code, bound to the original run ID and approved quantity. Five failed entries invalidate the approval.
5. After email confirmation, a 45-minute browser-memory production session is issued, scoped to artist and run. The code list is **never emailed**, stored in public URLs, or persisted as plaintext.
6. The generator writes **up to 80 codes per request**, using multi-row INSERT statements of **at most 20 rows × 5 bound parameters** (Cloudflare D1 maximum 100 bound parameters/query). Certificate hashes, a fresh 12-byte AES-GCM IV and encrypted CSV chunk are committed together in an atomic D1 batch before progress advances. Concurrent chunk requests cannot mint duplicate serials due to unique constraints and transaction rollback.
7. A suspended artist cannot continue generation; authenticated account/email confirmation alone does not establish original-artist identity.
8. On interruption the user signs in, requests a fresh email approval and resumes the SAME production run at its stored `generated_count`; no second set of codes for completed certificate numbers.
9. When complete, the securely encrypted export is available for **seven days** after the generation ends (unless the artist explicitly clears it sooner). Only authenticated, email-confirmed temporary sessions can decrypt chunks. Download fetches every encrypted fragment, checks row count, and constructs a lightweight UTF-8 CSV in the browser, with certificate number, sculpt, edition, production run and unique concealed code.
10. After checking and backing up the download, the artist confirms the file is safe, and the server deletes the encrypted export fragments and temporary sessions while preserving hashes, issuance metadata and lookup history. Lost completed exports must not be silently replaced by newly issued codes. Expired exports are not retrievable and are purged in the founder maintenance action; until that cleanup, ciphertext can remain encrypted in D1.

## Encryption keys and deployment

- Requires **`CERTIFICATE_EXPORT_KEY`**, 32 cryptographically random bytes encoded with standard base64 and provisioned as a **Cloudflare Pages secret_text** variable. Set separately for preview and production. Do not store this key or derived values in GitHub or D1.
- Do not rotate/delete this key while any downloadable encrypted production chunks exist, or their contents will be unrecoverable. Institute explicit reviewed rotation with re-encryption before any future rotation.
- Never log plaintext certificate codes, session tokens or approval PINs. Email contains only approval code and metadata; completion notification contains no certificate codes.
- Public collector lookups count total/previous checks and indicate issue/revocation/issuer suspension; these are research signals, not proof the physical product is genuine.
- Prices currently **USD $0.00 per code**, potential USD $1.00 per code only after separate paid commerce implementation and disclosures; no billing/checkout is present.
- The 5,000-code maximum is a per-run technical ceiling, not a representation of or endorsement of any real artist's stated edition size.

## Test and release

1. Check the exact production schema `db/certificate-production-v3.sql` in isolated SQLite: constraints, 5,000-code runs, encrypted fields, foreign keys and unique serials.
2. Unit-test private API safeguards, exact quantity and expansion acknowledgements, cryptographic code hashing, AES-GCM encrypted export and recovery, temporary sessions, and exclusion of legacy minting.
3. Apply migration to preview D1, verify tables + zero production records; then production D1, **after CI passes**. Do not inject fictional sculpts or test codes into production.
4. Verify both Cloudflare Pages environments retain Turnstile, Resend and D1 bindings after adding the secret. Deploy code from merged GitHub main using existing workflow.
5. Test public `/verify/`, collector unknown-code safe failure, private `/api/community/production-studio` unauthenticated rejection, `/api/community/production-next` unauthenticated rejection, and live page source without unapproved data. Full end-to-end issuance awaits a real independently reviewed artist; don't invent permissions.
6. Monitor D1 free-tier write allowances and encrypted chunk retention, particularly during first real 5,000-code edition. Avoid starting a new production run to resolve a missing CSV; use approved incident and revocation procedures.

Review risks before commerce-scale rollout: request abuse, 7-day escrow retention policy, encrypted key lifecycle, large edition disclosure standards, anti-counterfeit investigations, successful artist onboarding, revised terms and privacy.
