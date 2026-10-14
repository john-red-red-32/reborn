-- Private member avatar storage; intentionally compact and within existing EU D1.
-- Each verified member can replace or delete one small raster image. No SVG or remote fetches.
CREATE TABLE IF NOT EXISTS profile_avatars (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 mime_type TEXT NOT NULL CHECK (mime_type IN ('image/webp','image/jpeg')),
 image_base64 TEXT NOT NULL CHECK (length(image_base64) <= 110000),
 version INTEGER NOT NULL DEFAULT 1 CHECK(version >= 1),
 uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);
