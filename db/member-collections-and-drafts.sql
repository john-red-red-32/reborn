-- Private member collections. Canonical Reborna paths, not seller stock or purchases.
CREATE TABLE IF NOT EXISTS member_saved_items (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 item_type TEXT NOT NULL CHECK(item_type IN ('kit','material','artist')),
 item_path TEXT NOT NULL,
 item_title TEXT NOT NULL,
 item_subtitle TEXT NOT NULL DEFAULT '',
 image_url TEXT,
 saved_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(user_id,item_path),
 CHECK(length(item_path) BETWEEN 6 AND 210),
 CHECK(length(item_title) BETWEEN 1 AND 150),
 CHECK(length(item_subtitle)<=160),
 CHECK(image_url IS NULL OR length(image_url)<=950)
);
CREATE INDEX IF NOT EXISTS member_saved_items_latest ON member_saved_items(user_id,saved_at DESC);
-- Studio and seller workspaces remain private until identity, evidence, moderation
-- and payment rails are ready. Never claim a draft is a live listing.
CREATE TABLE IF NOT EXISTS member_studio_projects (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 2 AND 110),
 notes TEXT NOT NULL DEFAULT '' CHECK(length(notes)<=1800),
 linked_kit_path TEXT,
 stage TEXT NOT NULL DEFAULT 'planning' CHECK(stage IN ('planning','painting','rooting','completed')),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS studio_projects_owner ON member_studio_projects(user_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS member_listing_drafts (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 2 AND 110),
 description TEXT NOT NULL DEFAULT '' CHECK(length(description)<=2500),
 item_kind TEXT NOT NULL CHECK(item_kind IN ('finished_doll','original_kit','materials','other')),
 asking_price_minor INTEGER CHECK(asking_price_minor IS NULL OR (asking_price_minor>=0 AND asking_price_minor<=100000000)),
 currency TEXT NOT NULL DEFAULT 'GBP' CHECK(currency IN ('GBP','USD','EUR')),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS listing_drafts_owner ON member_listing_drafts(user_id,updated_at DESC);
