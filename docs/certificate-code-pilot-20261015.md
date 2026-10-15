# Reborna certificate-code registry — free pilot, 15 October 2026

## What the service means

A Reborna code associates an individual certificate identifier with a batch created by an **independently authorised original sculptor** account. It is not an authentication service for physical kits, seller inventories, completed reborns, vinyl composition, intellectual-property ownership, or a particular retailer's stock. A legitimate code or certificate can be copied and attached to a counterfeit physical item.

**Initial price:** USD $0.00 per code. **Potential future price:** USD $1.00 per code, only after separately implementing paid billing, consumer notices, invoices, refunds, and pricing change communication. Each batch freezes its actual `price_per_code_minor` (0 in the pilot); no billing API exists.

## Issuer onboarding and approvals

1. A sculptor registers, verifies their email and selects the *self-described* Original sculptor role. This alone never grants issuer authority.
2. They submit a private claim for an existing Reborna artist profile, with website/social evidence, using `/dashboard/?area=sculptors`. A claim to an artist not yet in our catalogue needs ordinary editorial inclusion first.
3. A founder moderator researches the sculptor's established official site and verifies that **the original artist actually controls the claimant account**, ideally by communicating through an already independently established official channel.
4. The moderator closes the profile review and uses the dedicated certificate approval panel; it requires an official source URL, a review note of at least 50 characters and an explicit attestation. Approval is permanently logged. The source data and member request are untrusted until checked; social handles are not identity proof.
5. The grant is separate from profile ownership and from publishing new sculpt records. One verified issuer per artist slug in this pilot. Reassignment is intentionally unsupported, requiring a future documented transfer/appeal policy.
6. A moderator can suspend an entire issuer, affecting future issuance and displaying a public caution on all existing codes. A suspended issuer cannot produce more codes.

No original sculptor has been pre-approved just because their catalogue profile exists. Email step-up protects against a stolen active Reborna session when the legitimate sculptor's email account is still secure. It is not sufficient if the attacker also controls the email inbox.

## Code generation and use

- `RB-` followed by **12 cryptographically random base32 characters**, in three groups of 4 (60 bits). No dates, edition counts or public sequence in the secret.
- Example **format only** (not a real certificate): `XXXX-XXXX-XXXX`.
- A verified issuer enters the sculpt name, its official source URL, optional edition note and batch count (1–25). They must explicitly confirm that this is NOT a reprint of codes already issued for the same production run, with one completed real issuance per rolling 24 hours and strict email approval for each request.
- A short-lived, eight-digit **approval code is emailed to the verified artist's account**, and is valid for 10 minutes and only for the exact prepared order. Five unsuccessful attempts or one successful use ends its validity. The email contains NO certificate secrets. After approval, original certificate code plaintext is **returned once via the signed-in HTTPS dashboard**, immediately downloadable as CSV. Only `SHA-256('certificate-v1:'+code)` and a non-sensitive last-four hint are stored. If a CSV is lost, no full code recovery is possible; contact the team to revoke an affected batch and reissue if appropriate.
- Use tamper-evident peel-away labels, individual scratch-off stickers, private paper certificates or equivalent concealed distribution. Do **not** print the full code visibly on an online listing or place codes in QR URLs, query parameters, analytics, public image filenames, chat or social posts.
- The public lookup page at `https://reborna.co/verify/` accepts the code via **POST**, not as a URL parameter. It returns the issuing artist, sculpture, source, issuance date, prior-check history and any revocation/suspension warning. Buyer identifiers, locations and IPs are not saved in the certificate check event table. General Cloudflare security/rate-limit logs are separate and governed by their own retention.
- A high number of checks may flag possible reuse but is *not proof* of counterfeit activity, and no automated accusations or bans occur. Artists can revoke individual code records with a mandatory reason; the code hash and history remain recorded.
- Automated API tests assert no unverified issuer access, no raw-code persistence, correct revoked/suspended statuses, and code lookup throttling. Cloudflare Pages static-export build and D1 schema tests cover the deployment.

## Failure modes and product limitations

- Copies of real certificates can pass a code check. Buyers still need to verify seller authorization, physical production features, edition provenance and the artist's own original sources.
- Code checks increase the visible count, including the sculptor testing the code, so there is no fixed 'one valid scan only' semantics. Counts do not represent distinct people or distinct genuine dolls.
- Lookup history is non-identifying. This protects collectors' privacy but means the service **cannot currently compare geographic locations** or establish that multiple people, rather than one person, checked the same certificate.
- Without a fully reviewed artist claim, issuance is disabled. Marketplace payments, guarantees, public artist profile management, in-platform fulfilment and an artist royalty service do not exist.
- The current 25-code pilot is NOT an edition-size bulk generation service; later implementation must manage approved arbitrary production runs and secure resumable exports for 500–5,000 codes. Reprinting previously issued certificates must reuse the SAME codes; new codes increase the number of usable certificates, they do not restore lost CSVs.
- Free pilot quotas and simple IP-based throttling reduce abuse but do not replace dedicated anti-fraud controls or an incident response plan as issuance volume increases.
- Certificate data and issuance audit trails should be protected, backed up and subject to documented retention and dispute-resolution policies before promoting wide adoption. Avoid promising permanent archival availability without operations in place.

## Deployment / incident checklist

1. Validate the isolated migration and unit tests in the `verify-seo-launch` PR checks.
2. Apply `db/certificate-verification-v1.sql` (if absent) and the additive `db/certificate-email-approval-v2.sql` to the isolated preview D1 `251e8382-4a23-4e71-8ee8-2643eca33414`, then production D1 `26d5fd8a-4400-4801-9981-9569725590a7`, verifying all six certificate tables and zero rows in the issuer, code and email-challenge tables before testing. These are additive `CREATE TABLE IF NOT EXISTS` changes.
3. Merge to `main`, let the existing `cloudflare-pages` sync and Cloudflare production deployment complete.
4. Verify the public static `/verify/` page, the secured `/api/community/certificate-lookup` POST (unknown test code returns no record), unauthenticated studio API denial, and initial absence of pre-authorised issuers.
5. Test real issuance only **after** a legitimate sculptor has consented, completed the evidence workflow and received an explicit editorial approval. Use their own original work; do not mint fake official certificates.
6. On suspected copied codes: preserve issuer and lookup history, contact the original artist, document evidence, revoke affected individual codes or suspend issuer only with appropriate checks. Do not publicly accuse an individual buyer based solely on repeated lookups.

Cloudflare D1 batch transactions are documented as atomic; multi-statement batch issuance should not leave partial codes if one insertion fails: https://developers.cloudflare.com/d1/worker-api/d1-database/
