-- Records explicit acceptance of the website Terms and community rules at registration.
-- Privacy information is presented alongside acceptance; consent to marketing stays separate.
CREATE TABLE IF NOT EXISTS member_terms_acceptance (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 terms_version TEXT NOT NULL,
 accepted_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS member_terms_accepted_at ON member_terms_acceptance(accepted_at DESC);
