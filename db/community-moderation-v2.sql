-- Reborna community moderation v2. Apply once after db/community-schema.sql.
-- Editorial seed posts remain visible; authenticated new content is pending until reviewed by Workers AI.
CREATE TABLE IF NOT EXISTS content_moderation(
 content_type TEXT NOT NULL CHECK(content_type IN ('post','reply')),
 content_id TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','approved','needs_review','rejected')),
 reason_code TEXT CHECK(reason_code IN ('harassment','hate','threats','spam','privacy','other')),
 reason_text TEXT,
 reviewed_by TEXT REFERENCES users(id),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(content_type,content_id)
);
CREATE INDEX IF NOT EXISTS content_moderation_state ON content_moderation(state,created_at);
CREATE TABLE IF NOT EXISTS community_moderators(
 user_id TEXT NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 added_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS moderation_audit(
 id TEXT PRIMARY KEY,
 reviewer_id TEXT NOT NULL REFERENCES users(id),
 content_type TEXT NOT NULL CHECK(content_type IN ('post','reply')),
 content_id TEXT NOT NULL,
 action TEXT NOT NULL CHECK(action IN ('approved','rejected','needs_review')),
 reason_code TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS moderation_notifications(
 id TEXT PRIMARY KEY,
 content_type TEXT NOT NULL,
 content_id TEXT NOT NULL,
 member_id TEXT NOT NULL REFERENCES users(id),
 subject TEXT NOT NULL,
 body TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'queued' CHECK(state IN ('queued','sent','failed')),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 sent_at TEXT
);
