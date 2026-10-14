-- One-time migration for the D1 tables created during the initial development phase.
-- Preserves existing saved items and adds honest source-backed historical sculpt references.
CREATE TABLE member_saved_items_extended (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 item_type TEXT NOT NULL CHECK(item_type IN ('kit','material','artist','archive')),
 item_path TEXT NOT NULL,
 item_title TEXT NOT NULL,
 item_subtitle TEXT NOT NULL DEFAULT '',
 collection_status TEXT NOT NULL DEFAULT 'wishlist' CHECK(collection_status IN ('wishlist','owned')),
 image_url TEXT,
 saved_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(user_id,item_path),
 CHECK(length(item_path) BETWEEN 6 AND 210),
 CHECK(length(item_title) BETWEEN 1 AND 150),
 CHECK(length(item_subtitle)<=160),
 CHECK(image_url IS NULL OR length(image_url)<=950)
);
INSERT INTO member_saved_items_extended(user_id,item_type,item_path,item_title,item_subtitle,collection_status,image_url,saved_at)
 SELECT user_id,item_type,item_path,item_title,item_subtitle,collection_status,image_url,saved_at FROM member_saved_items;
DROP TABLE member_saved_items;
ALTER TABLE member_saved_items_extended RENAME TO member_saved_items;
CREATE INDEX IF NOT EXISTS member_saved_items_latest ON member_saved_items(user_id,saved_at DESC);
