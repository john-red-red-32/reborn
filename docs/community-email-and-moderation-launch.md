# Reborna membership: verified email, human verification and moderation

## Current integration (14 October 2026)
- Production: Cloudflare Pages on `cloudflare-pages` branch, static Next.js catalogue with live `/api/community/*` Functions.
- Data: dedicated EU D1 `reborna-community`. Preview has a **different** EU D1 database; both have `db/community-schema.sql` and `db/community-moderation-v2.sql` applied.
- Human verification: managed Cloudflare Turnstile widget, with public site key served by `GET /api/community/status` and secret held as a private Pages environment variable. Enforced at **registration, new topic and reply**, with hostname/action checks server-side.
- Automated safety: private Cloudflare Worker `reborna-community-safety` with Workers AI (Llama Guard 3); it has **no workers.dev or preview URL**. Pages accesses it over `COMMUNITY_SAFETY` service binding. No public inference endpoint. Safe results can publish; uncertain/flagged/error results stay held for a human reviewer.
- Human moderation: `/community/moderation/` is an authorised moderator-only queue. Rejections require a category, are logged and place a transactional notification in the queue.
- Transparency: all original eight starter posts are dated as published and credited to **Reborna Editorial**. Do not fabricate backdated community activity, voting, member identities or follower counts. Earlier independently researched material can link to its actual original publication date with a clear source.

## Turn on membership (remaining sender dependency)
Email sending is intentionally **not enabled** until an authenticated sending provider is set up. Current API supports either:

A. **Resend** (recommended if Cloudflare Email Sending is not enabled for the account):
1. In Resend, create a project and verify `reborna.co` (or a dedicated sending subdomain).
2. Add the exact SPF/DKIM DNS records Resend provides in the existing Cloudflare DNS zone. Do not replace existing MX or SPF records without checking for conflicts.
3. Create a restricted sending API key. Add it via Cloudflare Pages project **Settings → Environment variables / Secrets** as `RESEND_API_KEY` (secret).
4. Set `COMMUNITY_MAIL_FROM` to a confirmed sender, e.g. `Reborna <notifications@reborna.co>` (exact address must match a verified sender).
5. Redeploy `cloudflare-pages` to apply secrets, and verify account sign-up, email click, verified session login, expired/reused links, resends and password resets. Never paste API keys into a GitHub commit or this file.

B. **Cloudflare Email Sending** if enabled on Workers Paid: set a verified sending subdomain, attach an `EMAIL` send-email binding to the Pages project, and configure `COMMUNITY_MAIL_FROM`; the API prefers that binding if present.

The API status endpoint reports `registrationOpen: false` until an actual provider is configured, so users will not be offered unusable signups.

## Moderation policy and accounts
- AI flags are advisory. Criticism of Reborna or any commercial product is **not** inherently a violation.
- Human reviewers should reject bullying/harassment, hate, threats, non-consensual private information and spam, or clearly explain a separate guideline violation.
- A rejection creates a queued email notification, sent when provider is available. Failed sends remain visible as `moderation_notifications.state='failed'` for retry; future cron-based retry can be added once email is live.
- To grant the first moderator, **after they have a genuinely registered and verified account**, execute parameterised SQL via Cloudflare D1:
  `INSERT INTO community_moderators(user_id) SELECT id FROM users WHERE email=? AND email_verified_at IS NOT NULL AND is_editorial=0;`
  Use the founder's verified email as the parameter. Never allow a self-selected `sculptor` role to become a moderator automatically.
- New posts/replies are inserted with an accompanying pending moderation record in a single D1 transaction. Readers only see content with no record (legacy editorial starters) or approved state; retries/failures stay in review.
- Security monitoring: rate limits per IP, no raw password or session token storage, verified email required for authenticated operations, HttpOnly Secure SameSite cookies, Turnstile, private D1, separate production and preview, and authenticated moderator-only actions.
- Public launch still needs: delivery tests, moderation decision tests with real verified test accounts, an abuse-handling mailbox, account deletion/export, privacy terms and production browser review. Until then do not advertise open registration.

## Reborna Originals
**Reborna Originals** is the editorial umbrella; **Studio Sessions** is the live video interview/Q&A format. Session schedules, ticket/RSVP status, separately opted-in promotion, guest permissions and recordings are a future enhancement, not yet a bookable live product.
