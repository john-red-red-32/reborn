# Reborna: founder launch-readiness checklist (14 October 2026)

**Status:** Quiet, public-access testing. Not yet ready for a formal Google/Instagram promotion. This document is private project planning, not a published legal promise.

## Confirmed live
- Cloudflare Pages serving `reborna.co` with Next.js static site and dynamic community Pages Functions.
- First genuine member registered, email verification working according to founder's test.
- Forum, private member messaging, saved wishlist, profiles, short bios, profile photos, private studio projects and future-listing drafts built. **No public marketplace or payments**.
- Cloudflare Turnstile and private AI-assisted screening of posts/replies; flagged/uncertain posts are held for review.
- Independent editorial starter forum posts credited to Reborna, not fabricated users.
- Cloudflare Email Routing from `hello@reborna.co` to administrative inbox confirmed working.
- Site's root `app/layout.tsx` currently declares `robots: {index:false,follow:false}`; this intentionally prevents expected organic Google indexing pending approval.

## Must complete before public promotion

### 1. Identify the legal operator and display legally required details — BLOCKER
- [ ] Confirm whether Reborna is operated by a registered Ltd, sole trader, or another specific legal person. Do **not** assume an unrelated existing clinic or SaaS company owns Reborna.
- [ ] Confirm registered number, registered jurisdiction and registered office if a UK company. GOV.UK generally requires these details on the company's website. Do not publish the founder's residential address or pretend a private home is an appropriate public mailing address without an explicit informed decision.
- [ ] Complete and approve Terms of Use, Privacy Policy and Cookie & Storage Notice from `docs/legal-drafts/`, replacing every unresolved field. Have a qualified UK solicitor/privacy adviser review appropriate provisions.
- [ ] Create `/terms/`, `/privacy/` and `/cookies/` using the approved content and add footer links. Link registration to the Terms, Community Guidelines and Privacy Policy **before** members submit data.
- [ ] Record acceptance of terms version as needed; do not treat marketing opt-in as consent to all privacy processing.

### 2. Community safety and Online Safety Act assessment — BLOCKER
- [ ] Use [Ofcom's Regulation Checker](https://www.ofcom.org.uk/os-toolkit/regulation-checker/regulation-checker). Reborna has user-created forum posts and private messaging, so do not assume an exemption designed for provider-only comment sections.
- [ ] Conduct and record an illegal-content risk assessment where in scope; assess feature change impact of public profiles, DMs, listings and image uploads.
- [ ] Carry out a children-access assessment and determine a proportionate age/safeguarding policy. The current signup form has **no effective age-gate**; stating adults-only in a policy alone does not resolve access.
- [ ] Assign a named accountable person, establish reporting and complaints routes, and write a reasonable response and escalation procedure for urgent illegal content, scams, impersonation, abuse and counterfeit allegations.
- [ ] Appoint a genuinely verified first moderator in `community_moderators` after confirming their account ID. **Audit found 0 moderator accounts on 14 October 2026**. Founder's membership alone does not grant moderator permissions.
- [ ] Test safe and flagged post moderation and DM abuse reports with real controlled member accounts; verify holding/rejecting, creator notification, appeal and moderator queue in production.
- [ ] Check requirements from the Ofcom illegal content code updated in September 2026, not just older 2025 practices.

### 3. Privacy rights, retention and secure operations — BLOCKER
- [ ] Identify exact personal-data flows from members, Cloudflare, Resend, third-party imagery and optional AI screening. Review processors, contracts, international transfers and transfer safeguards.
- [ ] Implement an operational way to fulfil data exports and account deletion/erasure on request, respecting possible legal record retention and third-party backups; **self-service deletion/export are not currently built**.
- [ ] Confirm a retention schedule for forum/DM messages, unverified registrations, account records, queued notifications, contacts, anti-abuse records, account photos, incident logs and backups. Do not print made-up retention periods.
- [ ] Provide a trackable data-protection complaint process. The UK 2026 rule requires acknowledging privacy complaints within 30 days.
- [ ] Audit cookies, local storage, external scripts/images and Cloudflare Turnstile. If non-exempt tracking appears, implement opt-in consent before it runs. Avoid needless cookie banners for essential functions.
- [ ] Confirm marketing email is unchecked by default and voluntary, separately documented, and only sent after consent when required.

### 4. Real-world end-to-end reliability — BLOCKER
- [ ] A signed-in member can save a sculpt, refresh, and see it in My collection on a second device; check guest favourite migration.
- [ ] Test signup, login, verify, resend, forgotten password and signout on desktop and mobile.
- [ ] Test contact form delivery, spam prevention, failed-email queues and resending operational alerts.
- [ ] Test private profile preferences, photo removal, cross-account authorization, DM privacy and moderation reports.
- [ ] Confirm outbound merchant links and artist attribution on sample listings; remove illustrative publication/stock claims or label them accurately.
- [ ] Check cross-device usability/accessibility, photo cropping, small-heart tap areas, essential keyboard flows, descriptive tooltips and any form validation.

### 5. Official discovery / SEO launch
- [ ] Review page metadata, canonical tags, public sitemap, robots.txt, legitimate catalogue source attribution and dynamic routes.
- [ ] Remove site-wide `noindex` only **after** the critical legal, privacy and safety checks are signed off. Keep account/dashboard/message/private moderator pages unindexed.
- [ ] Make the first legitimate announcement and create organic artist/supplier outreach. No artificial followers, backdated posts or fake participation.
- [ ] Monitor privacy/safety inbox, moderation queue, application errors and email delivery during first launch days.

## Post-launch roadmap (not launch blockers until those features turn on)
- Seller identity verification and payout onboarding; marketplace rules, pricing, commissions, VAT/tax, chargebacks, returns, genuine buyer protection and payment webhooks.
- Original photography and listing-rights declarations, anti-counterfeit notice/takedown review, listing moderation and copyright disputes.
- Hosted Reborna Originals and Studio Sessions events, specific opt-in notification and booking terms.
- Improvements to automated retention/retry jobs and anti-spam rate controls.

## Sources reviewed
- ICO privacy notice checklist: https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-self-assessment-medium-businesses/what-information-you-must-supply-under-the-gdpr/
- ICO cookies/storage rules: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/
- ICO June 2026 complaints duty: https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/06/new-data-protection-complaints-law-now-in-force/
- GOV.UK limited company disclosures: https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material
- Ofcom illegal content duties: https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/illegal-content-duties-under-the-online-safety-act
- Ofcom children access duties: https://www.ofcom.org.uk/online-safety/protecting-children/protection-of-children-duties-under-the-online-safety-act
