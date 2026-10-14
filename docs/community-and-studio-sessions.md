# Reborna — community and commerce architecture (14 October 2026)

## Guiding principle
Reborna is one account for discovering, discussing, collecting, making and (later) selling. A member may simultaneously be a collector, reborn artist, original sculptor and materials supplier. Self-selected roles personalise content; they **never** establish identity, licence, artwork ownership or manufacturing authorisation.

The independent catalogue remains static (Next.js on Cloudflare Pages) for speed. Cloudflare Pages Functions handle user-generated content with a separately isolated EU D1 database `reborna-community`, bound as `COMMUNITY_DB`. Existing catalogue/research databases, image provenance records and source URLs remain intact.

## Database (db/community-schema.sql)
- `users`: email, unique handle, display name, password verifier and privacy/consent toggles. No password or session token is stored in plaintext. The editorial account is explicitly labelled and cannot sign in as a real member.
- `user_roles` and `user_interests`: multi-select profile dimensions. Buyers of rare completed dolls can select `high_end_dolls`, sculptors `sculptor`, painters `reborn_artist`. Interest selections are private and can change.
- `email_tokens`, `sessions`, `rate_limits`: short-lived single-use confirmation/reset tokens, HttpOnly Secure SameSite cookies and request limits. No marketing emails unless expressly opted in.
- `posts`, `replies`, `votes`, `post_products`, `reports`: discussions, genuine authenticated engagement, moderation reports and stable references to exact catalogue routes.
- `conversations`, `conversation_members`, `messages`: private two-way messaging with access checks. No public member email addresses.
- Text-only community at launch. User image uploads should come later after moderation, abuse protection, upload limits and safe R2 processing are ready.

## Pages and API
- `/community/` topic index; `/community/discussion/?id=...` discussion and replies; `/community/new/` publish with product picker.
- `/account/` email signup/login, self-description, interests and privacy settings. Registration stays closed unless both `RESEND_API_KEY` and `COMMUNITY_MAIL_FROM` are securely configured.
- `/messages/` private conversations; `/community/member/?handle=...` limited public profile.
- Exact product pages show associated discussions. This is an independent conversation, not an endorsement, authentication certificate or verified product review.
- `functions/api/community/[[path]].js` is the Pages Functions API. The production deployment branch must carry this directory; `sync-cloudflare.yml` intentionally copies it from `main`.

## Trust and community launch
The eight pinned/unpinned starter topics are published under **Reborna Editorial**. They are not attributed to fake people and have no fake replies or votes. Reborna can invite actual artists to answer real questions and transparently highlight editorial explainers. Reports go into a moderation queue; adding a staffed moderation dashboard and email support address should precede broad promotion.

Do not claim the platform verifies artist identity just because the user ticks “original sculptor.” Only a future separately reviewed trust workflow may issue artist certificate codes. A future listing creation workflow must require a seller to accept listing-specific buyer contact, even if unsolicited community messages are disabled. Do not silently override profile-level privacy on ordinary forum accounts.

## Later: marketplace (no transactions currently hosted)
Keep separate entities for `seller_accounts`, `seller_verifications`, `listings`, `listings_images`, `offers`, `auctions`, `bids`, `orders`, `payments`, `fulfilments`, `refunds`, `disputes` and `commissions`. Link to the member ID but separate payment KYC, roles and seller approval. Finished dolls, original blank kits and specialist materials require different listing types. For commission split / multi-supplier checkout, use a regulated marketplace payment service such as Stripe Connect, explicit contracts and vendor fulfilment agreements; never collect payment under false claims of seller status or assume Shopify/Wix supports inventory/payment delegation without supplier authorisation.

## Later: Reborna Studio Sessions — editorial livestreams
**Not shipping with the first forum release.** This should become a powerful reason for collectors and artists to return.

Proposed future D1 tables:
- `studio_sessions`: title, description, guest artist ID, start/end with timezone, cover photo rights, streaming provider and embed URL, publish state, capacity, public/private status.
- `studio_session_kits`: links to exact sculpt/kit records.
- `studio_rsvps`: session ID + member ID or separate email record with confirmation status, preferred notification status and timestamps. Avoid exposing RSVP lists.
- `studio_questions`: submitted member questions and guest responses; moderation status.
- `studio_recordings`: replay URL, release time, attribution, source/usage rights.

Launch version: embedded third-party livestream, scheduled editorial landing page, opt-in RSVP and session-only reminders with easy cancellation; optionally a separate unchecked promotional-email consent. Show archive recordings on sculptor and kit pages with source permission. No need to run our own video streaming servers, invent viewership or fake live chats. Confirm guest participation and rights before publishing dates. Aim for occasional carefully produced sessions with recognised sculptors, not a crowded calendar of unconfirmed events.

## Before opening public signups
1. Configure authenticated transactional email domain, `RESEND_API_KEY` and `COMMUNITY_MAIL_FROM` in Cloudflare Pages Functions secrets, and test verification + reset in production without sharing passwords.
2. Review moderation operations (reports, suspension, block, delete, spam), retention, privacy policy, data deletion, UK GDPR and email consent records before significant public recruitment.
3. End-to-end browser test of account, verified login, forum, reply, votes, reports, messages and linked products. Use genuine test accounts; remove them afterwards.
4. Only after checks pass, promote signups and announce the launch.
