-- Diagnostic counters for failed signup, with no identifying data or submitted form content.
-- Purged after 7 days by routine checks; future cleanup can run with regular scheduled maintenance.
CREATE TABLE IF NOT EXISTS signup_diagnostics (
 id TEXT PRIMARY KEY,
 stage TEXT NOT NULL,
 reason TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS signup_diagnostics_time ON signup_diagnostics(created_at DESC);
