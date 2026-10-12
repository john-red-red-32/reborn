# Reborna — Cloudflare Pages deployment

This branch is the Cloudflare Pages hosting adapter. **The original app remains on `main` for Vercel fallback.**

- Cloudflare Pages project: `reborna-site`
- Public testing URL: https://reborna-site.pages.dev
- Git production branch: `cloudflare-pages`
- Build command: `npm run build`
- Build output: `out`
- Node version: 22
- Static Next.js export configured in `next.config.mjs`
- Exchange-rate endpoint: `functions/api/exchange-rates.js`
- Protected image upload: `functions/api/admin/media.js`

Cloudflare Pages Functions require `MEDIA_BUCKET` bound to the existing `reborna-media` R2 bucket in production and `MEDIA_INGEST_TOKEN` configured as a Pages secret before uploads will work. They fail closed if the secret is missing. Do not copy tokens into source files. The R2 public domain remains `images.reborna.co`.

## Rolling the latest catalogue to Cloudflare

When making catalogue changes: commit to `main`, then merge or cherry-pick reviewed application changes into `cloudflare-pages` without dropping `next.config.mjs` or restoring Next.js API routes. Vercel's project remains attached to `main`. Only switch `reborna.co` DNS after checking the pages.dev site, artist routes, assets and exchange rates.

A Cloudflare Pages limit prevents new builds, **not** continued serving of the last successful build. No automatic DNS switching on rate limit.

### Rollback

Restore the original DNS for `reborna.co` and `www.reborna.co` to the pre-migration Vercel destinations, once the existing Vercel deployment is verified. Preserve DNS IDs and values in the deployment runbook; do not alter `images.reborna.co`.


## Actual production DNS cutover (2026-10-12)

Cloudflare zone: `reborna.co` / zone ID `4a939b08d39b0b67d68847bd6ce313db`.
Production:
- `reborna.co`: proxied CNAME → `reborna-site.pages.dev` (new DNS record ID `97452a527cfeba34a8850d0111835909`).
- `www.reborna.co`: proxied CNAME → `reborna-site.pages.dev` (DNS record ID `93893ff1883811e3e89fab69ed3e1944`).
- `images.reborna.co`: **untouched** existing proxied CNAME to `public.r2.dev`.

Original Vercel DNS, saved for rollback:
- Apex `reborna.co`: `A 216.198.79.1`, DNS-only (`proxied=false`); prior record ID `7f89d983262440f11cfd68ebb9282a96` has been deleted.
- `www.reborna.co`: `CNAME a0f66cc41cfd6b7b.vercel-dns-017.com`, DNS-only (`proxied=false`); update the existing record rather than creating a duplicate.

**Rollback to Vercel:** Verify the Vercel app still works on its `.vercel.app` URL first. Delete the Cloudflare Pages apex CNAME and create the original Vercel apex A record using a single DNS batch (delete+post). Change the existing www CNAME back to the original Vercel value. Leave `images.reborna.co` intact. Note Cloudflare Pages domain validation may require reactivation if switching back.

**Automatic website updates:** The `main` branch GitHub Action `.github/workflows/sync-cloudflare.yml` mirrors only `app/`, `components/`, `lib/`, `package.json` and `tsconfig.json` into the `cloudflare-pages` hosting branch, then removes Next.js API routes so static export still builds. Scraper-only commits do not use a Cloudflare Pages build. The Cloudflare-specific Functions and `next.config.mjs` stay on the hosting branch.

**Media-upload secret:** The required `MEDIA_INGEST_TOKEN` is not copied from Vercel. Until configured as a Cloudflare Pages production secret, the upload endpoint denies every call. `MEDIA_BUCKET` is already bound to `reborna-media`.

**Validation:** GitHub smoke workflow verifies homepage, Nikki and Cassie artist pages, Mabel/Christopher kit pages, currency endpoint and a rejected unauthorized media-upload call. Run ID `38320763718` additionally checked both custom hostnames returning Nikki's collection.
