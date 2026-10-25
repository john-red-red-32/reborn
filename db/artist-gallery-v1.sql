-- Artist galleries and original artwork submissions; no checkout or auctions are enabled.
-- Every public profile and artwork requires human moderation. Existing editorial sculptor pages remain independent.
CREATE TABLE IF NOT EXISTS artist_galleries (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
 headline TEXT NOT NULL DEFAULT '' CHECK(length(headline)<=160),
 story TEXT NOT NULL DEFAULT '' CHECK(length(story)<=1800),
 cover_image_id TEXT,
 state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','pending','approved','rejected','hidden')),
 reviewed_by TEXT REFERENCES users(id),
 reviewed_at TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS artist_galleries_public ON artist_galleries(state,slug);
CREATE TABLE IF NOT EXISTS gallery_works (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 2 AND 110),
 description TEXT NOT NULL DEFAULT '' CHECK(length(description)<=3000),
 kind TEXT NOT NULL CHECK(kind IN ('finished_doll','original_kit')),
 original_sculpt TEXT NOT NULL DEFAULT '' CHECK(length(original_sculpt)<=120),
 original_sculptor TEXT NOT NULL DEFAULT '' CHECK(length(original_sculptor)<=120),
 materials TEXT NOT NULL DEFAULT '' CHECK(length(materials)<=140),
 provenance_note TEXT NOT NULL DEFAULT '' CHECK(length(provenance_note)<=600),
 display_status TEXT NOT NULL DEFAULT 'gallery' CHECK(display_status IN ('gallery','available','sold')),
 sale_format TEXT NOT NULL DEFAULT 'fixed' CHECK(sale_format IN ('fixed','auction')),
 asking_price_minor INTEGER CHECK(asking_price_minor IS NULL OR asking_price_minor BETWEEN 0 AND 100000000),
 currency TEXT NOT NULL DEFAULT 'GBP' CHECK(currency IN ('GBP','EUR','USD')),
 state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','pending','approved','rejected','hidden')),
 reviewed_by TEXT REFERENCES users(id),
 reviewed_at TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS gallery_works_public ON gallery_works(state,display_status,created_at DESC);
CREATE INDEX IF NOT EXISTS gallery_works_owner ON gallery_works(user_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS gallery_images (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 work_id TEXT REFERENCES gallery_works(id) ON DELETE CASCADE,
 object_key TEXT NOT NULL UNIQUE,
 mime_type TEXT NOT NULL CHECK(mime_type IN ('image/jpeg','image/webp','image/png')),
 bytes INTEGER NOT NULL CHECK(bytes BETWEEN 1 AND 1500000),
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS gallery_images_work ON gallery_images(work_id,sort_order);
CREATE TABLE IF NOT EXISTS gallery_review_log (
 id TEXT PRIMARY KEY,
 content_type TEXT NOT NULL CHECK(content_type IN ('profile','work')),
 content_id TEXT NOT NULL,
 actor_id TEXT NOT NULL REFERENCES users(id),
 old_state TEXT NOT NULL,
 new_state TEXT NOT NULL,
 note TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS gallery_review_log_content ON gallery_review_log(content_type,content_id,created_at);
