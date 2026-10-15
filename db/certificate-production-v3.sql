-- Reborna original-sculpt production and edition programme · 15 October 2026.
-- Additive. Does not modify existing certificate issuance or member records.
-- Sensitive codes exist only as SHA-256 hashes and temporarily AES-256-GCM encrypted
-- downloadable CSV fragments (with the encryption key stored OUTSIDE D1).
CREATE TABLE IF NOT EXISTS production_sculpts (
 id TEXT PRIMARY KEY,
 issuer_user_id TEXT NOT NULL REFERENCES users(id),
 artist_slug TEXT NOT NULL,
 sculpt_name TEXT NOT NULL,
 official_url TEXT,
 catalogue_kit_slug TEXT,
 catalogue_link_status TEXT NOT NULL DEFAULT 'unlinked'
   CHECK(catalogue_link_status IN ('unlinked','suggested','linked')),
 proposed_kit_slug TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(issuer_user_id,artist_slug) REFERENCES verified_sculptor_issuers(user_id,artist_slug)
);
CREATE INDEX IF NOT EXISTS production_sculpts_owner ON production_sculpts(issuer_user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS production_editions (
 id TEXT PRIMARY KEY,
 sculpt_id TEXT NOT NULL REFERENCES production_sculpts(id),
 edition_label TEXT NOT NULL,
 edition_kind TEXT NOT NULL CHECK(edition_kind IN ('limited','open')),
 initially_declared_quantity INTEGER,
 current_declared_quantity INTEGER,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 CHECK ((edition_kind='open' AND initially_declared_quantity IS NULL AND current_declared_quantity IS NULL)
 OR (edition_kind='limited' AND initially_declared_quantity BETWEEN 1 AND 50000 AND current_declared_quantity>=initially_declared_quantity)),
 UNIQUE(sculpt_id,edition_label)
);
CREATE INDEX IF NOT EXISTS production_editions_sculpt ON production_editions(sculpt_id);
CREATE TABLE IF NOT EXISTS production_runs (
 id TEXT PRIMARY KEY,
 edition_id TEXT NOT NULL REFERENCES production_editions(id),
 run_number INTEGER NOT NULL CHECK(run_number>=1),
 quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 5000),
 serial_start INTEGER NOT NULL CHECK(serial_start>=1),
 status TEXT NOT NULL DEFAULT 'pending'
   CHECK(status IN ('pending','approved','rejected','generating','ready','archived')),
 generated_count INTEGER NOT NULL DEFAULT 0 CHECK(generated_count>=0),
 change_acknowledged INTEGER NOT NULL DEFAULT 0 CHECK(change_acknowledged IN (0,1)),
 review_note TEXT,
 submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
 reviewed_at TEXT,
 reviewed_by TEXT REFERENCES users(id),
 started_at TEXT,
 completed_at TEXT,
 export_expires_at TEXT,
 export_archived_at TEXT,
 UNIQUE(edition_id,run_number),UNIQUE(edition_id,serial_start)
);
CREATE INDEX IF NOT EXISTS production_runs_edition ON production_runs(edition_id,run_number DESC);
CREATE INDEX IF NOT EXISTS production_runs_review ON production_runs(status,submitted_at);
CREATE TABLE IF NOT EXISTS production_codes (
 id TEXT PRIMARY KEY,
 run_id TEXT NOT NULL REFERENCES production_runs(id),
 serial_number INTEGER NOT NULL,
 code_hash TEXT NOT NULL UNIQUE,
 hint TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'active' CHECK(state IN ('active','revoked')),
 lookup_count INTEGER NOT NULL DEFAULT 0 CHECK(lookup_count>=0),
 first_checked_at TEXT,
 last_checked_at TEXT,
 revoked_at TEXT,
 revoked_by TEXT REFERENCES users(id),
 revocation_reason TEXT,
 issued_at TEXT NOT NULL DEFAULT (datetime('now')),
 UNIQUE(run_id,serial_number)
);
CREATE INDEX IF NOT EXISTS production_codes_run ON production_codes(run_id,serial_number);
CREATE TABLE IF NOT EXISTS production_code_lookups (
 id TEXT PRIMARY KEY,
 code_id TEXT NOT NULL REFERENCES production_codes(id) ON DELETE CASCADE,
 checked_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS production_code_lookups_code ON production_code_lookups(code_id,checked_at DESC);

-- Each committed code chunk has a single encrypted export object.
-- No plain certificate code is stored here. A separate Cloudflare secret
-- CERTIFICATE_EXPORT_KEY (32 random bytes, base64) protects its ciphertext.
CREATE TABLE IF NOT EXISTS production_export_chunks (
 run_id TEXT NOT NULL REFERENCES production_runs(id),
 chunk_start INTEGER NOT NULL,
 item_count INTEGER NOT NULL CHECK(item_count BETWEEN 1 AND 100),
 encryption_iv TEXT NOT NULL,
 encrypted_data TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(run_id,chunk_start)
);
CREATE TABLE IF NOT EXISTS production_export_sessions (
 token_hash TEXT PRIMARY KEY,
 run_id TEXT NOT NULL REFERENCES production_runs(id),
 user_id TEXT NOT NULL REFERENCES users(id),
 expires_at TEXT NOT NULL DEFAULT (datetime('now','+45 minutes')),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS production_export_sessions_run ON production_export_sessions(run_id,user_id);
CREATE TABLE IF NOT EXISTS production_audit (
 id TEXT PRIMARY KEY,
 sculpt_id TEXT,
 edition_id TEXT,
 run_id TEXT,
 actor_id TEXT NOT NULL REFERENCES users(id),
 action TEXT NOT NULL,
 old_value TEXT,
 new_value TEXT,
 note TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS production_audit_recent ON production_audit(created_at DESC);

-- Requests for correcting previously-issued sculpt information or linking
-- to an existing editorially researched public kit page. Nothing auto-publishes.
CREATE TABLE IF NOT EXISTS production_corrections (
 id TEXT PRIMARY KEY,
 sculpt_id TEXT NOT NULL REFERENCES production_sculpts(id),
 proposed_name TEXT NOT NULL,
 proposed_official_url TEXT,
 justification TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','approved','rejected')),
 reviewed_by TEXT REFERENCES users(id),
 review_note TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS production_corrections_state ON production_corrections(state,created_at);
CREATE TABLE IF NOT EXISTS production_link_proposals (
 id TEXT PRIMARY KEY,
 sculpt_id TEXT NOT NULL REFERENCES production_sculpts(id),
 proposed_kit_slug TEXT NOT NULL,
 source_note TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','linked','rejected')),
 reviewed_by TEXT REFERENCES users(id),
 review_note TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS production_link_proposals_state ON production_link_proposals(state,created_at);
