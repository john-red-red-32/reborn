# DRAFT — Reborna Cookies & On-Device Storage Notice

**NOT APPROVED FOR PUBLICATION.** Created 14 October 2026. This inventory was traced from Reborna's current application source. Complete a live browser/network audit before making claims that all cookies/embedded images have been identified.

**Effective date:** [DATE ON PUBLICATION]  
**Contact:** hello@reborna.co  
**Operator:** [EXACT LEGAL OPERATOR TO CONFIRM]

## What are cookies and similar technologies?

Cookies are small values stored by your browser and sometimes sent back to a website. Local storage and session storage can save settings or temporary choices directly on your device. Some third parties also use security-related browser technologies.

Reborna currently uses these features to provide signed-in accounts, anti-abuse protection, preferences and guest wishlists. We don't currently have evidence of a Reborna-operated advertising cookie or behavioural advertising pixel, but **this must be checked with a real browser audit, including third-party images and scripts, before launch**.

## Storage we have identified in our application

| Name or technology | Where | Why we use it | Typical duration |
|---|---|---|---|
| `rb_session` | Reborna cookie, set when you sign in | Keeps your account securely signed in. Uses Secure, HttpOnly and SameSite=Lax flags. | Up to **30 days** per login; cleared on logout |
| `reborna-wishlist-v1` | Browser local storage | Holds saved favourites when you're not signed in and preserves unsynced items if cloud sync is unavailable | Until you remove it or clear browser data |
| `reborna-saved-original-kits` | Older browser local-storage key | Transfers earlier version guest sculpt favourites into the unified collection | Removed when imported into the current local-storage key |
| `reborna-wishlist-first-save-invited-v1` | Browser session storage | Remembers that the free-account invitation has already appeared in the current browser tab/session | Normally until the session/tab closes |
| `reborn-currency` | Browser local storage | Remembers the currency you chose to display in the catalogue | Until you change it or clear browser data |
| Cloudflare Turnstile/browser challenge data | Cloudflare security challenge on certain forms | Checks whether an action is likely to be human and protects against spam and automated abuse | Controlled by Cloudflare's security technology and relevant configuration; verify exact cookies during final audit |

Cloudflare may also use infrastructure security and bot-mitigation cookies outside the explicit `rb_session` account cookie. See [Cloudflare's Turnstile Privacy Addendum](https://www.cloudflare.com/turnstile-privacy-policy/).

## Your choices

You can use the public catalogues without signing in. If you click a heart while signed out, the favourite is stored in your browser. Joining and signing in to a free Reborna account transfers compatible favourites into your account so they can be accessible on other devices.

You can clear saved guest favourites and currency settings through your browser's storage controls; doing so may remove guest-only favourites. You can sign out to clear the Reborna session cookie. Restricting essential login or security functions may prevent accounts, forms and safety features from working correctly.

**We must obtain valid consent before activating non-exempt analytics, advertising or similar tracking technologies, if introduced.** Our essential security/account features do not imply permission for unrelated marketing tracking.

## Changes to this notice

We will revisit this inventory whenever Reborna introduces a new tool, embedding, event ticketing, marketplace payments, analytics or marketing functionality. If a change requires a choice or consent, we will offer that control before non-essential storage is used.

## Before approval

- Test browser storage and Network panels on a fresh incognito session with guest browsing, registration, account login, contact submission and Turnstile.
- Check whether externally loaded imagery, scripts or other embedded services set additional cookies, and whether any are non-essential.
- If any non-exempt storage/technology is present, design and verify a genuinely optional consent/withdrawal control. Do **not** install a blanket consent banner unless needed; banners cannot substitute for actual prior consent.
- Confirm cookie durations and Cloudflare's deployed Turnstile mode rather than inferring them from documentation.

## References for legal review (not part of public notice)

- ICO cookie guidance: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/
- Cloudflare Turnstile privacy: https://www.cloudflare.com/turnstile-privacy-policy/
