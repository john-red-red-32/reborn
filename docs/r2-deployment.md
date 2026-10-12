# Reborna R2 operational configuration

Cloudflare bucket: reborna-media. Public delivery: https://images.reborna.co. Source code: lib/r2-server.ts and app/api/admin/media/route.ts.

## Environment configuration
Vercel production and preview require R2_ACCOUNT_ID, R2_BUCKET_NAME, NEXT_PUBLIC_MEDIA_BASE_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, MEDIA_INGEST_TOKEN. All secrets must be supplied through Vercel and never committed. Changes to environment variables require a new deployment.

## Authenticated media ingest
POST /api/admin/media as multipart/form-data with Authorization: Bearer <MEDIA_INGEST_TOKEN>.
Required fields: file (JPEG/PNG/WebP/AVIF, 8 MB maximum), ownerType (artist/sculpt), ownerId (lowercase slug), sourceUrl, sourcePage (HTTPS), credit, rightsApproved=true.
The endpoint validates the supplied MIME and file signature, computes a SHA-256 object key, writes to R2, HEAD-verifies stored size, and returns the key and canonical media URL. The token must only be used by an administrator/collector service; never in the browser. rightsApproved is a protected ingest declaration and is not legal proof of licence: persist underlying permission evidence in the real database before automated publication.

## Verification checklist
- Vercel deployment is READY and environment variables are present for the target.
- Unauthenticated POST returns 401 without touching R2.
- Use a specifically licensed test photograph with the private token and verify 201 response.
- GET returned image URL returns expected bytes, correct content type and HTTPS; check browser rendering.
- Verify file does not duplicate on repeat ingestion and that provenance is recoverable.
- Delete test images where appropriate.
No scraped artist photographs are to be bulk mirrored until rights/provenance procedures and review controls are in place.

## Scraper next
Implement source registry, durable artist and sculpt identity, scheduled source snapshots, metadata and media candidate collection, duplicate detection and review queue; then run controlled pilots before enabling bulk imports.
