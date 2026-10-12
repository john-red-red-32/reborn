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
