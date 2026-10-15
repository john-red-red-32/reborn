-- Reborna original-sculpt certificate-code pilot · 2026-10-15
-- Optional $1/code future pricing: current issuance is free; each batch stores
-- its actual immutable amount (0 USD during the free pilot).
-- These are issuance records, NEVER proof a physical kit is genuine.
-- Apply to PREVIEW and PRODUCTION D1 before deploying API handlers.
CREATE TABLE IF NOT EXISTS verified_sculptor_issuers (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL UNIQUE,
  artist_name TEXT NOT NULL,
  official_source_url TEXT NOT NULL,
  claim_request_id TEXT NOT NULL REFERENCES sculptor_requests(id),
  authorised_by TEXT NOT NULL REFERENCES users(id),
  authorisation_note TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'active' CHECK(state IN ('active','suspended')),
  authorised_at TEXT NOT NULL DEFAULT (datetime('now')),
  suspended_at TEXT,
  PRIMARY KEY(user_id,artist_slug)
);
CREATE INDEX IF NOT EXISTS verified_sculptor_issuers_state
 ON verified_sculptor_issuers(state,artist_slug);

CREATE TABLE IF NOT EXISTS certificate_batches (
  id TEXT PRIMARY KEY,
  issuer_user_id TEXT NOT NULL,
  artist_slug TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  sculpt_name TEXT NOT NULL,
  edition_note TEXT NOT NULL DEFAULT '',
  official_sculpt_url TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 25),
  price_per_code_minor INTEGER NOT NULL DEFAULT 0 CHECK(price_per_code_minor>=0),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK(currency='USD'),
  issued_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(issuer_user_id,artist_slug) REFERENCES verified_sculptor_issuers(user_id,artist_slug)
);
CREATE INDEX IF NOT EXISTS certificate_batches_issuer ON certificate_batches(issuer_user_id,issued_at DESC);

CREATE TABLE IF NOT EXISTS certificate_codes (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL REFERENCES certificate_batches(id),
  code_hash TEXT NOT NULL UNIQUE,
  hint TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'active' CHECK(state IN ('active','revoked')),
  lookup_count INTEGER NOT NULL DEFAULT 0 CHECK(lookup_count>=0),
  first_checked_at TEXT,
  last_checked_at TEXT,
  revoked_at TEXT,
  revoked_by TEXT REFERENCES users(id),
  revocation_reason TEXT,
  issued_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS certificate_codes_batch ON certificate_codes(batch_id);
CREATE INDEX IF NOT EXISTS certificate_codes_state ON certificate_codes(state,batch_id);

-- No raw code, visitor identity, IP address, device fingerprint or location.
-- The public result shows broad lookup history, not a buyer identity.
CREATE TABLE IF NOT EXISTS certificate_lookup_events (
  id TEXT PRIMARY KEY,
  certificate_id TEXT NOT NULL REFERENCES certificate_codes(id) ON DELETE CASCADE,
  checked_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS certificate_lookup_events_certificate
 ON certificate_lookup_events(certificate_id,checked_at DESC);

-- Durable editorial/issuance changes; cannot be modified by ordinary artists.
CREATE TABLE IF NOT EXISTS certificate_audit (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL CHECK(action IN ('authorise_issuer','suspend_issuer','issue_batch','revoke_code')),
  artist_slug TEXT NOT NULL,
  batch_id TEXT,
  certificate_id TEXT,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS certificate_audit_recent ON certificate_audit(created_at DESC);
