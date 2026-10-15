-- Certificate code issuance step-up: email approval before secret generation.
-- Additive migration. No certificate codes had been issued at migration time.
-- No emailed plaintext certificate codes, no stored email approval PIN.
CREATE TABLE IF NOT EXISTS certificate_issue_approvals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  approval_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts>=0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL DEFAULT (datetime('now','+10 minutes')),
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS certificate_issue_approvals_owner
 ON certificate_issue_approvals(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS certificate_issue_approvals_expiry
 ON certificate_issue_approvals(expires_at);
