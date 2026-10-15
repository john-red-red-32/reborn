-- Reborna sculptor request intake v1 (15 October 2026)
-- Private, review-only requests. No claim or submitted kit publishes automatically.
-- Apply to production and isolated preview D1 before deploying API changes.

ALTER TABLE contact_enquiries ADD COLUMN website_url TEXT;
ALTER TABLE contact_enquiries ADD COLUMN social_url TEXT;
ALTER TABLE contact_enquiries ADD COLUMN artist_intent TEXT;

CREATE TABLE IF NOT EXISTS sculptor_requests (
 id TEXT PRIMARY KEY,
 member_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('claim_profile','submit_sculpt')),
 artist_name TEXT NOT NULL,
 existing_artist_slug TEXT,
 sculpt_name TEXT,
 source_url TEXT,
 website_url TEXT,
 social_url TEXT,
 details TEXT NOT NULL DEFAULT '',
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','reviewing','needs_info','closed')),
 moderator_note TEXT,
 reviewed_by TEXT REFERENCES users(id),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS sculptor_requests_member ON sculptor_requests(member_id,created_at DESC);
CREATE INDEX IF NOT EXISTS sculptor_requests_state ON sculptor_requests(state,created_at DESC);
CREATE TABLE IF NOT EXISTS sculptor_request_audit (
 id TEXT PRIMARY KEY,
 request_id TEXT NOT NULL REFERENCES sculptor_requests(id) ON DELETE CASCADE,
 moderator_id TEXT NOT NULL REFERENCES users(id),
 old_state TEXT NOT NULL,
 new_state TEXT NOT NULL,
 note TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS sculptor_request_audit_request ON sculptor_request_audit(request_id,created_at DESC);
