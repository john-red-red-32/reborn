# Reborna member workspace and future marketplace — 14 October 2026

## Released in this phase (after successful Cloudflare deployment)
- A shared account-linked saved-items list for original kit pages, named artist catalogues, individual material pages, real kit directory, Discover feed and archive records.
- Heart controls have desktop tooltips, keyboard accessible labels and press state. Guests can save items on their browser; on login up to 100 existing browser favourites are imported into the authenticated private list, without inventing community activity.
- Member can distinguish **Wishlist** from **My collection** (self-reported ownership, not a purchase history). Artist hearts represent *following* an original artist, not owning one.
- `/dashboard/` contains genuine collection browsing and private **My studio** project notes, plus private editable **selling drafts**, messaging and community shortcuts, and an honest empty purchases view.
- Private data is owner-scoped in D1. There is no public listing feed, buyer checkout, order record, payment provider, public studio portfolio, livestream or payout function at this stage.
- All `/artists/{slug}/?sculpt=archive-{name}` links point back to source-attributed artist archives. They **do not** create implied product stock or full kit pages.
- Cross-browser saved-item sync and studio/seller draft persistence should be tested manually through a genuine account as final end-to-end QA.

## Marketplace launch requirements — not yet implemented
1. Decide permissible seller categories (finished dolls, authentic blank original kits, selected supplies); definitions, authenticity rules and item-condition standards. Counterfeit sculpt copies are forbidden. Clearly separate sculptor IP, authorized manufactured kits and finished reborn art.
2. Develop seller onboarding: identity checks/age/eligible territory, payment and payout verification, business disclosures, anti-fraud safeguards, and privacy notice. Self-described sculptor badges must never be represented as verified identity.
3. Implement listing publication flow with image metadata stripping and image safety, ownership/rights declarations, sculptor credit, documentation of original sources, moderation, takedown and appeal, and auditable listing revisions.
4. Choose payment provider and merchant-of-record responsibility. Confirm platform commissions, fees, VAT/sales tax treatment, chargebacks, escrow/payment release, refunds, return policies, disputes and consumer-law duties **before** checkout launches.
5. Build orders, payment events, delivery status, disputes and notifications from authoritative provider webhooks. Never fabricate orders or infer an external retailer purchase occurred within Reborna.
6. Build opt-in saved-release notifications and privacy-first follow alerts only after actual verified release availability exists.

## Next product and UI iteration
- Add public artist studio galleries for completed work **after** moderation and copyright/photo release design.
- Add a clear dashboard home tuned to member-selected interests, notifications from followed sculptors, and collections of genuine public artwork.
- Integrate member listing photos and shipping/pricing details only with secure storage, anti-fraud and content review.
- Scale save catalogue hydration toward canonical server-side item identities rather than supplied display snapshots and include automated dead-link checks.
